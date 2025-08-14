import { motion } from "framer-motion";

interface ScoreAnimationProps {
  points: number;
}

export const ScoreAnimation = ({ points }: ScoreAnimationProps) => {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
      initial={{ opacity: 1, scale: 0, y: 0, rotate: -10 }}
      animate={{
        opacity: [1, 1, 0],
        scale: [0, 1.2, 2],
        y: [0, -20, -80],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration: 1.8,
        ease: "easeOut",
        times: [0, 0.3, 1],
      }}
    >
      <div className="relative">
        <motion.div
          className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-2xl"
          animate={{
            filter: [
              "drop-shadow(0 0 20px rgba(16, 185, 129, 0.8))",
              "drop-shadow(0 0 40px rgba(16, 185, 129, 0.6))",
              "drop-shadow(0 0 20px rgba(16, 185, 129, 0.4))",
            ],
          }}
          transition={{ duration: 0.8, repeat: 1, repeatType: "reverse" }}
        >
          +{points}
        </motion.div>
        <motion.div
          className="absolute -top-2 -right-2 text-2xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute -bottom-2 -left-2 text-xl"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        >
          🎯
        </motion.div>
      </div>
    </motion.div>
  );
};