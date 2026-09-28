import { CONCEPTS_BY_EXAM, type ConceptItem } from "./concepts";
import { EXAMS } from "./exams";
import { TOPICS_BY_EXAM } from "./questionBank";
import type { ExamId, TopicId } from "./types";

export const REVIEW_INTERVAL_DAYS = [3, 7, 14, 30] as const;

export interface PlannerConcept extends ConceptItem {
  id: string;
  examId: ExamId;
  topicId: TopicId;
  topicName: string;
}

export interface StudySession {
  id: string;
  date: string;
  examId: ExamId;
  topicId?: TopicId;
  startTime: string;
  endTime: string;
  conceptId: string;
}

export interface StudyCompletion {
  id: string;
  sessionId: string;
  conceptId: string;
  completedOn: string;
}

export interface StudyCompletionUndo {
  id: string;
  completionId: string;
  undoneOn: string;
}

export interface StudyPlannerData {
  version: 1;
  sessions: StudySession[];
  completions: StudyCompletion[];
  completionUndos: StudyCompletionUndo[];
}

export interface ConceptProgress {
  completionCount: number;
  lastCompletedOn: string | null;
  nextReviewOn: string | null;
}

export interface StudyRecommendation {
  concept: PlannerConcept;
  kind: "new" | "review";
  dueOn?: string;
}

export interface RecommendationInput {
  examId: ExamId;
  topicId?: TopicId;
  date: string;
  data: StudyPlannerData;
  excludeSessionId?: string;
}

export interface StudySessionInput {
  id?: string;
  date: string;
  examId: ExamId;
  topicId?: TopicId;
  startTime: string;
  endTime: string;
  conceptId?: string;
}

/** The identity does not depend on catalogue order or display wording elsewhere. */
export function getConceptId(examId: ExamId, topicId: TopicId, term: string): string {
  return JSON.stringify([examId, topicId, term.normalize("NFC")]);
}

export function getConceptAnchor(topicId: TopicId | string, term: string): string {
  const encodedTerm = Array.from(term.normalize("NFC"), (character) =>
    character.codePointAt(0)!.toString(36),
  ).join("-");
  return `concept-${topicId}-${encodedTerm}`;
}

export function conceptHref(concept: Pick<PlannerConcept, "examId" | "topicId" | "term">): string {
  return `/exams/${concept.examId}/concepts#${getConceptAnchor(concept.topicId, concept.term)}`;
}

export const PLANNER_CONCEPTS: PlannerConcept[] = EXAMS.flatMap((exam) =>
  CONCEPTS_BY_EXAM[exam.id].flatMap((section) =>
    section.items.map((concept) => ({
      ...concept,
      id: getConceptId(exam.id, section.topicId, concept.term),
      examId: exam.id,
      topicId: section.topicId,
      topicName: TOPICS_BY_EXAM[exam.id].find((topic) => topic.id === section.topicId)?.name ?? section.topicId,
    })),
  ),
);

const conceptById = new Map(PLANNER_CONCEPTS.map((concept) => [concept.id, concept]));
const examIds = new Set<string>(EXAMS.map((exam) => exam.id));

export function getPlannerConcept(conceptId: string): PlannerConcept | undefined {
  return conceptById.get(conceptId);
}

export function emptyPlannerData(): StudyPlannerData {
  return { version: 1, sessions: [], completions: [], completionUndos: [] };
}

