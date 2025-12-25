import { useState, useMemo } from "react";
import { loadPlayerNames, savePlayerNames } from "../utils/storage";
import type { PlayerData } from "../types";
import "./PlayerRegistration.css";

interface PlayerRegistrationProps {
  onStartGame: (players: PlayerData[]) => void;
}

export default function PlayerRegistration({
  onStartGame,
}: PlayerRegistrationProps) {
  const [players, setPlayers] = useState<PlayerData[]>([
    { name: "", age: 20 },
    { name: "", age: 20 },
    { name: "", age: 20 },
    { name: "", age: 20 },
  ]);
  const [errors, setErrors] = useState<string[]>([]);
  const [savedPlayers] = useState<PlayerData[]>(() => loadPlayerNames());

  const handleNameChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], name: value };
    
    // Auto-fill age if name matches a saved player
    const savedPlayer = savedPlayers.find(
      (p) => p.name.toLowerCase() === value.trim().toLowerCase()
    );
    if (savedPlayer) {
      newPlayers[index].age = savedPlayer.age;
    }
    
    setPlayers(newPlayers);
  };

  const handleAgeChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], age: parseInt(value, 10) };
    setPlayers(newPlayers);
  };

  const handleNameBlur = (index: number) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], name: newPlayers[index].name.trim() };
    setPlayers(newPlayers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: string[] = [];

    // Filter out empty names
    const filledPlayers = players
      .filter((player) => player.name.trim() !== "");

    // Validate minimum 2 players
    if (filledPlayers.length < 2) {
      newErrors.push("Minst 2 spelare måste fyllas i");
    }

    // Validate unique names among filled players
    const uniqueNames = new Set(filledPlayers.map((player) => player.name.toLowerCase()));
    if (uniqueNames.size !== filledPlayers.length) {
      newErrors.push("Alla spelarnamn måste vara unika");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    savePlayerNames(filledPlayers);
    onStartGame(filledPlayers);
  };

  // Memoize filtered suggestions for each input field
  // Exclude names that are already filled in other input fields (case-insensitive)
  const filteredSuggestionsPerField = useMemo(() => {
    return players.map((_, currentIndex) => {
      const filledNames = players
        .map((player, idx) =>
          idx !== currentIndex ? player.name.trim().toLowerCase() : ""
        )
        .filter((name) => name !== "");

      return savedPlayers.filter(
        (savedPlayer) => !filledNames.includes(savedPlayer.name.toLowerCase())
      );
    });
  }, [players, savedPlayers]);

  return (
    <div className="player-registration">
      <div className="registration-content">
        <h2>Spelare</h2>
        <p className="instruction">Fyll i namn och ålder på 2-4 spelare.</p>

        <form onSubmit={handleSubmit}>
          {players.map((player, index) => {
            const filteredSuggestions = filteredSuggestionsPerField[index];
            return (
              <div key={index} className="input-group">
                <label htmlFor={`player-${index}`}>Spelare {index + 1}</label>
                <div className="input-row">
                  <input
                    id={`player-${index}`}
                    type="text"
                    value={player.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    onBlur={() => handleNameBlur(index)}
                    maxLength={20}
                    list={`player-suggestions-${index}`}
                    autoComplete="off"
                    className="name-input"
                  />
                  <select
                    id={`player-age-${index}`}
                    value={player.age}
                    onChange={(e) => handleAgeChange(index, e.target.value)}
                    disabled={player.name.trim() === ""}
                    className="age-select"
                    aria-label={`Ålder för spelare ${index + 1}`}
                  >
                    {Array.from({ length: 121 }, (_, i) => i).map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                </div>
                <datalist id={`player-suggestions-${index}`}>
                  {filteredSuggestions.map((savedPlayer) => (
                    <option key={savedPlayer.name} value={savedPlayer.name} />
                  ))}
                </datalist>
              </div>
            );
          })}

          {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((error, index) => (
                <p key={index} className="error">
                  {error}
                </p>
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
