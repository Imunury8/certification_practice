import type { ExamId, TopicId } from "@/lib/types";

export type TrendLevel = "최우선" | "빈출" | "반복";

export interface TrendTopic {
  rank: number;
  topicId: TopicId;
  title: string;
  level: TrendLevel;
  keywords: string[];
  concept: string;
  studyPoint: string;
}

export interface YearTrend {
  year: string;
  label: string;
  summary: string;
}

export interface ExamTrendAnalysis {
  period: string;
  basis: string;
  headline: string;
  caution: string;
  topics: TrendTopic[];
  years: YearTrend[];
}

export const EXAM_TRENDS: Record<ExamId, ExamTrendAnalysis> = {
  "infosec-practical": {
    period: "2024~2026 시행 완료 회차",
    basis: "회차별 공개 복원문제·응시 후기와 출제기준을 교차 분류",
    headline: "코딩과 SQL이 합격 점수를 만들고, 보안·DB·설계 단답이 점수를 보완합니다.",
    caution: "2026년은 현재까지 시행이 끝난 회차만 반영했습니다. 복원문제 기반이므로 문항 수는 확정 통계가 아닌 학습 우선순위입니다.",
    topics: [
      {
        rank: 1,
        topicId: "programming-languages",
        title: "C·Java·Python 코드 추적",
        level: "최우선",
        keywords: ["포인터·배열", "상속·다형성", "오버라이딩", "슬라이싱", "재귀"],
        concept: "언어 문법을 외우는 시험이 아니라 실행 순서, 값 변경, 출력 결과를 끝까지 추적하는 문제입니다.",
        studyPoint: "C의 포인터/구조체, Java의 동적 바인딩·예외, Python의 리스트·슬라이싱을 손으로 표를 그리며 추적합니다.",
      },
      {
        rank: 2,
        topicId: "database",
        title: "SQL 실행 결과와 DB 핵심",
        level: "최우선",
        keywords: ["JOIN", "서브쿼리", "GROUP BY", "DDL·DML·DCL", "트랜잭션"],
        concept: "최근 회차는 단일 문법보다 JOIN·집계·서브쿼리가 섞인 복합 SQL의 결과를 묻는 비중이 커졌습니다.",
        studyPoint: "NULL 처리와 실행 순서를 먼저 익히고, SELECT 결과표를 직접 만든 뒤 ACID·정규화·키를 연결해 학습합니다.",
      },
      {
        rank: 3,
        topicId: "security-attacks",
        title: "보안 공격과 대응",
        level: "빈출",
        keywords: ["SQL Injection", "XSS·CSRF", "스푸핑", "DoS", "암호화·인증"],
        concept: "공격 설명에서 대상, 수단, 결과를 구분해 공격명을 맞히거나 대응책을 연결하는 단답형이 반복됩니다.",
        studyPoint: "공격명만 외우지 말고 ‘입력→DB’, ‘스크립트→브라우저’, ‘인증된 사용자→위조 요청’처럼 한 줄 단서로 구분합니다.",
      },
      {
        rank: 4,
        topicId: "testing",
        title: "테스트·커버리지",
        level: "빈출",
        keywords: ["화이트박스", "분기·조건", "MC/DC", "테스트 단계", "결함 생명주기"],
        concept: "테스트 기법의 정의와 조건식으로부터 최소 테스트 케이스를 판단하는 문제가 함께 출제됩니다.",
        studyPoint: "구문→분기→조건→조건/결정→MC/DC의 보장 관계와 블랙박스 기법의 적용 목적을 비교합니다.",
      },
      {
        rank: 5,
        topicId: "software-engineering",
        title: "설계 원칙·UML·방법론",
        level: "반복",
        keywords: ["SOLID", "GoF", "UML", "응집도·결합도", "Agile"],
        concept: "설명에 맞는 패턴·다이어그램·설계 원칙을 고르는 용어형 문제가 꾸준히 나옵니다.",
        studyPoint: "목적과 구분 단서를 한 문장으로 압축하고, 유사 개념 두 개를 표로 대조해 오답을 줄입니다.",
      },
    ],
    years: [
      { year: "2024", label: "기본기 확인", summary: "언어별 코드 해석, SQL 결과, 보안·네트워크·설계 용어가 고르게 반복되었습니다." },
      { year: "2025", label: "복합 추적 강화", summary: "포인터·상속·다형성처럼 여러 규칙을 겹친 코드와 JOIN·서브쿼리 결합형 대비가 중요해졌습니다." },
      { year: "2026", label: "SQL·보안 부각", summary: "시행 완료 회차에서 SQL 문항 존재감이 커지고 보안·신기술 단답도 함께 강화되는 흐름입니다." },
    ],
  },
  "bigdata-written": {
    period: "2024년 제8회~2026년 제12회",
    basis: "최근 회차 복원 경향과 4개 공식 출제영역을 개념 단위로 재분류",
    headline: "통계적 탐색과 모델링·평가가 가장 큰 변별 영역이며, 기획은 정확한 용어 구분이 핵심입니다.",
    caution: "비공개 원문 대신 공개 복원 경향을 사용했습니다. 회차마다 세부 알고리즘은 달라도 통계→모델→평가의 연결 구조는 반복됩니다.",
    topics: [
      {
        rank: 1,
        topicId: "bigdata-exploration",
        title: "기술통계·확률·가설검정",
        level: "최우선",
        keywords: ["p-value", "정규성", "t·카이제곱", "상관분석", "PCA"],
        concept: "자료형과 가정에 맞는 검정법을 고르고 통계량·유의확률을 해석하는 문제가 반복됩니다.",
        studyPoint: "독립/대응, 연속/범주, 모수/비모수의 세 질문으로 검정법을 결정하는 표를 암기합니다.",
      },
      {
        rank: 2,
        topicId: "bigdata-modeling",
        title: "지도·비지도 학습 모델",
        level: "최우선",
        keywords: ["의사결정나무", "SVM", "앙상블", "K-means", "정규화"],
        concept: "알고리즘의 작동 원리, 장단점, 하이퍼파라미터가 어떤 과적합 문제를 조절하는지 묻습니다.",
        studyPoint: "모델별 목적·전처리 필요성·과적합 제어·해석 가능성을 한 표로 비교합니다.",
      },
      {
        rank: 3,
        topicId: "bigdata-evaluation",
        title: "평가지표와 검증",
        level: "최우선",
        keywords: ["Precision·Recall", "F1", "ROC-AUC", "RMSE", "교차검증"],
        concept: "혼동행렬에서 지표를 계산하고, 불균형 데이터나 회귀 상황에 맞는 지표를 선택하는 영역입니다.",
        studyPoint: "FP와 FN 중 무엇이 더 위험한지 먼저 판단한 뒤 Precision과 Recall을 선택합니다.",
      },
      {
        rank: 4,
        topicId: "bigdata-planning",
        title: "분석기획·방법론·거버넌스",
        level: "빈출",
        keywords: ["CRISP-DM", "KDD", "분석 마스터플랜", "개인정보", "데이터 거버넌스"],
        concept: "절차 순서와 산출물, 개인정보 처리 원칙을 정확히 구분하는 암기형 문항이 안정적인 득점원입니다.",
        studyPoint: "방법론별 단계 순서와 유사 용어를 비교하고, 가명·익명·민감정보의 차이를 사례에 적용합니다.",
      },
      {
        rank: 5,
        topicId: "bigdata-exploration",
        title: "전처리·데이터 품질",
        level: "빈출",
        keywords: ["결측치", "이상치", "스케일링", "표본추출", "데이터 변환"],
        concept: "모델 적용 전 데이터 상태에 맞는 정제·변환 기법을 선택하는 문제가 전 과목에 걸쳐 연결됩니다.",
        studyPoint: "기법의 공식보다 언제 쓰고 어떤 왜곡이 생기는지를 중심으로 정리합니다.",
      },
    ],
    years: [
      { year: "2024", label: "통계·모델 균형", summary: "전처리, 가설검정, 주요 머신러닝 알고리즘과 평가 지표가 폭넓게 출제된 흐름입니다." },
      { year: "2025", label: "응용 판단 강화", summary: "정의 암기보다 사례에 맞는 검정·모델·평가지표를 선택하는 판단형 대비가 중요했습니다." },
      { year: "2026", label: "범위 확장", summary: "필기 난도가 상승한 회차가 있어 빈출만 좁게 외우기보다 4과목 전 범위 연결 학습이 필요합니다." },
    ],
  },
  "bigdata-practical": {
    period: "2024년 제8회~2026년 제12회",
    basis: "최근 작업형 1·2·3유형 복원 주제와 공식 시험환경 기준",
    headline: "판다스 정확도, 완성 가능한 모델 파이프라인, 검정 선택과 해석이 세 축입니다.",
    caution: "데이터셋과 수치는 회차마다 달라집니다. 코드를 통째로 외우기보다 입력 확인→처리→검증→제출 순서를 고정해야 합니다.",
    topics: [
      {
        rank: 1,
        topicId: "bigdata-practical-submission",
        title: "작업형 2유형 전체 파이프라인",
        level: "최우선",
        keywords: ["전처리", "분류·회귀", "검증", "예측확률", "to_csv"],
        concept: "학습·평가 데이터를 같은 방식으로 변환하고, 문제의 평가 기준에 맞춰 예측 파일을 완성하는 고배점 유형입니다.",
        studyPoint: "target 분리→전처리→검증→학습→예측→컬럼/행 수 확인→index=False 저장의 템플릿을 반복합니다.",
      },
      {
        rank: 2,
        topicId: "bigdata-practical-submission",
        title: "작업형 3유형 통계 검정",
        level: "최우선",
        keywords: ["t-test", "Wilcoxon", "카이제곱", "회귀", "로지스틱 회귀"],
        concept: "가설을 세우고 알맞은 scipy/statsmodels 함수를 적용해 통계량·p-value·회귀계수를 해석합니다.",
        studyPoint: "귀무/대립가설, 유의수준 비교, 결론 문장을 세트로 쓰고 함수 반환값의 순서를 확인합니다.",
      },
      {
        rank: 3,
        topicId: "bigdata-practical-submission",
        title: "작업형 1유형 판다스",
        level: "최우선",
        keywords: ["loc", "groupby", "sort_values", "결측치", "날짜 처리"],
        concept: "조건 필터링과 집계·정렬·자료형 변환을 2~3단계 결합해 하나의 값을 구합니다.",
        studyPoint: "중간 결과의 shape·head를 확인하고 마지막 반올림/정수 변환 시점을 문제 문장과 맞춥니다.",
      },
      {
        rank: 4,
        topicId: "bigdata-model-training",
        title: "검증·모델 선택",
        level: "빈출",
        keywords: ["Stratified K-Fold", "Random Forest", "Gradient Boosting", "ROC-AUC", "RMSE"],
        concept: "분류와 회귀를 먼저 판별하고 제한 시간 안에 안정적인 모델과 지표를 선택하는 능력이 중요합니다.",
        studyPoint: "고비용 튜닝보다 기본 모델 2개를 같은 검증셋에서 비교하고 데이터 누수를 막는 데 집중합니다.",
      },
      {
        rank: 5,
        topicId: "bigdata-preprocessing",
        title: "결측·이상·범주형 전처리",
        level: "빈출",
        keywords: ["median", "IQR", "인코딩", "스케일링", "열 정렬"],
        concept: "훈련셋에서 정한 규칙을 테스트셋에 동일 적용하고 두 데이터의 피처 구조를 일치시켜야 합니다.",
        studyPoint: "전처리 전후 컬럼명·순서·결측 개수를 확인하는 안전 점검 코드를 습관화합니다.",
      },
    ],
    years: [
      { year: "2024", label: "3유형 정착", summary: "작업형 3유형의 가설검정·회귀 해석이 핵심 축으로 자리 잡고 1·2유형과 함께 출제되었습니다." },
      { year: "2025", label: "회귀·다중분류 반복", summary: "작업형 2유형에서 회귀와 다중분류가 번갈아 등장해 두 파이프라인 모두 준비해야 했습니다." },
      { year: "2026", label: "완주 안정성", summary: "복잡한 튜닝보다 자료형·전처리 일관성·제출 규격을 지켜 전 유형을 완주하는 전략이 여전히 유효합니다." },
    ],
  },
  sqlp: {
    period: "2024~2026 시행 완료 회차",
    basis: "공개 합격 복기, 시험 구성과 SQL 고급 활용·튜닝 출제영역 교차 분석",
    headline: "실행계획을 근거로 인덱스와 조인 순서를 설계하고 SQL을 재작성하는 능력이 합격을 가릅니다.",
    caution: "SQLP 원문 기출은 공개되지 않아 복기와 공식 범위를 기반으로 우선순위를 정했습니다. 특정 힌트 암기보다 데이터 건수와 처리량 판단이 먼저입니다.",
    topics: [
      {
        rank: 1,
        topicId: "sql-index-tuning",
        title: "인덱스 구조·설계·스캔",
        level: "최우선",
        keywords: ["B*Tree", "Range Scan", "결합 인덱스", "선택도", "클러스터링 팩터"],
        concept: "조건절과 데이터 분포를 보고 액세스 범위를 줄이는 인덱스 컬럼·순서를 설계하는 영역입니다.",
        studyPoint: "수직 탐색과 수평 스캔, 테이블 랜덤 액세스량을 실행계획의 A-Rows·Buffers와 연결합니다.",
      },
      {
        rank: 2,
        topicId: "sql-join-tuning",
        title: "조인 방식·순서 선택",
        level: "최우선",
        keywords: ["NL Join", "Hash Join", "Sort Merge", "Driving", "조인 카디널리티"],
        concept: "필터 후 건수와 인덱스 유무를 근거로 드라이빙 테이블과 조인 메커니즘을 결정합니다.",
        studyPoint: "최초 응답/전체 처리, 소량/대량, 등가/비등가의 세 축으로 조인 방식을 설명할 수 있어야 합니다.",
      },
      {
        rank: 3,
        topicId: "sql-optimizer-plan",
        title: "옵티마이저·실행계획·힌트",
        level: "최우선",
        keywords: ["CBO", "카디널리티", "LEADING", "UNNEST", "Predicate"],
        concept: "실행계획의 처리 순서와 예상/실제 건수 차이에서 병목 원인을 찾고 쿼리 변환을 통제합니다.",
        studyPoint: "힌트 이름만 암기하지 말고 왜 조인 순서·방식·분배 방식이 바뀌어야 하는지 근거를 씁니다.",
      },
      {
        rank: 4,
        topicId: "sql-optimizer-plan",
        title: "SQL 재작성·파티션 튜닝",
        level: "빈출",
        keywords: ["서브쿼리 Unnesting", "Semi Join", "파티션 Pruning", "Top-N", "윈도우 함수"],
        concept: "같은 결과를 유지하면서 불필요한 반복 액세스·정렬·전체 파티션 스캔을 줄이는 실기형 주제입니다.",
        studyPoint: "변경 전후 실행계획에서 읽는 블록과 중간 집합이 왜 줄었는지 서술하는 연습을 합니다.",
      },
      {
        rank: 5,
        topicId: "db-lock-concurrency",
        title: "락·트랜잭션·MVCC",
        level: "반복",
        keywords: ["TX Lock", "MVCC", "Undo", "격리수준", "Deadlock"],
        concept: "동시 변경 상황에서 일관성 읽기, 블로킹, 교착상태가 발생하는 원리를 묻습니다.",
        studyPoint: "세션 A/B의 시간 순서로 락 획득·대기·커밋 이후 결과를 그려 봅니다.",
      },
    ],
    years: [
      { year: "2024", label: "실기형 튜닝", summary: "ERD와 요구사항을 바탕으로 파티션 인덱스·조회 SQL을 개선하는 실무형 복기가 확인됩니다." },
      { year: "2025", label: "근거 중심", summary: "인덱스·조인·옵티마이저를 분리 암기하기보다 데이터 분포와 실행계획으로 선택 근거를 설명하는 학습이 중요했습니다." },
      { year: "2026", label: "전 범위 연결", summary: "고급 활용·튜닝이 중심이지만 데이터 모델링과 SQL 기본·활용까지 함께 확보해야 높은 합격선을 안정적으로 넘을 수 있습니다." },
    ],
  },
  "hazmat-industrial": {
    period: "2024~2026 시행 완료 회차",
    basis: "필기·실기 공개 복원 경향과 Q-Net 출제기준의 반복 항목을 통합 분석",
    headline: "류별 성상·지정수량을 중심축으로 반응식, 소화법, 법령 계산을 연결해야 합니다.",
    caution: "법령 수치와 시설 기준은 개정될 수 있으므로 시험 직전 최신 위험물안전관리법령을 다시 확인해야 합니다.",
    topics: [
      {
        rank: 1,
        topicId: "hazmat-class4",
        title: "제4류 인화성 액체",
        level: "최우선",
        keywords: ["인화점", "특수인화물", "석유류", "수용성", "포소화"],
        concept: "품명·인화점 범위·수용성 여부에 따라 지정수량과 적응 소화법을 판단하는 중심 영역입니다.",
        studyPoint: "특수→1석→알코올→2석→3석→4석·동식물유 순서와 수용성 지정수량 2배를 표로 암기합니다.",
      },
      {
        rank: 2,
        topicId: "hazmat-class3",
        title: "제3류 금수성·자연발화",
        level: "최우선",
        keywords: ["칼륨·나트륨", "황린", "알킬알루미늄", "카바이드", "발생가스"],
        concept: "물과 반응해 생기는 수소·아세틸렌·메탄과 보관액, 예외 소화법을 반응식으로 묻습니다.",
        studyPoint: "물기엄금 원칙과 황린의 물속 저장 예외를 구분하고 반응물→생성가스 계수를 직접 맞춥니다.",
      },
      {
        rank: 3,
        topicId: "fire-extinction",
        title: "화학 반응식·연소·소화",
        level: "최우선",
        keywords: ["연소 4요소", "인화·연소·발화점", "분말약제", "소화설비", "위험도"],
        concept: "연소 원리와 위험물별 적응 소화약제를 연결하고 반응식·수원량을 계산하는 문제가 반복됩니다.",
        studyPoint: "냉각·질식·제거·억제 중 작동 원리를 먼저 판정한 뒤 위험물의 금수성 예외를 확인합니다.",
      },
      {
        rank: 4,
        topicId: "hazmat-law",
        title: "지정수량 배수·법령",
        level: "빈출",
        keywords: ["배수 합산", "보유공지", "혼재", "표지", "선임 기한"],
        concept: "여러 위험물의 지정수량 배수를 합산하고 시설·운반·저장 기준의 숫자를 적용합니다.",
        studyPoint: "수량÷지정수량을 품목별로 계산해 합산하고, 법령 숫자는 단위와 적용 시설을 함께 암기합니다.",
      },
      {
        rank: 5,
        topicId: "hazmat-class1",
        title: "제1·2·5·6류 성상 비교",
        level: "빈출",
        keywords: ["산화성", "가연성", "자기반응성", "불연성", "지정수량"],
        concept: "고체/액체, 산화성/가연성, 자체 산소 보유 여부로 류를 구분하고 소화 원칙을 고릅니다.",
        studyPoint: "각 류를 상태·위험성·대표 품명·지정수량·소화법의 5열 표로 묶어 비교합니다.",
      },
    ],
    years: [
      { year: "2024", label: "류별 기본 반복", summary: "대표 품명, 지정수량, 물과의 반응, 적응 소화약제를 묶은 전형적 문제가 중심이었습니다." },
      { year: "2025", label: "계산·시설 결합", summary: "지정수량 배수와 소화설비·시설 기준을 함께 적용하는 계산형 대비 중요도가 높았습니다." },
      { year: "2026", label: "법령 최신성", summary: "기본 반응식과 류별 성상은 계속 핵심이며 법령·시설 숫자는 최신 기준 확인이 필수입니다." },
    ],
  },
};
