import assert from "node:assert/strict";
import { test } from "node:test";
import { TOPICS_BY_EXAM } from "../lib/questionBank";
import { CONCEPTS_BY_EXAM } from "../lib/concepts";
import {
  AiReadyQuestionGenerator, LocalQuestionGenerator, getAvailableQuestionCount,
  isQuestionAnswerCorrect, MAX_QUESTION_COUNT, normalizeQuestionPrompt,
} from "../lib/questionGenerator";
import { readQuestionHistory, recordQuestionHistory, type QuestionHistoryStorage } from "../lib/questionHistory";
import type { ExamId, GenerateQuestionInput, Question, TopicId } from "../lib/types";

const generator = new LocalQuestionGenerator(() => 0.37);
const input: GenerateQuestionInput = { examId: "infosec-practical", topicId: "design-patterns", count: 8 };
const catalogue = Object.entries(TOPICS_BY_EXAM) as [ExamId, typeof TOPICS_BY_EXAM[ExamId]][];

function allQuestions(examId: ExamId, topicId: TopicId): Question[] {
  const available = getAvailableQuestionCount(examId, topicId);
  const questions: Question[] = [];
  while (questions.length < available) {
    questions.push(...generator.generate({ examId, topicId, count: Math.min(50, available - questions.length),
      previousQuestionIds: questions.map((question) => question.id) }));
  }
  return questions;
}

test("all exam topics have at least 30 distinct questions and complete answer metadata", () => {
  const allIds = new Set<string>();
  for (const [examId, topics] of catalogue) {
    for (const topic of topics) {
      const available = getAvailableQuestionCount(examId, topic.id);
      assert.ok(available >= 30, `${examId}/${topic.id}: ${available}`);
      {
        const questions = generator.generate({ examId, topicId: topic.id, count: 50 });
        assert.equal(questions.length, Math.min(50, available));
        assert.equal(new Set(questions.map((question) => normalizeQuestionPrompt(question.prompt))).size, questions.length);
        assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
        for (const question of questions) {
          assert.equal(question.topicId, topic.id);
          assert.equal(question.topicName, topic.name);
          assert.ok(question.answer.trim() && question.explanation.trim() && question.keyword.trim());
          assert.ok(question.typeLabel);
          assert.ok(!Object.hasOwn(question, "difficulty") && !Object.hasOwn(question, "difficultyLabel"));
          assert.equal(isQuestionAnswerCorrect(question, question.answer), true);
          for (const alias of question.answerAliases ?? []) assert.equal(isQuestionAnswerCorrect(question, alias), true);
        }
      }
      // History-driven single-question draws enumerate the complete bank.
      const history: string[] = [];
      for (let index = 0; index < available; index += 1) {
        const [question] = generator.generate({ examId, topicId: topic.id, count: 1, previousQuestionIds: history });
        assert.ok(!history.includes(question.id));
        assert.ok(!allIds.has(question.id), question.id);
        allIds.add(question.id);
        history.push(question.id);
      }
    }
  }
});

test("successive batches avoid previously shown questions even after focus changes", () => {
  const first = generator.generate(input);
  const second = generator.generate({ ...input, focus: "Observer", previousQuestionIds: first.map((question) => question.id) });
  const firstIds = new Set(first.map((question) => question.id));
  assert.ok(second.every((question) => !firstIds.has(question.id)));
});

test("every GoF pattern has three practical questions whose answer is the pattern name", () => {
  const gofNames = CONCEPTS_BY_EXAM["infosec-practical"]
    .find((section) => section.topicId === "design-patterns")!.items
    .filter((item) => /^(생성|구조|행위) 패턴\./.test(item.summary)).map((item) => item.term);
  assert.equal(gofNames.length, 23);
  assert.equal(getAvailableQuestionCount("infosec-practical", "design-patterns"), 69);
  {
    const questions = allQuestions("infosec-practical", "design-patterns");
    for (const name of gofNames) assert.equal(questions.filter((question) => question.answer === name).length, 3);
    for (const question of questions) {
      assert.ok(question.prompt.includes("디자인 패턴의 이름을 쓰시오"));
      assert.ok(!question.prompt.toLowerCase().includes(question.answer.toLowerCase()), question.prompt);
      assert.ok(!/분류명|역할 이름|중 어디에|중 어느|중 .*것은/.test(question.prompt));
      assert.ok(isQuestionAnswerCorrect(question, `${question.answer} Pattern`));
      assert.ok(question.answerAliases?.some((alias) => /[가-힣]/.test(alias)));
    }
  }
});

test("pattern names are accepted in Korean and with the Pattern suffix", () => {
  const [question] = generator.generate({ ...input, focus: "Singleton", count: 1 });
  assert.equal(question.answer, "Singleton");
  for (const answer of ["싱글턴", "싱글톤 패턴", "Singleton Pattern", "singleton"]) {
    assert.ok(isQuestionAnswerCorrect(question, answer));
  }
  for (const answer of ["생성", "Director", "Adapter"]) assert.ok(!isQuestionAnswerCorrect(question, answer));
});

