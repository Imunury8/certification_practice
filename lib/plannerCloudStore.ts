import { createHash, randomBytes } from "node:crypto";
import { normalizeSyncCode } from "./plannerSyncCode";
import { parsePlannerData, type StudyPlannerData } from "./studyPlanner";

export interface PlannerCloudSnapshot {
  data: StudyPlannerData;
  revision: number;
  updatedAt: string;
}

export class PlannerCloudError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) {
    super(message);
    this.name = "PlannerCloudError";
  }
}

interface RedisConfiguration {
  url: string;
  token: string;
}

function redisConfiguration(): RedisConfiguration | null {
  const candidates = [
    [process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN],
    [process.env.KV_REST_API_URL, process.env.KV_REST_API_TOKEN],
  ];
  for (const [rawUrl, rawToken] of candidates) {
    if (!rawUrl?.trim() || !rawToken?.trim()) continue;
    try {
      const url = new URL(rawUrl.trim());
      if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) continue;
      return { url: url.toString().replace(/\/+$/, ""), token: rawToken.trim() };
    } catch {
      // Configuration details, including credentials, must never reach the browser.
    }
  }
  return null;
}

export function isPlannerCloudConfigured(): boolean {
  return redisConfiguration() !== null;
}

function unavailable(): PlannerCloudError {
  return new PlannerCloudError(503, "cloud_unavailable", "서버 저장소에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
}

async function redisCommand(command: Array<string | number>): Promise<unknown> {
  const configuration = redisConfiguration();
  if (!configuration) {
    throw new PlannerCloudError(503, "cloud_not_configured", "서버 저장소가 아직 설정되지 않았습니다.");
  }
  try {
    const response = await fetch(configuration.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${configuration.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(command),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw unavailable();
    const envelope: unknown = await response.json();
    if (!isRecord(envelope) || !Object.prototype.hasOwnProperty.call(envelope, "result") || envelope.error) throw unavailable();
    return envelope.result;
  } catch {
    throw unavailable();
  }
}

export function plannerCloudKey(code: string): string {
  const normalized = normalizeSyncCode(code);
  if (!normalized) throw new PlannerCloudError(401, "invalid_code", "올바른 동기화 코드를 입력해 주세요.");
  return `study-planner:v1:${createHash("sha256").update(normalized).digest("hex")}`;
}

function newSyncCode(): string {
  const hex = randomBytes(16).toString("hex").toUpperCase();
  return `SP-${hex.match(/.{8}/g)!.join("-")}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseSnapshot(value: unknown): PlannerCloudSnapshot {
  try {
    if (typeof value !== "string") throw unavailable();
    const raw: unknown = JSON.parse(value);
    if (!isRecord(raw) || !Number.isSafeInteger(raw.revision) || (raw.revision as number) < 1 ||
      typeof raw.updatedAt !== "string" || !Number.isFinite(Date.parse(raw.updatedAt))) throw unavailable();
    return { data: parsePlannerData(raw.data), revision: raw.revision as number, updatedAt: raw.updatedAt };
  } catch {
    throw unavailable();
  }
}

export async function readPlannerCloud(code: string): Promise<PlannerCloudSnapshot | null> {
  const value = await redisCommand(["GET", plannerCloudKey(code)]);
  return value === null ? null : parseSnapshot(value);
}

export async function createPlannerCloud(data: StudyPlannerData): Promise<PlannerCloudSnapshot & { code: string }> {
  const snapshot: PlannerCloudSnapshot = { data: parsePlannerData(data), revision: 1, updatedAt: new Date().toISOString() };
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = newSyncCode();
    const result = await redisCommand(["SET", plannerCloudKey(code), JSON.stringify(snapshot), "NX"]);
    if (result === "OK") return { code, ...snapshot };
    if (result !== null) throw unavailable();
  }
  throw unavailable();
}

// Read, revision comparison, and write happen in a single atomic Redis operation.
const COMPARE_AND_SET = `
local current = redis.call('GET', KEYS[1])
if not current then return 0 end
local ok, snapshot = pcall(cjson.decode, current)
if not ok or type(snapshot) ~= 'table' or type(snapshot.revision) ~= 'number' then return -2 end
if snapshot.revision ~= tonumber(ARGV[1]) then return -1 end
redis.call('SET', KEYS[1], ARGV[2])
return 1
`;

export async function updatePlannerCloud(code: string, data: StudyPlannerData, revision: number): Promise<PlannerCloudSnapshot> {
  if (!Number.isSafeInteger(revision) || revision < 1 || revision >= Number.MAX_SAFE_INTEGER) {
    throw new PlannerCloudError(400, "invalid_revision", "저장 버전이 올바르지 않습니다. 서버 계획을 다시 불러와 주세요.");
  }
  const snapshot: PlannerCloudSnapshot = { data: parsePlannerData(data), revision: revision + 1, updatedAt: new Date().toISOString() };
  const result = await redisCommand(["EVAL", COMPARE_AND_SET, 1, plannerCloudKey(code), String(revision), JSON.stringify(snapshot)]);
  if (result === 0) throw new PlannerCloudError(404, "plan_not_found", "동기화 코드에 해당하는 공부 계획을 찾을 수 없습니다.");
  if (result === -1) throw new PlannerCloudError(409, "revision_conflict", "다른 기기에서 계획을 변경했습니다. 서버의 최신 계획을 불러온 뒤 다시 시도해 주세요.");
  if (result !== 1) throw unavailable();
  return snapshot;
}
