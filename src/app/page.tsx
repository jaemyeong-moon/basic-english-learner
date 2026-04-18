import Link from "next/link";
import { getAllVerbs } from "@/lib/data";

export default async function Home() {
  const verbs = await getAllVerbs();

  return (
    <div>
      <section className="bg-gradient-to-b from-indigo-50 to-white py-20 dark:from-indigo-950/30 dark:to-zinc-950">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            영어 구동사 <span className="text-indigo-600 dark:text-indigo-400">마스터</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            make out, get over, take off 등 전치사를 활용한 구동사를
            <br className="hidden sm:block" />
            다양한 예문과 패턴으로 학습하세요.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/verbs"
              className="inline-flex h-12 items-center rounded-full bg-indigo-600 px-8 font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              학습 시작하기
            </Link>
            <Link
              href="/quiz"
              className="inline-flex h-12 items-center rounded-full border border-zinc-300 bg-white px-8 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              퀴즈 풀기
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            학습할 구동사
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {verbs.map((verb) => (
              <Link
                key={verb.id}
                href={`/verbs/${verb.id}`}
                className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-indigo-700"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-lg font-bold text-indigo-600 group-hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 dark:group-hover:bg-indigo-900">
                  {verb.verb.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {verb.verb}
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {verb.meaning}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
