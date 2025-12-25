import "./WelcomeScreen.css";
import { WINNING_COINS } from "../constants";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <h1 className="game-title">Wanna bet?</h1>

        <div className="feature-badges">
          <div className="badge">
            <span className="badge-icon">🎯</span>
            <span className="badge-text">Snabba rundor</span>
          </div>
          <div className="badge">
            <span className="badge-icon">🤼</span>
            <span className="badge-text">2-4 spelare</span>
          </div>
          <div className="badge">
            <span className="badge-icon">🏅</span>
            <span className="badge-text">
              Först till {WINNING_COINS}🪙 vinner
            </span>
          </div>
        </div>

        <p className="welcome-text">
          Utmana dina vänner i en spännande frågesport! <br />
          Satsa smart, svara rätt och samla{" "}
          <span className="highlight-coin">guldmynt🪙</span> för att vinna!
        </p>

        <button className="btn-primary btn-start" onClick={onStart}>
          Starta spelet!
        </button>
      </div>
    </div>
  );
}
