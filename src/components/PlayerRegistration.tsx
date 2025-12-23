import { useState } from 'react';
import { loadPlayerNames, savePlayerNames } from '../utils/storage';
import './PlayerRegistration.css';

interface PlayerRegistrationProps {
  onStartGame: (playerNames: string[]) => void;
}

export default function PlayerRegistration({ onStartGame }: PlayerRegistrationProps) {
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);
  const [errors, setErrors] = useState<string[]>([]);
  const [savedNames] = useState<string[]>(() => loadPlayerNames());

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleNameBlur = (index: number) => {
    const newNames = [...playerNames];
    newNames[index] = newNames[index].trim();
    setPlayerNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: string[] = [];
    
    // Filter out empty names
    const filledNames = playerNames.map(name => name.trim()).filter(name => name !== '');
    
    // Validate minimum 2 players
    if (filledNames.length < 2) {
      newErrors.push('Minst 2 spelare måste fyllas i');
    }
    
    // Validate unique names among filled names
    const uniqueNames = new Set(filledNames.map(name => name.toLowerCase()));
    if (uniqueNames.size !== filledNames.length) {
      newErrors.push('Alla spelarnamn måste vara unika');
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    
    savePlayerNames(filledNames);
    onStartGame(filledNames);
  };

  return (
    <div className="player-registration">
      <div className="registration-content">
        <h2>Spelare</h2>
        <p className="instruction">Fyll i namnen på 2-4 spelare.</p>
        
        <form onSubmit={handleSubmit}>
          {playerNames.map((name, index) => (
            <div key={index} className="input-group">
              <label htmlFor={`player-${index}`}>Spelare {index + 1}</label>
              <input
                id={`player-${index}`}
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                onBlur={() => handleNameBlur(index)}
                maxLength={20}
                list={`player-suggestions-${index}`}
                autoComplete="off"
              />
              <datalist id={`player-suggestions-${index}`}>
                {savedNames.map((savedName) => (
                  <option key={savedName} value={savedName} />
                ))}
              </datalist>
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
            Starta spelet
          </button>
        </form>
      </div>
    </div>
  );
}
