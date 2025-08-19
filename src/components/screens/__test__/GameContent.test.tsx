import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { questions } from "../../../data";
import { GameContent } from "../GameContent";

const mockGameState = {
  // State properties
  round: 0,
  selected: null,
  score: 0,
  phase: "question" as const,
  timeLeft: 10,
  locked: false,
  imageLoaded: true,
  imageLoading: false,
  availableQuestions: questions,
  usedQuestions: [],
  showScoreAnimation: false,
  earnedPoints: 0,
  streak: 0,
  gameSettings: {
    difficulty: "all" as const,
    questionCount: 10
  },
  totalQuestions: 10,
  questionsAnswered: 0,
  lastPlayedStreak: 0,
  players: [],
  currentPlayer: null,
  teamMode: false,
  collaborativeMode: false,
  teamStats: {
    totalScore: 0,
    totalCorrect: 0,
    averageTime: 0,
    bestStreak: 0,
  },
  currentQuestion: questions[0],
  timerRef: { current: null },
  timeLeftRef: { current: 10 },
  
  // Action functions
  handleSelect: vi.fn(),
  setRound: vi.fn(),
  setSelected: vi.fn(),
  setScore: vi.fn(),
  setPhase: vi.fn(),
  setTimeLeft: vi.fn(),
  setLocked: vi.fn(),
  setImageLoaded: vi.fn(),
  setImageLoading: vi.fn(),
  setAvailableQuestions: vi.fn(),
  setUsedQuestions: vi.fn(),
  setShowScoreAnimation: vi.fn(),
  setEarnedPoints: vi.fn(),
  setStreak: vi.fn(),
  setPlayers: vi.fn(),
  setCurrentPlayer: vi.fn(),
  setTeamMode: vi.fn(),
  setCollaborativeMode: vi.fn(),
  setTeamStats: vi.fn(),
  setQuestionsAnswered: vi.fn(),
  setLastPlayedStreak: vi.fn(),
  calculatePoints: vi.fn(),
  resetGame: vi.fn(),
  startRound: vi.fn(),
  initializeGame: vi.fn(),
};

describe("GameContent", () => {
  it("renders the question and choices", () => {
    render(<GameContent gameState={mockGameState} />);
    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
    expect(screen.getByText(questions[0].options[0])).toBeInTheDocument();
    expect(screen.getByText(questions[0].options[1])).toBeInTheDocument();
  });

  it("calls handleSelect when a choice is clicked", () => {
    const handleSelect = vi.fn();
    render(<GameContent gameState={{ ...mockGameState, handleSelect }} />);
    const choiceButton = screen.getByText(questions[0].options[0]);
    fireEvent.click(choiceButton);
    expect(handleSelect).toHaveBeenCalledWith(0);
  });

  it("displays the reveal message when in reveal phase", () => {
    render(
      <GameContent
        gameState={{
          ...mockGameState,
          phase: "reveal",
          selected: 0,
          currentQuestion: { ...questions[0], answerIndex: 0 },
        }}
      />
    );
    expect(screen.getByText(/Brilliant!/i)).toBeInTheDocument();
  });

  it("shows score animation when showScoreAnimation is true", () => {
    render(
      <GameContent
        gameState={{
          ...mockGameState,
          showScoreAnimation: true,
          earnedPoints: 50,
        }}
      />
    );
    expect(screen.getByText("+50")).toBeInTheDocument();
  });

  it("displays the reveal message for an incorrect answer", () => {
    render(
      <GameContent
        gameState={{
          ...mockGameState,
          phase: "reveal",
          selected: 1, // Incorrect answer
          currentQuestion: { ...questions[0], answerIndex: 0 },
        }}
      />
    );
    expect(screen.getByText(/Not quite/i)).toBeInTheDocument();
  });

  it("displays the reveal message when time runs out", () => {
    render(
      <GameContent
        gameState={{
          ...mockGameState,
          phase: "reveal",
          selected: null, // No answer selected
          currentQuestion: { ...questions[0], answerIndex: 0 },
        }}
      />
    );
    expect(screen.getByText(/Time's up!/i)).toBeInTheDocument();
  });

  it("calls resetGame when the reset button is clicked", () => {
    const resetGame = vi.fn();
    render(<GameContent gameState={{ ...mockGameState, resetGame }} />);
    const resetButton = screen.getByRole("button", { name: /reset game/i });
    fireEvent.click(resetButton);
    expect(resetGame).toHaveBeenCalled();
  });

  it("displays the streak counter when streak is greater than 0", () => {
    render(<GameContent gameState={{ ...mockGameState, streak: 3 }} />);
    expect(screen.getByText(/🔥 3/i)).toBeInTheDocument();
  });

  it("displays team collaboration info in collaborative mode", () => {
    const players = [
      {
        id: "1",
        name: "Player 1",
        score: 0,
        avatar: "👽",
        correctAnswers: 2,
        streak: 0,
      },
      {
        id: "2",
        name: "Player 2",
        score: 0,
        avatar: "👻",
        correctAnswers: 1,
        streak: 0,
      },
    ];
    render(
      <GameContent
        gameState={{
          ...mockGameState,
          teamMode: true,
          collaborativeMode: true,
          players,
        }}
      />
    );
    expect(screen.getByText(/Team Collaboration/i)).toBeInTheDocument();
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText("Player 2")).toBeInTheDocument();
  });

  it("displays current player info in turn-based team mode", () => {
    const currentPlayer = {
      id: "1",
      name: "Player 1",
      score: 10,
      avatar: "👽",
      correctAnswers: 0,
      streak: 0,
    };
    render(
      <GameContent
        gameState={{
          ...mockGameState,
          teamMode: true,
          collaborativeMode: false,
          currentPlayer,
        }}
      />
    );
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText(/10 pts/i)).toBeInTheDocument();
  });

  it("calls setImageLoaded and setImageLoading on image load", () => {
    const setImageLoaded = vi.fn();
    const setImageLoading = vi.fn();
    render(
      <GameContent
        gameState={{ ...mockGameState, setImageLoaded, setImageLoading }}
      />
    );
    const image = screen.getByAltText(/Quiz question/i);
    fireEvent.load(image);
    expect(setImageLoaded).toHaveBeenCalledWith(true);
    expect(setImageLoading).toHaveBeenCalledWith(false);
  });

  it("handles image error by loading a fallback", () => {
    const setImageLoading = vi.fn();
    render(<GameContent gameState={{ ...mockGameState, setImageLoading }} />);
    const image = screen.getByAltText(/Quiz question/i) as HTMLImageElement;
    fireEvent.error(image);
    expect(image.src).toContain("/vite.svg");
    expect(setImageLoading).toHaveBeenCalledWith(false);
  });

  it("renders the map preview when coordinates are available", () => {
    render(
      <GameContent
        gameState={{
          ...mockGameState,
          phase: "reveal",
          currentQuestion: {
            ...questions[0],
            coords: { lat: 6.5244, lng: 3.3792 },
          },
        }}
      />
    );
    expect(screen.getByText(/Location preview/i)).toBeInTheDocument();
    const mapImage = screen.getByAltText(/map preview/i) as HTMLImageElement;
    expect(mapImage.src).toContain("openstreetmap.org");
  });
});
