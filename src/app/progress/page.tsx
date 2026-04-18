import { getAllVerbs } from "@/lib/data";
import ProgressClient from "./ProgressClient";

export const metadata = {
  title: "내 학습 현황 - 영어 구동사 학습",
};

export default async function ProgressPage() {
  const verbs = await getAllVerbs();

  return <ProgressClient verbs={verbs} />;
}
