"use client";

import { Example } from "@/types";
import { tokenizeEnglish } from "@/lib/utils";
import ClickableWord from "./ClickableWord";
import { useLearning } from "@/lib/LearningContext";

interface ExampleSentenceProps {
  example: Example;
  index: number;
}

export default function ExampleSentence({ example, index }: ExampleSentenceProps) {
  const { isCompleted, toggleCompleted } = useLearning();
  const completed = isCompleted(example.id);

  // highlight 기준으로 분리 후 각 파트를 토큰화
  const parts = example.english.split(new RegExp(`(${example.highlight})`, "i"));

  return (
    <div
      className={`rounded-xl border p-5 transition-shadow hover:shadow-md ${
        completed
          ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30"
          : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
          예문 {index + 1}
        </span>
        <button
          onClick={() => toggleCompleted(example.id)}
          aria-label={completed ? "학습 완료 취소" : "학습 완료로 표시"}
          className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs transition-colors ${
            completed
              ? "border-green-500 bg-green-500 text-white"
              : "border-zinc-300 text-zinc-400 hover:border-green-400 hover:text-green-500 dark:border-zinc-600 dark:text-zinc-500"
          }`}
        >
          ✓
        </button>
      </div>

      <p className="mb-2 text-lg font-medium text-zinc-900 dark:text-zinc-100">
        {parts.map((part, i) => {
          const isHighlighted =
            part.toLowerCase() === example.highlight.toLowerCase();
          return tokenizeEnglish(part).map((token, j) => (
            <ClickableWord
              key={`${i}-${j}`}
              token={token}
              isHighlighted={isHighlighted}
            />
          ));
        })}
      </p>

      <p className="mb-3 text-base text-zinc-600 dark:text-zinc-400">
        {example.korean}
      </p>
      <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
        {example.pattern}
      </span>
    </div>
  );
}
