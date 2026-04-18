/**
 * 마이그레이션 스크립트: verbs.ts → Supabase
 *
 * 실행: npx tsx scripts/migrate.ts
 *
 * 사전 조건:
 * 1. .env.local에 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 설정
 * 2. Supabase에 schema.sql 실행 완료
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// .env.local 로드
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey || supabaseKey === "your-service-role-key-here") {
  console.error("ERROR: .env.local에 SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 설정하세요.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  // 동적 import로 verbs.ts 로드
  const { verbs, quizQuestions } = await import("../src/data/verbs");

  console.log(`동사 ${verbs.length}개, 퀴즈 ${quizQuestions.length}개 마이그레이션 시작...`);

  // 1. 동사 upsert
  const verbRows = verbs.map((v, i) => ({
    id: v.id,
    verb: v.verb,
    meaning: v.meaning,
    description: v.description,
    sort_order: i,
  }));

  const { error: verbError } = await supabase
    .from("verbs")
    .upsert(verbRows, { onConflict: "id" });

  if (verbError) {
    console.error("동사 upsert 실패:", verbError);
    process.exit(1);
  }
  console.log(`  동사 ${verbRows.length}개 upsert 완료`);

  // 2. 예문 upsert (배치 처리 - 500개씩)
  const exampleRows: Array<{
    id: string;
    verb_id: string;
    english: string;
    korean: string;
    pattern: string;
    highlight: string;
    sort_order: number;
  }> = [];

  for (const verb of verbs) {
    for (let i = 0; i < verb.examples.length; i++) {
      const ex = verb.examples[i];
      exampleRows.push({
        id: ex.id,
        verb_id: verb.id,
        english: ex.english,
        korean: ex.korean,
        pattern: ex.pattern,
        highlight: ex.highlight,
        sort_order: i,
      });
    }
  }

  const BATCH_SIZE = 500;
  for (let i = 0; i < exampleRows.length; i += BATCH_SIZE) {
    const batch = exampleRows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("examples")
      .upsert(batch, { onConflict: "id" });

    if (error) {
      console.error(`예문 배치 ${i}-${i + batch.length} upsert 실패:`, error);
      process.exit(1);
    }
    console.log(`  예문 ${i + batch.length}/${exampleRows.length} upsert 완료`);
  }

  // 3. 퀴즈 upsert
  const quizRows = quizQuestions.map((q) => ({
    id: q.id,
    verb_id: q.verbId,
    type: q.type,
    question: q.question,
    correct_answer: q.correctAnswer,
    options: q.options ?? null,
    hint: q.hint ?? null,
  }));

  const { error: quizError } = await supabase
    .from("quiz_questions")
    .upsert(quizRows, { onConflict: "id" });

  if (quizError) {
    console.error("퀴즈 upsert 실패:", quizError);
    process.exit(1);
  }
  console.log(`  퀴즈 ${quizRows.length}개 upsert 완료`);

  console.log("\n마이그레이션 완료!");
  console.log(`  총 동사: ${verbRows.length}개`);
  console.log(`  총 예문: ${exampleRows.length}개`);
  console.log(`  총 퀴즈: ${quizRows.length}개`);
}

migrate().catch(console.error);
