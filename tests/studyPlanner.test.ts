import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PLANNER_CONCEPTS, addDays, completeSession, conceptHref,
  createSession, deleteSession, emptyPlannerData, getConceptAnchor, getConceptId,
  getConceptProgress, getRecommendation, getSessionCompletion, isValidDateKey,
  isValidTime, localDateKey, parsePlannerData, saveSession, undoSessionCompletion,
  type StudyPlannerData, type StudySessionInput,
} from "../lib/studyPlanner";

const day = "2026-01-01";
const baseInput: StudySessionInput = {
  date: day, examId: "infosec-practical", topicId: "design-patterns", startTime: "09:00", endTime: "10:00",
};
const firstConcept = PLANNER_CONCEPTS.find((concept) => concept.examId === baseInput.examId && concept.topicId === baseInput.topicId)!;

function recommend(data: StudyPlannerData, date = day) {
  return getRecommendation({ data, date, examId: baseInput.examId, topicId: baseInput.topicId });
}

test("date keys validate actual dates and calendar arithmetic survives leap years and DST boundaries", () => {
  assert.equal(isValidDateKey("2024-02-29"), true);
  for (const value of ["2026-02-29", "2026-04-31", "2026-13-01", "2026-1-01", "0000-01-01", "2100-02-29"]) {
    assert.equal(isValidDateKey(value), false, value);
  }
  assert.equal(addDays("2024-02-28", 1), "2024-02-29");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2026-03-08", 1), "2026-03-09");
  assert.equal(addDays("2026-11-01", -1), "2026-10-31");
  assert.equal(addDays("0099-12-31", 1), "0100-01-01");
  assert.equal(localDateKey(new Date(2026, 0, 1, 23, 59)), "2026-01-01");
  assert.throws(() => addDays("9999-12-31", 1));
});

test("catalogue identifiers and anchors are unique, deterministic, and safe for browser fragments", () => {
  assert.equal(new Set(PLANNER_CONCEPTS.map((concept) => concept.id)).size, PLANNER_CONCEPTS.length);
  for (const concept of PLANNER_CONCEPTS) {
    assert.equal(concept.id, getConceptId(concept.examId, concept.topicId, concept.term));
    const anchor = getConceptAnchor(concept.topicId, concept.term);
    assert.match(anchor, /^[a-z0-9-]+$/);
    assert.equal(conceptHref(concept), `/exams/${concept.examId}/concepts#${anchor}`);
  }
  assert.equal(getConceptAnchor("database", "가"), getConceptAnchor("database", "가"));
});

test("a day accepts multiple subjects and adjacent sessions, while overlap is rejected across subjects", () => {
  let data = createSession(emptyPlannerData(), { ...baseInput, id: "a" });
  data = createSession(data, { ...baseInput, id: "b", examId: "sqlp", topicId: undefined, startTime: "10:00", endTime: "11:00" });
  assert.equal(data.sessions.length, 2);
  assert.throws(() => createSession(data, { ...baseInput, examId: "hazmat-industrial", topicId: undefined, startTime: "09:30", endTime: "10:30" }), /겹칩니다/);
  assert.throws(() => createSession(data, { ...baseInput, startTime: "08:00", endTime: "12:00" }), /겹칩니다/);
  assert.throws(() => createSession(data, { ...baseInput, startTime: "10:00", endTime: "09:00" }), /종료 시간/);
  for (const time of ["24:00", "09:60", "9:00", "12:3", ""]) assert.equal(isValidTime(time), false);
});

test("recommendations are deterministic and reserve pending concepts across selected and earlier dates", () => {
  const empty = emptyPlannerData();
  assert.equal(recommend(empty)?.concept.id, firstConcept.id);
  assert.equal(recommend(empty)?.concept.id, recommend(empty)?.concept.id);
  const data = createSession(empty, { ...baseInput, id: "a" });
  assert.notEqual(recommend(data)?.concept.id, firstConcept.id);
  assert.notEqual(recommend(data, addDays(day, 1))?.concept.id, firstConcept.id);
  assert.equal(recommend(data, addDays(day, -1))?.concept.id, firstConcept.id);
  assert.equal(getRecommendation({ data, date: day, examId: baseInput.examId, topicId: baseInput.topicId, excludeSessionId: "a" })?.concept.id, firstConcept.id);
  assert.throws(() => createSession(data, { ...baseInput, date: addDays(day, 1), conceptId: firstConcept.id }), /이미 계획/);
});

