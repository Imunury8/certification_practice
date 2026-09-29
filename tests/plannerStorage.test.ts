import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import vm from "node:vm";
import ts from "typescript";
import * as planner from "../lib/studyPlanner";
import * as syncCodes from "../lib/plannerSyncCode";
import type { useStudyPlanner } from "../app/planner/useStudyPlanner";

const LOCAL = "exam-study-planner:v1";
const CONNECTION = "exam-study-planner:connection:v1";
const CACHE = "exam-study-planner:cloud:v1:";
const CODE = "SP-12345678-90ABCDEF-12345678-90ABCDEF";
const OTHER_CODE = "SP-AAAAAAAA-BBBBBBBB-CCCCCCCC-DDDDDDDD";
const UPDATED_AT = "2026-09-29T00:00:00.000Z";
type HookApi = ReturnType<typeof useStudyPlanner>;
type HookState = Pick<HookApi, "data" | "ready" | "storageError" | "saving" | "syncStatus" | "cloudAvailable" | "syncCode">;
type MockRequest = { url: string; init: RequestInit };
type Handler = (request: MockRequest) => Response | Promise<Response>;

const compiled = ts.transpileModule(readFileSync(join(__dirname, "../app/planner/useStudyPlanner.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function plan(id: string, startTime = "09:00", endTime = "10:00"): planner.StudyPlannerData {
  return planner.createSession(planner.emptyPlannerData(), {
    id, date: "2026-09-29", examId: "infosec-practical", topicId: "design-patterns", startTime, endTime,
  });
}
function snapshot(data: planner.StudyPlannerData, revision = 1) { return { data, revision, updatedAt: UPDATED_AT }; }
function response(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status }); }
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

/** Execute the real hook against isolated browser/React boundaries and the real domain model. */
function browser(t: TestContext, initial: Record<string, string> = {}, configured = true) {
  const storage = new Map(Object.entries(initial));
  const writes: string[] = [];
  const requests: MockRequest[] = [];
  const listeners = new Map<string, (event: { key: string | null }) => void>();
  const timers = new Map<number, () => void>();
  let nextTimer = 0;
  let state!: HookState;
  let effect!: () => (() => void);
  let failureKey: string | null = null;
  let handler: Handler = () => response({ message: "Not found" }, 404);
  const exports: { useStudyPlanner?: () => HookApi } = {};
  vm.runInNewContext(compiled, {
    exports, structuredClone, AbortController, Error, TypeError, Response,
    require(name: string) {
      if (name === "@/lib/studyPlanner") return planner;
      if (name === "@/lib/plannerSyncCode") return syncCodes;
      if (name === "react") return {
        useState(initializer: () => HookState) {
          state = initializer();
          return [state, (next: HookState) => { state = next; }];
        },
        useRef<T>(value: T) { return { current: value }; },
        useCallback<T>(callback: T) { return callback; },
        useEffect(callback: () => (() => void)) { effect = callback; },
      };
      throw new Error(`Unexpected import: ${name}`);
    },
    fetch: async (url: string, init: RequestInit = {}) => {
      const request = { url, init };
      requests.push(request);
      return url === "/api/planner/status" ? response({ configured }) : handler(request);
    },
    window: {
      localStorage: {
        getItem(key: string) { return storage.get(key) ?? null; },
        setItem(key: string, value: string) {
          if (key === failureKey) throw new Error("Storage quota");
          storage.set(key, value); writes.push(key);
        },
        removeItem(key: string) { if (key === failureKey) throw new Error("Storage blocked"); storage.delete(key); },
      },
      addEventListener(type: string, callback: (event: { key: string | null }) => void) { listeners.set(type, callback); },
      removeEventListener(type: string) { listeners.delete(type); },
      setTimeout(callback: () => void) { timers.set(++nextTimer, callback); return nextTimer; },
      clearTimeout(id: number) { timers.delete(id); },
      setInterval() { return 1; }, clearInterval() {},
    },
    document: { visibilityState: "visible", addEventListener() {}, removeEventListener() {} },
  });
  const hook = exports.useStudyPlanner!();
  const cleanup = effect();
  t.after(cleanup);
  return {
    hook, storage, writes, requests, state: () => state,
    handle(fn: Handler) { handler = fn; },
    failStorage(key: string) { failureKey = key; },
    event(key: string | null) { listeners.get("storage")?.({ key }); },
    expireRequests() { for (const callback of [...timers.values()]) callback(); },
    cloudRequests() { return requests.filter((request) => request.url === "/api/planner"); },
  };
}

