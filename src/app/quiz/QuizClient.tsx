"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { QuizQuestion as QuizQuestionType, QuizResult, Verb } from "@/types";
import { pickQuizQuestions, getVerbById } from "@/lib/utils";
import { useLearning } from "@/lib/LearningContext";
import QuizQuestionComponent from "@/components/QuizQuestion";

const QUIZ_COUNT = 10;

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface QuizClientProps {
  allQuestions: QuizQuestionType[];
  verbs: Verb[];
}

export default function QuizClient({ allQuestions, verbs }: QuizClientProps) {
  const { saveQuizResult, quizHistory } = useLearning();
  const savedRef = useRef(false);

  const [questions, setQuestions] = useState<QuizQuestionType[]>(() =>
    pickQuizQuestions(allQuestions, QUIZ_COUNT)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<QuizResult>({
    totalQuestions: 0,
    correctCount: 0,
    answers: [],
  });
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished && result.totalQuestions > 0 && !savedRef.current) {
      savedRef.current = true;
      saveQuizResult(result.correctCount, result.totalQuestions);
    }
  }, [finished, result.correctCount, result.totalQuestions, saveQuizResult]);

  const handleAnswer = useCallback(
    (answer: string, isCorrect: boolean) => {
      const newResult: QuizResult = {
        ...result,
        totalQuestions: result.totalQuestions + 1,
        correctCount: result.correctCount + (isCorrect ? 1 : 0),
        answers: [
          ...result.answers,
          {
            questionId: questions[currentIndex].id,
            userAnswer: answer,
            isCorrect,
          },
        ],
      };
      setResult(newResult);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFinished(true);
      }
    },
    [currentIndex, questions, result]
  );

  const restart = () => {
    savedRef.current = false;
    setQuestions(pickQuizQuestions(allQuestions, QUIZ_COUNT));
    setCurrentIndex(0);
    setResult({ totalQuestions: 0, correctCount: 0, answers: [] });
    setFinished(false);
  };

  const scorePercent = useMemo(
    () => Math.round((result.correctCount / result.totalQuestions) * 100),
    [result]
  );

  const recentHistory = quizHistory.slice(0, 3);

  if (finished) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            퀴즈 결과
          </h1>
          <div className="my-8">
            <div className="mb-2 text-6xl font-bold text-indigo-600 dark:text-indigo-400">
              {scorePercent}%
            </div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {result.totalQuestions}문제 중 {result.correctCount}문제 정답
            </p>
          </div>

          <div className="mb-8 space-y-3 text-left">
            {result.answers.map((ans, i) => {
              const q = questions.find((q) => q.id === ans.questionId)!;
              const verb = getVerbById(verbs, q.verbId);
              return (
                <div
                  key={i}
                  className={`rounded-lg border p-4 ${
                    ans.isCorrect
                      ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                      : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {q.question}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        구동사: {verb?.verb} | 내 답: {ans.userAnswer}
                        {!ans.isCorrect && ` → 정답: ${q.correctAnswer}`}
                      </p>
                    </div>
                    <span className="text-lg">{ans.isCorrect ? "O" : "X"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {recentHistory.length > 0 && (
            <div className="mb-8 text-left">
              <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                최근 퀴즈 기록
              </h2>
              <div className="space-y-2">
                {recentHistory.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-2 text-sm dark:bg-zinc-800"
                  >
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {formatDate(h.date)}
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {h.score}/{h.total}점 (
                      {Math.round((h.score / h.total) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={restart}
              className="rounded-full bg-indigo-600 px-8 py-3 font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              다시 풀기
            </button>
            <Link
              href="/verbs"
              className="rounded-full border border-zinc-300 px-8 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              구동사 복습하기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        구동사 퀴즈
      </h1>
      <QuizQuestionComponent
        key={questions[currentIndex].id}
        question={questions[currentIndex]}
        onAnswer={handleAnswer}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
      />
    </div>
  );
}
