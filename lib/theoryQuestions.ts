import { CONCEPTS_BY_EXAM } from "./concepts";
import type { ConceptItem } from "./concepts";
import type { ExamId, QuestionTemplate, TopicId } from "./types";
import { EXTRA_QUESTIONS_BY_TOPIC } from "./extraQuestions";

// Only these sections have individual, unambiguous terms as their theory titles.
const definitionTopics = new Set<TopicId>([
  "diagrams", "osi", "coverage", "security-attacks",
  "modern-tech", "software-engineering", "cohesion-coupling", "database", "testing",
]);

// Named sub-concepts in grouped theory sections. Generic labels such as
// "장점", "주의", and "문제" are deliberately not turned into answers.
const detailTerms = new Set([
  "Atomicity", "Consistency", "Isolation", "Durability", "삽입 이상", "삭제 이상", "갱신 이상",
  "단위 테스트", "통합 테스트", "시스템 테스트", "인수 테스트",
  "데이터", "정보", "지식", "지혜", "공통화", "표출화", "연결화", "내면화",
  "Volume", "Variety", "Velocity", "Veracity", "Value",
  "데이터 웨어하우스", "데이터 레이크", "데이터 마트", "하향식 접근", "상향식 접근",
  "CRISP-DM", "KDD 방법론", "SEMMA 방법론", "ETL", "ELT", "CDC",
  "가명처리", "총계처리", "데이터 마스킹", "범주화", "왜도", "첨도",
  "Z-점수", "T-점수", "정규화", "다중선형회귀", "로지스틱 회귀", "ANOVA",
  "카이제곱 교차분석", "제1종 오류", "제2종 오류", "검정력", "p-value",
  "Z-검정", "t-검정", "F-검정", "카이제곱 검정", "피어슨 상관계수", "스피어만 상관계수", "PCA",
  "선형성", "독립성", "등분산성", "비상관성", "정상성", "이분산성", "L1 Lasso", "L2 Ridge",
  "ElasticNet", "다중공선성", "로짓 변환", "시그모이드 함수", "결정 초평면", "지지 벡터", "마진",
  "K-means", "eps", "min_samples", "엘보우 기법", "실루엣 계수", "응집형", "분할형", "덴드로그램",
  "지지도", "신뢰도", "향상도", "민감도 / 재현율", "특이도", "정밀도", "음성 예측도", "정확도",
  "F1-Score", "과대적합", "과소적합", "편향-분산 상충", "수정 결정계수", "데이터 누수", "개념 드리프트",
  "설명가능한 AI", "단순대체", "KNN보간", "IQR 방식", "Z-Score 방식", "Min-Max Scaling", "StandardScaler",
  "Index Range Scan", "Index Unique Scan", "Index Full Scan", "Index Fast Full Scan", "Index Skip Scan",
  "수직적 탐색", "수평적 탐색", "규칙 기반 옵티마이저", "비용 기반 옵티마이저",
  "Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable", "공유 락", "배타 락",
  "오버로딩", "오버라이딩",
]);

const commonAliases: Record<string, string[]> = {
  "Physical Layer": ["물리 계층"], "Data Link Layer": ["데이터 링크 계층"],
  "Network Layer": ["네트워크 계층"], "Transport Layer": ["전송 계층"],
  "Session Layer": ["세션 계층"], "Presentation Layer": ["표현 계층"], "Application Layer": ["응용 계층"],
  "Single Responsibility Principle": ["SRP", "단일 책임 원칙"],
  "Open-Closed Principle": ["OCP", "개방 폐쇄 원칙"],
  "Liskov Substitution Principle": ["LSP", "리스코프 치환 원칙"],
  "Interface Segregation Principle": ["ISP", "인터페이스 분리 원칙"],
  "Dependency Inversion Principle": ["DIP", "의존 역전 원칙"],
  "Waterfall Model": ["Waterfall", "폭포수 모델"], "Agile Methodology": ["Agile", "애자일"],
  "Black Box Testing": ["블랙박스 테스트"], "White Box Testing": ["화이트박스 테스트"],
  "Pesticide Paradox": ["살충제 패러독스"], "Regression Testing": ["회귀 테스트"],
  "Man-in-the-Middle": ["MITM", "중간자 공격"],
  "Database Anomaly": ["이상 현상", "Anomaly"], "Normalization": ["정규화"],
  "Database De-normalization": ["반정규화", "역정규화"],
};

