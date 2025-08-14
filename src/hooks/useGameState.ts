import { useCallback, useRef, useState } from "react";
import {
  BASE_POINTS,
  STREAK_BONUS_MULTIPLIER,
  TIMER_DURATION,
} from "../constants/game";
import { questions } from "../data";
import type { Phase, Player, TeamStats } from "../types/game";

export type GameState = ReturnType<typeof useGameState>;

export const useGameState = () => {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("start");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [locked, setLocked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [availableQuestions, setAvailableQuestions] = useState(questions);
  const [usedQuestions, setUsedQuestions] = useState<typeof questions>([]);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  // Team state
  const [lastPlayedStreak, setLastPlayedStreak] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [teamMode, setTeamMode] = useState(false);
  const [collaborativeMode, setCollaborativeMode] = useState(false);
  const [teamStats, setTeamStats] = useState<TeamStats>({
    totalScore: 0,
    totalCorrect: 0,
    averageTime: 0,
    bestStreak: 0,
  });

  const timerRef = useRef<number | null>(null);
  const timeLeftRef = useRef(timeLeft);
  const currentQuestion = availableQuestions[round];

  const calculatePoints = useCallback((timeLeft: number, streak: number) => {
    const basePoints = Math.floor((timeLeft / TIMER_DURATION) * BASE_POINTS);
    const streakBonus = streak * STREAK_BONUS_MULTIPLIER;
    return basePoints + streakBonus;
  }, []);

  const resetGame = useCallback(() => {
    setRound(0);
    setScore(0);
    setPhase("start");
    setAvailableQuestions(questions);
    setUsedQuestions([]);
    setImageLoaded(false);
    setImageLoading(true);
    setSelected(null);
    setLocked(false);
    setStreak(0);
    setTeamMode(false);
    setPlayers([]);
    setCurrentPlayer(null);
    setTeamStats({
      totalScore: 0,
      totalCorrect: 0,
      averageTime: 0,
      bestStreak: 0,
    });
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startRound = useCallback(() => {
    if (availableQuestions.length === 0) {
      setPhase("finished");
      return;
    }
    setPhase("question");
    setRound(Math.floor(Math.random() * availableQuestions.length));
    setImageLoaded(false);
    setImageLoading(true);
    setSelected(null);

    if (teamMode && players.length > 1) {
      const currentIndex = players.findIndex((p) => p.id === currentPlayer?.id);
      const nextIndex = (currentIndex + 1) % players.length;
      setCurrentPlayer(players[nextIndex]);
    }
  }, [availableQuestions, teamMode, players, currentPlayer]);

  return {
    // State
    round,
    selected,
    score,
    phase,
    timeLeft,
    locked,
    imageLoaded,
    imageLoading,
    availableQuestions,
    usedQuestions,
    showScoreAnimation,
    earnedPoints,
    streak,
    players,
    currentPlayer,
    teamMode,
    collaborativeMode,
    teamStats,
    currentQuestion,
    timerRef,
    timeLeftRef,

    // Actions
    setRound,
    lastPlayedStreak,
    setSelected,
    setScore,
    setPhase,
    setTimeLeft,
    setLocked,
    setImageLoaded,
    setImageLoading,
    setAvailableQuestions,
    setUsedQuestions,
    setShowScoreAnimation,
    setEarnedPoints,
    setStreak,
    setPlayers,
    setCurrentPlayer,
    setTeamMode,
    setCollaborativeMode,
    setTeamStats,
    calculatePoints,
    resetGame,
    startRound,
    setLastPlayedStreak,
  };
};
