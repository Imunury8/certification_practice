import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import { EXAMS } from "@/lib/exams";
import type { ExamId } from "@/lib/types";

interface AppHeaderProps {
  examId?: ExamId;
}

export function AppHeader({ examId }: AppHeaderProps) {
  const currentExam = examId ? EXAMS.find((exam) => exam.id === examId) : null;
  const brandTitle = currentExam ? `${currentExam.name} 학습실` : "자격증명 시험 학습실";

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <BookOpenCheck size={21} />
          </span>
          <span>{brandTitle}</span>
        </Link>
        {examId && (
          <nav className="nav-links" aria-label="주요 메뉴">
            <Link href={`/exams/${examId}/concepts`}>개념 설명</Link>
            <Link href={`/exams/${examId}/questions`}>문제 풀이</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
