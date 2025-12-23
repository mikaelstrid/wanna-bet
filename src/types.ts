export type QuestionCategory = 'geography';

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
  shuffledQuestions: Question[];
  questionIndex: number;
  lastScoredPlayerId: number | null;
}
