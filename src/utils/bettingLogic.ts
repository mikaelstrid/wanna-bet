import type { Player, Bet } from '../types';

export interface BettingResult {
  updatedPlayers: Player[];
  scoredPlayerIds: number[];
}

/**
 * Calculates coin distribution when an answerer provides an answer
 * 
 * @param players - Array of all players
 * @param currentBets - Array of current bets placed on this question
 * @param answererId - ID of the player answering the question
 * @param isCorrect - Whether the answer was correct
 * @returns Updated players array and IDs of players who scored
 */
export const calculateBettingResult = (
  players: Player[],
  currentBets: Bet[],
  answererId: number,
  isCorrect: boolean
): BettingResult => {
  const newPlayers = players.map(player => ({ ...player }));
  const cannotBets = currentBets.filter(bet => bet.type === 'cannot');
  const canBets = currentBets.filter(bet => bet.type === 'can');
  
  if (isCorrect) {
    // Answerer gets 1 coin plus coins from losing bets (those who bet 'cannot')
    newPlayers[answererId].coins += 1 + cannotBets.length;
    
    // Players who bet 'cannot' lose their coins
    cannotBets.forEach(bet => {
      newPlayers[bet.playerId].coins = Math.max(0, newPlayers[bet.playerId].coins - 1);
    });
    
    // Players who bet 'can' win 1 coin
    canBets.forEach(bet => {
      newPlayers[bet.playerId].coins += 1;
    });
    
    // Collect all players who scored
    const scoredPlayerIds = [answererId, ...canBets.map(bet => bet.playerId)];
    
    return {
      updatedPlayers: newPlayers,
      scoredPlayerIds
    };
  } else {
    // Players who bet 'cannot' win 1 coin
    cannotBets.forEach(bet => {
      newPlayers[bet.playerId].coins += 1;
    });
    
    // Players who bet 'can' lose their coins
    canBets.forEach(bet => {
      newPlayers[bet.playerId].coins = Math.max(0, newPlayers[bet.playerId].coins - 1);
    });
    
    // Only betting players who were correct scored
    const scoredPlayerIds = cannotBets.map(bet => bet.playerId);
    
    return {
      updatedPlayers: newPlayers,
      scoredPlayerIds
    };
  }
};
