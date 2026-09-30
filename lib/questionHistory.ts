import type { ExamId, TopicId } from "./types";

export interface QuestionHistoryStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const historyKey = (examId: ExamId, topicId: TopicId) => `question-history:v1:${examId}:${topicId}`;

export function readQuestionHistory(storage: QuestionHistoryStorage, examId: ExamId, topicId: TopicId): string[] {
  try {
    const value: unknown = JSON.parse(storage.getItem(historyKey(examId, topicId)) ?? "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string").slice(-10000) : [];
  } catch {
    return [];
  }
}

export function recordQuestionHistory(
  storage: QuestionHistoryStorage, examId: ExamId, topicId: TopicId, previous: string[], current: string[],
): string[] {
  const currentIds = new Set(current);
  const next = [...new Set(previous.filter((id) => !currentIds.has(id))), ...currentIds].slice(-10000);
  try {
    storage.setItem(historyKey(examId, topicId), JSON.stringify(next));
  } catch {
    // The page retains the returned history when browser storage is unavailable.
  }
  return next;
}
