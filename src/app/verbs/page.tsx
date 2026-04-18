import { getAllVerbs } from "@/lib/data";
import VerbCard from "@/components/VerbCard";

export const metadata = {
  title: "구동사 학습 - 영어 구동사(Phrasal Verb) 학습",
};

export default async function VerbsPage() {
  const verbs = await getAllVerbs();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        구동사(Phrasal Verb) 학습
      </h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        기초 동사의 전치사 활용 구동사를 예문과 함께 학습하세요.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {verbs.map((verb) => (
          <VerbCard key={verb.id} verb={verb} />
        ))}
      </div>
    </div>
  );
}
