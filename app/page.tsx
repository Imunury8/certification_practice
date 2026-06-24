import Link from "next/link";
import { ArrowRight, BookOpen, FileQuestion } from "lucide-react";
import { AppHeader } from "@/app/components/AppHeader";
import { TOPICS } from "@/lib/questionBank";

export default function Home() {
  return (
    <main className="page">
      <AppHeader />
      <div className="shell">
        <section className="intro">
          <div>
            <h1>정보처리기사 실기 개념 학습과 문제 풀이를 분리했습니다.</h1>
            <p>
              먼저 개념 설명에서 핵심 단서를 정리하고, 문제 풀이 페이지에서 답을 선택하며 바로 정답과 해설을
              확인하세요.
            </p>
          </div>
          <div className="stats" aria-label="학습 구성 통계">
            <div className="stat">
              <b>{TOPICS.length}</b>
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
          <Link className="landing-card panel" href="/concepts">
            <BookOpen size={34} />
            <h2>개념 설명</h2>
            <p>디자인 패턴, UML, OSI 7계층, 커버리지, 보안 공격, 최신 기술을 주제별로 정리합니다.</p>
            <span>
              개념 보러가기 <ArrowRight size={18} />
            </span>
          </Link>
          <Link className="landing-card panel" href="/questions">
            <FileQuestion size={34} />
            <h2>문제 풀이</h2>
            <p>주제와 난이도를 선택하고, 보기를 누르면 즉시 정답 여부와 해설을 확인합니다.</p>
            <span>
              문제 풀러가기 <ArrowRight size={18} />
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}
