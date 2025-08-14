import { motion } from "framer-motion";
import { Trophy, Users, X, Zap } from "lucide-react";
import { useState } from "react";
import { floatingAnimation } from "../../constants/animations";
import { MAX_TEAM_SIZE } from "../../constants/game";
import type { Phase, Player } from "../../types/game";
import { getRandomAvatar } from "../../utils/game";

interface TeamSetupScreenProps {
  players: Player[];
  setPlayers: (players: Player[] | ((prev: Player[]) => Player[])) => void;
  setTeamMode: (mode: boolean) => void;
  setCurrentPlayer: (player: Player) => void;
  collaborativeMode: boolean;
  setCollaborativeMode: (mode: boolean) => void;
  startRound: () => void;
  setPhase: (phase: Phase) => void;
  resetGame: () => void;
}

export const TeamSetupScreen = ({
  players,
  setPlayers,
  setTeamMode,
  setCurrentPlayer,
  collaborativeMode,
  setCollaborativeMode,
  startRound,
  setPhase,
  resetGame,
}: TeamSetupScreenProps) => {
  const [newPlayerName, setNewPlayerName] = useState("");

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < MAX_TEAM_SIZE) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        score: 0,
        correctAnswers: 0,
        streak: 0,
        avatar: getRandomAvatar(),
      };
      setPlayers((prev: Player[]) => [...prev, newPlayer]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (id: string) => {
    setPlayers((prev: Player[]) => prev.filter((p) => p.id !== id));
  };

  const startTeamGame = () => {
    if (players.length > 0) {
      setTeamMode(true);
      setCurrentPlayer(players[0]);
      startRound();
    }
  };

  return (
    <motion.div
      className="mx-auto w-full max-w-3xl flex flex-col items-center justify-center min-h-[600px] p-6 sm:p-8 text-center gap-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 shadow-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top bar with consistent cancel button */}
      <div className="w-full grid sm:grid-cols-[1fr_auto] items-start mb-6">
        <div />
        <motion.div
          className="sm:justify-self-end"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <button
            onClick={resetGame}
            className="w-10 h-10 border border-red-500/50 hover:border-red-400/70 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-all duration-300 hover:scale-105 glass"
          >
            <X color="#ef4444" className="w-6 h-6" />
          </button>
        </motion.div>
      </div>

      {/* Header Section */}
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          className="relative w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/30 shadow-lg"
          animate={floatingAnimation}
        >
          <Users className="w-10 h-10 text-emerald-400" />
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-tr from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-[0.75rem] font-bold text-black"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-4xl sm:text-5xl font-extrabold gradient-text mb-2 leading-tight"
        >
          Team Setup
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto max-w-md text-center text-base sm:text-lg text-gray-300 leading-relaxed"
        >
          Add team members to compete together!
        </motion.p>
      </motion.div>

      <div className="w-full grid gap-6 lg:grid-cols-2">
        {/* Game Mode Section */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-blue-400">Game Mode</h4>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex-1">
                <div className="text-white font-semibold text-lg mb-1">
                  {collaborativeMode
                    ? "Team Collaboration"
                    : "Individual Turns"}
                </div>
                <div className="text-sm text-gray-300 leading-relaxed">
                  {collaborativeMode
                    ? "Everyone works together on each question"
                    : "Players take turns answering questions"}
                </div>
              </div>

              <motion.button
                onClick={() => setCollaborativeMode(!collaborativeMode)}
                className={`relative h-8 w-16 rounded-full transition shadow ${
                  collaborativeMode
                    ? "bg-emerald-500/70 shadow-emerald-500/10"
                    : "bg-gray-600/70 shadow-gray-900/20"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow flex items-center justify-center"
                  animate={{ x: collaborativeMode ? 32 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {collaborativeMode ? (
                    <Users className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <span className="text-[0.75rem] font-bold text-gray-600">
                      1
                    </span>
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Add Team Members Section */}
        <motion.div
          className="w-full lg:flex lg:flex-col lg:h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-lg font-bold text-emerald-400 m-0">
                  Add Team
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 font-medium">
                  {players.length}/{MAX_TEAM_SIZE}
                </span>
                <div className="w-12 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(players.length / MAX_TEAM_SIZE) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                  placeholder="Enter player name..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200 font-medium"
                  maxLength={20}
                />
                {newPlayerName.length > 15 && (
                  <motion.div
                    className="absolute -bottom-6 left-0 text-xs text-yellow-400 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {20 - newPlayerName.length} characters left
                  </motion.div>
                )}
              </div>
              <motion.button
                onClick={addPlayer}
                disabled={
                  !newPlayerName.trim() || players.length >= MAX_TEAM_SIZE
                }
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg ${
                  !newPlayerName.trim() || players.length >= MAX_TEAM_SIZE
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-xl hover:from-green-500 hover:to-emerald-500"
                }`}
                whileHover={{
                  scale:
                    !newPlayerName.trim() || players.length >= MAX_TEAM_SIZE
                      ? 1
                      : 1.05,
                }}
                whileTap={{
                  scale:
                    !newPlayerName.trim() || players.length >= MAX_TEAM_SIZE
                      ? 1
                      : 0.95,
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">+</span>
                  <span>Add</span>
                </span>
              </motion.button>
            </div>

            {players.length >= MAX_TEAM_SIZE && (
              <motion.div
                className="text-sm text-yellow-400 mb-4 flex items-center gap-2 bg-yellow-400/10 rounded-lg p-3 border border-yellow-400/20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="text-lg">⚠️</span>
                <span className="font-medium">Maximum team size reached</span>
              </motion.div>
            )}
          </div>

          {/* Team Roster Section */}
          {players.length > 0 && (
            <motion.div
              className="w-full lg:flex-1 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full flex items-center justify-center border border-yellow-400/30">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400">
                    Team Roster
                  </h3>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm text-gray-400 font-medium">
                      {players.length}{" "}
                      {players.length === 1 ? "member" : "members"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {players.map((player, index) => (
                    <motion.div
                      key={player.id}
                      className="flex items-center justify-between bg-gradient-to-r from-white/15 to-white/5 rounded-xl p-4 border border-white/20 hover:border-white/30 hover:from-white/20 hover:to-white/10 transition-all duration-200 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border-2 border-purple-400/30 shadow-lg">
                            <span className="text-2xl">{player.avatar}</span>
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <div className="text-white font-semibold text-lg">
                            {player.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            Ready to play
                          </div>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => removePlayer(player.id)}
                        className="w-9 h-9 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-full flex items-center justify-center transition-all duration-200 opacity-70 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span className="text-lg font-bold">×</span>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/20 text-center">
                  <div className="text-sm text-gray-300 font-medium">
                    {players.length === 1
                      ? "1 player ready"
                      : `${players.length} players ready`}
                    {players.length < MAX_TEAM_SIZE && (
                      <span className="text-gray-400 ml-2">
                        • Add up to {MAX_TEAM_SIZE - players.length} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          className="flex-1 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur text-white px-6 py-4 rounded-xl font-semibold border-2 border-white/20 hover:border-white/30 hover:from-white/15 hover:to-white/10 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPhase("start")}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="text-lg">←</span>
            <span>Back</span>
          </span>
        </motion.button>

        <motion.button
          onClick={startTeamGame}
          disabled={players.length === 0}
          className={`flex-[2] px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
            players.length === 0
              ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:-translate-y-0.5 hover:shadow-xl hover:from-emerald-500 hover:to-teal-500"
          }`}
          whileHover={{
            scale: players.length === 0 ? 1 : 1.02,
            y: players.length === 0 ? 0 : -2,
          }}
          whileTap={{ scale: players.length === 0 ? 1 : 0.98 }}
        >
          <span className="flex items-center justify-center gap-3">
            <span className="text-xl">🚀</span>
            <span>
              {players.length === 0
                ? "Add Players First"
                : `Start with ${players.length} Player${
                    players.length === 1 ? "" : "s"
                  }`}
            </span>
          </span>
        </motion.button>
      </motion.div>

      {/* Help Text */}
      {players.length === 0 && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 max-w-md mx-auto">
            <div className="flex justify-center items-center gap-2 mb-2">
              <span className="text-blue-400 text-lg">💡</span>
              <span className="text-blue-400 font-semibold">
                Getting Started
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Add at least one team member to start your Lagos adventure
              together!
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
