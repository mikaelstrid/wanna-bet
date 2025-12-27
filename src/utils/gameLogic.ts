import type {
  Question,
  RoundQuestion,
  QuestionCategory,
  QuestionLevel,
  Player,
} from "../types";

// Shuffle array utility
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get age category (QuestionLevel) from player age
// Requirements specify: child (5-7), tween (8-12), young-teen (13-15), old-teen (16-18), adult (19+)
// Ages below 5 are treated as adult as a fallback for edge cases
export const getAgeCategoryFromAge = (age: number): QuestionLevel => {
  if (age >= 5 && age <= 7) return "child";
  if (age >= 8 && age <= 12) return "tween";
  if (age >= 13 && age <= 15) return "young-teen";
  if (age >= 16 && age <= 18) return "old-teen";
  // Ages 19+ and ages below 5 (edge case) are treated as adult
  return "adult";
};

// Categories that require time period filtering
const TIME_PERIOD_CATEGORIES: QuestionCategory[] = [
  "sports-and-leisure",
  "popculture",
  "trivia",
  "technology-and-innovation",
];

// Check if question time period overlaps with player's lifetime
export const doesTimePeriodOverlapWithLifetime = (
  question: Question,
  playerAge: number,
  currentYear: number = new Date().getFullYear()
): boolean => {
  // If category doesn't require time filtering, accept it
  if (!TIME_PERIOD_CATEGORIES.includes(question.category)) {
    return true;
  }

  // If question has no time period specified, accept it
  if (question.start_year === undefined && question.end_year === undefined) {
    return true;
  }

  // Calculate player's birth year and lifetime range
  const birthYear = currentYear - playerAge;
  const playerLifetimeStart = birthYear;
  const playerLifetimeEnd = currentYear;

  // Get question time period, fallback to 0 for start (ancient past) and currentYear for end (present) if missing
  // Note: If neither start_year nor end_year is defined, this function would have already returned true above
  const questionStart = question.start_year ?? 0;
  const questionEnd = question.end_year ?? currentYear;

  // Check if time periods overlap
  return (
    questionEnd >= playerLifetimeStart && questionStart <= playerLifetimeEnd
  );
};

// Filter questions suitable for a specific player
export const filterQuestionsForPlayer = (
  questions: Question[],
  player: Player,
  currentYear: number = new Date().getFullYear()
): Question[] => {
  const playerAgeCategory = getAgeCategoryFromAge(player.age);

  return questions.filter((question) => {
    // Check age category match
    if (question.level !== playerAgeCategory) {
      return false;
    }

    // Check time period overlap
    return doesTimePeriodOverlapWithLifetime(question, player.age, currentYear);
  });
};

// Group questions by category
export const groupQuestionsByCategory = (
  questions: Question[]
): Map<QuestionCategory, Question[]> => {
  const grouped = new Map<QuestionCategory, Question[]>();

  questions.forEach((question) => {
    const category = question.category;
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(question);
  });

  return grouped;
};

// Generate round questions with randomized category selection
export const generateRoundQuestions = (
  questionsByCategory: Map<QuestionCategory, Question[]>,
  usedQuestions: Set<string>,
  players: Player[]
): RoundQuestion[] => {
  const roundQuestions: RoundQuestion[] = [];
  const numPlayers = players.length;
  const playerIndices = Array.from({ length: numPlayers }, (_, i) => i);
  const answererIndices = shuffleArray(playerIndices);
  const askerIndices = [...answererIndices]; // Start with same order

  // Rotate askers by 1 position to ensure no one asks themselves
  // This guarantees each player asks exactly once and never asks themselves
  const rotatedAskers = [...askerIndices.slice(1), askerIndices[0]];

  // Get available categories for a specific player (categories that still have unused questions suitable for them)
  const getAvailableCategoriesForPlayer = (
    player: Player
  ): QuestionCategory[] => {
    const available: QuestionCategory[] = [];
    questionsByCategory.forEach((questions, category) => {
      // Filter questions suitable for this player
      const suitableQuestions = filterQuestionsForPlayer(questions, player);
      const hasUnusedQuestions = suitableQuestions.some(
        (q) => !usedQuestions.has(q.question)
      );
      if (hasUnusedQuestions) {
        available.push(category);
      }
    });
    return available;
  };

  for (let i = 0; i < numPlayers; i++) {
    const answerer = players[answererIndices[i]];
    let availableCategories = getAvailableCategoriesForPlayer(answerer);

    // If we run out of questions, reset used questions and recalculate
    if (availableCategories.length === 0) {
      usedQuestions.clear();
      availableCategories = getAvailableCategoriesForPlayer(answerer);
    }

    // If still no categories available after reset, throw descriptive error
    if (availableCategories.length === 0) {
      throw new Error(
        `No suitable questions available for player ${answerer.name} (age ${answerer.age}, level: ${getAgeCategoryFromAge(answerer.age)}). ` +
          `Please add more questions for this age category.`
      );
    }

    // Randomly select a category
    const randomCategoryIndex = Math.floor(
      Math.random() * availableCategories.length
    );
    const selectedCategory = availableCategories[randomCategoryIndex];

    // Get all questions from selected category
    const categoryQuestions = questionsByCategory.get(selectedCategory)!;

    // Filter questions suitable for this player
    const suitableQuestions = filterQuestionsForPlayer(
      categoryQuestions,
      answerer
    );

    // Get unused suitable questions
    const unusedQuestions = suitableQuestions.filter(
      (q) => !usedQuestions.has(q.question)
    );

    // If no unused questions in this category, reuse suitable questions
    // This can happen when all suitable questions have been used but questions were reset
    const questionsToChooseFrom =
      unusedQuestions.length > 0 ? unusedQuestions : suitableQuestions;

    if (unusedQuestions.length === 0 && suitableQuestions.length > 0) {
      console.warn(
        `All suitable questions in category ${selectedCategory} have been used for player ${answerer.name} (age ${answerer.age}). Reusing questions from this pool. ` +
          `If repeated questions are undesirable, consider adding more questions for this category and age group so the pool does not exhaust as quickly.`
      );
    }

    // Randomly select a question from the category
    const randomQuestionIndex = Math.floor(
      Math.random() * questionsToChooseFrom.length
    );
    const selectedQuestion = questionsToChooseFrom[randomQuestionIndex];

    // Mark question as used
    usedQuestions.add(selectedQuestion.question);

    roundQuestions.push({
      question: selectedQuestion,
      answererId: answererIndices[i],
      askerId: rotatedAskers[i],
    });
  }

  return roundQuestions;
};
