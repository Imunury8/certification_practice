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
  const [questions, setQuestions] = useState<Question[]>([]);

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
  }

  function handleExport() {
    const payload = questions
      .map((question, index) => {
        const choices = getSelectableChoices(question)
          .map((choice, choiceIndex) => `  ${choiceIndex + 1}. ${choice}`)
          .join("\n");
        return [
          `${index + 1}. [${question.topicName} / ${question.difficultyLabel}] ${question.prompt}`,
          choices,
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
          <aside className="panel controls" aria-label="문제 생성 설정">
            <div className="panel-title">
              <BrainCircuit size={22} />
              <h2>문제 설정</h2>
            </div>

            <div className="field">
              <span className="label">출제 주제</span>
              <div className="topic-grid">
                {topics.map((topic) => (
                  <button
                    className={`topic-button ${selectedTopic === topic.id ? "active" : ""}`}
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id as TopicId)}
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
                const selected = answers[question.id];
                const isCorrect = selected === question.answer;
                return (
                  <article className="question-card" key={question.id}>
                    <div className="question-head">
                      <div className="badges">
                        <span className="badge">Q{index + 1}</span>
                        <span className="badge">{question.typeLabel}</span>
                        <span className="badge">{question.keyword}</span>
                      </div>
                      <span className="badge warning">{question.difficultyLabel}</span>
                    </div>
                    <h3>{question.prompt}</h3>
                    <ol className="choices">
                      {getSelectableChoices(question).map((choice) => {
                        const isSelected = selected === choice;
                        const isAnswer = question.answer === choice;
                        return (
                          <li className="choice-item" key={choice}>
                            <button
                              className={`choice-button ${isSelected ? "selected" : ""} ${
                                selected && isAnswer ? "correct" : ""
                              } ${isSelected && !isCorrect ? "incorrect" : ""}`}
                              onClick={() => setAnswers((current) => ({ ...current, [question.id]: choice }))}
                              type="button"
                            >
                              {choice}
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                    {selected && (
                      <div className={`answer-box ${isCorrect ? "correct" : "incorrect"}`}>
                        <strong>{isCorrect ? "정답입니다." : `오답입니다. 정답: ${question.answer}`}</strong>
                        <p className="explanation">{question.explanation}</p>
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
