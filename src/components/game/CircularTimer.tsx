import { motion } from "framer-motion";
import { timerVariants } from "../../constants/animations";

interface CircularTimerProps {
  secondsLeft: number;
  total: number;
}

export const CircularTimer = ({ secondsLeft, total }: CircularTimerProps) => {
  const radius = 25;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = circumference - (secondsLeft / total) * circumference;

  const getTimerColor = () => {
    if (secondsLeft > total * 0.6) return "green";
    if (secondsLeft > total * 0.3) return "amber";
    return "red";
  };

  return (
    <motion.div
      className="relative"
      animate={secondsLeft <= 5 ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5, repeat: secondsLeft <= 5 ? Infinity : 0 }}
    >
      <svg
        height={radius * 2}
        width={radius * 2}
        className="mx-auto transform -rotate-90"
      >
        <circle
          stroke="rgba(255, 255, 255, 0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="#10b981"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          variants={timerVariants}
          animate={getTimerColor()}
          transition={{ duration: 0.5 }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className={`font-bold text-base ${
            secondsLeft <= 5 ? "text-red-400" : "text-white"
          }`}
          animate={secondsLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
          transition={{
            duration: 0.5,
            repeat: secondsLeft <= 5 ? Infinity : 0,
          }}
        >
          {secondsLeft}
        </motion.span>
      </div>
    </motion.div>
  );
};
