import assert from "node:assert/strict";
import { test } from "node:test";
import { APPLIED_QUESTIONS_BY_TOPIC } from "../lib/appliedQuestions";
import { TOPICS_BY_EXAM } from "../lib/questionBank";
import { THEORY_QUESTIONS_BY_EXAM } from "../lib/theoryQuestions";
import { normalizeQuestionPrompt, isQuestionAnswerCorrect } from "../lib/questionGenerator";
import type { ExamId, TopicId } from "../lib/types";

test("application questions broaden every topic outside the dedicated pattern, diagram and code banks", () => {
  const dedicated = new Set(["design-patterns", "diagrams", "programming-languages"]);
  let total = 0;
  for (const [examId, topics] of Object.entries(TOPICS_BY_EXAM)) {
    for (const topic of topics) {
      if (dedicated.has(topic.id)) continue;
      const added = APPLIED_QUESTIONS_BY_TOPIC[topic.id]!;
      assert.ok(added.length >= 8, topic.id);
      const bank = THEORY_QUESTIONS_BY_EXAM[examId as ExamId];
      assert.ok(added.every((question) => bank.includes(question)), topic.id);
      total += added.length;
    }
  }
  assert.equal(total, 222);
});

test("new prompts are unique and all canonical answers and aliases can be graded", () => {
  const prompts = new Set<string>();
  for (const question of Object.values(APPLIED_QUESTIONS_BY_TOPIC).flat()) {
    const key = normalizeQuestionPrompt(question.prompt);
    assert.ok(!prompts.has(key), question.prompt);
    prompts.add(key);
    assert.ok(question.keyword && question.explanation && question.answer);
    assert.ok(!Object.hasOwn(question, "difficulty"));
    for (const answer of [question.answer, ...(question.answerAliases ?? [])]) {
      assert.ok(isQuestionAnswerCorrect(question, answer), question.keyword);
    }
  }
});

test("statistical, network and training numerical answers agree with independent calculations", () => {
  const check = (topic: TopicId, keyword: string, expected: number) => {
    const question = APPLIED_QUESTIONS_BY_TOPIC[topic]!.find((item) => item.keyword === keyword)!;
    assert.ok(question, keyword);
    assert.ok(Math.abs(Number(question.answer) - expected) < 1e-9, keyword);
  };
  check("osi", "TCP 순서 번호", 1000 + 100);
  check("coverage", "구문 커버리지", 3 / 4 * 100);
  check("coverage", "순환복잡도", 8 - 7 + 2);
  check("modern-tech", "SLO", 30 * 24 * 60 * (1 - 0.999));
  check("bigdata-planning", "완전성", (200 - 10) / 200 * 100);
  const sample = [1, 3, 5];
  const mean = sample.reduce((sum, value) => sum + value, 0) / sample.length;
  check("bigdata-exploration", "표본분산", sample.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (sample.length - 1));
  check("bigdata-exploration", "카이제곱 기대빈도", 40 * 30 / 100);
  check("bigdata-exploration", "표준오차", 120 / Math.sqrt(400));
  check("bigdata-modeling", "지니 불순도", 1 - (6 / 10) ** 2 - (4 / 10) ** 2);
  check("bigdata-modeling", "다수결 앙상블", 3 * 0.1 ** 2 * 0.9 + 0.1 ** 3);
  check("bigdata-modeling", "PCA 설명분산", (6 + 3) / (6 + 3 + 1));
  check("bigdata-modeling", "로지스틱 함수", 1 / (1 + Math.exp(0)));
  check("bigdata-evaluation", "Balanced Accuracy", (0.8 + 0.6) / 2);
  check("bigdata-evaluation", "F1", Number((2 * 8 / (2 * 8 + 2 + 6)).toFixed(4)));
  check("bigdata-evaluation", "음수 R²", 1 - 120 / 100);
  check("bigdata-preprocessing", "훈련 범위 밖 변환", (40 - 10) / (30 - 10));
  check("bigdata-model-training", "최종 재학습", 6 * 4 + 1);
  check("sql-index-tuning", "선택도", 100 / 1_000_000);
});

test("chemical, concentration and unit conversion answers preserve stated assumptions", () => {
  const check = (topic: TopicId, keyword: string, expected: number) => {
    const question = APPLIED_QUESTIONS_BY_TOPIC[topic]!.find((item) => item.keyword === keyword)!;
    assert.ok(question, keyword);
    assert.ok(Math.abs(Number(question.answer) - expected) < 1e-9, keyword);
  };
  check("hazmat-class1", "질량 보존", 245 - 149);
  check("hazmat-class2", "유황 연소 질량", 32 + 2 * 16);
  check("hazmat-class2", "황화린 몰질량", 4 * 31 + 3 * 32);
  check("hazmat-class3", "탄화칼슘 기체 부피", 64 / (40 + 2 * 12) * 22.4);
  check("hazmat-class4", "밀도와 저장량", 200 * 0.8);
  check("hazmat-class5", "TNT 몰질량", 7 * 12 + 5 + 3 * 14 + 6 * 16);
  check("hazmat-class5", "히드록실아민 산화수", -(3 * 1 - 2));
  check("hazmat-class6", "질량 백분율", 120 / 300 * 100);
  check("hazmat-class6", "산소 생성 질량", 68 / (2 * 1 + 2 * 16) / 2 * (2 * 16));
  check("hazmat-class6", "희석 농도", 200 * 0.5 / (200 + 300) * 100);
  check("hazmat-class6", "과염소산 몰질량", 1 + 35.5 + 4 * 16);
  check("hazmat-class6", "질산 분해 몰비", 2 / 4);
  check("fire-extinction", "포 팽창비", 100 / 5);
  check("fire-extinction", "공급 유량", 220 * 15);
  check("fire-extinction", "이론 산소 비율", 21 / (100 + 50) * 100);
  check("hazmat-law", "질량·부피 배수 합산", 5 / 10 + 50 / 200);
  check("hazmat-law", "남은 저장량 계산", 200 - 180);
  check("hazmat-law", "질량의 부피 환산", 160 / 0.8 / 200);
  check("hazmat-law", "단위 일치", 750 / 1000 / 300);
});
