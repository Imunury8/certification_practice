# 문제은행과 출제 방식

모든 시험은 난이도 선택 없이 해당 주제의 전체 문제에서 출제합니다. 한 세트 안에서 같은 문항을 중복하지 않고, 브라우저에 저장한 출제 기록을 기준으로 새 문항을 먼저 고릅니다. 전부 출제한 뒤에는 오래전에 출제한 문항부터 다시 고르되, 표시 순서는 매번 Fisher–Yates 방식으로 섞습니다. 집중 키워드와 프로그래밍 언어 선택도 그대로 사용할 수 있습니다.

## 분야별 문항

| 시험 | 문항 수 | 이번 보강 내용 |
| --- | ---: | --- |
| 정보처리기사 실기 | 523 | 네트워크 계산, 보안 사례, 커버리지, SQL 결과, 개발 원칙 |
| 빅데이터분석기사 필기 | 205 | 표본 추출, 통계량·검정 해석, 모델 계산, 평가 지표 |
| 빅데이터분석기사 실기 | 115 | pandas 처리 결과, 데이터 누수 방지, 검증 설계, 제출 검증 |
| SQLP | 152 | 인덱스 조건, NULL·조인 결과, 실행 통계, 동시성 시나리오 |
| 위험물산업기사 | 259 | 성질·분류 비교, 반응식, 몰비·농도·단위 환산, 법규 적용 |
| 합계 | 1,254 | 30개 주제, 주제별 최소 30문항 |

`lib/appliedQuestions.ts`에 적용·해석 문항 222개를 추가했습니다. 기존 위험물 문제 중 수치만 바뀌는 계산 60개를 정리했습니다. 디자인 패턴 69문항, 다이어그램 이름 맞히기 45문항, C·Java·Python 코드 출력 90문항은 기존 전용 문제은행을 사용합니다. 자체 제작 연습 문항이며 공식 기출문제 모음은 아닙니다.

수치 문제는 단위, 계산식, 필요한 원자량과 가정을 문항에 제시합니다. 법규 기한과 신고 대상은 [위험물안전관리법 제15조](https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000776814)를 참고했습니다. 데이터 처리·검증 문항의 참고 자료는 [pandas 그룹 연산](https://pandas.pydata.org/docs/user_guide/groupby.html), [scikit-learn 교차검증](https://scikit-learn.org/stable/modules/cross_validation.html), [데이터 누수 주의사항](https://scikit-learn.org/stable/common_pitfalls.html), [Oracle COUNT](https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/COUNT.html), [Oracle 조인](https://docs.oracle.com/en/database/oracle/oracle-database/19/tgsql/joins.html), [SciPy 단일표본 t-검정](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_1samp.html)입니다.

## 검증

`npm test`는 전체 주제의 문항 수·중복·정답 메타데이터, 미출제 우선 선택, 전체 문항과 복습 문항의 무작위 표시, 계산 정답, 기존 디자인 패턴·다이어그램·코딩 문항을 검사합니다. `npm run lint`와 `npm run build`로 코드와 타입도 검증합니다.
