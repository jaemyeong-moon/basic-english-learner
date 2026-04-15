import { notFound } from "next/navigation";
import Link from "next/link";
import { verbs } from "@/data/verbs";
import { getVerbById, getAdjacentVerbs } from "@/lib/utils";
import ExampleSentence from "@/components/ExampleSentence";

interface VerbPageProps {
  params: Promise<{ verb: string }>;
}

export function generateStaticParams() {
  return verbs.map((v) => ({ verb: v.id }));
}

export async function generateMetadata({ params }: VerbPageProps) {
  const { verb: verbId } = await params;
  const verb = getVerbById(verbId);
  if (!verb) return { title: "동사를 찾을 수 없습니다" };
  return { title: `${verb.verb} - ${verb.meaning} | 영어 구동사 학습` };
}

export default async function VerbDetailPage({ params }: VerbPageProps) {
  const { verb: verbId } = await params;
  const verb = getVerbById(verbId);

  if (!verb) notFound();

  const { prev, next } = getAdjacentVerbs(verbId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/verbs"
        className="mb-6 inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        &larr; 동사 목록으로
      </Link>

      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-bold text-indigo-600 dark:text-indigo-400">
          {verb.verb}
        </h1>
        <p className="mb-2 text-xl font-medium text-zinc-700 dark:text-zinc-300">
          {verb.meaning}
        </p>
        <p className="text-zinc-500 dark:text-zinc-400">{verb.description}</p>
      </div>

      <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
        예문 ({verb.examples.length}개)
      </h2>
      <div className="mb-10 flex flex-col gap-4">
        {verb.examples.map((example, index) => (
          <ExampleSentence key={example.id} example={example} index={index} />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
        {prev ? (
          <Link
            href={`/verbs/${prev.id}`}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            &larr; {prev.verb}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/verbs/${next.id}`}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {next.verb} &rarr;
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
