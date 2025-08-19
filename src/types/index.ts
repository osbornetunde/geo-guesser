export type Phase = "start" | "question" | "reveal" | "finished" | "waiting";

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

export interface GameScreenProps {
  availableQuestions: Question[];
  streak: number;
  timeLeft: number;
  currentQuestion: Question;
  imageLoaded: boolean;
  imageLoading: boolean;
  handleImageLoad: () => void;
  locked: boolean;
  selected: number | null;
  handleSelect: (index: number) => void;
  showScoreAnimation: boolean;
  earnedPoints: number;
  phase: Phase;
}
