"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  emptyPlannerData,
  parsePlannerData,
  type StudyPlannerData,
} from "@/lib/studyPlanner";

const STORAGE_KEY = "exam-study-planner:v1";
const LOAD_ERROR =
  "저장된 공부 계획을 불러오지 못했습니다. 기존 저장 데이터는 덮어쓰지 않았습니다. 브라우저 저장소를 확인한 뒤 다시 불러와 주세요.";

type PlannerState = {
  data: StudyPlannerData;
  ready: boolean;
  storageError: string | null;
};

function readStoredPlanner(): StudyPlannerData {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === null
    ? emptyPlannerData()
    : parsePlannerData(JSON.parse(stored) as unknown);
}

/** Persist only explicit edits, so a failed read can never replace saved data. */
export function useStudyPlanner() {
  const [state, setState] = useState<PlannerState>(() => ({
    data: emptyPlannerData(),
    ready: false,
    storageError: null,
  }));
  const readyRef = useRef(false);

  const reportLoadFailure = useCallback(() => {
    readyRef.current = false;
    setState((previous) => ({
      ...previous,
      ready: false,
      storageError: LOAD_ERROR,
    }));
  }, []);

  const reload = useCallback(() => {
    try {
      const data = readStoredPlanner();
      readyRef.current = true;
      setState({ data, ready: true, storageError: null });
    } catch {
      reportLoadFailure();
    }
  }, [reportLoadFailure]);

  useEffect(() => {
    // The server has no localStorage; hydration synchronizes this external data source.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) reload();
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [reload]);

  const commit = useCallback(
    (update: (current: StudyPlannerData) => StudyPlannerData): boolean => {
      if (!readyRef.current) {
        setState((previous) => ({
          ...previous,
          storageError:
            previous.storageError ?? "공부 계획을 불러온 뒤 다시 시도해 주세요.",
        }));
        return false;
      }

      let current: StudyPlannerData;
      try {
        // Re-read for every edit so another tab's most recent edits are preserved.
        current = readStoredPlanner();
      } catch {
        reportLoadFailure();
        return false;
      }

      let next: StudyPlannerData;
      try {
        // An updater that mutates or throws must not leak unsaved changes into the view.
        next = parsePlannerData(update(structuredClone(current)));
      } catch (error) {
        setState({
          data: current,
          ready: true,
          storageError:
            error instanceof Error
              ? error.message
              : "공부 계획을 변경하지 못했습니다. 입력 내용을 확인해 주세요.",
        });
        return false;
      }

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        setState({
          data: current,
          ready: true,
          storageError:
            "변경 내용을 저장하지 못했습니다. 저장된 계획은 유지됩니다. 브라우저 저장 공간이나 접근 권한을 확인한 뒤 다시 시도해 주세요.",
        });
        return false;
      }

      setState({ data: next, ready: true, storageError: null });
      return true;
    },
    [reportLoadFailure],
  );

  const clearError = useCallback(() => {
    // Keep read failures visible while edits remain blocked.
    if (readyRef.current) {
      setState((previous) => ({ ...previous, storageError: null }));
    }
  }, []);

  return { ...state, commit, reload, clearError };
}
