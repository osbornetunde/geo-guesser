import { render, screen } from '@testing-library/react';
import { CircularTimer } from '../CircularTimer';

describe('CircularTimer', () => {
  it('renders the seconds left', () => {
    render(<CircularTimer secondsLeft={10} total={20} />);
    const secondsLeftElement = screen.getByText('10');
    expect(secondsLeftElement).toBeInTheDocument();
  });

  it('has white text color when secondsLeft is more than 5', () => {
    render(<CircularTimer secondsLeft={10} total={20} />);
    const secondsLeftElement = screen.getByText('10');
    expect(secondsLeftElement).toHaveClass('text-white');
  });

  it('has red text color when secondsLeft is 5 or less', () => {
    render(<CircularTimer secondsLeft={5} total={20} />);
    const secondsLeftElement = screen.getByText('5');
    expect(secondsLeftElement).toHaveClass('text-red-400');
  });
});
