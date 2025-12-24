import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionDisplay from './QuestionDisplay';
import type { Question, Player } from '../types';

describe('QuestionDisplay', () => {
  const mockQuestion: Question = {
    question: 'Vad är huvudstaden i Sverige?',
    answer: 'Stockholm',
    category: 'geography'
  };

  const mockPlayers: Player[] = [
    { name: 'Kalle', coins: 2 },
    { name: 'Lisa', coins: 1 },
    { name: 'Anna', coins: 0 }
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
        currentRound={1}
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
    
    // Betting section should be visible
    expect(screen.getByText(/Satsa ett 🪙 på att Kalle inte klarar frågan/i)).toBeInTheDocument();
    
    // Non-answering players should be shown
    expect(screen.getByText('Lisa')).toBeInTheDocument();
    expect(screen.getByText('Anna')).toBeInTheDocument();
    
    // Answer should not be visible
    expect(screen.queryByText('Stockholm')).not.toBeInTheDocument();
    
    // "Fortsätt" button should be visible
    expect(screen.getByRole('button', { name: /Fortsätt/i })).toBeInTheDocument();
  });

  it('should show the answer when "Visa svar" button is clicked after betting phase', () => {
    render(
      <QuestionDisplay
        currentRound={1}
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

    // Click "Fortsätt" to exit betting phase
    const continueButton = screen.getByRole('button', { name: /Fortsätt/i });
    fireEvent.click(continueButton);

    // Click "Visa svar" button
    const showAnswerButton = screen.getByRole('button', { name: /Visa svar/i });
    fireEvent.click(showAnswerButton);

    // Answer should now be visible
    expect(screen.getByText('Stockholm')).toBeInTheDocument();
    
    // Correct/Incorrect buttons should be visible
    expect(screen.getByRole('button', { name: /Rätt/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fel/i })).toBeInTheDocument();
  });

  it('should call onCorrect when "Rätt" button is clicked', () => {
    render(
      <QuestionDisplay
        currentRound={1}
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

    // Skip betting phase
    const continueButton = screen.getByRole('button', { name: /Fortsätt/i });
    fireEvent.click(continueButton);

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
        currentRound={1}
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

    // Skip betting phase
    const continueButton = screen.getByRole('button', { name: /Fortsätt/i });
    fireEvent.click(continueButton);

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
        currentRound={1}
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

  it('should display the correct round number', () => {
    render(
      <QuestionDisplay
        currentRound={3}
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

    expect(screen.getByText('Runda 3')).toBeInTheDocument();
  });

  it('should allow players with coins to place bets', () => {
    render(
      <QuestionDisplay
        currentRound={1}
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

    // Get all bet buttons
    const betButtons = screen.getAllByRole('button', { name: /Satsa/i });
    
    // Lisa's button (has 1 coin) should be enabled
    expect(betButtons[0]).not.toBeDisabled();
    
    // Anna's button (has 0 coins) should be disabled
    expect(betButtons[1]).toBeDisabled();
    
    // Click Lisa's bet button
    fireEvent.click(betButtons[0]);
    
    expect(mockOnToggleBet).toHaveBeenCalledWith(1);
  });

  it('should show active state for players who have bet', () => {
    render(
      <QuestionDisplay
        currentRound={1}
        question={mockQuestion}
        answererName="Kalle"
        answererId={0}
        players={mockPlayers}
        currentBets={[1]}
        onToggleBet={mockOnToggleBet}
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    // Check that Lisa's bet button shows active state
    const activeBetButton = screen.getByRole('button', { name: /Satsat/i });
    expect(activeBetButton).toBeInTheDocument();
    expect(activeBetButton).toHaveClass('bet-active');
  });
});
