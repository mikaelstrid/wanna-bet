import { describe, it, expect, beforeEach, vi } from 'vitest';
import { savePlayerNames, loadPlayerNames } from './storage';

describe('Player Names Storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('savePlayerNames', () => {
    it('should save player names to localStorage', () => {
      const names = ['Alice', 'Bob', 'Charlie'];
      savePlayerNames(names);
      
      const stored = localStorage.getItem('wanna-bet-player-names');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual(expect.arrayContaining(names));
    });

    it('should merge new names with existing names', () => {
      savePlayerNames(['Alice', 'Bob']);
      savePlayerNames(['Charlie', 'David']);
      
      const loaded = loadPlayerNames();
      expect(loaded).toEqual(expect.arrayContaining(['Alice', 'Bob', 'Charlie', 'David']));
      expect(loaded.length).toBe(4);
    });

    it('should not duplicate names', () => {
      savePlayerNames(['Alice', 'Bob']);
      savePlayerNames(['Bob', 'Charlie']);
      
      const loaded = loadPlayerNames();
      expect(loaded.filter(name => name === 'Bob').length).toBe(1);
      expect(loaded).toEqual(expect.arrayContaining(['Alice', 'Bob', 'Charlie']));
      expect(loaded.length).toBe(3);
    });

    it('should filter out empty names', () => {
      savePlayerNames(['Alice', '', '  ', 'Bob']);
      
      const loaded = loadPlayerNames();
      expect(loaded).toEqual(expect.arrayContaining(['Alice', 'Bob']));
      expect(loaded.length).toBe(2);
    });

    it('should handle errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      expect(() => savePlayerNames(['Alice'])).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('loadPlayerNames', () => {
    it('should load player names from localStorage', () => {
      savePlayerNames(['Alice', 'Bob', 'Charlie']);
      const loaded = loadPlayerNames();
      
      expect(loaded).toEqual(expect.arrayContaining(['Alice', 'Bob', 'Charlie']));
      expect(loaded.length).toBe(3);
    });

    it('should return names in alphabetical order', () => {
      savePlayerNames(['Zelda', 'Alice', 'Bob', 'Charlie']);
      const loaded = loadPlayerNames();
      
      expect(loaded).toEqual(['Alice', 'Bob', 'Charlie', 'Zelda']);
    });

    it('should return empty array when no names are stored', () => {
      const loaded = loadPlayerNames();
      expect(loaded).toEqual([]);
    });

    it('should handle Swedish alphabetical order correctly', () => {
      savePlayerNames(['Åsa', 'Alice', 'Örjan', 'Bertil', 'Ärlig']);
      const loaded = loadPlayerNames();
      
      // In Swedish locale, Å, Ä, Ö come after Z
      expect(loaded[0]).toBe('Alice');
      expect(loaded[1]).toBe('Bertil');
      expect(loaded[loaded.length - 3]).toBe('Åsa');
      expect(loaded[loaded.length - 2]).toBe('Ärlig');
      expect(loaded[loaded.length - 1]).toBe('Örjan');
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
