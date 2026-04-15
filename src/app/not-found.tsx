import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="mb-4 text-6xl font-bold text-zinc-300 dark:text-zinc-700">404</h1>
      <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="inline-flex h-12 items-center rounded-full bg-indigo-600 px-8 font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
