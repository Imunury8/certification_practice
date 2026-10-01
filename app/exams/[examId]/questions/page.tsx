"use client";

import { BrainCircuit, Download, FileQuestion, Sparkles } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "@/app/components/AppHeader";
import { TOPICS_BY_EXAM } from "@/lib/questionBank";
import { generateQuestions, getAvailableQuestionCount, isQuestionAnswerCorrect } from "@/lib/questionGenerator";
import { readQuestionHistory, recordQuestionHistory } from "@/lib/questionHistory";
import type { Difficulty, GenerateQuestionInput, ProgrammingLanguage, Question, TopicId, ExamId } from "@/lib/types";

const difficulties: { label: string; value: Difficulty }[] = [
  { label: "기본", value: "easy" },
  { label: "중간", value: "medium" },
  { label: "실전", value: "hard" },
];

const browserHistoryStorage = {
  getItem: (key: string) => window.localStorage.getItem(key),
  setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
};

function generateWithHistory(input: GenerateQuestionInput, history: Record<string, string[]>): Question[] {
  const examId = input.examId ?? "infosec-practical";
  const key = `${examId}:${input.topicId}`;
  const previous = history[key] ?? readQuestionHistory(browserHistoryStorage, examId, input.topicId);
  const questions = generateQuestions({ ...input, previousQuestionIds: previous });
  history[key] = recordQuestionHistory(browserHistoryStorage, examId, input.topicId, previous, questions.map((question) => question.id));
  return questions;
}

export default function QuestionsPage() {
  const params = useParams();
  const examId = (params?.examId as ExamId) || "infosec-practical";

  const topics = TOPICS_BY_EXAM[examId] || TOPICS_BY_EXAM["infosec-practical"];
  const defaultTopicId = topics[0]?.id || "design-patterns";

  const [selectedTopic, setSelectedTopic] = useState<TopicId>(defaultTopicId as TopicId);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [count, setCount] = useState("8");
  const [focus, setFocus] = useState("");
  const [programmingLanguage, setProgrammingLanguage] = useState<ProgrammingLanguage | "all">("all");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState<Record<string, boolean>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [requestedCount, setRequestedCount] = useState(8);
  const questionHistory = useRef<Record<string, string[]>>({});
  const initializedExam = useRef<ExamId | null>(null);

  useEffect(() => {
    if (topics.length > 0 && initializedExam.current !== examId) {
      initializedExam.current = examId;
      const initialTopic = topics[0].id as TopicId;
      setSelectedTopic(initialTopic);
      setQuestions(
        generateWithHistory({
          examId,
          topicId: initialTopic,
          difficulty: "medium",
          count: 8,
        }, questionHistory.current),
      );
      setDifficulty("medium");
      setCount("8");
      setFocus("");
      setProgrammingLanguage("all");
      setRequestedCount(8);
      setAnswers({});
      setShowResult({});
    }
  }, [examId, topics]);

  const activeTopic = useMemo(
    () => topics.find((topic) => topic.id === selectedTopic) ?? topics[0],
    [selectedTopic, topics],
  );
  const displayedTopic = topics.find((topic) => topic.id === questions[0]?.topicId) ?? activeTopic;

  function handleGenerate() {
    setQuestions(
      generateWithHistory({
        examId,
        topicId: selectedTopic,
        difficulty,
        count: Number(count),
        focus,
        programmingLanguage: programmingLanguage === "all" ? undefined : programmingLanguage,
      }, questionHistory.current),
    );
    setRequestedCount(Number(count));
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
            <p>정답을 입력하고 제출하면 정답 여부와 해설을 확인할 수 있습니다. 새 문제를 우선 출제합니다.</p>
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
                      <small style={{ marginLeft: "4px" }}>{getAvailableQuestionCount(examId, topic.id)}개 문제</small>
                    </button>
                  ))}
                </div>
              </div>

              {selectedTopic === "programming-languages" && (
                <div className="field">
                  <label htmlFor="programming-language">프로그래밍 언어</label>
                  <select className="select" id="programming-language" value={programmingLanguage}
                    onChange={(event) => setProgrammingLanguage(event.target.value as ProgrammingLanguage | "all")}>
                    <option value="all">C · Java · Python 혼합</option>
                    <option value="C">C</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                  </select>
                  <small>선택 범위 {getAvailableQuestionCount(examId, selectedTopic, programmingLanguage === "all" ? undefined : programmingLanguage)}문항</small>
                </div>
              )}

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
                  {[5, 8, 10, 15, 20, 30, 50].map((value) => (
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
                  placeholder="예: Observer, 정규화, 교차검증 (해당 키워드 우선 출제)"
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
                한 세트 안에서는 같은 문제가 나오지 않습니다. 출제 기록은 이 브라우저에 저장하며,
                아직 보지 않은 문제를 먼저 출제합니다. 전체 문제를 한 번씩 출제하면 오래된 문제부터 복습합니다.
                선택 난이도의 새 문제가 부족하면 다른 난이도도 포함합니다.
              </div>
            </div>
          </aside>

          <section className="results">
            {displayedTopic && (
              <div className="panel toolbar">
                <div>
                  <h2>{displayedTopic.name}</h2>
                  <p>{displayedTopic.description}</p>
                  <p aria-live="polite">생성된 문제 {questions.length}문항 · 주제별 문제 {getAvailableQuestionCount(examId, displayedTopic.id)}개</p>
                </div>
                <span className="badge warning">선택 난이도: {difficulties.find((d) => d.value === difficulty)?.label}</span>
              </div>
            )}

            {questions.length > 0 && questions.length < requestedCount && (
              <div className="panel" role="status">
                요청한 {requestedCount}문항보다 출제 가능한 문제가 적어, 중복 없이 {questions.length}문항을 생성했습니다.
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
                
                const isCorrect = isQuestionAnswerCorrect(question, selected);

                return (
                  <article className="question-card" key={question.id}>
                    <div className="question-head">
                      <div className="badges">
                        <span className="badge">Q{index + 1}</span>
                        <span className="badge">{question.difficultyLabel}</span>
                        <span className="badge">{question.typeLabel}</span>
                      </div>
                    </div>
                    
                    <h3 style={{ whiteSpace: "pre-wrap" }}>
                      {question.code ? question.prompt.slice(0, -question.code.source.length).trimEnd() : question.prompt}
                    </h3>
                    {question.code && (
                      <pre className="question-code" aria-label={`${question.code.language} 코드`}>
                        <code>{question.code.source}</code>
                      </pre>
                    )}

                    <div className="input-group">
                      {question.code ? (
                        <textarea
                          className="text-input code-output-input"
                          aria-label="출력 결과"
                          placeholder="출력 결과를 입력하세요. 여러 줄로 입력할 수 있습니다."
                          rows={3}
                          value={selected}
                          onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                          disabled={isSubmitted}
                        />
                      ) : <input
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
                      />}
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
                          내 입력: <code className="code-user">{selected}</code> 
                          | 실제 정답: <code className="code-answer">{question.answer}</code>
                        </p>
                        <p className="explanation" style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>{question.explanation}</p>
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
