import { motion } from "framer-motion";

interface ChoiceButtonProps {
  option: string;
  index: number;
  locked: boolean;
  selected: number | null;
  answerIndex: number;
  handleSelect?: (index: number) => void;
}

export const ChoiceButton = ({
  option,
  index,
  locked,
  selected,
  answerIndex,
  handleSelect,
}: ChoiceButtonProps) => {
  const isCorrect = index === answerIndex;
  const isSelected = index === selected;
  const isWrong = isSelected && !isCorrect;

  return (
    <motion.button
      disabled={locked}
      onClick={() => handleSelect?.(index)}
      whileHover={locked ? {} : { scale: 1.02, y: -2, rotateY: 2 }}
      whileTap={locked ? {} : { scale: 0.98 }}
      initial={{ opacity: 0, y: 20, rotateX: -15 }}
      animate={
        locked
          ? isCorrect
            ? {
                scale: [1, 1.05, 1],
                opacity: 1,
                y: 0,
                rotateX: 0,
                boxShadow: "0 0 30px rgba(34, 197, 94, 0.5)",
              }
            : isWrong
            ? {
                x: [0, -5, 5, -5, 5, 0],
                opacity: 1,
                y: 0,
                rotateX: 0,
                boxShadow: "0 0 30px rgba(239, 68, 68, 0.5)",
              }
            : { opacity: 0.3, scale: 0.95, y: 0, rotateX: 0 }
          : { opacity: 1, y: 0, rotateX: 0 }
      }
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
        boxShadow: { duration: 0.3 },
      }}
      className={`relative rounded-2xl border-2 transition-all duration-300 px-6 py-4 text-center font-semibold cursor-pointer disabled:cursor-not-allowed shadow-lg w-full glass card-hover
                    ${
                      locked && isCorrect
                        ? "border-green-500 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 pulse-glow"
                        : locked && isWrong
                        ? "border-red-500 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400"
                        : "border-purple-400/50 hover:bg-white/10 text-white hover:border-purple-400 neon-border"
                    }`}
    >
      <span className="relative z-10 text-sm sm:text-base font-medium">
        {option}
      </span>

      {/* Shimmer effect for unselected buttons */}
      {!locked && (
        <div className="absolute inset-0 rounded-2xl shimmer opacity-20"></div>
      )}

      {/* Success icon with enhanced animation */}
      {locked && isCorrect && (
        <motion.span
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 500,
            damping: 15,
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl"
        >
          ✅
        </motion.span>
      )}

      {/* Error icon with enhanced animation */}
      {locked && isWrong && (
        <motion.span
          initial={{ scale: 0, opacity: 0, rotate: 180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 500,
            damping: 15,
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl"
        >
          ❌
        </motion.span>
      )}

      {/* Glow effect for correct answer */}
      {locked && isCorrect && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 blur-sm"></div>
      )}
    </motion.button>
  );
};