test("all 15 diagram types have three name-identification questions with no notation answers", () => {
  const names = CONCEPTS_BY_EXAM["infosec-practical"]
    .find((section) => section.topicId === "diagrams")!.items.map((item) => item.term);
  assert.equal(names.length, 15);
  assert.equal(getAvailableQuestionCount("infosec-practical", "diagrams"), 45);
  {
    const questions = allQuestions("infosec-practical", "diagrams");
    for (const name of names) assert.equal(questions.filter((question) => question.answer === name).length, 3);
    for (const question of questions) {
      assert.equal(question.type, "short");
      assert.ok(question.prompt.includes("다이어그램의 이름을 쓰시오"));
      assert.ok(!question.prompt.toLowerCase().includes(question.answer.toLowerCase()), question.prompt);
      assert.ok(question.answerAliases?.some((alias) => /[가-힣]/.test(alias)));
      for (const alias of question.answerAliases ?? []) {
        if (alias.endsWith("다이어그램")) assert.ok(!question.prompt.includes(alias), question.prompt);
      }
    }
  }
});

test("diagram grading accepts Korean names and synonyms but rejects roles and other diagram types", () => {
  const questions = generator.generate({ ...input, topicId: "diagrams", count: 50 });
  const check = (name: string, accepted: string[], rejected: string[]) => {
    const question = questions.find((candidate) => candidate.answer === name)!;
    assert.ok(question, name);
    for (const answer of accepted) assert.ok(isQuestionAnswerCorrect(question, answer), answer);
    for (const answer of rejected) assert.ok(!isQuestionAnswerCorrect(question, answer), answer);
  };
  check("Use Case Diagram", ["유스케이스 다이어그램", "Use Case"], ["include", "extend"]);
  check("Class Diagram", ["클래스 다이어그램", "Class"], ["합성", "Object Diagram"]);
  check("Sequence Diagram", ["시퀀스", "순차 다이어그램"], ["생명선", "통신 다이어그램"]);
  check("Communication Diagram", ["통신 다이어그램", "Collaboration Diagram"], ["번호", "시퀀스"]);
  check("Activity Diagram", ["활동 다이어그램"], ["포크", "조인", "스윔레인", "상태 다이어그램"]);
  check("State Machine Diagram", ["상태 다이어그램", "State Diagram"], ["활동 다이어그램"]);
  check("Deployment Diagram", ["배치 다이어그램", "배포 다이어그램"], ["컴포넌트 다이어그램"]);
  check("ERD", ["개체 관계도", "Entity Relationship Diagram"], ["교차 테이블", "DFD"]);
  check("DFD", ["자료 흐름도", "Data Flow Diagram"], ["데이터 저장소", "순서도"]);
  check("Flowchart", ["순서도", "Flow Chart"], ["자료 흐름도", "활동 다이어그램"]);
});

test("unseen questions take priority over seen questions across the entire bank", () => {
  const full = generator.generate({ ...input, topicId: "coverage", count: 50 });
  const previous = full.slice(0, 10).map((question) => question.id);
  const questions = generator.generate({ ...input, topicId: "coverage", previousQuestionIds: previous });
  assert.equal(questions.length, 8);
  assert.ok(questions.every((question) => !previous.includes(question.id)));
});

test("exhausted banks recycle the oldest questions and never duplicate a batch", () => {
  const full = generator.generate({ ...input, topicId: "osi", count: 50 });
  const history = full.map((question) => question.id);
  const repeated = generator.generate({ ...input, topicId: "osi", previousQuestionIds: history });
  assert.deepEqual(repeated.map((question) => question.id).sort(), history.slice(0, 8).sort());
  const partialHistory = history.slice(0, -3);
  const mixed = generator.generate({ ...input, topicId: "osi", previousQuestionIds: partialHistory });
  assert.equal(mixed.length, 8);
  assert.ok(history.slice(-3).every((id) => mixed.some((question) => question.id === id)));
  assert.equal(new Set(mixed.map((question) => question.id)).size, 8);
});

test("theories are balanced and legacy difficulty requests do not filter the bank", () => {
  const questions = generator.generate(input);
  const legacyRequest = { ...input, difficulty: "easy" };
  assert.deepEqual(generator.generate(legacyRequest), questions);
  assert.equal(new Set(questions.map((question) => question.keyword)).size, 8);
  assert.equal(new Set(questions.map((question) => question.answer)).size, 8);
});

test("shuffle varies sets and focus prioritizes matching questions without rewriting prompts", () => {
  const first = new LocalQuestionGenerator(() => 0).generate(input);
  const second = new LocalQuestionGenerator(() => 0.999).generate(input);
  assert.notDeepEqual(first.map((question) => question.id), second.map((question) => question.id));
  const focused = generator.generate({ ...input, count: 1, focus: "Observer" });
  assert.equal(focused[0].keyword, "Observer");
  assert.ok(!focused[0].prompt.includes("추가 요청 반영"));
  const original = allQuestions("infosec-practical", "design-patterns").find((question) => question.prompt === focused[0].prompt);
  assert.equal(original?.id, focused[0].id);
});

