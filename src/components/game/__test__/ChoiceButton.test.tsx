import { render, screen, fireEvent } from '@testing-library/react';
import { ChoiceButton } from '../ChoiceButton';
import { vi } from 'vitest';

const defaultProps = {
  option: 'Test Option',
  index: 0,
  locked: false,
  selected: null,
  answerIndex: 1,
  handleSelect: vi.fn(),
};

describe('ChoiceButton', () => {
  it('renders the option text', () => {
    render(<ChoiceButton {...defaultProps} />);
    expect(screen.getByText('Test Option')).toBeInTheDocument();
  });

  it('calls handleSelect with the correct index when clicked', () => {
    const handleSelect = vi.fn();
    render(<ChoiceButton {...defaultProps} handleSelect={handleSelect} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleSelect).toHaveBeenCalledWith(0);
  });

  it('is disabled when locked is true', () => {
    render(<ChoiceButton {...defaultProps} locked={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
