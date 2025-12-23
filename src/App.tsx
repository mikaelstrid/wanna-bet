import { useState, useEffect } from 'react';
import './App.css';
import type { GameState, Question, Player } from './types';
import { saveGameState, loadGameState, clearGameState } from './utils/storage';
import { generateRoundQuestions, shuffleArray } from './utils/gameLogic';
import WelcomeScreen from './components/WelcomeScreen';
import PlayerRegistration from './components/PlayerRegistration';
import GameBoard from './components/GameBoard';
import QuestionDisplay from './components/QuestionDisplay';
import VictoryScreen from './components/VictoryScreen';
import geographyQuestions from '../data/geography.json';
import historyQuestions from '../data/history-and-society.json';
import popcultureQuestions from '../data/popculture.json';
import natureScienceQuestions from '../data/nature-science.json';
import technologyQuestions from '../data/technology-and-innovation.json';
import triviaQuestions from '../data/trivia.json';
import sportsQuestions from '../data/sports-and-leisure.json';
import foodQuestions from '../data/food-drinks-culture.json';
import natureQuestions from '../data/nature.json';
import logicQuestions from '../data/logic-and-puzzles.json';

// Combine all questions from different categories
const questionsData = [
  ...geographyQuestions,
  ...historyQuestions,
  ...popcultureQuestions,
  ...natureScienceQuestions,
  ...technologyQuestions,
  ...triviaQuestions,
  ...sportsQuestions,
  ...foodQuestions,
  ...natureQuestions,
  ...logicQuestions,
] as Question[];

const WINNING_COINS = 3;

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGameState();
    return saved || {
      screen: 'welcome',
      players: [],
      currentRound: 0,
      currentQuestionInRound: 0,
      roundQuestions: [],
      shuffledQuestions: [],
      questionIndex: 0,
      lastScoredPlayerId: null,
    };
  });

  // Save to localStorage whenever game state changes
  useEffect(() => {
    if (gameState.screen !== 'welcome') {
      saveGameState(gameState);
    }
  }, [gameState]);

  const handleStart = () => {
    setGameState({ ...gameState, screen: 'registration' });
  };

  const handleStartGame = (playerNames: string[]) => {
    const players: Player[] = playerNames.map(name => ({ name, coins: 0 }));
    const shuffled = shuffleArray(questionsData);
    const roundQuestions = generateRoundQuestions(shuffled, 0, players.length);
    
    setGameState({
      ...gameState,
      screen: 'game',
      players,
      currentRound: 1,
      currentQuestionInRound: 0,
      roundQuestions,
      shuffledQuestions: shuffled,
      questionIndex: 0,
      lastScoredPlayerId: null,
    });
  };

  const handleShowQuestion = () => {
    setGameState({ ...gameState, screen: 'question', lastScoredPlayerId: null });
  };

  const handleAnswerResult = (isCorrect: boolean) => {
    if (isCorrect) {
      const currentQuestion = gameState.roundQuestions[gameState.currentQuestionInRound];
      const newPlayers = [...gameState.players];
      newPlayers[currentQuestion.answererId].coins += 1;
      
      // Check for winner
      const winner = newPlayers.find(p => p.coins >= WINNING_COINS);
      if (winner) {
        setGameState({
          ...gameState,
          players: newPlayers,
          screen: 'victory',
          lastScoredPlayerId: null,
        });
        return;
      }
      
      moveToNextQuestion(newPlayers, currentQuestion.answererId);
    } else {
      moveToNextQuestion(gameState.players, null);
    }
  };

  const moveToNextQuestion = (updatedPlayers: Player[], scoredPlayerId: number | null) => {
    const nextQuestionInRound = gameState.currentQuestionInRound + 1;
    const numPlayers = gameState.players.length;
    
    if (nextQuestionInRound >= numPlayers) {
      // Start new round
      const nextQuestionIndex = gameState.questionIndex + numPlayers;
      const newRoundQuestions = generateRoundQuestions(
        gameState.shuffledQuestions,
        nextQuestionIndex,
        numPlayers
      );
      
      setGameState({
        ...gameState,
        players: updatedPlayers,
        screen: 'game',
        currentRound: gameState.currentRound + 1,
        currentQuestionInRound: 0,
        roundQuestions: newRoundQuestions,
        questionIndex: nextQuestionIndex,
        lastScoredPlayerId: scoredPlayerId,
      });
    } else {
      // Next question in same round
      setGameState({
        ...gameState,
        players: updatedPlayers,
        screen: 'game',
        currentQuestionInRound: nextQuestionInRound,
        lastScoredPlayerId: scoredPlayerId,
      });
    }
  };

  const handleRestart = () => {
    clearGameState();
    setGameState({
      screen: 'welcome',
      players: [],
      currentRound: 0,
      currentQuestionInRound: 0,
      roundQuestions: [],
      shuffledQuestions: [],
      questionIndex: 0,
      lastScoredPlayerId: null,
    });
  };

  // Render appropriate screen
  if (gameState.screen === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (gameState.screen === 'registration') {
    return <PlayerRegistration onStartGame={handleStartGame} />;
  }

  if (gameState.screen === 'game') {
    const currentQuestion = gameState.roundQuestions[gameState.currentQuestionInRound];
    return (
      <GameBoard
        players={gameState.players}
        currentRound={gameState.currentRound}
        answererName={gameState.players[currentQuestion.answererId].name}
        askerName={gameState.players[currentQuestion.askerId].name}
        lastScoredPlayerId={gameState.lastScoredPlayerId}
        onShowQuestion={handleShowQuestion}
      />
    );
  }

  if (gameState.screen === 'question') {
    const currentQuestion = gameState.roundQuestions[gameState.currentQuestionInRound];
    return (
      <QuestionDisplay
        currentRound={gameState.currentRound}
        question={currentQuestion.question}
        answererName={gameState.players[currentQuestion.answererId].name}
        onCorrect={() => handleAnswerResult(true)}
        onIncorrect={() => handleAnswerResult(false)}
      />
    );
  }

  if (gameState.screen === 'victory') {
    const winner = gameState.players.reduce((prev, current) => 
      current.coins > prev.coins ? current : prev
    );
    return (
      <VictoryScreen
        winner={winner}
        allPlayers={gameState.players}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}

export default App;
