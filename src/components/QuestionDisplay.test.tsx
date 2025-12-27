import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionDisplay from './QuestionDisplay';
import type { Question, Player, Bet } from '../types';

describe('QuestionDisplay', () => {
  const mockQuestion: Question = {
    id: 1,
    rev: 1,
    question: 'Vad är huvudstaden i Sverige?',
    answer: 'Stockholm',
    category: 'geography',
    level: 'child'
  };

  const mockPlayers: Player[] = [
    { name: 'Kalle', age: 20, coins: 2 },
    { name: 'Lisa', age: 20, coins: 1 },
    { name: 'Anna', age: 20, coins: 0 }
  ];

  const mockOnCorrect = vi.fn();
  const mockOnIncorrect = vi.fn();
  const mockOnToggleBet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initially show betting phase', () => {
    render(
      <QuestionDisplay
        question={mockQuestion}
        answererName="Kalle"
        answererId={0}
        players={mockPlayers}
        currentBets={[]}
        onToggleBet={mockOnToggleBet}
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    // Question should be visible
    expect(screen.getByText('Vad är huvudstaden i Sverige?')).toBeInTheDocument();
    
    // Betting section should be visible with new header
    expect(screen.getByText(/Satsa ett.*på Kalle/i)).toBeInTheDocument();
    
    // Non-answering players should be shown
    expect(screen.getByText('Lisa')).toBeInTheDocument();
    expect(screen.getByText('Anna')).toBeInTheDocument();
    
    // Answer should not be visible
    expect(screen.queryByText('Stockholm')).not.toBeInTheDocument();
    
    // "Visa svar" button should be visible
    expect(screen.getByRole('button', { name: /Visa svar/i })).toBeInTheDocument();
  });

  it('should show the answer when "Visa svar" button is clicked', () => {
    render(
      <QuestionDisplay
        question={mockQuestion}
        answererName="Kalle"
        answererId={0}
        players={mockPlayers}
        currentBets={[]}
        onToggleBet={mockOnToggleBet}
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    // Click "Visa svar" button
    const showAnswerButton = screen.getByRole('button', { name: /Visa svar/i });
    fireEvent.click(showAnswerButton);

    // Answer should now be visible
    expect(screen.getByText('Stockholm')).toBeInTheDocument();
    
    // Betting section should not be visible
    expect(screen.queryByText(/Satsa ett.*på Kalle/i)).not.toBeInTheDocument();
    
    // Correct/Incorrect buttons should be visible
    expect(screen.getByRole('button', { name: /Rätt/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fel/i })).toBeInTheDocument();
  });

  it('should call onCorrect when "Rätt" button is clicked', () => {
    render(
      <QuestionDisplay
        question={mockQuestion}
        answererName="Kalle"
        answererId={0}
        players={mockPlayers}
        currentBets={[]}
        onToggleBet={mockOnToggleBet}
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    // Reveal the answer
    const showAnswerButton = screen.getByRole('button', { name: /Visa svar/i });
    fireEvent.click(showAnswerButton);

    // Then click "Rätt"
    const correctButton = screen.getByRole('button', { name: /Rätt/i });
    fireEvent.click(correctButton);

    expect(mockOnCorrect).toHaveBeenCalledTimes(1);
    expect(mockOnIncorrect).not.toHaveBeenCalled();
  });

  it('should call onIncorrect when "Fel" button is clicked', () => {
    render(
      <QuestionDisplay
        question={mockQuestion}
        answererName="Kalle"
        answererId={0}
        players={mockPlayers}
        currentBets={[]}
        onToggleBet={mockOnToggleBet}
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    // Reveal the answer
    const showAnswerButton = screen.getByRole('button', { name: /Visa svar/i });
    fireEvent.click(showAnswerButton);

    // Then click "Fel"
    const incorrectButton = screen.getByRole('button', { name: /Fel/i });
    fireEvent.click(incorrectButton);

    expect(mockOnIncorrect).toHaveBeenCalledTimes(1);
    expect(mockOnCorrect).not.toHaveBeenCalled();
  });

  it('should display the correct answerer name', () => {
    render(
      <QuestionDisplay
        question={mockQuestion}
        answererName="Lisa"
        answererId={1}
        players={mockPlayers}
        currentBets={[]}
        onToggleBet={mockOnToggleBet}
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    expect(screen.getByText('Lisa')).toBeInTheDocument();
  });

  it('should allow players with coins to place bets', () => {
    render(
      <QuestionDisplay
        question={mockQuestion}
        answererName="Kalle"
        answererId={0}
        players={mockPlayers}
        currentBets={[]}
        onToggleBet={mockOnToggleBet}
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    // Get all bet buttons - there should be 4 (2 per non-answering player)
    const allButtons = screen.getAllByRole('button');
    // Filter to get only the betting buttons (exclude "Visa svar")
    const bettingButtons = allButtons.filter(btn => 
      btn.classList.contains('btn-bet')
    );
    
    // Should have 4 betting buttons total (2 per player: Lisa and Anna)
    expect(bettingButtons).toHaveLength(4);
    
    // First 2 buttons are for Lisa (has 1 coin) - should be enabled
    expect(bettingButtons[0]).not.toBeDisabled();
    expect(bettingButtons[1]).not.toBeDisabled();
    
    // Last 2 buttons are for Anna (has 0 coins) - should be disabled
    expect(bettingButtons[2]).toBeDisabled();
    expect(bettingButtons[3]).toBeDisabled();
    
    // Click Lisa's "Kan" button (first button)
    fireEvent.click(bettingButtons[0]);
    
    expect(mockOnToggleBet).toHaveBeenCalledWith(1, 'can');
  });

  it('should show active state for players who have bet "can"', () => {
    const currentBets: Bet[] = [{ playerId: 1, type: 'can' }];
    
    render(
      <QuestionDisplay
        question={mockQuestion}
        answererName="Kalle"
        answererId={0}
        players={mockPlayers}
        currentBets={currentBets}
        onToggleBet={mockOnToggleBet}
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    // Check that Lisa's "Kan" button shows active state
    const activeButton = screen.getByRole('button', { name: /Du har satsat ett mynt på att Kalle kan frågan/i });
    expect(activeButton).toBeInTheDocument();
    expect(activeButton).toHaveClass('bet-active');
    expect(activeButton).toHaveTextContent('✓ Kan');
  });

  it('should show active state for players who have bet "cannot"', () => {
    const currentBets: Bet[] = [{ playerId: 1, type: 'cannot' }];
    
    render(
      <QuestionDisplay
        question={mockQuestion}
        answererName="Kalle"
        answererId={0}
        players={mockPlayers}
        currentBets={currentBets}
        onToggleBet={mockOnToggleBet}
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    // Check that Lisa's "Kan ej" button shows active state
    const activeButton = screen.getByRole('button', { name: /Du har satsat ett mynt på att Kalle inte kan frågan/i });
    expect(activeButton).toBeInTheDocument();
    expect(activeButton).toHaveClass('bet-active');
    expect(activeButton).toHaveTextContent('✓ Kan ej');
  });
});
