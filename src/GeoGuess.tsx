import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { questions } from "./data.ts";

// ============= CONSTANTS =============
const TIMER_DURATION = 15;
const REVEAL_DURATION = 3500; // Increased from 2500 for better readability

// ============= ANIMATION VARIANTS =============
const cardVariants = {
  enter: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    rotateX: -15,
  },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.95,
    rotateX: 15,
    transition: {
      duration: 0.4,
      ease: [0.55, 0.06, 0.68, 0.19],
    },
  },
};

const timerVariants = {
  green: { stroke: "#10b981" },
  amber: { stroke: "#f59e0b" },
  red: { stroke: "#ef4444" },
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// ============= TYPES =============
type Phase = "start" | "question" | "reveal" | "finished" | "waiting";

interface PerformanceData {
  emoji: string;
  message: string;
  color: string;
}

// ============= UTILITY FUNCTIONS =============
const getPerformanceData = (percentage: number): PerformanceData => {
  if (percentage >= 90)
    return {
      emoji: "🏆",
      message: "Outstanding! You're a Lagos expert!",
      color: "from-yellow-400 to-yellow-600",
    };
  if (percentage >= 75)
    return {
      emoji: "🌟",
      message: "Excellent knowledge of Lagos!",
      color: "from-blue-400 to-purple-600",
    };
  if (percentage >= 60)
    return {
      emoji: "👏",
      message: "Well done! Good performance!",
      color: "from-green-400 to-emerald-600",
    };
  if (percentage >= 40)
    return {
      emoji: "👍",
      message: "Good effort! Keep learning!",
      color: "from-orange-400 to-red-600",
    };
  return {
    emoji: "📚",
    message: "Keep exploring Lagos!",
    color: "from-purple-400 to-pink-600",
  };
};

// ============= SUB-COMPONENTS =============

// Progress Bar Component
const ProgressBar = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  const percentage = ((total - current) / total) * 100;

  return (
    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden mb-4">
      <motion.div
        className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

// Score Animation Component
const ScoreAnimation = ({ points }: { points: number }) => {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      initial={{ opacity: 1, scale: 0, y: 0 }}
      animate={{ opacity: 0, scale: 2, y: -50 }}
      transition={{ duration: 1.5 }}
    >
      <span className="text-4xl font-bold text-green-400">+{points}</span>
    </motion.div>
  );
};

// Circular Timer Component
const CircularTimer = ({
  secondsLeft,
  total,
}: {
  secondsLeft: number;
  total: number;
}) => {
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
          style={{
            filter:
              secondsLeft <= 5 ? "drop-shadow(0 0 10px currentColor)" : "none",
          }}
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

const ChoiceButton = ({
  option,
  index,
  locked,
  selected,
  answerIndex,
  handleSelect,
}: {
  option: string;
  index: number;
  locked: boolean;
  selected: number | null;
  answerIndex: number;
  handleSelect: (index: number) => void;
}) => {
  const isCorrect = index === answerIndex;
  const isSelected = index === selected;
  const isWrong = isSelected && !isCorrect;

  return (
    <motion.button
      disabled={locked}
      onClick={() => handleSelect(index)}
      whileHover={locked ? {} : { scale: 1.02, y: -2 }}
      whileTap={locked ? {} : { scale: 0.98 }}
      animate={
        locked
          ? isCorrect
            ? { scale: [1, 1.05, 1] }
            : isWrong
            ? { x: [0, -5, 5, -5, 5, 0] }
            : { opacity: 0.3, scale: 0.95 }
          : {}
      }
      className={`relative rounded-2xl border-2 transition-all duration-300 px-6 py-4 text-center font-semibold cursor-pointer disabled:cursor-not-allowed shadow-lg w-full
                    ${
                      locked && isCorrect
                        ? "border-green-500 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400"
                        : locked && isWrong
                        ? "border-red-500 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400"
                        : "border-purple-400/50 bg-white/5 hover:bg-white/10 text-white hover:border-purple-400"
                    }`}
      style={{
        backdropFilter: "blur(10px)",
      }}
    >
      <span className="relative z-10 text-sm sm:text-base">{option}</span>
      {locked && isCorrect && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl"
        >
          ✅
        </motion.span>
      )}
      {locked && isWrong && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl"
        >
          ❌
        </motion.span>
      )}
    </motion.button>
  );
};

