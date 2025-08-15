import { render, screen } from '@testing-library/react';
import { ParticleBackground } from './ParticleBackground';

describe('ParticleBackground', () => {
  it('renders a canvas element', () => {
    render(<ParticleBackground />);
    const canvasElement = screen.getByTestId('particle-canvas');
    expect(canvasElement).toBeInTheDocument();
    expect(canvasElement.tagName).toBe('CANVAS');
  });
});
