import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase/server";
import { Verb, Example, QuizQuestion } from "@/types";

// --- DB 로우 → 앱 타입 변환 ---

interface DbVerb {
  id: string;
  verb: string;
  meaning: string;
  description: string;
  sort_order: number;
}

interface DbExample {
  id: string;
  verb_id: string;
  english: string;
  korean: string;
  pattern: string;
  highlight: string;
  sort_order: number;
}

interface DbQuizQuestion {
  id: string;
  verb_id: string;
  type: string;
  question: string;
  correct_answer: string;
  options: string[] | null;
  hint: string | null;
}

function toExample(row: DbExample): Example {
  return {
    id: row.id,
    english: row.english,
    korean: row.korean,
    pattern: row.pattern,
    highlight: row.highlight,
  };
}

function toQuizQuestion(row: DbQuizQuestion): QuizQuestion {
  return {
    id: row.id,
    verbId: row.verb_id,
    type: row.type as QuizQuestion["type"],
    question: row.question,
    correctAnswer: row.correct_answer,
    options: row.options ?? undefined,
    hint: row.hint ?? undefined,
  };
}

// --- 캐시된 데이터 fetch 함수들 ---

export const getAllVerbs = unstable_cache(
  async (): Promise<Verb[]> => {
    const { data: verbRows, error: verbError } = await supabase
      .from("verbs")
      .select("*")
      .order("sort_order");

    if (verbError) throw verbError;
    if (!verbRows || verbRows.length === 0) return [];

    const { data: exampleRows, error: exError } = await supabase
      .from("examples")
      .select("*")
      .order("sort_order");

    if (exError) throw exError;

    const examplesByVerb = new Map<string, Example[]>();
    for (const row of exampleRows ?? []) {
      const list = examplesByVerb.get(row.verb_id) ?? [];
      list.push(toExample(row));
      examplesByVerb.set(row.verb_id, list);
    }

    return verbRows.map((v: DbVerb) => ({
      id: v.id,
      verb: v.verb,
      meaning: v.meaning,
      description: v.description,
      examples: examplesByVerb.get(v.id) ?? [],
    }));
  },
  ["all-verbs"],
  { tags: ["verb-data"], revalidate: 3600 }
);

export const getAllVerbIds = unstable_cache(
  async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from("verbs")
      .select("id")
      .order("sort_order");

    if (error) throw error;
    return (data ?? []).map((v: { id: string }) => v.id);
  },
  ["all-verb-ids"],
  { tags: ["verb-data"], revalidate: 3600 }
);

export const getVerbWithExamples = unstable_cache(
  async (verbId: string): Promise<Verb | null> => {
    const { data: verbRow, error: verbError } = await supabase
      .from("verbs")
      .select("*")
      .eq("id", verbId)
      .single();

    if (verbError || !verbRow) return null;

    const { data: exampleRows, error: exError } = await supabase
      .from("examples")
      .select("*")
      .eq("verb_id", verbId)
      .order("sort_order");

    if (exError) throw exError;

    return {
      id: verbRow.id,
      verb: verbRow.verb,
      meaning: verbRow.meaning,
      description: verbRow.description,
      examples: (exampleRows ?? []).map(toExample),
    };
  },
  ["verb-with-examples"],
  { tags: ["verb-data"], revalidate: 3600 }
);

export const getAllQuizQuestions = unstable_cache(
  async (): Promise<QuizQuestion[]> => {
    const { data, error } = await supabase
      .from("quiz_questions")
      .select("*");

    if (error) throw error;
    return (data ?? []).map(toQuizQuestion);
  },
  ["all-quiz-questions"],
  { tags: ["verb-data"], revalidate: 3600 }
);
