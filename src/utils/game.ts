import confetti from "canvas-confetti";
import { AVATARS, CONFETTI_COLORS } from "../constants/game";
import { questions } from "../data";
import type { PerformanceData, Player } from "../types/game";

export const getPerformanceData = (percentage: number): PerformanceData => {
  if (percentage >= 90)
    return {
      emoji: "🏆",
      message: "Outstanding! You're a Landmark expert!",
      color: "from-yellow-400 to-yellow-600",
    };
  if (percentage >= 75)
    return {
      emoji: "🌟",
      message: "Excellent knowledge of Landmarks!",
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
    message: "Keep exploring Landmarks!",
    color: "from-purple-400 to-pink-600",
  };
};

export const triggerConfetti = (type: "correct" | "streak" | "finish") => {
  confetti({
    particleCount: type === "finish" ? 150 : 100,
    spread: type === "finish" ? 100 : 70,
    origin: { y: 0.6 },
    colors: CONFETTI_COLORS[type],
    gravity: 0.8,
    drift: 0.1,
    ticks: 300,
  });

  if (type === "finish") {
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: CONFETTI_COLORS[type],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: CONFETTI_COLORS[type],
      });
    }, 250);
  }
};

export const getRandomAvatar = () => {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
};

export const shareResults = (
  score: number,
  percentage: number,
  teamMode: boolean,
  players: Player[]
) => {
  const maxScore = questions.length * 100;
  let shareText = `🌍 Just completed Geo-Guess!\n\n`;

  if (teamMode && players.length > 0) {
    shareText += `🏆 Team Results:\n`;
    shareText += `Total Score: ${score}/${maxScore} (${percentage}%)\n\n`;
    shareText += `Team Members:\n`;
    players
      .sort((a, b) => b.score - a.score)
      .forEach((player, index) => {
        const medal =
          index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅";
        shareText += `${medal} ${player.name}: ${player.score} pts\n`;
      });
  } else {
    shareText += `🎯 Score: ${score}/${maxScore} points (${percentage}%)\n`;
  }

  shareText += `\nCan you beat our score? 🚀`;

  if (navigator.share) {
    navigator.share({
      title: "Geo-Guess Results",
      text: shareText,
      url: window.location.href,
    });
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      alert("Results copied to clipboard! 📋");
    });
  }
};
