"use client";

import Link from "next/link";
import { Verb } from "@/types";
import { useLearning } from "@/lib/LearningContext";

interface VerbCardProps {
  verb: Verb;
}

export default function VerbCard({ verb }: VerbCardProps) {
  const { getVerbProgress } = useLearning();
  const exampleIds = verb.examples.map((e) => e.id);
  const { completedCount, totalCount } = getVerbProgress(verb.id, exampleIds);
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Link
      href={`/verbs/${verb.id}`}
      className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-indigo-300 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-indigo-700"
    >
      <div className="mb-2 text-2xl font-bold text-indigo-600 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300">
        {verb.verb}
      </div>
      <div className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {verb.meaning}
      </div>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
        {verb.description}
      </p>

      {/* 진도 표시 */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
          <span>예문 {totalCount}개</span>
          <span>
            {completedCount} / {totalCount} 완료
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
