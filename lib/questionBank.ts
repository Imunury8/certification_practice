import type { QuestionTemplate, Topic, ExamId } from "@/lib/types";
import { DESIGN_PATTERN_NAMES, DESIGN_PATTERN_QUESTIONS } from "./designPatternQuestions";

export const TOPICS_BY_EXAM: Record<ExamId, Topic[]> = {
  "infosec-practical": [
  {
    id: "design-patterns",
    name: "디자인 패턴",
    description: "특징과 적용 상황을 읽고 GoF 23개 디자인 패턴의 이름을 맞히는 실기 단답형 문제입니다.",
    keywords: DESIGN_PATTERN_NAMES,
  },
  {
    id: "diagrams",
    name: "다이어그램 종류",
    description: "UML 구조/행위 다이어그램과 요구사항 분석 산출물을 구분합니다.",
    keywords: ["Use Case", "Class", "Sequence", "Activity", "State", "ERD"],
  },
  {
    id: "osi",
    name: "OSI 7계층",
    description: "계층별 역할, 장비, 프로토콜, 데이터 단위를 연결해 봅니다.",
    keywords: ["Physical", "Data Link", "Network", "Transport", "Session", "Presentation", "Application"],
  },
  {
    id: "coverage",
    name: "커버리지 종류",
    description: "화이트박스 테스트 기준인 구문, 분기, 조건, 경로 커버리지를 비교합니다.",
    keywords: ["구문", "분기", "조건", "경로", "MC/DC"],
  },
  {
    id: "security-attacks",
    name: "해킹 공격 종류",
    description: "실기 단답형에 자주 나오는 공격 기법과 방어 개념을 정리합니다.",
    keywords: ["SQL Injection", "XSS", "CSRF", "DoS", "Sniffing", "Phishing", "Ransomware"],
  },
  {
    id: "modern-tech",
    name: "최신 기술 현황",
    description: "클라우드, AI, 데이터, 블록체인, 보안 신기술 용어를 폭넓게 다룹니다.",
    keywords: ["Generative AI", "Edge Computing", "Zero Trust", "MLOps", "Kubernetes", "Digital Twin"],
  },
  {
    id: "software-engineering",
    name: "소프트웨어 개발 방법론",
    description: "전통적/애자일 개발 프로세스 및 SOLID 객체지향 설계 원칙을 이해합니다.",
    keywords: ["Waterfall", "Agile", "XP", "Scrum", "SRP", "OCP", "LSP", "ISP", "DIP"],
  },
  {
    id: "cohesion-coupling",
    name: "응집도와 결합도",
    description: "소프트웨어 설계 품질 기준인 응집도의 7단계 및 결합도의 6단계의 특징을 학습합니다.",
    keywords: ["응집도", "결합도", "우논시절통순기", "자스제외공내"],
  },
  {
    id: "database",
    name: "데이터베이스 설계",
    description: "트랜잭션 ACID 특징, DB 이상 현상, 정규화(1NF~5NF) 과정을 다룹니다.",
    keywords: ["ACID", "Anomaly", "Normalization", "De-normalization", "4NF", "5NF"],
  },
  {
    id: "testing",
    name: "애플리케이션 테스트",
    description: "블랙박스/화이트박스 테스트, 테스트 단계, 살충제 패러독스를 점검합니다.",
    keywords: ["Black Box", "White Box", "Test Levels", "Pesticide Paradox", "Regression"],
  },
  {
    id: "programming-languages",
    name: "프로그래밍 언어 활용",
    description: "정처기 실기 기출 1순위인 C, Java, Python 문법과 코드 분석 능력을 점검합니다.",
    keywords: ["C", "Java", "Python", "Pointer", "Inheritance", "Slicing"],
  },
  ],
  "bigdata-written": [
    {
      id: "bigdata-planning",
      name: "빅데이터 기획",
      description: "빅데이터 기획 단계의 기획안 수립, 생명주기 및 규제 검토를 다룹니다.",
      keywords: ["3V", "5V", "CRISP-DM", "개인정보보호"],
    },
    {
      id: "bigdata-exploration",
      name: "데이터 탐색 및 통계",
      description: "기술통계, 상관분석(피어슨/스피어만), 가설검정 p-value 및 PCA 기법을 학습합니다.",
      keywords: ["Correlation", "p-value", "PCA"],
    },
    {
      id: "bigdata-modeling",
      name: "데이터 모델링",
      description: "지도학습(SVM, 의사결정나무 등), 비지도학습(군집분석) 및 과적합 규제를 학습합니다.",
      keywords: ["SVM", "K-Means", "L1/L2 Regularization"],
    },
    {
      id: "bigdata-evaluation",
      name: "분석 결과 해석",
      description: "분류 모델 평가지표(ROC-AUC, F1), 회귀 평가지표 및 편향-분산 상충을 이해합니다.",
      keywords: ["Precision/Recall", "R-squared", "Bias-Variance"],
    }
  ],
  "bigdata-practical": [
    {
      id: "bigdata-preprocessing",
      name: "데이터 전처리 및 특성공학",
      description: "결측치 보간(KNNImputer), 이상치 검출(IQR) 및 스케일러 적용 기법을 평가합니다.",
      keywords: ["KNNImputer", "IQR", "Scaling"],
    },
    {
      id: "bigdata-model-training",
      name: "모델 학습 및 하이퍼파라미터 튜닝",
      description: "층화 교차검증(Stratified K-Fold), 랜덤 포레스트/XGBoost 및 파라미터 조율을 다룹니다.",
      keywords: ["Stratified K-Fold", "Random Forest", "XGBoost"],
    },
    {
      id: "bigdata-practical-submission",
      name: "실기 제출 및 평가",
      description: "작업형 1유형 판다스 조작, 작업형 2유형 to_csv 저장 포맷, 작업형 3유형 scipy 통계 검정을 학습합니다.",
      keywords: ["to_csv", "scipy.stats", "ttest_ind"],
    }
  ],
  "sqlp": [
    {
      id: "sql-index-tuning",
      name: "인덱스 튜닝 및 설계",
      description: "인덱스 스캔 방식(Range/Unique/Full/Skip) 및 결합 인덱스 컬럼 설계 순서를 다룹니다.",
      keywords: ["Index Scan", "Index Skip Scan", "Covered Index"],
    },
    {
      id: "sql-join-tuning",
      name: "조인 튜닝",
      description: "Nested Loops Join, Sort Merge Join, Hash Join 작동 방식과 최적화 기법을 학습합니다.",
      keywords: ["NL Join", "Sort Merge Join", "Hash Join"],
    },
    {
      id: "sql-optimizer-plan",
      name: "옵티마이저와 실행계획",
      description: "옵티마이저 비용 산정 방식, 핵심 힌트 사용법 및 실행계획 분석 기법을 점검합니다.",
      keywords: ["Optimizer", "Hints", "Execution Plan"],
    },
    {
      id: "db-lock-concurrency",
      name: "락과 동시성 제어",
      description: "공유/배타 락, 트랜잭션 격리 수준 및 MVCC 동시성 제어 모델을 평가합니다.",
      keywords: ["Isolation Level", "Deadlock", "Undo Segment"],
    }
  ],
  "hazmat-industrial": [
    {
      id: "hazmat-class1",
      name: "제1류 위험물 (산화성 고체)",
      description: "아염소산/염소산/과염소산/무기과산화물 등 산화성 고체의 성질, 지정수량, 무기과산화물 금수성 소화.",
      keywords: ["아염소산염류(50kg)", "염소산염류(50kg)", "무기과산화물(50kg)", "질산염류(300kg)", "과망간산염류(1000kg)", "주수소화", "O2 방출"],
    },
    {
      id: "hazmat-class2",
      name: "제2류 위험물 (가연성 고체)",
      description: "황화린/적린/유황, 철분/금속분/마그네슘, 인화성 고체의 착화 위험, 지정수량 및 수소 가스 발생 금수성.",
      keywords: ["황화린(100kg)", "적린(100kg)", "유황(100kg)", "철분/마그네슘(500kg)", "인화성고체(1000kg)", "H2 방출"],
    },
    {
      id: "hazmat-class3",
      name: "제3류 위험물 (자연발화·금수성)",
      description: "칼륨/나트륨, 황린, 알킬알루미늄, 탄화칼슘(카바이드)의 보관액(물/등유), 수소/아세틸렌/메탄 발생 반응.",
      keywords: ["칼륨/나트륨(10kg)", "황린(20kg)", "알킬알루미늄(10kg)", "탄화칼슘(300kg)", "등유 보관", "물속 보관", "C2H2/CH4"],
    },
    {
      id: "hazmat-class4",
      name: "제4류 위험물 (인화성 액체)",
      description: "특수인화물, 제1~제4석유류, 알코올류, 동식물유류의 인화점 기준, 비수용성/수용성 2배 지정수량, 포소화.",
      keywords: ["특수인화물(50L)", "제1석유류(200/400L)", "알코올류(400L)", "제2석유류(1000/2000L)", "제3석유류(2000/4000L)", "인화점 사다리"],
    },
    {
      id: "hazmat-class5",
      name: "제5류 위험물 (자기반응성 물질)",
      description: "유기과산화물, 질산에스테르류, 니트로화합물의 자체 산소 함유 특성, 대량 주수 냉각소화, 지정수량.",
      keywords: ["유기과산화물(10kg)", "질산에스테르류(10kg)", "히드록실아민(100kg)", "니트로화합물(200kg)", "질식소화 불가"],
    },
    {
      id: "hazmat-class6",
      name: "제6류 위험물 (산화성 액체)",
      description: "과염소산, 과산화수소(36wt% 이상), 질산(비중 1.49 이상)의 불연성·강산화성 특성, 물 희석소화, 지정수량 300kg.",
      keywords: ["과염소산(300kg)", "과산화수소(300kg)", "질산(300kg)", "희석소화", "비중 > 1"],
    },
    {
      id: "fire-extinction",
      name: "화재예방과 소화방법",
      description: "연소의 3요소/4요소, 인화점·연소점·발화점, 4대 소화원리, A·B·C·D급 화재, 분말소화약제, 위험도 공식.",
      keywords: ["연소 4요소", "인화점<연소점<발화점", "제거/질식/냉각/억제", "제3종 분말", "위험도 H"],
    },
    {
      id: "hazmat-law",
      name: "위험물안전관리법령 및 배수·혼재",
      description: "지정수량 배수 계산, 차량 혼재 가능 기준(423/524/61), 안전표지 및 주의사항 게시판 색상, 안전관리자 선임.",
      keywords: ["지정수량 배수 합산", "혼재 4-2-3 / 5-2-4 / 6-1", "물기엄금(청색)", "화기엄금(적색)", "재선임 30일/신고 14일"],
    },
  ]
};

