import { render, screen } from '@testing-library/react';
import { GameScreen } from '../GameScreen';
import { vi } from 'vitest';
import { questions } from '../../../data';
import type { Phase } from '../../../types/game';

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
  phase: "start" as Phase,
  questionsAnswered: 0,
  totalQuestions: 10,
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
  teamStats: { totalScore: 0, totalCorrect: 0, averageTime: 0, bestStreak: 0 },
  lastPlayedStreak: 0,
  startRound: vi.fn(),
  score: 0,
  // Additional missing properties
  usedQuestions: [],
  timerRef: { current: null },
  timeLeftRef: { current: 10 },
  gameSettings: { difficulty: "all" as const, questionCount: 10 },
  setScore: vi.fn(),
  setUsedQuestions: vi.fn(),
  setTeamStats: vi.fn(),
  setQuestionsAnswered: vi.fn(),
  calculatePoints: vi.fn(),
  setLastPlayedStreak: vi.fn(),
  initializeGame: vi.fn(),
};

describe('GameScreen', () => {
  it('renders StartScreen when phase is "start"', () => {
    render(<GameScreen gameState={{ ...mockGameState, phase: 'start' as Phase }} />);
    expect(screen.getByText('Geo-Guess')).toBeInTheDocument();
  });

  it('renders TeamSetupScreen when phase is "setup"', () => {
    render(<GameScreen gameState={{ ...mockGameState, phase: 'setup' as Phase }} />);
    expect(screen.getByText('Team Setup')).toBeInTheDocument();
  });

  it('renders WaitingScreen when phase is "waiting"', () => {
    render(<GameScreen gameState={{ ...mockGameState, phase: 'waiting' as Phase }} />);
    expect(screen.getByText('Nice Work!')).toBeInTheDocument();
  });

  it('renders FinishedScreen when phase is "finished"', () => {
    render(<GameScreen gameState={{ ...mockGameState, phase: 'finished' as Phase }} />);
    expect(screen.getByText('Adventure Complete!')).toBeInTheDocument();
  });

  it('renders GameContent when phase is "question"', () => {
    render(<GameScreen gameState={{ ...mockGameState, phase: 'question' as Phase }} />);
    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
  });
});
