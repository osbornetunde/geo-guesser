import { render, screen } from '@testing-library/react';
import { ParticleBackground } from '../ParticleBackground';
import { vi } from 'vitest';

describe('ParticleBackground', () => {
  beforeEach(() => {
    // Mock the canvas getContext method
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      // Add other methods you use in your component
    })) as any;
  });

  it('renders a canvas element', () => {
    render(<ParticleBackground />);
    const canvasElement = screen.getByTestId('particle-canvas');
    expect(canvasElement).toBeInTheDocument();
    expect(canvasElement.tagName).toBe('CANVAS');
  });
});
