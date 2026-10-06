import { QUESTION_BANK_BY_EXAM, TOPICS_BY_EXAM } from "./questionBank";
import { THEORY_QUESTIONS_BY_EXAM } from "./theoryQuestions";
import type { ExamId, GenerateQuestionInput, ProgrammingLanguage, Question, QuestionGenerator, QuestionTemplate } from "./types";

const typeLabels = { short: "단답형", scenario: "상황형" } as const;
export const MAX_QUESTION_COUNT = 50;

export function normalizeQuestionPrompt(prompt: string): string {
  return prompt.normalize("NFKC").toLowerCase().replace(/\s+/g, "");
}

function uniqueByPrompt(templates: QuestionTemplate[]): QuestionTemplate[] {
  const seen = new Set<string>();
  return templates.filter((template) => {
    const key = normalizeQuestionPrompt(template.prompt);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function resolveExam(examId?: ExamId): ExamId {
  return examId && Object.hasOwn(TOPICS_BY_EXAM, examId) ? examId : "infosec-practical";
}

const questionBanks = Object.fromEntries(
  Object.keys(TOPICS_BY_EXAM).map((exam) => {
    const examId = exam as ExamId;
    return [examId, uniqueByPrompt([...QUESTION_BANK_BY_EXAM[examId], ...THEORY_QUESTIONS_BY_EXAM[examId]])];
  }),
) as Record<ExamId, QuestionTemplate[]>;

export function getAvailableQuestionCount(examId: ExamId, topicId: string, language?: ProgrammingLanguage): number {
  return questionBanks[resolveExam(examId)].filter((question) => question.topicId === topicId &&
    (topicId !== "programming-languages" || !language || question.code?.language === language)).length;
}

// Content-derived IDs stay the same across display order and focus changes.
// Two independent 32-bit hashes keep the keys compact for browser history storage.
function questionId(examId: ExamId, template: QuestionTemplate): string {
  const content = normalizeQuestionPrompt(template.prompt);
  let first = 2166136261;
  let second = 5381;
  for (let index = 0; index < content.length; index += 1) {
    first = Math.imul(first ^ content.charCodeAt(index), 16777619);
    second = Math.imul(second, 33) ^ content.charCodeAt(index);
  }
  return `${examId}-${template.topicId}-${(first >>> 0).toString(16)}${(second >>> 0).toString(16).padStart(8, "0")}`;
}

export class LocalQuestionGenerator implements QuestionGenerator {
  constructor(private readonly random: () => number = Math.random) {}

  generate(input: GenerateQuestionInput): Question[] {
    const examId = resolveExam(input.examId);
    const topics = TOPICS_BY_EXAM[examId];
    const topic = topics.find((item) => item.id === input.topicId) ?? topics[0];
    const requestedCount = Number.isFinite(input.count) ? Math.trunc(input.count) : 5;
    const count = Math.max(1, Math.min(requestedCount, MAX_QUESTION_COUNT));
    const candidates = questionBanks[examId].filter((question) => question.topicId === topic.id &&
      (topic.id !== "programming-languages" || !input.programmingLanguage || question.code?.language === input.programmingLanguage));
    const history = new Map((input.previousQuestionIds ?? []).map((id, index) => [id, index]));
    const unseen = candidates.filter((template) => !history.has(questionId(examId, template)));
    const seen = candidates.filter((template) => history.has(questionId(examId, template)));

    // Draw from the entire topic and exhaust unseen questions first.
    const selected: QuestionTemplate[] = [];
    const keywordCounts = new Map<string, number>();
    const focusTokens = input.focus?.trim().toLowerCase().split(/[\s,，/]+/).filter((token) => token.length > 1 || token === "c") ?? [];
    this.takeBalanced(unseen, selected, count, keywordCounts, focusTokens);
    // History is ordered from oldest to newest, so an exhausted bank rotates
    // into its least recently shown questions without repeats within the batch.
    seen.sort((left, right) => history.get(questionId(examId, left))! - history.get(questionId(examId, right))!);
    selected.push(...seen.slice(0, Math.max(0, count - selected.length)));

    // Selection priorities must not become a fixed display order, including
    // when every question is available or the bank has been exhausted.
    return shuffle(selected, this.random).map((template) => {
      const { difficulty, ...content } = template;
      void difficulty;
      return {
        ...content,
        id: questionId(examId, template),
        topicName: topic.name,
        typeLabel: typeLabels[template.type],
      };
    });
  }

  private takeBalanced(
    templates: QuestionTemplate[], selected: QuestionTemplate[], count: number,
    keywordCounts: Map<string, number>, focusTokens: string[],
  ) {
    const pool = shuffle(templates, this.random);
    const answerCounts = new Map<string, number>();
    const languageCounts = new Map<ProgrammingLanguage, number>();
    for (const question of selected) {
      answerCounts.set(question.answer, (answerCounts.get(question.answer) ?? 0) + 1);
      if (question.code) languageCounts.set(question.code.language, (languageCounts.get(question.code.language) ?? 0) + 1);
    }
    while (pool.length > 0 && selected.length < count) {
      // Spread selections across theories rather than exhausting one keyword.
      // Fisher-Yates has already randomized all equal-priority candidates.
      pool.sort((left, right) => {
        const matching = (question: QuestionTemplate) => focusTokens.some((token) =>
          token === "c" ? question.code?.language === "C" : `${question.keyword} ${question.prompt}`.toLowerCase().includes(token),
        );
        return Number(matching(right)) - Number(matching(left)) ||
          (left.code && right.code ? (languageCounts.get(left.code.language) ?? 0) - (languageCounts.get(right.code.language) ?? 0) : 0) ||
          (keywordCounts.get(left.keyword) ?? 0) - (keywordCounts.get(right.keyword) ?? 0) ||
          (answerCounts.get(left.answer) ?? 0) - (answerCounts.get(right.answer) ?? 0);
      });
      const template = pool.shift()!;
      selected.push(template);
      keywordCounts.set(template.keyword, (keywordCounts.get(template.keyword) ?? 0) + 1);
      answerCounts.set(template.answer, (answerCounts.get(template.answer) ?? 0) + 1);
      if (template.code) languageCounts.set(template.code.language, (languageCounts.get(template.code.language) ?? 0) + 1);
    }
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

export function isQuestionAnswerCorrect(question: Pick<QuestionTemplate, "answer" | "answerAliases" | "answerFormat">, answer: string): boolean {
  if (question.answerFormat === "code-output") {
    // Preserve case and separators: "1 2" must not be mistaken for "12".
    // Numeric list formatting may omit spaces around brackets and commas.
    const normalizeOutput = (value: string) => value.trim().replace(/\s+/g, " ")
      .replace(/\[[\d.,\s\[\]+-]*\]/g, (list) => list.replace(/\s*([\[\],])\s*/g, "$1"));
    const actual = normalizeOutput(answer);
    return actual.length > 0 && [question.answer, ...(question.answerAliases ?? [])]
      .some((expected) => normalizeOutput(expected) === actual);
  }
  const normalize = (value: string) => value.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, "");
  const actual = normalize(answer);
  return actual.length > 0 && [question.answer, ...(question.answerAliases ?? [])].some((expected) => normalize(expected) === actual);
}

export function getSelectableChoices(question: Question): string[] {
  if (question.choices?.includes(question.answer)) return question.choices;
  const distractors = [...new Set(Object.values(questionBanks).flat()
    .filter((template) => template.topicId === question.topicId && template.answer !== question.answer)
    .map((template) => template.answer))].slice(0, 3);
  return [...question.answer, ...distractors].sort((left, right) => score(question.id, left) - score(question.id, right));
}

function shuffle<T>(values: T[], random: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function score(seed: string, value: string): number {
  return `${seed}-${value}`.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}
