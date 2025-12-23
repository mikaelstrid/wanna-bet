import { describe, it, expect } from 'vitest';
import { generateRoundQuestions } from './gameLogic';
import type { Question } from '../types';

// Mock questions for testing
const mockQuestions: Question[] = [
  { question: 'Question 1', answer: 'Answer 1', category: 'geography' },
  { question: 'Question 2', answer: 'Answer 2', category: 'geography' },
  { question: 'Question 3', answer: 'Answer 3', category: 'geography' },
  { question: 'Question 4', answer: 'Answer 4', category: 'geography' },
  { question: 'Question 5', answer: 'Answer 5', category: 'geography' },
];

describe('generateRoundQuestions', () => {
  it('should generate exactly 4 questions per round', () => {
    const roundQuestions = generateRoundQuestions(mockQuestions, 0);
    expect(roundQuestions).toHaveLength(4);
  });

  it('should ensure each player (0-3) is assigned as answerer exactly once per round', () => {
    const roundQuestions = generateRoundQuestions(mockQuestions, 0);
    const answererIds = roundQuestions.map(q => q.answererId);
    
    // Check that we have exactly 4 unique answerers
    const uniqueAnswerers = new Set(answererIds);
    expect(uniqueAnswerers.size).toBe(4);
    
    // Check that each player (0-3) appears exactly once
    expect(answererIds.sort()).toEqual([0, 1, 2, 3]);
  });

  it('should ensure the asker is never the same as the answerer', () => {
    // Run test multiple times to account for randomness
    for (let i = 0; i < 100; i++) {
      const roundQuestions = generateRoundQuestions(mockQuestions, 0);
      
      roundQuestions.forEach(rq => {
        expect(rq.askerId).not.toBe(rq.answererId);
      });
    }
  });

  it('should ensure askerId is always a valid player index (0-3)', () => {
    const roundQuestions = generateRoundQuestions(mockQuestions, 0);
    
    roundQuestions.forEach(rq => {
      expect(rq.askerId).toBeGreaterThanOrEqual(0);
      expect(rq.askerId).toBeLessThanOrEqual(3);
    });
  });

  it('should ensure answererId is always a valid player index (0-3)', () => {
    const roundQuestions = generateRoundQuestions(mockQuestions, 0);
    
    roundQuestions.forEach(rq => {
      expect(rq.answererId).toBeGreaterThanOrEqual(0);
      expect(rq.answererId).toBeLessThanOrEqual(3);
    });
  });

  it('should use questions starting from the provided startIndex', () => {
    const roundQuestions = generateRoundQuestions(mockQuestions, 2);
    
    // Should get questions at indices 2, 3, 4, 0 (wraps around)
    const usedQuestions = roundQuestions.map(rq => rq.question);
    const expectedQuestions = [
      mockQuestions[2],
      mockQuestions[3],
      mockQuestions[4],
      mockQuestions[0],
    ];
    
    expect(usedQuestions).toEqual(expectedQuestions);
  });

  it('should wrap around to the beginning when reaching the end of questions array', () => {
    const roundQuestions = generateRoundQuestions(mockQuestions, 4);
    
    // Should get questions at indices 4, 0, 1, 2 (wraps around from index 4)
    const usedQuestions = roundQuestions.map(rq => rq.question);
    const expectedQuestions = [
      mockQuestions[4],
      mockQuestions[0],
      mockQuestions[1],
      mockQuestions[2],
    ];
    
    expect(usedQuestions).toEqual(expectedQuestions);
  });

  it('should assign different askerId and answererId combinations across multiple rounds', () => {
    // Test that randomization works by generating multiple rounds
    const results = [];
    for (let i = 0; i < 10; i++) {
      const roundQuestions = generateRoundQuestions(mockQuestions, 0);
      results.push(roundQuestions.map(rq => `${rq.answererId}-${rq.askerId}`).join(','));
    }
    
    // With randomization, we should get at least some different combinations
    const uniqueCombinations = new Set(results);
    expect(uniqueCombinations.size).toBeGreaterThan(1);
  });

  it('should maintain the constraint that asker is never answerer even with repeated calls', () => {
    // Test stability of the constraint over many iterations
    for (let iteration = 0; iteration < 50; iteration++) {
      const roundQuestions = generateRoundQuestions(mockQuestions, iteration);
      
      // Verify all 4 questions in the round
      expect(roundQuestions).toHaveLength(4);
      
      // Verify the core constraint
      roundQuestions.forEach((rq) => {
        expect(rq.askerId).not.toBe(rq.answererId);
        expect(rq.answererId).toBeGreaterThanOrEqual(0);
        expect(rq.answererId).toBeLessThanOrEqual(3);
        expect(rq.askerId).toBeGreaterThanOrEqual(0);
        expect(rq.askerId).toBeLessThanOrEqual(3);
      });
    }
  });

  it('should ensure each player (0-3) is assigned as asker exactly once per round', () => {
    const roundQuestions = generateRoundQuestions(mockQuestions, 0);
    const askerIds = roundQuestions.map(q => q.askerId);
    
    // Check that we have exactly 4 unique askers
    const uniqueAskers = new Set(askerIds);
    expect(uniqueAskers.size).toBe(4);
    
    // Check that each player (0-3) appears exactly once as asker
    expect(askerIds.sort()).toEqual([0, 1, 2, 3]);
  });

  it('should ensure no player asks and answers the same question', () => {
    // Run test multiple times to account for randomness
    for (let i = 0; i < 100; i++) {
      const roundQuestions = generateRoundQuestions(mockQuestions, 0);
      
      // Each player should appear exactly once as asker
      const askerIds = roundQuestions.map(q => q.askerId);
      const uniqueAskers = new Set(askerIds);
      expect(uniqueAskers.size).toBe(4);
      
      // Each player should appear exactly once as answerer
      const answererIds = roundQuestions.map(q => q.answererId);
      const uniqueAnswerers = new Set(answererIds);
      expect(uniqueAnswerers.size).toBe(4);
      
      // No one should ask and answer the same question
      roundQuestions.forEach(rq => {
        expect(rq.askerId).not.toBe(rq.answererId);
      });
    }
  });
});
