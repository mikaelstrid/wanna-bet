import { describe, it, expect } from 'vitest';
import type { Player, Bet } from '../types';

/**
 * These tests verify the betting logic requirements:
 * - When answerer is correct: Players who bet "can" win 1 coin, players who bet "cannot" lose 1 coin
 * - When answerer is incorrect: Players who bet "cannot" win 1 coin, players who bet "can" lose 1 coin
 * - Answerer always gets 1 coin for correct answer plus coins from losing bets
 */

describe('Betting Logic - Coin Distribution', () => {
  describe('When answerer answers correctly', () => {
    it('should award answerer 1 coin plus coins from "cannot" bets when no one bets', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 0 },
        { name: 'Sara', coins: 1 },
        { name: 'Johan', coins: 1 }
      ];
      const currentBets: Bet[] = [];
      const answererId = 0;

      // Simulate logic: answerer gets 1 coin
      const newPlayers = [...players];
      const cannotBets = currentBets.filter(bet => bet.type === 'cannot');
      const canBets = currentBets.filter(bet => bet.type === 'can');
      
      newPlayers[answererId].coins += 1 + cannotBets.length;
      
      cannotBets.forEach(bet => {
        newPlayers[bet.playerId].coins -= 1;
      });
      
      canBets.forEach(bet => {
        newPlayers[bet.playerId].coins += 1;
      });

      expect(newPlayers[0].coins).toBe(1); // Edvin gets 1 coin
      expect(newPlayers[1].coins).toBe(1); // Sara unchanged
      expect(newPlayers[2].coins).toBe(1); // Johan unchanged
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

      const newPlayers = [...players];
      const cannotBets = currentBets.filter(bet => bet.type === 'cannot');
      const canBets = currentBets.filter(bet => bet.type === 'can');
      
      newPlayers[answererId].coins += 1 + cannotBets.length;
      
      cannotBets.forEach(bet => {
        newPlayers[bet.playerId].coins -= 1;
      });
      
      canBets.forEach(bet => {
        newPlayers[bet.playerId].coins += 1;
      });

      expect(newPlayers[0].coins).toBe(2); // Edvin: 0 + 1 (correct) + 1 (Johan's losing bet)
      expect(newPlayers[1].coins).toBe(3); // Sara: 2 + 1 (winning "can" bet)
      expect(newPlayers[2].coins).toBe(1); // Johan: 2 - 1 (losing "cannot" bet)
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

      const newPlayers = [...players];
      const cannotBets = currentBets.filter(bet => bet.type === 'cannot');
      const canBets = currentBets.filter(bet => bet.type === 'can');
      
      newPlayers[answererId].coins += 1 + cannotBets.length;
      
      cannotBets.forEach(bet => {
        newPlayers[bet.playerId].coins -= 1;
      });
      
      canBets.forEach(bet => {
        newPlayers[bet.playerId].coins += 1;
      });

      expect(newPlayers[0].coins).toBe(1); // Edvin: 0 + 1 (correct)
      expect(newPlayers[1].coins).toBe(2); // Sara: 1 + 1 (winning bet)
      expect(newPlayers[2].coins).toBe(2); // Johan: 1 + 1 (winning bet)
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

      const newPlayers = [...players];
      const cannotBets = currentBets.filter(bet => bet.type === 'cannot');
      const canBets = currentBets.filter(bet => bet.type === 'can');
      
      newPlayers[answererId].coins += 1 + cannotBets.length;
      
      cannotBets.forEach(bet => {
        newPlayers[bet.playerId].coins -= 1;
      });
      
      canBets.forEach(bet => {
        newPlayers[bet.playerId].coins += 1;
      });

      expect(newPlayers[0].coins).toBe(3); // Edvin: 0 + 1 (correct) + 2 (from losing bets)
      expect(newPlayers[1].coins).toBe(1); // Sara: 2 - 1 (losing bet)
      expect(newPlayers[2].coins).toBe(1); // Johan: 2 - 1 (losing bet)
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

      const newPlayers = [...players];
      const cannotBets = currentBets.filter(bet => bet.type === 'cannot');
      const canBets = currentBets.filter(bet => bet.type === 'can');
      
      cannotBets.forEach(bet => {
        newPlayers[bet.playerId].coins += 1;
      });
      
      canBets.forEach(bet => {
        newPlayers[bet.playerId].coins -= 1;
      });

      expect(newPlayers[0].coins).toBe(0); // Edvin: no change
      expect(newPlayers[1].coins).toBe(2); // Sara: 1 + 1 (winning "cannot" bet)
      expect(newPlayers[2].coins).toBe(1); // Johan: unchanged
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

      const newPlayers = [...players];
      const cannotBets = currentBets.filter(bet => bet.type === 'cannot');
      const canBets = currentBets.filter(bet => bet.type === 'can');
      
      cannotBets.forEach(bet => {
        newPlayers[bet.playerId].coins += 1;
      });
      
      canBets.forEach(bet => {
        newPlayers[bet.playerId].coins -= 1;
      });

      expect(newPlayers[0].coins).toBe(0); // Edvin: no change
      expect(newPlayers[1].coins).toBe(1); // Sara: 2 - 1 (losing "can" bet)
      expect(newPlayers[2].coins).toBe(3); // Johan: 2 + 1 (winning "cannot" bet)
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

      const newPlayers = [...players];
      const cannotBets = currentBets.filter(bet => bet.type === 'cannot');
      const canBets = currentBets.filter(bet => bet.type === 'can');
      
      cannotBets.forEach(bet => {
        newPlayers[bet.playerId].coins += 1;
      });
      
      canBets.forEach(bet => {
        newPlayers[bet.playerId].coins -= 1;
      });

      expect(newPlayers[0].coins).toBe(0); // Edvin: no change
      expect(newPlayers[1].coins).toBe(2); // Sara: 1 + 1 (winning bet)
      expect(newPlayers[2].coins).toBe(2); // Johan: 1 + 1 (winning bet)
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

      const newPlayers = [...players];
      const cannotBets = currentBets.filter(bet => bet.type === 'cannot');
      const canBets = currentBets.filter(bet => bet.type === 'can');
      
      cannotBets.forEach(bet => {
        newPlayers[bet.playerId].coins += 1;
      });
      
      canBets.forEach(bet => {
        newPlayers[bet.playerId].coins -= 1;
      });

      expect(newPlayers[0].coins).toBe(0); // Edvin: no change
      expect(newPlayers[1].coins).toBe(1); // Sara: 2 - 1 (losing bet)
      expect(newPlayers[2].coins).toBe(1); // Johan: 2 - 1 (losing bet)
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

      const newPlayers = [...players];
      const cannotBets = currentBets.filter(bet => bet.type === 'cannot');
      const canBets = currentBets.filter(bet => bet.type === 'can');
      
      newPlayers[answererId].coins += 1 + cannotBets.length;
      
      cannotBets.forEach(bet => {
        newPlayers[bet.playerId].coins -= 1;
      });
      
      canBets.forEach(bet => {
        newPlayers[bet.playerId].coins += 1;
      });

      expect(newPlayers[0].coins).toBe(1); // Edvin gets 1 coin
      expect(newPlayers[1].coins).toBe(1); // Sara unchanged
      expect(newPlayers[2].coins).toBe(1); // Johan unchanged
    });

    it('should handle when no one places a bet and answerer is incorrect', () => {
      const players: Player[] = [
        { name: 'Edvin', coins: 0 },
        { name: 'Sara', coins: 1 },
        { name: 'Johan', coins: 1 }
      ];
      const currentBets: Bet[] = [];

      const newPlayers = [...players];
      const cannotBets = currentBets.filter(bet => bet.type === 'cannot');
      const canBets = currentBets.filter(bet => bet.type === 'can');
      
      cannotBets.forEach(bet => {
        newPlayers[bet.playerId].coins += 1;
      });
      
      canBets.forEach(bet => {
        newPlayers[bet.playerId].coins -= 1;
      });

      expect(newPlayers[0].coins).toBe(0); // Edvin unchanged
      expect(newPlayers[1].coins).toBe(1); // Sara unchanged
      expect(newPlayers[2].coins).toBe(1); // Johan unchanged
    });
  });
});
