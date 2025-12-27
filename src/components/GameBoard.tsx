import type { Player } from "../types";
import Coin from "./Coin";
import "./GameBoard.css";

interface GameBoardProps {
  players: Player[];
  currentRound: number;
  answererName: string;
  askerName: string;
  lastScoredPlayerIds: number[];
  lastLostCoinPlayerIds: number[];
  onShowQuestion: () => void;
}

export default function GameBoard({
  players,
  currentRound,
  answererName,
  askerName,
  lastScoredPlayerIds,
  lastLostCoinPlayerIds,
  onShowQuestion,
}: GameBoardProps) {
  return (
    <div className="game-board">
      <div className="game-board-content">
        <div className="round-info">
          <h2>Runda {currentRound}</h2>
        </div>

        <div className="players-grid">
          {players.map((player, index) => (
            <div key={index} className="player-card">
              <div className="player-name">{player.name}</div>
              <div className="coins">
                <span
                  className={`coin-icon ${
                    lastScoredPlayerIds.includes(index)
                      ? "coin-spin"
                      : lastLostCoinPlayerIds.includes(index)
                        ? "coin-shake"
                        : ""
                  }`}
                >
                  <Coin decorative />
                </span>
                <span
                  className={`coin-count ${
                    lastScoredPlayerIds.includes(index)
                      ? "count-up"
                      : lastLostCoinPlayerIds.includes(index)
                        ? "count-down"
                        : ""
                  }`}
                >
                  {player.coins}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="turn-info">
          <div className="turn-card">
            <div className="turn-label answerer-label">Nästa spelare</div>
            <div className="turn-player answerer">{answererName}</div>
          </div>

          <div className="turn-card">
            <div className="turn-label">Frågeställare</div>
            <div className="turn-player asker">{askerName}</div>
          </div>
        </div>

        <button className="btn-primary" onClick={onShowQuestion}>
          Visa fråga
        </button>
      </div>
    </div>
  );
}
