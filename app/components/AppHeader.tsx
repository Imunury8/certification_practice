import Link from "next/link";
import { BookOpenCheck } from "lucide-react";

export function AppHeader() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <BookOpenCheck size={21} />
          </span>
          <span>정보처리기사 실기 학습실</span>
        </Link>
        <nav className="nav-links" aria-label="주요 메뉴">
          <Link href="/concepts">개념 설명</Link>
          <Link href="/questions">문제 풀이</Link>
        </nav>
      </div>
    </header>
  );
}
