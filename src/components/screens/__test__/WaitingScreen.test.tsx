import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import type { WaitingScreenProps } from "../../../types/game";
import { WaitingScreen } from "../WaitingScreen";

const defaultProps = {
  teamMode: false,
  teamStats: { totalScore: 0, totalCorrect: 0 },
  score: 100,
  availableQuestions: [
    {
      id: "eiffel-tower-1",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg",
      credit: "Wikimedia Commons",
      license: "See file page",
      options: [
        "Eiffel Tower",
        "Arc de Triomphe",
        "Louvre Pyramid",
        "Notre-Dame Cathedral",
      ],
      answerIndex: 0,
      hint: "Iconic wrought-iron lattice tower in a European capital.",
      explain:
        "Designed by Gustave Eiffel, it was built for the 1889 Exposition Universelle and remains Paris’s most recognised landmark.",
      category: "landmark",
      country: "France",
      coords: { lat: 48.8584, lng: 2.2945 },
      difficulty: "easy",
    },
  ],
  streak: 2,
  players: [],
  currentPlayer: null,
  collaborativeMode: false,
  startRound: vi.fn(),
  resetGame: vi.fn(),
  earnedPoints: 10,
  lastPlayedStreak: 2
};

describe("WaitingScreen", () => {
  it('renders "Nice Work!" heading in solo mode', () => {
    render(<WaitingScreen {...defaultProps as WaitingScreenProps} />);
    expect(screen.getByText("Nice Work!")).toBeInTheDocument();
  });

  it('renders "Great Teamwork!" heading in team mode', () => {
    render(<WaitingScreen {...(defaultProps as WaitingScreenProps)} teamMode={true} />);
    expect(screen.getByText("Great Teamwork!")).toBeInTheDocument();
  });

  it('calls startRound when "Continue" button is clicked', () => {
    const startRound = vi.fn();
    render(<WaitingScreen {...(defaultProps as WaitingScreenProps)} startRound={startRound} />);
    fireEvent.click(screen.getByText(/Continue/i));
    expect(startRound).toHaveBeenCalled();
  });

  it("displays streak message when streak is greater than 1", () => {
    render(<WaitingScreen {...(defaultProps as WaitingScreenProps)} streak={3} />);
    expect(screen.getByText(/3 Answer Streak!/i)).toBeInTheDocument();
  });

  it("displays solo score in solo mode", () => {
    render(<WaitingScreen {...(defaultProps as WaitingScreenProps)} score={150} />);
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("displays team score and next player in team mode", () => {
    const players = [
      {
        id: "1",
        name: "Player 1",
        score: 50,
        avatar: "🧑‍🚀",
        correctAnswers: 5,
        streak: 3,
      },
      {
        id: "2",
        name: "Player 2",
        score: 30,
        avatar: "👩‍🚀",
        correctAnswers: 3,
        streak: 2,
      },
    ];
    render(
      <WaitingScreen
        {...(defaultProps as WaitingScreenProps)}
        teamMode={true}
        players={players}
        currentPlayer={players[0]}
        teamStats={{ totalScore: 80, totalCorrect: 8 }}
      />
    );
    expect(screen.getByText("Player 1's Score")).toBeInTheDocument();
    expect(screen.getByText("Up Next:")).toBeInTheDocument();
    expect(screen.getByText("Player 2")).toBeInTheDocument();
  });
});
