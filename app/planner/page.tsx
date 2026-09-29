"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, BookOpen, CalendarDays, Check, CheckCircle2, ChevronLeft,
  ChevronRight, Clock3, Pencil, Plus, RotateCcw, Sparkles, Trash2,
} from "lucide-react";
import { AppHeader } from "@/app/components/AppHeader";
import { EXAMS } from "@/lib/exams";
import { TOPICS_BY_EXAM } from "@/lib/questionBank";
import type { ExamId, TopicId } from "@/lib/types";
import {
  PLANNER_CONCEPTS, REVIEW_INTERVAL_DAYS, addDays, completeSession, conceptHref, deleteSession,
  getConceptProgress, getRecommendation, getSessionCompletion, localDateKey,
  saveSession, undoSessionCompletion, type StudySession,
} from "@/lib/studyPlanner";
import { useStudyPlanner } from "./useStudyPlanner";
import { PlannerSyncPanel } from "./PlannerSyncPanel";
import styles from "./planner.module.css";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const EXAM_SHORT_NAMES: Record<ExamId, string> = {
  "infosec-practical": "정보처리 실기",
  "bigdata-written": "빅데이터 필기",
  "bigdata-practical": "빅데이터 실기",
  sqlp: "SQLP",
  "hazmat-industrial": "위험물산업기사",
};
const EXAM_COLORS: Record<ExamId, string> = {
  "infosec-practical": "#3b82f6", "bigdata-written": "#8b5cf6",
  "bigdata-practical": "#0891b2", sqlp: "#d97706", "hazmat-industrial": "#e05c75",
};

function readableDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "long" })
    .format(new Date(year, month - 1, day));
}

function duration(start: string, end: string) {
  const minutes = (value: string) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
  const total = minutes(end) - minutes(start);
  return total >= 60 ? `${Math.floor(total / 60)}시간${total % 60 ? ` ${total % 60}분` : ""}` : `${total}분`;
}