test("local mode saves without a configured cloud and never overwrites corrupt records", async (t) => {
  const original = JSON.stringify(plan("local"));
  const b = browser(t, { [LOCAL]: original }, false);
  await b.hook.reload();
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.equal(b.state().cloudAvailable, false);
  assert.equal(await b.hook.createCloud(), false);
  assert.equal(b.cloudRequests().length, 0);
  assert.equal(await b.hook.commit((data) => planner.deleteSession(data, "local")), true);
  b.storage.set(LOCAL, "{broken");
  assert.equal(await b.hook.commit((data) => data), false);
  assert.equal(b.state().ready, false);
  assert.equal(b.storage.get(LOCAL), "{broken");
});

test("cloud creation re-reads existing local records and preserves their exact backup", async (t) => {
  const b = browser(t, { [LOCAL]: JSON.stringify(plan("earlier")) });
  await b.hook.reload();
  const original = JSON.stringify(plan("latest-local"));
  b.storage.set(LOCAL, original);
  b.handle(({ init }) => {
    assert.equal(init.method, "POST");
    const body = JSON.parse(String(init.body));
    assert.equal(body.data.sessions[0].id, "latest-local");
    return response({ code: CODE, ...snapshot(body.data) }, 201);
  });
  assert.equal(await b.hook.createCloud(), true);
  assert.equal(b.state().syncStatus, "synced");
  assert.equal(b.state().syncCode, CODE);
  assert.equal(b.storage.get(LOCAL), original);
  assert.equal(b.storage.get(CONNECTION), CODE);
  assert.ok(b.storage.has(`${CACHE}${CODE}`));
  assert.equal(b.writes.includes(LOCAL), false);
});

test("connecting, editing and disconnecting never change original local records", async (t) => {
  const original = JSON.stringify(plan("local-backup"));
  const cloud = plan("cloud");
  const b = browser(t, { [LOCAL]: original });
  await b.hook.reload();
  b.handle(({ url, init }) => {
    assert.equal(url.includes(CODE), false);
    assert.equal((init.headers as Record<string, string>).Authorization, `Bearer ${CODE}`);
    if (init.method === "PUT") {
      const body = JSON.parse(String(init.body));
      assert.equal(body.revision, 1);
      return response(snapshot(body.data, 2));
    }
    return response(snapshot(cloud));
  });
  assert.equal(await b.hook.connect(` ${CODE.toLowerCase()} `), true);
  assert.equal(b.state().data.sessions[0].id, "cloud");
  assert.equal(await b.hook.commit((data) => planner.deleteSession(data, "cloud")), true);
  assert.equal(b.state().data.sessions.length, 0);
  assert.equal(b.storage.get(LOCAL), original);
  b.hook.disconnect();
  assert.equal(b.state().syncStatus, "local");
  assert.equal(b.state().data.sessions[0].id, "local-backup");
  assert.equal(b.storage.has(CONNECTION), false);
  assert.equal(b.writes.includes(LOCAL), false);
});

test("a newer remote revision refreshes the view before any stale updater can run", async (t) => {
  const b = browser(t);
  await b.hook.reload();
  b.handle(() => response(snapshot(plan("original"))));
  await b.hook.connect(CODE);
  b.handle(() => response(snapshot(plan("another-pc"), 2)));
  let applied = false;
  assert.equal(await b.hook.commit((data) => { applied = true; return data; }), false);
  assert.equal(applied, false);
  assert.equal(b.state().data.sessions[0].id, "another-pc");
  assert.match(b.state().storageError!, /다른 기기/);
  assert.equal(b.cloudRequests().some(({ init }) => init.method === "PUT"), false);
});

test("a write conflict refreshes once and never retries or publishes the rejected data", async (t) => {
  const b = browser(t);
  await b.hook.reload();
  b.handle(() => response(snapshot(plan("original"))));
  await b.hook.connect(CODE);
  let conflicted = false;
  b.handle(({ init }) => {
    if (init.method === "PUT") {
      conflicted = true;
      return response({ error: "revision_conflict", message: "conflict" }, 409);
    }
    return response(snapshot(plan(conflicted ? "winner" : "original"), conflicted ? 2 : 1));
  });
  assert.equal(await b.hook.commit((data) => planner.deleteSession(data, "original")), false);
  assert.equal(b.state().data.sessions[0].id, "winner");
  assert.equal(b.state().ready, true);
  assert.equal(b.state().saving, false);
  assert.match(b.state().storageError!, /다른 기기/);
  assert.equal(b.cloudRequests().filter(({ init }) => init.method === "PUT").length, 1);
});

