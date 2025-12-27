import { describe, it, expect } from "vitest";
import {
  generateRoundQuestions,
  groupQuestionsByCategory,
  getAgeCategoryFromAge,
  doesTimePeriodOverlapWithLifetime,
  filterQuestionsForPlayer,
} from "./gameLogic";
import type { Question, Player } from "../types";

// Mock questions for testing
const mockQuestions: Question[] = [
  {
    id: 1,
    rev: 1,
    question: "Question 1",
    answer: "Answer 1",
    category: "geography",
    level: "adult",
  },
  {
    id: 2,
    rev: 1,
    question: "Question 2",
    answer: "Answer 2",
    category: "trivia",
    level: "adult",
  },
  {
    id: 3,
    rev: 1,
    question: "Question 3",
    answer: "Answer 3",
    category: "geography",
    level: "adult",
  },
  {
    id: 4,
    rev: 1,
    question: "Question 4",
    answer: "Answer 4",
    category: "trivia",
    level: "adult",
  },
  {
    id: 5,
    rev: 1,
    question: "Question 5",
    answer: "Answer 5",
    category: "nature",
    level: "adult",
  },
  {
    id: 6,
    rev: 1,
    question: "Question 6",
    answer: "Answer 6",
    category: "nature",
    level: "adult",
  },
];

// Mock players for testing
const createMockPlayers = (count: number): Player[] => {
  return Array.from({ length: count }, (_, i) => ({
    name: `Player ${i + 1}`,
    age: 25,
    coins: 0,
  }));
};

describe("groupQuestionsByCategory", () => {
  it("should group questions by category correctly", () => {
    const grouped = groupQuestionsByCategory(mockQuestions);

    expect(grouped.get("geography")).toHaveLength(2);
    expect(grouped.get("trivia")).toHaveLength(2);
    expect(grouped.get("nature")).toHaveLength(2);
  });

  it("should preserve all questions", () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    let totalQuestions = 0;

    grouped.forEach((questions) => {
      totalQuestions += questions.length;
    });

    expect(totalQuestions).toBe(mockQuestions.length);
  });
});

describe("getAgeCategoryFromAge", () => {
  it('should return "child" for ages below 8', () => {
    expect(getAgeCategoryFromAge(0)).toBe("child");
    expect(getAgeCategoryFromAge(4)).toBe("child");
    expect(getAgeCategoryFromAge(5)).toBe("child");
    expect(getAgeCategoryFromAge(6)).toBe("child");
    expect(getAgeCategoryFromAge(7)).toBe("child");
  });

  it('should return "tween" for ages 8-12', () => {
    expect(getAgeCategoryFromAge(8)).toBe("tween");
    expect(getAgeCategoryFromAge(10)).toBe("tween");
    expect(getAgeCategoryFromAge(12)).toBe("tween");
  });

  it('should return "young-teen" for ages 13-15', () => {
    expect(getAgeCategoryFromAge(13)).toBe("young-teen");
    expect(getAgeCategoryFromAge(14)).toBe("young-teen");
    expect(getAgeCategoryFromAge(15)).toBe("young-teen");
  });

  it('should return "old-teen" for ages 16-18', () => {
    expect(getAgeCategoryFromAge(16)).toBe("old-teen");
    expect(getAgeCategoryFromAge(17)).toBe("old-teen");
    expect(getAgeCategoryFromAge(18)).toBe("old-teen");
  });

  it('should return "adult" for ages 19 and above', () => {
    expect(getAgeCategoryFromAge(19)).toBe("adult");
    expect(getAgeCategoryFromAge(25)).toBe("adult");
    expect(getAgeCategoryFromAge(50)).toBe("adult");
    expect(getAgeCategoryFromAge(100)).toBe("adult");
  });
});

