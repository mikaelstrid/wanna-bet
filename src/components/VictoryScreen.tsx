import type { Player } from '../types';
import Coin from './Coin';
import './VictoryScreen.css';

interface VictoryScreenProps {
  winner: Player;
  allPlayers: Player[];
  onRestart: () => void;
}

export default function VictoryScreen({ winner, allPlayers, onRestart }: VictoryScreenProps) {
  // Sort players by coins (descending)
  const sortedPlayers = [...allPlayers].sort((a, b) => b.coins - a.coins);
  
  return (
    <div className="victory-screen">
      <div className="victory-content">
        <div className="trophy">🏆</div>
        <h1 className="victory-title">Grattis!</h1>
        <h2 className="winner-name">{winner.name}</h2>
        <p className="victory-message">har vunnit spelet!</p>
        
        <div className="final-scores">
          <div className="scores-list">
            {sortedPlayers.map((player, index) => (
              <div 
                key={index} 
                className={`score-item ${player.name === winner.name ? 'winner-score' : ''}`}
              >
                <span className="player-position">{index + 1}.</span>
                <span className="player-name">{player.name}</span>
                <span className="player-coins">
                  <span className="coin-icon">
                    <Coin decorative />
                  </span>
                  {player.coins}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <button className="btn-primary btn-restart" onClick={onRestart}>
          Nytt spel
        </button>
      </div>
    </div>
  );
}
