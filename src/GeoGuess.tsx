import { useCallback, useEffect } from "react";

// Hooks
import { useGameState, type GameState } from "./hooks/useGameState";

// Components
import { GameScreen } from "./components/screens/GameScreen";
import { ParticleBackground } from "./components/ui/ParticleBackground";

// Constants
import { REVEAL_DURATION, TIMER_DURATION } from "./constants/game";

// Utils
import { triggerConfetti } from "./utils/game";

// ============= MAIN COMPONENT =============
export default function GeoGuessMiniApp() {
  const gameState = useGameState();
  const {
    round,
    phase,
    timeLeft,
    locked,
    streak,
    teamMode,
    currentPlayer,
    availableQuestions,
    timerRef,
    timeLeftRef,
    setPhase,
    setLocked,
    setSelected,
    setStreak,
    calculatePoints,
    setEarnedPoints,
    setScore,
    setShowScoreAnimation,
    setPlayers,
    setTeamStats,
    setUsedQuestions,
    setAvailableQuestions,
    setTimeLeft,
    setImageLoaded,
    setImageLoading,
  } = gameState;

  // Reset image loading state when round changes
  useEffect(() => {
    setImageLoaded(false);
    setImageLoading(true);
  }, [round, setImageLoaded, setImageLoading]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft, timeLeftRef]);

  // Timer logic
  useEffect(() => {
    if (phase !== "question") return;
    setTimeLeft(TIMER_DURATION);
    setLocked(false);
    setSelected(null);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setLocked(true);
          setPhase("reveal");

          // Reset streak on timeout based on mode
          if (teamMode && currentPlayer) {
            setPlayers((prev) =>
              prev.map((p) =>
                p.id === currentPlayer.id ? { ...p, streak: 0 } : p
              )
            );
          } else {
            setStreak(0);
          }

          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [
    round,
    phase,
    setTimeLeft,
    setLocked,
    setSelected,
    setPhase,
    setStreak,
    setPlayers,
    teamMode,
    currentPlayer,
    timerRef,
  ]);

  // Handle answer selection
  const handleSelect = useCallback(
    (index: number) => {
      if (locked) return;
      setSelected(index);
      setLocked(true);
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("reveal");

      const { currentQuestion } = gameState;

      if (currentQuestion && index === currentQuestion.answerIndex) {
        // Get current player's streak for calculation
        const currentStreak =
          teamMode && currentPlayer ? currentPlayer.streak : streak;
        const earned = 10;
        setEarnedPoints(earned);

        // Update score based on mode
        if (!teamMode) {
          setScore((s) => s + earned);
        }

        setShowScoreAnimation(true);

        // Update streak and lastPlayedStreak for Wait screen
        if (teamMode && currentPlayer) {
          gameState.setLastPlayedStreak(currentPlayer.streak + 1);
        } else {
          gameState.setLastPlayedStreak(streak + 1);
        }

        // Update streak based on mode
        if (teamMode && currentPlayer) {
          const newPlayerStreak = currentPlayer.streak + 1;
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === currentPlayer.id
                ? {
                    ...p,
                    score: p.score + 10,
                    correctAnswers: p.correctAnswers + 1,
                    streak: newPlayerStreak,
                  }
                : p
            )
          );
          setTeamStats((prev) => ({
            ...prev,
            totalScore: prev.totalScore + 10,
            totalCorrect: prev.totalCorrect + 1,
            bestStreak: Math.max(prev.bestStreak, newPlayerStreak),
          }));

          // Trigger confetti based on player's streak
          triggerConfetti("correct");
          if (newPlayerStreak >= 3) {
            setTimeout(() => triggerConfetti("streak"), 500);
          }
        } else {
          // Solo mode - use global streak
          setStreak((s) => {
            const newStreak = s + 1;
            triggerConfetti("correct");
            if (newStreak >= 3) {
              setTimeout(() => triggerConfetti("streak"), 500);
            }
            return newStreak;
          });
        }

        setTimeout(() => setShowScoreAnimation(false), 1500);
      } else {
        // Wrong answer - reset streak
        gameState.setLastPlayedStreak(0);
        if (teamMode && currentPlayer) {
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === currentPlayer.id ? { ...p, streak: 0 } : p
            )
          );
        } else {
          setStreak(0);
        }
      }
    },
    [
      locked,
      streak,
      teamMode,
      currentPlayer,
      calculatePoints,
      setSelected,
      setLocked,
      setPhase,
      setEarnedPoints,
      setScore,
      setShowScoreAnimation,
      setStreak,
      setPlayers,
      setTeamStats,
      timerRef,
      timeLeftRef,
      gameState,
    ]
  );

  // Proceed to next phase after reveal
  useEffect(() => {
    if (phase !== "reveal") return;

    const transitionToNextPhase = () => {
      if (availableQuestions.length <= 1) {
        setPhase("finished");
      } else {
        setPhase("waiting");
      }
    };

    const updateQuestionLists = () => {
      if (round < availableQuestions.length) {
        const currentQ = availableQuestions[round];
        setUsedQuestions((prev) => [...prev, currentQ]);
        setAvailableQuestions((prev) =>
          prev.filter((_, index) => index !== round)
        );
      }
    };

    const timeout = setTimeout(() => {
      updateQuestionLists();
      transitionToNextPhase();
    }, REVEAL_DURATION);

    return () => clearTimeout(timeout);
  }, [
    phase,
    round,
    availableQuestions,
    setUsedQuestions,
    setAvailableQuestions,
    setPhase,
  ]);

  const enhancedGameState: GameState & {
    handleSelect: (index: number) => void;
  } = {
    ...gameState,
    handleSelect,
    // Removed updateTeamStreak from enhancedGameState
  };

  // ============= MAIN RENDER =============
  return (
    <div className="min-h-screen relative text-white font-sans flex flex-col items-center justify-center p-4 overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <GameScreen gameState={enhancedGameState} />
      </div>
    </div>
  );
}
