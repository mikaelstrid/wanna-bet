export type QuestionCategory = 
  | 'geography'
  | 'history-and-society'
  | 'popculture'
  | 'nature-science'
  | 'technology-and-innovation'
  | 'trivia'
  | 'sports-and-leisure'
  | 'food-drinks-culture'
  | 'nature'
  | 'logic-and-puzzles';

export interface CategoryInfo {
  name: string;
  emoji: string;
  description: string;
}

export interface Question {
  question: string;
  answer: string;
  category: QuestionCategory;
}

export interface Player {
  name: string;
  coins: number;
}

export interface RoundQuestion {
  question: Question;
  answererId: number;
  askerId: number;
}

export type GameScreen = 'welcome' | 'registration' | 'game' | 'question' | 'victory';

export interface GameState {
  screen: GameScreen;
  players: Player[];
  currentRound: number;
  currentQuestionInRound: number;
  roundQuestions: RoundQuestion[];
  usedQuestions: string[]; // Array of question texts that have been used
  lastScoredPlayerId: number | null;
  currentBets: number[]; // Array of player IDs who have bet on current question
}
