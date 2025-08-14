import { AnimatePresence, motion } from "framer-motion";
import type { GameState } from "../../hooks/useGameState";
import { FinishedScreen } from "./FinishedScreen";
import { GameContent } from "./GameContent";
import { StartScreen } from "./StartScreen";
import { TeamSetupScreen } from "./TeamSetupScreen";
import { WaitingScreen } from "./WaitingScreen";

interface GameScreenProps {
  gameState: GameState & { handleSelect: (index: number) => void };
}

export const GameScreen = ({ gameState }: GameScreenProps) => {
  const {
    phase,
    score,
    availableQuestions,
    players,
    currentPlayer,
    teamMode,
    collaborativeMode,
    teamStats,
    streak,
    setPhase,
    setPlayers,
    setTeamMode,
    setCurrentPlayer,
    setCollaborativeMode,
    startRound,
    resetGame,
  } = gameState;

  const renderScreen = () => {
    switch (phase) {
      case "start":
        return (
          <motion.div
            key="start"
            className="glass-intense rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 card-hover pulse-glow"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <StartScreen setPhase={setPhase} />
          </motion.div>
        );
      case "setup":
        return (
          <motion.div
            key="setup"
            className="glass-intense rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 card-hover"
            initial={{ opacity: 0, scale: 0.9, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <TeamSetupScreen
              players={players}
              setPlayers={setPlayers}
              setTeamMode={setTeamMode}
              setCurrentPlayer={setCurrentPlayer}
              collaborativeMode={collaborativeMode}
              setCollaborativeMode={setCollaborativeMode}
              startRound={startRound}
              setPhase={setPhase}
              resetGame={resetGame}
            />
          </motion.div>
        );
      case "waiting":
        return (
          <motion.div
            key="waiting"
            className="glass-intense rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 card-hover shimmer"
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <WaitingScreen
              teamMode={teamMode}
              players={players}
              currentPlayer={currentPlayer}
              collaborativeMode={collaborativeMode}
              score={score}
              teamStats={teamStats}
              availableQuestions={availableQuestions}
              streak={streak}
              startRound={startRound}
              resetGame={resetGame}
              earnedPoints={gameState.earnedPoints}
              lastPlayedStreak={gameState.lastPlayedStreak}
            />
          </motion.div>
        );
      case "finished":
        return (
          <motion.div
            key="finished"
            className="glass-intense rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 card-hover pulse-glow"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <FinishedScreen
              score={teamMode ? teamStats.totalScore : score}
              teamMode={teamMode}
              players={players}
              teamStats={teamStats}
              resetGame={resetGame}
            />
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="game"
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <GameContent gameState={gameState} />
          </motion.div>
        );
    }
  };

  return (
    <div className="max-w-5xl w-full">
      <AnimatePresence mode="wait">{renderScreen()}</AnimatePresence>
    </div>
  );
};
