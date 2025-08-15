import { render, screen, fireEvent } from '@testing-library/react';
import { TeamSetupScreen } from '../TeamSetupScreen';
import { vi } from 'vitest';
import * as gameUtils from '../../../utils/game';

vi.mock('../../utils/game', () => ({
  ...vi.importActual('../../utils/game'),
  getRandomAvatar: vi.fn(() => '🧑‍🚀'),
}));

const defaultProps = {
  players: [],
  setPlayers: vi.fn(),
  setTeamMode: vi.fn(),
  setCurrentPlayer: vi.fn(),
  collaborativeMode: false,
  setCollaborativeMode: vi.fn(),
  startRound: vi.fn(),
  setPhase: vi.fn(),
  resetGame: vi.fn(),
};

describe('TeamSetupScreen', () => {
  it('renders the heading', () => {
    render(<TeamSetupScreen {...defaultProps} />);
    expect(screen.getByText('Team Setup')).toBeInTheDocument();
  });

  it('adds a player', () => {
    const setPlayers = vi.fn();
    render(<TeamSetupScreen {...defaultProps} setPlayers={setPlayers} />);
    const input = screen.getByPlaceholderText('Enter player name...');
    // There are multiple buttons with "Add" in them, so we need to be more specific.
    const addButton = screen.getAllByRole('button', { name: /Add/i }).find(
      (btn) => btn.textContent === '+Add'
    );
    expect(addButton).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'New Player' } });
    fireEvent.click(addButton!);

    expect(setPlayers).toHaveBeenCalled();
  });

  it('removes a player', () => {
    const setPlayers = vi.fn();
    const players = [{ id: '1', name: 'Player 1', score: 0, avatar: '🧑‍🚀', correctAnswers: 0, streak: 0 }];
    render(<TeamSetupScreen {...defaultProps} players={players} setPlayers={setPlayers} />);
    const removeButton = screen.getByRole('button', { name: /×/i });
    fireEvent.click(removeButton);
    expect(setPlayers).toHaveBeenCalled();
  });

  it('disables start button when no players are added', () => {
    render(<TeamSetupScreen {...defaultProps} />);
    const startButton = screen.getByRole('button', { name: /Add Players First/i });
    expect(startButton).toBeDisabled();
  });

  it('calls startTeamGame when start button is clicked with players', () => {
    const startRound = vi.fn();
    const players = [{ id: '1', name: 'Player 1', score: 0, avatar: '🧑‍🚀', correctAnswers: 0, streak: 0 }];
    render(<TeamSetupScreen {...defaultProps} players={players} startRound={startRound} />);
    const startButton = screen.getByRole('button', { name: /Start with 1 Player/i });
    fireEvent.click(startButton);
    expect(startRound).toHaveBeenCalled();
  });

  it('calls setPhase with "start" when back button is clicked', () => {
    const setPhase = vi.fn();
    render(<TeamSetupScreen {...defaultProps} setPhase={setPhase} />);
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);
    expect(setPhase).toHaveBeenCalledWith('start');
  });
});
