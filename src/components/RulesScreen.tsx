import './RulesScreen.css';
import { WINNING_COINS } from '../constants';

interface RulesScreenProps {
  onContinue: () => void;
}

export default function RulesScreen({ onContinue }: RulesScreenProps) {
  return (
    <div className="rules-screen">
      <div className="rules-content">
        <h2>Regler</h2>
        
        <div className="rules-list">
          <div className="rule-item">
            <span className="rule-icon">🏆</span>
            <div className="rule-text">
              <strong>Hur man vinner:</strong> Den första spelaren som når <span className="highlight-coin">{WINNING_COINS} guldmynt 🪙</span> vinner spelet!
            </div>
          </div>
          
          <div className="rule-item">
            <span className="rule-icon">💰</span>
            <div className="rule-text">
              <strong>Hur man tjänar guldmynt:</strong>
              <ul>
                <li>Svara rätt på din egen fråga: +1 mynt</li>
                <li>Satsa rätt på andra spelares svar: +1 mynt</li>
                <li>Satsa fel: -1 mynt</li>
              </ul>
            </div>
          </div>
          
          <div className="rule-item">
            <span className="rule-icon">🔀</span>
            <div className="rule-text">
              <strong>Frågeordning:</strong> Frågorna är slumpmässigt utdelade inom varje runda, så alla får olika svårighetsgrad!
            </div>
          </div>
        </div>
        
        <button className="btn-primary" onClick={onContinue}>
          Till spelarregistrering
        </button>
      </div>
    </div>
  );
}
