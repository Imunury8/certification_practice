"use client";

import { ArrowLeft, ArrowRight, Check, RotateCw, X } from "lucide-react";
import { useRef, useState } from "react";
import { HAZMAT_CBT_SET_SIZE, HAZMAT_CBT_SUBJECTS, type HazmatCbtQuestion } from "@/lib/hazmatCbt";
import { shuffle } from "@/lib/questionGenerator";
import styles from "./hazmatCbt.module.css";

interface Attempt {
  questions: HazmatCbtQuestion[];
  currentIndex: number;
  answers: Partial<Record<string, number>>;
}

function createAttempt(questions: HazmatCbtQuestion[]): Attempt {
  return { questions: questions.slice(0, HAZMAT_CBT_SET_SIZE), currentIndex: 0, answers: {} };
}

export function HazmatCbt({ onOpenTopics }: { onOpenTopics: () => void }) {
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [attempts, setAttempts] = useState(() => HAZMAT_CBT_SUBJECTS.map(({ questions }) => createAttempt(questions)));
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const subject = HAZMAT_CBT_SUBJECTS[subjectIndex];
  const attempt = attempts[subjectIndex];
  const question = attempt.questions[attempt.currentIndex];
  const total = attempt.questions.length;
  const selected = attempt.answers[question.id];
  const answered = selected !== undefined;
  const correct = selected === question.correctIndex;
  const answeredCount = Object.keys(attempt.answers).length;
  const correctCount = attempt.questions.filter((entry) => attempt.answers[entry.id] === entry.correctIndex).length;

  function updateAttempt(update: (previous: Attempt) => Attempt) {
    setAttempts((current) => current.map((entry, index) => index === subjectIndex ? update(entry) : entry));
  }

  function focusQuestion() {
    requestAnimationFrame(() => questionHeading.current?.focus());
  }

  function goToQuestion(index: number) {
    updateAttempt((previous) => ({ ...previous, currentIndex: index }));
    focusQuestion();
  }

  function selectAnswer(index: number) {
    updateAttempt((previous) => {
      if (previous.questions[previous.currentIndex].id !== question.id || previous.answers[question.id] !== undefined) {
        return previous;
      }
      return { ...previous, answers: { ...previous.answers, [question.id]: index } };
    });
  }

  function startNewSet() {
    const previousIds = new Set(attempt.questions.map(({ id }) => id));
    const unused = subject.questions.filter(({ id }) => !previousIds.has(id));
    const review = shuffle(attempt.questions, Math.random);
    const questions = [...unused, ...review].slice(0, HAZMAT_CBT_SET_SIZE);
    const next = createAttempt(shuffle(questions, Math.random));
    updateAttempt(() => next);
    focusQuestion();
  }

  return (
    <>
      <section className={`intro ${styles.intro}`}>
        <div>
          <h1>위험물산업기사 필기 CBT</h1>
          <p>과목별 {HAZMAT_CBT_SET_SIZE}문항을 풉니다. 보기를 고르면 정답과 해설이 바로 표시됩니다.</p>
        </div>
        <button className="secondary-button" type="button" onClick={onOpenTopics}>주제별 단답형 연습</button>
      </section>

      <div className={styles.subjects} role="group" aria-label="CBT 과목">
        {HAZMAT_CBT_SUBJECTS.map((entry, index) => (
          <button
            className={styles.subject}
            key={entry.id}
            type="button"
            aria-pressed={subjectIndex === index}
            onClick={() => {
              setSubjectIndex(index);
              focusQuestion();
            }}
          >
            <span>과목 {index + 1}</span>
            <strong>{entry.name}</strong>
            <small>{Object.keys(attempts[index].answers).length} / {HAZMAT_CBT_SET_SIZE} 풀이</small>
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        <article className={`panel ${styles.question}`} aria-labelledby="cbt-question">
          <div className={styles.questionMeta}>
            <span className="badge">문제 {attempt.currentIndex + 1} / {total}</span>
            <span>{subject.name}</span>
          </div>
          <h2 className={styles.prompt} id="cbt-question" ref={questionHeading} tabIndex={-1}>{question.prompt}</h2>

          <ol className={styles.choices} aria-label="보기 네 개">
            {question.choices.map((choice, index) => {
              const isCorrectChoice = answered && index === question.correctIndex;
              const isSelected = selected === index;
              const status = isCorrectChoice ? (isSelected ? "선택한 정답" : "정답") : isSelected ? "내 답" : "";

              return (
                <li key={choice}>
                  <button
                    className={styles.choice}
                    type="button"
                    aria-disabled={answered}
                    data-result={isCorrectChoice ? "correct" : isSelected ? "incorrect" : undefined}
                    onClick={() => selectAnswer(index)}
                  >
                    <span className={styles.choiceNumber}>{index + 1}</span>
                    <span>{choice}</span>
                    {status && <strong className={styles.choiceStatus}>{status}</strong>}
                  </button>
                </li>
              );
            })}
          </ol>

          <div role="status" aria-atomic="true">
            {answered && (
              <div className={`answer-box ${correct ? "correct" : "incorrect"} ${styles.feedback}`}>
                <strong>{correct ? "정답입니다." : "오답입니다."}</strong>
                <p><b>정답 {question.correctIndex + 1}번</b> {question.choices[question.correctIndex]}</p>
                <p className="explanation"><b>해설</b> {question.explanation}</p>
              </div>
            )}
          </div>

          <div className={styles.navigation}>
            <button className="secondary-button" type="button" disabled={attempt.currentIndex === 0} onClick={() => goToQuestion(attempt.currentIndex - 1)}>
              <ArrowLeft size={17} aria-hidden="true" /> 이전 문제
            </button>
            <button className="primary-button" type="button" disabled={attempt.currentIndex === total - 1} onClick={() => goToQuestion(attempt.currentIndex + 1)}>
              다음 문제 <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </article>

        <aside className={`panel ${styles.progress}`} aria-label="과목 풀이 현황">
          <h2>과목 풀이 현황</h2>
          <div className={styles.tally}>
            <p>풀이 <strong>{answeredCount} / {total}</strong></p>
            <p>정답 <strong>{correctCount}개</strong></p>
          </div>
          {answeredCount === total && <p className={styles.score}>과목 점수 <strong>{Math.round(correctCount * 100 / total)}점</strong></p>}
          <div className={styles.numbers} role="group" aria-label="문제 번호로 이동">
            {attempt.questions.map((entry, index) => {
              const answer = attempt.answers[entry.id];
              const result = answer === undefined ? undefined : answer === entry.correctIndex ? "correct" : "incorrect";
              const status = result === "correct" ? "정답" : result === "incorrect" ? "오답" : "미응답";
              return (
                <button
                  className={styles.number}
                  type="button"
                  key={entry.id}
                  aria-current={attempt.currentIndex === index ? "step" : undefined}
                  aria-label={`${index + 1}번 문제, ${status}`}
                  data-result={result}
                  onClick={() => goToQuestion(index)}
                >
                  {index + 1}
                  {result === "correct" && <Check size={12} aria-hidden="true" />}
                  {result === "incorrect" && <X size={12} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          <button className={`secondary-button ${styles.newSet}`} type="button" onClick={startNewSet} aria-describedby="cbt-new-set-note">
            <RotateCw size={17} aria-hidden="true" /> 이 과목 새 세트
          </button>
          <p id="cbt-new-set-note" className={styles.newSetNote}>이 과목의 풀이 기록을 초기화하고, 이전 세트에 없던 문제부터 담습니다.</p>
        </aside>
      </div>
    </>
  );
}