export function localDateKey(date = new Date()): string {
  return `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function isValidDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= days[month - 1];
}

/** UTC is used only for calendar arithmetic, never for deriving the user's date. */
export function addDays(date: string, days: number): string {
  if (!isValidDateKey(date) || !Number.isSafeInteger(days)) throw new Error("올바른 날짜를 입력해 주세요.");
  const [year, month, day] = date.split("-").map(Number);
  const result = new Date(0);
  result.setUTCFullYear(year, month - 1, day);
  result.setUTCHours(12, 0, 0, 0);
  result.setUTCDate(result.getUTCDate() + days);
  const key = `${String(result.getUTCFullYear()).padStart(4, "0")}-${String(result.getUTCMonth() + 1).padStart(2, "0")}-${String(result.getUTCDate()).padStart(2, "0")}`;
  if (!isValidDateKey(key)) throw new Error("지원하는 날짜 범위를 벗어났습니다.");
  return key;
}

export function isValidTime(value: unknown): value is string {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function activeCompletions(data: StudyPlannerData): StudyCompletion[] {
  const undone = new Set(data.completionUndos.map((undo) => undo.completionId));
  return data.completions.filter((completion) => !undone.has(completion.id));
}

export function getSessionCompletion(data: StudyPlannerData, sessionId: string): StudyCompletion | null {
  return activeCompletions(data).find((completion) => completion.sessionId === sessionId) ?? null;
}

export function getConceptProgress(data: StudyPlannerData, conceptId: string, asOfDate?: string): ConceptProgress {
  if (asOfDate !== undefined && !isValidDateKey(asOfDate)) throw new Error("올바른 날짜를 입력해 주세요.");
  // Multiple completions on one day remain in history but cannot rush the review stages.
  const days = [...new Set(activeCompletions(data)
    .filter((completion) => completion.conceptId === conceptId && (!asOfDate || completion.completedOn <= asOfDate))
    .map((completion) => completion.completedOn))].sort();
  const lastCompletedOn = days.at(-1) ?? null;
  return {
    completionCount: days.length,
    lastCompletedOn,
    nextReviewOn: lastCompletedOn
      ? addDays(lastCompletedOn, REVIEW_INTERVAL_DAYS[Math.min(days.length - 1, REVIEW_INTERVAL_DAYS.length - 1)])
      : null,
  };
}

function recommendations(input: RecommendationInput): StudyRecommendation[] {
  const { data, examId, topicId, date, excludeSessionId } = input;
  if (!isValidDateKey(date)) throw new Error("올바른 날짜를 입력해 주세요.");
  const completedSessions = new Set(activeCompletions(data).map((event) => event.sessionId));
  const reserved = new Set(data.sessions
    .filter((session) => session.id !== excludeSessionId &&
      (session.date === date || (session.date < date && !completedSessions.has(session.id))))
    .map((session) => session.conceptId));
  const reviews: StudyRecommendation[] = [];
  const unseen: StudyRecommendation[] = [];
  for (const concept of PLANNER_CONCEPTS) {
    if (concept.examId !== examId || (topicId && concept.topicId !== topicId) || reserved.has(concept.id)) continue;
    // Use all known progress, including completions after a selected past date.
    const progress = getConceptProgress(data, concept.id);
    if (progress.completionCount === 0) unseen.push({ concept, kind: "new" });
    else if (progress.nextReviewOn && progress.nextReviewOn <= date) {
      reviews.push({ concept, kind: "review", dueOn: progress.nextReviewOn });
    }
  }
  reviews.sort((a, b) => a.dueOn!.localeCompare(b.dueOn!));
  return [...reviews, ...unseen];
}

export function getRecommendation(input: RecommendationInput): StudyRecommendation | null {
  return recommendations(input)[0] ?? null;
}

function newId(prefix: string): string {
  return `${prefix}-${globalThis.crypto.randomUUID()}`;
}

function assertSessionFields(session: Omit<StudySession, "id" | "conceptId">): void {
  if (!isValidDateKey(session.date)) throw new Error("올바른 날짜를 선택해 주세요.");
  if (!examIds.has(session.examId)) throw new Error("공부할 과목을 선택해 주세요.");
  if (session.topicId !== undefined && !TOPICS_BY_EXAM[session.examId].some((topic) => topic.id === session.topicId)) {
    throw new Error("선택한 과목에 해당하는 영역을 선택해 주세요.");
  }
  if (!isValidTime(session.startTime) || !isValidTime(session.endTime)) throw new Error("시작 시간과 종료 시간을 입력해 주세요.");
  if (session.startTime >= session.endTime) throw new Error("종료 시간은 시작 시간보다 뒤여야 합니다. 자정을 넘는 공부는 날짜별로 나눠 주세요.");
}

export function saveSession(data: StudyPlannerData, input: StudySessionInput): StudyPlannerData {
  assertSessionFields(input);
  const existing = input.id ? data.sessions.find((session) => session.id === input.id) : undefined;
  if (existing && getSessionCompletion(data, existing.id)) throw new Error("완료한 계획을 수정하려면 먼저 완료를 취소해 주세요.");
  if (data.sessions.some((session) => session.id !== existing?.id && session.date === input.date &&
    input.startTime < session.endTime && input.endTime > session.startTime)) {
    throw new Error("다른 공부 계획과 시간이 겹칩니다. 겹치지 않는 시간을 선택해 주세요.");
  }
  const sameSubject = existing && existing.examId === input.examId && existing.topicId === input.topicId;
  const preservedId = sameSubject ? existing.conceptId : undefined;
  const conceptId = input.conceptId ?? preservedId ?? getRecommendation({ ...input, data, excludeSessionId: existing?.id })?.concept.id;
  const concept = conceptId ? getPlannerConcept(conceptId) : undefined;
  if (!concept) throw new Error("추천할 개념이 없습니다. 다른 영역이나 날짜를 선택해 주세요.");
  if (concept.examId !== input.examId || (input.topicId && concept.topicId !== input.topicId)) {
    throw new Error("선택한 과목과 공부 개념이 일치하지 않습니다.");
  }
  if (data.sessions.some((session) => session.id !== existing?.id && session.date === input.date && session.conceptId === conceptId)) {
    throw new Error("이 날짜에 이미 계획한 개념입니다.");
  }
  if (conceptId !== preservedId && !recommendations({ ...input, data, excludeSessionId: existing?.id }).some((item) => item.concept.id === conceptId)) {
    throw new Error("이미 계획했거나 아직 복습할 때가 되지 않은 개념입니다.");
  }
  const session: StudySession = {
    id: existing?.id ?? input.id ?? newId("session"),
    date: input.date,
    examId: input.examId,
    ...(input.topicId ? { topicId: input.topicId } : {}),
    startTime: input.startTime,
    endTime: input.endTime,
    conceptId: concept.id,
  };
  if (!session.id.trim()) throw new Error("공부 계획 식별자가 올바르지 않습니다.");
  return {
    ...data,
    sessions: existing ? data.sessions.map((previous) => previous.id === session.id ? session : previous) : [...data.sessions, session],
  };
}

export function createSession(data: StudyPlannerData, input: StudySessionInput): StudyPlannerData {
  if (input.id && data.sessions.some((session) => session.id === input.id)) throw new Error("이미 있는 공부 계획입니다.");
  return saveSession(data, input);
}

export function deleteSession(data: StudyPlannerData, sessionId: string): StudyPlannerData {
  // Deleting a calendar entry never erases completed study history.
  return { ...data, sessions: data.sessions.filter((session) => session.id !== sessionId) };
}

export function completeSession(data: StudyPlannerData, sessionId: string, completedOn = localDateKey()): StudyPlannerData {
  const session = data.sessions.find((item) => item.id === sessionId);
  if (!session) throw new Error("공부 계획을 찾을 수 없습니다.");
  if (!isValidDateKey(completedOn) || completedOn > localDateKey()) throw new Error("미래 날짜에는 공부를 완료할 수 없습니다.");
  if (session.date > completedOn) throw new Error("미래의 공부 계획은 해당 날짜가 된 뒤 완료해 주세요.");
  if (getSessionCompletion(data, sessionId)) return data;
  const completion: StudyCompletion = { id: newId("completion"), sessionId, conceptId: session.conceptId, completedOn };
  return { ...data, completions: [...data.completions, completion] };
}

export function undoSessionCompletion(data: StudyPlannerData, sessionId: string, undoneOn = localDateKey()): StudyPlannerData {
  const completion = getSessionCompletion(data, sessionId);
  if (!completion) return data;
  if (!isValidDateKey(undoneOn) || undoneOn < completion.completedOn || undoneOn > localDateKey()) throw new Error("완료 취소 날짜가 올바르지 않습니다.");
  return {
    ...data,
    completionUndos: [...data.completionUndos, { id: newId("undo"), completionId: completion.id, undoneOn }],
  };
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function identifier(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 2000;
}

/** Reject corrupt storage instead of silently discarding a user's saved plan. */
export function parsePlannerData(raw: unknown): StudyPlannerData {
  const invalid = () => new Error("저장된 공부 계획의 형식이 올바르지 않습니다. 기존 데이터를 확인해 주세요.");
  if (!record(raw) || raw.version !== 1 || !Array.isArray(raw.sessions) || !Array.isArray(raw.completions) || !Array.isArray(raw.completionUndos)) throw invalid();
  if (raw.sessions.length > 10000 || raw.completions.length > 100000 || raw.completionUndos.length > 100000) throw invalid();
  const sessions: StudySession[] = raw.sessions.map((value: unknown) => {
    if (!record(value) || !identifier(value.id) || typeof value.examId !== "string" || !examIds.has(value.examId) ||
      (value.topicId !== undefined && typeof value.topicId !== "string") || !isValidDateKey(value.date) ||
      !isValidTime(value.startTime) || !isValidTime(value.endTime) || !identifier(value.conceptId)) throw invalid();
    const session: StudySession = {
      id: value.id, date: value.date, examId: value.examId as ExamId,
      ...(value.topicId !== undefined ? { topicId: value.topicId as TopicId } : {}),
      startTime: value.startTime, endTime: value.endTime, conceptId: value.conceptId,
    };
    assertSessionFields(session);
    const concept = getPlannerConcept(session.conceptId);
    if (!concept || concept.examId !== session.examId || (session.topicId && concept.topicId !== session.topicId)) throw invalid();
    return session;
  });
  const completions: StudyCompletion[] = raw.completions.map((value: unknown) => {
    if (!record(value) || !identifier(value.id) || !identifier(value.sessionId) || !identifier(value.conceptId) ||
      !getPlannerConcept(value.conceptId) || !isValidDateKey(value.completedOn)) throw invalid();
    return { id: value.id, sessionId: value.sessionId, conceptId: value.conceptId, completedOn: value.completedOn };
  });
  const completionUndos: StudyCompletionUndo[] = raw.completionUndos.map((value: unknown) => {
    if (!record(value) || !identifier(value.id) || !identifier(value.completionId) || !isValidDateKey(value.undoneOn)) throw invalid();
    return { id: value.id, completionId: value.completionId, undoneOn: value.undoneOn };
  });
  for (const entries of [sessions, completions, completionUndos]) {
    if (new Set(entries.map((entry) => entry.id)).size !== entries.length) throw invalid();
  }
  const completionMap = new Map(completions.map((completion) => [completion.id, completion]));
  const undoneIds = new Set<string>();
  for (const undo of completionUndos) {
    const completion = completionMap.get(undo.completionId);
    if (!completion || undoneIds.has(undo.completionId) || undo.undoneOn < completion.completedOn) throw invalid();
    undoneIds.add(undo.completionId);
  }
  const sessionMap = new Map(sessions.map((session) => [session.id, session]));
  const activeSessionIds = new Set<string>();
  for (const completion of completions) {
    if (undoneIds.has(completion.id)) continue;
    const session = sessionMap.get(completion.sessionId);
    if (activeSessionIds.has(completion.sessionId) || (session && (session.conceptId !== completion.conceptId || session.date > completion.completedOn))) throw invalid();
    activeSessionIds.add(completion.sessionId);
  }
  const byDate = new Map<string, StudySession[]>();
  for (const session of sessions) {
    const daySessions = byDate.get(session.date) ?? [];
    if (daySessions.some((other) => other.conceptId === session.conceptId || (session.startTime < other.endTime && session.endTime > other.startTime))) throw invalid();
    daySessions.push(session);
    byDate.set(session.date, daySessions);
  }
  return { version: 1, sessions, completions, completionUndos };
}
