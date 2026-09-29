"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { emptyPlannerData, parsePlannerData, type StudyPlannerData } from "@/lib/studyPlanner";
import { normalizeSyncCode } from "@/lib/plannerSyncCode";

const LOCAL_KEY = "exam-study-planner:v1";
const CONNECTION_KEY = "exam-study-planner:connection:v1";
const CACHE_PREFIX = "exam-study-planner:cloud:v1:";
const LOAD_ERROR = "저장된 공부 계획을 불러오지 못했습니다. 기존 데이터는 덮어쓰지 않았습니다. 다시 불러오기를 눌러 주세요.";
const UNAVAILABLE_ERROR = "아직 서버의 동기화 저장소가 설정되지 않았습니다. 현재 브라우저에서는 계속 공부 계획을 사용할 수 있어요.";
const CONFLICT_ERROR = "다른 기기에서 계획이 변경되어 최신 기록을 불러왔습니다. 입력 내용을 확인하고 다시 저장해 주세요.";
const CONNECTION_ERROR = "클라우드에는 저장했지만 이 브라우저에 동기화 코드를 보관하지 못했습니다. 페이지를 닫기 전에 코드를 복사해 주세요.";

type SyncStatus = "local" | "connecting" | "synced" | "offline";
type PlannerState = {
  data: StudyPlannerData;
  ready: boolean;
  storageError: string | null;
  saving: boolean;
  syncStatus: SyncStatus;
  cloudAvailable: boolean | null;
  syncCode: string | null;
};
type CloudSnapshot = { data: StudyPlannerData; revision: number; updatedAt: string };

class CloudError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}

function readLocal(): StudyPlannerData {
  const stored = window.localStorage.getItem(LOCAL_KEY);
  return stored === null ? emptyPlannerData() : parsePlannerData(JSON.parse(stored) as unknown);
}

function readConnection(): string | null {
  const stored = window.localStorage.getItem(CONNECTION_KEY);
  if (stored === null) return null;
  const code = normalizeSyncCode(stored);
  if (!code) throw new Error("저장된 동기화 코드가 올바르지 않습니다. 코드를 다시 연결하거나 연결을 해제해 주세요.");
  return code;
}

function parseSnapshot(value: unknown): CloudSnapshot {
  if (!value || typeof value !== "object") throw new Error("동기화 서버의 응답 형식이 올바르지 않습니다.");
  const raw = value as Record<string, unknown>;
  if (!Number.isSafeInteger(raw.revision) || (raw.revision as number) < 1 ||
    typeof raw.updatedAt !== "string" || !Number.isFinite(Date.parse(raw.updatedAt))) {
    throw new Error("동기화 서버의 응답 형식이 올바르지 않습니다.");
  }
  return { data: parsePlannerData(raw.data), revision: raw.revision as number, updatedAt: raw.updatedAt };
}

function readCache(code: string): CloudSnapshot | null {
  try {
    const stored = window.localStorage.getItem(`${CACHE_PREFIX}${code}`);
    if (stored === null) return null;
    const raw = JSON.parse(stored) as Record<string, unknown>;
    return raw.code === code ? parseSnapshot(raw) : null;
  } catch {
    // An unreadable cache must not prevent retrieving the authoritative server copy.
    return null;
  }
}

