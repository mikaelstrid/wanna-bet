import type { Question, RoundQuestion, QuestionCategory } from '../types';

// Shuffle array utility
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Group questions by category
export const groupQuestionsByCategory = (questions: Question[]): Map<QuestionCategory, Question[]> => {
  const grouped = new Map<QuestionCategory, Question[]>();
  
  questions.forEach(question => {
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
  numPlayers: number
): RoundQuestion[] => {
  const roundQuestions: RoundQuestion[] = [];
  const playerIndices = Array.from({ length: numPlayers }, (_, i) => i);
  const answererIndices = shuffleArray(playerIndices);
  const askerIndices = [...answererIndices]; // Start with same order
  
  // Rotate askers by 1 position to ensure no one asks themselves
  // This guarantees each player asks exactly once and never asks themselves
  const rotatedAskers = [...askerIndices.slice(1), askerIndices[0]];
  
  // Get available categories (categories that still have unused questions)
  const getAvailableCategories = (): QuestionCategory[] => {
    const available: QuestionCategory[] = [];
    questionsByCategory.forEach((questions, category) => {
      const hasUnusedQuestions = questions.some(q => !usedQuestions.has(q.question));
      if (hasUnusedQuestions) {
        available.push(category);
      }
    });
    return available;
  };
  
  for (let i = 0; i < numPlayers; i++) {
    let availableCategories = getAvailableCategories();
    
    // If we run out of questions, reset used questions and recalculate
    if (availableCategories.length === 0) {
      usedQuestions.clear();
      availableCategories = getAvailableCategories();
    }
    
    // Randomly select a category
    const randomCategoryIndex = Math.floor(Math.random() * availableCategories.length);
    const selectedCategory = availableCategories[randomCategoryIndex];
    
    // Get unused questions from selected category
    const categoryQuestions = questionsByCategory.get(selectedCategory)!;
    const unusedQuestions = categoryQuestions.filter(q => !usedQuestions.has(q.question));
    
    // If no unused questions in this category (shouldn't happen), use any question
    const questionsToChooseFrom = unusedQuestions.length > 0 ? unusedQuestions : categoryQuestions;
    
    // Randomly select a question from the category
    const randomQuestionIndex = Math.floor(Math.random() * questionsToChooseFrom.length);
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
