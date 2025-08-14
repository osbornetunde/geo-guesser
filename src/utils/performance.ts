import type { PerformanceData } from "../types";

export const getPerformanceData = (percentage: number): PerformanceData => {
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
