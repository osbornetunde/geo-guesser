export type Phase = "start" | "setup" | "question" | "reveal" | "finished" | "waiting";

export type Difficulty = "easy" | "medium" | "hard" | "all";

export interface GameSettings {
  difficulty: Difficulty;
  questionCount: number;
}

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
  averageTime?: number;
  bestStreak?: number;
}

export interface PerformanceData {
  emoji: string;
  message: string;
  color: string;
}

export interface Question {
  id: number | string;
  image: string;
  options: string[];
  answerIndex: number;
  credit: string;
  explain: string;
  hint?: string;
  category?: string;
  country?: string;
  difficulty?: "easy" | "medium" | "hard";
  coords?: { lat: number; lng: number };
  license?: string;
}

export interface WaitingScreenProps {
  teamMode: boolean;
  teamStats: TeamStats;
  score: number;
  availableQuestions: Question[];
  streak: number;
  players: Player[];
  currentPlayer: Player | null;
  collaborativeMode: boolean;
  startRound: () => void;
  resetGame: () => void;
  earnedPoints: number;
  lastPlayedStreak: number;
}

export type RawQ = {
  id: string;
  image: string;
  credit?: string;
  license?: string;
  answer: string;
  distractors: string[]; // length should be 3
  hint?: string;
  explain?: string;
  category?: string; // e.g. 'landmark' | 'nature' | 'cultural' | 'city' | 'island'
  country?: string;
  coords?: { lat: number; lng: number };
  difficulty?: "easy" | "medium" | "hard";
};