describe("doesTimePeriodOverlapWithLifetime", () => {
  it("should accept questions without time period in time-sensitive categories", () => {
    const question: Question = {
      id: 100,
      rev: 1,
      question: "Test",
      answer: "Test",
      category: "popculture",
      level: "adult",
    };
    expect(doesTimePeriodOverlapWithLifetime(question, 30, 2024)).toBe(true);
  });

  it("should accept questions in non-time-sensitive categories regardless of time period", () => {
    const question: Question = {
      id: 101,
      rev: 1,
      question: "Test",
      answer: "Test",
      category: "geography",
      level: "adult",
      start_year: 1800,
      end_year: 1850,
    };
    expect(doesTimePeriodOverlapWithLifetime(question, 30, 2024)).toBe(true);
  });

  it("should accept questions when time period overlaps with player lifetime", () => {
    const question: Question = {
      id: 102,
      rev: 1,
      question: "Test",
      answer: "Test",
      category: "popculture",
      level: "adult",
      start_year: 2000,
      end_year: 2010,
    };
    // Player is 20 years old in 2024, born in 2004, lifetime 2004-2024
    expect(doesTimePeriodOverlapWithLifetime(question, 20, 2024)).toBe(true);
  });

  it("should reject questions when time period is before player lifetime", () => {
    const question: Question = {
      id: 103,
      rev: 1,
      question: "Test",
      answer: "Test",
      category: "popculture",
      level: "adult",
      start_year: 1980,
      end_year: 1990,
    };
    // Player is 20 years old in 2024, born in 2004, lifetime 2004-2024
    expect(doesTimePeriodOverlapWithLifetime(question, 20, 2024)).toBe(false);
  });

  it("should accept questions when time period partially overlaps", () => {
    const question: Question = {
      id: 104,
      rev: 1,
      question: "Test",
      answer: "Test",
      category: "sports-and-leisure",
      level: "adult",
      start_year: 2000,
      end_year: 2010,
    };
    // Player is 30 years old in 2024, born in 1994, lifetime 1994-2024
    expect(doesTimePeriodOverlapWithLifetime(question, 30, 2024)).toBe(true);
  });

  it("should handle questions with only start_year", () => {
    const question: Question = {
      id: 105,
      rev: 1,
      question: "Test",
      answer: "Test",
      category: "technology-and-innovation",
      level: "adult",
      start_year: 2010,
    };
    // Player is 20 years old in 2024, born in 2004
    expect(doesTimePeriodOverlapWithLifetime(question, 20, 2024)).toBe(true);
  });

  it("should handle questions with only end_year", () => {
    const question: Question = {
      id: 106,
      rev: 1,
      question: "Test",
      answer: "Test",
      category: "trivia",
      level: "adult",
      end_year: 2000,
    };
    // Player is 20 years old in 2024, born in 2004
    expect(doesTimePeriodOverlapWithLifetime(question, 20, 2024)).toBe(false);
  });
});

describe("filterQuestionsForPlayer", () => {
  it("should filter questions by age category", () => {
    const questions: Question[] = [
      { id: 200, rev: 1, question: "Q1", answer: "A1", category: "geography", level: "child" },
      { id: 201, rev: 1, question: "Q2", answer: "A2", category: "geography", level: "adult" },
      { id: 202, rev: 1, question: "Q3", answer: "A3", category: "geography", level: "tween" },
    ];
    const player: Player = { name: "Test", age: 6, coins: 0 };

    const filtered = filterQuestionsForPlayer(questions, player);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].level).toBe("child");
  });

  it("should filter questions by time period for time-sensitive categories", () => {
    const questions: Question[] = [
      {
        id: 210,
        rev: 1,
        question: "Q1",
        answer: "A1",
        category: "popculture",
        level: "adult",
        start_year: 1980,
        end_year: 1990,
      },
      {
        id: 211,
        rev: 1,
        question: "Q2",
        answer: "A2",
        category: "popculture",
        level: "adult",
        start_year: 2010,
        end_year: 2020,
      },
    ];
    const player: Player = { name: "Test", age: 20, coins: 0 };

    const filtered = filterQuestionsForPlayer(questions, player, 2024);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].question).toBe("Q2");
  });

  it("should include questions without time period in time-sensitive categories", () => {
    const questions: Question[] = [
      {
        id: 220,
        rev: 1,
        question: "Q1",
        answer: "A1",
        category: "sports-and-leisure",
        level: "adult",
      },
      {
        id: 221,
        rev: 1,
        question: "Q2",
        answer: "A2",
        category: "sports-and-leisure",
        level: "adult",
        start_year: 1980,
        end_year: 1990,
      },
    ];
    const player: Player = { name: "Test", age: 20, coins: 0 };

    const filtered = filterQuestionsForPlayer(questions, player, 2024);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].question).toBe("Q1");
  });

  it("should not filter by time period for non-time-sensitive categories", () => {
    const questions: Question[] = [
      {
        id: 230,
        rev: 1,
        question: "Q1",
        answer: "A1",
        category: "geography",
        level: "adult",
        start_year: 1500,
        end_year: 1600,
      },
    ];
    const player: Player = { name: "Test", age: 20, coins: 0 };

    const filtered = filterQuestionsForPlayer(questions, player, 2024);
    expect(filtered).toHaveLength(1);
  });
});