export default function PlannerPage() {
  const planner = useStudyPlanner();
  const { data, ready, storageError, saving, commit, reload, clearError } = planner;
  const [today, setToday] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [month, setMonth] = useState("");
  const [examId, setExamId] = useState<ExamId>("infosec-practical");
  const [topicId, setTopicId] = useState<TopicId | "">("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingOriginal, setEditingOriginal] = useState<StudySession | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = localDateKey();
    // These values depend on the browser's local date and query string, after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(current);
    setSelectedDate(current);
    setMonth(current.slice(0, 7));
    const requestedExam = new URLSearchParams(window.location.search).get("exam");
    if (EXAMS.some((exam) => exam.id === requestedExam)) setExamId(requestedExam as ExamId);
    const refreshToday = () => setToday(localDateKey());
    const timer = window.setInterval(refreshToday, 30_000);
    window.addEventListener("focus", refreshToday);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshToday);
    };
  }, []);

  const selectedSessions = data.sessions.filter((session) => session.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const monthSessions = data.sessions.filter((session) => session.date.startsWith(month));
  const learned = PLANNER_CONCEPTS.filter((concept) => getConceptProgress(data, concept.id).completionCount > 0);
  const dueToday = learned.filter((concept) => {
    const next = getConceptProgress(data, concept.id).nextReviewOn;
    return next && next <= today;
  });
  const recommendation = selectedDate ? getRecommendation({
    examId, topicId: topicId || undefined, date: selectedDate, data, excludeSessionId: editingId || undefined,
  }) : null;
  const editingSession = data.sessions.find((session) => session.id === editingId);
  const keepAssignment = editingSession && editingSession.examId === examId && (editingSession.topicId || "") === topicId;
  const suggestedConcept = keepAssignment
    ? PLANNER_CONCEPTS.find((concept) => concept.id === editingSession.conceptId)
    : recommendation?.concept;
  const suggestedProgress = suggestedConcept ? getConceptProgress(data, suggestedConcept.id) : null;
  const isReview = keepAssignment ? Boolean(suggestedProgress?.completionCount) : recommendation?.kind === "review";
  const matchingConcepts = PLANNER_CONCEPTS.filter((concept) => concept.examId === examId && (!topicId || concept.topicId === topicId));
  const nextReview = matchingConcepts.map((concept) => getConceptProgress(data, concept.id).nextReviewOn)
    .filter((date): date is string => Boolean(date && date > selectedDate)).sort()[0];
  const completedCount = selectedSessions.filter((session) => getSessionCompletion(data, session.id)).length;

  const calendarDates: string[] = [];
  if (month) {
    const first = `${month}-01`;
    const [year, monthNumber] = month.split("-").map(Number);
    const offset = new Date(year, monthNumber - 1, 1).getDay();
    const dayCount = new Date(year, monthNumber, 0).getDate();
    for (let index = 0; index < Math.ceil((offset + dayCount) / 7) * 7; index++) {
      calendarDates.push(addDays(first, index - offset));
    }
  }

  function pickDate(date: string) {
    setSelectedDate(date);
    setMonth(date.slice(0, 7));
    setEditingId(null);
    setEditingOriginal(null);
    setDeleteId(null);
    setNotice("");
    clearError();
  }

  function changeMonth(amount: number) {
    const [year, monthNumber] = month.split("-").map(Number);
    const target = new Date(year, monthNumber - 1 + amount, 1);
    pickDate(localDateKey(target));
  }

  function editSession(session: StudySession) {
    setEditingId(session.id);
    setEditingOriginal(session);
    setExamId(session.examId);
    setTopicId(session.topicId || "");
    setStartTime(session.startTime);
    setEndTime(session.endTime);
    setNotice("");
    clearError();
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  async function submitSession(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || saving || !suggestedConcept) return;
    setNotice("");
    const success = await commit((current) => {
      if (editingOriginal && JSON.stringify(current.sessions.find((session) => session.id === editingOriginal.id)) !== JSON.stringify(editingOriginal)) {
        throw new Error("다른 PC에서 이 일정을 변경했어요. 수정을 취소한 뒤 최신 일정을 다시 열어주세요.");
      }
      return saveSession(current, {
        id: editingId || undefined, date: selectedDate, examId,
        topicId: topicId || undefined, startTime, endTime, conceptId: suggestedConcept.id,
      });
    });
    if (success) {
      setNotice(editingId ? "일정을 수정했어요." : "학습 일정이 추가됐어요. 다른 과목도 이어서 등록할 수 있어요.");
      setEditingId(null);
      setEditingOriginal(null);
      const nextHour = Math.min(Number(endTime.slice(0, 2)) + 1, 23);
      if (endTime < "23:00") {
        setStartTime(endTime);
        setEndTime(`${String(nextHour).padStart(2, "0")}:${endTime.slice(3)}`);
      }
    }
  }

  async function markComplete(session: StudySession) {
    setNotice("");
    if (await commit((current) => completeSession(current, session.id, localDateKey()))) {
      setNotice("학습을 완료했어요. 이 개념은 복습 시기가 되면 다시 추천해요.");
    }
  }

  async function undoComplete(session: StudySession) {
    setNotice("");
    if (await commit((current) => undoSessionCompletion(current, session.id))) {
      setNotice("완료를 취소하고 이전 학습 기록으로 되돌렸어요.");
    }
  }

  async function removeSession(session: StudySession) {
    setNotice("");
    if (await commit((current) => deleteSession(current, session.id))) {
      setDeleteId(null);
      if (editingId === session.id) { setEditingId(null); setEditingOriginal(null); }
      setNotice("일정을 삭제했어요.");
    }
  }

  return (
    <main className="page">
      <AppHeader />
      <div className={`shell ${styles.shell}`}>
        <section className={styles.intro}>
          <div>
            <span className={styles.eyebrow}><CalendarDays size={16} /> 나만의 학습 루틴</span>
            <h1>하루씩 쌓는 공부 계획</h1>
            <p>날짜를 고르고, 공부할 과목과 시간을 담아보세요.<br className={styles.mobileBreak} /> 다음에 볼 개념은 함께 골라드릴게요.</p>
          </div>
          <button className={styles.todayButton} onClick={() => today && pickDate(today)} disabled={!today || saving}>
            <CalendarDays size={17} /> 오늘로 이동
          </button>
        </section>

        <PlannerSyncPanel {...planner} />

        <section className={styles.stats} aria-label="학습 현황">
          <div><CalendarDays size={20} /><span>이번 달 일정<strong>{ready ? monthSessions.length : "–"}<small>개</small></strong></span></div>
          <div><CheckCircle2 size={20} /><span>학습한 개념<strong>{ready ? learned.length : "–"}<small>개</small></strong></span></div>
          <div><RotateCcw size={20} /><span>오늘 복습할 개념<strong>{ready ? dueToday.length : "–"}<small>개</small></strong></span></div>
        </section>

        {storageError && <div role="alert" className={styles.error}>{storageError}<button disabled={saving} onClick={() => void reload()}>다시 불러오기</button></div>}
        <div role="status" aria-live="polite" className={notice ? styles.notice : styles.srOnly}>{notice}</div>

        <div className={styles.workspace}>
          <div className={styles.mainColumn}>
            <section className={styles.calendar} aria-label="월별 공부 달력">
              <div className={styles.calendarHeading}>
                <h2>{month ? `${month.slice(0, 4)}년 ${Number(month.slice(5))}월` : "달력 불러오는 중"}</h2>
                <div className={styles.monthControls}>
                  <button aria-label="이전 달" onClick={() => changeMonth(-1)} disabled={!month || saving}><ChevronLeft size={20} /></button>
                  <button aria-label="다음 달" onClick={() => changeMonth(1)} disabled={!month || saving}><ChevronRight size={20} /></button>
                </div>
              </div>
              <div className={styles.weekdays} aria-hidden="true">{WEEKDAYS.map((day) => <span key={day}>{day}</span>)}</div>
              <div className={styles.calendarGrid}>
                {calendarDates.map((date) => {
                  const sessions = data.sessions.filter((session) => session.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime));
                  const done = sessions.filter((session) => getSessionCompletion(data, session.id)).length;
                  return (
                    <button key={date} type="button" onClick={() => pickDate(date)} disabled={saving}
                      className={`${styles.day} ${date.slice(0, 7) !== month ? styles.outside : ""} ${date === selectedDate ? styles.selected : ""}`}
                      aria-pressed={date === selectedDate} aria-current={date === today ? "date" : undefined}
                      aria-label={`${date} ${readableDate(date)}, 일정 ${sessions.length}개${done ? `, 완료 ${done}개` : ""}`}>
                      <span className={`${styles.dayNumber} ${date === today ? styles.today : ""}`}>{Number(date.slice(-2))}</span>
                      <span className={styles.dayEvents}>
                        {sessions.slice(0, 2).map((session) => <span key={session.id} className={styles.dayEvent} style={{ borderColor: EXAM_COLORS[session.examId] }}>
                          {getSessionCompletion(data, session.id) ? <Check size={10} /> : null}
                          <span>{session.startTime} <span className={styles.daySubject}>{EXAM_SHORT_NAMES[session.examId]}</span></span>
                        </span>)}
                        {sessions.length > 2 && <span className={styles.more}>+{sessions.length - 2}개</span>}
                      </span>
                      {sessions.length > 0 && <span className={styles.mobileDots} aria-hidden="true">{sessions.slice(0, 3).map((session) => <i key={session.id} style={{ background: EXAM_COLORS[session.examId] }} />)}</span>}
                    </button>
                  );
                })}
              </div>
              <div className={styles.legend}><span><i /> 선택한 날짜</span><span><Check size={13} /> 학습 완료</span><span>날짜를 눌러 계획을 만들어보세요.</span></div>
            </section>

            <section className={styles.agenda} aria-labelledby="agenda-title">
              <div className={styles.sectionHeading}>
                <div><span className={styles.eyebrow}>{selectedDate === today ? "TODAY" : "DAILY PLAN"}</span><h2 id="agenda-title">{selectedDate ? readableDate(selectedDate) : "선택한 날"}의 공부</h2></div>
                <span className={styles.count}>{completedCount} / {selectedSessions.length} 완료</span>
              </div>
              {!ready && !storageError ? <p className={styles.empty}>저장된 공부 계획을 불러오고 있어요.</p> : selectedSessions.length === 0 ? (
                <div className={styles.empty}><CalendarDays size={30} /><h3>아직 정해진 공부가 없어요</h3><p>과목과 시간을 선택해 첫 일정을 추가해보세요.</p><button className={styles.textButton} onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>공부 계획 만들기 <ArrowRight size={15} /></button></div>
              ) : <div className={styles.sessions}>
                {selectedSessions.map((session) => {
                  const concept = PLANNER_CONCEPTS.find((item) => item.id === session.conceptId);
                  const completion = getSessionCompletion(data, session.id);
                  const progress = getConceptProgress(data, session.conceptId);
                  return <article key={session.id} className={`${styles.session} ${completion ? styles.completed : ""}`} style={{ borderLeftColor: EXAM_COLORS[session.examId] }}>
                    <div className={styles.sessionTop}><span className={styles.sessionTime}><Clock3 size={14} />{session.startTime} – {session.endTime}<small>{duration(session.startTime, session.endTime)}</small></span><span className={completion ? styles.doneBadge : styles.pendingBadge}>{completion ? "완료" : "예정"}</span></div>
                    <p className={styles.subject}>{EXAM_SHORT_NAMES[session.examId]} <span>· {concept?.topicName}</span></p>
                    <h3>{concept?.term || "개념을 찾을 수 없어요"}</h3>
                    {concept && <p className={styles.summary}>{concept.summary}</p>}
                    {completion && <p className={styles.nextReview}><CheckCircle2 size={14} /> {readableDate(completion.completedOn)} 완료 · 다음 복습 {progress.nextReviewOn && readableDate(progress.nextReviewOn)}</p>}
                    <div className={styles.sessionActions}>
                      {concept && <Link className={styles.textButton} href={conceptHref(concept)}><BookOpen size={15} /> 개념 읽기</Link>}
                      <div>
                        {completion ? <button className={styles.textButton} disabled={!ready || saving} onClick={() => void undoComplete(session)}><RotateCcw size={14} /> 완료 취소</button> : <>
                          <button className={styles.iconButton} disabled={!ready || saving} aria-label={`${session.startTime} 일정 수정`} onClick={() => editSession(session)}><Pencil size={15} /></button>
                          <button className={styles.completeButton} disabled={session.date > today || !ready || saving} title={session.date > today ? "예정일이 되면 완료할 수 있어요" : undefined} onClick={() => void markComplete(session)}><Check size={15} /> 학습 완료</button>
                        </>}
                        <button className={styles.iconButton} disabled={!ready || saving} aria-label={`${session.startTime} 일정 삭제`} onClick={() => setDeleteId(session.id)}><Trash2 size={15} /></button>
                      </div>
                    </div>
                    {!completion && session.date > today && <p className={styles.helper}>예정일이 되면 학습을 완료할 수 있어요.</p>}
                    {deleteId === session.id && <div className={styles.deleteConfirm}><span>{completion ? "일정만 삭제하고 학습 기록은 보관할까요?" : "이 일정을 삭제할까요?"}</span><button disabled={!ready || saving} onClick={() => void removeSession(session)}>삭제</button><button disabled={saving} onClick={() => setDeleteId(null)}>취소</button></div>}
                  </article>;
                })}
              </div>}
            </section>
          </div>

          <aside className={styles.sideColumn}>
            <div className={styles.planForm} ref={formRef}>
              <div className={styles.formHeading}><span className={styles.formIcon}><Plus size={20} /></span><div><h2>{editingId ? "공부 일정 수정" : "공부 일정 추가"}</h2><p>{selectedDate ? readableDate(selectedDate) : "날짜를 선택하세요"}</p></div></div>
              <form onSubmit={submitSession}>
                <fieldset disabled={!ready || !selectedDate || saving} className={styles.fields}>
                  <label htmlFor="plan-exam">자격증<select id="plan-exam" value={examId} onChange={(event) => { setExamId(event.target.value as ExamId); setTopicId(""); }}>
                    {EXAMS.map((exam) => <option key={exam.id} value={exam.id}>{exam.name}</option>)}
                  </select></label>
                  <label htmlFor="plan-topic">과목<select id="plan-topic" value={topicId} onChange={(event) => setTopicId(event.target.value as TopicId | "")}>
                    <option value="">전체 과목에서 추천</option>
                    {TOPICS_BY_EXAM[examId].filter((topic) => PLANNER_CONCEPTS.some((concept) => concept.examId === examId && concept.topicId === topic.id)).map((topic) => <option value={topic.id} key={topic.id}>{topic.name}</option>)}
                  </select></label>
                  <div className={styles.timeFields}>
                    <label htmlFor="plan-start">시작 시간<input type="time" id="plan-start" value={startTime} onChange={(event) => setStartTime(event.target.value)} required /></label>
                    <span aria-hidden="true">–</span>
                    <label htmlFor="plan-end">종료 시간<input type="time" id="plan-end" value={endTime} onChange={(event) => setEndTime(event.target.value)} required /></label>
                  </div>

                  <section className={styles.recommendation} aria-label="추천 학습 개념">
                    <div className={styles.recommendationHeading}><Sparkles size={16} /><h3>{keepAssignment ? "이 일정의 학습 개념" : selectedDate === today ? "오늘은 이 개념 어때요?" : "이날 공부할 추천 개념"}</h3></div>
                    {suggestedConcept ? <>
                      <span className={isReview ? styles.reviewBadge : styles.newBadge}>{isReview ? "다시 볼 시간 · 복습" : "아직 공부하지 않은 개념"}</span>
                      <p className={styles.recommendedTopic}>{suggestedConcept.topicName}</p>
                      <h4>{suggestedConcept.term}</h4>
                      <p>{suggestedConcept.summary}</p>
                      <Link href={conceptHref(suggestedConcept)} className={styles.textButton}>이론 정리 열기 <ArrowRight size={14} /></Link>
                    </> : <p>{ready ? "지금 추천할 새 개념이나 복습 개념이 없어요. 다른 과목을 선택해보세요." : "학습 기록을 불러오고 있어요."}{ready && nextReview && ` 다음 복습은 ${readableDate(nextReview)}부터예요.`}</p>}
                  </section>
                  {storageError && ready && <div className={styles.formError}>{storageError}</div>}
                  <button className={styles.addButton} type="submit" disabled={!suggestedConcept}><Plus size={18} />{saving ? "저장 중…" : editingId ? "변경 내용 저장" : "이 개념으로 일정 추가"}</button>
                  {editingId && <button className={styles.cancelButton} type="button" onClick={() => { setEditingId(null); setEditingOriginal(null); clearError(); }}>수정 취소</button>}
                </fieldset>
              </form>
              <p className={styles.helper}>하루에 여러 과목을 추가할 수 있어요. 같은 날의 공부 시간은 겹치지 않게 입력해주세요.</p>
            </div>
            <section className={styles.reviewGuide}>
              <h3><RotateCcw size={17} /> 잊을 만할 때, 한 번 더</h3>
              <p>완료한 개념은 잠시 추천에서 쉬어요. 복습을 마칠 때마다 다음 간격으로 다시 찾아옵니다.</p>
              <div className={styles.intervals}>{REVIEW_INTERVAL_DAYS.map((days) => <span key={days}>{days}<small>일</small></span>)}</div>
              <p className={styles.helper}>각 간격은 실제 완료한 날부터 계산해요. 30일 단계부터는 30일마다 복습해요.</p>
            </section>
            <p className={styles.storageNote}>{planner.syncCode ? <>연결 코드를 보관하면 다른 PC에서도 이어서 공부할 수 있어요.<br />저장 완료 후 다른 PC에서 새로 불러와 주세요.</> : <>현재는 이 브라우저에만 저장돼요.<br />다른 PC에서도 보려면 위에서 동기화를 연결해주세요.</>}</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
