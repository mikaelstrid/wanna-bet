import { useState, useEffect, useMemo } from 'react';
import './App.css';
import type { GameState, Question, Player } from './types';
import { saveGameState, loadGameState, clearGameState } from './utils/storage';
import { generateRoundQuestions, groupQuestionsByCategory } from './utils/gameLogic';
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
      usedQuestions: [],
      lastScoredPlayerId: null,
      currentBets: [],
    };
  });

  // Group questions by category (memoized)
  const questionsByCategory = useMemo(() => groupQuestionsByCategory(questionsData), []);

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
    const usedQuestions = new Set<string>();
    const roundQuestions = generateRoundQuestions(questionsByCategory, usedQuestions, players.length);
    
    setGameState({
      ...gameState,
      screen: 'game',
      players,
      currentRound: 1,
      currentQuestionInRound: 0,
      roundQuestions,
      usedQuestions: Array.from(usedQuestions),
      lastScoredPlayerId: null,
      currentBets: [],
    });
  };

  const handleShowQuestion = () => {
    setGameState({ ...gameState, screen: 'question', lastScoredPlayerId: null, currentBets: [] });
  };

  const handleToggleBet = (playerId: number) => {
    const currentBets = [...gameState.currentBets];
    const betIndex = currentBets.indexOf(playerId);
    
    if (betIndex >= 0) {
      // Remove bet
      currentBets.splice(betIndex, 1);
      setGameState({ ...gameState, currentBets });
    } else if (gameState.players[playerId].coins >= 1) {
      // Add bet - validate player has at least 1 coin
      currentBets.push(playerId);
      setGameState({ ...gameState, currentBets });
    }
  };

  const handleAnswerResult = (isCorrect: boolean) => {
    const currentQuestion = gameState.roundQuestions[gameState.currentQuestionInRound];
    const newPlayers = [...gameState.players];
    
    if (isCorrect) {
      // Answerer gets 1 coin plus all bet coins
      const betCoins = gameState.currentBets.length;
      newPlayers[currentQuestion.answererId].coins += 1 + betCoins;
      
      // Betting players lose their bet coins
      gameState.currentBets.forEach(playerId => {
        newPlayers[playerId].coins -= 1;
      });
      
      // Check for winner
      const winner = newPlayers.find(p => p.coins >= WINNING_COINS);
      if (winner) {
        setGameState({
          ...gameState,
          players: newPlayers,
          screen: 'victory',
          lastScoredPlayerId: null,
          currentBets: [],
        });
        return;
      }
      
      moveToNextQuestion(newPlayers, currentQuestion.answererId);
    } else {
      // Betting players get their coin back plus 1 extra
      gameState.currentBets.forEach(playerId => {
        newPlayers[playerId].coins += 2;
      });
      
      // Check if any betting player won
      const winner = newPlayers.find(p => p.coins >= WINNING_COINS);
      if (winner) {
        setGameState({
          ...gameState,
          players: newPlayers,
          screen: 'victory',
          lastScoredPlayerId: null,
          currentBets: [],
        });
        return;
      }
      
      moveToNextQuestion(newPlayers, null);
    }
  };

  const moveToNextQuestion = (updatedPlayers: Player[], scoredPlayerId: number | null) => {
    const nextQuestionInRound = gameState.currentQuestionInRound + 1;
    const numPlayers = gameState.players.length;
    
    if (nextQuestionInRound >= numPlayers) {
      // Start new round
      const usedQuestions = new Set<string>(gameState.usedQuestions);
      const newRoundQuestions = generateRoundQuestions(
        questionsByCategory,
        usedQuestions,
        numPlayers
      );
      
      setGameState({
        ...gameState,
        players: updatedPlayers,
        screen: 'game',
        currentRound: gameState.currentRound + 1,
        currentQuestionInRound: 0,
        roundQuestions: newRoundQuestions,
        usedQuestions: Array.from(usedQuestions),
        lastScoredPlayerId: scoredPlayerId,
        currentBets: [],
      });
    } else {
      // Next question in same round
      setGameState({
        ...gameState,
        players: updatedPlayers,
        screen: 'game',
        currentQuestionInRound: nextQuestionInRound,
        lastScoredPlayerId: scoredPlayerId,
        currentBets: [],
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
      usedQuestions: [],
      lastScoredPlayerId: null,
      currentBets: [],
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
        key={`${gameState.currentRound}-${gameState.currentQuestionInRound}`}
        currentRound={gameState.currentRound}
        question={currentQuestion.question}
        answererName={gameState.players[currentQuestion.answererId].name}
        answererId={currentQuestion.answererId}
        players={gameState.players}
        currentBets={gameState.currentBets}
        onToggleBet={handleToggleBet}
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
