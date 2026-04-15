"use client";

import Link from "next/link";
import { verbs } from "@/data/verbs";
import { useLearning } from "@/lib/LearningContext";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function ProgressPage() {
  const { completedExampleIds, quizHistory, getVerbProgress } = useLearning();

  const totalExamples = verbs.reduce((sum, v) => sum + v.examples.length, 0);
  const totalCompleted = completedExampleIds.length;
  const overallPercent =
    totalExamples > 0 ? Math.round((totalCompleted / totalExamples) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        내 학습 현황
      </h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        localStorage에 저장된 학습 진도를 확인하세요.
      </p>

      {/* 전체 진도 */}
      <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          전체 학습률
        </h2>
        <div className="mb-2 flex items-end gap-3">
          <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
            {overallPercent}%
          </span>
          <span className="mb-1 text-sm text-zinc-500 dark:text-zinc-400">
            ({totalCompleted} / {totalExamples} 예문 완료)
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {/* 동사별 진도 */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          동사별 학습 진도
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {verbs.map((verb) => {
            const exampleIds = verb.examples.map((e) => e.id);
            const { completedCount, totalCount } = getVerbProgress(
              verb.id,
              exampleIds
            );
            const pct =
              totalCount > 0
                ? Math.round((completedCount / totalCount) * 100)
                : 0;
            return (
              <Link
                key={verb.id}
                href={`/verbs/${verb.id}`}
                className="rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-indigo-700"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {verb.verb}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {completedCount}/{totalCount}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pct === 100 ? "bg-green-500" : "bg-indigo-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {pct === 100 && (
                  <p className="mt-1 text-right text-xs font-medium text-green-600 dark:text-green-400">
                    완료!
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 퀴즈 히스토리 */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          퀴즈 기록
        </h2>
        {quizHistory.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900">
            아직 퀴즈 기록이 없습니다.{" "}
            <Link href="/quiz" className="text-indigo-600 underline dark:text-indigo-400">
              퀴즈 풀러 가기
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                    날짜
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-zinc-500 dark:text-zinc-400">
                    점수
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                    정답률
                  </th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.map((h, i) => {
                  const pct = Math.round((h.score / h.total) * 100);
                  return (
                    <tr
                      key={i}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                    >
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {formatDate(h.date)}
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-zinc-900 dark:text-zinc-100">
                        {h.score}/{h.total}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-semibold ${
                          pct >= 80
                            ? "text-green-600 dark:text-green-400"
                            : pct >= 60
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
