import type { GameState, PlayerData } from '../types';

const STORAGE_KEY = 'wanna-bet-game-state';
const PLAYER_NAMES_KEY = 'wanna-bet-player-names';

export const saveGameState = (state: GameState): void => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as GameState;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

export const clearGameState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};

export const savePlayerNames = (players: PlayerData[]): void => {
  try {
    const existingPlayers = loadPlayerNames();
    const newPlayers = players.filter(player => player.name.trim() !== '');
    
    // Merge players by normalized name (case-insensitive), updating age and name casing
    // Note: If a player name appears multiple times in newPlayers, 
    // only the last occurrence's age will be saved
    const allPlayers = [...existingPlayers, ...newPlayers].reduce(
      (acc, player) => {
        const normalizedName = player.name.trim().toLowerCase();
        const trimmedName = player.name.trim();

        // Always use the new player's casing and age (allows users to update casing)
        acc.set(normalizedName, { name: trimmedName, age: player.age });

        return acc;
      },
      new Map<string, PlayerData>()
    );

    const playerList: PlayerData[] = Array.from(allPlayers.values());
    
    const serialized = JSON.stringify(playerList);
    localStorage.setItem(PLAYER_NAMES_KEY, serialized);
  } catch (error) {
    console.error('Failed to save player names:', error);
  }
};

export const loadPlayerNames = (): PlayerData[] => {
  try {
    const serialized = localStorage.getItem(PLAYER_NAMES_KEY);
    if (serialized === null) {
      return [];
    }
    const players = JSON.parse(serialized) as PlayerData[];
    return players.sort((a, b) => a.name.localeCompare(b.name, 'sv'));
  } catch (error) {
    console.error('Failed to load player names:', error);
    return [];
  }
};
