import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionDisplay from './QuestionDisplay';
import type { Question, Player, Bet } from '../types';

describe('QuestionDisplay - Betting Functionality', () => {
  const mockQuestion: Question = {
    question: 'Vad är Pythons skapare?',
    answer: 'Guido van Rossum',
    category: 'technology-and-innovation'
  };

  const mockPlayers: Player[] = [
    { name: 'Edvin', age: 20, coins: 2 },
    { name: 'Sara', age: 20, coins: 1 },
    { name: 'Johan', age: 20, coins: 1 }
  ];

  const mockOnCorrect = vi.fn();
  const mockOnIncorrect = vi.fn();
  const mockOnToggleBet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Betting UI', () => {
    it('should display two betting buttons "Kan" and "Kan ej" for each eligible player', () => {
      render(
        <QuestionDisplay
          question={mockQuestion}
          answererName="Edvin"
          answererId={0}
          players={mockPlayers}
          currentBets={[]}
          onToggleBet={mockOnToggleBet}
          onCorrect={mockOnCorrect}
          onIncorrect={mockOnIncorrect}
        />
      );

      // Should have betting buttons for Sara and Johan (not Edvin who is answering)
      const bettingButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-bet')
      );
      
      // 2 players x 2 buttons each = 4 buttons
      expect(bettingButtons).toHaveLength(4);
      
      // Check button text
      expect(screen.getAllByText('Kan')).toHaveLength(2);
      expect(screen.getAllByText('Kan ej')).toHaveLength(2);
    });

    it('should display header "Satsa ett 🪙 på {answererName}"', () => {
      render(
        <QuestionDisplay
          question={mockQuestion}
          answererName="Edvin"
          answererId={0}
          players={mockPlayers}
          currentBets={[]}
          onToggleBet={mockOnToggleBet}
          onCorrect={mockOnCorrect}
          onIncorrect={mockOnIncorrect}
        />
      );

      expect(screen.getByText(/Satsa ett 🪙 på Edvin/i)).toBeInTheDocument();
    });

    it('should call onToggleBet with "can" when "Kan" button is clicked', () => {
      render(
        <QuestionDisplay
          question={mockQuestion}
          answererName="Edvin"
          answererId={0}
          players={mockPlayers}
          currentBets={[]}
          onToggleBet={mockOnToggleBet}
          onCorrect={mockOnCorrect}
          onIncorrect={mockOnIncorrect}
        />
      );

      const bettingButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-bet')
      );
      
      // Click Sara's "Kan" button (first button)
      fireEvent.click(bettingButtons[0]);
      
      expect(mockOnToggleBet).toHaveBeenCalledWith(1, 'can');
    });

    it('should call onToggleBet with "cannot" when "Kan ej" button is clicked', () => {
      render(
        <QuestionDisplay
          question={mockQuestion}
          answererName="Edvin"
          answererId={0}
          players={mockPlayers}
          currentBets={[]}
          onToggleBet={mockOnToggleBet}
          onCorrect={mockOnCorrect}
          onIncorrect={mockOnIncorrect}
        />
      );

      const bettingButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-bet')
      );
      
      // Click Sara's "Kan ej" button (second button)
      fireEvent.click(bettingButtons[1]);
      
      expect(mockOnToggleBet).toHaveBeenCalledWith(1, 'cannot');
    });
  });

  describe('Betting States', () => {
    it('should show active state only on "Kan" button when player has bet "can"', () => {
      const currentBets: Bet[] = [{ playerId: 1, type: 'can' }];
      
      render(
        <QuestionDisplay
          question={mockQuestion}
          answererName="Edvin"
          answererId={0}
          players={mockPlayers}
          currentBets={currentBets}
          onToggleBet={mockOnToggleBet}
          onCorrect={mockOnCorrect}
          onIncorrect={mockOnIncorrect}
        />
      );

      // Sara's "Kan" button should show active state
      const canButton = screen.getByRole('button', { 
        name: /Du har satsat ett mynt på att Edvin kan frågan/i 
      });
      expect(canButton).toHaveClass('bet-active');
      expect(canButton).toHaveTextContent('✓ Kan');

      // Sara's "Kan ej" button should NOT be active - check by filtering all buttons
      const allButtons = screen.getAllByRole('button');
      const cannotButtons = allButtons.filter(btn => 
        btn.textContent === 'Kan ej' && !btn.classList.contains('bet-active')
      );
      expect(cannotButtons.length).toBeGreaterThan(0);
    });

    it('should show active state only on "Kan ej" button when player has bet "cannot"', () => {
      const currentBets: Bet[] = [{ playerId: 1, type: 'cannot' }];
      
      render(
        <QuestionDisplay
          question={mockQuestion}
          answererName="Edvin"
          answererId={0}
          players={mockPlayers}
          currentBets={currentBets}
          onToggleBet={mockOnToggleBet}
          onCorrect={mockOnCorrect}
          onIncorrect={mockOnIncorrect}
        />
      );

      // Sara's "Kan ej" button should show active state
      const cannotButton = screen.getByRole('button', { 
        name: /Du har satsat ett mynt på att Edvin inte kan frågan/i 
      });
      expect(cannotButton).toHaveClass('bet-active');
      expect(cannotButton).toHaveTextContent('✓ Kan ej');

      // Sara's "Kan" button should NOT be active - check by filtering all buttons
      const allButtons = screen.getAllByRole('button');
      const canButtons = allButtons.filter(btn => 
        btn.textContent === 'Kan' && !btn.classList.contains('bet-active')
      );
      expect(canButtons.length).toBeGreaterThan(0);
    });

    it('should handle multiple players betting different types', () => {
      const currentBets: Bet[] = [
        { playerId: 1, type: 'can' },
        { playerId: 2, type: 'cannot' }
      ];
      
      render(
        <QuestionDisplay
          question={mockQuestion}
          answererName="Edvin"
          answererId={0}
          players={mockPlayers}
          currentBets={currentBets}
          onToggleBet={mockOnToggleBet}
          onCorrect={mockOnCorrect}
          onIncorrect={mockOnIncorrect}
        />
      );

      // Check that Sara has bet "can"
      const saraCanButton = screen.getAllByRole('button').filter(btn => 
        btn.textContent === '✓ Kan' && btn.classList.contains('bet-active')
      );
      expect(saraCanButton).toHaveLength(1);

      // Check that Johan has bet "cannot"
      const johanCannotButton = screen.getAllByRole('button').filter(btn => 
        btn.textContent === '✓ Kan ej' && btn.classList.contains('bet-active')
      );
      expect(johanCannotButton).toHaveLength(1);
    });
  });

  describe('Button Disabled State', () => {
    it('should disable both buttons when player has no coins', () => {
      const playersWithNoCoins: Player[] = [
        { name: 'Edvin', age: 20, coins: 2 },
        { name: 'Sara', age: 20, coins: 0 },
        { name: 'Johan', age: 20, coins: 1 }
      ];

      render(
        <QuestionDisplay
          question={mockQuestion}
          answererName="Edvin"
          answererId={0}
          players={playersWithNoCoins}
          currentBets={[]}
          onToggleBet={mockOnToggleBet}
          onCorrect={mockOnCorrect}
          onIncorrect={mockOnIncorrect}
        />
      );

      const bettingButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-bet')
      );

      // Sara's buttons (first 2) should be disabled
      expect(bettingButtons[0]).toBeDisabled();
      expect(bettingButtons[1]).toBeDisabled();

      // Johan's buttons should be enabled
      expect(bettingButtons[2]).not.toBeDisabled();
      expect(bettingButtons[3]).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels for betting buttons in inactive state', () => {
      render(
        <QuestionDisplay
          question={mockQuestion}
          answererName="Edvin"
          answererId={0}
          players={mockPlayers}
          currentBets={[]}
          onToggleBet={mockOnToggleBet}
          onCorrect={mockOnCorrect}
          onIncorrect={mockOnIncorrect}
        />
      );

      // Check aria labels exist (there will be multiple with same label, one per player)
      const canButtons = screen.getAllByRole('button', { 
        name: /Satsa ett mynt på att Edvin kan frågan/i 
      });
      expect(canButtons.length).toBeGreaterThan(0);
      
      const cannotButtons = screen.getAllByRole('button', { 
        name: /Satsa ett mynt på att Edvin inte kan frågan/i 
      });
      expect(cannotButtons.length).toBeGreaterThan(0);
    });

    it('should have proper aria labels for betting buttons in active state', () => {
      const currentBets: Bet[] = [{ playerId: 1, type: 'can' }];
      
      render(
        <QuestionDisplay
          question={mockQuestion}
          answererName="Edvin"
          answererId={0}
          players={mockPlayers}
          currentBets={currentBets}
          onToggleBet={mockOnToggleBet}
          onCorrect={mockOnCorrect}
          onIncorrect={mockOnIncorrect}
        />
      );

      expect(screen.getByRole('button', { 
        name: /Du har satsat ett mynt på att Edvin kan frågan. Klicka för att ångra satsningen/i 
      })).toBeInTheDocument();
    });
  });
});
