"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BarChart3, BookOpen, CalendarRange, Flame, Lightbulb, Target } from "lucide-react";
import { AppHeader } from "@/app/components/AppHeader";
import { CONCEPTS_BY_EXAM } from "@/lib/concepts";
import { TOPICS_BY_EXAM } from "@/lib/questionBank";
import { EXAM_TRENDS } from "@/lib/examTrends";
import { getConceptAnchor } from "@/lib/studyPlanner";
import type { ConceptItem, ConceptSection } from "@/lib/concepts";
import type { ExamId } from "@/lib/types";

const structuralDiagrams = new Set([
  "Class Diagram",
  "Object Diagram",
  "Component Diagram",
  "Deployment Diagram",
  "Package Diagram",
]);

const behavioralDiagrams = new Set([
  "Use Case Diagram",
  "Sequence Diagram",
  "Communication Diagram",
  "Activity Diagram",
  "State Machine Diagram",
  "Timing Diagram",
  "Interaction Overview Diagram",
]);

interface HazmatMeta {
  classNum: string;
  badge: string;
  desc: string;
  badgeClass: string;
}

const HAZMAT_META_MAP: Record<string, HazmatMeta> = {
  "hazmat-class1": {
    classNum: "제1류",
    badge: "제1류 산화성 고체",
    desc: "불연성 고체 · 강산화제 · 산소 공급원 · 대량 주수소화(무기과산화물 제외)",
    badgeClass: "c1",
  },
  "hazmat-class2": {
    classNum: "제2류",
    badge: "제2류 가연성 고체",
    desc: "가연성 고체 · 강환원제 · 저온 착화 · 주수 냉각소화(철·금·마 제외)",
    badgeClass: "c2",
  },
  "hazmat-class3": {
    classNum: "제3류",
    badge: "제3류 자연발화 및 금수성",
    desc: "물기엄금 · 자연발화 · 가연성 가스 발생 · 마른모래 질식소화(황린 제외)",
    badgeClass: "c3",
  },
  "hazmat-class4": {
    classNum: "제4류",
    badge: "제4류 인화성 액체",
    desc: "화기엄금 · 증기비중 > 1 바닥체류 · 포/분말/CO2 질식소화(직사주수 금지)",
    badgeClass: "c4",
  },
  "hazmat-class5": {
    classNum: "제5류",
    badge: "제5류 자기반응성 물질",
    desc: "자체산소 함유 내부연소 · 폭발성 · 질식소화 불가 · 대량 주수 냉각소화",
    badgeClass: "c5",
  },
  "hazmat-class6": {
    classNum: "제6류",
    badge: "제6류 산화성 액체",
    desc: "불연성 액체 · 강산화제 · 비중 > 1 · 부식성 · 대량 주수 희석소화",
    badgeClass: "c6",
  },
  "fire-extinction": {
    classNum: "소화",
    badge: "화재예방과 소화방법",
    desc: "연소의 3/4요소 · 3대 온도 비교 · 4대 소화원리 · 소화약제 분해 반응식",
    badgeClass: "fire",
  },
  "hazmat-general-chem": {
    classNum: "화학",
    badge: "일반화학 핵심이론",
    desc: "이상기체 상태방정식 · 기체 밀도/비중 계산 · 산화환원 반응 판정",
    badgeClass: "chem",
  },
  "hazmat-law": {
    classNum: "법령",
    badge: "위험물안전관리법 및 기준",
    desc: "지정수량 배수 계산식 · 류별 혼재 기준 · 주의사항 게시판 색상 · 안전관리 규정",
    badgeClass: "law",
  },
};

interface ConceptGroup {
  title: string;
  description: string;
  items: ConceptItem[];
}

