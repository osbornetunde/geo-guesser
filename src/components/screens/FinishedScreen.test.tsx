import { render, screen, fireEvent } from '@testing-library/react';
import { FinishedScreen } from './FinishedScreen';
import { vi } from 'vitest';
import * as gameUtils from '../../utils/game';

// Mock the game utils
vi.mock('../../utils/game', () => ({
  getPerformanceData: vi.fn(() => ({
    emoji: '🎉',
    message: 'Great job!',
    color: 'text-green-400',
  })),
  shareResults: vi.fn(),
  triggerConfetti: vi.fn(),
}));

const defaultProps = {
  score: 80,
  teamMode: false,
  players: [],
  teamStats: { totalScore: 0, totalCorrect: 0, totalIncorrect: 0 },
  resetGame: vi.fn(),
};

describe('FinishedScreen', () => {
  it('renders the heading', () => {
    render(<FinishedScreen {...defaultProps} />);
    expect(screen.getByText('Adventure Complete!')).toBeInTheDocument();
  });

  it('calls resetGame when "Play Again" is clicked', () => {
    const resetGame = vi.fn();
    render(<FinishedScreen {...defaultProps} resetGame={resetGame} />);
    fireEvent.click(screen.getByText('Play Again'));
    expect(resetGame).toHaveBeenCalled();
  });

  it('calls shareResults when "Share" is clicked', () => {
    render(<FinishedScreen {...defaultProps} />);
    fireEvent.click(screen.getByText('Share'));
    expect(gameUtils.shareResults).toHaveBeenCalled();
  });

  it('displays solo score when not in team mode', () => {
    render(<FinishedScreen {...defaultProps} score={85} />);
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('displays team leaderboard when in team mode', () => {
    const players = [
      { id: '1', name: 'Player 1', score: 50, avatar: ' A', correctAnswers: 5, streak: 3 },
      { id: '2', name: 'Player 2', score: 30, avatar: 'B', correctAnswers: 3, streak: 2 },
    ];
    render(
      <FinishedScreen
        {...defaultProps}
        teamMode={true}
        players={players}
        teamStats={{ totalScore: 80, totalCorrect: 8, totalIncorrect: 2 }}
      />
    );
    expect(screen.getByText('Team Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
  });
});
