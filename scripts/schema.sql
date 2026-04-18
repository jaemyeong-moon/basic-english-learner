-- Supabase 스키마: English Learner
-- 실행: Supabase Dashboard > SQL Editor에서 실행

CREATE TABLE IF NOT EXISTS verbs (
  id TEXT PRIMARY KEY,
  verb TEXT NOT NULL,
  meaning TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS examples (
  id TEXT PRIMARY KEY,
  verb_id TEXT NOT NULL REFERENCES verbs(id) ON DELETE CASCADE,
  english TEXT NOT NULL,
  korean TEXT NOT NULL,
  pattern TEXT NOT NULL,
  highlight TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY,
  verb_id TEXT NOT NULL REFERENCES verbs(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('fill-in-the-blank', 'multiple-choice')),
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  options JSONB,
  hint TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_examples_verb_id ON examples(verb_id);
CREATE INDEX IF NOT EXISTS idx_examples_verb_sort ON examples(verb_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_quiz_verb_id ON quiz_questions(verb_id);