test("full sets and exhausted banks shuffle display order instead of keeping catalogue or history order", () => {
  for (const [examId, topics] of catalogue) {
    for (const topic of topics) {
      const bank = allQuestions(examId, topic.id);
      const history = bank.map((question) => question.id);
      const request = { examId, topicId: topic.id, count: 8, previousQuestionIds: history };
      const first = new LocalQuestionGenerator(() => 0).generate(request).map((question) => question.id);
      const second = new LocalQuestionGenerator(() => 0.999).generate(request).map((question) => question.id);
      assert.notDeepEqual(first, second, `${examId}/${topic.id}`);
      assert.deepEqual([...first].sort(), history.slice(0, 8).sort());
      assert.deepEqual([...second].sort(), [...first].sort());
      if (bank.length <= MAX_QUESTION_COUNT) {
        const full = { examId, topicId: topic.id, count: bank.length };
        const left = new LocalQuestionGenerator(() => 0).generate(full).map((question) => question.id);
        const right = new LocalQuestionGenerator(() => 0.999).generate(full).map((question) => question.id);
        assert.notDeepEqual(left, right);
        assert.deepEqual([...left].sort(), [...right].sort());
      }
    }
  }
});

test("oversized requests return only available unique questions and malformed counts are normalized", () => {
  const base = { ...input, topicId: "osi" as const };
  assert.equal(generator.generate({ ...base, count: 999 }).length, getAvailableQuestionCount("infosec-practical", "osi"));
  assert.equal(generator.generate({ ...input, count: 999 }).length, MAX_QUESTION_COUNT);
  assert.equal(generator.generate({ ...base, count: 3.8 }).length, 3);
  for (const count of [0, -5]) assert.equal(generator.generate({ ...base, count }).length, 1);
  for (const count of [NaN, Infinity]) assert.equal(generator.generate({ ...base, count }).length, 5);
  const fallback = generator.generate({ ...base, topicId: "database" });
  assert.ok(fallback.every((question) => question.topicId === "database"));
  const wrongExamTopic = generator.generate({ ...base, examId: "sqlp" });
  assert.ok(wrongExamTopic.every((question) => question.topicId === TOPICS_BY_EXAM.sqlp[0].id));
});

test("AI fallback observes the same history and uniqueness rules", async () => {
  const first = generator.generate(input);
  const next = await new AiReadyQuestionGenerator(generator).generate({ ...input, previousQuestionIds: first.map((question) => question.id) });
  assert.ok(next.every((question) => !first.some((previous) => previous.id === question.id)));
});

function memoryStorage(): QuestionHistoryStorage {
  const values = new Map<string, string>();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); } };
}

test("browser history survives reloads, isolates topics/exams, and moves repeated IDs to newest", () => {
  const storage = memoryStorage();
  assert.deepEqual(readQuestionHistory(storage, "infosec-practical", "osi"), []);
  const initial = recordQuestionHistory(storage, "infosec-practical", "osi", [], ["a", "b", "b"]);
  assert.deepEqual(initial, ["a", "b"]);
  assert.deepEqual(recordQuestionHistory(storage, "infosec-practical", "osi", initial, ["a", "c"]), ["b", "a", "c"]);
  assert.deepEqual(readQuestionHistory(storage, "infosec-practical", "osi"), ["b", "a", "c"]);
  assert.deepEqual(readQuestionHistory(storage, "infosec-practical", "database"), []);
  assert.deepEqual(readQuestionHistory(storage, "sqlp", "osi"), []);
});

test("corrupt or blocked storage does not prevent generation and memory history remains usable", () => {
  assert.deepEqual(readQuestionHistory({ getItem: () => "broken", setItem: () => {} }, "infosec-practical", "osi"), []);
  assert.deepEqual(readQuestionHistory({ getItem: () => '["a",3,null,"b"]', setItem: () => {} }, "infosec-practical", "osi"), ["a", "b"]);
  const blocked = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("quota"); } };
  assert.deepEqual(readQuestionHistory(blocked, "infosec-practical", "osi"), []);
  assert.deepEqual(recordQuestionHistory(blocked, "infosec-practical", "osi", ["a"], ["b"]), ["a", "b"]);
});

test("grading accepts declared aliases and whitespace but rejects wrong and empty answers", () => {
  const [question] = generator.generate({ ...input, count: 1, focus: "Observer" });
  assert.ok(isQuestionAnswerCorrect(question, "  observer  "));
  assert.ok(!isQuestionAnswerCorrect(question, "Strategy"));
  assert.ok(!isQuestionAnswerCorrect(question, " "));
  assert.ok(isQuestionAnswerCorrect({ ...question, answer: "원자성", answerAliases: ["Atomicity"] }, " ATOMICITY "));
});
