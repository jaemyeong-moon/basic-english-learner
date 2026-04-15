import { verbs, quizQuestions } from "@/data/verbs";
import { QuizQuestion, Token } from "@/types";

export function getVerbById(id: string) {
  return verbs.find((v) => v.id === id);
}

export function getVerbIndex(id: string) {
  return verbs.findIndex((v) => v.id === id);
}

export function getAdjacentVerbs(id: string) {
  const index = getVerbIndex(id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? verbs[index - 1] : null,
    next: index < verbs.length - 1 ? verbs[index + 1] : null,
  };
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getQuizQuestions(count: number = 10): QuizQuestion[] {
  return shuffleArray(quizQuestions).slice(0, count);
}

// 영어 문장을 단어/비단어(구두점·공백) 토큰 배열로 분리
export function tokenizeEnglish(sentence: string): Token[] {
  const tokens: Token[] = [];
  const regex = /([A-Za-z'-]+)|([^A-Za-z'-]+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(sentence)) !== null) {
    if (match[1]) {
      tokens.push({ text: match[1], isWord: true });
    } else {
      tokens.push({ text: match[2], isWord: false });
    }
  }
  return tokens;
}
