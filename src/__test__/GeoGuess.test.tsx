import { render, screen } from '@testing-library/react';
import GeoGuessMiniApp from '../GeoGuess';
import { vi, type Mock } from 'vitest';
import { useGameState } from '../hooks/useGameState';

vi.mock('../hooks/useGameState');

const mockUseGameState = useGameState as Mock;

describe('GeoGuessMiniApp', () => {
  beforeEach(() => {
    mockUseGameState.mockReturnValue({
      phase: 'start',
      round: 0,
      timeLeft: 10,
      locked: false,
      streak: 0,
      teamMode: false,
      currentPlayer: null,
      availableQuestions: [],
      timerRef: { current: null },
      timeLeftRef: { current: 10 },
      setPhase: vi.fn(),
      setLocked: vi.fn(),
      setSelected: vi.fn(),
      setStreak: vi.fn(),
      calculatePoints: vi.fn(),
      setEarnedPoints: vi.fn(),
      setScore: vi.fn(),
      setShowScoreAnimation: vi.fn(),
      setPlayers: vi.fn(),
      setTeamStats: vi.fn(),
      setUsedQuestions: vi.fn(),
      setAvailableQuestions: vi.fn(),
      setTimeLeft: vi.fn(),
      setImageLoaded: vi.fn(),
      setImageLoading: vi.fn(),
      handleSelect: vi.fn(),
    });
  });

  it('renders the game screen', () => {
    render(<GeoGuessMiniApp />);
    expect(screen.getByText('Geo-Guess Lagos')).toBeInTheDocument();
  });

  it('starts the timer when the phase is "question"', () => {
    const setTimeLeft = vi.fn();
    mockUseGameState.mockReturnValue({
      ...mockUseGameState(),
      phase: 'question',
      setTimeLeft,
    });
    render(<GeoGuessMiniApp />);
    expect(setTimeLeft).toHaveBeenCalledWith(30); // TIMER_DURATION
  });
});
