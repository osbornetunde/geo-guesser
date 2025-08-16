import { render, screen } from '@testing-library/react';
import { GameScreen } from '../GameScreen';
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
  phase: 'start',
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
  teamStats: { totalScore: 0, totalCorrect: 0, totalIncorrect: 0 },
  lastPlayedStreak: 0,
  startRound: vi.fn(),
  score: 0,
};

describe('GameScreen', () => {
  it('renders StartScreen when phase is "start"', () => {
    render(<GameScreen gameState={{ ...mockGameState, phase: 'start' }} />);
    expect(screen.getByText('Geo-Guess Lagos')).toBeInTheDocument();
  });

  it('renders TeamSetupScreen when phase is "setup"', () => {
    render(<GameScreen gameState={{ ...mockGameState, phase: 'setup' }} />);
    expect(screen.getByText('Team Setup')).toBeInTheDocument();
  });

  it('renders WaitingScreen when phase is "waiting"', () => {
    render(<GameScreen gameState={{ ...mockGameState, phase: 'waiting' }} />);
    expect(screen.getByText('Nice Work!')).toBeInTheDocument();
  });

  it('renders FinishedScreen when phase is "finished"', () => {
    render(<GameScreen gameState={{ ...mockGameState, phase: 'finished' }} />);
    expect(screen.getByText('Adventure Complete!')).toBeInTheDocument();
  });

  it('renders GameContent when phase is "question"', () => {
    render(<GameScreen gameState={{ ...mockGameState, phase: 'question' }} />);
    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
  });
});
