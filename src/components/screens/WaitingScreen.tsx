import { motion } from "framer-motion";
import { Users, X } from "lucide-react";
import type { WaitingScreenProps } from "../../types/game";

export const WaitingScreen = ({
  teamMode,
  teamStats,
  score,
  availableQuestions,
  streak,
  players,
  currentPlayer,
  collaborativeMode,
  startRound,
  resetGame,
  earnedPoints,
  lastPlayedStreak,
}: WaitingScreenProps) => {
  const getNextPlayer = () => {
    if (!teamMode || players.length <= 1) return null;
    const currentIndex = players.findIndex((p) => p.id === currentPlayer?.id);
    const nextIndex = (currentIndex + 1) % players.length;
    return players[nextIndex];
  };

  const nextPlayer = getNextPlayer();

  return (
    <motion.div
      className="mx-auto w-full max-w-3xl flex flex-col items-center justify-center p-8 text-center gap-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 shadow-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with consistent layout */}
      <div className="w-full grid sm:grid-cols-[1fr_auto] items-start gap-4 mb-6">
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl float"
          >
            ✨
          </motion.div>
          <motion.h2
            className="text-4xl font-bold gradient-text m-0 leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {teamMode ? "Great Teamwork!" : "Nice Work!"}
          </motion.h2>
        </div>
        <motion.div
          className="sm:justify-self-end self-start"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <button
            onClick={resetGame}
            className="w-10 h-10 border border-red-500/50 hover:border-red-400/70 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-all duration-300 hover:scale-105 glass cursor-pointer"
          >
            <X color="#ef4444" className="w-6 h-6" />
          </button>
        </motion.div>
      </div>

      {((teamMode && lastPlayedStreak > 1) || (!teamMode && streak > 1)) && (
        <motion.div
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl px-4 py-2 mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <span className="text-yellow-400 font-bold">
            🔥 {teamMode ? lastPlayedStreak : streak} Answer Streak!
          </span>
        </motion.div>
      )}

      {/* Team Mode Display */}
      {teamMode && (
        <div className="w-full max-w-md mb-6 space-y-4">
          {/* Current Score Display */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            {(() => {
              let displayScore;
              let displayLabel;
              if (teamMode && !collaborativeMode && currentPlayer) {
                const safeScore =
                  typeof currentPlayer.score === "number"
                    ? currentPlayer.score
                    : 0;
                // Only add earnedPoints if the last answer actually earned positive points
                const showEarned = lastPlayedStreak > 0 && earnedPoints > 0;
                displayScore = showEarned
                  ? safeScore + earnedPoints
                  : safeScore;
                displayLabel = `${currentPlayer.name}'s Score`;
              } else if (teamMode) {
                displayScore = teamStats.totalScore;
                displayLabel = "Team Score";
              } else {
                displayScore = score;
                displayLabel = "Total Points";
              }
              return (
                <>
                  <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">
                    {displayScore}
                  </div>
                  <div className="text-gray-400 mb-2">{displayLabel}</div>
                </>
              );
            })()}
            <div className="text-sm text-gray-300">
              {availableQuestions.length} questions remaining
            </div>
          </div>

          {/* Next Player Display */}
          {!collaborativeMode && nextPlayer && (
            <motion.div
              className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">{nextPlayer.avatar}</span>
                <div>
                  <div className="text-blue-400 font-medium">Up Next:</div>
                  <div className="text-white font-bold">{nextPlayer.name}</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Collaborative Mode Display */}
          {collaborativeMode && (
            <motion.div
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">
                  Team Collaboration
                </span>
              </div>
              <div className="text-sm text-gray-300">
                Work together on the next question!
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Solo Mode Display */}
      {!teamMode && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
          <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">
            {score}
          </div>
          <div className="text-gray-400 mb-4">Total Points</div>
          <div className="text-sm text-gray-300">
            {availableQuestions.length} questions remaining
          </div>
        </div>
      )}

      <motion.button
        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startRound}
      >
        <span className="flex items-center gap-2">
          <span>{teamMode ? "🚀" : "→"}</span>
          <span>{teamMode ? "Continue Adventure" : "Continue Journey"}</span>
        </span>
      </motion.button>
    </motion.div>
  );
};
