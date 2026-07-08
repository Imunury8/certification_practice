"use client";

import Link from "next/link";
import { BookOpenCheck, Sun, Moon } from "lucide-react";
import { EXAMS } from "@/lib/exams";
import type { ExamId } from "@/lib/types";
import { useState, useEffect } from "react";

interface AppHeaderProps {
  examId?: ExamId;
}

export function AppHeader({ examId }: AppHeaderProps) {
  const currentExam = examId ? EXAMS.find((exam) => exam.id === examId) : null;
  const brandTitle = currentExam ? `${currentExam.name} 학습실` : "자격증명 시험 학습실";

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
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
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {examId && (
            <nav className="nav-links" aria-label="주요 메뉴">
              <Link href={`/exams/${examId}/concepts`}>개념 설명</Link>
              <Link href={`/exams/${examId}/questions`}>문제 풀이</Link>
            </nav>
          )}
          
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