describe("generateRoundQuestions", () => {
  it("should generate exactly 4 questions per round for 4 players", () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const players = createMockPlayers(4);
    const roundQuestions = generateRoundQuestions(
      grouped,
      usedQuestions,
      players
    );
    expect(roundQuestions).toHaveLength(4);
  });

  it("should generate exactly 3 questions per round for 3 players", () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const players = createMockPlayers(3);
    const roundQuestions = generateRoundQuestions(
      grouped,
      usedQuestions,
      players
    );
    expect(roundQuestions).toHaveLength(3);
  });

  it("should generate exactly 2 questions per round for 2 players", () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const players = createMockPlayers(2);
    const roundQuestions = generateRoundQuestions(
      grouped,
      usedQuestions,
      players
    );
    expect(roundQuestions).toHaveLength(2);
  });

  it("should ensure each player (0-3) is assigned as answerer exactly once per round with 4 players", () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const players = createMockPlayers(4);
    const roundQuestions = generateRoundQuestions(
      grouped,
      usedQuestions,
      players
    );
    const answererIds = roundQuestions.map((q) => q.answererId);

    // Check that we have exactly 4 unique answerers
    const uniqueAnswerers = new Set(answererIds);
    expect(uniqueAnswerers.size).toBe(4);

    // Check that each player (0-3) appears exactly once
    expect(answererIds.sort()).toEqual([0, 1, 2, 3]);
  });

  it("should ensure each player is assigned as answerer exactly once per round with 3 players", () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const players = createMockPlayers(3);
    const roundQuestions = generateRoundQuestions(
      grouped,
      usedQuestions,
      players
    );
    const answererIds = roundQuestions.map((q) => q.answererId);

    const uniqueAnswerers = new Set(answererIds);
    expect(uniqueAnswerers.size).toBe(3);
    expect(answererIds.sort()).toEqual([0, 1, 2]);
  });

  it("should ensure each player is assigned as answerer exactly once per round with 2 players", () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const players = createMockPlayers(2);
    const roundQuestions = generateRoundQuestions(
      grouped,
      usedQuestions,
      players
    );
    const answererIds = roundQuestions.map((q) => q.answererId);

    const uniqueAnswerers = new Set(answererIds);
    expect(uniqueAnswerers.size).toBe(2);
    expect(answererIds.sort()).toEqual([0, 1]);
  });

  it("should ensure the asker is never the same as the answerer", () => {
    // Run test multiple times to account for randomness, with different player counts
    for (let numPlayers = 2; numPlayers <= 4; numPlayers++) {
      for (let i = 0; i < 50; i++) {
        const grouped = groupQuestionsByCategory(mockQuestions);
        const usedQuestions = new Set<string>();
        const players = createMockPlayers(numPlayers);
        const roundQuestions = generateRoundQuestions(
          grouped,
          usedQuestions,
          players
        );

        roundQuestions.forEach((rq) => {
          expect(rq.askerId).not.toBe(rq.answererId);
        });
      }
    }
  });

  it("should ensure askerId is always a valid player index", () => {
    for (let numPlayers = 2; numPlayers <= 4; numPlayers++) {
      const grouped = groupQuestionsByCategory(mockQuestions);
      const usedQuestions = new Set<string>();
      const players = createMockPlayers(numPlayers);
      const roundQuestions = generateRoundQuestions(
        grouped,
        usedQuestions,
        players
      );

      roundQuestions.forEach((rq) => {
        expect(rq.askerId).toBeGreaterThanOrEqual(0);
        expect(rq.askerId).toBeLessThan(numPlayers);
      });
    }
  });

  it("should ensure answererId is always a valid player index", () => {
    for (let numPlayers = 2; numPlayers <= 4; numPlayers++) {
      const grouped = groupQuestionsByCategory(mockQuestions);
      const usedQuestions = new Set<string>();
      const players = createMockPlayers(numPlayers);
      const roundQuestions = generateRoundQuestions(
        grouped,
        usedQuestions,
        players
      );

      roundQuestions.forEach((rq) => {
        expect(rq.answererId).toBeGreaterThanOrEqual(0);
        expect(rq.answererId).toBeLessThan(numPlayers);
      });
    }
  });

  it("should track used questions and not repeat them", () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const players = createMockPlayers(2);

    // Generate first round
    const roundQuestions1 = generateRoundQuestions(
      grouped,
      usedQuestions,
      players
    );
    expect(roundQuestions1).toHaveLength(2);
    expect(usedQuestions.size).toBe(2);

    // Generate second round
    const roundQuestions2 = generateRoundQuestions(
      grouped,
      usedQuestions,
      players
    );
    expect(roundQuestions2).toHaveLength(2);
    expect(usedQuestions.size).toBe(4);

    // Ensure no duplicates across rounds
    const allQuestionTexts = [
      ...roundQuestions1.map((rq) => rq.question.question),
      ...roundQuestions2.map((rq) => rq.question.question),
    ];
    const uniqueQuestionTexts = new Set(allQuestionTexts);
    expect(uniqueQuestionTexts.size).toBe(4);
  });

  it("should select questions from different categories when possible", () => {
    const grouped = groupQuestionsByCategory(mockQuestions);
    const usedQuestions = new Set<string>();
    const players = createMockPlayers(3);

    // Run multiple times to test randomness
    let hasDifferentCategories = false;
    for (let i = 0; i < 20; i++) {
      const roundQuestions = generateRoundQuestions(
        grouped,
        usedQuestions,
        players
      );
      const categories = roundQuestions.map((rq) => rq.question.category);
      const uniqueCategories = new Set(categories);

      // If we get questions from different categories, mark it
      if (uniqueCategories.size > 1) {
        hasDifferentCategories = true;
        break;
      }
    }

    expect(hasDifferentCategories).toBe(true);
  });

  it("should assign different askerId and answererId combinations across multiple rounds", () => {
    // Test that randomization works by generating multiple rounds
    const results = [];
    for (let i = 0; i < 10; i++) {
      const grouped = groupQuestionsByCategory(mockQuestions);
      const usedQuestions = new Set<string>();
      const players = createMockPlayers(4);
      const roundQuestions = generateRoundQuestions(
        grouped,
        usedQuestions,
        players
      );
      results.push(
        roundQuestions.map((rq) => `${rq.answererId}-${rq.askerId}`).join(",")
      );
    }

    // With randomization, we should get at least some different combinations
    const uniqueCombinations = new Set(results);
    expect(uniqueCombinations.size).toBeGreaterThan(1);
  });

  it("should maintain the constraint that asker is never answerer even with repeated calls", () => {
    // Test stability of the constraint over many iterations, with different player counts
    for (let numPlayers = 2; numPlayers <= 4; numPlayers++) {
      for (let iteration = 0; iteration < 25; iteration++) {
        const grouped = groupQuestionsByCategory(mockQuestions);
        const usedQuestions = new Set<string>();
        const players = createMockPlayers(numPlayers);
        const roundQuestions = generateRoundQuestions(
          grouped,
          usedQuestions,
          players
        );

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

  it("should ensure each player is assigned as asker exactly once per round", () => {
    // Test for 4 players
    const grouped4 = groupQuestionsByCategory(mockQuestions);
    const usedQuestions4 = new Set<string>();
    const players4 = createMockPlayers(4);
    const roundQuestions4 = generateRoundQuestions(
      grouped4,
      usedQuestions4,
      players4
    );
    const askerIds4 = roundQuestions4.map((q) => q.askerId);
    expect(new Set(askerIds4).size).toBe(4);
    expect(askerIds4.sort()).toEqual([0, 1, 2, 3]);

    // Test for 3 players
    const grouped3 = groupQuestionsByCategory(mockQuestions);
    const usedQuestions3 = new Set<string>();
    const players3 = createMockPlayers(3);
    const roundQuestions3 = generateRoundQuestions(
      grouped3,
      usedQuestions3,
      players3
    );
    const askerIds3 = roundQuestions3.map((q) => q.askerId);
    expect(new Set(askerIds3).size).toBe(3);
    expect(askerIds3.sort()).toEqual([0, 1, 2]);

    // Test for 2 players
    const grouped2 = groupQuestionsByCategory(mockQuestions);
    const usedQuestions2 = new Set<string>();
    const players2 = createMockPlayers(2);
    const roundQuestions2 = generateRoundQuestions(
      grouped2,
      usedQuestions2,
      players2
    );
    const askerIds2 = roundQuestions2.map((q) => q.askerId);
    expect(new Set(askerIds2).size).toBe(2);
    expect(askerIds2.sort()).toEqual([0, 1]);
  });

  it("should ensure no player asks and answers the same question with any player count", () => {
    // Run test multiple times to account for randomness, with different player counts
    for (let numPlayers = 2; numPlayers <= 4; numPlayers++) {
      for (let i = 0; i < 50; i++) {
        const grouped = groupQuestionsByCategory(mockQuestions);
        const usedQuestions = new Set<string>();
        const players = createMockPlayers(numPlayers);
        const roundQuestions = generateRoundQuestions(
          grouped,
          usedQuestions,
          players
        );

        // Each player should appear exactly once as asker
        const askerIds = roundQuestions.map((q) => q.askerId);
        const uniqueAskers = new Set(askerIds);
        expect(uniqueAskers.size).toBe(numPlayers);

        // Each player should appear exactly once as answerer
        const answererIds = roundQuestions.map((q) => q.answererId);
        const uniqueAnswerers = new Set(answererIds);
        expect(uniqueAnswerers.size).toBe(numPlayers);

        // No one should ask and answer the same question
        roundQuestions.forEach((rq) => {
          expect(rq.askerId).not.toBe(rq.answererId);
        });
      }
    }
  });

  it("should filter questions by player age category", () => {
    const questions: Question[] = [
      {
        id: 300,
        rev: 1,
        question: "Child Q",
        answer: "A",
        category: "geography",
        level: "child",
      },
      {
        id: 301,
        rev: 1,
        question: "Adult Q",
        answer: "A",
        category: "geography",
        level: "adult",
      },
    ];
    const grouped = groupQuestionsByCategory(questions);
    const usedQuestions = new Set<string>();

    // Create players with different ages
    const players: Player[] = [
      { name: "Child Player", age: 6, coins: 0 },
      { name: "Adult Player", age: 25, coins: 0 },
    ];

    const roundQuestions = generateRoundQuestions(
      grouped,
      usedQuestions,
      players
    );

    // Each player should get a question appropriate for their age
    roundQuestions.forEach((rq) => {
      const answerer = players[rq.answererId];
      const expectedLevel = getAgeCategoryFromAge(answerer.age);
      expect(rq.question.level).toBe(expectedLevel);
    });
  });
});
