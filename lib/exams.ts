import { ExamInfo } from "./types";

export const EXAMS: ExamInfo[] = [
  {
    id: "infosec-practical",
    name: "정보처리기사 실기",
    description: "정보시스템 분석, 설계, 개발 및 테스트 실무 능력을 평가합니다. 실기 단답형 및 약술형 완벽 대비.",
    category: "실기",
  },
  {
    id: "bigdata-written",
    name: "빅데이터 분석기사 필기",
    description: "빅데이터 기획, 탐색, 모델링 및 결과 해석 등 필기 과목별 핵심 개념과 기출 변형 학습.",
    category: "필기",
  },
  {
    id: "bigdata-practical",
    name: "빅데이터 분석기사 실기",
    description: "R/Python을 활용한 데이터 전처리, 모델 학습, 평가 및 서술형 문항 실전 대비.",
    category: "실기",
  },
  {
    id: "sqlp",
    name: "SQLP (SQL 전문가)",
    description: "데이터베이스 모델링 및 SQL 튜닝 최적화, 실행 계획 분석 중심의 고난도 문제 완벽 대비.",
    category: "전문가",
  },
];
