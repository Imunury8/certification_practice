"use client";

import { BrainCircuit, Download, FileQuestion, Sparkles } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "@/app/components/AppHeader";
import { TOPICS_BY_EXAM } from "@/lib/questionBank";
import { generateQuestions, getSelectableChoices } from "@/lib/questionGenerator";
import type { Difficulty, Question, TopicId, ExamId } from "@/lib/types";

const difficulties: { label: string; value: Difficulty }[] = [
  { label: "기본", value: "easy" },
  { label: "중간", value: "medium" },
  { label: "실전", value: "hard" },
];

export default function QuestionsPage() {
  const params = useParams();
  const examId = (params?.examId as ExamId) || "infosec-practical";

  const topics = TOPICS_BY_EXAM[examId] || TOPICS_BY_EXAM["infosec-practical"];
  const defaultTopicId = topics[0]?.id || "design-patterns";

  const [selectedTopic, setSelectedTopic] = useState<TopicId>(defaultTopicId as TopicId);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [count, setCount] = useState("8");
  const [focus, setFocus] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState<Record<string, boolean>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (topics.length > 0) {
      const initialTopic = topics[0].id as TopicId;
      setSelectedTopic(initialTopic);
      setQuestions(
        generateQuestions({
          examId,
          topicId: initialTopic,
          difficulty: "medium",
          count: 8,
        }),
      );
      setAnswers({});
      setShowResult({});
    }
  }, [examId, topics]);

  const activeTopic = useMemo(
    () => topics.find((topic) => topic.id === selectedTopic) ?? topics[0],
    [selectedTopic, topics],
  );

  function handleGenerate() {
    setQuestions(
      generateQuestions({
        examId,
        topicId: selectedTopic,
        difficulty,
        count: Number(count),
        focus,
      }),
    );
    setAnswers({});
    setShowResult({});
  }

  function handleExport() {
    const payload = questions
      .map((question, index) => {
        return [
          `${index + 1}. [${question.topicName} / ${question.difficultyLabel}] ${question.prompt}`,
          `정답: ${question.answer}`,
          `해설: ${question.explanation}`,
        ].join("\n");
      })
      .join("\n\n");

    const blob = new Blob([payload], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${examId}-문제.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page">
      <AppHeader examId={examId} />
      <div className="shell">
        <section className="intro compact">
          <div>
            <h1>문제 풀이</h1>
            <p>답을 선택하면 즉시 정답 여부와 해설을 확인할 수 있습니다.</p>
          </div>
        </section>

        <section className="workspace">
          <aside className={`panel controls ${isCollapsed ? "collapsed" : ""}`} aria-label="문제 생성 설정">
            <div
              className="panel-title"
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{ cursor: "pointer", display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <BrainCircuit size={22} style={{ color: "var(--primary)" }} />
                <h2 style={{ margin: 0, fontSize: "20px" }}>문제 설정</h2>
              </div>
              <button className="collapse-toggle-btn" type="button">
                {isCollapsed ? "설정 펼치기" : "설정 접기"}
              </button>
            </div>

            <div className="controls-content">
              <div className="field" style={{ marginTop: "18px" }}>
                <span className="label">출제 주제</span>
                <div className="topic-grid">
                  {topics.map((topic) => (
                    <button
                      className={`topic-button ${selectedTopic === topic.id ? "active" : ""}`}
                      key={topic.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTopic(topic.id as TopicId);
                      }}
                      type="button"
                    >
                      <span>{topic.name}</span>
                      <small style={{ marginLeft: "4px" }}>{topic.keywords.length}개 키워드</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <span className="label">난이도</span>
                <div className="segmented">
                  {difficulties.map((item) => (
                    <button
                      className={difficulty === item.value ? "active" : ""}
                      key={item.value}
                      onClick={() => setDifficulty(item.value)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label htmlFor="count">문항 수</label>
                <select className="select" id="count" onChange={(event) => setCount(event.target.value)} value={count}>
                  {[5, 8, 10, 15].map((value) => (
                    <option key={value} value={value}>
                      {value}문항
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="focus">추가 요청</label>
                <textarea
                  className="textarea"
                  id="focus"
                  onChange={(event) => setFocus(event.target.value)}
                  placeholder="예: 약술형 위주, 키워드 암기, 실무 예시 포함"
                  value={focus}
                />
              </div>

              <div className="actions">
                <button className="primary-button" onClick={handleGenerate} type="button">
                  <Sparkles size={18} />
                  문제 생성
                </button>
                <button className="secondary-button" onClick={handleExport} type="button">
                  <Download size={18} />
                  TXT 내보내기
                </button>
              </div>

              <div className="architecture">
                현재는 내장 문제 은행을 사용합니다. 이후 AI 모델 연동 시 같은 풀이 화면에서 생성형 문제를 받을 수 있습니다.
              </div>
            </div>
          </aside>

          <section className="results">
            {activeTopic && (
              <div className="panel toolbar">
                <div>
                  <h2>{activeTopic.name}</h2>
                  <p>{activeTopic.description}</p>
                </div>
                <span className="badge warning">선택 난이도: {difficulties.find((d) => d.value === difficulty)?.label}</span>
              </div>
            )}

            {questions.length === 0 ? (
              <div className="panel empty-state">
                <div>
                  <FileQuestion size={40} />
                  <p>설정을 선택하고 문제를 생성하세요.</p>
                </div>
              </div>
            ) : (
              questions.map((question, index) => {
                const selected = answers[question.id] || "";
                const isSubmitted = !!showResult[question.id];
                
                // 대소문자 및 띄어쓰기를 배제하고 유연하게 채점
                const isCorrect =
                  selected.trim().toLowerCase().replace(/\s+/g, "") ===
                  question.answer.trim().toLowerCase().replace(/\s+/g, "");

                return (
                  <article className="question-card" key={question.id}>
                    <div className="question-head">
                      <div className="badges">
                        <span className="badge">Q{index + 1}</span>
                      </div>
                    </div>
                    
                    <h3 style={{ whiteSpace: "pre-wrap" }}>{question.prompt}</h3>

                    <div className="input-group">
                      <input
                        type="text"
                        className="text-input"
                        placeholder="정답을 입력하세요"
                        value={selected}
                        onChange={(e) => setAnswers((current) => ({ ...current, [question.id]: e.target.value }))}
                        disabled={isSubmitted}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && selected.trim()) {
                            setShowResult((current) => ({ ...current, [question.id]: true }));
                          }
                        }}
                      />
                      <button
                        className="primary-button check-btn"
                        onClick={() => setShowResult((current) => ({ ...current, [question.id]: true }))}
                        disabled={!selected.trim() || isSubmitted}
                        type="button"
                      >
                        정답 제출
                      </button>
                    </div>

                    {isSubmitted && (
                      <div className={`answer-box ${isCorrect ? "correct" : "incorrect"}`}>
                        <strong>
                          {isCorrect ? "정답입니다! 🎉" : `오답입니다.`}
                        </strong>
                        <p style={{ marginTop: "4px", fontSize: "14px" }}>
                          내 입력: <code style={{ background: "#eee", padding: "2px 6px", borderRadius: "4px" }}>{selected}</code> 
                          | 실제 정답: <code style={{ background: "#e1ecff", padding: "2px 6px", borderRadius: "4px", color: "#0047b3", fontWeight: "bold" }}>{question.answer}</code>
                        </p>
                        <p className="explanation" style={{ marginTop: "8px" }}>{question.explanation}</p>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