test("completion keeps its fixed assignment, excludes it immediately, and later prioritizes its due review", () => {
  let data = createSession(emptyPlannerData(), { ...baseInput, id: "a" });
  const assigned = data.sessions[0].conceptId;
  data = createSession(data, { ...baseInput, id: "b", startTime: "10:00", endTime: "11:00" });
  data = completeSession(data, "a", day);
  assert.equal(getSessionCompletion(data, "a")?.conceptId, assigned);
  assert.equal(data.sessions[0].conceptId, assigned);
  assert.notEqual(recommend(data)?.concept.id, assigned);
  assert.deepEqual(getConceptProgress(data, assigned), { completionCount: 1, lastCompletedOn: day, nextReviewOn: "2026-01-04" });
  assert.notEqual(recommend(data, "2026-01-02")?.concept.id, assigned);
  assert.notEqual(recommend(data, "2026-01-03")?.concept.id, assigned);
  assert.equal(recommend(data, "2026-01-04")?.concept.id, assigned);
  assert.equal(recommend(data, "2026-01-04")?.kind, "review");
  assert.equal(completeSession(data, "a", day), data);
  assert.throws(() => saveSession(data, { ...data.sessions[0], endTime: "09:50" }), /완료를 취소/);
});

test("late completion schedules reviews from the actual completion day, never the past plan date", () => {
  let data = createSession(emptyPlannerData(), { ...baseInput, id: "late" });
  data = completeSession(data, "late", "2026-01-05");
  assert.equal(getConceptProgress(data, firstConcept.id).nextReviewOn, "2026-01-08");
  for (const date of ["2025-12-31", "2026-01-02", "2026-01-05", "2026-01-06", "2026-01-07"]) assert.notEqual(recommend(data, date)?.concept.id, firstConcept.id);
  assert.equal(recommend(data, "2026-01-08")?.concept.id, firstConcept.id);
});

test("future plans cannot be completed and the default completion day is local today", () => {
  const today = localDateKey();
  const future = createSession(emptyPlannerData(), { ...baseInput, id: "future", date: addDays(today, 1) });
  assert.throws(() => completeSession(future, "future"), /미래/);
  assert.throws(() => completeSession(future, "future", addDays(today, 1)), /미래/);
  const overdue = createSession(emptyPlannerData(), { ...baseInput, id: "overdue", date: addDays(today, -3) });
  assert.equal(getSessionCompletion(completeSession(overdue, "overdue"), "overdue")?.completedOn, today);
});

test("review intervals advance through 3, 7, 14, 30 days and then remain at 30", () => {
  let data = emptyPlannerData();
  let current = day;
  const expectedIntervals = [3, 7, 14, 30, 30, 30, 30];
  for (let index = 0; index < 7; index++) {
    data = createSession(data, { ...baseInput, id: `review-${index}`, date: current, conceptId: firstConcept.id });
    data = completeSession(data, `review-${index}`, current);
    const progress = getConceptProgress(data, firstConcept.id);
    assert.equal(progress.completionCount, index + 1);
    assert.equal(progress.nextReviewOn, addDays(current, expectedIntervals[index]));
    current = progress.nextReviewOn!;
  }
});

