import { describe, it, expect } from 'vitest';
import { generateRoundQuestions, groupQuestionsByCategory } from './gameLogic';
import type { Question } from '../types';

// Mock questions for testing
const mockQuestions: Question[] = [
  { id: 1, rev: 1, question: 'Question 1', answer: 'Answer 1', category: 'geography', level: 'child' },
  { id: 2, rev: 1, question: 'Question 2', answer: 'Answer 2', category: 'trivia', level: 'child' },
  { id: 3, rev: 1, question: 'Question 3', answer: 'Answer 3', category: 'geography', level: 'tween' },
  { id: 4, rev: 1, question: 'Question 4', answer: 'Answer 4', category: 'trivia', level: 'tween' },
  { id: 5, rev: 1, question: 'Question 5', answer: 'Answer 5', category: 'nature', level: 'young-teen' },
  { id: 6, rev: 1, question: 'Question 6', answer: 'Answer 6', category: 'nature', level: 'young-teen' },
];

describe('groupQuestionsByCategory', () => {
  it('should group questions by category correctly', () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    
    expect(grouped.get('geography')).toHaveLength(2);
    expect(grouped.get('trivia')).toHaveLength(2);
    expect(grouped.get('nature')).toHaveLength(2);
  });
  
  it('should preserve all questions', () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    let totalQuestions = 0;
    
    grouped.forEach(questions => {
      totalQuestions += questions.length;
    });
    
    expect(totalQuestions).toBe(mockQuestions.length);
  });
});

