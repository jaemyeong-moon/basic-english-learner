import { getAllVerbs, getAllQuizQuestions } from "@/lib/data";
import QuizClient from "./QuizClient";

export const metadata = {
  title: "구동사 퀴즈 - 영어 구동사 학습",
};

export default async function QuizPage() {
  const [allQuestions, verbs] = await Promise.all([
    getAllQuizQuestions(),
    getAllVerbs(),
  ]);

  return <QuizClient allQuestions={allQuestions} verbs={verbs} />;
}
