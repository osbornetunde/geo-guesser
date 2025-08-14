import { motion } from "framer-motion";
import { Gamepad2, Play, Users } from "lucide-react";
import type { Phase } from "../../types/game";

interface StartScreenProps {
  setPhase: (phase: Phase) => void;
}

export const StartScreen = ({ setPhase }: StartScreenProps) => {
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
        Geo-Guess Lagos
      </motion.h1>
      <motion.p
        className="text-lg text-gray-300 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Test your knowledge of Lagos landmarks in this exciting geo-quiz game!
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 w-full max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.button
          className="flex-1 btn-primary text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg glass border border-blue-400/30 cursor-pointer"
          whileHover={{ scale: 1.05, rotateY: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPhase("question")}
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
          onClick={() => setPhase("setup")}
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
        onClick={() => setPhase("question")}
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
