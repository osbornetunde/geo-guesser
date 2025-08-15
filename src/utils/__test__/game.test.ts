import { vi } from 'vitest';
import { triggerConfetti, getRandomAvatar, shareResults } from '../game';
import { AVATARS } from '../../constants/game';
// @ts-ignore
import confetti from 'canvas-confetti';

vi.mock('canvas-confetti', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('game utils', () => {
  describe('triggerConfetti', () => {
    it('calls confetti function', () => {
      triggerConfetti('correct');
      expect(confetti).toHaveBeenCalled();
    });
  });

  describe('getRandomAvatar', () => {
    it('returns a valid avatar', () => {
      const avatar = getRandomAvatar();
      expect(typeof avatar).toBe('string');
      expect(AVATARS).toContain(avatar);
    });
  });

  describe('shareResults', () => {
    const share = vi.fn();
    const writeText = vi.fn(() => Promise.resolve());

    Object.defineProperty(window, 'alert', {
      writable: true,
      value: vi.fn(),
    });

    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: share,
    });

    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: { writeText },
    });

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('calls navigator.share if available', () => {
      Object.defineProperty(navigator, 'share', {
        writable: true,
        value: share,
      });
      shareResults(100, 50, false, []);
      expect(share).toHaveBeenCalled();
    });

    it('calls navigator.clipboard.writeText if share is not available', () => {
      Object.defineProperty(navigator, 'share', {
        writable: true,
        value: undefined,
      });
      shareResults(100, 50, false, []);
      expect(writeText).toHaveBeenCalled();
    });
  });
});