describe('generateRoundQuestions', () => {
  it('should generate exactly 4 questions per round for 4 players', () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const roundQuestions = generateRoundQuestions(grouped, usedQuestions, 4);
    expect(roundQuestions).toHaveLength(4);
  });

  it('should generate exactly 3 questions per round for 3 players', () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const roundQuestions = generateRoundQuestions(grouped, usedQuestions, 3);
    expect(roundQuestions).toHaveLength(3);
  });

  it('should generate exactly 2 questions per round for 2 players', () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const roundQuestions = generateRoundQuestions(grouped, usedQuestions, 2);
    expect(roundQuestions).toHaveLength(2);
  });

  it('should ensure each player (0-3) is assigned as answerer exactly once per round with 4 players', () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const roundQuestions = generateRoundQuestions(grouped, usedQuestions, 4);
    const answererIds = roundQuestions.map(q => q.answererId);
    
    // Check that we have exactly 4 unique answerers
    const uniqueAnswerers = new Set(answererIds);
    expect(uniqueAnswerers.size).toBe(4);
    
    // Check that each player (0-3) appears exactly once
    expect(answererIds.sort()).toEqual([0, 1, 2, 3]);
  });

  it('should ensure each player is assigned as answerer exactly once per round with 3 players', () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const roundQuestions = generateRoundQuestions(grouped, usedQuestions, 3);
    const answererIds = roundQuestions.map(q => q.answererId);
    
    const uniqueAnswerers = new Set(answererIds);
    expect(uniqueAnswerers.size).toBe(3);
    expect(answererIds.sort()).toEqual([0, 1, 2]);
  });

  it('should ensure each player is assigned as answerer exactly once per round with 2 players', () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const roundQuestions = generateRoundQuestions(grouped, usedQuestions, 2);
    const answererIds = roundQuestions.map(q => q.answererId);
    
    const uniqueAnswerers = new Set(answererIds);
    expect(uniqueAnswerers.size).toBe(2);
    expect(answererIds.sort()).toEqual([0, 1]);
  });

  it('should ensure the asker is never the same as the answerer', () => {
    // Run test multiple times to account for randomness, with different player counts
    for (let numPlayers = 2; numPlayers <= 4; numPlayers++) {
      for (let i = 0; i < 50; i++) {
        const grouped = groupQuestionsByCategory(mockQuestions);
        const usedQuestions = new Set<string>();
        const roundQuestions = generateRoundQuestions(grouped, usedQuestions, numPlayers);
        
        roundQuestions.forEach(rq => {
          expect(rq.askerId).not.toBe(rq.answererId);
        });
      }
    }
  });

  it('should ensure askerId is always a valid player index', () => {
    for (let numPlayers = 2; numPlayers <= 4; numPlayers++) {
      const grouped = groupQuestionsByCategory(mockQuestions);
      const usedQuestions = new Set<string>();
      const roundQuestions = generateRoundQuestions(grouped, usedQuestions, numPlayers);
      
      roundQuestions.forEach(rq => {
        expect(rq.askerId).toBeGreaterThanOrEqual(0);
        expect(rq.askerId).toBeLessThan(numPlayers);
      });
    }
  });

  it('should ensure answererId is always a valid player index', () => {
    for (let numPlayers = 2; numPlayers <= 4; numPlayers++) {
      const grouped = groupQuestionsByCategory(mockQuestions);
      const usedQuestions = new Set<string>();
      const roundQuestions = generateRoundQuestions(grouped, usedQuestions, numPlayers);
      
      roundQuestions.forEach(rq => {
        expect(rq.answererId).toBeGreaterThanOrEqual(0);
        expect(rq.answererId).toBeLessThan(numPlayers);
      });
    }
  });

  it('should track used questions and not repeat them', () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    
    // Generate first round
    const roundQuestions1 = generateRoundQuestions(grouped, usedQuestions, 2);
    expect(roundQuestions1).toHaveLength(2);
    expect(usedQuestions.size).toBe(2);
    
    // Generate second round
    const roundQuestions2 = generateRoundQuestions(grouped, usedQuestions, 2);
    expect(roundQuestions2).toHaveLength(2);
    expect(usedQuestions.size).toBe(4);
    
    // Ensure no duplicates across rounds
    const allQuestionTexts = [
      ...roundQuestions1.map(rq => rq.question.question),
      ...roundQuestions2.map(rq => rq.question.question)
    ];
    const uniqueQuestionTexts = new Set(allQuestionTexts);
    expect(uniqueQuestionTexts.size).toBe(4);
  });

  it('should select questions from different categories when possible', () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    
    // Run multiple times to test randomness
    let hasDifferentCategories = false;
    for (let i = 0; i < 20; i++) {
      const roundQuestions = generateRoundQuestions(grouped, usedQuestions, 3);
      const categories = roundQuestions.map(rq => rq.question.category);
      const uniqueCategories = new Set(categories);
      
      // If we get questions from different categories, mark it
      if (uniqueCategories.size > 1) {
        hasDifferentCategories = true;
        break;
      }
    }
    
    expect(hasDifferentCategories).toBe(true);
  });

  it('should assign different askerId and answererId combinations across multiple rounds', () => {
    // Test that randomization works by generating multiple rounds
    const results = [];
    for (let i = 0; i < 10; i++) {
      const grouped = groupQuestionsByCategory(mockQuestions);
      const usedQuestions = new Set<string>();
      const roundQuestions = generateRoundQuestions(grouped, usedQuestions, 4);
      results.push(roundQuestions.map(rq => `${rq.answererId}-${rq.askerId}`).join(','));
    }
    
    // With randomization, we should get at least some different combinations
    const uniqueCombinations = new Set(results);
    expect(uniqueCombinations.size).toBeGreaterThan(1);
  });

  it('should maintain the constraint that asker is never answerer even with repeated calls', () => {
    // Test stability of the constraint over many iterations, with different player counts
    for (let numPlayers = 2; numPlayers <= 4; numPlayers++) {
      for (let iteration = 0; iteration < 25; iteration++) {
        const grouped = groupQuestionsByCategory(mockQuestions);
        const usedQuestions = new Set<string>();
        const roundQuestions = generateRoundQuestions(grouped, usedQuestions, numPlayers);
        
        // Verify correct number of questions
        expect(roundQuestions).toHaveLength(numPlayers);
        
        // Verify the core constraint
        roundQuestions.forEach((rq) => {
          expect(rq.askerId).not.toBe(rq.answererId);
          expect(rq.answererId).toBeGreaterThanOrEqual(0);
          expect(rq.answererId).toBeLessThan(numPlayers);
          expect(rq.askerId).toBeGreaterThanOrEqual(0);
          expect(rq.askerId).toBeLessThan(numPlayers);
        });
      }
    }
  });

  it('should ensure each player is assigned as asker exactly once per round', () => {
    // Test for 4 players
    const grouped4 = groupQuestionsByCategory(mockQuestions);
    const usedQuestions4 = new Set<string>();
    const roundQuestions4 = generateRoundQuestions(grouped4, usedQuestions4, 4);
    const askerIds4 = roundQuestions4.map(q => q.askerId);
    expect(new Set(askerIds4).size).toBe(4);
    expect(askerIds4.sort()).toEqual([0, 1, 2, 3]);
    
    // Test for 3 players
    const grouped3 = groupQuestionsByCategory(mockQuestions);
    const usedQuestions3 = new Set<string>();
    const roundQuestions3 = generateRoundQuestions(grouped3, usedQuestions3, 3);
    const askerIds3 = roundQuestions3.map(q => q.askerId);
    expect(new Set(askerIds3).size).toBe(3);
    expect(askerIds3.sort()).toEqual([0, 1, 2]);
    
    // Test for 2 players
    const grouped2 = groupQuestionsByCategory(mockQuestions);
    const usedQuestions2 = new Set<string>();
    const roundQuestions2 = generateRoundQuestions(grouped2, usedQuestions2, 2);
    const askerIds2 = roundQuestions2.map(q => q.askerId);
    expect(new Set(askerIds2).size).toBe(2);
    expect(askerIds2.sort()).toEqual([0, 1]);
  });

  it('should ensure no player asks and answers the same question with any player count', () => {
    // Run test multiple times to account for randomness, with different player counts
    for (let numPlayers = 2; numPlayers <= 4; numPlayers++) {
      for (let i = 0; i < 50; i++) {
        const grouped = groupQuestionsByCategory(mockQuestions);
        const usedQuestions = new Set<string>();
        const roundQuestions = generateRoundQuestions(grouped, usedQuestions, numPlayers);
        
        // Each player should appear exactly once as asker
        const askerIds = roundQuestions.map(q => q.askerId);
        const uniqueAskers = new Set(askerIds);
        expect(uniqueAskers.size).toBe(numPlayers);
        
        // Each player should appear exactly once as answerer
        const answererIds = roundQuestions.map(q => q.answererId);
        const uniqueAnswerers = new Set(answererIds);
        expect(uniqueAnswerers.size).toBe(numPlayers);
        
        // No one should ask and answer the same question
        roundQuestions.forEach(rq => {
          expect(rq.askerId).not.toBe(rq.answererId);
        });
      }
    }
  });
});
