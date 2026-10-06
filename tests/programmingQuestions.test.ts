import assert from "node:assert/strict";
import { test } from "node:test";
import { PROGRAMMING_EXERCISES, PROGRAMMING_QUESTIONS } from "../lib/programmingQuestions";
import { LocalQuestionGenerator, getAvailableQuestionCount, isQuestionAnswerCorrect, normalizeQuestionPrompt } from "../lib/questionGenerator";
import type { GenerateQuestionInput, ProgrammingLanguage } from "../lib/types";

const languages: ProgrammingLanguage[] = ["C", "Java", "Python"];
const generator = new LocalQuestionGenerator(() => 0.37);
const input: GenerateQuestionInput = {
  examId: "infosec-practical", topicId: "programming-languages", count: 12,
};

test("programming bank has 90 distinct executable exercises covering 30 concepts per language", () => {
  assert.equal(PROGRAMMING_EXERCISES.length, 90);
  assert.equal(getAvailableQuestionCount("infosec-practical", "programming-languages"), 90);
  assert.equal(new Set(PROGRAMMING_EXERCISES.map((exercise) => exercise.id)).size, 90);
  assert.equal(new Set(PROGRAMMING_QUESTIONS.map((question) => normalizeQuestionPrompt(question.prompt))).size, 90);
  for (const language of languages) {
    assert.equal(getAvailableQuestionCount("infosec-practical", "programming-languages", language), 30);
    const exercises = PROGRAMMING_EXERCISES.filter((exercise) => exercise.language === language);
    assert.equal(exercises.length, 30);
    assert.equal(new Set(exercises.map((exercise) => exercise.concept)).size, 30);
  }
  for (const question of PROGRAMMING_QUESTIONS) {
    assert.equal(question.answerFormat, "code-output");
    assert.ok(question.code?.source);
    assert.ok(question.prompt.endsWith(question.code.source));
    assert.ok(question.answer && question.explanation);
    assert.ok(isQuestionAnswerCorrect(question, question.answer));
    if (question.code.language === "C") assert.ok(question.code.source.includes("int main(void)"));
    if (question.code.language === "Java") assert.ok(question.code.source.includes("public static void main(String[] args)"));
  }
});

test("mixed programming sets balance all three languages without difficulty filtering", () => {
  for (const count of [6, 12, 30]) {
    const questions = generator.generate({ ...input, count });
    assert.equal(questions.length, count);
    for (const language of languages) assert.equal(questions.filter((question) => question.code?.language === language).length, count / 3);
  }
});

test("language selection exhausts unseen questions before repeating and shuffles their display", () => {
  for (const language of languages) {
    const first = generator.generate({ ...input, count: 10, programmingLanguage: language });
    assert.ok(first.every((question) => question.code?.language === language));
    const history = first.map((question) => question.id);
    const rest = generator.generate({ ...input, count: 50, programmingLanguage: language, previousQuestionIds: history });
    assert.equal(rest.length, 30);
    assert.ok(rest.every((question) => question.code?.language === language));
    assert.equal(rest.filter((question) => !history.includes(question.id)).length, 20);
    assert.deepEqual(rest.filter((question) => history.includes(question.id)).map((question) => question.id).sort(), [...history].sort());
    assert.equal(new Set(rest.map((question) => question.id)).size, 30);
  }
  const [focused] = generator.generate({ ...input, count: 1, focus: "C" });
  assert.equal(focused.code?.language, "C");
  const otherTopic = generator.generate({ ...input, topicId: "design-patterns", programmingLanguage: "Python" });
  assert.equal(otherTopic.length, 12);
  assert.ok(otherTopic.every((question) => question.topicId === "design-patterns"));
});

test("output grading preserves case and value separators while accepting line breaks and numeric list spacing", () => {
  const find = (id: string) => PROGRAMMING_QUESTIONS[PROGRAMMING_EXERCISES.findIndex((exercise) => exercise.id === id)];
  const trace = find("c-recursion-order");
  assert.ok(isQuestionAnswerCorrect(trace, "321123"));
  assert.ok(!isQuestionAnswerCorrect(trace, "3 2 1 1 2 3"));
  const separated = find("c-increment");
  assert.ok(isQuestionAnswerCorrect(separated, "5\n3\n5"));
  assert.ok(isQuestionAnswerCorrect(separated, " 5  3  5 "));
  assert.ok(!isQuestionAnswerCorrect(separated, "535"));
  assert.ok(!isQuestionAnswerCorrect(separated, "3 5 5"));
  const text = find("python-loop-else");
  assert.ok(isQuestionAnswerCorrect(text, "NONE"));
  assert.ok(!isQuestionAnswerCorrect(text, "none"));
  const nested = find("python-shallow-copy");
  assert.ok(isQuestionAnswerCorrect(nested, "[[1,2,5],[3,4]]"));
  assert.ok(isQuestionAnswerCorrect(nested, "[ [1, 2, 5], [3, 4] ]"));
  assert.ok(!isQuestionAnswerCorrect(nested, "[[1,2],[3,4]]"));
  const squares = find("python-comprehension");
  assert.ok(isQuestionAnswerCorrect(squares, "[4,16,36]"));
  assert.ok(!isQuestionAnswerCorrect(squares, "[4,1 6,36]"));
  const multiline = find("c-static-local");
  assert.ok(isQuestionAnswerCorrect(multiline, "2 4 8"));
  assert.ok(isQuestionAnswerCorrect(multiline, "2\r\n4\r\n8\r\n"));
  assert.ok(!isQuestionAnswerCorrect(multiline, "248"));
  assert.ok(!isQuestionAnswerCorrect(multiline, ""));
});
