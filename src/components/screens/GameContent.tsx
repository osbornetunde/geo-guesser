import { AnimatePresence, motion } from "framer-motion";
import { Users, X } from "lucide-react";
import { useMemo } from "react";
import { cardVariants } from "../../constants/animations";
import { TIMER_DURATION } from "../../constants/game";
import type { GameState } from "../../hooks/useGameState";
import type { Player } from "../../types/game";
import { ChoiceButton } from "../game/ChoiceButton";
import { CircularTimer } from "../game/CircularTimer";
import { ProgressBar } from "../game/ProgressBar";
import { ScoreAnimation } from "../game/ScoreAnimation";

interface GameContentProps {
  gameState: GameState & { handleSelect: (index: number) => void };
}

const getRevealIcon = (selected: number | null, answerIndex: number) => {
  if (selected === answerIndex) return "🎉";
  if (selected === null) return "⏰";
  return "💡";
};

const getRevealMessage = (
  selected: number | null,
  answerIndex: number,
  earnedPoints: number
) => {
  if (selected === answerIndex) return `Brilliant! +${earnedPoints} points!`;
  if (selected === null) return "Time's up! Let's learn together!";
  return "Not quite, but here's the answer!";
};

export const GameContent = ({ gameState }: GameContentProps) => {


  const QuizImage = useMemo(() => {
    if (!gameState?.currentQuestion) return null;

    let difficultyBadgeClass: string | undefined;
    if (gameState.currentQuestion.difficulty === "easy") {
      difficultyBadgeClass = "bg-emerald-600/80";
    } else if (gameState.currentQuestion.difficulty === "medium") {
      difficultyBadgeClass = "bg-amber-600/80";
    } else if (gameState.currentQuestion.difficulty === "hard") {
      difficultyBadgeClass = "bg-rose-600/80";
    }

    return (
      <div style={{ height: "400px", marginBottom: "24px" }}>
        <motion.div
          key={`${gameState.currentQuestion.id}-${gameState.round}`}
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
          {gameState.imageLoading && (
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
            src={gameState.currentQuestion.image}
            alt={`Quiz question ${gameState.round + 1}`}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              opacity: gameState.imageLoaded ? 1 : 0,
              transform: gameState.imageLoaded ? "scale(1)" : "scale(1.1)",
              transition: "all 0.5s ease",
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            onLoad={() => {
              gameState.setImageLoaded?.(true);
              gameState.setImageLoading?.(false);
            }}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.dataset?.fallback === "true") {
                gameState.setImageLoading?.(false);
                return;
              }
              img.dataset.fallback = "true";
              img.src = "/vite.svg";
              gameState.setImageLoading?.(false);
            }}
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
              📸 {gameState.currentQuestion.credit}
            </p>
          </div>

          {/* Category / country badge */}
          {(gameState.currentQuestion.category ||
            gameState.currentQuestion.country) && (
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {gameState.currentQuestion.category && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-700/60 text-white backdrop-blur-sm">
                  {gameState.currentQuestion.category}
                </span>
              )}
              {gameState.currentQuestion.country && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-black/60 text-gray-200">
                  {gameState.currentQuestion.country}
                </span>
              )}
              {gameState.currentQuestion.difficulty && (
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${difficultyBadgeClass}`}
                >
                  {gameState.currentQuestion.difficulty}
                </span>
              )}
            </div>
          )}

          {gameState.imageLoading && (
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
  }, [
    gameState?.currentQuestion,
    gameState?.round,
    gameState?.imageLoaded,
    gameState?.imageLoading,
    gameState?.setImageLoaded,
    gameState?.setImageLoading,
  ]);

  const ChoiceButtons = useMemo(() => {
    return (
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, staggerChildren: 0.1 }}
      >
        {gameState.currentQuestion?.options.map((option, idx) => (
          <ChoiceButton
            key={option}
            index={idx}
            option={option}
            locked={gameState.locked}
            selected={gameState.selected}
            answerIndex={gameState.currentQuestion.answerIndex}
            handleSelect={gameState.handleSelect}
          />
        ))}
      </motion.div>
    );
  }, [
    gameState?.currentQuestion,
    gameState?.locked,
    gameState?.selected,
    gameState?.handleSelect,
  ]);

  return (
    <>
      <div className="mb-6">
        <div className="grid gap-4 mb-6 sm:grid-cols-[1fr_auto] items-start">
          {/* Row 1, Col 1: Title and question */}
          <div className="flex flex-col">
            <motion.h1
              className="font-black text-2xl sm:text-3xl gradient-text m-0 leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Geo-Guess
            </motion.h1>
            <p className="text-gray-400 text-sm mt-2">
              Question {(gameState?.questionsAnswered ?? 0) + 1} of{" "}
              {gameState?.totalQuestions}
            </p>
          </div>

          {/* Row 1, Col 2: Timer */}
          <motion.div
            className="flex items-center gap-4 sm:justify-self-end self-start"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {((gameState?.teamMode &&
              gameState?.currentPlayer &&
              gameState?.currentPlayer.streak > 0) ||
              (!gameState?.teamMode && (gameState?.streak ?? 0) > 0)) && (
              <motion.div
                className="text-yellow-400 text-sm font-bold pulse-glow"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                🔥{" "}
                {gameState?.teamMode && gameState?.currentPlayer
                  ? gameState?.currentPlayer.streak
                  : gameState?.streak}
              </motion.div>
            )}
            <CircularTimer
              secondsLeft={gameState.timeLeft}
              total={TIMER_DURATION}
            />
          </motion.div>

          {/* Row 2, Col 1: Team info (only in team mode) */}
          {gameState?.teamMode && (
            <motion.div
              className="mt-4 max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {gameState?.collaborativeMode ? (
                <div className="bg-white/10 rounded-lg p-3 border border-green-400/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium text-sm">
                      Team Collaboration
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {gameState?.players
                      ?.slice(0, 4)
                      .map((player: Player, index) => (
                        <motion.div
                          key={player.id}
                          className="flex items-center gap-1 bg-white/10 rounded px-2 py-1"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.6 + index * 0.1,
                            duration: 0.3,
                          }}
                        >
                          <span className="text-xs">{player.avatar}</span>
                          <span className="text-xs text-gray-300">
                            {player.name}
                          </span>
                        </motion.div>
                      ))}
                    {gameState?.players && gameState?.players?.length > 4 && (
                      <div className="text-xs text-gray-400 px-2 py-1">
                        +{gameState?.players.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                gameState?.currentPlayer && (
                  <motion.div
                    className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <span className="text-lg">
                      {gameState?.currentPlayer.avatar}
                    </span>
                    <span className="text-green-400 font-medium">
                      {gameState?.currentPlayer.name}
                    </span>
                    <span className="text-gray-400 text-sm">
                      • {gameState?.currentPlayer.score} pts
                    </span>
                  </motion.div>
                )
              )}
            </motion.div>
          )}

          {/* Row 2, Col 2: Cancel button */}
          <motion.div
            className="sm:col-start-2 sm:row-start-2 sm:justify-self-end self-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <button
              onClick={gameState?.resetGame}
              aria-label="Reset Game"
              className="w-10 h-10 border border-red-500/50 hover:border-red-400/70 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-all duration-300 hover:scale-105"
            >
              <X color="#ef4444" className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
        <ProgressBar
          current={
            (gameState?.totalQuestions ?? 0) -
            (gameState?.questionsAnswered ?? 0)
          }
          total={gameState?.totalQuestions ?? 0}
        />
      </div>

      <div className="my-6">
        <AnimatePresence mode="wait">{QuizImage}</AnimatePresence>
      </div>

      {ChoiceButtons}

      {gameState.showScoreAnimation && (
        <ScoreAnimation points={gameState.earnedPoints} />
      )}

      {gameState?.phase === "reveal" && gameState?.currentQuestion && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-6 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl border border-purple-400/30"
        >
          <div className="flex items-start justify-center gap-4">
            <span className="text-3xl flex-shrink-0">
              {getRevealIcon(gameState.selected, gameState.currentQuestion.answerIndex)}
            </span>
            <div>
              <p className="font-bold text-lg mb-2">
                {getRevealMessage(
                  gameState.selected,
                  gameState.currentQuestion.answerIndex,
                  gameState.earnedPoints
                )}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {gameState?.selected !==
                  gameState?.currentQuestion.answerIndex && (
                  <span className="block font-semibold text-purple-400 mb-2">
                    Answer:{" "}
                    {
                      gameState?.currentQuestion.options[
                        gameState?.currentQuestion.answerIndex
                      ]
                    }
                  </span>
                )}
                {gameState?.currentQuestion.explain}
              </p>
              {gameState?.currentQuestion.hint && (
                <p className="text-gray-400 text-sm mt-3 italic border-l-2 border-purple-400/50 pl-3">
                  💡 Fun fact: {gameState?.currentQuestion.hint}
                </p>
              )}
              {/* Map preview when coords are available */}
              {gameState?.currentQuestion.coords && (
                <div className="mt-4">
                  <div className="text-sm text-gray-300 mb-2">
                    📍 Location preview
                  </div>
                  <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-700 relative bg-black">
                    {/* Compute OSM tile coordinates and pixel offsets for a marker */}
                    {(() => {
                      const z = 15;
                      const lat = gameState?.currentQuestion.coords.lat;
                      const lon = gameState?.currentQuestion.coords.lng;
                      const latRad = (lat * Math.PI) / 180;
                      const n = Math.pow(2, z);
                      const xtile = ((lon + 180) / 360) * n;
                      const ytile =
                        ((1 -
                          Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) /
                            Math.PI) /
                          2) *
                        n;
                      const tileX = Math.floor(xtile);
                      const tileY = Math.floor(ytile);
                      const pixelX = Math.floor((xtile - tileX) * 256);
                      const pixelY = Math.floor((ytile - tileY) * 256);
                      const tileUrl = `https://a.tile.openstreetmap.org/${z}/${tileX}/${tileY}.png`;
                      const leftPct = (pixelX / 256) * 100;
                      const topPct = (pixelY / 256) * 100;

                      return (
                        <>
                          <img
                            src={tileUrl}
                            alt="map preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                          {/* marker */}
                          <div
                            aria-hidden
                            style={{
                              position: "absolute",
                              left: `${leftPct}%`,
                              top: `${topPct}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <div className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-white shadow-md" />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};
