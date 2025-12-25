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

export type QuestionLevel = 'child' | 'tween' | 'young-teen' | 'old-teen' | 'adult';

export interface Question {
  question: string;
  answer: string;
  category: QuestionCategory;
  level: QuestionLevel;
  start_year?: number;
  end_year?: number;
}

export interface Player {
  name: string;
  age: number;
  coins: number;
}

export interface PlayerData {
  name: string;
  age: number;
}

export interface RoundQuestion {
  question: Question;
  answererId: number;
  askerId: number;
}

export type GameScreen = 'welcome' | 'rules' | 'registration' | 'game' | 'question' | 'victory';

export type BetType = 'can' | 'cannot';

export interface Bet {
  playerId: number;
  type: BetType;
}

export interface GameState {
  screen: GameScreen;
  players: Player[];
  currentRound: number;
  currentQuestionInRound: number;
  roundQuestions: RoundQuestion[];
  usedQuestions: string[]; // Array of question texts that have been used
  lastScoredPlayerIds: number[]; // Array of player IDs who scored in the last turn
  currentBets: Bet[]; // Array of bets on current question
}