export const QUESTION_BANK_BY_EXAM: Record<ExamId, QuestionTemplate[]> = {
  "infosec-practical": [
  ...DESIGN_PATTERN_QUESTIONS,
  {
    topicId: "diagrams",
    keyword: "Use Case",
    difficulty: "easy",
    type: "short",
    prompt: "사용자와 시스템 사이의 상호작용 및 시스템 기능을 외부 관점에서 표현하는 UML 다이어그램은?",
    answer: "Use Case Diagram",
    explanation: "유스케이스 다이어그램은 액터와 유스케이스 관계를 통해 기능 요구사항을 표현합니다.",
  },
  {
    topicId: "diagrams",
    keyword: "Sequence",
    difficulty: "medium",
    type: "short",
    prompt: "객체 간 메시지 흐름을 시간 순서대로 표현하는 UML 다이어그램은?",
    answer: "Sequence Diagram",
    explanation: "시퀀스 다이어그램은 생명선과 메시지로 객체 간 동적 상호작용을 표현합니다.",
  },
  {
    topicId: "diagrams",
    keyword: "Class",
    difficulty: "medium",
    type: "short",
    prompt: "클래스의 속성, 연산, 클래스 간 관계를 정적으로 표현하는 UML 구조 다이어그램은?",
    answer: "Class Diagram",
    explanation: "클래스 다이어그램은 상속, 연관, 집합, 합성 등 정적 구조를 표현합니다.",
  },
  {
    topicId: "diagrams",
    keyword: "Activity",
    difficulty: "hard",
    type: "scenario",
    prompt: "업무 처리 절차의 분기, 병합, 병렬 흐름을 모델링하려 한다. 가장 알맞은 다이어그램은?",
    answer: "Activity Diagram",
    explanation: "활동 다이어그램은 처리 흐름과 제어 흐름을 표현해 업무 프로세스 모델링에 적합합니다.",
  },
  {
    topicId: "osi",
    keyword: "Network",
    difficulty: "easy",
    type: "short",
    prompt: "IP 주소를 기반으로 경로 선택과 패킷 전달을 수행하는 OSI 계층은?",
    answer: "Network Layer",
    explanation: "네트워크 계층은 라우팅과 논리 주소 지정을 담당합니다.",
  },
  {
    topicId: "osi",
    keyword: "Transport",
    difficulty: "medium",
    type: "short",
    prompt: "TCP와 UDP가 속하며 종단 간 신뢰성 있는 전송을 담당하는 계층은?",
    answer: "Transport Layer",
    explanation: "전송 계층은 포트 번호, 흐름 제어, 오류 제어, 세그먼트 전송을 다룹니다.",
  },
  {
    topicId: "osi",
    keyword: "Data Link",
    difficulty: "medium",
    type: "short",
    prompt: "MAC 주소 기반 프레임 전송과 오류 검출을 담당하는 OSI 계층은?",
    answer: "Data Link Layer",
    explanation: "데이터 링크 계층은 인접 노드 간 프레임 전달을 담당하며 스위치와 관련이 깊습니다.",
  },
  {
    topicId: "osi",
    keyword: "Presentation",
    difficulty: "hard",
    type: "scenario",
    prompt: "문자 인코딩 변환, 암호화, 압축과 가장 관련이 깊은 OSI 계층은?",
    answer: "Presentation Layer",
    explanation: "표현 계층은 응용 데이터의 표현 방식 변환, 암호화, 압축을 담당합니다.",
  },
  {
    topicId: "coverage",
    keyword: "구문",
    difficulty: "easy",
    type: "short",
    prompt: "소스코드의 모든 실행 문장이 최소한 한 번은 실행되도록 테스트 케이스를 설계하는 화이트박스 테스트 검증 기준(한글 명칭)은 무엇인가?",
    answer: "구문 커버리지",
    explanation: "구문 커버리지(Statement Coverage) 혹은 문장 커버리지는 프로그램 내의 모든 실행 명령문을 한 번 이상 수행하도록 테스트하는 기준입니다.",
  },
  {
    topicId: "coverage",
    keyword: "분기",
    difficulty: "medium",
    type: "short",
    prompt: "소스코드의 모든 결정 지점(분기)의 참(True)과 거짓(False) 결과가 최소한 한 번은 실행되도록 테스트 케이스를 설계하는 검증 기준은 무엇인가?",
    answer: "분기 커버리지 (Branch / Decision Coverage)",
    explanation: "분기 커버리지(Branch Coverage) 혹은 결정 커버리지는 결정 지점의 모든 분기 경로(참/거짓)를 최소한 한 번 이상 통과하도록 테스트합니다.",
  },
  {
    topicId: "coverage",
    keyword: "조건",
    difficulty: "medium",
    type: "short",
    prompt: "결정 지점 내에 있는 개별 조건식의 결과가 참(True)과 거짓(False)을 최소한 한 번은 갖도록 테스트 케이스를 설계하는 기준(한글 명칭)은 무엇인가?",
    answer: "조건 커버리지",
    explanation: "조건 커버리지(Condition Coverage)는 전체 결정식의 참/거짓 결과와 상관없이, 결정식 내부의 개별 조건식들의 결과가 참/거짓을 갖도록 검증하는 기준입니다.",
  },
  {
    topicId: "coverage",
    keyword: "경로",
    difficulty: "hard",
    type: "scenario",
    prompt: "프로그램 내에서 수행 가능한 모든 실행 경로를 철저히 검증하는 기준으로, 완벽한 검증이 가능하지만 분기가 많을 시 경로 수가 폭발하여 현실적으로 한계가 있는 화이트박스 테스트 기준(한글 명칭)은 무엇인가?",
    answer: "경로 커버리지",
    explanation: "경로 커버리지(Path Coverage)는 결정 지점들의 모든 가능한 조합 경로를 다 거치도록 테스트하는 가장 강력한 기준입니다.",
  },
  {
    topicId: "security-attacks",
    keyword: "SQL Injection",
    difficulty: "easy",
    type: "short",
    prompt: "입력값에 악의적인 SQL 문을 삽입해 DB를 비정상 조작하는 공격은?",
    answer: "SQL Injection",
    explanation: "SQL 삽입 공격은 파라미터 바인딩, 입력 검증, ORM 사용 등으로 완화할 수 있습니다.",
  },
  {
    topicId: "security-attacks",
    keyword: "XSS",
    difficulty: "medium",
    type: "short",
    prompt: "웹 페이지에 악성 스크립트를 삽입해 사용자의 브라우저에서 실행시키는 공격은?",
    answer: "XSS",
    explanation: "크로스 사이트 스크립팅은 출력 인코딩, CSP, 입력 검증으로 방어합니다.",
  },
  {
    topicId: "security-attacks",
    keyword: "CSRF",
    difficulty: "medium",
    type: "short",
    prompt: "인증된 사용자의 권한을 이용해 사용자가 의도하지 않은 요청을 보내게 하는 공격은?",
    answer: "CSRF",
    explanation: "CSRF는 토큰 검증, SameSite 쿠키, 재인증 요구 등으로 줄일 수 있습니다.",
  },
  {
    topicId: "security-attacks",
    keyword: "DoS",
    difficulty: "hard",
    type: "scenario",
    prompt: "대량의 트래픽이나 요청으로 서비스 자원을 고갈시켜 정상 이용을 방해하는 공격은?",
    answer: "DoS 또는 DDoS",
    explanation: "분산된 여러 장비가 동시에 공격하면 DDoS이며, 트래픽 필터링과 rate limit이 중요합니다.",
  },
  {
    topicId: "modern-tech",
    keyword: "Generative AI",
    difficulty: "easy",
    type: "short",
    prompt: "텍스트, 이미지, 코드 등 새로운 콘텐츠를 생성하는 인공지능 기술을 무엇이라 하는가?",
    answer: "Generative AI",
    explanation: "생성형 AI는 학습한 패턴을 바탕으로 새 콘텐츠를 생성하는 기술입니다.",
  },
  {
    topicId: "modern-tech",
    keyword: "Zero Trust",
    difficulty: "medium",
    type: "short",
    prompt: "내부망도 기본적으로 신뢰하지 않고 모든 접근을 지속 검증하는 보안 모델은?",
    answer: "Zero Trust",
    explanation: "제로 트러스트는 명시적 검증, 최소 권한, 침해 가정을 핵심 원칙으로 합니다.",
  },
  {
    topicId: "modern-tech",
    keyword: "MLOps",
    difficulty: "medium",
    type: "short",
    prompt: "머신러닝 모델의 개발, 배포, 운영, 모니터링을 자동화하고 관리하는 방법론은?",
    answer: "MLOps",
    explanation: "MLOps는 ML과 DevOps 관행을 결합해 모델 생명주기를 안정적으로 운영합니다.",
  },
  {
    topicId: "modern-tech",
    keyword: "Digital Twin",
    difficulty: "hard",
    type: "scenario",
    prompt: "현실 세계의 설비나 공정을 가상 공간에 복제해 시뮬레이션과 분석에 활용하는 기술은?",
    answer: "Digital Twin",
    explanation: "디지털 트윈은 현실 객체의 상태 데이터를 반영한 가상 모델로 예측과 최적화에 쓰입니다.",
  },
  {
    topicId: "software-engineering",
    keyword: "Agile",
    difficulty: "easy",
    type: "short",
    prompt: "고객과의 소통과 변화에 대한 빠른 대응을 중요하게 생각하는 반복적이고 점진적인 소프트웨어 개발 방법론의 총칭은 무엇인가?",
    answer: "Agile",
    explanation: "애자일 방법론은 계획 중심의 폭포수 모델에 대비되는 고객 중심, 변화 대응 중심의 개발론입니다.",
  },
  {
    topicId: "software-engineering",
    keyword: "OCP",
    difficulty: "medium",
    type: "short",
    prompt: "객체지향 설계 5대 원칙(SOLID) 중 '소프트웨어 개체는 확장에 대해 열려 있어야 하고 수정에 대해서는 닫혀 있어야 한다'는 원칙은 무엇인가?",
    answer: "개방-폐쇄 원칙 (Open-Closed Principle)",
    explanation: "개방-폐쇄 원칙(OCP)은 기존 코드를 수정하지 않고 확장이 가능해야 함을 의미합니다.",
  },
  {
    topicId: "software-engineering",
    keyword: "Scrum",
    difficulty: "hard",
    type: "scenario",
    prompt: "한 프로젝트 팀이 3주간의 '스프린트'를 주기로 삼아 개발하고 매일 아침 간단히 진행 상황과 장애 요소를 공유하고 있다. 이 애자일 기법은 무엇인가?",
    answer: "Scrum",
    explanation: "스크럼은 PO, 스크럼 마스터와 함께 주기적인 스프린트와 일일 스크럼 미팅을 통해 협업하는 관리 프레임워크입니다.",
  },
  {
    topicId: "cohesion-coupling",
    keyword: "응집도",
    difficulty: "medium",
    type: "short",
    prompt: "모듈 내부의 구성 요소들이 단일한 목적이나 하나의 기능만을 수행하기 위해 밀접하게 관련되어 있는 상태로, 독립성이 가장 높은 최우수의 응집도(한글 명칭)는 무엇인가?",
    answer: "기능적 응집도",
    explanation: "기능적 응집도(Functional Cohesion)는 모듈 내의 모든 요소가 단일 기능을 수행하기 위해 유기적으로 묶인 가장 강하고 이상적인 응집도 단계입니다.",
  },
  {
    topicId: "cohesion-coupling",
    keyword: "결합도",
    difficulty: "hard",
    type: "short",
    prompt: "두 모듈이 파라미터나 인수로 데이터를 주고받지 않고, 동일한 전역 데이터 영역(Global Variable 등)을 공동으로 참조하여 상호작용하는 결합도로, 의존성이 높아 바람직하지 않은 결합도(한글 명칭)는 무엇인가?",
    answer: "공통 결합도",
    explanation: "공통 결합도(Common Coupling)는 여러 모듈이 공통 전역 변수나 공유 데이터 영역을 참조함으로써 맺어지는 결합도로, 오류 발생 시 영향 파급 범위가 넓어집니다.",
  },
  {
    topicId: "database",
    keyword: "ACID",
    difficulty: "easy",
    type: "short",
    prompt: "트랜잭션 연산이 데이터베이스에 모두 반영되거나 아예 반영되지 않아야 하는(All or Nothing) 원자성을 포함하는 트랜잭션의 4대 특징을 일컫는 약어는 무엇인가?",
    answer: "ACID",
    explanation: "트랜잭션의 4대 특징은 Atomicity(원자성), Consistency(일관성), Isolation(고립성), Durability(영속성)의 앞글자를 딴 ACID입니다.",
  },
  {
    topicId: "database",
    keyword: "Normalization",
    difficulty: "medium",
    type: "short",
    prompt: "관계형 데이터베이스 설계에서 이행적 함수 종속성(A->B, B->C 일 때 A->C)을 제거하여 이상현상을 방지하는 정규화 단계는 무엇인가?",
    answer: "제 3정규형(3NF)",
    explanation: "제3정규형은 주 식별자 이외의 속성 간 이행적 함수 종속성을 제거하는 단계입니다.",
  },
  {
    topicId: "database",
    keyword: "4NF",
    difficulty: "hard",
    type: "short",
    prompt: "관계형 데이터베이스 정규화 단계 중, 릴레이션 내에서 1:N 관계로 매핑되는 다치 종속(Multi-valued Dependency)을 제거하여 이상현상을 방지하는 정규형은 무엇인가?",
    answer: "제 4정규형",
    explanation: "제4정규형(4NF)은 릴레이션에 존재하는 다치 종속(MVD) 관계를 제거하는 정규화 단계입니다.",
  },
  {
    topicId: "database",
    keyword: "5NF",
    difficulty: "hard",
    type: "short",
    prompt: "관계형 데이터베이스 정규화 단계 중, 모든 조인 종속(Join Dependency)이 릴레이션의 후보키를 통해서만 성립되도록 하여 조인 종속성을 이용하는 정규형은 무엇인가?",
    answer: "제 5정규형",
    explanation: "제5정규형(5NF) 혹은 PJ/NF는 릴레이션의 조인 종속성(JD)을 만족하는 후보키를 통해 릴레이션을 무손실 분해하는 정규화 단계입니다.",
  },
  {
    topicId: "testing",
    keyword: "Pesticide Paradox",
    difficulty: "medium",
    type: "short",
    prompt: "동일한 테스트 케이스로 반복 테스트를 수행하면 더 이상 새로운 결함을 찾을 수 없으므로, 테스트 케이스를 주기적으로 갱신해야 한다는 테스트의 원리는 무엇인가?",
    answer: "Pesticide Paradox",
    explanation: "살충제 패러독스는 테스트 케이스의 타당성을 지속적으로 검토하고 개선해야 함을 강조하는 개념입니다.",
  },
  {
    topicId: "testing",
    keyword: "Regression",
    difficulty: "hard",
    type: "scenario",
    prompt: "최근 버그 수정을 거친 소프트웨어 모듈이 기존에 정상 작동하던 다른 영역에 부작용을 유발하지 않았는지 보증하기 위해 수행하는 재테스트 기법은 무엇인가?",
    answer: "Regression Test",
    explanation: "회귀 테스트(Regression Test)는 소스 코드 수정 후 발생할 수 있는 부작용을 검출하기 위해 수행하는 재시험입니다.",
  },
  {
    topicId: "programming-languages",
    keyword: "C",
    difficulty: "easy",
    type: "short",
    prompt: "다음 C언어 코드가 실행되었을 때의 출력 결과(출력값)를 쓰시오.\n\n#include <stdio.h>\nint main() {\n    int a[5] = {10, 20, 30, 40, 50};\n    int *p = a;\n    printf(\"%d\", *(p + 2) + 5);\n    return 0;\n}",
    answer: "35",
    explanation: "C언어에서 배열명 a는 첫 번째 요소인 a[0]의 주소(&a[0])입니다. p+2는 a[2]의 주소를 뜻하므로 *(p+2)는 a[2]의 값인 30을 반환합니다. 여기에 5를 더하므로 출력값은 35가 됩니다.",
  },
  {
    topicId: "programming-languages",
    keyword: "Java",
    difficulty: "medium",
    type: "short",
    prompt: "다음 Java 코드가 실행되었을 때 화면에 출력되는 문자(출력 결과)를 쓰시오.\n\nclass Parent {\n    void show() { System.out.print(\"P\"); }\n}\nclass Child extends Parent {\n    void show() { System.out.print(\"C\"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Parent obj = new Child();\n        obj.show();\n    }\n}",
    answer: "C",
    explanation: "부모 클래스 타입의 참조 변수 obj가 자식 클래스 Child의 객체를 가리키고 있습니다. show() 메서드는 자식 클래스인 Child에서 오버라이딩(재정의)되었으므로, 자바의 동적 바인딩(Dynamic Binding) 규칙에 의해 실제 가리키는 Child 객체의 show() 메서드가 실행되어 'C'가 출력됩니다.",
  },
  {
    topicId: "programming-languages",
    keyword: "Python",
    difficulty: "hard",
    type: "short",
    prompt: "다음 파이썬 코드가 실행되었을 때 화면에 출력되는 결과(출력값)를 쓰시오. (단, 리스트 형태 그대로 쓰시오)\n\na = [10, 20, 30, 40, 50, 60]\nprint(a[1:5:2])",
    answer: "[20, 40]",
    explanation: "파이썬의 슬라이싱 a[start:end:step]은 인덱스 start부터 end-1까지 step 크기 간격으로 원소를 추출합니다. a[1:5:2]는 인덱스 1부터 4까지 2의 간격으로 원소를 추출하므로, 인덱스 1인 20과 인덱스 3인 40이 추출되어 리스트 형태인 [20, 40]이 출력됩니다.",
  },
  ],
  "bigdata-written": [
    {
      topicId: "bigdata-planning",
      keyword: "DIKW",
      difficulty: "easy",
      type: "short",
      prompt: "DIKW 피라미드에서 가공되지 않은 순수한 사실(Data)에 의미와 관계를 부여하여 만들어낸 결과물은 무엇인가?",
      answer: "정보",
      explanation: "DIKW 계층 구조는 Data(데이터) -> Information(정보) -> Knowledge(지식) -> Wisdom(지혜) 순으로 단계적으로 발전합니다."
    },
    {
      topicId: "bigdata-planning",
      keyword: "SECI",
      difficulty: "medium",
      type: "short",
      prompt: "SECI 모델에서 개인의 경험이나 노하우 등 머릿속에 존재하는 암묵지를 문서, 보고서, 도면 등의 언어로 표출하는 지식 전환 단계는 무엇인가?",
      answer: "표출화",
      explanation: "암묵지를 형식지로 바꾸어 문서화하는 단계는 표출화(Externalization)입니다."
    },
    {
      topicId: "bigdata-planning",
      keyword: "Top-Down",
      difficulty: "medium",
      type: "short",
      prompt: "해결해야 할 문제가 이미 명확하게 정의되어 있는 경우 [문제 발견 -> 문제 정의 -> 솔루션 탐색 -> 타당성 검토] 순서로 분석 과제를 도출하는 분석 기획 접근 방식은 무엇인가?",
      answer: "하향식 접근 방식",
      explanation: "문제가 명확할 때 단계적으로 해법을 찾아가는 기법은 하향식(Top-Down) 접근 방식입니다."
    },
    {
      topicId: "bigdata-planning",
      keyword: "CRISP-DM",
      difficulty: "easy",
      type: "short",
      prompt: "비즈니스 이해, 데이터 이해, 데이터 준비, 모델링, 평가, 전개(Deployment)의 6단계 순환 구조를 특징으로 하는 대표적인 데이터 마이닝 방법론은 무엇인가?",
      answer: "CRISP-DM",
      explanation: "CRISP-DM(Cross Industry Standard Process for Data Mining)은 6단계 간 피드백 루프를 갖춘 표준 개발 프로세스입니다."
    },
    {
      topicId: "bigdata-planning",
      keyword: "가명처리",
      difficulty: "hard",
      type: "short",
      prompt: "개인정보 비식별화 조치 중, 식별 가능한 개인 정보의 특정 항목을 다른 임의의 값이나 고유 식별코드로 대체하여 추가 정보 없이는 특정 개인을 알아볼 수 없도록 조치하는 전처리 기술은 무엇인가?",
      answer: "가명처리",
      explanation: "가명처리(Pseudonymization)는 추가 정보의 결합 없이는 특정 개인을 알아볼 수 없도록 식별 정보를 가명 키값으로 대체하는 기법입니다."
    },
    {
      topicId: "bigdata-planning",
      keyword: "데이터 레이크",
      difficulty: "medium",
      type: "short",
      prompt: "정형 데이터뿐만 아니라 이미지, 음성, 텍스트, 반정형 로그 등 다양한 원천 데이터를 가공 전 원시 상태(Raw Data) 그대로 보관하는 대용량 저장소 아키텍처는 무엇인가?",
      answer: "데이터 레이크",
      explanation: "데이터 레이크(Data Lake)는 모든 형태의 raw 데이터를 사전에 가공하지 않고 있는 그대로 저장하는 중앙 저장소입니다."
    },
    {
      topicId: "bigdata-planning",
      keyword: "ELT",
      difficulty: "hard",
      type: "short",
      prompt: "대용량 빅데이터 파이프라인 구축 기법 중, 원천 데이터를 일단 추출(Extract)하여 분석 저장소에 먼저 적재(Load)한 후, 필요 시 내부 파워를 통해 변환(Transform)을 수행하는 방식은 무엇인가?",
      answer: "ELT",
      explanation: "ELT는 Extract -> Load -> Transform 순서로 적재를 먼저 수행하여 대용량 분산 환경에 유연하게 대응하는 데이터 통합 기법입니다."
    },
    {
      topicId: "bigdata-exploration",
      keyword: "ANOVA",
      difficulty: "easy",
      type: "short",
      prompt: "독립변수가 3개 이상의 범주형 집단이고 종속변수가 연속형 수치 데이터일 때, 각 집단 간의 평균 차이가 통계적으로 유의미한지 검정하는 통계 분석 기법은 무엇인가?",
      answer: "ANOVA",
      explanation: "분산분석(ANOVA)은 3개 이상 집단(범주형) 간의 평균(연속형) 차이를 분산 비교를 통해 검정하는 방법입니다."
    },
    {
      topicId: "bigdata-exploration",
      keyword: "카이제곱 검정",
      difficulty: "medium",
      type: "short",
      prompt: "독립변수와 종속변수가 모두 범주형(명목/순서) 데이터일 때, 두 변수 간의 독립성이나 두 집단의 동질성을 검정하기 위해 교차표를 작성하고 시행하는 통계적 검정은 무엇인가?",
      answer: "카이제곱 검정",
      explanation: "범주형 변수와 범주형 변수 간의 관계(독립성/동일성)를 교차표로 검정할 때는 카이제곱(Chi-Square) 검정을 사용합니다."
    },
    {
      topicId: "bigdata-exploration",
      keyword: "스피어만 상관계수",
      difficulty: "medium",
      type: "short",
      prompt: "피어슨 상관계수와 달리, 데이터의 서열이나 순위 정보를 기준으로 두 변수 간의 단조(Monotonic) 증가 또는 감소 관계의 강도를 나타내는 비모수적 상관계수는 무엇인가?",
      answer: "스피어만 상관계수",
      explanation: "스피어만 상관계수는 순위(Rank) 자료를 활용해 비선형적 단조 관계의 강도를 측정하는 비모수 통계량입니다."
    },
    {
      topicId: "bigdata-exploration",
      keyword: "p-value",
      difficulty: "easy",
      type: "short",
      prompt: "통계적 가설 검정에서, 귀무가설이 참이라는 전제하에 실제 표본 데이터와 같거나 더 극단적인 결과가 관찰될 확률로, 유의수준(alpha)보다 작은 경우 귀무가설을 기각하게 만드는 값은 무엇인가?",
      answer: "p-value",
      explanation: "p-value(유의확률)가 지정한 유의수준(보통 0.05)보다 작으면 통계적으로 유의미한 차이가 존재한다고 판단하여 귀무가설을 기각합니다."
    },
    {
      topicId: "bigdata-exploration",
      keyword: "PCA",
      difficulty: "hard",
      type: "scenario",
      prompt: "분석가가 고차원 데이터셋을 변수 간 다중공선성을 제거하기 위해 주성분 분석(PCA)을 수행하고자 한다. PCA 과정에서 공분산 행렬 또는 상관 행렬을 통해 데이터를 사영(Projection)할 방향으로 설정하는, 최대 분산 방향을 나타내는 직교 벡터들을 수학적으로 무엇이라 부르는가?",
      answer: "고유벡터",
      explanation: "PCA에서 주성분 축(Principal Components)은 공분산 행렬의 고유벡터(Eigenvector)에 해당하며, 고유값(Eigenvalue)의 크기는 각 축의 분산 설명력을 뜻합니다."
    },
    {
      topicId: "bigdata-exploration",
      keyword: "왜도",
      difficulty: "medium",
      type: "short",
      prompt: "데이터 값의 분포가 정규분포 대비 얼마나 좌우 비대칭인가를 나타내는 통계량으로, 오른쪽으로 긴 꼬리를 갖는 비대칭 분포일 때 양수(> 0)의 값을 나타내는 지표는 무엇인가?",
      answer: "왜도",
      explanation: "왜도(Skewness)는 분포의 비대칭성을 측정합니다. 오른꼬리 분포(양수 > 0)는 최빈값 < 중앙값 < 평균이며, 왼꼬리 분포(음수 < 0)는 평균 < 중앙값 < 최빈값 순입니다."
    },
    {
      topicId: "bigdata-exploration",
      keyword: "제1종 오류",
      difficulty: "hard",
      type: "short",
      prompt: "통계적 가설 검정 과정에서 실제로는 귀무가설(H0)이 참(True)인데도 귀무가설을 잘못하여 기각(오류 채택)하는 과오를 무엇이라 부르는가?",
      answer: "제1종 오류",
      explanation: "제1종 오류(alpha error)는 참인 귀무가설을 기각해버리는 오류를 뜻합니다."
    },
    {
      topicId: "bigdata-exploration",
      keyword: "F-검정",
      difficulty: "medium",
      type: "short",
      prompt: "두 집단 이상의 분산(Variance) 비율이 서로 동질한지 비교하거나, 3개 이상 집단의 평균 비교(ANOVA), 또는 다중 회귀 모형 전체의 통계적 유의성을 검정할 때 활용되는 검정 기법은 무엇인가?",
      answer: "F-검정",
      explanation: "F-검정(F-test)은 두 분산의 비율(s1² / s2² 또는 MSB / MSW)을 F-분포에 비추어 검정하는 통계 검정법입니다."
    },
    {
      topicId: "bigdata-exploration",
      keyword: "t-검정",
      difficulty: "easy",
      type: "short",
      prompt: "모집단의 표준편차(분산)를 알지 못하며 표본의 크기가 30 미만으로 작은 소표본 데이터 집단에 대해, 모평균의 차이가 통계적으로 유의미한지 검정할 때 사용하는 기법은 무엇인가?",
      answer: "t-검정",
      explanation: "모분산을 모르거나 소표본(n < 30)일 때는 표준정규분포 대신 t-분포 기반의 t-검정(t-test)을 사용합니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "더빈-왓슨 통계량",
      difficulty: "medium",
      type: "short",
      prompt: "선형 회귀분석의 5대 기본 가정 중 잔차(오차항)들 간의 1차 자기상관(Autocorrelation) 존재 여부를 측정하여 오차항의 독립성을 진단하는 대표적인 통계량은 무엇인가?",
      answer: "더빈-왓슨 통계량",
      explanation: "더빈-왓슨(Durbin-Watson) 통계량은 0에서 4 사이 수치로 잔차 간 자기상관 유무 및 독립성을 검정합니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "더빈-왓슨 기준값",
      difficulty: "hard",
      type: "short",
      prompt: "더빈-왓슨(Durbin-Watson) 통계량 산출 수치 범위(0 ~ 4) 중, 회귀 오차항 간에 자기상관(Autocorrelation)이 존재하지 않아 독립성 가정을 완전히 만족함을 나타내는 기준 수치는 얼마인가?",
      answer: "2",
      explanation: "더빈-왓슨 통계량 d ≈ 2 * (1 - r) 수식에 따라, 잔차 상관계수 r=0 일 때 d=2 가 되어 자기상관 없음(독립)을 가리킵니다."
    },
    {
      topicId: "bigdata-exploration",
      keyword: "Levene 검정",
      difficulty: "hard",
      type: "short",
      prompt: "독립표본 t-검정이나 분산분석(ANOVA)을 수행하기 전, 두 개 이상의 그룹 간 분산이 서로 동일한지(등분산성) 검정할 때 정규성 가정에 덜 민감하여 가장 널리 사용되는 대표적 통계 검정법은 무엇인가?",
      answer: "Levene 검정",
      explanation: "Levene 검정(르빈 검정)은 데이터 정규성 충족 여부에 구애받지 않고 등분산성을 강건(Robust)하게 검정하는 기법입니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "이분산성",
      difficulty: "medium",
      type: "short",
      prompt: "회귀분석 기본 가정 중 잔차의 분산이 일정하다는 등분산성 가정이 깨지고, 독립변수의 크기가 커짐에 따라 잔차의 분산이 부채꼴이나 나팔 모양으로 퍼져 통계적 검정의 신뢰성이 저하되는 현상을 무엇이라 하는가?",
      answer: "이분산성",
      explanation: "이분산성(Heteroscedasticity)은 잔차의 분산이 일정하지 않고 변수의 크기에 따라 변화하는 위배 현상으로, p-value 왜곡을 일으킵니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "이분산성 대책",
      difficulty: "hard",
      type: "short",
      prompt: "선형 회귀분석에서 예측값의 크기가 증가함에 따라 오차항(잔차)의 분산이 부채꼴 모양으로 넓어지는 이분산성 현상이 발생했을 때, 이를 등분산 상태로 완화하기 위해 종속변수 Y에 취하는 대표적인 변수 변환 기법은 무엇인가?",
      answer: "로그 변환",
      explanation: "잔차의 분산이 커지는 이분산성 문제를 해결하기 위하여 종속변수 Y에 자연로그를 취하는 로그 변환(log Y)이나 제곱근 변환, Box-Cox 변환을 적용합니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "로지스틱 회귀",
      difficulty: "easy",
      type: "short",
      prompt: "로지스틱 회귀 분석에서 성공 확률 p와 실패 확률 (1-p)의 비율인 p / (1-p)를 일컫는 통계학적 척도는 무엇인가?",
      answer: "오즈비",
      explanation: "성공 확률과 실패 확률의 비율 p / (1-p)를 오즈비(Odds Ratio)라 부르며, 여기에 로짓(Logit) 자연로그 변환을 적용합니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "마진",
      difficulty: "medium",
      type: "short",
      prompt: "서포트 벡터 머신(SVM) 알고리즘에서 결정 초평면(Hyperplane)과 가장 인접하게 위치한 지지 데이터 포인트 사이의 거리를 무엇이라 부르는가?",
      answer: "마진",
      explanation: "SVM은 결정 초평면과 지원 벡터 간의 마진(Margin)을 극대화하여 일반화 예측 능력을 최대화합니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "지지 벡터",
      difficulty: "medium",
      type: "short",
      prompt: "서포트 벡터 머신(SVM)에서 결정 초평면(Hyperplane)의 경계를 결정짓는 최외곽 선상에 위치하며, 마진(Margin) 계산의 기준이 되는 핵심 관측치 데이터 포인트들을 무엇이라 하는가?",
      answer: "지지 벡터",
      explanation: "지지 벡터(Support Vector)는 결정 초평면에 가장 인접한 데이터 포인트로, 이 벡터들만이 결정 경계 수식을 결정합니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "커널 트릭",
      difficulty: "hard",
      type: "short",
      prompt: "SVM에서 저차원 공간의 데이터를 선형으로 분리할 수 없을 때, 데이터를 고차원 사영 공간으로 변환하여 선형 결정 초평면 구분을 가능하게 해주는 수학적 기법을 무엇이라 하는가?",
      answer: "커널 트릭",
      explanation: "커널 트릭(Kernel Trick)은 RBF(가우시안), Polynomial 등의 커널 함수를 사용해 직접 고차원 좌표를 계산하지 않고도 고차원 내적을 효율적으로 계산하여 비선형 데이터를 분류합니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "선독등비정",
      difficulty: "hard",
      type: "scenario",
      prompt: "다중선형 회귀분석의 타당성을 진단하기 위한 잔차(Residuals)의 5대 기본 가정인 '선형성, 독립성, 등분산성, 비상관성, 정상성'을 신속히 암기하기 위한 두문자 축약어는 무엇인가?",
      answer: "선독등비정",
      explanation: "회귀 5대 기본 가정 두문자는 '선독등비정(선형성, 독립성, 등분산성, 비상관성, 정상성)'입니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "랜덤 포레스트",
      difficulty: "medium",
      type: "short",
      prompt: "의사결정나무 모델의 과적합을 방지하기 위해 부트스트랩 샘플링과 무작위 피처 선택으로 다수의 무작위 나무를 병렬 학습시킨 후 보팅(Voting)하는 배깅 기반 앙상블 알고리즘은 무엇인가?",
      answer: "랜덤 포레스트",
      explanation: "랜덤 포레스트(Random Forest)는 Bagging과 무작위 피처 선택 기법을 결합하여 개별 트리의 높았던 분산(Variance) 오차를 낮춥니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "CART 불순도 지표",
      difficulty: "medium",
      type: "short",
      prompt: "의사결정나무 알고리즘 중 이진 분할(Binary Split)을 기본 구조로 가지는 CART(Classification and Regression Trees)가 분할 기준으로 사용하는 불순도 지표는 무엇인가?",
      answer: "지니 계수",
      explanation: "CART 알고리즘은 지니 계수(Gini Index) 불순도 감소량을 기준으로 최적 분할을 수행합니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "ID3 불순도 지표",
      difficulty: "medium",
      type: "short",
      prompt: "Quinlan이 개발한 의사결정나무 ID3 알고리즘이 노드 분할 시 불순도를 측정하고 최대화하기 위해 사용하는 지표는 무엇인가?",
      answer: "정보 이득",
      explanation: "ID3 알고리즘은 엔트로피(Entropy)를 이용하여 정보 이득(Information Gain)이 가장 큰 변수를 선택해 다치 분할합니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "C4.5 분할 지표",
      difficulty: "hard",
      type: "short",
      prompt: "의사결정나무 알고리즘 중 ID3가 범주(가지) 수가 많은 독립변수를 부적절하게 선호하는 단점을 보완하기 위하여 개발된 C4.5 알고리즘의 분할 지표는 무엇인가?",
      answer: "정보 이득비",
      explanation: "C4.5 알고리즘은 ID3의 다치 변수 편향 결점을 정보 이득비(Gain Ratio)를 사용하여 보완 및 개선하였습니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "향상도",
      difficulty: "hard",
      type: "short",
      prompt: "연관성 분석(Apriori)에서 두 항목 A와 B가 완전히 독립일 때 대비, A가 구매되었을 때 B가 함께 구매될 비율을 나타내며, 이 값이 1보다 크면 우수한 양의 연관규칙이 성립함을 나타내는 척도는 무엇인가?",
      answer: "향상도",
      explanation: "향상도(Lift = P(A∩B) / (P(A)*P(B)))가 1보다 크면 두 상품 구매 간에 유의미한 양(Positive)의 상관 규칙이 존재합니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "VIF",
      difficulty: "hard",
      type: "short",
      prompt: "다중선형 회귀분석에서 독립변수들 간에 다중공선성이 존재하는지 진단하는 척도로, 수치가 보통 10 이상이면 다중공선성이 심각하다고 판단하는 지표는 무엇인가?",
      answer: "분산팽창지수",
      explanation: "분산팽창지수(VIF, Variance Inflation Factor)는 1 / (1 - R²) 수식으로 구하며 10 이상일 때 다중공선성이 심각한 것으로 간주합니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "다중공선성",
      difficulty: "medium",
      type: "short",
      prompt: "다중 회귀분석에서 독립변수들 사이에 강한 선형 상관관계가 존재하여 회귀계수 추정치의 분산이 과도하게 커지고 p-value 및 통계적 유의성 해석이 왜곡되는 현상을 무엇이라 하는가?",
      answer: "다중공선성",
      explanation: "다중공선성(Multicollinearity)은 독립변수 간 높은 상관성으로 인해 회귀계수가 불안정해지고 표준오차가 팽창하는 문제 현상입니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "VIF 계산",
      difficulty: "hard",
      type: "short",
      prompt: "어느 독립변수 X1을 다른 독립변수들로 회귀 분석했을 때의 결정계수(R²)가 0.9로 측정되었다. 이때 독립변수 X1의 분산팽창지수(VIF) 값은 얼마인가?",
      answer: "10",
      explanation: "VIF = 1 / (1 - R²) 수식에 따라 1 / (1 - 0.9) = 1 / 0.1 = 10 이 됩니다. VIF가 10에 도달하므로 다중공선성이 존재하는 것으로 진단합니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "다중공선성 완화 기법",
      difficulty: "hard",
      type: "short",
      prompt: "다중 회귀분석에서 독립변수 간 다중공선성(Multicollinearity) 문제가 발생하였을 때, 이를 완화하기 위한 대책 3가지를 기술하시오.",
      answer: "상관관계가 높은 독립변수 제거, L2 Ridge 규제 적용, PCA(주성분 분석)를 통한 직교 차원 축소",
      explanation: "다중공선성은 1) 높은 상관변수 제거, 2) 계수 크기를 수축하는 Ridge(L2) 규제 모델 활용, 3) 변수들을 직교 축으로 재사영하는 PCA 차원 축소를 통해 해결합니다."
    },
    {
      topicId: "bigdata-modeling",
      keyword: "실루엣 계수",
      difficulty: "medium",
      type: "short",
      prompt: "군집 분석 평가 시 군집 내 응집도와 군집 간 분리도를 종합 계산하여 -1에서 +1 사이 수치로 군집화가 잘 구성되었는지 진단하는 평가지표는 무엇인가?",
      answer: "실루엣 계수",
      explanation: "실루엣 계수(Silhouette Coefficient)는 1에 가까울수록 적절한 군집 형성을 가리킵니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "F1-Score",
      difficulty: "easy",
      type: "short",
      prompt: "분류 모델의 평가지표 중 정밀도(Precision)와 재현율(Recall)의 조화평균(Harmonic Mean)을 통해 구해지는 성능 종합 지표는 무엇인가?",
      answer: "F1-Score",
      explanation: "F1-Score는 2 * (Precision * Recall) / (Precision + Recall) 공식으로 계산되는 정밀도와 재현율의 조화평균 지표입니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "F1-Score 조화평균 이유",
      difficulty: "hard",
      type: "short",
      prompt: "F1-Score 산출 시 정밀도(Precision)와 재현율(Recall)의 평균을 산술평균이 아닌 조화평균(Harmonic Mean)으로 계산하는 핵심 이유는 무엇인가?",
      answer: "두 지표 중 어느 한쪽이 0에 가깝게 낮을 경우 수치 착시를 막고 극단적 치우침에 높은 페널티를 부여하기 위함",
      explanation: "산술평균은 한 지표만 1에 가까워도 평균이 높아지는 착시가 발생하지만, 조화평균은 낮은 지표 쪽에 크게 끌려내려가 두 지표가 모두 균형 있게 높아야만 높은 평가를 받습니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "F1-Score 수식 계산",
      difficulty: "medium",
      type: "short",
      prompt: "어느 이진 분류 모델의 정밀도(Precision)가 0.8, 재현율(Recall)이 0.6으로 측정되었다. 이때 이 모델의 F1-Score 값은 얼마인가? (소수점 둘째 자리까지 기술)",
      answer: "0.69",
      explanation: "F1-Score = 2 * (0.8 * 0.6) / (0.8 + 0.6) = 2 * 0.48 / 1.4 = 0.96 / 1.4 ≈ 0.6857... 소수점 둘째 자리 반올림 시 0.69입니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "SMOTE",
      difficulty: "medium",
      type: "short",
      prompt: "클래스 불균형(Class Imbalance) 문제를 해결하기 위한 오버샘플링(Oversampling) 기법 중, 소수 클래스 관측치 데이터를 단순히 무작위 복제하는 대신 K-최근접 이웃(K-NN)을 활용하여 두 관측치 간 선분 상에 새로운 인공 샘플(Synthetic Sample)을 생성해 보정하는 알고리즘은 무엇인가?",
      answer: "SMOTE",
      explanation: "SMOTE(Synthetic Minority Over-sampling Technique)는 소수 샘플 간 보간(Interpolation)으로 신규 샘플을 생성하여 오버샘플링 시 과적합을 예방합니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "클래스 불균형",
      difficulty: "easy",
      type: "short",
      prompt: "금융사기 감지(FDS)나 희귀 질병 진단 데이터셋처럼 정상 데이터(99%)와 사기 데이터(1%)의 데이터 양 비율이 극단적으로 불균형하여 모델이 다수 클래스로 편향 예측하게 만드는 현상을 무엇이라 하는가?",
      answer: "클래스 불균형",
      explanation: "클래스 불균형(Class Imbalance) 현상이 발생하면 정확도(Accuracy)는 높게 나오지만 실제 분류 성능(F1-Score, Recall)은 급격히 떨어집니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "ROC-AUC",
      difficulty: "medium",
      type: "short",
      prompt: "이진 분류 모델의 임계값 변화에 따른 TPR(민감도)과 FPR(1-특이도)의 궤적을 2차원 그래프로 나타내고, 그 곡선 아래 면적으로 모델 성능을 종합 평가하는 지표는 무엇인가?",
      answer: "ROC-AUC",
      explanation: "ROC 커브 아래 면적인 AUC(Area Under Curve)는 1에 가까울수록 분류 변별력이 높으며 무작위 추정 시 0.5값을 띱니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "임계값과 재현율·정밀도",
      difficulty: "hard",
      type: "short",
      prompt: "이진 분류 모델에서 양성(1)을 판정하는 임계값(Threshold)을 기존 0.5에서 0.3으로 낮추었을 때, 재현율(Recall)과 정밀도(Precision)는 각각 어떻게 변화하는지 기술하시오.",
      answer: "재현율(Recall)은 증가하고, 정밀도(Precision)는 감소한다",
      explanation: "임계값을 낮추면 더 많은 데이터가 양성(1)으로 분류되어 FN이 감소(재현율 증가)하지만, FP 오진 판단이 함께 증가하여 정밀도는 감소합니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "임계값 튜닝 목적",
      difficulty: "medium",
      type: "short",
      prompt: "암 진단이나 사기 감지(FDS) 시스템처럼 양성(1) 데이터를 놓치는 미진(FN)의 피해가 치명적인 분야에서는 분류 모델의 임계값(Threshold)을 어떻게 조정해야 하는가?",
      answer: "임계값을 디폴트(0.5)보다 낮춘다",
      explanation: "임계값을 낮추면 진양성(TP)을 구출할 확률(재현율)이 상승하고 놓치는 오판(FN)을 최소화할 수 있습니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "과대적합",
      difficulty: "easy",
      type: "short",
      prompt: "머신러닝 모델이 훈련 데이터(Train Data)에만 과도하게 적합되어 훈련 성능은 매우 높으나 새로운 테스트 데이터(Test Data)에서는 예측 오차가 급격히 커지는 현상을 무엇이라 하는가?",
      answer: "과대적합",
      explanation: "과대적합(Overfitting)은 모델 복잡도가 커서 훈련 데이터의 노이즈까지 지나치게 단순 암기 학습했을 때 발생합니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "과소적합",
      difficulty: "easy",
      type: "short",
      prompt: "머신러닝 모델의 복잡도가 지나치게 단순하여 훈련 데이터의 패턴을 충분히 학습하지 못해, 훈련 데이터와 검증 데이터 모두에서 성능이 낮게 형성되는 현상을 무엇이라 하는가?",
      answer: "과소적합",
      explanation: "과소적합(Underfitting)은 높은 편향(High Bias)으로 인해 발생하며, 모델 복잡도 향상 및 파생변수 추가로 해결합니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "과대적합 방지 대책",
      difficulty: "hard",
      type: "short",
      prompt: "머신러닝 모델 학습 중 과대적합(Overfitting) 현상이 발생하였을 때 이를 방지 및 완화하기 위한 기술적 대책 3가지를 기술하시오.",
      answer: "가중치 규제(L1/L2 Regularization) 적용, 교차검증(Cross Validation) 수행, 데이터 추가 수집 및 피처 차원 축소",
      explanation: "과대적합 방지책으로는 L1/L2 규제, 교차검증, 데이터 증강/추가, 트리 가지치기(Pruning), 딥러닝 Dropout, 차원 축소가 있습니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "LOOCV",
      difficulty: "hard",
      type: "short",
      prompt: "데이터 표본 수가 적을 때, 전체 N개의 데이터 중 단 1개의 관측치만을 검증 셋으로 설정하고 나머지 (N-1)개로 학습을 진행하여 이를 N번 반복 수행하는 극단적 교차검증 기법은 무엇인가?",
      answer: "LOOCV",
      explanation: "Leave-One-Out Cross Validation(LOOCV)은 N번 반복하여 데이터 소실 없이 교차검증을 수행합니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "L1 규제",
      difficulty: "hard",
      type: "scenario",
      prompt: "머신러닝 모델의 복잡도를 제어하여 과적합을 방지하기 위해 가중치(Weight)의 절대값 합계를 비용함수에 페널티로 부여함으로써, 중요하지 않은 일부 피처의 가중치를 완전히 0으로 수렴시켜 변수 선택 효과를 내는 규제 방식은 무엇인가?",
      answer: "L1 규제",
      explanation: "L1 규제(Lasso)는 비용함수에 가중치 절대값의 합(L1 노름)을 규제 항으로 추가하여 희소성(Sparsity)을 유도하고 피처 선택 효과를 얻습니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "R-squared",
      difficulty: "medium",
      type: "short",
      prompt: "회귀 분석 모델의 평가지표 중 하나로, 실제값과 예측값의 오차 제곱합을 총 분산으로 나눈 뒤 1에서 빼는 연산으로 구하며, 모형의 설명력을 0에서 1 사이의 실수 값으로 나타내는 지표는 무엇인가?",
      answer: "결정계수",
      explanation: "결정계수(R2 score)는 독립변수가 종속변수의 분산을 얼마나 잘 설명하는지 보여주는 평가지표입니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "수정 결정계수",
      difficulty: "medium",
      type: "short",
      prompt: "독립변수의 수가 늘어남에 따라 무조건 값이 증가하는 결정계수(R2)의 단점을 보완하기 위하여, 독립변수의 개수(p)와 샘플 수(n)에 따른 페널티를 적용하여 회귀 모형의 설명력을 조정한 지표는 무엇인가?",
      answer: "수정 결정계수",
      explanation: "수정 결정계수(Adjusted R2)는 불필요한 독립변수가 추가될 때 페널티를 주어 과적합된 모델의 착시를 방지합니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "RMSE",
      difficulty: "easy",
      type: "short",
      prompt: "회귀 모형의 예측 성능 평가 지표 중 하나로, 실제 타깃값과 예측값 오차 제곱의 평균(MSE)에 제곱근(루트)을 씌워 오차를 타깃 변수와 동일한 단위로 산출하는 회귀 오차 평가지표는 무엇인가?",
      answer: "RMSE",
      explanation: "RMSE(Root Mean Squared Error)는 MSE에 루트를 취해 실제 수치 단위와 일치시킨 회귀 모형의 오차 평가 척도입니다."
    },
    {
      topicId: "bigdata-evaluation",
      keyword: "데이터 누수",
      difficulty: "hard",
      type: "scenario",
      prompt: "모델 전처리 및 훈련 단계에서 검증(Validation) 및 평가(Test) 데이터의 정보가 유출되어 학습에 포함됨으로써, 학습 시에는 과도하게 높은 성적이 나오고 실제 테스트 시 성능이 급락하는 부정 오류 현상은 무엇인가?",
      answer: "데이터 누수",
      explanation: "데이터 누수(Data Leakage)는 모델이 본래 보지 말아야 할 테스트 데이터의 스케일러 평균이나 타깃 정보를 사전에 습득해 왜곡이 발생하는 현상입니다."
    }
  ],
  "bigdata-practical": [
    {
      topicId: "bigdata-preprocessing",
      keyword: "Scaling",
      difficulty: "easy",
      type: "short",
      prompt: "데이터 전처리 과정에서 수치형 변수들의 데이터 범위를 [0, 1] 사이로 한정하여 다른 피처들과의 절대적 스케일을 통일해 주는 변환 기법은 무엇인가?",
      answer: "Min-Max Scaling",
      explanation: "Min-Max 스케일링은 공식 (X - X_min) / (X_max - X_min)에 따라 데이터 범위를 0~1로 정제합니다."
    },
    {
      topicId: "bigdata-preprocessing",
      keyword: "KNNImputer",
      difficulty: "medium",
      type: "short",
      prompt: "데이터프레임 내에서 결측치(Null/NaN)를 단순히 특정 행/열 제거 대신, 데이터셋의 다른 관측치들과의 거리가 가까운 K개의 이웃 값들을 기반으로 보간하여 대체해주는 sklearn 라이브러리의 클래스 이름은 무엇인가?",
      answer: "KNNImputer",
      explanation: "sklearn.impute 패키지의 KNNImputer는 결측값을 거리 기반 가중치 평균 등으로 대체해주는 유용한 결측치 보간 도구입니다."
    },
    {
      topicId: "bigdata-preprocessing",
      keyword: "IQR",
      difficulty: "hard",
      type: "scenario",
      prompt: "상자 수염 그림(Box Plot)을 활용해 이상치를 판단하고자 한다. 3사분위수(Q3)와 1사분위수(Q1)의 차이인 IQR(Interquartile Range)이 주어졌을 때, 이상치 판별을 위한 상한값(Upper Fence)의 수학적 공식을 기술하시오.",
      answer: "Q3 + 1.5 * IQR",
      explanation: "IQR 방식을 통한 아웃라이어 상하한 경계선은 하한(Q1 - 1.5 * IQR) 및 상한(Q3 + 1.5 * IQR)으로 정의됩니다."
    },
    {
      topicId: "bigdata-model-training",
      keyword: "Random Forest",
      difficulty: "easy",
      type: "short",
      prompt: "의사결정나무(Decision Tree)의 분산이 크고 과적합되기 쉬운 문제를 극복하기 위해, 여러 개의 결정나무를 부트스트랩 샘플링을 통해 병렬적으로 생성한 후 그 예측값을 다수결 또는 평균으로 취합하는 대표적인 배깅(Bagging) 기반 앙상블 알고리즘은 무엇인가?",
      answer: "Random Forest",
      explanation: "Random Forest는 개별 결정나무 모델의 과적합 문제를 Bagging 조합 및 무작위 피처 선택으로 개선한 모델입니다."
    },
    {
      topicId: "bigdata-model-training",
      keyword: "Stratified K-Fold",
      difficulty: "medium",
      type: "short",
      prompt: "분류 문제에 대해 교차 검증(Cross Validation)을 수행할 때, 각 폴드(Fold) 내에서 타겟 레이블의 클래스 비율이 원본 데이터셋의 클래스 비율과 유사하게 유지되도록 데이터를 안배해 주는 폴드 스플리터 클래스는 무엇인가?",
      answer: "Stratified K-Fold",
      explanation: "Stratified K-Fold는 종속 변수의 클래스 분포 편향을 방지하여 더 안정적이고 신뢰도 높은 교차 검증을 보장합니다."
    },
    {
      topicId: "bigdata-model-training",
      keyword: "LightGBM",
      difficulty: "hard",
      type: "scenario",
      prompt: "그리디 부스팅(Gradient Boosting) 프레임워크를 기반으로 하며, 리프 중심 트리 분할(Leaf-wise split) 방식을 차용하여 대용량 데이터에서도 학습 속도가 매우 빠르고 메모리 사용량이 적어 빅분기 실기 시험에서 애용되는 파이썬 패키지명은 무엇인가?",
      answer: "LightGBM",
      explanation: "LightGBM은 Level-wise 분할을 쓰는 기존 부스팅과 달리 Leaf-wise 방식으로 분할하여 속도가 빠르며 과적합 성능 면에서 뛰어납니다."
    },
    {
      topicId: "bigdata-practical-submission",
      keyword: "to_csv",
      difficulty: "easy",
      type: "short",
      prompt: "작업형 2유형 모델링 결과를 제출하기 위해 Pandas DataFrame 형식의 예측 결과를 인덱스(index) 정보 없이 디스크 파일 'result.csv'로 저장하기 위해 호출해야 하는 DataFrame의 메서드는 무엇인가?",
      answer: "to_csv",
      explanation: "`df.to_csv('result.csv', index=False)` 명령을 통해 제출 포맷 규격을 올바르게 맞출 수 있습니다."
    },
    {
      topicId: "bigdata-practical-submission",
      keyword: "ttest_ind",
      difficulty: "medium",
      type: "short",
      prompt: "가상의 학습 데이터에 대한 t-검정을 수행하려고 한다. 두 독립적인 집단(A군, B군) 간의 평균 차이가 통계적으로 유의미한지 확인하기 위해 호출하는 `scipy.stats` 패키지의 독립표본 t-검정 함수명은 무엇인가?",
      answer: "ttest_ind",
      explanation: "`scipy.stats.ttest_ind(groupA, groupB)`를 호출하면 검정통계량(t-statistic)과 유의확률(p-value)을 반환받을 수 있습니다."
    },
    {
      topicId: "bigdata-practical-submission",
      keyword: "predict_proba",
      difficulty: "hard",
      type: "scenario",
      prompt: "작업형 2유형 분류 예측 문제에서 모델 성능 평가지표가 ROC-AUC로 설정되어 있다. 학습된 머신러닝 모형(model)에서 테스트 셋(X_test)에 대해 단순 클래스(0 또는 1) 분류 결과가 아닌, 양성 클래스(1)에 속할 확률값을 구하여 평가지표를 최적화하고자 할 때 호출해야 하는 모델 메서드는 무엇인가?",
      answer: "predict_proba",
      explanation: "ROC-AUC 평가는 확률값의 상대적 순위를 채점하므로, `predict()` 대신 `predict_proba()` 메서드를 통해 양성 클래스 확률을 예측하여 제출해야 안전하게 고득점을 획득합니다."
    }
  ],
  "sqlp": [
    {
      topicId: "sql-index-tuning",
      keyword: "Index Scan",
      difficulty: "easy",
      type: "short",
      prompt: "인덱스를 구성하는 선두 컬럼이 조건절에 사용되지 않았더라도, 후행 컬럼 조건이 입력되었을 때 특정 범위만을 효율적으로 스캔할 수 있도록 유도하는 인덱스 스캔 방식은 무엇인가?",
      answer: "Index Skip Scan",
      explanation: "인덱스 스킵 스캔(Index Skip Scan)은 선두 컬럼의 카디널리티가 낮고 후행 컬럼의 카디널리티가 높을 때 조건에 누락된 선두 컬럼 블록을 건너뛰며 스캔하는 기법입니다."
    },
    {
      topicId: "sql-index-tuning",
      keyword: "Index Scan",
      difficulty: "medium",
      type: "scenario",
      prompt: "사원 테이블에 [부서코드 + 급여] 순으로 결합 인덱스가 생성되어 있을 때, 다음 SQL문이 실행된다고 가정하자.\n\n`SELECT * FROM 사원 WHERE 부서코드 = 'D01' AND 급여 >= 5000000;`\n\n이 쿼리에서 '부서코드'와 '급여' 컬럼은 인덱스 스캔 과정에서 어떤 형태의 필터/액세스 조건 역할을 수행하는가?",
      answer: "모두 액세스 조건",
      explanation: "인덱스 선두 컬럼인 '부서코드'가 등치(=) 조건으로 비교되었기 때문에, 후행 컬럼인 '급여'의 조건(>=)까지도 스캔 시작 및 종료 지점을 결정하는 인덱스 액세스 조건으로 작동하게 됩니다."
    },
    {
      topicId: "sql-index-tuning",
      keyword: "Covered Index",
      difficulty: "hard",
      type: "scenario",
      prompt: "데이터베이스 쿼리 튜닝 시, 테이블 데이터 블록을 전혀 읽지 않고 인덱스 리프 노드에 저장된 컬럼 정보만으로 쿼리의 모든 SELECT/WHERE 결과 처리를 완료하여 성능을 극대화하는 스캔 구조를 무엇이라 하는가?",
      answer: "Covered Index",
      explanation: "쿼리에 필요한 모든 컬럼이 인덱스의 일부분인 경우, 테이블 무작위 액세스(Random Access)를 완전히 피하고 인덱스만으로 처리가 가능하며, 이를 커버드 인덱스(Covered Index)라고 합니다."
    },
    {
      topicId: "sql-join-tuning",
      keyword: "Hash Join",
      difficulty: "easy",
      type: "short",
      prompt: "조인 대상 중 한쪽 테이블(Build Input)을 메모리에 올려 해시 맵을 만든 후, 다른 한쪽 테이블(Probe Input)을 스캔하며 해시 함수 매칭을 통해 결과를 찾는 대용량 조인 기법은 무엇인가? (단, 등가 조인에서만 작동한다)",
      answer: "Hash Join",
      explanation: "해시 조인은 소형 테이블로 해시 맵을 구성하고 대형 테이블을 순회하며 조인하므로, 대용량 데이터를 고속으로 처리할 때 매우 유용하며 등가 조인(=)에서만 동작합니다."
    },
    {
      topicId: "sql-join-tuning",
      keyword: "NL Join",
      difficulty: "medium",
      type: "short",
      prompt: "Nested Loops Join 실행 시, 내부 루프(Inner Table)의 레코드를 매번 디스크에서 무작위로 읽어오는 I/O 대기 오버헤드를 경감시키기 위해 다수의 Inner 블록을 캐시에 동시에 미리 적재하는 오버헤드 완화 기능은 무엇인가?",
      answer: "Prefetch",
      explanation: "인덱스 프리페치(Prefetch)는 NL 조인의 무작위 액세스 성능 문제를 개선하기 위해 여러 개의 데이터 블록을 병렬적으로 버퍼 캐시에 올리는 DBMS 최적화 기능입니다."
    },
    {
      topicId: "sql-join-tuning",
      keyword: "Hash Join",
      difficulty: "hard",
      type: "scenario",
      prompt: "다음 SQL문과 힌트가 주어져 있을 때, 이 쿼리가 조인을 수행하는 실행 순서와 조인 방식을 순서대로 올바르게 기술하시오.\n\n`SELECT /*+ LEADING(A B) USE_HASH(B) */ * FROM EMP A, DEPT B WHERE A.DEPTNO = B.DEPTNO;`",
      answer: "A에서 B 순서로 해시 조인",
      explanation: "LEADING(A B) 힌트로 인해 A 테이블을 선두(Build Input)로 하고 B 테이블을 나중에 스캔(Probe Input)하며, USE_HASH(B) 힌트에 의해 두 테이블은 해시 조인을 수행하게 됩니다."
    },
    {
      topicId: "sql-optimizer-plan",
      keyword: "Optimizer",
      difficulty: "easy",
      type: "short",
      prompt: "비용 기반 옵티마이저(CBO)가 쿼리 수행 비용을 올바르게 예측하고 효율적인 실행 계획을 작성할 수 있도록 돕기 위해, DBMS가 보관하고 갱신하는 테이블 행수, 블록수, 컬럼 분포도 등의 정보를 통칭하여 무엇이라 하는가?",
      answer: "통계정보",
      explanation: "비용 기반 옵티마이저는 데이터베이스의 물리적 정보가 기록된 오브젝트 '통계 정보(Statistics)'를 토대로 최적 실행계획 비용을 계산합니다."
    },
    {
      topicId: "sql-optimizer-plan",
      keyword: "Hints",
      difficulty: "medium",
      type: "short",
      prompt: "서브쿼리를 메인쿼리와 단순 조인 형태로 풀어내지 않고(Unnesting하지 않음) 필터 방식으로 별개 수행하도록 강제할 때 사용하는 쿼리 제어용 Optimizer 힌트는 무엇인가?",
      answer: "NO_UNNEST",
      explanation: "서브쿼리 합치기를 방지하기 위해서는 NO_UNNEST 힌트를 서브쿼리 내부에 명시해야 합니다. 반대로 합치기를 유도할 때는 UNNEST를 씁니다."
    },
    {
      topicId: "sql-optimizer-plan",
      keyword: "Execution Plan",
      difficulty: "hard",
      type: "scenario",
      prompt: "다음과 같은 쿼리 실행계획 트리 구조가 관찰될 때, 각 단계의 최종 실행 순서를 나열하시오.\n\n```\n0  SELECT STATEMENT\n1    HASH JOIN\n2      TABLE ACCESS FULL DEPT\n3      TABLE ACCESS FULL EMP\n```",
      answer: "2 -> 3 -> 1 -> 0",
      explanation: "실행계획은 들여쓰기가 깊을수록 먼저 시작되며, 깊이가 동일하면 위쪽 노드가 먼저 실행됩니다. 따라서 2번 DEPT 풀스캔과 3번 EMP 풀스캔이 먼저 순서대로 수행되고 1번 HASH JOIN 및 0번 SELECT STATEMENT 순서로 진행됩니다."
    },
    {
      topicId: "db-lock-concurrency",
      keyword: "Isolation Level",
      difficulty: "easy",
      type: "short",
      prompt: "한 트랜잭션 도중 동일 쿼리를 반복해서 실행하였을 때, 다른 트랜잭션의 신규 INSERT로 인해 이전에 없던 행이 임의로 발견되는 격리 이상 현상은 무엇인가?",
      answer: "Phantom Read",
      explanation: "유령 읽기(Phantom Read)는 범위 쿼리 시 다른 트랜잭션의 삽입 동작으로 조회 결과 레코드 개수가 바뀌어 나타나는 현상입니다."
    },
    {
      topicId: "db-lock-concurrency",
      keyword: "Deadlock",
      difficulty: "medium",
      type: "short",
      prompt: "동일 테이블의 자원들을 각각 다른 트랜잭션이 점유한 채로, 상대방이 소유한 락(Lock)의 해제를 교차하여 영구 대기하게 되는 교착 상태를 무엇이라 하는가?",
      answer: "Deadlock",
      explanation: "데드락(Deadlock, 교착상태)은 둘 이상의 트랜잭션이 영구적으로 락 점유를 기다리며 진행이 멈춰버리는 오류 상태입니다."
    },
    {
      topicId: "db-lock-concurrency",
      keyword: "Undo Segment",
      difficulty: "hard",
      type: "scenario",
      prompt: "Oracle 데이터베이스에서 변경 작업(UPDATE) 중인 세션이 존재하더라도, 다른 읽기 세션이 락(Lock) 대기 없이 해당 변경 전 상태(일관된 과거 버전)의 데이터를 조회할 수 있도록 원본 정보를 임시 저장하는 공간은 어디인가?",
      answer: "Undo Segment",
      explanation: "Oracle은 다중 버전 동시성 제어(MVCC) 모델을 기반으로 변경 데이터의 이전 이미지(Before Image)를 Undo Segment에 적재해 두어 읽기 일관성을 제공하고 블로킹을 배제합니다."
    }
  ],
  "hazmat-industrial": [
    // 제1류 위험물 (산화성 고체)
    {
      topicId: "hazmat-class1",
      keyword: "무기과산화물",
      difficulty: "easy",
      type: "short",
      prompt: "제1류 위험물(산화성 고체) 중 과산화나트륨 등 알칼리금속의 무기과산화물이 물과 반응했을 때 분출되는 가스는 무엇인가?",
      answer: "산소",
      explanation: "무기과산화물은 물과 격렬히 반응하여 가열 반응을 일으키며 산소(O2) 가스를 분출하므로 주수소화가 엄격히 금지됩니다."
    },
    {
      topicId: "hazmat-class1",
      keyword: "지정수량",
      difficulty: "medium",
      type: "short",
      prompt: "제1류 위험물 중 아염소산염류, 염소산염류, 과염소산염류, 무기과산화물의 법정 지정수량은 얼마인가?",
      answer: "50kg",
      explanation: "제1류 위험물 중 아·염·과·무(아염소산/염소산/과염소산/무기과산화물)는 위험등급 I로 지정수량이 50kg입니다."
    },

    // 제2류 위험물 (가연성 고체)
    {
      topicId: "hazmat-class2",
      keyword: "황화린",
      difficulty: "medium",
      type: "short",
      prompt: "제2류 위험물 중 삼황화린(P4S3), 오황화린(P2S5) 등이 물(H2O)과 접촉했을 때 발생하는 유독성 악취 가스는 무엇인가?",
      answer: "황화수소",
      explanation: "황화린류는 물과 반응하여 계란 썩는 냄새가 나는 유독성 가스인 황화수소(H2S)를 발생시킵니다."
    },
    {
      topicId: "hazmat-class2",
      keyword: "금속분",
      difficulty: "easy",
      type: "short",
      prompt: "제2류 위험물 중 철분, 금속분, 마그네슘 화재 시 물을 뿌리면 안 되는 이유는 어떤 가스가 발생하여 폭발을 유발하기 때문인가?",
      answer: "수소",
      explanation: "철분, 마그네슘, 금속분은 물이나 산과 반응하여 가연성 폭발 가스인 수소(H2)를 발생시키므로 마른모래 등으로 질식소화해야 합니다."
    },

    // 제3류 위험물 (자연발화성 및 금수성)
    {
      topicId: "hazmat-class3",
      keyword: "보호액",
      difficulty: "easy",
      type: "short",
      prompt: "제3류 위험물 중 발화점이 약 34℃로 낮아 공기 중에서 자연발화하므로 반드시 물(약알칼리성) 속에 침하시켜 저장해야 하는 물질은?",
      answer: "황린",
      explanation: "황린(P4)은 공기 중 자연발화성이 있어 물속에 보관합니다. 반면 칼륨과 나트륨은 물과 반응하므로 등유나 경유 속에 보관합니다."
    },
    {
      topicId: "hazmat-class3",
      keyword: "칼륨·나트륨",
      difficulty: "medium",
      type: "short",
      prompt: "제3류 위험물 중 칼륨(K) 및 나트륨(Na)의 산화 및 공기·수분과의 반응을 방지하기 위해 침하시켜 저장하는 보호 액체는 무엇인가?",
      answer: "등유",
      explanation: "칼륨과 나트륨은 물 및 공기와 격렬히 반응하므로 반응성이 낮고 비중이 작은 등유, 경유 등의 석유류 액체 속에 보관합니다."
    },
    {
      topicId: "hazmat-class3",
      keyword: "탄화칼슘",
      difficulty: "medium",
      type: "short",
      prompt: "제3류 위험물인 탄화칼슘(CaC2, 카바이드)이 물(H2O)과 접촉하여 격렬하게 반응할 때 발생하는 가연성 가스는 무엇인가?",
      answer: "아세틸렌",
      explanation: "탄화칼슘은 물과 반응하여 아세틸렌(C2H2) 가스를 방출하고 수산화칼슘(Ca(OH)2)을 생성하며 많은 열을 냅니다."
    },
    {
      topicId: "hazmat-class3",
      keyword: "탄화알루미늄",
      difficulty: "hard",
      type: "short",
      prompt: "제3류 위험물인 탄화알루미늄(Al4C3)이 물과 접촉할 때 생성되는 대표적인 가연성 가스는 무엇인가?",
      answer: "메탄",
      explanation: "탄화알루미늄(Al4C3)은 물과 반응하여 메탄(CH4) 가스와 수산화알루미늄을 생성합니다. (참고: 탄화칼슘은 아세틸렌 발생)"
    },

    // 제4류 위험물 (인화성 액체)
    {
      topicId: "hazmat-class4",
      keyword: "제1석유류",
      difficulty: "hard",
      type: "scenario",
      prompt: "제4류 위험물 중 인화점이 21℃ 미만인 제1석유류에 해당하며, 물에 잘 녹는 수용성 물질(예: 아세톤)의 지정수량은 얼마인가?",
      answer: "400L",
      explanation: "제4류 위험물 제1석유류의 지정수량은 비수용성 200L, 수용성 400L 입니다. (아세톤, 피리딘 등이 대표적인 수용성 제1석유류입니다.)"
    },
    {
      topicId: "hazmat-class4",
      keyword: "이황화탄소",
      difficulty: "medium",
      type: "short",
      prompt: "제4류 위험물 중 특수인화물에 속하며, 가연성 증기 발생을 억제하기 위해 수조(물속)에 넣어 보관하는 물질의 명칭은?",
      answer: "이황화탄소",
      explanation: "이황화탄소(CS2)는 인화점(-30℃), 비점(46℃), 발화점(90℃)이 매우 낮으나 물보다 무겁고(비중 1.26) 물에 녹지 않아 물속에 보관합니다."
    },

    // 제5류 위험물 (자기반응성 물질)
    {
      topicId: "hazmat-class5",
      keyword: "자기반응성",
      difficulty: "medium",
      type: "short",
      prompt: "분자 구조 자체 내에 산소를 함유하고 있어 외부의 공기(산소) 공급 없이도 가열, 충격에 의해 폭발적으로 반응하는 위험물 분류는 몇 류 인가?",
      answer: "제5류 위험물",
      explanation: "제5류 위험물은 자기반응성 물질로 유기과산화물, 질산에스테르류 등이 속하며 자체 연소 및 폭발 위험성이 높습니다."
    },
    {
      topicId: "hazmat-class5",
      keyword: "소화원칙",
      difficulty: "hard",
      type: "short",
      prompt: "제5류 위험물 화재 시 모래를 덮거나 CO2 소화약제를 방출하는 질식소화가 효과가 없는 이유는 무엇 때문인가?",
      answer: "자체 산소 함유",
      explanation: "제5류 위험물은 분자 내에 결합된 산소를 자체 보유하고 있어 외부 공기를 차단해도 내부 연소가 지속되므로 대량 주수 냉각소화만 유효합니다."
    },

    // 제6류 위험물 (산화성 액체)
    {
      topicId: "hazmat-class6",
      keyword: "산화성액체",
      difficulty: "easy",
      type: "short",
      prompt: "과염소산, 과산화수소(36wt% 이상), 질산(비중 1.49 이상)의 3개 품명으로 구성되며, 불연성이지만 강산화제인 위험물 분류는 몇 류인가?",
      answer: "제6류 위험물",
      explanation: "제6류 위험물은 산화성 액체로 모두 불연성이며 비중이 1보다 크고 물에 잘 녹으며 지정수량은 300kg입니다."
    },
    {
      topicId: "hazmat-class6",
      keyword: "과산화수소",
      difficulty: "medium",
      type: "short",
      prompt: "제6류 위험물인 과산화수소의 용기 마개에는 내부 압력 상승으로 인한 폭발을 방지하기 위해 어떤 조치를 취해야 하는가?",
      answer: "구멍 뚫린 마개",
      explanation: "과산화수소는 보관 중 미량씩 산소(O2) 가스로 분해되므로 용기 내압 상승을 막기 위해 구멍이 있는 마개(통기성 캡)를 사용합니다."
    },

    // 화재예방과 소화방법
    {
      topicId: "fire-extinction",
      keyword: "A·B·C·D급 화재",
      difficulty: "easy",
      type: "short",
      prompt: "가솔린, 등유, 아세톤 등 인화성 액체가 타는 화재로, 소화 후 재를 남기지 않으며 황색 표지를 사용하는 화재의 분류는?",
      answer: "B급 화재",
      explanation: "B급 화재는 유류화재(황색), A급은 일반화재(백색), C급은 전기화재(청색), D급은 금속화재(무색)로 분류됩니다."
    },
    {
      topicId: "fire-extinction",
      keyword: "화재 표시 색상",
      difficulty: "easy",
      type: "short",
      prompt: "화재 분류에 따른 소화기 표시 색상에서 일반화재(A급), 유류화재(B급), 전기화재(C급)의 원형 표시 색상을 순서대로 쓰시오.",
      answer: "백색, 황색, 청색",
      explanation: "A급(일반)은 백색, B급(유류)은 황색, C급(전기)은 청색입니다. D급(금속)은 별도 표시 색상이 없습니다(무색)."
    },
    {
      topicId: "fire-extinction",
      keyword: "D급 금속화재",
      difficulty: "medium",
      type: "short",
      prompt: "나트륨, 마그네슘 등 금속 화재(D급 화재) 발생 시 물이나 CO2 소화기를 사용할 수 없다. 이때 사용할 수 있는 가장 대표적인 질식 소화약제는 무엇인가?",
      answer: "마른모래",
      explanation: "금속 화재(D급)는 물이나 CO2와 접촉 시 수소나 일산화탄소 발생 및 폭발 위험이 있으므로 마른모래(건조사), 팽창질석, 팽창진주암으로 덮어 질식소화해야 합니다."
    },
    {
      topicId: "fire-extinction",
      keyword: "C급 전기화재",
      difficulty: "medium",
      type: "short",
      prompt: "통전 중인 변압기, 배전반 등 전기설비 화재(C급 화재)에 물을 직사(봉상 주수)해서는 안 되는 가장 결정적인 이유는 무엇인가?",
      answer: "감전 위험",
      explanation: "전기가 통하고 있는 설비에 전도성이 있는 물을 뿌리면 소방 대원에게 전류가 흘러 치명적인 감전 사고를 유발하므로 비전도성 소화약제(CO2, 할론, 분말)를 사용해야 합니다."
    },
    {
      topicId: "fire-extinction",
      keyword: "분말소화약제",
      difficulty: "medium",
      type: "short",
      prompt: "ABC급 화재(일반·유류·전기)에 두루 사용할 수 있는 제3종 분말소화약제의 주성분은 무엇인가?",
      answer: "제일인산암모늄",
      explanation: "제3종 분말소화약제는 제일인산암모늄(NH4H2PO4)이 주성분이며, 분홍색(담홍색)을 띠고 억제 및 질식, 부착막 형성 소화 효과를 가집니다."
    },
    {
      topicId: "fire-extinction",
      keyword: "소화원리",
      difficulty: "hard",
      type: "scenario",
      prompt: "밀폐 공간에 이산화탄소 소화약제를 방출하여 공기 중의 산소 농도를 15% 이하로 떨어뜨려 불을 끄는 소화 원리는 무엇인가?",
      answer: "질식소화",
      explanation: "산소 공급원을 차단하거나 공기 중 산소 농도를 지속 연소 불가 수준(약 15% 이하)으로 떨어뜨려 소화하는 방식을 질식소화라고 합니다."
    },
    {
      topicId: "fire-extinction",
      keyword: "인화점·발화점",
      difficulty: "easy",
      type: "short",
      prompt: "외부 점화원(불꽃) 없이 물질 자체가 가열되어 스스로 불이 붙어 연소를 시작하는 최저 온도를 무엇이라 하는가?",
      answer: "발화점",
      explanation: "외부 불꽃에 의해 불이 붙는 최저 온도는 '인화점(Flash Point)'이고, 점화원 없이 자체 열 축적으로 연소하는 최저 온도는 '발화점(착화점, Ignition Point)'입니다."
    },
    {
      topicId: "fire-extinction",
      keyword: "소화원리",
      difficulty: "medium",
      type: "short",
      prompt: "할론 소화약제나 분말 소화약제가 화재 시 발생하는 활성 라디칼을 포획하여 연쇄반응을 차단하는 소화 원리를 무엇이라 하는가?",
      answer: "억제소화",
      explanation: "연쇄반응을 방해하고 중단시키는 소화 원리를 억제소화 또는 부촉매소화라고 부릅니다."
    },
    {
      topicId: "fire-extinction",
      keyword: "소화원리",
      difficulty: "easy",
      type: "short",
      prompt: "가스 화재 시 밸브를 잠그거나, 산불 시 방화선을 만들어 나무를 미리 베어내는 소화 방법은 4대 소화 원리 중 어디에 해당하는가?",
      answer: "제거소화",
      explanation: "가연성 물질의 공급을 원천적으로 차단하거나 연소 대상물을 없애 불을 끄는 방식을 제거소화라고 합니다."
    },
    {
      topicId: "fire-extinction",
      keyword: "옥내소화전 수원 계산",
      difficulty: "hard",
      type: "scenario",
      prompt: "어느 위험물 제조소의 1층에 옥내소화전 3개, 2층에 2개가 설치되어 있다. 이 제조소에 확보해야 하는 옥내소화전설비의 최소 수원의 양(저수량)은 몇 m³인가?",
      answer: "23.4m³",
      explanation: "옥내소화전 수원의 양 공식은 Q = N × 7.8 m³ 입니다. 가장 많이 설치된 층의 개수 N=3개(최대 5개 한도)이므로 3 × 7.8 = 23.4 m³(23,400 L)를 확보해야 합니다."
    },
    {
      topicId: "fire-extinction",
      keyword: "옥외소화전 규격",
      difficulty: "medium",
      type: "short",
      prompt: "위험물안전관리법상 옥외소화전설비의 노즐 선단 방수압력(kPa)과 방수량(L/min)의 최소 기준값을 순서대로 쓰시오.",
      answer: "350kPa, 450L/min",
      explanation: "옥외소화전은 방수압력 350 kPa 이상, 방수량 450 L/min 이상이어야 합니다. (옥내소화전은 350 kPa 이상, 260 L/min 이상)"
    },
    {
      topicId: "fire-extinction",
      keyword: "소요단위 계산",
      difficulty: "hard",
      type: "scenario",
      prompt: "외벽이 내화구조인 위험물 제조소(연면적 400m²)에서 제1석유류 비수용성(지정수량 200L) 6,000L를 취급하고 있다. 이 제조소의 총 소화설비 소요단위는 몇 단위인가?",
      answer: "7단위",
      explanation: "건축물 소요단위: 내화구조 제조소는 100m²당 1단위이므로 400/100 = 4단위. 위험물 소요단위: 지정수량의 10배당 1단위이므로 6,000/200 = 30배 -> 30/10 = 3단위. 총 소요단위 = 4 + 3 = 7단위입니다."
    },
    {
      topicId: "fire-extinction",
      keyword: "간이소화용구 능력단위",
      difficulty: "easy",
      type: "short",
      prompt: "간이소화용구(제4소화설비) 중 삽 1개를 상비한 '마른모래 50L 1포'의 소화능력단위는 몇 단위인가?",
      answer: "0.5단위",
      explanation: "마른모래 50L(삽 1개 상비)는 0.5단위이며, 팽창질석 또는 팽창진주암 160L(삽 1개 상비)는 1.0단위, 수조 80L(물통 3개 포함)는 1.5단위입니다."
    },

    // 위험물안전관리법령 및 배수·혼재
    {
      topicId: "hazmat-law",
      keyword: "지정수량",
      difficulty: "easy",
      type: "short",
      prompt: "위험물안전관리법상 위험물의 위험성을 고려하여 대통령령으로 정하는 수량으로, 저장소 설치 허가의 기준이 되는 수량을 무엇이라 하는가?",
      answer: "지정수량",
      explanation: "지정수량은 위험물 관련 안전관리 기준 적용의 행정적 단서가 되는 표준 수량입니다."
    },
    {
      topicId: "hazmat-law",
      keyword: "지정수량 배수 계산",
      difficulty: "medium",
      type: "scenario",
      prompt: "한 저장소에 휘발유(비수용성 제1석유류, 지정수량 200L) 600L와 등유(비수용성 제2석유류, 지정수량 1,000L) 4,000L를 함께 저장하고 있다. 이 저장소의 총 지정수량 배수는 몇 배인가?",
      answer: "7배",
      explanation: "휘발유 배수 = 600 / 200 = 3배, 등유 배수 = 4,000 / 1,000 = 4배. 둘의 합산 배수는 3 + 4 = 7배가 됩니다."
    },
    {
      topicId: "hazmat-law",
      keyword: "혼재 기준",
      difficulty: "hard",
      type: "short",
      prompt: "위험물 운반 차량에서 제1류 위험물과 함께 혼합 적재(혼재)하여 운반할 수 있는 위험물은 제몇 류인가?",
      answer: "제6류",
      explanation: "혼재 가능 기준에서 제1류(산화성 고체)는 제6류(산화성 액체)와만 혼재가 가능합니다 (1-6)."
    },
    {
      topicId: "hazmat-law",
      keyword: "표지 게시판",
      difficulty: "medium",
      type: "short",
      prompt: "제1류 알칼리금속과산화물 또는 제3류 금수성 물질을 취급하는 장소의 주의사항 게시판 색상 기준(바탕색과 문자색)을 바르게 적으시오.",
      answer: "청색 바탕에 백색 문자",
      explanation: "물기엄금 게시판은 '청색 바탕에 백색 문자'로 기재해야 합니다. (화기엄금은 적색 바탕에 백색 문자, 화기주의는 황색 바탕에 흑색 문자)"
    },
    {
      topicId: "hazmat-law",
      keyword: "위험물안전관리자",
      difficulty: "medium",
      type: "scenario",
      prompt: "위험물 제조소등의 관계인이 안전관리자를 해임하거나 퇴직한 경우, 해임/퇴직한 날로부터 며칠 이내에 후임 안전관리자를 재선임해야 하는가?",
      answer: "30일",
      explanation: "위험물안전관리자 해임 또는 퇴직 시 30일 이내에 재선임해야 하며, 선임 후 14일 이내에 소방서장에게 신고해야 합니다."
    }
  ]
};

export const TOPICS = TOPICS_BY_EXAM["infosec-practical"];
export const QUESTION_BANK = QUESTION_BANK_BY_EXAM["infosec-practical"];
