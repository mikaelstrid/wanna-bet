import { describe, it, expect } from 'vitest';
import { 
  generateRoundQuestions, 
  groupQuestionsByCategory, 
  getAgeCategoryFromAge,
  filterQuestionsForPlayer
} from './gameLogic';
import type { Question, Player } from '../types';

describe('Age-based question filtering integration', () => {
  // Create comprehensive test questions covering different ages and time periods
  const testQuestions: Question[] = [
    // Child questions
    { id: 1, rev: 1, question: 'Child Q1', answer: 'A', category: 'geography', level: 'child' },
    { id: 2, rev: 1, question: 'Child Q2', answer: 'A', category: 'nature', level: 'child' },
    
    // Tween questions
    { id: 3, rev: 1, question: 'Tween Q1', answer: 'A', category: 'geography', level: 'tween' },
    { id: 4, rev: 1, question: 'Tween Q2', answer: 'A', category: 'nature', level: 'tween' },
    
    // Young teen questions
    { id: 5, rev: 1, question: 'Young teen Q1', answer: 'A', category: 'geography', level: 'young-teen' },
    { id: 6, rev: 1, question: 'Young teen Q2', answer: 'A', category: 'nature', level: 'young-teen' },
    
    // Old teen questions
    { id: 7, rev: 1, question: 'Old teen Q1', answer: 'A', category: 'geography', level: 'old-teen' },
    { id: 8, rev: 1, question: 'Old teen Q2', answer: 'A', category: 'nature', level: 'old-teen' },
    
    // Adult questions
    { id: 9, rev: 1, question: 'Adult Q1', answer: 'A', category: 'geography', level: 'adult' },
    { id: 10, rev: 1, question: 'Adult Q2', answer: 'A', category: 'nature', level: 'adult' },
    
    // Time-sensitive questions in popculture
    { 
      id: 11,
      rev: 1,
      question: 'Popculture 1980s', 
      answer: 'A', 
      category: 'popculture', 
      level: 'adult',
      start_year: 1980,
      end_year: 1989
    },
    { 
      id: 12,
      rev: 1,
      question: 'Popculture 2000s', 
      answer: 'A', 
      category: 'popculture', 
      level: 'adult',
      start_year: 2000,
      end_year: 2009
    },
    { 
      id: 13,
      rev: 1,
      question: 'Popculture no time', 
      answer: 'A', 
      category: 'popculture', 
      level: 'adult'
    },
    
    // Time-sensitive questions in sports-and-leisure
    { 
      id: 14,
      rev: 1,
      question: 'Sports 1990s', 
      answer: 'A', 
      category: 'sports-and-leisure', 
      level: 'adult',
      start_year: 1990,
      end_year: 1999
    },
    { 
      id: 15,
      rev: 1,
      question: 'Sports 2010s', 
      answer: 'A', 
      category: 'sports-and-leisure', 
      level: 'adult',
      start_year: 2010,
      end_year: 2019
    },
    
    // Time-sensitive questions in technology-and-innovation
    { 
      id: 16,
      rev: 1,
      question: 'Tech 1970s', 
      answer: 'A', 
      category: 'technology-and-innovation', 
      level: 'adult',
      start_year: 1970,
      end_year: 1979
    },
    { 
      id: 17,
      rev: 1,
      question: 'Tech 2020s', 
      answer: 'A', 
      category: 'technology-and-innovation', 
      level: 'adult',
      start_year: 2020,
      end_year: 2024
    },
    
    // Time-sensitive questions in trivia
    { 
      id: 18,
      rev: 1,
      question: 'Trivia 1950s', 
      answer: 'A', 
      category: 'trivia', 
      level: 'adult',
      start_year: 1950,
      end_year: 1959
    },
    { 
      id: 19,
      rev: 1,
      question: 'Trivia 2015', 
      answer: 'A', 
      category: 'trivia', 
      level: 'adult',
      start_year: 2015,
      end_year: 2015
    },
  ];

  it('should filter questions by age category for child player', () => {
    const childPlayer: Player = { name: 'Child', age: 6, coins: 0 };
    const filtered = filterQuestionsForPlayer(testQuestions, childPlayer, 2024);
    
    // Only child questions should be returned
    expect(filtered.every(q => q.level === 'child')).toBe(true);
    expect(filtered.length).toBe(2);
  });

  it('should filter questions by age category for tween player', () => {
    const tweenPlayer: Player = { name: 'Tween', age: 10, coins: 0 };
    const filtered = filterQuestionsForPlayer(testQuestions, tweenPlayer, 2024);
    
    // Only tween questions should be returned
    expect(filtered.every(q => q.level === 'tween')).toBe(true);
    expect(filtered.length).toBe(2);
  });

  it('should filter questions by age category for young teen player', () => {
    const youngTeenPlayer: Player = { name: 'Young Teen', age: 14, coins: 0 };
    const filtered = filterQuestionsForPlayer(testQuestions, youngTeenPlayer, 2024);
    
    // Only young-teen questions should be returned
    expect(filtered.every(q => q.level === 'young-teen')).toBe(true);
    expect(filtered.length).toBe(2);
  });

  it('should filter questions by age category for old teen player', () => {
    const oldTeenPlayer: Player = { name: 'Old Teen', age: 17, coins: 0 };
    const filtered = filterQuestionsForPlayer(testQuestions, oldTeenPlayer, 2024);
    
    // Only old-teen questions should be returned
    expect(filtered.every(q => q.level === 'old-teen')).toBe(true);
    expect(filtered.length).toBe(2);
  });

  it('should filter questions by age and time period for adult born in 1994', () => {
    const adultPlayer: Player = { name: 'Adult', age: 30, coins: 0 };
    const filtered = filterQuestionsForPlayer(testQuestions, adultPlayer, 2024);
    
    // Should get adult-level questions
    expect(filtered.every(q => q.level === 'adult')).toBe(true);
    
    // Should include questions without time period
    expect(filtered.some(q => q.question === 'Adult Q1')).toBe(true);
    expect(filtered.some(q => q.question === 'Adult Q2')).toBe(true);
    expect(filtered.some(q => q.question === 'Popculture no time')).toBe(true);
    
    // Should include time-sensitive questions that overlap (player born 1994, lifetime 1994-2024)
    expect(filtered.some(q => q.question === 'Popculture 2000s')).toBe(true);
    expect(filtered.some(q => q.question === 'Sports 1990s')).toBe(true); // 1990-1999 overlaps with 1994-2024
    expect(filtered.some(q => q.question === 'Sports 2010s')).toBe(true);
    expect(filtered.some(q => q.question === 'Tech 2020s')).toBe(true);
    expect(filtered.some(q => q.question === 'Trivia 2015')).toBe(true);
    
    // Should exclude time-sensitive questions that don't overlap (before birth)
    expect(filtered.some(q => q.question === 'Popculture 1980s')).toBe(false);
    expect(filtered.some(q => q.question === 'Tech 1970s')).toBe(false);
    expect(filtered.some(q => q.question === 'Trivia 1950s')).toBe(false);
  });

  it('should filter questions by age and time period for adult born in 1974', () => {
    const adultPlayer: Player = { name: 'Adult', age: 50, coins: 0 };
    const filtered = filterQuestionsForPlayer(testQuestions, adultPlayer, 2024);
    
    // Should get adult-level questions
    expect(filtered.every(q => q.level === 'adult')).toBe(true);
    
    // Should include time-sensitive questions that overlap (player born 1974, lifetime 1974-2024)
    expect(filtered.some(q => q.question === 'Tech 1970s')).toBe(true); // 1970-1979 overlaps with 1974-2024
    expect(filtered.some(q => q.question === 'Popculture 1980s')).toBe(true);
    expect(filtered.some(q => q.question === 'Sports 1990s')).toBe(true);
    expect(filtered.some(q => q.question === 'Popculture 2000s')).toBe(true);
    expect(filtered.some(q => q.question === 'Tech 2020s')).toBe(true);
    
    // Should exclude questions from before birth
    expect(filtered.some(q => q.question === 'Trivia 1950s')).toBe(false);
  });

  it('should generate round questions with proper filtering for mixed-age players', () => {
    const players: Player[] = [
      { name: 'Child', age: 6, coins: 0 },
      { name: 'Teen', age: 14, coins: 0 },
      { name: 'Adult', age: 30, coins: 0 },
    ];
    
    const grouped = groupQuestionsByCategory(testQuestions);
    const usedQuestions = new Set<string>();
    const roundQuestions = generateRoundQuestions(grouped, usedQuestions, players);
    
    // Should generate 3 questions for 3 players
    expect(roundQuestions).toHaveLength(3);
    
    // Each player should get a question appropriate for their age
    roundQuestions.forEach(rq => {
      const answerer = players[rq.answererId];
      const expectedLevel = getAgeCategoryFromAge(answerer.age);
      expect(rq.question.level).toBe(expectedLevel);
    });
    
    // Each player should be assigned as answerer once
    const answererIds = roundQuestions.map(q => q.answererId);
    expect(new Set(answererIds).size).toBe(3);
  });

  it('should not filter time periods for non-time-sensitive categories', () => {
    const questionsWithOldGeography: Question[] = [
      { 
        id: 500,
        rev: 1,
        question: 'Old geography', 
        answer: 'A', 
        category: 'geography', 
        level: 'adult',
        start_year: 1500,
        end_year: 1600
      },
    ];
    
    const youngPlayer: Player = { name: 'Young', age: 20, coins: 0 };
    const filtered = filterQuestionsForPlayer(questionsWithOldGeography, youngPlayer, 2024);
    
    // Geography is not time-sensitive, so old dates should be accepted
    expect(filtered.length).toBe(1);
    expect(filtered[0].question).toBe('Old geography');
  });

  it('should handle edge case of player born in the same year as question period', () => {
    const questions: Question[] = [
      { 
        id: 501,
        rev: 1,
        question: 'Question 2004', 
        answer: 'A', 
        category: 'popculture', 
        level: 'adult',
        start_year: 2004,
        end_year: 2004
      },
    ];
    
    const player: Player = { name: 'Player', age: 20, coins: 0 }; // Born 2004
    const filtered = filterQuestionsForPlayer(questions, player, 2024);
    
    // Should include question from birth year
    expect(filtered.length).toBe(1);
  });

  it('should handle edge case of question ending in current year', () => {
    const questions: Question[] = [
      { 
        id: 502,
        rev: 1,
        question: 'Recent question', 
        answer: 'A', 
        category: 'sports-and-leisure', 
        level: 'adult',
        start_year: 2020,
        end_year: 2024
      },
    ];
    
    const player: Player = { name: 'Player', age: 20, coins: 0 }; // Born 2004
    const filtered = filterQuestionsForPlayer(questions, player, 2024);
    
    // Should include question ending in current year
    expect(filtered.length).toBe(1);
  });
});
