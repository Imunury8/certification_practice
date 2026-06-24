import Link from "next/link";
import { ArrowRight, BookOpen, FileQuestion } from "lucide-react";
import { AppHeader } from "@/app/components/AppHeader";
import { EXAMS } from "@/lib/exams";
import { TOPICS_BY_EXAM } from "@/lib/questionBank";
import { notFound } from "next/navigation";
import type { ExamId } from "@/lib/types";

interface ExamPageProps {
  params: Promise<{ examId: string }>;
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { examId } = await params;
  const exam = EXAMS.find((e) => e.id === examId);

  if (!exam) {
    notFound();
  }

  const topics = TOPICS_BY_EXAM[exam.id as ExamId] || [];

  return (
    <main className="page">
      <AppHeader examId={exam.id as ExamId} />
      <div className="shell">
        <section className="intro">
          <div>
            <h1>{exam.name}</h1>
            <p>{exam.description}</p>
          </div>
          <div className="stats" aria-label="학습 구성 통계">
            <div className="stat">
              <b>{topics.length}</b>
              <span>핵심 주제</span>
            </div>
            <div className="stat">
              <b>2</b>
              <span>학습 페이지</span>
            </div>
            <div className="stat">
              <b>AI</b>
              <span>연동 가능 구조</span>
            </div>
          </div>
        </section>

        <section className="landing-grid" aria-label="학습 메뉴">
          <Link className="landing-card panel" href={`/exams/${exam.id}/concepts`}>
            <BookOpen size={34} />
            <h2>개념 설명</h2>
            <p>{exam.name} 출제 기준에 맞춘 핵심 단서와 요약 팁을 학습합니다.</p>
            <span>
              개념 보러가기 <ArrowRight size={18} />
            </span>
          </Link>
          <Link className="landing-card panel" href={`/exams/${exam.id}/questions`}>
            <FileQuestion size={34} />
            <h2>문제 풀이</h2>
            <p>다양한 유형의 맞춤형 기출 변형 문제를 즉시 풀어보고 오답을 분석합니다.</p>
            <span>
              문제 풀러가기 <ArrowRight size={18} />
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}
