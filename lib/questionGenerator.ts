import { QUESTION_BANK_BY_EXAM, TOPICS_BY_EXAM } from "@/lib/questionBank";
import type { Difficulty, GenerateQuestionInput, Question, QuestionGenerator, QuestionTemplate, ExamId } from "@/lib/types";

const typeLabels = {
  short: "단답형",
  "multiple-choice": "객관식",
  scenario: "상황형",
} as const;

const difficultyLabels: Record<Difficulty, string> = {
  easy: "기본",
  medium: "중간",
  hard: "실전",
};

const difficultyOrder: Difficulty[] = ["easy", "medium", "hard"];

export class LocalQuestionGenerator implements QuestionGenerator {
  generate(input: GenerateQuestionInput): Question[] {
    const examId = input.examId || "infosec-practical";
    const topics = TOPICS_BY_EXAM[examId] || TOPICS_BY_EXAM["infosec-practical"];
    const questionBank = QUESTION_BANK_BY_EXAM[examId] || QUESTION_BANK_BY_EXAM["infosec-practical"];

    const normalizedCount = Math.max(1, Math.min(input.count || 5, 20));
    const topic = topics.find((item) => item.id === input.topicId) ?? topics[0];
    const preferred = questionBank.filter(
      (question) => question.topicId === input.topicId && question.difficulty === input.difficulty,
    );
    const fallback = questionBank.filter((question) => question.topicId === input.topicId);
    const candidates = preferred.length >= normalizedCount ? preferred : [...preferred, ...fallback];

    return repeatToCount(uniqueByPrompt(candidates), normalizedCount).map((template, index) =>
      hydrateQuestion(template, index, topic.name, input.focus),
    );
  }
}

export class AiReadyQuestionGenerator implements QuestionGenerator {
  constructor(private readonly fallback = new LocalQuestionGenerator()) {}

  async generate(input: GenerateQuestionInput): Promise<Question[]> {
    // Replace this method with an LLM provider call when API credentials and prompts are ready.
    return this.fallback.generate(input);
  }
}

export function generateQuestions(input: GenerateQuestionInput): Question[] {
  return new LocalQuestionGenerator().generate(input);
}

export function getSelectableChoices(question: Question): string[] {
  if (question.choices?.includes(question.answer)) {
    return question.choices;
  }

  const allQuestions = Object.values(QUESTION_BANK_BY_EXAM).flat();
  const distractors = allQuestions
    .filter((template) => template.topicId === question.topicId && template.answer !== question.answer)
    .map((template) => template.answer)
    .filter((answer, index, answers) => answers.indexOf(answer) === index)
    .slice(0, 3);

  return stableShuffle([question.answer, ...distractors], question.id);
}

function hydrateQuestion(
  template: QuestionTemplate,
  index: number,
  topicName: string,
  focus?: string,
): Question {
  const focusSuffix = focus?.trim() ? ` 추가 요청 반영: ${focus.trim()}` : "";
  return {
    ...template,
    id: `${template.topicId}-${template.keyword}-${template.difficulty}-${index}`.replace(/\s+/g, "-"),
    prompt: `${template.prompt}${focusSuffix}`,
    topicName,
    typeLabel: typeLabels[template.type],
    difficultyLabel: difficultyLabels[template.difficulty],
  };
}

function repeatToCount(templates: QuestionTemplate[], count: number): QuestionTemplate[] {
  if (templates.length === 0) {
    return [];
  }

  const result: QuestionTemplate[] = [];
  for (let index = 0; index < count; index += 1) {
    const shifted = (index + difficultyOrder.length) % templates.length;
    result.push(templates[shifted]);
  }
  return result;
}

function uniqueByPrompt(templates: QuestionTemplate[]): QuestionTemplate[] {
  const seen = new Set<string>();
  return templates.filter((template) => {
    if (seen.has(template.prompt)) {
      return false;
    }
    seen.add(template.prompt);
    return true;
  });
}

function stableShuffle(values: string[], seed: string): string[] {
  return [...values].sort((left, right) => score(seed, left) - score(seed, right));
}

function score(seed: string, value: string): number {
  return `${seed}-${value}`.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}
