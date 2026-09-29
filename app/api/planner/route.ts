import {
  createPlannerCloud, PlannerCloudError, readPlannerCloud, updatePlannerCloud,
} from "../../../lib/plannerCloudStore";
import { normalizeSyncCode } from "../../../lib/plannerSyncCode";
import { parsePlannerData, type StudyPlannerData } from "../../../lib/studyPlanner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 1024 * 1024;
const RESPONSE_HEADERS = { "Cache-Control": "no-store", Vary: "Authorization", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff" };

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: RESPONSE_HEADERS });
}

function errorResponse(error: unknown): Response {
  if (error instanceof PlannerCloudError) return json({ error: error.code, message: error.message }, error.status);
  return json({ error: "cloud_unavailable", message: "서버 저장소에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요." }, 503);
}

function codeFromRequest(request: Request): string {
  const header = request.headers.get("authorization");
  const match = header?.match(/^Bearer\s+(\S+)\s*$/i);
  const code = match ? normalizeSyncCode(match[1]) : null;
  if (!code) throw new PlannerCloudError(401, "invalid_code", "올바른 동기화 코드를 입력해 주세요.");
  return code;
}

function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (origin !== null && origin !== new URL(request.url).origin) {
    throw new PlannerCloudError(403, "origin_not_allowed", "이 사이트에서 요청을 다시 시도해 주세요.");
  }
}

function tooLarge(): PlannerCloudError {
  return new PlannerCloudError(413, "body_too_large", "공부 계획의 크기가 저장 한도를 초과했습니다.");
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.toLowerCase().split(";")[0].trim() !== "application/json") {
    throw new PlannerCloudError(415, "invalid_content_type", "JSON 형식의 요청이 필요합니다.");
  }
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    if (!/^\d+$/.test(contentLength)) throw new PlannerCloudError(400, "invalid_body", "요청 형식이 올바르지 않습니다.");
    if (Number(contentLength) > MAX_BODY_BYTES) throw tooLarge();
  }
  if (!request.body) throw new PlannerCloudError(400, "invalid_body", "공부 계획을 입력해 주세요.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => undefined);
        throw tooLarge();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const body: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (typeof body !== "object" || body === null || Array.isArray(body)) throw new Error();
    return body as Record<string, unknown>;
  } catch {
    throw new PlannerCloudError(400, "invalid_body", "요청 형식이 올바르지 않습니다.");
  }
}

function validatedData(raw: unknown): StudyPlannerData {
  try { return parsePlannerData(raw); }
  catch { throw new PlannerCloudError(400, "invalid_plan", "공부 계획의 형식이 올바르지 않습니다."); }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const snapshot = await readPlannerCloud(codeFromRequest(request));
    if (!snapshot) return json({ error: "plan_not_found", message: "동기화 코드에 해당하는 공부 계획을 찾을 수 없습니다." }, 404);
    return json(snapshot);
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const body = await readBody(request);
    return json(await createPlannerCloud(validatedData(body.data)), 201);
  } catch (error) { return errorResponse(error); }
}

export async function PUT(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const code = codeFromRequest(request);
    const body = await readBody(request);
    if (!Number.isSafeInteger(body.revision) || (body.revision as number) < 1 || (body.revision as number) >= Number.MAX_SAFE_INTEGER) {
      throw new PlannerCloudError(400, "invalid_revision", "저장 버전이 올바르지 않습니다. 서버 계획을 다시 불러와 주세요.");
    }
    return json(await updatePlannerCloud(code, validatedData(body.data), body.revision as number));
  } catch (error) { return errorResponse(error); }
}
