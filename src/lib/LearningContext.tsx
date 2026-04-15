"use client";

import {
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import useLocalStorage from "./useLocalStorage";
import { QuizHistoryEntry, VerbProgress } from "@/types";

interface LearningContextValue {
  completedExampleIds: string[];
  quizHistory: QuizHistoryEntry[];
  isCompleted: (exampleId: string) => boolean;
  toggleCompleted: (exampleId: string) => void;
  getVerbProgress: (verbId: string, exampleIds: string[]) => VerbProgress;
  saveQuizResult: (score: number, total: number) => void;
}

const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [completedExampleIds, setCompletedExampleIds] = useLocalStorage<string[]>(
    "bel_completed_examples",
    []
  );
  const [quizHistory, setQuizHistory] = useLocalStorage<QuizHistoryEntry[]>(
    "bel_quiz_history",
    []
  );

  const isCompleted = useCallback(
    (exampleId: string) => completedExampleIds.includes(exampleId),
    [completedExampleIds]
  );

  const toggleCompleted = useCallback(
    (exampleId: string) => {
      setCompletedExampleIds((prev) =>
        prev.includes(exampleId)
          ? prev.filter((id) => id !== exampleId)
          : [...prev, exampleId]
      );
    },
    [setCompletedExampleIds]
  );

  const getVerbProgress = useCallback(
    (verbId: string, exampleIds: string[]): VerbProgress => {
      const completedCount = exampleIds.filter((id) =>
        completedExampleIds.includes(id)
      ).length;
      return { verbId, completedCount, totalCount: exampleIds.length };
    },
    [completedExampleIds]
  );

  const saveQuizResult = useCallback(
    (score: number, total: number) => {
      const entry: QuizHistoryEntry = {
        score,
        total,
        date: new Date().toISOString(),
      };
      setQuizHistory((prev) => [entry, ...prev].slice(0, 10));
    },
    [setQuizHistory]
  );

  return (
    <LearningContext.Provider
      value={{
        completedExampleIds,
        quizHistory,
        isCompleted,
        toggleCompleted,
        getVerbProgress,
        saveQuizResult,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning(): LearningContextValue {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error("useLearning must be used within LearningProvider");
  return ctx;
}
