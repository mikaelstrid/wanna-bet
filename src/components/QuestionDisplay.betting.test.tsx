import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionDisplay from './QuestionDisplay';
import type { Question, Player, Bet } from '../types';

describe('QuestionDisplay - Betting Functionality', () => {
  const mockQuestion: Question = {
    id: 1,
    rev: 1,
    question: 'Vad är Pythons skapare?',
    answer: 'Guido van Rossum',
    category: 'technology-and-innovation',
    level: 'adult'
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

    it('should display header "Satsa ett på {answererName}"', () => {
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

      expect(screen.getByText(/Satsa ett.*på Edvin/i)).toBeInTheDocument();
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
    it('should not display players with no coins (they are filtered out)', () => {
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

      // Should only have 2 buttons (Johan has coins, Sara doesn't and is filtered)
      expect(bettingButtons).toHaveLength(2);

      // Johan should be displayed
      expect(screen.getByText('Johan')).toBeInTheDocument();

      // Sara should NOT be displayed (has 0 coins)
      expect(screen.queryByText('Sara')).not.toBeInTheDocument();

      // Johan's buttons should be enabled
      expect(bettingButtons[0]).not.toBeDisabled();
      expect(bettingButtons[1]).not.toBeDisabled();
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

  describe('Players Without Coins', () => {
    it('should not display players with 0 coins in the betting list', () => {
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

      // Johan should be displayed (has 1 coin)
      expect(screen.getByText('Johan')).toBeInTheDocument();
      
      // Sara should NOT be displayed (has 0 coins)
      expect(screen.queryByText('Sara')).not.toBeInTheDocument();

      // Should only have 2 betting buttons (1 player x 2 buttons)
      const bettingButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-bet')
      );
      expect(bettingButtons).toHaveLength(2);
    });

    it('should hide entire betting section when no players have coins to bet', () => {
      const playersAllBroke: Player[] = [
        { name: 'Edvin', age: 20, coins: 2 },
        { name: 'Sara', age: 20, coins: 0 },
        { name: 'Johan', age: 20, coins: 0 }
      ];

      render(
        <QuestionDisplay
          question={mockQuestion}
          answererName="Edvin"
          answererId={0}
          players={playersAllBroke}
          currentBets={[]}
          onToggleBet={mockOnToggleBet}
          onCorrect={mockOnCorrect}
          onIncorrect={mockOnIncorrect}
        />
      );

      // Betting section should not be visible
      expect(screen.queryByText(/Satsa ett.*på Edvin/i)).not.toBeInTheDocument();
      
      // No betting buttons should be present
      const allButtons = screen.getAllByRole('button');
      const bettingButtons = allButtons.filter(btn => 
        btn.classList.contains('btn-bet')
      );
      expect(bettingButtons).toHaveLength(0);

      // "Visa svar" button should still be present
      expect(screen.getByRole('button', { name: /Visa svar/i })).toBeInTheDocument();
    });

    it('should hide betting section when the answerer is the only player with coins', () => {
      const onlyAnswererHasCoins: Player[] = [
        { name: 'Edvin', age: 20, coins: 5 },
        { name: 'Sara', age: 20, coins: 0 },
        { name: 'Johan', age: 20, coins: 0 }
      ];

      render(
        <QuestionDisplay
          question={mockQuestion}
          answererName="Edvin"
          answererId={0}
          players={onlyAnswererHasCoins}
          currentBets={[]}
          onToggleBet={mockOnToggleBet}
          onCorrect={mockOnCorrect}
          onIncorrect={mockOnIncorrect}
        />
      );

      // Betting section should not be visible (no eligible bettors)
      expect(screen.queryByText(/Satsa ett.*på Edvin/i)).not.toBeInTheDocument();
      
      // No betting buttons should be present
      const allButtons = screen.getAllByRole('button');
      const bettingButtons = allButtons.filter(btn => 
        btn.classList.contains('btn-bet')
      );
      expect(bettingButtons).toHaveLength(0);
    });

    it('should still display betting section with only players who have coins', () => {
      const mixedCoins: Player[] = [
        { name: 'Edvin', age: 20, coins: 0 },
        { name: 'Sara', age: 20, coins: 1 },
        { name: 'Johan', age: 20, coins: 0 },
        { name: 'Lisa', age: 20, coins: 2 }
      ];

      render(
        <QuestionDisplay
          question={mockQuestion}
          answererName="Edvin"
          answererId={0}
          players={mixedCoins}
          currentBets={[]}
          onToggleBet={mockOnToggleBet}
          onCorrect={mockOnCorrect}
          onIncorrect={mockOnIncorrect}
        />
      );

      // Betting section should be visible
      expect(screen.getByText(/Satsa ett.*på Edvin/i)).toBeInTheDocument();
      
      // Sara and Lisa should be displayed
      expect(screen.getByText('Sara')).toBeInTheDocument();
      expect(screen.getByText('Lisa')).toBeInTheDocument();
      
      // Johan should NOT be displayed (has 0 coins)
      expect(screen.queryByText('Johan')).not.toBeInTheDocument();

      // Should have 4 betting buttons (2 players x 2 buttons)
      const bettingButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-bet')
      );
      expect(bettingButtons).toHaveLength(4);
    });
  });
});
