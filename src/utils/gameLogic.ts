import type { Question, RoundQuestion } from '../types';

// Shuffle array utility
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate round questions with randomized order
export const generateRoundQuestions = (questions: Question[], startIndex: number): RoundQuestion[] => {
  const roundQuestions: RoundQuestion[] = [];
  const answererIndices = shuffleArray([0, 1, 2, 3]);
  const askerIndices = [...answererIndices]; // Start with same order
  
  // Rotate askers by 1 position to ensure no one asks themselves
  // This guarantees each player asks exactly once and never asks themselves
  const rotatedAskers = [
    askerIndices[1],
    askerIndices[2],
    askerIndices[3],
    askerIndices[0]
  ];
  
  for (let i = 0; i < 4; i++) {
    const questionIndex = (startIndex + i) % questions.length;
    
    roundQuestions.push({
      question: questions[questionIndex],
      answererId: answererIndices[i],
      askerId: rotatedAskers[i],
    });
  }
  
  return roundQuestions;
};
