import { useState, useEffect, useMemo } from 'react';
import './App.css';
import type { GameState, Question, Player, BetType, PlayerData } from './types';
import { saveGameState, loadGameState, clearGameState } from './utils/storage';
import { generateRoundQuestions, groupQuestionsByCategory } from './utils/gameLogic';
import { calculateBettingResult } from './utils/bettingLogic';
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
      lastScoredPlayerIds: [],
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

  const handleStartGame = (playerData: PlayerData[]) => {
    const players: Player[] = playerData.map(({ name, age }) => ({ name, age, coins: 0 }));
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
      lastScoredPlayerIds: [],
      currentBets: [],
    });
  };

  const handleShowQuestion = () => {
    setGameState({ ...gameState, screen: 'question', lastScoredPlayerIds: [], currentBets: [] });
  };

  const handleToggleBet = (playerId: number, betType: BetType) => {
    setGameState(prevState => {
      const existingBet = prevState.currentBets.find(bet => bet.playerId === playerId);

      if (existingBet) {
        if (existingBet.type === betType) {
          // Remove bet if clicking the same type
          const updatedBets = prevState.currentBets.filter(bet => bet.playerId !== playerId);
          return { ...prevState, currentBets: updatedBets };
        } else {
          // Change bet type if clicking different type
          const updatedBets = prevState.currentBets.map(bet => 
            bet.playerId === playerId ? { ...bet, type: betType } : bet
          );
          return { ...prevState, currentBets: updatedBets };
        }
      }

      const player = prevState.players[playerId];
      if (!player || player.coins < 1) {
        // Player does not exist or has insufficient coins; no state change
        return prevState;
      }

      // Add new bet
      const updatedBets = [...prevState.currentBets, { playerId, type: betType }];
      return { ...prevState, currentBets: updatedBets };
    });
  };

  const handleAnswerResult = (isCorrect: boolean) => {
    const currentQuestion = gameState.roundQuestions[gameState.currentQuestionInRound];
    
    // Use the utility function to calculate betting result
    const { updatedPlayers, scoredPlayerIds } = calculateBettingResult(
      gameState.players,
      gameState.currentBets,
      currentQuestion.answererId,
      isCorrect
    );
    
    // Check for winner
    const winner = updatedPlayers.find(p => p.coins >= WINNING_COINS);
    if (winner) {
      setGameState({
        ...gameState,
        players: updatedPlayers,
        screen: 'victory',
        lastScoredPlayerIds: [],
        currentBets: [],
      });
      return;
    }
    
    moveToNextQuestion(updatedPlayers, scoredPlayerIds);
  };

  const moveToNextQuestion = (updatedPlayers: Player[], scoredPlayerIds: number[]) => {
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
        lastScoredPlayerIds: scoredPlayerIds,
        currentBets: [],
      });
    } else {
      // Next question in same round
      setGameState({
        ...gameState,
        players: updatedPlayers,
        screen: 'game',
        currentQuestionInRound: nextQuestionInRound,
        lastScoredPlayerIds: scoredPlayerIds,
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
      lastScoredPlayerIds: [],
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
        lastScoredPlayerIds={gameState.lastScoredPlayerIds}
        onShowQuestion={handleShowQuestion}
      />
    );
  }

  if (gameState.screen === 'question') {
    const currentQuestion = gameState.roundQuestions[gameState.currentQuestionInRound];
    return (
      <QuestionDisplay
        key={`${gameState.currentRound}-${gameState.currentQuestionInRound}`}
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
