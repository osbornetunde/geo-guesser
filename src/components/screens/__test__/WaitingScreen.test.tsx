import { render, screen, fireEvent } from '@testing-library/react';
import { WaitingScreen } from '../WaitingScreen';
import { vi } from 'vitest';

const defaultProps = {
  teamMode: false,
  teamStats: { totalScore: 0, totalCorrect: 0, totalIncorrect: 0 },
  score: 100,
  availableQuestions: [1, 2, 3],
  streak: 2,
  players: [],
  currentPlayer: null,
  collaborativeMode: false,
  startRound: vi.fn(),
  resetGame: vi.fn(),
  earnedPoints: 10,
  lastPlayedStreak: 2,
};

describe('WaitingScreen', () => {
  it('renders "Nice Work!" heading in solo mode', () => {
    render(<WaitingScreen {...defaultProps} />);
    expect(screen.getByText('Nice Work!')).toBeInTheDocument();
  });

  it('renders "Great Teamwork!" heading in team mode', () => {
    render(<WaitingScreen {...defaultProps} teamMode={true} />);
    expect(screen.getByText('Great Teamwork!')).toBeInTheDocument();
  });

  it('calls startRound when "Continue" button is clicked', () => {
    const startRound = vi.fn();
    render(<WaitingScreen {...defaultProps} startRound={startRound} />);
    fireEvent.click(screen.getByText(/Continue/i));
    expect(startRound).toHaveBeenCalled();
  });

  it('displays streak message when streak is greater than 1', () => {
    render(<WaitingScreen {...defaultProps} streak={3} />);
    expect(screen.getByText(/3 Answer Streak!/i)).toBeInTheDocument();
  });

  it('displays solo score in solo mode', () => {
    render(<WaitingScreen {...defaultProps} score={150} />);
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('displays team score and next player in team mode', () => {
    const players = [
      { id: '1', name: 'Player 1', score: 50, avatar: '🧑‍🚀', correctAnswers: 5, streak: 3 },
      { id: '2', name: 'Player 2', score: 30, avatar: '👩‍🚀', correctAnswers: 3, streak: 2 },
    ];
    render(
      <WaitingScreen
        {...defaultProps}
        teamMode={true}
        players={players}
        currentPlayer={players[0]}
        teamStats={{ totalScore: 80, totalCorrect: 8, totalIncorrect: 2 }}
      />
    );
    expect(screen.getByText("Player 1's Score")).toBeInTheDocument();
    expect(screen.getByText('Up Next:')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
  });
});
