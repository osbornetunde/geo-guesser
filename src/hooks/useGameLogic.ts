import { useCallback, useEffect, useRef, useState } from "react";
import { REVEAL_DURATION, TIMER_DURATION } from "../constants/game";
import { questions } from "../data";
import type { Phase } from "../types";

export const useGameLogic = () => {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("start");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [locked, setLocked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [availableQuestions, setAvailableQuestions] =
    useState<typeof questions>(questions);
  const [usedQuestions, setUsedQuestions] = useState<
    (typeof questions)[number][]
  >([]);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  const timerRef = useRef<number | null>(null);
  const timeLeftRef = useRef(timeLeft);
  const currentQuestion = availableQuestions[round];

  useEffect(() => {
    setImageLoaded(false);
    setImageLoading(true);
  }, [round]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const handleTimeout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setLocked(true);
    setPhase("reveal");
    // No points should be awarded on timeout
    setEarnedPoints(0);
    setStreak(0);
  };

  useEffect(() => {
    if (phase !== "question") return;
    setTimeLeft(TIMER_DURATION);
    setLocked(false);
    setSelected(null);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [round, phase]);

  const handleSelect = useCallback(
    (index: number) => {
      if (locked) return;
      setSelected(index);
      setLocked(true);
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("reveal");

      if (index === currentQuestion.answerIndex) {
        const basePoints = Math.floor(
          (timeLeftRef.current / TIMER_DURATION) * 100
        );
        const streakBonus = streak * 10;
        const earned = basePoints + streakBonus;
        setEarnedPoints(earned);
        setScore((s) => s + earned);
        setShowScoreAnimation(true);
        setStreak((s) => s + 1);
        setTimeout(() => setShowScoreAnimation(false), 1500);
      } else {
        setStreak(0);
      }
    },
    [locked, currentQuestion, streak]
  );

  useEffect(() => {
    if (phase !== "reveal") return;
    const timeout = setTimeout(() => {
      const currentQ = availableQuestions[round];
      setUsedQuestions((prev) => [...prev, currentQ]);
      setAvailableQuestions((prev) =>
        prev.filter((_, index) => index !== round)
      );

      if (availableQuestions.length <= 1) {
        setPhase("finished");
      } else {
        setPhase("waiting");
      }
    }, REVEAL_DURATION);
    return () => clearTimeout(timeout);
  }, [phase, round, availableQuestions]);

  const startRound = () => {
    if (availableQuestions.length === 0) {
      setPhase("finished");
      return;
    }
    setPhase("question");
    setRound(Math.floor(Math.random() * availableQuestions.length));
    setImageLoaded(false);
    setImageLoading(true);
    setSelected(null);
  };

  const resetGame = () => {
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
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageLoading(false);
  };

  return {
    phase,
    score,
    streak,
    timeLeft,
    locked,
    selected,
    earnedPoints,
    imageLoaded,
    imageLoading,
    currentQuestion,
    availableQuestions,
    usedQuestions,
    showScoreAnimation,
    startRound,
    resetGame,
    handleSelect,
    handleImageLoad,
  };
};