// ============= MAIN COMPONENT =============
export default function GeoGuessMiniApp() {
  // State Management
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("start");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [locked, setLocked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [availableQuestions, setAvailableQuestions] = useState(questions);
  const [usedQuestions, setUsedQuestions] = useState<typeof questions>([]);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  const timerRef = useRef<number | null>(null);
  const timeLeftRef = useRef(timeLeft);
  const currentQuestion = availableQuestions[round];

  // Reset image loading state when round changes
  useEffect(() => {
    setImageLoaded(false);
    setImageLoading(true);
  }, [round]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

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
          setStreak(0); // Reset streak on timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [round, phase]);

  // Handle answer selection
  const handleSelect = useCallback(
    (index: number) => {
      if (locked) return;
      setSelected(index);
      setLocked(true);
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("reveal");

      if (index === currentQuestion.answerIndex) {
        const basePoints = Math.floor(
          (timeLeftRef.current / TIMER_DURATION) * 100
        );
        const streakBonus = streak * 10;
        const earned = basePoints + streakBonus;
        setEarnedPoints(earned);
        setScore((s) => s + earned);
        setShowScoreAnimation(true);
        setStreak((s) => s + 1);
        setTimeout(() => setShowScoreAnimation(false), 1500);
      } else {
        setStreak(0);
      }
    },
    [locked, currentQuestion, streak]
  );

  // Proceed to next phase after reveal
  useEffect(() => {
    if (phase !== "reveal") return;
    const timeout = setTimeout(() => {
      const currentQ = availableQuestions[round];
      setUsedQuestions((prev) => [...prev, currentQ]);
      setAvailableQuestions((prev) =>
        prev.filter((_, index) => index !== round)
      );

      if (availableQuestions.length <= 1) {
        setPhase("finished");
      } else {
        setPhase("waiting");
      }
    }, REVEAL_DURATION);
    return () => clearTimeout(timeout);
  }, [phase, round, availableQuestions]);

  // Game control functions
  const startRound = () => {
    if (availableQuestions.length === 0) {
      setPhase("finished");
      return;
    }
    setPhase("question");
    setRound(Math.floor(Math.random() * availableQuestions.length));
    setImageLoaded(false);
    setImageLoading(true);
    setSelected(null);
  };

  const resetGame = () => {
    setRound(0);
    setScore(0);
    setPhase("start");
    setAvailableQuestions(questions);
    setUsedQuestions([]);
    setImageLoaded(false);
    setImageLoading(true);
    setSelected(null);
    setLocked(false);
    setStreak(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ============= SCREEN COMPONENTS =============

  const StartScreen = () => (
    <motion.div
      className="flex flex-col items-center justify-center p-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div animate={floatingAnimation} className="text-7xl mb-6">
        🌍
      </motion.div>

      <motion.h1
        className="text-5xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Geo-Guess Lagos
      </motion.h1>

      <motion.p
        className="text-xl text-gray-300 mb-8 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Explore Nigeria's vibrant megacity through stunning landmarks and iconic
        locations!
      </motion.p>

      {usedQuestions.length > 0 && (
        <motion.div
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-purple-400/30 w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-around text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400">
                {availableQuestions.length}
              </div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
            <div className="border-l border-purple-400/30"></div>
            <div>
              <div className="text-3xl font-bold text-pink-400">{score}</div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        className="flex flex-col gap-3 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startRound}
        >
          <span className="flex items-center justify-center gap-2">
            <span>🚀</span>
            <span>Start Adventure</span>
          </span>
        </motion.button>

        {usedQuestions.length > 0 && (
          <motion.button
            className="bg-white/10 backdrop-blur text-white px-6 py-3 rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetGame}
          >
            Reset Progress
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );

  const WaitingScreen = () => (
    <motion.div
      className="flex flex-col items-center justify-center p-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-6xl mb-6"
      >
        ✨
      </motion.div>

      <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
        Nice Work!
      </h2>

      {streak > 1 && (
        <motion.div
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl px-4 py-2 mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <span className="text-yellow-400 font-bold">
            🔥 {streak} Answer Streak!
          </span>
        </motion.div>
      )}

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
        <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">
          {score}
        </div>
        <div className="text-gray-400 mb-4">Total Points</div>
        <div className="text-sm text-gray-300">
          {availableQuestions.length} questions remaining
        </div>
      </div>

      <motion.button
        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startRound}
      >
        Continue Journey →
      </motion.button>
    </motion.div>
  );

  const FinishedScreen = () => {
    const maxScore = questions.length * 100;
    const percentage = Math.round((score / maxScore) * 100);
    const performance = getPerformanceData(percentage);

    return (
      <motion.div
        className="flex flex-col items-center justify-center p-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-7xl mb-4"
        >
          {performance.emoji}
        </motion.div>

        <h2
          className={`text-4xl font-bold mb-4 bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}
        >
          Adventure Complete!
        </h2>

        <p className="text-xl text-gray-300 mb-6">{performance.message}</p>

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

        <motion.button
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
        >
          Play Again
        </motion.button>
      </motion.div>
    );
  };

  const QuizImage = useMemo(() => {
    if (!currentQuestion) return null;

    return (
      <div style={{ height: "400px", marginBottom: "24px" }}>
        <motion.div
          key={`${currentQuestion.id}-${round}`}
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900"
          style={{
            height: "400px",
            width: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {imageLoading && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 animate-pulse"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                height: "400px",
              }}
            />
          )}

          <img
            src={currentQuestion.image}
            alt={`Quiz question ${round + 1}`}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              opacity: imageLoaded ? 1 : 0,
              transform: imageLoaded ? "scale(1)" : "scale(1.1)",
              transition: "all 0.5s ease",
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            onLoad={() => {
              setImageLoaded(true);
              setImageLoading(false);
            }}
            onError={() => setImageLoading(false)}
          />

          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "4px",
            }}
          >
            <p className="text-white/80 text-xs font-medium">
              📸 {currentQuestion.credit}
            </p>
          </div>

          {imageLoading && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </motion.div>
      </div>
    );
  }, [currentQuestion, round, imageLoaded, imageLoading]);

  const ChoiceButtons = useMemo(() => {
    return (
      <motion.div
        style={{
          display: "grid",
          gridTemplateColumns:
            window.innerWidth < 640 ? "1fr" : "repeat(2, 1fr)",
          gap: "12px",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {currentQuestion?.options.map((option, idx) => (
          <ChoiceButton
            key={option}
            index={idx}
            option={option}
            locked={locked}
            selected={selected}
            answerIndex={currentQuestion.answerIndex}
            handleSelect={handleSelect}
          />
        ))}
      </motion.div>
    );
  }, [currentQuestion, locked, selected, handleSelect]);

  // ============= MAIN RENDER =============
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {phase === "start" ? (
            <motion.div
              key="start"
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10"
            >
              <StartScreen />
            </motion.div>
          ) : phase === "waiting" ? (
            <motion.div
              key="waiting"
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10"
            >
              <WaitingScreen />
            </motion.div>
          ) : phase === "finished" ? (
            <motion.div
              key="finished"
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10"
            >
              <FinishedScreen />
            </motion.div>
          ) : (
            <motion.div
              key="game"
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10"
            >
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="font-black text-2xl sm:text-3xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Geo-Guess Lagos
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                      Question{" "}
                      {questions.length - availableQuestions.length + 1} of{" "}
                      {questions.length}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    {streak > 0 && (
                      <div className="text-yellow-400 text-sm font-bold mb-2">
                        🔥 {streak}
                      </div>
                    )}
                    <CircularTimer
                      secondsLeft={timeLeft}
                      total={TIMER_DURATION}
                    />
                  </div>
                </div>
                <ProgressBar
                  current={availableQuestions.length}
                  total={questions.length}
                />
              </div>

              <AnimatePresence mode="wait">{QuizImage}</AnimatePresence>

              {ChoiceButtons}

              {showScoreAnimation && <ScoreAnimation points={earnedPoints} />}

              {phase === "reveal" && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mt-6 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl border border-purple-400/30"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">
                      {selected === currentQuestion.answerIndex
                        ? "🎉"
                        : selected === null
                        ? "⏰"
                        : "💡"}
                    </span>
                    <div>
                      <p className="font-bold text-lg mb-2">
                        {selected === currentQuestion.answerIndex
                          ? `Brilliant! +${earnedPoints} points!`
                          : selected === null
                          ? "Time's up! Let's learn together!"
                          : "Not quite, but here's the answer!"}
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        {selected !== currentQuestion.answerIndex && (
                          <span className="block font-semibold text-purple-400 mb-2">
                            Answer:{" "}
                            {
                              currentQuestion.options[
                                currentQuestion.answerIndex
                              ]
                            }
                          </span>
                        )}
                        {currentQuestion.explain}
                      </p>
                      {currentQuestion.hint && (
                        <p className="text-gray-400 text-sm mt-3 italic border-l-2 border-purple-400/50 pl-3">
                          💡 Fun fact: {currentQuestion.hint}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
