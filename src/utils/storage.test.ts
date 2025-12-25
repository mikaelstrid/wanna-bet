import { describe, it, expect, beforeEach, vi } from 'vitest';
import { savePlayerNames, loadPlayerNames } from './storage';
import type { PlayerData } from '../types';

describe('Player Names Storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('savePlayerNames', () => {
    it('should save player data to localStorage', () => {
      const players: PlayerData[] = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 }
      ];
      savePlayerNames(players);
      
      const stored = localStorage.getItem('wanna-bet-player-names');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!) as PlayerData[];
      expect(parsed).toEqual(expect.arrayContaining(players));
    });

    it('should merge new players with existing players', () => {
      savePlayerNames([
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 }
      ]);
      savePlayerNames([
        { name: 'Charlie', age: 35 },
        { name: 'David', age: 40 }
      ]);
      
      const loaded = loadPlayerNames();
      expect(loaded.length).toBe(4);
      expect(loaded).toEqual(expect.arrayContaining([
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 },
        { name: 'David', age: 40 }
      ]));
    });

    it('should update age for existing player names', () => {
      savePlayerNames([
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 }
      ]);
      savePlayerNames([
        { name: 'Bob', age: 35 },
        { name: 'Charlie', age: 40 }
      ]);
      
      const loaded = loadPlayerNames();
      const bob = loaded.find(p => p.name === 'Bob');
      expect(bob).toEqual({ name: 'Bob', age: 35 });
      expect(loaded.length).toBe(3);
    });

    it('should filter out empty names', () => {
      savePlayerNames([
        { name: 'Alice', age: 25 },
        { name: '', age: 30 },
        { name: '  ', age: 35 },
        { name: 'Bob', age: 40 }
      ]);
      
      const loaded = loadPlayerNames();
      expect(loaded).toEqual(expect.arrayContaining([
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 40 }
      ]));
      expect(loaded.length).toBe(2);
    });

    it('should treat names case-insensitively to prevent duplicates', () => {
      savePlayerNames([
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 }
      ]);
      savePlayerNames([
        { name: 'alice', age: 35 },
        { name: 'BOB', age: 40 }
      ]);
      
      const loaded = loadPlayerNames();
      expect(loaded.length).toBe(2);
      
      // Should preserve the first casing seen but update ages
      const alice = loaded.find(p => p.name.toLowerCase() === 'alice');
      const bob = loaded.find(p => p.name.toLowerCase() === 'bob');
      
      expect(alice).toEqual({ name: 'Alice', age: 35 });
      expect(bob).toEqual({ name: 'Bob', age: 40 });
    });

    it('should handle errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      expect(() => savePlayerNames([{ name: 'Alice', age: 25 }])).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('loadPlayerNames', () => {
    it('should load player data from localStorage', () => {
      savePlayerNames([
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 }
      ]);
      const loaded = loadPlayerNames();
      
      expect(loaded).toEqual(expect.arrayContaining([
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 }
      ]));
      expect(loaded.length).toBe(3);
    });

    it('should return players in alphabetical order by name', () => {
      savePlayerNames([
        { name: 'Zelda', age: 20 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 }
      ]);
      const loaded = loadPlayerNames();
      
      expect(loaded.map(p => p.name)).toEqual(['Alice', 'Bob', 'Charlie', 'Zelda']);
    });

    it('should return empty array when no players are stored', () => {
      const loaded = loadPlayerNames();
      expect(loaded).toEqual([]);
    });

    it('should handle Swedish alphabetical order correctly', () => {
      savePlayerNames([
        { name: 'Åsa', age: 20 },
        { name: 'Alice', age: 25 },
        { name: 'Örjan', age: 30 },
        { name: 'Bertil', age: 35 },
        { name: 'Ärlig', age: 40 }
      ]);
      const loaded = loadPlayerNames();
      
      // In Swedish locale, Å, Ä, Ö come after Z
      expect(loaded[0].name).toBe('Alice');
      expect(loaded[1].name).toBe('Bertil');
      expect(loaded[loaded.length - 3].name).toBe('Åsa');
      expect(loaded[loaded.length - 2].name).toBe('Ärlig');
      expect(loaded[loaded.length - 1].name).toBe('Örjan');
    });

    it('should handle errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const loaded = loadPlayerNames();
      expect(loaded).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      getItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should handle corrupted localStorage data', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('wanna-bet-player-names', 'invalid json');
      
      const loaded = loadPlayerNames();
      expect(loaded).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });
});
