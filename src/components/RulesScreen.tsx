import "./RulesScreen.css";
import { WINNING_COINS, COINS_FOR_CORRECT_ANSWER } from "../constants";

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
            <h3 className="rule-item-header">
              <span className="rule-icon">🏆</span>
              Hur man vinner
            </h3>
            <div className="rule-text">
              Den första spelaren som når{" "}
              <span className="highlight-coin">
                {WINNING_COINS} guldmynt 🪙
              </span>{" "}
              vinner spelet!
            </div>
          </div>

          <div className="rule-item">
            <h3 className="rule-item-header">
              <span className="rule-icon">💰</span>
              Hur man tjänar guldmynt
            </h3>
            <div className="rule-text">
              <ul>
                <li>
                  Du får{" "}
                  <span className="highlight-coin">
                    {Array.from(
                      { length: COINS_FOR_CORRECT_ANSWER },
                      (_, i) => (
                        <span key={i}>🪙</span>
                      )
                    )}
                  </span>{" "}
                  om du svarar rätt på din fråga.
                </li>
                <li>
                  Du kan satsa på om en annan spelare kan svara rätt på sin
                  fråga, om du satsar rätt får du{" "}
                  <span className="highlight-coin">🪙</span> annars blir du av
                  med <span className="highlight-coin">🪙</span>.
                </li>
                <li>
                  Om någon satsar på att du inte kan svara rätt på din fråga och
                  du svarar rätt, får du deras satsade{" "}
                  <span className="highlight-coin">🪙</span>.
                </li>
              </ul>
            </div>
          </div>

          <div className="rule-item">
            <h3 className="rule-item-header">
              <span className="rule-icon">🔀</span>
              Frågeordning
            </h3>
            <div className="rule-text">
              Frågorna är slumpmässigt utdelade inom varje runda.
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={onContinue}>
          Ok, jag är med!
        </button>
      </div>
    </div>
  );
}
