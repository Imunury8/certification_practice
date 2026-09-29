import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { GET, POST, PUT } from "../app/api/planner/route";
import { GET as statusGET } from "../app/api/planner/status/route";
import { isPlannerCloudConfigured, plannerCloudKey } from "../lib/plannerCloudStore";
import { normalizeSyncCode } from "../lib/plannerSyncCode";
import { createSession, emptyPlannerData } from "../lib/studyPlanner";

const APP_URL = "https://planner.example.test/api/planner";
const REDIS_URL = "https://redis.example.test";
const CODE = "SP-12345678-90ABCDEF-12345678-90ABCDEF";
const SECRET = "server-only-redis-token";
const ENV_KEYS = ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_URL", "KV_REST_API_TOKEN"] as const;
let savedFetch: typeof fetch;
let savedEnvironment: Record<string, string | undefined>;
let redis: Map<string, string>;
let commands: Array<Array<string | number>>;
let requests: Array<{ url: string; init?: RequestInit }>;

beforeEach(() => {
  savedFetch = globalThis.fetch;
  savedEnvironment = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
  for (const key of ENV_KEYS) delete process.env[key];
  process.env.UPSTASH_REDIS_REST_URL = REDIS_URL;
  process.env.UPSTASH_REDIS_REST_TOKEN = SECRET;
  redis = new Map();
  commands = [];
  requests = [];
  globalThis.fetch = async (input, init) => {
    requests.push({ url: String(input), init });
    const command = JSON.parse(String(init?.body)) as Array<string | number>;
    commands.push(command);
    const operation = command[0];
    let result: unknown;
    if (operation === "GET") result = redis.get(String(command[1])) ?? null;
    else if (operation === "SET") {
      assert.equal(command[3], "NX");
      const key = String(command[1]);
      result = redis.has(key) ? null : "OK";
      if (result === "OK") redis.set(key, String(command[2]));
    } else if (operation === "EVAL") {
      assert.equal(command[2], 1);
      assert.match(String(command[1]), /redis\.call\('GET'/);
      assert.match(String(command[1]), /redis\.call\('SET'/);
      const key = String(command[3]);
      const current = redis.get(key);
      if (!current) result = 0;
      else {
        const parsed = JSON.parse(current) as { revision: number };
        if (parsed.revision !== Number(command[4])) result = -1;
        else { redis.set(key, String(command[5])); result = 1; }
      }
    } else throw new Error(`Unexpected Redis command: ${operation}`);
    return Response.json({ result });
  };
});

afterEach(() => {
  globalThis.fetch = savedFetch;
  for (const key of ENV_KEYS) {
    const value = savedEnvironment[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function request(method: string, body?: unknown, code?: string, headers: Record<string, string> = {}): Request {
  return new Request(APP_URL, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(code ? { Authorization: `Bearer ${code}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

async function create() {
  const response = await POST(request("POST", { data: emptyPlannerData() }, undefined, { Origin: new URL(APP_URL).origin }));
  assert.equal(response.status, 201);
  return await response.json() as { code: string; data: ReturnType<typeof emptyPlannerData>; revision: number; updatedAt: string };
}

test("cloud status uses configuration only and supports Vercel KV fallback without exposing credentials", async () => {
  assert.deepEqual(await statusGET().json(), { configured: true });
  assert.equal(statusGET().headers.get("cache-control"), "no-store");
  assert.equal(requests.length, 0);
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  assert.equal(isPlannerCloudConfigured(), false);
  process.env.KV_REST_API_URL = REDIS_URL;
  process.env.KV_REST_API_TOKEN = SECRET;
  assert.equal(isPlannerCloudConfigured(), true);
  await create();
  assert.equal(requests[0].url, REDIS_URL);
  assert.equal(new Headers(requests[0].init?.headers).get("authorization"), `Bearer ${SECRET}`);
  process.env.KV_REST_API_URL = "http://insecure.example.test";
  assert.equal(isPlannerCloudConfigured(), false);
});

test("creating and reading a cloud plan uses an unguessable bearer code and a hashed Redis key", async () => {
  const created = await create();
  assert.match(created.code, /^SP-[A-F0-9]{8}(?:-[A-F0-9]{8}){3}$/);
  assert.equal(created.revision, 1);
  assert.equal(new Date(created.updatedAt).toISOString(), created.updatedAt);
  const key = [...redis.keys()][0];
  assert.match(key, /^study-planner:v1:[a-f0-9]{64}$/);
  assert.equal(key.includes(created.code), false);
  assert.equal(key, plannerCloudKey(created.code.toLowerCase()));
  assert.equal(commands[0][0], "SET");
  assert.equal(commands[0][3], "NX");
  assert.equal(requests[0].init?.cache, "no-store");
  assert.equal(requests[0].init?.redirect, "error");
  assert.equal(requests[0].url.includes(SECRET), false);
  assert.equal(JSON.stringify(commands).includes(created.code), false);
  const response = await GET(request("GET", undefined, created.code.toLowerCase()));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("access-control-allow-origin"), null);
  const { code: _code, ...snapshot } = created;
  void _code;
  assert.deepEqual(await response.json(), snapshot);
});

test("simultaneous stale updates use one atomic EVAL, preserve the first write, and return 409 for the other", async () => {
  const created = await create();
  const first = createSession(created.data, { id: "first", date: "2026-01-01", examId: "sqlp", startTime: "09:00", endTime: "10:00" });
  const second = createSession(created.data, { id: "second", date: "2026-01-02", examId: "sqlp", startTime: "09:00", endTime: "10:00" });
  commands.length = 0;
  const responses = await Promise.all([
    PUT(request("PUT", { data: first, revision: 1 }, created.code)),
    PUT(request("PUT", { data: second, revision: 1 }, created.code)),
  ]);
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 409]);
  assert.deepEqual(commands.map((command) => command[0]), ["EVAL", "EVAL"]);
  const conflict = responses.find((response) => response.status === 409)!;
  assert.equal((await conflict.json()).error, "revision_conflict");
  const saved = await (await GET(request("GET", undefined, created.code))).json();
  assert.equal(saved.revision, 2);
  assert.deepEqual(saved.data, first);
  const successful = await PUT(request("PUT", { data: second, revision: 2 }, created.code));
  assert.equal(successful.status, 200);
  assert.equal((await successful.json()).revision, 3);
});

test("unknown plans return 404 and invalid or URL-only authentication is rejected before contacting Redis", async () => {
  assert.equal((await GET(request("GET", undefined, CODE))).status, 404);
  assert.equal((await PUT(request("PUT", { data: emptyPlannerData(), revision: 1 }, CODE))).status, 404);
  const count = commands.length;
  for (const auth of [undefined, "invalid", "Bearer", "SP-00000000"]) {
    const response = await GET(request("GET", undefined, auth));
    assert.equal(response.status, 401);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  assert.equal((await GET(new Request(`${APP_URL}?code=${CODE}`))).status, 401);
  assert.equal((await PUT(request("PUT", { data: emptyPlannerData(), revision: 1 }))).status, 401);
  assert.equal(commands.length, count);
  assert.equal(normalizeSyncCode(` ${CODE.toLowerCase()} `), CODE);
  assert.equal(normalizeSyncCode(`${CODE}/extra`), null);
});

test("cross-origin writes are rejected and local-origin or Origin-free requests are allowed", async () => {
  const body = { data: emptyPlannerData(), revision: 1 };
  for (const origin of ["https://evil.example.test", "null", `${new URL(APP_URL).origin}.evil.example.test`]) {
    assert.equal((await POST(request("POST", body, undefined, { Origin: origin }))).status, 403);
    assert.equal((await PUT(request("PUT", body, CODE, { Origin: origin }))).status, 403);
  }
  assert.equal(commands.length, 0);
  assert.equal((await POST(request("POST", body))).status, 201);
  assert.equal((await POST(request("POST", body, undefined, { Origin: new URL(APP_URL).origin }))).status, 201);
});

test("request validation rejects invalid JSON, corrupt plans, invalid revisions, and non-JSON media types", async () => {
  assert.equal((await POST(new Request(APP_URL, { method: "POST", body: "{", headers: { "Content-Type": "application/json" } }))).status, 400);
  assert.equal((await POST(request("POST", { data: { version: 1 } }))).status, 400);
  assert.equal((await POST(request("POST", [], undefined))).status, 400);
  assert.equal((await POST(request("POST", { data: emptyPlannerData() }, undefined, { "Content-Type": "text/plain" }))).status, 415);
  for (const revision of [null, "1", 0, -1, 1.5, Number.MAX_SAFE_INTEGER]) {
    assert.equal((await PUT(request("PUT", { data: emptyPlannerData(), revision }, CODE))).status, 400);
  }
  assert.equal(commands.length, 0);
});

test("request body limit checks declared length and actual UTF-8 bytes, including chunked bodies", async () => {
  assert.equal((await POST(request("POST", { data: emptyPlannerData() }, undefined, { "Content-Length": String(1024 * 1024 + 1) }))).status, 413);
  assert.equal((await POST(request("POST", { padding: "한".repeat(400000) }, undefined, { "Content-Length": "1" }))).status, 413);
  let cancelled = false;
  const body = new ReadableStream<Uint8Array>({
    start(controller) { controller.enqueue(new Uint8Array(1024 * 1024)); controller.enqueue(new Uint8Array(1)); },
    cancel() { cancelled = true; },
  });
  const init = { method: "POST", body, headers: { "Content-Type": "application/json" }, duplex: "half" } as RequestInit;
  assert.equal((await POST(new Request(APP_URL, init))).status, 413);
  assert.equal(cancelled, true);
  assert.equal(commands.length, 0);
});

test("missing configuration and backend failures return generic 503 responses without secret disclosure", async () => {
  for (const key of ENV_KEYS) delete process.env[key];
  const absent = await POST(request("POST", { data: emptyPlannerData() }));
  assert.equal(absent.status, 503);
  assert.equal((await absent.json()).error, "cloud_not_configured");
  assert.equal(commands.length, 0);
  process.env.UPSTASH_REDIS_REST_URL = REDIS_URL;
  process.env.UPSTASH_REDIS_REST_TOKEN = SECRET;
  const failures: Array<typeof fetch> = [
    async () => { throw new Error(`Network failure containing ${SECRET}`); },
    async () => new Response(SECRET, { status: 500 }),
    async () => Response.json({ error: `Authentication error ${SECRET}`, result: null }),
    async () => Response.json({ unexpected: SECRET }),
    async () => Response.json({ result: "corrupt storage" }),
  ];
  for (const fetchFailure of failures) {
    globalThis.fetch = fetchFailure;
    const response = await GET(request("GET", undefined, CODE));
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const content = await response.text();
    assert.equal(content.includes(SECRET), false);
    assert.equal(content.includes(REDIS_URL), false);
    assert.equal(content.includes(CODE), false);
  }
});