// Some source notes use informal shortcuts; questions use the precise definition.
const detailDescriptions: Record<string, string> = {
  "p-value": "귀무가설이 참이라는 가정 아래, 관측된 검정통계량과 같거나 더 극단적인 결과를 얻을 확률.",
  "검정력": "귀무가설이 거짓일 때 이를 올바르게 기각할 확률. 제2종 오류 확률을 β라 하면 1-β.",
  "Z-점수": "관측값에서 평균을 뺀 뒤 표준편차로 나눈 값. 변환 후 평균은 0, 표준편차는 1이며 분포가 반드시 정규분포가 되는 것은 아님.",
  "T-점수": "T=10Z+50으로 계산하며 평균 50, 표준편차 10의 기준을 사용하는 표준점수.",
  "StandardScaler": "훈련 데이터에서 학습한 평균과 표준편차로 수치형 변수를 표준화하는 sklearn 클래스. 분포의 정규성을 보장하지 않음.",
};

function shortTerm(term: string): string {
  return term.replace(/^\d계층\s+/, "").split(/\s*[·(]/)[0].trim();
}

function hideAnswer(text: string, answers: string[]): string {
  return answers.reduce((result, answer) => {
    const escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Avoid replacing short Latin abbreviations inside other words.
    const pattern = /^[a-z0-9 -]+$/i.test(answer) ? `(?<![a-z0-9])${escaped}(?![a-z0-9])` : escaped;
    return result.replace(new RegExp(pattern, "gi"), "[빈칸]");
  }, text);
}

function termAliases(item: ConceptItem, answer: string): string[] {
  const aliases = [item.term, ...(commonAliases[answer] ?? []),
    ...Array.from(item.term.matchAll(/\(([^)]+)\)/g), (match) => match[1]),
    ...(answer.includes(" / ") ? answer.split(" / ") : []),
  ];
  return [...new Set(aliases)].filter((alias) => alias !== answer && !/\d/.test(alias));
}

function conceptQuestions(topicId: TopicId, item: ConceptItem): QuestionTemplate[] {
  const questions: QuestionTemplate[] = [];
  const answer = shortTerm(item.term);
  const aliases = termAliases(item, answer);
  // These grouped titles need their individual facts, rather than a long title as an answer.
  if (definitionTopics.has(topicId) && !["Transaction ACID", "Test Levels"].includes(answer)) {
    questions.push({
      topicId, keyword: answer, difficulty: "easy", type: "short",
      prompt: `다음 설명에 해당하는 용어를 쓰시오.\n${hideAnswer(item.summary, [answer, ...aliases])}`,
      answer, answerAliases: aliases, explanation: `${item.term}: ${item.summary}\n${item.examTip}`,
    });
  }

  for (const detail of item.details) {
    const separator = detail.indexOf(":");
    if (separator < 0) continue;
    const label = detail.slice(0, separator).trim();
    const term = shortTerm(label);
    const description = detailDescriptions[term] ?? detail.slice(separator + 1).trim();
    if (!detailTerms.has(term) || !description) continue;
    const detailAliases = termAliases({ ...item, term: label }, term);
    questions.push({
      topicId, keyword: answer, difficulty: "medium", type: "short",
      prompt: `다음 이론 설명의 빈칸에 들어갈 세부 용어를 쓰시오.\n[빈칸]: ${hideAnswer(description, [term, ...detailAliases])}`,
      answer: term, answerAliases: detailAliases, explanation: `${item.term}\n${label}: ${description}`,
    });
  }
  return questions;
}

export const THEORY_QUESTIONS_BY_EXAM = Object.fromEntries(
  Object.entries(CONCEPTS_BY_EXAM).map(([examId, sections]) => [
    examId,
    // Design-pattern questions use the dedicated practical bank in questionBank.
    sections.filter((section) => section.topicId !== "design-patterns").flatMap((section) => [
      ...section.items.flatMap((item) => conceptQuestions(section.topicId, item)),
      ...(EXTRA_QUESTIONS_BY_TOPIC[section.topicId] ?? []),
    ]),
  ]),
) as Record<ExamId, QuestionTemplate[]>;
