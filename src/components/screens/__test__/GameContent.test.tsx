import { render, screen, fireEvent } from '@testing-library/react';
import { GameContent } from '../GameContent';
import { vi } from 'vitest';
import { questions } from '../../../data';

const mockGameState = {
  round: 0,
  selected: null,
  timeLeft: 10,
  locked: false,
  imageLoaded: true,
  imageLoading: false,
  availableQuestions: questions,
  showScoreAnimation: false,
  earnedPoints: 0,
  streak: 0,
  players: [],
  currentPlayer: null,
  teamMode: false,
  collaborativeMode: false,
  currentQuestion: questions[0],
  phase: 'question',
  handleSelect: vi.fn(),
  setImageLoaded: vi.fn(),
  setImageLoading: vi.fn(),
  resetGame: vi.fn(),
  setPhase: vi.fn(),
  setRound: vi.fn(),
  setTimeLeft: vi.fn(),
  setLocked: vi.fn(),
  setSelected: vi.fn(),
  setAvailableQuestions: vi.fn(),
  setShowScoreAnimation: vi.fn(),
  setEarnedPoints: vi.fn(),
  setStreak: vi.fn(),
  setPlayers: vi.fn(),
  setCurrentPlayer: vi.fn(),
  setTeamMode: vi.fn(),
  setCollaborativeMode: vi.fn(),
  setCurrentQuestion: vi.fn(),
};

describe('GameContent', () => {
  it('renders the question and choices', () => {
    render(<GameContent gameState={mockGameState} />);
    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
    expect(screen.getByText(questions[0].options[0])).toBeInTheDocument();
    expect(screen.getByText(questions[0].options[1])).toBeInTheDocument();
  });

  it('calls handleSelect when a choice is clicked', () => {
    const handleSelect = vi.fn();
    render(<GameContent gameState={{ ...mockGameState, handleSelect }} />);
    const choiceButton = screen.getByText(questions[0].options[0]);
    fireEvent.click(choiceButton);
    expect(handleSelect).toHaveBeenCalledWith(0);
  });

  it('displays the reveal message when in reveal phase', () => {
    render(
      <GameContent
        gameState={{
          ...mockGameState,
          phase: 'reveal',
          selected: 0,
          currentQuestion: { ...questions[0], answerIndex: 0 },
        }}
      />
    );
    expect(screen.getByText(/Brilliant!/i)).toBeInTheDocument();
  });

  it('shows score animation when showScoreAnimation is true', () => {
    render(<GameContent gameState={{ ...mockGameState, showScoreAnimation: true, earnedPoints: 50 }} />);
    expect(screen.getByText('+50')).toBeInTheDocument();
  });
});
