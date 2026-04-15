"use client";

import { useState } from "react";
import { QuizQuestion as QuizQuestionType } from "@/types";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuizQuestion({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuizQuestionProps) {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = (answer: string) => {
    if (answered) return;
    const correct = answer.trim().toLowerCase() === question.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setAnswered(true);
    if (question.type === "multiple-choice") setSelected(answer);
    setTimeout(() => onAnswer(answer, correct), 1200);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {questionNumber} / {totalQuestions}
        </span>
        <div className="h-2 flex-1 mx-4 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-400"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-900">
        <p className="mb-6 text-xl font-medium text-zinc-900 dark:text-zinc-100">
          {question.question}
        </p>

        {question.type === "fill-in-the-blank" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) handleSubmit(input);
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={answered}
              placeholder="빈칸에 들어갈 전치사를 입력하세요"
              className="mb-4 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-lg outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-indigo-800"
              autoFocus
            />
            {!answered && (
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-40 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                확인
              </button>
            )}
          </form>
        ) : (
          <div className="flex flex-col gap-3">
            {question.options?.map((option) => {
              let style = "border-zinc-300 bg-white hover:border-indigo-400 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-indigo-500";
              if (answered) {
                if (option.toLowerCase() === question.correctAnswer.toLowerCase()) {
                  style = "border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-950";
                } else if (selected === option && !isCorrect) {
                  style = "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-950";
                } else {
                  style = "border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-700 dark:bg-zinc-900";
                }
              }
              return (
                <button
                  key={option}
                  onClick={() => handleSubmit(option)}
                  disabled={answered}
                  className={`rounded-lg border-2 px-4 py-3 text-left text-lg font-medium transition-all ${style} text-zinc-900 dark:text-zinc-100`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {answered && (
          <div
            className={`mt-4 rounded-lg p-4 text-center font-medium ${
              isCorrect
                ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {isCorrect ? "정답입니다!" : `오답! 정답: ${question.correctAnswer}`}
          </div>
        )}

        {!answered && question.hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="mt-4 text-sm text-zinc-500 underline hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            {showHint ? "힌트 숨기기" : "힌트 보기"}
          </button>
        )}
        {showHint && !answered && (
          <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-400">
            힌트: {question.hint}
          </p>
        )}
      </div>
    </div>
  );
}
