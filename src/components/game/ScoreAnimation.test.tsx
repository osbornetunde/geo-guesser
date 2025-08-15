import { render, screen } from '@testing-library/react';
import { ScoreAnimation } from './ScoreAnimation';

describe('ScoreAnimation', () => {
  it('renders the points with a plus prefix', () => {
    render(<ScoreAnimation points={100} />);
    const pointsElement = screen.getByText('+100');
    expect(pointsElement).toBeInTheDocument();
  });
});
