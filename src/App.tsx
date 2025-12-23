import { useState, useEffect } from 'react';
import './App.css';
import type { GameState, Question, Player, RoundQuestion } from './types';
import { saveGameState, loadGameState, clearGameState } from './utils/storage';
import { generateRoundQuestions, shuffleArray } from './utils/gameLogic';
import WelcomeScreen from './components/WelcomeScreen';
import PlayerRegistration from './components/PlayerRegistration';
import GameBoard from './components/GameBoard';
import QuestionDisplay from './components/QuestionDisplay';
import VictoryScreen from './components/VictoryScreen';
import questionsData from '../data/questions.json';

const WINNING_COINS = 10;

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
      showCorrectAnimation: false,
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
    const shuffled = shuffleArray(questionsData as Question[]);
    const roundQuestions = generateRoundQuestions(shuffled, 0);
    
    setGameState({
      ...gameState,
      screen: 'game',
      players,
      currentRound: 1,
      currentQuestionInRound: 0,
      roundQuestions,
      shuffledQuestions: shuffled,
      questionIndex: 0,
    });
  };

  const handleShowQuestion = () => {
    setGameState({ ...gameState, screen: 'question' });
  };

  const handleAnswerResult = (isCorrect: boolean) => {
    if (isCorrect) {
      // Show animation
      setGameState({ ...gameState, showCorrectAnimation: true });
      
      // Wait for animation, then update score
      setTimeout(() => {
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
            showCorrectAnimation: false,
          });
          return;
        }
        
        moveToNextQuestion(newPlayers);
      }, 1000);
    } else {
      // No animation for incorrect
      moveToNextQuestion(gameState.players);
    }
  };

  const moveToNextQuestion = (updatedPlayers: Player[]) => {
    const nextQuestionInRound = gameState.currentQuestionInRound + 1;
    
    if (nextQuestionInRound >= 4) {
      // Start new round
      const nextQuestionIndex = gameState.questionIndex + 4;
      const newRoundQuestions = generateRoundQuestions(
        gameState.shuffledQuestions,
        nextQuestionIndex
      );
      
      setGameState({
        ...gameState,
        players: updatedPlayers,
        screen: 'game',
        currentRound: gameState.currentRound + 1,
        currentQuestionInRound: 0,
        roundQuestions: newRoundQuestions,
        questionIndex: nextQuestionIndex,
        showCorrectAnimation: false,
      });
    } else {
      // Next question in same round
      setGameState({
        ...gameState,
        players: updatedPlayers,
        screen: 'game',
        currentQuestionInRound: nextQuestionInRound,
        showCorrectAnimation: false,
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
      showCorrectAnimation: false,
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
        onShowQuestion={handleShowQuestion}
      />
    );
  }

  if (gameState.screen === 'question') {
    const currentQuestion = gameState.roundQuestions[gameState.currentQuestionInRound];
    return (
      <QuestionDisplay
        question={currentQuestion.question}
        answererName={gameState.players[currentQuestion.answererId].name}
        showCorrectAnimation={gameState.showCorrectAnimation}
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