function DetailItem({ detail }: { detail: string }) {
  const isSubBullet = detail.startsWith("- ");
  const rawText = isSubBullet ? detail.substring(2) : detail;
  const colonIndex = rawText.indexOf(":");

  if (colonIndex > 0 && colonIndex < 35) {
    const label = rawText.substring(0, colonIndex).trim();
    const value = rawText.substring(colonIndex + 1).trim();

    let tagType = "tag-default";
    if (/^[ABCDK]급|^[가-힣]*화재|화재\s*분류/.test(label)) {
      tagType = "tag-fireclass";
      if (label.startsWith("A급")) tagType += " fire-a";
      else if (label.startsWith("B급")) tagType += " fire-b";
      else if (label.startsWith("C급")) tagType += " fire-c";
      else if (label.startsWith("D급")) tagType += " fire-d";
      else if (label.startsWith("K급")) tagType += " fire-k";
    } else if (/암기|줄임말|연상|스토리|비법/.test(label)) {
      tagType = "tag-mnemonic";
    } else if (/소화|소화약제|방화/.test(label)) {
      tagType = "tag-fire";
    } else if (/주의|엄금|금지|위험/.test(label)) {
      tagType = "tag-alert";
    } else if (/인화점|발화점|연소점|공식|계산|증기비중|상태방정식/.test(label)) {
      tagType = "tag-calc";
    } else if (/품명|지정수량|수용성|비수용성/.test(label)) {
      tagType = "tag-qty";
    }

    return (
      <li className={`concept-detail-item with-tag ${isSubBullet ? "sub-bullet" : ""}`}>
        <span className={`concept-tag ${tagType}`}>{label}</span>
        <span className="concept-val">{value}</span>
      </li>
    );
  }

  return (
    <li className={`concept-detail-item ${isSubBullet ? "sub-bullet" : ""}`}>
      {rawText}
    </li>
  );
}