test("undo appends immutable history and restores previous review spacing, even if later sessions exist", () => {
  let data = createSession(emptyPlannerData(), { ...baseInput, id: "first" });
  data = completeSession(data, "first", day);
  data = createSession(data, { ...baseInput, id: "second", date: "2026-01-04", conceptId: firstConcept.id });
  data = completeSession(data, "second", "2026-01-04");
  const history = JSON.stringify(data.completions);
  const before = data;
  data = undoSessionCompletion(data, "second", "2026-01-04");
  assert.equal(JSON.stringify(data.completions), history);
  assert.equal(before.completionUndos.length, 0);
  assert.equal(data.completionUndos.length, 1);
  assert.equal(getSessionCompletion(data, "second"), null);
  assert.equal(getConceptProgress(data, firstConcept.id).nextReviewOn, "2026-01-04");
  assert.equal(undoSessionCompletion(data, "second", "2026-01-04"), data);
  data = completeSession(data, "second", "2026-01-04");
  assert.equal(data.completions.length, 3);
  assert.equal(getConceptProgress(data, firstConcept.id).completionCount, 2);
  assert.deepEqual(parsePlannerData(JSON.parse(JSON.stringify(data))), data);
});

test("deleting a calendar entry keeps completed progress, while cancelling the first completion makes it unseen", () => {
  let data = createSession(emptyPlannerData(), { ...baseInput, id: "a" });
  data = completeSession(data, "a", day);
  data = deleteSession(data, "a");
  assert.equal(data.sessions.length, 0);
  assert.equal(getConceptProgress(data, firstConcept.id).completionCount, 1);
  assert.deepEqual(parsePlannerData(data), data);
  data = undoSessionCompletion(data, "a", day);
  assert.equal(getConceptProgress(data, firstConcept.id).completionCount, 0);
  assert.equal(recommend(data)?.concept.id, firstConcept.id);
});

test("editing a pending session preserves the concept and changing subjects assigns a matching concept", () => {
  let data = createSession(emptyPlannerData(), { ...baseInput, id: "a" });
  data = saveSession(data, { ...baseInput, id: "a", date: "2026-01-02", startTime: "13:00", endTime: "14:00" });
  assert.equal(data.sessions[0].conceptId, firstConcept.id);
  data = saveSession(data, { ...baseInput, id: "a", examId: "sqlp", topicId: undefined });
  assert.equal(PLANNER_CONCEPTS.find((concept) => concept.id === data.sessions[0].conceptId)?.examId, "sqlp");
});

test("an exhausted area returns no recommendation until its next review day", () => {
  const concepts = PLANNER_CONCEPTS.filter((concept) => concept.examId === baseInput.examId && concept.topicId === baseInput.topicId);
  const data: StudyPlannerData = {
    ...emptyPlannerData(),
    completions: concepts.map((concept, index) => ({ id: `c${index}`, sessionId: `deleted${index}`, conceptId: concept.id, completedOn: day })),
  };
  assert.equal(recommend(data), null);
  assert.equal(recommend(data, "2026-01-02"), null);
  assert.equal(recommend(data, "2026-01-03"), null);
  assert.equal(recommend(data, "2026-01-04")?.kind, "review");
});

test("storage validation rejects corrupt structure, duplicate events, orphan undos, mismatched assignments and overlaps", () => {
  const valid = createSession(emptyPlannerData(), { ...baseInput, id: "a" });
  assert.deepEqual(parsePlannerData(JSON.parse(JSON.stringify(valid))), valid);
  const invalid: unknown[] = [
    null, {}, { ...valid, version: 2 }, { ...valid, completionUndos: undefined },
    { ...valid, sessions: [...valid.sessions, valid.sessions[0]] },
    { ...valid, sessions: [{ ...valid.sessions[0], date: "2026-02-30" }] },
    { ...valid, sessions: [{ ...valid.sessions[0], examId: "sqlp" }] },
    { ...valid, completionUndos: [{ id: "undo", completionId: "missing", undoneOn: day }] },
  ];
  const two = createSession(valid, { ...baseInput, id: "b", startTime: "10:00", endTime: "11:00" });
  invalid.push({ ...two, sessions: [two.sessions[0], { ...two.sessions[1], startTime: "09:30" }] });
  const completed = completeSession(valid, "a", day);
  invalid.push({ ...completed, completions: [...completed.completions, { ...completed.completions[0], id: "different" }] });
  for (const data of invalid) assert.throws(() => parsePlannerData(data));
});