test("offline startup shows only the connected cache, blocks edits and recovers on reload", async (t) => {
  const cached = plan("cached-cloud");
  const original = JSON.stringify(plan("separate-local"));
  const b = browser(t, {
    [LOCAL]: original, [CONNECTION]: CODE,
    [`${CACHE}${CODE}`]: JSON.stringify({ code: CODE, ...snapshot(cached) }),
  });
  await b.hook.reload();
  assert.equal(b.state().syncStatus, "offline");
  assert.equal(b.state().ready, false);
  assert.equal(b.state().data.sessions[0].id, "cached-cloud");
  let applied = false;
  assert.equal(await b.hook.commit((data) => { applied = true; return data; }), false);
  assert.equal(applied, false);
  assert.equal(b.storage.get(LOCAL), original);
  b.handle(() => response(snapshot(plan("back-online"), 2)));
  await b.hook.reload();
  assert.equal(b.state().ready, true);
  assert.equal(b.state().syncStatus, "synced");
  assert.equal(b.state().data.sessions[0].id, "back-online");
});

test("a failed cloud save keeps the last server snapshot read-only and clears saving", async (t) => {
  const b = browser(t, { [LOCAL]: JSON.stringify(plan("local")) });
  await b.hook.reload();
  b.handle(() => response(snapshot(plan("cloud"))));
  await b.hook.connect(CODE);
  b.handle(({ init }) => {
    if (init.method === "PUT") throw new TypeError("network unavailable");
    return response(snapshot(plan("cloud")));
  });
  assert.equal(await b.hook.commit((data) => { data.sessions.length = 0; return data; }), false);
  assert.equal(b.state().data.sessions[0].id, "cloud");
  assert.equal(b.state().ready, false);
  assert.equal(b.state().saving, false);
  assert.equal(b.state().syncStatus, "offline");
  assert.equal(JSON.parse(b.storage.get(`${CACHE}${CODE}`)!).data.sessions[0].id, "cloud");
});

test("disconnect ignores a stale in-flight response even if a transport ignores abort", async (t) => {
  const b = browser(t, { [LOCAL]: JSON.stringify(plan("local")) });
  await b.hook.reload();
  const pending = deferred<Response>();
  b.handle(() => pending.promise);
  const connection = b.hook.connect(CODE);
  assert.equal(b.state().saving, true);
  b.hook.disconnect();
  pending.resolve(response(snapshot(plan("stale-cloud"))));
  assert.equal(await connection, false);
  assert.equal(b.state().syncCode, null);
  assert.equal(b.state().data.sessions[0].id, "local");
  assert.equal(b.state().saving, false);
  assert.equal(b.storage.has(CONNECTION), false);
});

test("another tab switching codes cancels a pending edit and loads the new code only", async (t) => {
  const b = browser(t);
  await b.hook.reload();
  b.handle(() => response(snapshot(plan("old-cloud"))));
  await b.hook.connect(CODE);
  const pending = deferred<Response>();
  b.handle(({ init }) => (init.headers as Record<string, string>).Authorization === `Bearer ${CODE}`
    ? pending.promise : response(snapshot(plan("new-cloud"))));
  let applied = false;
  const save = b.hook.commit((data) => { applied = true; return data; });
  b.storage.set(CONNECTION, OTHER_CODE);
  b.event(CONNECTION);
  await b.hook.reload();
  pending.resolve(response(snapshot(plan("old-cloud"))));
  assert.equal(await save, false);
  assert.equal(applied, false);
  assert.equal(b.state().syncCode, OTHER_CODE);
  assert.equal(b.state().data.sessions[0].id, "new-cloud");
  assert.equal(b.state().saving, false);
});

test("requests time out, concurrent actions are serialized, and reload does not interrupt saves", async (t) => {
  const b = browser(t);
  await b.hook.reload();
  b.handle(({ init }) => new Promise((_resolve, reject) => {
    init.signal!.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
  }));
  const connection = b.hook.connect(CODE);
  assert.equal(await b.hook.connect(OTHER_CODE), false);
  await b.hook.reload();
  assert.equal(b.cloudRequests().length, 1);
  b.expireRequests();
  assert.equal(await connection, false);
  assert.equal(b.state().saving, false);
  assert.match(b.state().storageError!, /시간이 초과/);
  assert.equal(b.state().syncCode, null);
});

test("successful cloud creation retains the code visibly when browser persistence fails", async (t) => {
  const original = JSON.stringify(plan("local"));
  const b = browser(t, { [LOCAL]: original });
  await b.hook.reload();
  b.failStorage(CONNECTION);
  b.handle(() => response({ code: CODE, ...snapshot(plan("local")) }, 201));
  assert.equal(await b.hook.createCloud(), true);
  assert.equal(b.state().syncCode, CODE);
  assert.equal(b.state().ready, true);
  assert.match(b.state().storageError!, /코드를 복사/);
  assert.equal(b.storage.get(LOCAL), original);
});
