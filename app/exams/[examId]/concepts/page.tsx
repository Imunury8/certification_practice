"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BarChart3, BookOpen, Boxes, CalendarRange, DropletOff, Droplets, Flame, FlaskConical, Lightbulb, Scale, Target, Zap } from "lucide-react";
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

const HAZMAT_SECTION_STYLE: Partial<Record<ConceptSection["topicId"], { tone: string; icon: typeof Flame }>> = {
  "hazmat-class1": { tone: "c1", icon: Boxes },
  "hazmat-class2": { tone: "c2", icon: Flame },
  "hazmat-class3": { tone: "c3", icon: DropletOff },
  "hazmat-class4": { tone: "c4", icon: Droplets },
  "hazmat-class5": { tone: "c5", icon: Zap },
  "hazmat-class6": { tone: "c6", icon: FlaskConical },
  "fire-extinction": { tone: "fire", icon: Flame },
  "hazmat-general-chem": { tone: "chem", icon: FlaskConical },
  "hazmat-law": { tone: "law", icon: Scale },
};

interface ConceptGroup {
  title: string;
  description?: string;
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

function ConceptCard({ item, anchor, showDiagramFirst }: {
  item: ConceptItem;
  anchor: string;
  showDiagramFirst: boolean;
}) {
  const title = item.title ?? item.term;
  const illustration = item.imageUrl && (
    <figure className="concept-illustration">
      <div className="concept-image-container" role="region" aria-label={`${title} 도식`} tabIndex={showDiagramFirst ? 0 : undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl} alt={item.imageAlt ?? title} className="concept-image" loading="lazy" />
      </div>
      {showDiagramFirst && (
        <figcaption>
          <span className="concept-illustration-scroll-hint">좌우로 밀어 보기</span>
          <a href={item.imageUrl} target="_blank" rel="noreferrer" aria-label={`${title} 도식 크게 보기`}>도식 크게 보기</a>
        </figcaption>
      )}
    </figure>
  );

  return (
    <div className="concept-card" id={anchor}>
      <div className="card-head"><h4>{title}</h4></div>
      <p className="concept-summary">{item.summary}</p>
      {showDiagramFirst && !item.imageDisclosure && illustration}
      {item.details.length > 0 && (
        <ul className="concept-detail-list">
          {item.details.map((detail, index) => <DetailItem key={index} detail={detail} />)}
        </ul>
      )}
      {item.exampleTables && (
        <div className="concept-example-tables">
          {item.exampleTables.map((example) => (
            <div className="concept-table-scroll" key={example.caption} tabIndex={0} role="region" aria-label={example.caption}>
              <table className={`concept-example-table${example.wide ? " concept-example-table-wide" : ""}`}>
                <caption>{example.caption}</caption>
                <thead>
                  <tr>{example.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr>
                </thead>
                <tbody>
                  {example.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>
                          {typeof cell === "string" ? cell : (
                            <span className="concept-table-color">
                              <span className="concept-table-swatches" aria-hidden="true">
                                {cell.swatches.map((color) => <span key={color} style={{ backgroundColor: color }} />)}
                              </span>
                              {cell.label}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
      {item.imageDisclosure && illustration ? (
        <details className="concept-image-reference">
          <summary>{item.imageDisclosure}</summary>
          {illustration}
        </details>
      ) : !showDiagramFirst && illustration}
      {item.examTip && (
        <div className="tip">
          <Lightbulb size={16} aria-hidden="true" />
          <span>{item.examTip}</span>
        </div>
      )}
    </div>
  );
}

export default function ConceptsPage() {
  const params = useParams();
  const examId = (params?.examId as ExamId) || "infosec-practical";
  const isHazmat = examId === "hazmat-industrial";

  const conceptSections = CONCEPTS_BY_EXAM[examId] || CONCEPTS_BY_EXAM["infosec-practical"];
  const topics = TOPICS_BY_EXAM[examId] || TOPICS_BY_EXAM["infosec-practical"];
  const analysisTab = { id: "analysis", name: "기출 분석" };
  const conceptTabs = conceptSections.map((section) => ({
    id: section.topicId,
    name: section.title ?? topics.find((topic) => topic.id === section.topicId)?.name ?? section.topicId,
  }));
  const tabs = isHazmat ? [...conceptTabs, analysisTab] : [analysisTab, ...conceptTabs];

  const [selectedAnchor, setSelectedAnchor] = useState("");
  const activeTopic = selectedAnchor === "analysis"
    ? "analysis"
    : conceptSections.find((section) =>
      section.topicId === selectedAnchor || section.items.some((item) => getConceptAnchor(section.topicId, item.term) === selectedAnchor)
    )?.topicId ?? tabs[0].id;

  useEffect(() => {
    const syncHash = () => {
      try {
        setSelectedAnchor(decodeURIComponent(window.location.hash.slice(1)));
      } catch {
        setSelectedAnchor("");
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [examId]);

  useEffect(() => {
    if (!selectedAnchor || selectedAnchor === activeTopic) return;
    const frame = requestAnimationFrame(() => document.getElementById(selectedAnchor)?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(frame);
  }, [selectedAnchor, activeTopic]);

  const selectTopic = (topicId: string) => {
    setSelectedAnchor(topicId);
    window.history.pushState(null, "", `#${topicId}`);
  };

  const handleSidebarClick = (e: React.MouseEvent<HTMLAnchorElement>, topicId: string) => {
    e.preventDefault();
    selectTopic(topicId);
  };

  const trend = EXAM_TRENDS[examId];

  return (
    <main className={isHazmat ? "page hazmat-theory" : "page"}>
      <AppHeader examId={examId} />
      <div className="shell">
        <section className="intro compact">
          <div>
            <h1>{isHazmat ? "위험물산업기사 필기 이론" : "개념 설명"}</h1>
            <p>
              {isHazmat
                ? "필기 입문에서 시험 구조를 확인하고, 화학 계산과 소화 원리, 제1류~제6류 위험물의 성질과 취급을 공부하세요."
                : "자격증 시험의 빈출 핵심 개념을 정리했습니다. 문제 풀이 전에 핵심 단서를 먼저 확인하세요."}
            </p>
          </div>
        </section>

        <div className="concept-layout">
        <div className="theory-tabs panel" role="tablist" aria-label="이론 주제" aria-orientation="vertical">
          {tabs.map((tab, index) => (
            <button
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={tab.id}
              aria-selected={activeTopic === tab.id}
              tabIndex={activeTopic === tab.id ? 0 : -1}
              className={`theory-tab ${activeTopic === tab.id ? "active" : ""}`}
              key={tab.id}
              onClick={() => selectTopic(tab.id)}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
                else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = tabs.length - 1;
                else return;
                event.preventDefault();
                selectTopic(tabs[next].id);
                document.getElementById(`tab-${tabs[next].id}`)?.focus();
              }}
            >{tab.name}</button>
          ))}
        </div>

        <div className="theory-tab-content">
        {activeTopic === "analysis" && <section id="analysis" role="tabpanel" tabIndex={0} className="trend-analysis panel" aria-labelledby="tab-analysis">
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
        </section>}



          {/* 우측 본문 콘텐츠 */}
          <div className="concept-content">
            {conceptSections.filter((section) => section.topicId === activeTopic).map((section) => {
              const topic = topics.find((item) => item.id === section.topicId);
              const style = HAZMAT_SECTION_STYLE[section.topicId];
              const SectionIcon = style?.icon ?? BookOpen;
              const description = section.description ?? (isHazmat ? undefined : topic?.description);
              const groups = getConceptGroups(section);
              return (
                <article
                  className={`panel concept-section ${style ? `section-${style.tone}` : ""}`}
                  key={section.topicId}
                  id={section.topicId}
                  role="tabpanel"
                  tabIndex={0}
                  aria-labelledby={`tab-${section.topicId}`}
                >
                  <div className="section-heading">
                    {style ? (
                      <div className={`class-icon-wrapper ${style.tone}`}>
                        <SectionIcon size={22} aria-hidden="true" />
                      </div>
                    ) : (
                      <SectionIcon size={22} aria-hidden="true" />
                    )}
                    <div className="section-title-wrap">
                      <h2>{section.title ?? topic?.name}</h2>
                      {description && <p>{description}</p>}
                    </div>
                  </div>

                  {isHazmat && groups.length > 1 && (
                    <nav className="concept-contents" aria-label="이 탭의 목차">
                      {groups.map((group) => (
                        <a key={group.title} href={`#${getConceptAnchor(section.topicId, group.items[0].term)}`}>
                          {group.title}
                        </a>
                      ))}
                    </nav>
                  )}

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

                  {groups.map((group) => (
                    <div className="concept-group" key={group.title}>
                      <div className="group-heading">
                        <h3>{group.title}</h3>
                        {!isHazmat && <span>{group.items.length}개 항목</span>}
                        {group.description && <p>{group.description}</p>}
                      </div>
                      <div className="concept-grid">
                        {group.items.map((item) => (
                          <ConceptCard
                            key={item.term}
                            item={item}
                            anchor={getConceptAnchor(section.topicId, item.term)}
                            showDiagramFirst={isHazmat}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  {section.sources && (
                    <footer className="concept-sources">
                      <details>
                        <summary>참고 자료 <span>{section.sources.length}개</span></summary>
                        <ul>
                          {section.sources.map((source) => (
                            <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a></li>
                          ))}
                        </ul>
                      </details>
                    </footer>
                  )}
                </article>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </main>
  );
}

function getConceptGroups(section: ConceptSection): ConceptGroup[] {
  if (section.topicId === "database") {
    return [
      {
        title: "트랜잭션과 ACID",
        description: "원자성·일관성·격리성·영속성을 계좌 이체 예시로 이해합니다.",
        items: section.items.filter((item) => item.term === "Transaction ACID"),
      },
      {
        title: "데이터베이스 이상 현상",
        description: "중복 데이터가 만드는 삽입·삭제·갱신 이상을 구분합니다.",
        items: section.items.filter((item) => item.term === "Database Anomaly"),
      },
      {
        title: "정규화와 반정규화",
        description: "단계별 테이블 분해 예시와 성능을 위한 반정규화를 학습합니다.",
        items: section.items.filter((item) => item.term !== "Transaction ACID" && item.term !== "Database Anomaly"),
      },
    ].filter((group) => group.items.length > 0);
  }

  if (section.topicId.startsWith("hazmat-class")) {
    const mnemonicItem = section.items.find(
      (item) => item.term.includes("암기") || item.term.includes("개요")
    );
    const detailItems = section.items.filter((item) => item !== mnemonicItem);
    const groups: ConceptGroup[] = [];

    if (mnemonicItem) {
      groups.push({
        title: "공통 성질",
        items: [mnemonicItem],
      });
    }

    if (detailItems.length > 0) {
      groups.push({
        title: "지정수량과 주요 반응",
        items: detailItems,
      });
    }

    return groups.length > 0
      ? groups
      : [
          {
            title: "핵심 개념",
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
    const agentItems = section.items.filter((item) => item.term.includes("소화약제"));
    const equipmentItems = section.items.filter(
      (item) => !fireClassItems.includes(item) && !theoryItems.includes(item) && !agentItems.includes(item)
    );
    return [
      {
        title: "연소와 소화 원리",
        items: theoryItems,
      },
      {
        title: "화재 등급",
        items: fireClassItems,
      },
      {
        title: "분말·포·가스계 약제",
        items: agentItems,
      },
      {
        title: "소화설비와 수원 계산",
        items: equipmentItems,
      },
    ].filter((g) => g.items.length > 0);
  }

  if (section.topicId === "hazmat-general-chem") {
    const naming = section.items.filter((item) => /^(화학물질 명명법|위험물의 현행 품명|탄화수소와 유기화합물의 작용기)/.test(item.term));
    const structure = section.items.filter((item) => /^(7가지 결정계|입방 단위격자|방사성 붕괴)/.test(item.term));
    return [
      { title: "명명법과 작용기", items: naming },
      { title: "결정계와 방사성 붕괴", items: structure },
      { title: "반응·농도·기체", items: section.items.filter((item) => !naming.includes(item) && !structure.includes(item)) },
    ].filter((group) => group.items.length > 0);
  }

  if (section.topicId === "hazmat-law") {
    const calcItems = section.items.filter(
      (item) => item.term.includes("지정수량 배수") || item.term.includes("혼재")
    );
    const facilityItems = section.items.filter(
      (item) => /^(제조소(?:등)?|옥내저장소|옥외저장소)의/.test(item.term)
    );
    const managementItems = section.items.filter(
      (item) => /표지|안전관리자|설치 허가|정기점검/.test(item.term)
    );
    const difficultyItems = section.items.filter(
      (item) => item.term.includes("소화난이도") || item.term.includes("경보")
    );
    return [
      {
        title: "지정수량과 혼재",
        items: calcItems,
      },
      {
        title: "제조소와 저장소",
        items: facilityItems,
      },
      {
        title: "설치와 운영 관리",
        items: managementItems,
      },
      {
        title: "소화난이도와 경보설비",
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
