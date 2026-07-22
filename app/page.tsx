import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, BarChart3, LineChart, Database } from "lucide-react";
import { AppHeader } from "@/app/components/AppHeader";
import { EXAMS } from "@/lib/exams";
import type { ExamId } from "@/lib/types";

const examIcons: Record<ExamId, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  "infosec-practical": ShieldCheck,
  "bigdata-written": BarChart3,
  "bigdata-practical": LineChart,
  "sqlp": Database,
};

const categoryBadgeClasses: Record<string, string> = {
  "실기": "badge",
  "필기": "badge warning",
  "전문가": "badge success",
};

export default function Home() {
  return (
    <main className="page">
      <AppHeader />
      <div className="shell">
        <section className="intro">
          <div>
            <h1>자격증 시험 학습실</h1>
            <p>공부하실 자격증 시험을 선택해 주세요. 핵심 이론 정리부터 기출 대비 문제 풀이까지 지원합니다.</p>
          </div>
          <div className="stats" aria-label="학습 구성 통계">
            <div className="stat">
              <b>{EXAMS.length}</b>
              <span>지원 시험 수</span>
            </div>
            <div className="stat">
              <b>2</b>
              <span>학습 모드</span>
            </div>
            <div className="stat">
              <b>AI</b>
              <span>기반 생성 구조</span>
            </div>
          </div>
        </section>

        <section className="landing-grid" aria-label="시험 선택 목록">
          {EXAMS.map((exam) => {
            const IconComponent = examIcons[exam.id as ExamId];
            const badgeClass = categoryBadgeClasses[exam.category] || "badge";
            return (
              <Link className="landing-card panel" href={`/exams/${exam.id}`} key={exam.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <IconComponent size={34} style={{ color: "var(--primary)" }} />
                  <span className={badgeClass}>{exam.category}</span>
                </div>
                <h2 style={{ marginTop: "12px", fontSize: "22px" }}>{exam.name}</h2>
                <p style={{ fontSize: "14px", minHeight: "68px" }}>{exam.description}</p>
                <span>
                  학습 시작하기 <ArrowRight size={18} />
                </span>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
