import './WelcomeScreen.css';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="welcome-screen">
      <h1 className="game-title">Wanna bet?</h1>
      <p className="welcome-text">
        Utmana dina vänner, först till 3 guldmynt vinner!
      </p>
      <button className="btn-primary" onClick={onStart}>
        Spela!
      </button>
    </div>
  );
}
