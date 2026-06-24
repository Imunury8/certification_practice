"use client";

import { useEffect, useState } from "react";
import { BookOpen, Lightbulb } from "lucide-react";
import { AppHeader } from "@/app/components/AppHeader";
import { CONCEPT_SECTIONS } from "@/lib/concepts";
import { TOPICS } from "@/lib/questionBank";
import type { ConceptItem, ConceptSection } from "@/lib/concepts";

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

interface ConceptGroup {
  title: string;
  description: string;
  items: ConceptItem[];
}

export default function ConceptsPage() {
  const [activeTopic, setActiveTopic] = useState<string>("");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -70% 0px", // 스크롤 시 화면 상단을 기준으로 섹션 감지
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

    CONCEPT_SECTIONS.forEach((section) => {
      const el = document.getElementById(section.topicId);
      if (el) observer.observe(el);
    });

    if (CONCEPT_SECTIONS.length > 0) {
      setActiveTopic(CONCEPT_SECTIONS[0].topicId);
    }

    return () => observer.disconnect();
  }, []);

  const handleSidebarClick = (e: React.MouseEvent<HTMLAnchorElement>, topicId: string) => {
    e.preventDefault();
    const target = document.getElementById(topicId);
    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 90; // 헤더 높이를 감안하여 위치 조정
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setActiveTopic(topicId);
      window.history.pushState(null, "", `#${topicId}`);
    }
  };

  return (
    <main className="page">
      <AppHeader />
      <div className="shell">
        <section className="intro compact">
          <div>
            <h1>개념 설명</h1>
            <p>정보처리기사 실기 빈출 개념을 주제별로 정리했습니다. 문제 풀이 전에 핵심 단서를 먼저 확인하세요.</p>
          </div>
        </section>

        <div className="concept-layout">
          {/* 좌측 스티키 사이드바 */}
          <aside className="concept-sidebar panel">
            <div className="sidebar-title">
              <h3>이론 목차</h3>
            </div>
            <nav className="sidebar-nav">
              {CONCEPT_SECTIONS.map((section) => {
                const topic = TOPICS.find((item) => item.id === section.topicId);
                const isActive = activeTopic === section.topicId;
                return (
                  <a
                    href={`#${section.topicId}`}
                    key={section.topicId}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                    onClick={(e) => handleSidebarClick(e, section.topicId)}
                  >
                    {topic?.name || section.topicId}
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* 우측 본문 콘텐츠 */}
          <div className="concept-content">
            {CONCEPT_SECTIONS.map((section) => {
              const topic = TOPICS.find((item) => item.id === section.topicId);
              return (
                <article className="panel concept-section" key={section.topicId} id={section.topicId}>
                  <div className="section-heading">
                    <BookOpen size={22} />
                    <div>
                      <h2>{topic?.name}</h2>
                      <p>{topic?.description}</p>
                    </div>
                  </div>

                  {getConceptGroups(section).map((group) => (
                    <div className="concept-group" key={group.title}>
                      <div className="group-heading">
                        <h3>{group.title}</h3>
                        <span>{group.items.length}개</span>
                        <p>{group.description}</p>
                      </div>
                      <div className="concept-grid">
                        {group.items.map((item) => (
                          <div className="concept-card" key={item.term}>
                            <h4>{item.term}</h4>
                            <p>{item.summary}</p>
                            <ul>
                              {item.details.map((detail) => (
                                <li key={detail}>{detail}</li>
                              ))}
                            </ul>
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
