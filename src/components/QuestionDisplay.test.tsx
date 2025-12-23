import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionDisplay from './QuestionDisplay';
import type { Question } from '../types';

describe('QuestionDisplay', () => {
  const mockQuestion: Question = {
    question: 'Vad är huvudstaden i Sverige?',
    answer: 'Stockholm',
    category: 'geography'
  };

  const mockOnCorrect = vi.fn();
  const mockOnIncorrect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initially hide the answer', () => {
    render(
      <QuestionDisplay
        currentRound={1}
        question={mockQuestion}
        answererName="Kalle"
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    // Question should be visible
    expect(screen.getByText('Vad är huvudstaden i Sverige?')).toBeInTheDocument();
    
    // Answer should not be visible
    expect(screen.queryByText('Stockholm')).not.toBeInTheDocument();
    
    // "Visa svar" button should be visible
    expect(screen.getByRole('button', { name: /Visa svar/i })).toBeInTheDocument();
    
    // Correct/Incorrect buttons should not be visible
    expect(screen.queryByRole('button', { name: /Rätt/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Fel/i })).not.toBeInTheDocument();
  });

  it('should show the answer when "Visa svar" button is clicked', () => {
    render(
      <QuestionDisplay
        currentRound={1}
        question={mockQuestion}
        answererName="Kalle"
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    // Click "Visa svar" button
    const showAnswerButton = screen.getByRole('button', { name: /Visa svar/i });
    fireEvent.click(showAnswerButton);

    // Answer should now be visible
    expect(screen.getByText('Stockholm')).toBeInTheDocument();
    
    // "Visa svar" button should not be visible
    expect(screen.queryByRole('button', { name: /Visa svar/i })).not.toBeInTheDocument();
    
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
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    // First reveal the answer
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
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    // First reveal the answer
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
        onCorrect={mockOnCorrect}
        onIncorrect={mockOnIncorrect}
      />
    );

    expect(screen.getByText('Runda 3')).toBeInTheDocument();
  });
});
