"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, Sun, Moon } from "lucide-react";
import { EXAMS } from "@/lib/exams";
import type { ExamId } from "@/lib/types";
import { useState, useEffect } from "react";

interface AppHeaderProps {
  examId?: ExamId;
}

export function AppHeader({ examId }: AppHeaderProps) {
  const pathname = usePathname();
  const currentExam = examId ? EXAMS.find((exam) => exam.id === examId) : null;
  const brandTitle = currentExam ? `${currentExam.name} 학습실` : "자격증명 시험 학습실";

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <BookOpenCheck size={21} />
          </span>
          <span>{brandTitle}</span>
        </Link>
        
        <div className="topbar-actions">
          <nav className="nav-links" aria-label="주요 메뉴">
            <Link href={examId ? `/planner?exam=${examId}` : "/planner"} aria-current={pathname === "/planner" ? "page" : undefined}>
              학습 계획
            </Link>
            {examId && (
              <>
                <Link href={`/exams/${examId}/concepts`} aria-current={pathname === `/exams/${examId}/concepts` ? "page" : undefined}>개념 설명</Link>
                <Link href={`/exams/${examId}/questions`} aria-current={pathname === `/exams/${examId}/questions` ? "page" : undefined}>문제 풀이</Link>
              </>
            )}
          </nav>
          
          <button
            onClick={toggleDarkMode}
            className="theme-toggle-btn"
            aria-label="테마 전환"
            type="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text)",
              padding: "8px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s"
            }}
          >
            {darkMode ? <Sun size={20} style={{ color: "#facc15" }} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
