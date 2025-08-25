import { motion } from "framer-motion";
import { Gamepad2, Play, Users, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Phase, GameSettings, Difficulty } from "../../types/game";

interface StartScreenProps {
  setPhase: (phase: Phase) => void;
  initializeGame: (settings: GameSettings) => void;
}

export const StartScreen = ({ setPhase, initializeGame }: StartScreenProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [questionCount, setQuestionCount] = useState(10);

  const handleStartGame = (mode: "solo" | "team") => {
    const settings: GameSettings = {
      difficulty,
      questionCount
    };
    initializeGame(settings);
    
    if (mode === "team") {
      setPhase("setup");
    } else {
      setPhase("question");
    }
  };

  const difficultyOptions: { value: Difficulty; label: string; color: string }[] = [
    { value: "easy", label: "Easy", color: "text-green-400" },
    { value: "medium", label: "Medium", color: "text-yellow-400" },
    { value: "hard", label: "Hard", color: "text-red-400" },
    { value: "all", label: "All Levels", color: "text-blue-400" }
  ];

  const questionCountOptions = [5, 10, 12, 15, 20];

  return (
    <motion.div
      className="mx-auto w-full max-w-3xl flex flex-col items-center justify-center p-8 text-center gap-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-6xl mb-4 float"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
      >
        🌍
      </motion.div>
      <motion.h1
        className="text-5xl font-black gradient-text leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Geo-Guess
      </motion.h1>
      <motion.p
        className="text-lg text-gray-300 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Test your knowledge of landmarks in this exciting geo-quiz game!
      </motion.p>

      {/* Game Settings Section */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <motion.button
          className="w-full flex items-center justify-between px-4 py-3 mb-4 text-gray-300 hover:text-white transition-all duration-300 glass rounded-lg border border-gray-500/20 hover:border-gray-400/40 cursor-pointer"
          onClick={() => setShowSettings(!showSettings)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <span>Game Settings</span>
          </span>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} 
          />
        </motion.button>

        {showSettings && (
          <motion.div
            className="space-y-4 mb-6 p-4 glass rounded-lg border border-gray-500/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDifficulty(option.value)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      difficulty === option.value
                        ? `bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg`
                        : `glass border border-gray-500/20 hover:border-gray-400/40 ${option.color}`
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {questionCountOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      questionCount === count
                        ? `bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg`
                        : `glass border border-gray-500/20 hover:border-gray-400/40 text-gray-300`
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Settings Display */}
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <p className="text-sm text-gray-400">
                Current Settings: <span className="text-white font-medium">{questionCount} questions</span> • 
                <span className={`font-medium ml-1 ${difficultyOptions.find(o => o.value === difficulty)?.color}`}>
                  {difficultyOptions.find(o => o.value === difficulty)?.label}
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 w-full max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <motion.button
          className="flex-1 btn-primary text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg glass border border-blue-400/30 cursor-pointer"
          whileHover={{ scale: 1.05, rotateY: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleStartGame("solo")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Gamepad2 className="w-6 h-6" />
            <span>Solo Play</span>
          </span>
        </motion.button>
        <motion.button
          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg glass border border-emerald-400/30 hover:shadow-2xl transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05, rotateY: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleStartGame("team")}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Users className="w-6 h-6" />
            <span>Team Play</span>
          </span>
        </motion.button>
      </motion.div>

      <motion.button
        className="mt-4 text-gray-400 hover:text-white transition-all duration-300 glass rounded-lg px-4 py-2 border border-gray-500/20 hover:border-gray-400/40 cursor-pointer"
        onClick={() => handleStartGame("solo")}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.4 }}
      >
        <span className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          <span>Quick Start</span>
        </span>
      </motion.button>
    </motion.div>
  );
};
