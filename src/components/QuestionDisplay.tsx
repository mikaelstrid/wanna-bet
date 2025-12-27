import { useState } from "react";
import type { Question, Player, Bet, BetType } from "../types";
import { categoryMetadata } from "../categoryMetadata";
import Coin from "./Coin";
import "./QuestionDisplay.css";

interface QuestionDisplayProps {
  question: Question;
  answererName: string;
  answererId: number;
  players: Player[];
  currentBets: Bet[];
  onToggleBet: (playerId: number, betType: BetType) => void;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export default function QuestionDisplay({
  question,
  answererName,
  answererId,
  players,
  currentBets,
  onToggleBet,
  onCorrect,
  onIncorrect,
}: QuestionDisplayProps) {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const categoryInfo = categoryMetadata[question.category];

  // Get players who can bet (not the answerer)
  const eligibleBettors = players
    .map((player, index) => ({ ...player, id: index }))
    .filter((player) => player.id !== answererId);

  return (
    <div className="question-display">
      <div className="question-display-content">
        <div className="question-card">
          <div className="answerer-info">
            <span className="answerer-name">{answererName}</span>
          </div>

          <div className="category-info">
            <span className="category-emoji">{categoryInfo.emoji}</span>
            <div className="category-text">
              <h3 className="category-name">{categoryInfo.name}</h3>
            </div>
          </div>

          <div className="question-section">
            <h3 className="question-label">Fråga:</h3>
            <p className="question-text">{question.question}</p>
          </div>

          {!isAnswerRevealed && (
            <div
              className="betting-section"
              aria-live="polite"
              aria-atomic="true"
            >
              <h3 className="betting-header">
                Satsa ett <Coin useInText /> på {answererName}
              </h3>
              <div className="betting-players">
                {eligibleBettors.map((player) => {
                  const playerBet = currentBets.find(
                    (bet) => bet.playerId === player.id
                  );
                  const betType = playerBet?.type;

                  return (
                    <div key={player.id} className="betting-player-card">
                      <div className="betting-player-info">
                        <span className="betting-player-name">
                          {player.name}
                        </span>
                      </div>
                      <div className="betting-buttons">
                        <button
                          className={`btn-bet btn-bet-can ${
                            betType === "can" ? "bet-active" : ""
                          }`}
                          onClick={() => onToggleBet(player.id, "can")}
                          disabled={player.coins === 0}
                          aria-label={
                            betType === "can"
                              ? `Du har satsat ett mynt på att ${answererName} kan frågan. Klicka för att ångra satsningen.`
                              : `Satsa ett mynt på att ${answererName} kan frågan.`
                          }
                        >
                          {betType === "can" ? "✓ Kan" : "Kan"}
                        </button>
                        <button
                          className={`btn-bet btn-bet-cannot ${
                            betType === "cannot" ? "bet-active" : ""
                          }`}
                          onClick={() => onToggleBet(player.id, "cannot")}
                          disabled={player.coins === 0}
                          aria-label={
                            betType === "cannot"
                              ? `Du har satsat ett mynt på att ${answererName} inte kan frågan. Klicka för att ångra satsningen.`
                              : `Satsa ett mynt på att ${answererName} inte kan frågan.`
                          }
                        >
                          {betType === "cannot" ? "✓ Kan ej" : "Kan ej"}
                        </button>
                      </div>
                    </div>
                  );
                })}
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
              <button
                className="btn-primary btn-incorrect"
                onClick={onIncorrect}
              >
                ✗ Fel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
