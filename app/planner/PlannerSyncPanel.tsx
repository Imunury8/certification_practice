"use client";

import { useId, useState } from "react";
import { Cloud, Copy, Eye, EyeOff, Laptop, RefreshCw, WifiOff } from "lucide-react";
import styles from "./PlannerSyncPanel.module.css";

export interface PlannerSyncPanelProps {
  syncStatus: "local" | "connecting" | "synced" | "offline";
  cloudAvailable: boolean | null;
  syncCode: string | null;
  saving: boolean;
  ready: boolean;
  createCloud: () => Promise<boolean>;
  connect: (code: string) => Promise<boolean>;
  disconnect: () => void;
  reload: () => Promise<void>;
}

type PendingAction = "create" | "connect" | "reload" | "copy" | null;

export function PlannerSyncPanel({
  syncStatus, cloudAvailable, syncCode, saving, ready,
  createCloud, connect, disconnect, reload,
}: PlannerSyncPanelProps) {
  const fieldId = useId();
  const [inputCode, setInputCode] = useState("");
  const [codeVisible, setCodeVisible] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [pending, setPending] = useState<PendingAction>(null);
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);
  const busy = saving || pending !== null || syncStatus === "connecting";
  const connected = syncStatus === "synced" || syncStatus === "offline" || Boolean(syncCode);

  const title = syncStatus === "offline"
    ? "동기화 연결이 끊겼어요"
    : syncStatus === "connecting"
      ? "공부 계획을 연결하고 있어요"
      : syncStatus === "synced"
        ? "다른 PC와 동기화됨"
        : "이 PC에만 저장됨";

  async function runAction(action: Exclude<PendingAction, "copy" | null>) {
    if (busy) return;
    setFeedback(null);
    setPending(action);
    try {
      if (action === "reload") {
        await reload();
        return;
      }
      const success = action === "create" ? await createCloud() : await connect(inputCode.trim());
      if (success) {
        setInputCode("");
        setCodeVisible(false);
        setConfirmDisconnect(false);
      } else {
        setFeedback({ text: "계획을 연결하지 못했어요. 연결 상태와 안내 메시지를 확인해주세요.", error: true });
      }
    } catch {
      setFeedback({ text: "계획을 불러오지 못했어요. 잠시 후 다시 시도해주세요.", error: true });
    } finally {
      setPending(null);
    }
  }

  async function copyCode() {
    if (!syncCode || busy) return;
    setFeedback(null);
    setPending("copy");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(syncCode);
      setFeedback({ text: "연결 코드를 복사했어요. 다른 PC에서 이 코드를 입력해주세요.", error: false });
    } catch {
      setCodeVisible(true);
      setFeedback({ text: "자동 복사가 안 돼요. 표시된 연결 코드를 선택해 직접 복사해주세요.", error: true });
    } finally {
      setPending(null);
    }
  }

  function returnToLocal() {
    if (busy) return;
    setFeedback(null);
    try {
      disconnect();
      setCodeVisible(false);
      setConfirmDisconnect(false);
      setInputCode("");
    } catch {
      setFeedback({ text: "이 PC의 기존 계획을 불러오지 못했어요. 안내 메시지를 확인해주세요.", error: true });
    }
  }

  return (
    <section className={`${styles.panel} ${syncStatus === "offline" ? styles.offline : ""}`} aria-label="공부 계획 동기화" aria-busy={busy}>
      <div className={styles.heading}>
        <span className={styles.icon} aria-hidden="true">
          {syncStatus === "offline" ? <WifiOff size={21} /> : connected || syncStatus === "connecting" ? <Cloud size={21} /> : <Laptop size={21} />}
        </span>
        <div className={styles.headingText}>
          <h2>{title}</h2>
          <p>
            {syncStatus === "offline"
              ? "마지막으로 불러온 계획을 표시하고 있어요. 다시 연결될 때까지 수정할 수 없어요."
              : syncStatus === "connecting"
                ? "연결이 끝나면 계획을 확인하고 수정할 수 있어요."
                : syncStatus === "synced"
                  ? "다른 PC에서도 같은 연결 코드를 입력하면 이 계획을 이어서 사용할 수 있어요."
                  : cloudAvailable === false
                    ? "서버 저장소 연결이 필요해요. 현재 계획은 이 PC에 보관돼요."
                    : cloudAvailable === null
                      ? ready ? "현재 계획은 이 PC에 보관돼요. 동기화 연결 상태를 다시 확인해주세요." : "현재 계획은 이 PC에 보관돼요. 동기화 연결을 확인하고 있어요."
                      : "계획을 동기화하고, 다른 PC에서도 같은 연결 코드로 이어서 공부하세요."}
          </p>
        </div>
        {saving && <span className={styles.saving} role="status">저장 중…</span>}
        {(connected || cloudAvailable !== true) && <button type="button" className={styles.secondaryButton} disabled={busy || (!connected && !ready)} onClick={() => void runAction("reload")}>
          <RefreshCw size={14} aria-hidden="true" />
          {pending === "reload" ? "불러오는 중…" : syncStatus === "offline" ? "다시 연결하기" : cloudAvailable !== true ? "연결 상태 확인" : "새로 불러오기"}
        </button>}
      </div>

      {!connected && cloudAvailable === true && <div className={styles.localOptions}>
        <div className={styles.createOption}>
          <button type="button" className={styles.primaryButton} disabled={busy || !ready} onClick={() => void runAction("create")}>
            <Cloud size={15} aria-hidden="true" />{pending === "create" ? "동기화하는 중…" : "기존 계획을 동기화하기"}
          </button>
          <p>이 PC의 계획과 완료 기록을 함께 동기화해요.</p>
        </div>
        <form className={styles.connectOption} onSubmit={(event) => { event.preventDefault(); if (inputCode.trim()) void runAction("connect"); }}>
          <label htmlFor={fieldId}>연결 코드</label>
          <div className={styles.connectRow}>
            <input id={fieldId} type="password" value={inputCode} onChange={(event) => setInputCode(event.target.value)} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="다른 PC의 연결 코드 입력" required disabled={busy || !ready} aria-describedby={`${fieldId}-help`} />
            <button type="submit" className={styles.secondaryButton} disabled={busy || !ready || !inputCode.trim()}>{pending === "connect" ? "연결하는 중…" : "다른 PC의 계획 연결"}</button>
          </div>
          <p id={`${fieldId}-help`}>이 PC의 기존 계획은 따로 보관돼요. 연결한 계획으로 전환한 뒤에도 다시 돌아올 수 있어요.</p>
        </form>
      </div>}

      {connected && <div className={styles.connectedOptions}>
        {syncCode && <div className={styles.codeSection}>
          <div className={styles.codeRow}>
            <span className={styles.codeLabel}>연결 코드</span>
            <code className={styles.code} aria-label={codeVisible ? undefined : "연결 코드 숨김"}>{codeVisible ? syncCode : "•••• •••• ••••"}</code>
            <div className={styles.codeActions}>
              <button type="button" className={styles.smallButton} disabled={busy} aria-expanded={codeVisible} onClick={() => setCodeVisible(!codeVisible)}>
                {codeVisible ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}{codeVisible ? "숨기기" : "보기"}
              </button>
              <button type="button" className={styles.smallButton} disabled={busy} onClick={() => void copyCode()}><Copy size={14} aria-hidden="true" />{pending === "copy" ? "복사 중…" : "복사"}</button>
            </div>
          </div>
          <p>이 코드를 아는 사람은 계획을 보고 바꿀 수 있어요. 코드는 개인적으로 보관해주세요.</p>
        </div>}
        <button type="button" className={styles.textButton} disabled={busy} aria-expanded={confirmDisconnect} onClick={() => setConfirmDisconnect(!confirmDisconnect)}>이 PC의 기존 계획으로 돌아가기</button>
      </div>}

      {connected && confirmDisconnect && <div className={styles.confirm}>
        <p>이 PC의 기존 계획으로 돌아갈까요? 동기화한 계획은 서버에 남고, 같은 코드로 다시 연결할 수 있어요.</p>
        <div><button type="button" className={styles.secondaryButton} disabled={busy} onClick={returnToLocal}>기존 계획으로 돌아가기</button><button type="button" className={styles.smallButton} disabled={busy} onClick={() => setConfirmDisconnect(false)}>취소</button></div>
      </div>}
      {feedback && <p className={`${styles.feedback} ${feedback.error ? styles.error : ""}`} role={feedback.error ? "alert" : "status"}>{feedback.text}</p>}
    </section>
  );
}
