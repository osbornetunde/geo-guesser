export type Phase = "start" | "setup" | "question" | "reveal" | "finished" | "waiting";

export interface Player {
  id: string;
  name: string;
  score: number;
  correctAnswers: number;
  streak: number;
  avatar: string;
}

export interface TeamStats {
  totalScore: number;
  totalCorrect: number;
  averageTime: number;
  bestStreak: number;
}

export interface PerformanceData {
  emoji: string;
  message: string;
  color: string;
}

export interface Question {
  id: number;
  image: string;
  options: string[];
  answerIndex: number;
  credit: string;
  explain: string;
  hint?: string;
}