export default function ConceptsPage() {
  const params = useParams();
  const examId = (params?.examId as ExamId) || "infosec-practical";

  const conceptSections = CONCEPTS_BY_EXAM[examId] || CONCEPTS_BY_EXAM["infosec-practical"];
  const topics = TOPICS_BY_EXAM[examId] || TOPICS_BY_EXAM["infosec-practical"];

  const [activeTopic, setActiveTopic] = useState<string>("");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTopic(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    conceptSections.forEach((section) => {
      const el = document.getElementById(section.topicId);
      if (el) observer.observe(el);
    });

    if (conceptSections.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTopic(conceptSections[0].topicId);
    }

    return () => observer.disconnect();
  }, [conceptSections]);

  const handleSidebarClick = (e: React.MouseEvent<HTMLAnchorElement>, topicId: string) => {
    e.preventDefault();
    const target = document.getElementById(topicId);
    if (target) {
      const isMobile = window.innerWidth <= 900;
      const isTiny = window.innerWidth <= 620;
      const headerHeight = isTiny ? 96 : 66;
      const navHeight = isMobile ? 50 : 0;
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - (headerHeight + navHeight + 16);
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setActiveTopic(topicId);
      window.history.pushState(null, "", `#${topicId}`);
    }
  };

  const isHazmat = examId === "hazmat-industrial";
  const trend = EXAM_TRENDS[examId];

  return (
    <main className="page">
      <AppHeader examId={examId} />
      <div className="shell">
        <section className="intro compact">
          <div>
            <h1>{isHazmat ? "위험물 류별 핵심 이론" : "개념 설명"}</h1>
            <p>
              {isHazmat
                ? "제1류~제6류 위험물별 성질, 지정수량, 암기 공식과 소화 원리를 류별로 일목요연하게 정리했습니다."
                : "자격증 시험의 빈출 핵심 개념을 정리했습니다. 문제 풀이 전에 핵심 단서를 먼저 확인하세요."}
            </p>
          </div>
        </section>

        <section className="trend-analysis panel" aria-labelledby="trend-analysis-title">
          <div className="trend-analysis-head">
            <div className="trend-icon"><BarChart3 size={22} /></div>
            <div>
              <span className="trend-eyebrow">RECENT 3-YEAR ANALYSIS</span>
              <h2 id="trend-analysis-title">최근 3년 기출 분석</h2>
              <p>{trend.headline}</p>
            </div>
          </div>

          <div className="trend-meta">
            <span><CalendarRange size={15} /> {trend.period}</span>
            <span><Target size={15} /> {trend.basis}</span>
          </div>

          <div className="trend-topic-grid">
            {trend.topics.map((trendTopic) => (
              <a
                className="trend-topic-card"
                href={`#${trendTopic.topicId}`}
                key={`${trendTopic.rank}-${trendTopic.title}`}
                onClick={(event) => handleSidebarClick(event, trendTopic.topicId)}
              >
                <div className="trend-topic-title">
                  <span className="trend-rank">TOP {trendTopic.rank}</span>
                  <span className={`trend-level level-${trendTopic.level}`}>{trendTopic.level}</span>
                </div>
                <h3>{trendTopic.title}</h3>
                <div className="trend-keywords">
                  {trendTopic.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
                </div>
                <p>{trendTopic.concept}</p>
                <div className="trend-study-point"><b>공부 포인트</b>{trendTopic.studyPoint}</div>
              </a>
            ))}
          </div>

          <div className="year-trend-grid">
            {trend.years.map((year) => (
              <div className="year-trend" key={year.year}>
                <div><b>{year.year}</b><span>{year.label}</span></div>
                <p>{year.summary}</p>
              </div>
            ))}
          </div>

          <p className="trend-caution">분석 참고: {trend.caution}</p>
        </section>

        {isHazmat && (
          <nav className="hazmat-quick-nav panel" aria-label="위험물 류별 빠른 바로가기">
            <div className="quick-nav-header">
              <Flame size={18} className="flame-icon" />
              <span>류별 빠른 바로가기</span>
            </div>
            <div className="hazmat-quick-pills">
              {conceptSections.map((sec) => {
                const topic = topics.find((item) => item.id === sec.topicId);
                const meta = HAZMAT_META_MAP[sec.topicId];
                const isActive = activeTopic === sec.topicId;
                const isClass = sec.topicId.startsWith("hazmat-class");

                return (
                  <a
                    href={`#${sec.topicId}`}
                    key={sec.topicId}
                    className={`hazmat-pill ${meta?.badgeClass || ""} ${isActive ? "active" : ""}`}
                    onClick={(e) => handleSidebarClick(e, sec.topicId)}
                  >
                    {isClass ? (
                      <>
                        <span className="pill-badge">{meta?.classNum}</span>
                        <span className="pill-title">{topic?.name.replace(/제[1-6]류\s*/, "")}</span>
                      </>
                    ) : (
                      <>
                        <span className="pill-badge sub">{meta?.classNum || "기타"}</span>
                        <span className="pill-title">{topic?.name}</span>
                      </>
                    )}
                  </a>
                );
              })}
            </div>
          </nav>
        )}

        <div className="concept-layout">
          {/* 좌측 스티키 사이드바 */}
          <aside className="concept-sidebar panel">
            <div className="sidebar-title">
              <h3>{isHazmat ? "위험물 목차" : "이론 목차"}</h3>
            </div>
            <nav className="sidebar-nav">
              {conceptSections.map((section) => {
                const topic = topics.find((item) => item.id === section.topicId);
                const meta = HAZMAT_META_MAP[section.topicId];
                const isActive = activeTopic === section.topicId;
                return (
                  <a
                    href={`#${section.topicId}`}
                    key={section.topicId}
                    className={`sidebar-link ${isActive ? "active" : ""} ${meta ? `sidebar-${meta.badgeClass}` : ""}`}
                    onClick={(e) => handleSidebarClick(e, section.topicId)}
                  >
                    {meta?.classNum && <span className="sidebar-num-tag">{meta.classNum}</span>}
                    <span className="sidebar-link-text">{topic?.name || section.topicId}</span>
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* 우측 본문 콘텐츠 */}
          <div className="concept-content">
            {conceptSections.map((section) => {
              const topic = topics.find((item) => item.id === section.topicId);
              const meta = HAZMAT_META_MAP[section.topicId];
              return (
                <article
                  className={`panel concept-section ${meta ? `section-${meta.badgeClass}` : ""}`}
                  key={section.topicId}
                  id={section.topicId}
                >
                  <div className="section-heading">
                    {meta ? (
                      <div className={`class-icon-wrapper ${meta.badgeClass}`}>
                        <Flame size={22} />
                      </div>
                    ) : (
                      <BookOpen size={22} />
                    )}
                    <div className="section-title-wrap">
                      {meta && (
                        <div className="section-meta-row">
                          <span className={`class-flag ${meta.badgeClass}`}>{meta.badge}</span>
                          <span className="class-key-desc">{meta.desc}</span>
                        </div>
                      )}
                      <h2>{topic?.name}</h2>
                      <p>{topic?.description}</p>
                    </div>
                  </div>

                  {section.topicId === "osi" && (
                    <figure className="osi-illustration">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/osi_seven_layers.svg"
                        alt="OSI 7계층의 역할, 대표 프로토콜과 장비, 전송 단위 및 송신 캡슐화와 수신 역캡슐화 과정"
                        width={1100}
                        height={960}
                      />
                      <figcaption>
                        송신은 7→1계층, 수신은 1→7계층으로 진행합니다. 그림을 확대하면 프로토콜·장비·단위를 자세히 볼 수 있습니다.
                        {" "}<a href="/images/osi_seven_layers.svg" target="_blank" rel="noopener noreferrer">일러스트 크게 보기 ↗</a>
                      </figcaption>
                    </figure>
                  )}

                  {getConceptGroups(section).map((group) => (
                    <div className="concept-group" key={group.title}>
                      <div className="group-heading">
                        <h3>{group.title}</h3>
                        <span>{group.items.length}개 항목</span>
                        <p>{group.description}</p>
                      </div>
                      <div className="concept-grid">
                        {group.items.map((item) => (
                          <div className="concept-card" key={item.term} id={getConceptAnchor(section.topicId, item.term)}>
                            <div className="card-head">
                              <h4>{item.term}</h4>
                            </div>
                            <p className="concept-summary">{item.summary}</p>
                            <ul className="concept-detail-list">
                              {item.details.map((detail, idx) => (
                                <DetailItem key={idx} detail={detail} />
                              ))}
                            </ul>
                            {item.exampleTables && (
                              <div className="concept-example-tables">
                                {item.exampleTables.map((example) => (
                                  <div className="concept-table-scroll" key={example.caption} tabIndex={0} role="region" aria-label={example.caption}>
                                    <table className="concept-example-table">
                                      <caption>{example.caption}</caption>
                                      <thead>
                                        <tr>{example.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr>
                                      </thead>
                                      <tbody>
                                        {example.rows.map((row, rowIndex) => (
                                          <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ))}
                              </div>
                            )}
                            {item.imageUrl && (
                              <div className="concept-image-container">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.imageUrl} alt={item.term} className="concept-image" />
                              </div>
                            )}
                            <div className="tip">
                              <Lightbulb size={16} />
                              <span>{item.examTip}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

function getConceptGroups(section: ConceptSection): ConceptGroup[] {
  if (section.topicId.startsWith("hazmat-class")) {
    const mnemonicItem = section.items.find(
      (item) => item.term.includes("암기") || item.term.includes("개요")
    );
    const detailItems = section.items.filter((item) => item !== mnemonicItem);
    const groups: ConceptGroup[] = [];

    if (mnemonicItem) {
      groups.push({
        title: "암기 비법 & 공통 성질",
        description: "앞 글자 줄임말 암기 공식, 류별 공통 위험 성질, 필수 소화 및 저장 원칙입니다.",
        items: [mnemonicItem],
      });
    }

    if (detailItems.length > 0) {
      groups.push({
        title: "품명별 지정수량 & 핵심 반응",
        description: "시험에 반드시 출제되는 품명별 지정수량, 물과의 반응 가스, 저장·취급 기준입니다.",
        items: detailItems,
      });
    }

    return groups.length > 0
      ? groups
      : [
          {
            title: "핵심 개념",
            description: "위험물 취급 핵심 이론입니다.",
            items: section.items,
          },
        ];
  }

  if (section.topicId === "fire-extinction") {
    const fireClassItems = section.items.filter(
      (item) => item.term.includes("화재의 종류") || item.term.includes("화재 분류")
    );
    const theoryItems = section.items.filter(
      (item) =>
        (item.term.includes("연소") ||
        item.term.includes("인화점") ||
        item.term.includes("소화원리")) &&
        !fireClassItems.includes(item)
    );
    const equipmentItems = section.items.filter(
      (item) => !fireClassItems.includes(item) && !theoryItems.includes(item)
    );
    return [
      {
        title: "A·B·C·D·K 화재 분류 & 소화 원칙",
        description: "일반(A급)·유류(B급)·전기(C급)·금속(D급)·주방(K급) 화재별 대상 가연물, 표시 색상 및 필수 소화 원칙입니다.",
        items: fireClassItems,
      },
      {
        title: "연소 이론 및 4대 소화 메커니즘",
        description: "연소의 3·4요소, 인화점·연소점·발화점 비교 및 제거·질식·냉각·억제 소화 원리, 폭발 위험도(H)입니다.",
        items: theoryItems,
      },
      {
        title: "소화전·스프링클러 설비 규정 & 수원·소요단위 계산",
        description: "옥내·옥외소화전 방수량·압력·수원(저수량) 공식, 분말 반응식 및 건축물·위험물 소요단위 계산법입니다.",
        items: equipmentItems,
      },
    ].filter((g) => g.items.length > 0);
  }

  if (section.topicId === "hazmat-law") {
    const calcItems = section.items.filter(
      (item) => item.term.includes("지정수량 배수") || item.term.includes("혼재")
    );
    const facilityItems = section.items.filter(
      (item) => item.term.includes("표지") || item.term.includes("안전관리자")
    );
    const difficultyItems = section.items.filter(
      (item) => item.term.includes("소화난이도") || item.term.includes("경보")
    );
    return [
      {
        title: "지정수량 배수 및 혼재 기준",
        description: "제조소등 판정을 위한 배수 합산 계산식 및 위험물 혼재 가능 짝꿍 공식입니다.",
        items: calcItems,
      },
      {
        title: "표지·게시판 규격 및 안전관리자 규정",
        description: "제조소 표지, 법정 5대 안내판, 주의사항 3종 색상 규격 및 안전관리자 선임 기한입니다.",
        items: facilityItems,
      },
      {
        title: "소화난이도 등급 및 경보·피난설비",
        description: "제조소등의 규모별 소화난이도 등급(I, II, III) 및 자동화재탐지설비 등 법정 의무 설비입니다.",
        items: difficultyItems,
      },
    ].filter((g) => g.items.length > 0);
  }

  if (section.topicId === "design-patterns") {
    return [
      {
        title: "생성 패턴",
        description: "객체 생성 방식과 생성 책임 분리를 다루는 GoF 패턴입니다.",
        items: section.items.filter((item) => item.summary.startsWith("생성 패턴.")),
      },
      {
        title: "구조 패턴",
        description: "클래스와 객체를 조합해 더 큰 구조를 만드는 GoF 패턴입니다.",
        items: section.items.filter((item) => item.summary.startsWith("구조 패턴.")),
      },
      {
        title: "행위 패턴",
        description: "객체 사이의 책임 분배, 알고리즘, 메시지 흐름을 다루는 GoF 패턴입니다.",
        items: section.items.filter((item) => item.summary.startsWith("행위 패턴.")),
      },
      {
        title: "시험 보조 패턴",
        description: "실기에서 디자인 패턴과 함께 자주 묻는 아키텍처/계층/전달 객체 패턴입니다.",
        items: section.items.filter(
          (item) =>
            !item.summary.startsWith("생성 패턴.") &&
            !item.summary.startsWith("구조 패턴.") &&
            !item.summary.startsWith("행위 패턴."),
        ),
      },
    ].filter((group) => group.items.length > 0);
  }

  if (section.topicId === "diagrams") {
    return [
      {
        title: "구조 다이어그램",
        description: "시스템의 정적 구조, 구성 요소, 배치, 의존 관계를 표현합니다.",
        items: section.items.filter((item) => structuralDiagrams.has(item.term)),
      },
      {
        title: "행위 다이어그램",
        description: "시스템의 동작, 상호작용, 상태 변화, 처리 흐름을 표현합니다.",
        items: section.items.filter((item) => behavioralDiagrams.has(item.term)),
      },
      {
        title: "분석/설계 산출물",
        description: "UML 분류 밖이지만 실기에서 함께 출제되는 데이터/프로세스 모델링 산출물입니다.",
        items: section.items.filter(
          (item) => !structuralDiagrams.has(item.term) && !behavioralDiagrams.has(item.term),
        ),
      },
    ].filter((group) => group.items.length > 0);
  }

  return [
    {
      title: "핵심 개념",
      description: "시험에 나올 수 있는 주요 용어와 구분 포인트입니다.",
      items: section.items,
    },
  ];
}
