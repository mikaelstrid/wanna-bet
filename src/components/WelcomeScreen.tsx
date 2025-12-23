import './WelcomeScreen.css';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="welcome-screen">
      <h1 className="game-title">Wanna bet?</h1>
      <p className="welcome-text">
        Ett turordningsbaserat frågesportspel för fyra spelare
      </p>
      <button className="btn-primary" onClick={onStart}>
        Spela!
      </button>
    </div>
  );
}
