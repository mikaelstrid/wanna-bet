import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlayerRegistration from './PlayerRegistration';
import * as storage from '../utils/storage';

describe('PlayerRegistration', () => {
  const mockOnStartGame = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.spyOn(storage, 'loadPlayerNames').mockReturnValue([]);
    vi.spyOn(storage, 'savePlayerNames').mockImplementation(() => {});
  });

  describe('duplicate name validation', () => {
    it('should show error when two players have the same name (case-insensitive)', async () => {
      render(<PlayerRegistration onStartGame={mockOnStartGame} />);
      
      const input1 = screen.getByLabelText('Spelare 1');
      const input2 = screen.getByLabelText('Spelare 2');
      
      fireEvent.change(input1, { target: { value: 'Kalle' } });
      fireEvent.change(input2, { target: { value: 'kalle' } });
      
      const submitButton = screen.getByRole('button', { name: /Starta spelet/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Alla spelarnamn måste vara unika')).toBeInTheDocument();
      });
      expect(mockOnStartGame).not.toHaveBeenCalled();
    });

    it('should show error when three players have duplicate names', async () => {
      render(<PlayerRegistration onStartGame={mockOnStartGame} />);
      
      const input1 = screen.getByLabelText('Spelare 1');
      const input2 = screen.getByLabelText('Spelare 2');
      const input3 = screen.getByLabelText('Spelare 3');
      
      fireEvent.change(input1, { target: { value: 'Anna' } });
      fireEvent.change(input2, { target: { value: 'Bob' } });
      fireEvent.change(input3, { target: { value: 'ANNA' } });
      
      const submitButton = screen.getByRole('button', { name: /Starta spelet/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Alla spelarnamn måste vara unika')).toBeInTheDocument();
      });
      expect(mockOnStartGame).not.toHaveBeenCalled();
    });

    it('should allow submission when all names are unique', async () => {
      render(<PlayerRegistration onStartGame={mockOnStartGame} />);
      
      const input1 = screen.getByLabelText('Spelare 1');
      const input2 = screen.getByLabelText('Spelare 2');
      
      fireEvent.change(input1, { target: { value: 'Kalle' } });
      fireEvent.change(input2, { target: { value: 'Lisa' } });
      
      const submitButton = screen.getByRole('button', { name: /Starta spelet/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnStartGame).toHaveBeenCalledWith(['Kalle', 'Lisa']);
      });
    });
  });

  describe('player name suggestions filtering', () => {
    it('should exclude already-filled player names from suggestions (case-insensitive)', () => {
      vi.spyOn(storage, 'loadPlayerNames').mockReturnValue(['Alice', 'Bob', 'Charlie', 'David']);
      
      render(<PlayerRegistration onStartGame={mockOnStartGame} />);
      
      const input1 = screen.getByLabelText('Spelare 1');
      
      // Fill in first player as "alice" (lowercase)
      fireEvent.change(input1, { target: { value: 'alice' } });
      
      // Check that datalist for second player doesn't include "Alice"
      const datalist2 = document.getElementById('player-suggestions-1');
      const options2 = datalist2?.querySelectorAll('option');
      const values2 = Array.from(options2 || []).map(opt => opt.value);
      
      expect(values2).not.toContain('Alice');
      expect(values2).toContain('Bob');
      expect(values2).toContain('Charlie');
      expect(values2).toContain('David');
    });

    it('should exclude multiple already-filled names from suggestions', () => {
      vi.spyOn(storage, 'loadPlayerNames').mockReturnValue(['Alice', 'Bob', 'Charlie', 'David']);
      
      render(<PlayerRegistration onStartGame={mockOnStartGame} />);
      
      const input1 = screen.getByLabelText('Spelare 1');
      const input2 = screen.getByLabelText('Spelare 2');
      
      // Fill in first two players
      fireEvent.change(input1, { target: { value: 'ALICE' } });
      fireEvent.change(input2, { target: { value: 'bob' } });
      
      // Check that datalist for third player doesn't include "Alice" or "Bob"
      const datalist3 = document.getElementById('player-suggestions-2');
      const options3 = datalist3?.querySelectorAll('option');
      const values3 = Array.from(options3 || []).map(opt => opt.value);
      
      expect(values3).not.toContain('Alice');
      expect(values3).not.toContain('Bob');
      expect(values3).toContain('Charlie');
      expect(values3).toContain('David');
    });

    it('should still show a name in its own input field suggestions', () => {
      vi.spyOn(storage, 'loadPlayerNames').mockReturnValue(['Alice', 'Bob', 'Charlie']);
      
      render(<PlayerRegistration onStartGame={mockOnStartGame} />);
      
      const input1 = screen.getByLabelText('Spelare 1');
      
      // Fill in first player as "Alice"
      fireEvent.change(input1, { target: { value: 'Alice' } });
      
      // Check that datalist for first player still includes "Alice"
      const datalist1 = document.getElementById('player-suggestions-0');
      const options1 = datalist1?.querySelectorAll('option');
      const values1 = Array.from(options1 || []).map(opt => opt.value);
      
      expect(values1).toContain('Alice');
      expect(values1).toContain('Bob');
      expect(values1).toContain('Charlie');
    });

    it('should update suggestions dynamically when player names change', () => {
      vi.spyOn(storage, 'loadPlayerNames').mockReturnValue(['Alice', 'Bob', 'Charlie']);
      
      render(<PlayerRegistration onStartGame={mockOnStartGame} />);
      
      const input1 = screen.getByLabelText('Spelare 1');
      
      // Fill in first player
      fireEvent.change(input1, { target: { value: 'Alice' } });
      
      // Verify second player's datalist doesn't include Alice
      let datalist2 = document.getElementById('player-suggestions-1');
      let options2 = datalist2?.querySelectorAll('option');
      let values2 = Array.from(options2 || []).map(opt => opt.value);
      expect(values2).not.toContain('Alice');
      
      // Clear first player
      fireEvent.change(input1, { target: { value: '' } });
      
      // Verify second player's datalist now includes Alice again
      datalist2 = document.getElementById('player-suggestions-1');
      options2 = datalist2?.querySelectorAll('option');
      values2 = Array.from(options2 || []).map(opt => opt.value);
      expect(values2).toContain('Alice');
    });

    it('should handle empty player names correctly in suggestions', () => {
      vi.spyOn(storage, 'loadPlayerNames').mockReturnValue(['Alice', 'Bob', 'Charlie']);
      
      render(<PlayerRegistration onStartGame={mockOnStartGame} />);
      
      const input1 = screen.getByLabelText('Spelare 1');
      
      // Fill in first player, leave others empty
      fireEvent.change(input1, { target: { value: 'Alice' } });
      
      // Check that datalist for fourth player (which is empty) shows all names except Alice
      const datalist4 = document.getElementById('player-suggestions-3');
      const options4 = datalist4?.querySelectorAll('option');
      const values4 = Array.from(options4 || []).map(opt => opt.value);
      
      expect(values4).not.toContain('Alice');
      expect(values4).toContain('Bob');
      expect(values4).toContain('Charlie');
    });

    it('should handle names with different cases in filtering', () => {
      vi.spyOn(storage, 'loadPlayerNames').mockReturnValue(['KALLE', 'lisa', 'PeTtEr']);
      
      render(<PlayerRegistration onStartGame={mockOnStartGame} />);
      
      const input1 = screen.getByLabelText('Spelare 1');
      
      // Fill in first player with different case
      fireEvent.change(input1, { target: { value: 'kalle' } });
      
      // Check that datalist for second player doesn't include "KALLE"
      const datalist2 = document.getElementById('player-suggestions-1');
      const options2 = datalist2?.querySelectorAll('option');
      const values2 = Array.from(options2 || []).map(opt => opt.value);
      
      expect(values2).not.toContain('KALLE');
      expect(values2).toContain('lisa');
      expect(values2).toContain('PeTtEr');
    });
  });

  describe('minimum player validation', () => {
    it('should show error when less than 2 players are filled in', async () => {
      render(<PlayerRegistration onStartGame={mockOnStartGame} />);
      
      const input1 = screen.getByLabelText('Spelare 1');
      fireEvent.change(input1, { target: { value: 'Kalle' } });
      
      const submitButton = screen.getByRole('button', { name: /Starta spelet/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Minst 2 spelare måste fyllas i')).toBeInTheDocument();
      });
      expect(mockOnStartGame).not.toHaveBeenCalled();
    });
  });
});
