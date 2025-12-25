import { describe, it, expect } from 'vitest';
import type { Player, Bet } from '../types';
import { calculateBettingResult } from './bettingLogic';

/**
 * These tests verify the betting logic requirements:
 * - When answerer is correct: Players who bet "can" win 1 coin, players who bet "cannot" lose 1 coin
 * - When answerer is incorrect: Players who bet "cannot" win 1 coin, players who bet "can" lose 1 coin
 * - Answerer always gets 2 coins for correct answer plus coins from losing bets
 */

describe('Betting Logic - Coin Distribution', () => {
  describe('When answerer answers correctly', () => {
    it('should award answerer 2 coins plus coins from "cannot" bets when no one bets', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 0 },
        { name: 'Sara', coins: 1 },
        { name: 'Johan', coins: 1 }
      ];
      const currentBets: Bet[] = [];
      const answererId = 0;

      const result = calculateBettingResult(players, currentBets, answererId, true);

      expect(result.updatedPlayers[0].coins).toBe(2); // Edvin gets 2 coins
      expect(result.updatedPlayers[1].coins).toBe(1); // Sara unchanged
      expect(result.updatedPlayers[2].coins).toBe(1); // Johan unchanged
      expect(result.scoredPlayerIds).toEqual([0]); // Only answerer scored
    });

    it('should award answerer coins from "cannot" bets and award "can" bettors', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 0 },
        { name: 'Sara', coins: 2 },
        { name: 'Johan', coins: 2 }
      ];
      const currentBets: Bet[] = [
        { playerId: 1, type: 'can' },
        { playerId: 2, type: 'cannot' }
      ];
      const answererId = 0;

      const result = calculateBettingResult(players, currentBets, answererId, true);

      expect(result.updatedPlayers[0].coins).toBe(3); // Edvin: 0 + 2 (correct) + 1 (Johan's losing bet)
      expect(result.updatedPlayers[1].coins).toBe(3); // Sara: 2 + 1 (winning "can" bet)
      expect(result.updatedPlayers[2].coins).toBe(1); // Johan: 2 - 1 (losing "cannot" bet)
      expect(result.scoredPlayerIds).toEqual([0, 1]); // Answerer and Sara scored
    });

    it('should handle multiple "can" bets all winning', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 0 },
        { name: 'Sara', coins: 1 },
        { name: 'Johan', coins: 1 }
      ];
      const currentBets: Bet[] = [
        { playerId: 1, type: 'can' },
        { playerId: 2, type: 'can' }
      ];
      const answererId = 0;

      const result = calculateBettingResult(players, currentBets, answererId, true);

      expect(result.updatedPlayers[0].coins).toBe(2); // Edvin: 0 + 2 (correct)
      expect(result.updatedPlayers[1].coins).toBe(2); // Sara: 1 + 1 (winning bet)
      expect(result.updatedPlayers[2].coins).toBe(2); // Johan: 1 + 1 (winning bet)
      expect(result.scoredPlayerIds).toEqual([0, 1, 2]); // All scored
    });

    it('should handle multiple "cannot" bets all losing', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 0 },
        { name: 'Sara', coins: 2 },
        { name: 'Johan', coins: 2 }
      ];
      const currentBets: Bet[] = [
        { playerId: 1, type: 'cannot' },
        { playerId: 2, type: 'cannot' }
      ];
      const answererId = 0;

      const result = calculateBettingResult(players, currentBets, answererId, true);

      expect(result.updatedPlayers[0].coins).toBe(4); // Edvin: 0 + 2 (correct) + 2 (from losing bets)
      expect(result.updatedPlayers[1].coins).toBe(1); // Sara: 2 - 1 (losing bet)
      expect(result.updatedPlayers[2].coins).toBe(1); // Johan: 2 - 1 (losing bet)
      expect(result.scoredPlayerIds).toEqual([0]); // Only answerer scored
    });
  });

  describe('When answerer answers incorrectly', () => {
    it('should not award answerer anything and award "cannot" bettors', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 0 },
        { name: 'Sara', coins: 1 },
        { name: 'Johan', coins: 1 }
      ];
      const currentBets: Bet[] = [
        { playerId: 1, type: 'cannot' }
      ];
      const answererId = 0;

      const result = calculateBettingResult(players, currentBets, answererId, false);

      expect(result.updatedPlayers[0].coins).toBe(0); // Edvin: no change
      expect(result.updatedPlayers[1].coins).toBe(2); // Sara: 1 + 1 (winning "cannot" bet)
      expect(result.updatedPlayers[2].coins).toBe(1); // Johan: unchanged
      expect(result.scoredPlayerIds).toEqual([1]); // Only Sara scored
    });

    it('should deduct coins from "can" bettors who lose', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 0 },
        { name: 'Sara', coins: 2 },
        { name: 'Johan', coins: 2 }
      ];
      const currentBets: Bet[] = [
        { playerId: 1, type: 'can' },
        { playerId: 2, type: 'cannot' }
      ];
      const answererId = 0;

      const result = calculateBettingResult(players, currentBets, answererId, false);

      expect(result.updatedPlayers[0].coins).toBe(0); // Edvin: no change
      expect(result.updatedPlayers[1].coins).toBe(1); // Sara: 2 - 1 (losing "can" bet)
      expect(result.updatedPlayers[2].coins).toBe(3); // Johan: 2 + 1 (winning "cannot" bet)
      expect(result.scoredPlayerIds).toEqual([2]); // Only Johan scored
    });

    it('should handle multiple "cannot" bets all winning', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 0 },
        { name: 'Sara', coins: 1 },
        { name: 'Johan', coins: 1 }
      ];
      const currentBets: Bet[] = [
        { playerId: 1, type: 'cannot' },
        { playerId: 2, type: 'cannot' }
      ];
      const answererId = 0;

      const result = calculateBettingResult(players, currentBets, answererId, false);

      expect(result.updatedPlayers[0].coins).toBe(0); // Edvin: no change
      expect(result.updatedPlayers[1].coins).toBe(2); // Sara: 1 + 1 (winning bet)
      expect(result.updatedPlayers[2].coins).toBe(2); // Johan: 1 + 1 (winning bet)
      expect(result.scoredPlayerIds).toEqual([1, 2]); // Both bettors scored
    });

    it('should handle multiple "can" bets all losing', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 0 },
        { name: 'Sara', coins: 2 },
        { name: 'Johan', coins: 2 }
      ];
      const currentBets: Bet[] = [
        { playerId: 1, type: 'can' },
        { playerId: 2, type: 'can' }
      ];
      const answererId = 0;

      const result = calculateBettingResult(players, currentBets, answererId, false);

      expect(result.updatedPlayers[0].coins).toBe(0); // Edvin: no change
      expect(result.updatedPlayers[1].coins).toBe(1); // Sara: 2 - 1 (losing bet)
      expect(result.updatedPlayers[2].coins).toBe(1); // Johan: 2 - 1 (losing bet)
      expect(result.scoredPlayerIds).toEqual([]); // No one scored
    });
  });

  describe('Edge cases', () => {
    it('should handle when no one places a bet and answerer is correct', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 0 },
        { name: 'Sara', coins: 1 },
        { name: 'Johan', coins: 1 }
      ];
      const currentBets: Bet[] = [];
      const answererId = 0;

      const result = calculateBettingResult(players, currentBets, answererId, true);

      expect(result.updatedPlayers[0].coins).toBe(2); // Edvin gets 2 coins
      expect(result.updatedPlayers[1].coins).toBe(1); // Sara unchanged
      expect(result.updatedPlayers[2].coins).toBe(1); // Johan unchanged
      expect(result.scoredPlayerIds).toEqual([0]); // Only answerer scored
    });

    it('should handle when no one places a bet and answerer is incorrect', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 0 },
        { name: 'Sara', coins: 1 },
        { name: 'Johan', coins: 1 }
      ];
      const currentBets: Bet[] = [];
      const answererId = 0;

      const result = calculateBettingResult(players, currentBets, answererId, false);

      expect(result.updatedPlayers[0].coins).toBe(0); // Edvin unchanged
      expect(result.updatedPlayers[1].coins).toBe(1); // Sara unchanged
      expect(result.updatedPlayers[2].coins).toBe(1); // Johan unchanged
      expect(result.scoredPlayerIds).toEqual([]); // No one scored
    });

    it('should prevent negative coin values when player loses bet', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 2 },
        { name: 'Sara', coins: 0 }
      ];
      const currentBets: Bet[] = [
        { playerId: 1, type: 'can' }
      ];
      const answererId = 0;

      const result = calculateBettingResult(players, currentBets, answererId, false);

      expect(result.updatedPlayers[1].coins).toBe(0); // Sara: should stay at 0, not go negative
    });

    it('should not mutate the original players array', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 2 },
        { name: 'Sara', coins: 1 },
        { name: 'Johan', coins: 1 }
      ];
      const currentBets: Bet[] = [
        { playerId: 1, type: 'can' },
        { playerId: 2, type: 'cannot' }
      ];
      const answererId = 0;

      // Store original coin values
      const originalCoins = players.map(p => p.coins);

      // Call the function
      calculateBettingResult(players, currentBets, answererId, true);

      // Verify original array is unchanged
      expect(players[0].coins).toBe(originalCoins[0]); // Edvin unchanged
      expect(players[1].coins).toBe(originalCoins[1]); // Sara unchanged
      expect(players[2].coins).toBe(originalCoins[2]); // Johan unchanged
    });
  });
});
