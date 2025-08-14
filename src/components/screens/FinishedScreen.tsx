import { motion } from "framer-motion";
import { Share2, Trophy, X } from "lucide-react";
import { useEffect } from "react";
import { questions } from "../../data";
import type { Player, TeamStats } from "../../types/game";
import {
  getPerformanceData,
  shareResults,
  triggerConfetti,
} from "../../utils/game";

interface FinishedScreenProps {
  score: number;
  teamMode: boolean;
  players: Player[];
  teamStats: TeamStats;
  resetGame: () => void;
}

export const FinishedScreen = ({
  score,
  teamMode,
  players,
  teamStats,
  resetGame,
}: FinishedScreenProps) => {
  const maxScore = questions.length * 100;
  const percentage = Math.round((score / maxScore) * 100);
  const performance = getPerformanceData(percentage);

  // Trigger celebration confetti when screen loads
  useEffect(() => {
    triggerConfetti("finish");
  }, []);

  return (
    <motion.div
      className="mx-auto w-full max-w-3xl flex flex-col items-center justify-center p-8 text-center gap-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 shadow-2xl relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top-right cancel button for consistency */}
      <motion.div
        className="absolute top-4 right-4"
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
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-7xl mb-4"
      >
        {performance.emoji}
      </motion.div>

      <motion.h2
        className={`text-4xl font-bold mb-4 gradient-text leading-tight`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Adventure Complete!
      </motion.h2>

      <p className="text-xl text-gray-300 mb-6">{performance.message}</p>

      {!teamMode && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-white/20">
          <motion.div
            className="text-6xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
          >
            {score}
          </motion.div>
          <div className="text-gray-400 mb-2">out of {maxScore} points</div>
          <div
            className={`text-2xl font-bold bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}
          >
            {percentage}% Accuracy
          </div>
        </div>
      )}

      {teamMode && players.length > 0 && (
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-yellow-400">
              Team Leaderboard
            </h3>
          </div>

          <div className="space-y-3">
            {[...players]
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <motion.div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30"
                      : "bg-white/5"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0
                          ? "bg-yellow-400 text-black"
                          : index === 1
                          ? "bg-gray-300 text-black"
                          : index === 2
                          ? "bg-orange-400 text-black"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-2xl">{player.avatar}</span>
                    <div>
                      <div className="text-white font-medium">
                        {player.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {player.correctAnswers} correct • {player.streak} best
                        streak
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-400">
                      {player.score}
                    </div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                </motion.div>
              ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="text-center text-sm text-gray-300">
              Team Total:{" "}
              <span className="font-bold text-green-400">
                {teamStats.totalScore}
              </span>{" "}
              points
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-3 w-full max-w-md">
        <motion.button
          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => shareResults(score, percentage, teamMode, players)}
        >
          <span className="flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </span>
        </motion.button>

        <motion.button
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
        >
          Play Again
        </motion.button>
      </div>
    </motion.div>
  );
};
