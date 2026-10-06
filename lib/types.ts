export type ExamId = "infosec-practical" | "bigdata-written" | "bigdata-practical" | "sqlp" | "hazmat-industrial";

export type TopicId =
  | "design-patterns"
  | "diagrams"
  | "osi"
  | "coverage"
  | "security-attacks"
  | "modern-tech"
  | "software-engineering"
  | "database"
  | "testing"
  | "bigdata-planning"
  | "bigdata-exploration"
  | "bigdata-modeling"
  | "bigdata-evaluation"
  | "bigdata-preprocessing"
  | "bigdata-model-training"
  | "bigdata-practical-submission"
  | "sql-tuning"
  | "sql-index-tuning"
  | "sql-join-tuning"
  | "sql-optimizer-plan"
  | "db-lock-concurrency"
  | "programming-languages"
  | "cohesion-coupling"
  | "hazmat-properties"
  | "hazmat-class1"
  | "hazmat-class2"
  | "hazmat-class3"
  | "hazmat-class4"
  | "hazmat-class5"
  | "hazmat-class6"
  | "fire-extinction"
  | "hazmat-general-chem"
  | "hazmat-law";

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType = "short" | "scenario";

export type ProgrammingLanguage = "C" | "Java" | "Python";

export interface Topic {
  id: TopicId;
  name: string;
  description: string;
  keywords: string[];
}

export interface QuestionTemplate {
  topicId: TopicId;
  keyword: string;
  // Legacy authoring metadata; generation and display do not use difficulty.
  difficulty?: Difficulty;
  type: QuestionType;
  prompt: string;
  answer: string;
  explanation: string;
  choices?: string[];
  answerAliases?: string[];
  code?: { language: ProgrammingLanguage; source: string };
  answerFormat?: "code-output";
}

export interface Question extends Omit<QuestionTemplate, "difficulty"> {
  id: string;
  topicName: string;
  typeLabel: string;
}

export interface GenerateQuestionInput {
  examId?: ExamId;
  topicId: TopicId;
  count: number;
  focus?: string;
  previousQuestionIds?: string[];
  programmingLanguage?: ProgrammingLanguage;
}

export interface QuestionGenerator {
  generate(input: GenerateQuestionInput): Promise<Question[]> | Question[];
}

export interface ExamInfo {
  id: ExamId;
  name: string;
  description: string;
  category: string;
}
