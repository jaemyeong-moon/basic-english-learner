export interface Example {
  id: string;
  english: string;
  korean: string;
  pattern: string;
  highlight: string;
}

export interface Verb {
  id: string;
  verb: string;
  meaning: string;
  description: string;
  examples: Example[];
}

export type QuizType = "fill-in-the-blank" | "multiple-choice";

export interface QuizQuestion {
  id: string;
  verbId: string;
  type: QuizType;
  question: string;
  correctAnswer: string;
  options?: string[];
  hint?: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctCount: number;
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface QuizHistoryEntry {
  score: number;
  total: number;
  date: string; // ISO 8601
}

export interface VerbProgress {
  verbId: string;
  completedCount: number;
  totalCount: number;
}

export interface LearningProgress {
  completedExampleIds: string[];
  quizHistory: QuizHistoryEntry[];
}

export interface Token {
  text: string;
  isWord: boolean;
}
