import { useState } from 'react';
import type { Question, Player } from '../types';
import { categoryMetadata } from '../categoryMetadata';
import './QuestionDisplay.css';

interface QuestionDisplayProps {
  currentRound: number;
  question: Question;
  answererName: string;
  answererId: number;
  players: Player[];
  currentBets: number[];
  onToggleBet: (playerId: number) => void;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export default function QuestionDisplay({
  currentRound, 
  question, 
  answererName,
  answererId,
  players,
  currentBets,
  onToggleBet,
  onCorrect, 
  onIncorrect 
}: QuestionDisplayProps) {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const categoryInfo = categoryMetadata[question.category];
  
  // Get players who can bet (not the answerer)
  const eligibleBettors = players
    .map((player, index) => ({ ...player, id: index }))
    .filter(player => player.id !== answererId);
  
  return (
    <div className="question-display">
      <div className="question-display-content">
        <div className="question-card">
          <div className="round-info">
            <h2>Runda {currentRound}</h2>
          </div>

          <div className="category-info">
            <span className="category-emoji">{categoryInfo.emoji}</span>
            <div className="category-text">
              <h3 className="category-name">{categoryInfo.name}</h3>
            </div>
          </div>

          <div className="answerer-info">
            <span className="answerer-name">{answererName}</span>
          </div>
          
          <div className="question-section">
            <h3 className="question-label">Fråga:</h3>
            <p className="question-text">{question.question}</p>
          </div>
          
          {!isAnswerRevealed && (
            <div className="betting-section">
              <h3 className="betting-header">Satsa ett 🪙 på att {answererName} inte klarar frågan</h3>
              <div className="betting-players">
                {eligibleBettors.map(player => (
                  <div key={player.id} className="betting-player-card">
                    <div className="betting-player-info">
                      <span className="betting-player-name">{player.name}</span>
                      <span className="betting-player-coins">🪙 {player.coins}</span>
                    </div>
                    <button
                      className={`btn-bet ${currentBets.includes(player.id) ? 'bet-active' : ''}`}
                      onClick={() => onToggleBet(player.id)}
                      disabled={player.coins === 0}
                    >
                      {currentBets.includes(player.id) ? '✓ Satsat' : 'Satsa'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {isAnswerRevealed && (
            <div className="answer-section">
              <h3 className="answer-label">Svar:</h3>
              <p className="answer-text">{question.answer}</p>
            </div>
          )}
        </div>
        
        <div className="action-buttons">
          {!isAnswerRevealed ? (
            <button 
              className="btn-primary btn-show-answer" 
              onClick={() => setIsAnswerRevealed(true)}
            >
              Visa svar
            </button>
          ) : (
            <>
              <button className="btn-primary btn-correct" onClick={onCorrect}>
                ✓ Rätt
              </button>
              <button className="btn-primary btn-incorrect" onClick={onIncorrect}>
                ✗ Fel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
