export type TopicId =
  | "design-patterns"
  | "diagrams"
  | "osi"
  | "coverage"
  | "security-attacks"
  | "modern-tech"
  | "software-engineering"
  | "database"
  | "testing";

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType = "short" | "multiple-choice" | "scenario";

export interface Topic {
  id: TopicId;
  name: string;
  description: string;
  keywords: string[];
}

export interface QuestionTemplate {
  topicId: TopicId;
  keyword: string;
  difficulty: Difficulty;
  type: QuestionType;
  prompt: string;
  answer: string;
  explanation: string;
  choices?: string[];
}

export interface Question extends QuestionTemplate {
  id: string;
  topicName: string;
  typeLabel: string;
  difficultyLabel: string;
}

export interface GenerateQuestionInput {
  topicId: TopicId;
  difficulty: Difficulty;
  count: number;
  focus?: string;
}

export interface QuestionGenerator {
  generate(input: GenerateQuestionInput): Promise<Question[]> | Question[];
}