function cacheSnapshot(code: string, snapshot: CloudSnapshot, saveConnection: boolean) {
  let connectionFailed = false;
  // Save the small, indispensable credential before a cache that may exhaust storage.
  if (saveConnection) {
    try { window.localStorage.setItem(CONNECTION_KEY, code); }
    catch { connectionFailed = true; }
  }
  let cacheFailed = false;
  try { window.localStorage.setItem(`${CACHE_PREFIX}${code}`, JSON.stringify({ code, ...snapshot })); }
  catch { cacheFailed = true; }
  return {
    connectionFailed,
    warning: connectionFailed ? CONNECTION_ERROR
      : cacheFailed ? "클라우드에는 저장됐지만 이 브라우저에 오프라인 조회용 사본을 보관하지 못했습니다." : null,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "처리하지 못했습니다. 다시 시도해 주세요.";
}

/** Local records remain a separate backup after connecting to a private cloud plan. */
export function useStudyPlanner() {
  const [state, setState] = useState<PlannerState>(() => ({
    data: emptyPlannerData(), ready: false, storageError: null, saving: false,
    syncStatus: "local", cloudAvailable: null, syncCode: null,
  }));
  const stateRef = useRef(state);
  const mountedRef = useRef(false);
  const codeRef = useRef<string | null | undefined>(undefined);
  const pendingConnectionRef = useRef<string | null>(null);
  const snapshotRef = useRef<{ code: string; revision: number } | null>(null);
  const generationRef = useRef(0);
  const busyRef = useRef(false);
  const controllersRef = useRef(new Set<AbortController>());
  const reloadTaskRef = useRef<Promise<void> | null>(null);
  const statusTaskRef = useRef<Promise<void> | null>(null);

  const publish = useCallback((patch: Partial<PlannerState>) => {
    if (!mountedRef.current) return;
    stateRef.current = { ...stateRef.current, ...patch };
    if (pendingConnectionRef.current && stateRef.current.syncCode === pendingConnectionRef.current &&
      !stateRef.current.storageError?.includes(CONNECTION_ERROR)) {
      stateRef.current.storageError = [stateRef.current.storageError, CONNECTION_ERROR].filter(Boolean).join(" ");
    }
    setState(stateRef.current);
  }, []);

  const persistSnapshot = useCallback((code: string, snapshot: CloudSnapshot, saveConnection = false): string | null => {
    const shouldSaveConnection = saveConnection || pendingConnectionRef.current === code;
    const result = cacheSnapshot(code, snapshot, shouldSaveConnection);
    if (shouldSaveConnection) pendingConnectionRef.current = result.connectionFailed ? code : null;
    return result.warning;
  }, []);

  const invalidate = useCallback(() => {
    generationRef.current += 1;
    for (const controller of controllersRef.current) controller.abort();
    controllersRef.current.clear();
    reloadTaskRef.current = null;
    statusTaskRef.current = null;
    return generationRef.current;
  }, []);

  const isCurrent = useCallback((generation: number) =>
    mountedRef.current && generationRef.current === generation, []);

  const request = useCallback(async (url: string, init: RequestInit = {}): Promise<unknown> => {
    const controller = new AbortController();
    controllersRef.current.add(controller);
    const timeout = window.setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch(url, { ...init, cache: "no-store", signal: controller.signal });
      let body: unknown;
      try { body = await response.json(); }
      catch { throw new Error("동기화 서버의 응답을 읽지 못했습니다. 다시 불러와 주세요."); }
      if (!response.ok) {
        const message = body && typeof body === "object" && "message" in body && typeof body.message === "string"
          ? body.message : "동기화 서버에 연결하지 못했습니다. 다시 시도해 주세요.";
        throw new CloudError(response.status, message);
      }
      return body;
    } catch (error) {
      if (controller.signal.aborted) throw new Error("동기화 연결 시간이 초과됐습니다. 네트워크를 확인하고 다시 불러와 주세요.");
      if (error instanceof TypeError) throw new Error("동기화 서버에 연결할 수 없습니다. 네트워크를 확인하고 다시 불러와 주세요.");
      throw error;
    } finally {
      window.clearTimeout(timeout);
      controllersRef.current.delete(controller);
    }
  }, []);

  const fetchCloud = useCallback(async (code: string) => parseSnapshot(await request("/api/planner", {
    headers: { Authorization: `Bearer ${code}` },
  })), [request]);

  const checkAvailability = useCallback((): Promise<void> => {
    if (statusTaskRef.current) return statusTaskRef.current;
    const generation = generationRef.current;
    const task = (async () => {
      try {
        const result = await request("/api/planner/status");
        if (isCurrent(generation) && result && typeof result === "object" && "configured" in result && typeof result.configured === "boolean") {
          publish({ cloudAvailable: result.configured });
        }
      } catch {
        // Unknown availability differs from a server explicitly lacking configuration.
      }
    })();
    statusTaskRef.current = task;
    void task.finally(() => { if (statusTaskRef.current === task) statusTaskRef.current = null; });
    return task;
  }, [isCurrent, publish, request]);

  const reload = useCallback((): Promise<void> => {
    if (busyRef.current) return Promise.resolve();
    if (reloadTaskRef.current) return reloadTaskRef.current;
    const generation = generationRef.current;
    void checkAvailability();
    const task = (async () => {
      try {
        if (codeRef.current === undefined) codeRef.current = readConnection();
        const code = codeRef.current;
        if (code === null) {
          const data = readLocal();
          if (isCurrent(generation)) {
            snapshotRef.current = null;
            publish({ data, ready: true, syncCode: null, syncStatus: "local", storageError: null });
          }
          return;
        }
        if (stateRef.current.syncCode !== code) {
          const cache = readCache(code);
          snapshotRef.current = cache ? { code, revision: cache.revision } : null;
          publish({ data: cache?.data ?? emptyPlannerData(), ready: false, syncCode: code });
        }
        publish({ syncStatus: "connecting", storageError: null });
        const snapshot = await fetchCloud(code);
        if (!isCurrent(generation)) return;
        const warning = persistSnapshot(code, snapshot);
        snapshotRef.current = { code, revision: snapshot.revision };
        publish({ data: snapshot.data, ready: true, syncCode: code, syncStatus: "synced", cloudAvailable: true, storageError: warning });
      } catch (error) {
        if (!isCurrent(generation)) return;
        publish({ ready: false, syncStatus: codeRef.current === null ? "local" : "offline",
          storageError: codeRef.current === null ? LOAD_ERROR : errorMessage(error) });
      }
    })();
    reloadTaskRef.current = task;
    void task.finally(() => { if (reloadTaskRef.current === task) reloadTaskRef.current = null; });
    return task;
  }, [checkAvailability, fetchCloud, isCurrent, persistSnapshot, publish]);

  useEffect(() => {
    mountedRef.current = true;
    // Browser storage is an external source that becomes available after hydration.
    void reload();
    const onStorage = (event: StorageEvent) => {
      if (event.key === CONNECTION_KEY || event.key === null) {
        invalidate();
        busyRef.current = false;
        codeRef.current = undefined;
        pendingConnectionRef.current = null;
        publish({ saving: false, ready: false });
        void reload();
      } else if ((event.key === LOCAL_KEY && codeRef.current === null) ||
        (typeof codeRef.current === "string" && event.key === `${CACHE_PREFIX}${codeRef.current}`)) {
        void reload();
      }
    };
    const refresh = () => { if (document.visibilityState !== "hidden") void reload(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    window.addEventListener("online", refresh);
    document.addEventListener("visibilitychange", refresh);
    const timer = window.setInterval(refresh, 60_000);
    return () => {
      mountedRef.current = false;
      invalidate();
      window.clearInterval(timer);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("online", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [invalidate, publish, reload]);

  const beginMutation = useCallback((): number | null => {
    if (!mountedRef.current || busyRef.current) return null;
    const generation = invalidate();
    busyRef.current = true;
    publish({ saving: true, storageError: null });
    return generation;
  }, [invalidate, publish]);

  const finishMutation = useCallback((generation: number) => {
    if (isCurrent(generation)) {
      busyRef.current = false;
      publish({ saving: false });
    }
  }, [isCurrent, publish]);

  const commit = useCallback(async (update: (current: StudyPlannerData) => StudyPlannerData): Promise<boolean> => {
    if (!stateRef.current.ready) {
      publish({ storageError: stateRef.current.storageError ?? "공부 계획을 불러온 뒤 다시 시도해 주세요." });
      return false;
    }
    const generation = beginMutation();
    if (generation === null) return false;
    const code = codeRef.current;
    const displayedSnapshot = snapshotRef.current;
    const displayedRevision = displayedSnapshot && displayedSnapshot.code === code ? displayedSnapshot.revision : null;
    try {
      if (code === null) {
        let current: StudyPlannerData;
        try { current = readLocal(); } catch {
          publish({ ready: false, storageError: LOAD_ERROR });
          return false;
        }
        let next: StudyPlannerData;
        try { next = parsePlannerData(update(structuredClone(current))); } catch (error) {
          publish({ data: current, storageError: errorMessage(error) });
          return false;
        }
        try { window.localStorage.setItem(LOCAL_KEY, JSON.stringify(next)); } catch {
          publish({ data: current, storageError: "변경 내용을 저장하지 못했습니다. 기존 계획은 유지됩니다. 브라우저 저장 공간을 확인해 주세요." });
          return false;
        }
        publish({ data: next, ready: true, syncStatus: "local", storageError: null });
        return true;
      }
      if (!code) return false;
      const latest = await fetchCloud(code);
      if (!isCurrent(generation)) return false;
      const cacheWarning = persistSnapshot(code, latest);
      snapshotRef.current = { code, revision: latest.revision };
      publish({ data: latest.data, ready: true, syncStatus: "synced", cloudAvailable: true, storageError: cacheWarning });
      // The user's form was based on the displayed revision, not this just-fetched one.
      if (latest.revision !== displayedRevision) {
        publish({ storageError: CONFLICT_ERROR });
        return false;
      }
      let next: StudyPlannerData;
      try { next = parsePlannerData(update(structuredClone(latest.data))); } catch (error) {
        publish({ storageError: errorMessage(error) });
        return false;
      }
      let saved: CloudSnapshot;
      try {
        saved = parseSnapshot(await request("/api/planner", {
          method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${code}` },
          body: JSON.stringify({ data: next, revision: latest.revision }),
        }));
      } catch (error) {
        if (!isCurrent(generation)) return false;
        if (error instanceof CloudError && error.status === 409) {
          const fresh = await fetchCloud(code);
          if (!isCurrent(generation)) return false;
          persistSnapshot(code, fresh);
          snapshotRef.current = { code, revision: fresh.revision };
          publish({ data: fresh.data, ready: true, syncStatus: "synced", storageError: CONFLICT_ERROR });
          return false;
        }
        throw error;
      }
      if (!isCurrent(generation)) return false;
      const warning = persistSnapshot(code, saved);
      snapshotRef.current = { code, revision: saved.revision };
      publish({ data: saved.data, ready: true, syncStatus: "synced", storageError: warning });
      return true;
    } catch (error) {
      if (isCurrent(generation)) publish({ ready: false, syncStatus: "offline", storageError: errorMessage(error) });
      return false;
    } finally {
      finishMutation(generation);
    }
  }, [beginMutation, fetchCloud, finishMutation, isCurrent, persistSnapshot, publish, request]);

  const adoptCloud = useCallback((code: string, snapshot: CloudSnapshot) => {
    // Neither connecting nor cloud edits write to the original local-only records.
    const warning = persistSnapshot(code, snapshot, true);
    codeRef.current = code;
    snapshotRef.current = { code, revision: snapshot.revision };
    publish({ data: snapshot.data, ready: true, syncCode: code, syncStatus: "synced", cloudAvailable: true, storageError: warning });
  }, [persistSnapshot, publish]);

  const createCloud = useCallback(async (): Promise<boolean> => {
    if (codeRef.current !== null || !stateRef.current.ready) {
      publish({ storageError: "브라우저의 기존 계획을 불러온 상태에서 동기화를 시작해 주세요." });
      return false;
    }
    if (stateRef.current.cloudAvailable === false) {
      publish({ storageError: UNAVAILABLE_ERROR });
      return false;
    }
    const generation = beginMutation();
    if (generation === null) return false;
    publish({ syncStatus: "connecting" });
    try {
      let data: StudyPlannerData;
      try { data = readLocal(); } catch {
        publish({ ready: false, syncStatus: "local", storageError: LOAD_ERROR });
        return false;
      }
      const result = await request("/api/planner", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data }),
      });
      if (!isCurrent(generation)) return false;
      const snapshot = parseSnapshot(result);
      const rawCode = result && typeof result === "object" && "code" in result ? result.code : null;
      const code = typeof rawCode === "string" ? normalizeSyncCode(rawCode) : null;
      if (!code) throw new Error("서버가 올바른 동기화 코드를 반환하지 않았습니다. 기존 브라우저 기록은 유지됩니다.");
      adoptCloud(code, snapshot);
      return true;
    } catch (error) {
      if (isCurrent(generation)) publish({ syncStatus: "local", storageError: errorMessage(error) });
      return false;
    } finally {
      finishMutation(generation);
    }
  }, [adoptCloud, beginMutation, finishMutation, isCurrent, publish, request]);

  const connect = useCallback(async (input: string): Promise<boolean> => {
    const code = normalizeSyncCode(input);
    if (!code) {
      publish({ storageError: "SP-로 시작하는 동기화 코드 전체를 입력해 주세요." });
      return false;
    }
    if (stateRef.current.cloudAvailable === false) {
      publish({ storageError: UNAVAILABLE_ERROR });
      return false;
    }
    const previousStatus: SyncStatus = codeRef.current ? (stateRef.current.ready ? "synced" : "offline") : "local";
    const generation = beginMutation();
    if (generation === null) return false;
    publish({ syncStatus: "connecting" });
    try {
      const snapshot = await fetchCloud(code);
      if (!isCurrent(generation)) return false;
      adoptCloud(code, snapshot);
      return true;
    } catch (error) {
      if (isCurrent(generation)) publish({ syncStatus: previousStatus, storageError: errorMessage(error) });
      return false;
    } finally {
      finishMutation(generation);
    }
  }, [adoptCloud, beginMutation, fetchCloud, finishMutation, isCurrent, publish]);

  const disconnect = useCallback(() => {
    try { window.localStorage.removeItem(CONNECTION_KEY); } catch {
      publish({ storageError: "이 브라우저에서 연결 정보를 지우지 못했습니다. 저장소 접근 권한을 확인해 주세요." });
      return;
    }
    invalidate();
    busyRef.current = false;
    codeRef.current = null;
    pendingConnectionRef.current = null;
    snapshotRef.current = null;
    try {
      publish({ data: readLocal(), ready: true, saving: false, syncCode: null, syncStatus: "local", storageError: null });
    } catch {
      publish({ data: emptyPlannerData(), ready: false, saving: false, syncCode: null, syncStatus: "local", storageError: LOAD_ERROR });
    }
  }, [invalidate, publish]);

  const clearError = useCallback(() => {
    if (stateRef.current.ready && !busyRef.current) publish({ storageError: null });
  }, [publish]);

  return { ...state, commit, reload, clearError, createCloud, connect, disconnect };
}
