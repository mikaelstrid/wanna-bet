import type { GameState } from '../types';

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

export const savePlayerNames = (names: string[]): void => {
  try {
    const existingNames = loadPlayerNames();
    const newNames = names.filter(name => name.trim() !== '');
    const allNames = [...new Set([...existingNames, ...newNames])];
    const serialized = JSON.stringify(allNames);
    localStorage.setItem(PLAYER_NAMES_KEY, serialized);
  } catch (error) {
    console.error('Failed to save player names:', error);
  }
};

export const loadPlayerNames = (): string[] => {
  try {
    const serialized = localStorage.getItem(PLAYER_NAMES_KEY);
    if (serialized === null) {
      return [];
    }
    const names = JSON.parse(serialized) as string[];
    return names.sort((a, b) => a.localeCompare(b, 'sv'));
  } catch (error) {
    console.error('Failed to load player names:', error);
    return [];
  }
};
