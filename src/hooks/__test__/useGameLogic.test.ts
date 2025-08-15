import { renderHook, act } from '@testing-library/react';
import { useGameLogic } from '../useGameLogic';
import { vi } from 'vitest';
import { REVEAL_DURATION, TIMER_DURATION } from '../../constants/game';

describe('useGameLogic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should handle a correct answer', () => {
    const { result } = renderHook(() => useGameLogic());

    act(() => {
      result.current.startRound();
    });

    act(() => {
      result.current.handleSelect(result.current.currentQuestion.answerIndex);
    });

    expect(result.current.phase).toBe('reveal');
    expect(result.current.score).toBeGreaterThan(0);
    expect(result.current.streak).toBe(1);
  });

  it('should handle an incorrect answer', () => {
    const { result } = renderHook(() => useGameLogic());

    act(() => {
      result.current.startRound();
    });

    const incorrectIndex = (result.current.currentQuestion.answerIndex + 1) % 4;

    act(() => {
      result.current.handleSelect(incorrectIndex);
    });

    expect(result.current.phase).toBe('reveal');
    expect(result.current.score).toBe(0);
    expect(result.current.streak).toBe(0);
  });

  it('should handle timeout', () => {
    const { result } = renderHook(() => useGameLogic());

    act(() => {
      result.current.startRound();
    });

    act(() => {
      vi.advanceTimersByTime(TIMER_DURATION * 1000);
    });

    expect(result.current.phase).toBe('reveal');
    expect(result.current.locked).toBe(true);
  });

  it('should transition to the next phase after reveal', () => {
    const { result } = renderHook(() => useGameLogic());

    act(() => {
      result.current.startRound();
    });

    act(() => {
      result.current.handleSelect(result.current.currentQuestion.answerIndex);
    });

    act(() => {
      vi.advanceTimersByTime(REVEAL_DURATION);
    });

    expect(result.current.phase).toBe('waiting');
  });
});
