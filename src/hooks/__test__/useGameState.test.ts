import { renderHook, act } from '@testing-library/react';
import { useGameState } from '../useGameState';
import { TIMER_DURATION } from '../../constants/game';

describe('useGameState', () => {
  it('should have correct initial state', () => {
    const { result } = renderHook(() => useGameState());

    expect(result.current.phase).toBe('start');
    expect(result.current.score).toBe(0);
    expect(result.current.timeLeft).toBe(TIMER_DURATION);
  });

  it('should reset the game state', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.setScore(100);
      result.current.setPhase('finished');
    });

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.score).toBe(0);
    expect(result.current.phase).toBe('start');
  });

  it('should start a new round', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startRound();
    });

    expect(result.current.phase).toBe('question');
  });

  it('should calculate points correctly', () => {
    const { result } = renderHook(() => useGameState());

    const points = result.current.calculatePoints(10, 2);
    // Formula: Math.floor((10 / 30) * 100) + 2 * 10 = 33 + 20 = 53
    expect(points).toBe(53);
  });
});
