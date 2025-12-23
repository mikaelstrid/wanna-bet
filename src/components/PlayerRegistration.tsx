import { useState } from 'react';
import './PlayerRegistration.css';

interface PlayerRegistrationProps {
  onStartGame: (playerNames: string[]) => void;
}

export default function PlayerRegistration({ onStartGame }: PlayerRegistrationProps) {
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);
  const [errors, setErrors] = useState<string[]>([]);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: string[] = [];
    
    // Validate all names are filled
    if (playerNames.some(name => name.trim() === '')) {
      newErrors.push('Alla spelarnamn måste fyllas i');
    }
    
    // Validate unique names
    const uniqueNames = new Set(playerNames.map(name => name.trim().toLowerCase()));
    if (uniqueNames.size !== 4) {
      newErrors.push('Alla spelarnamn måste vara unika');
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onStartGame(playerNames.map(name => name.trim()));
  };

  return (
    <div className="player-registration">
      <h2>Spelare</h2>
      <p className="instruction">Fyll i namnen på de fyra spelarna</p>
      
      <form onSubmit={handleSubmit}>
        {playerNames.map((name, index) => (
          <div key={index} className="input-group">
            <label htmlFor={`player-${index}`}>Spelare {index + 1}</label>
            <input
              id={`player-${index}`}
              type="text"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`Namn på spelare ${index + 1}`}
              maxLength={20}
            />
          </div>
        ))}
        
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p key={index} className="error">{error}</p>
            ))}
          </div>
        )}
        
        <button type="submit" className="btn-primary">
          Starta spel
        </button>
      </form>
    </div>
  );
}
