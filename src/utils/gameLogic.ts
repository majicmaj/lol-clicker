import { GameState, Rank, Division } from '../types';
import { RANKS, DIVISIONS } from './ranks';
import { calculateTotalStats } from './stats';
import { calculateCritChance } from './stats';
import { calculateLpGain, calculateLpLoss } from './lpCalculations';
import { calculateWinChance } from './winChance';

export const handleGameClick = (gameState: GameState): GameState => {
  const winChance = calculateWinChance(gameState.inventory, gameState.player.rank, gameState.player.lp);
  const totalStats = calculateTotalStats(gameState.inventory);
  
  // AD-dependent crit chance
  const critChance = totalStats.ad > 0 ? calculateCritChance(gameState.inventory) : 0;
  const isCrit = Math.random() < critChance;
  const isWin = Math.random() < winChance;
  
  let lpChange = isWin 
    ? calculateLpGain(gameState.inventory) 
    : -calculateLpLoss(gameState.inventory);
    
  if (isCrit && isWin) {
    lpChange *= 2;
  }

  // Movement speed affects gold gain
  const moveSpeedBonus = (totalStats.moveSpeed * 0.2) + (totalStats.moveSpeedPercent * 4);
  const goldGain = Math.round(gameState.baseGoldPerClick * (1 + moveSpeedBonus / 100));

  const newLp = gameState.player.lp + lpChange;
  const newGold = gameState.player.gold + goldGain;
  
  // Store current rank and division before any changes
  const currentRank = gameState.player.rank;
  const currentDivision = gameState.player.division;
  
  // Update histories
  const updatedRankHistory = [...gameState.player.rankHistory, currentRank];
  const updatedDivisionHistory = [...gameState.player.divisionHistory, currentDivision];
  const updatedLpHistory = [...gameState.player.lpHistory, lpChange];
  
  return updateGameState(
    gameState,
    newLp,
    newGold,
    lpChange,
    isWin,
    updatedLpHistory,
    updatedRankHistory,
    updatedDivisionHistory,
    Date.now()
  );
};

const updateGameState = (
  gameState: GameState,
  newLp: number,
  newGold: number,
  lpChange: number,
  isWin: boolean,
  lpHistory: number[],
  rankHistory: Rank[],
  divisionHistory: Division[],
  lastGameTime: number
): GameState => {
  let { rank, division } = gameState.player;
  let lp = newLp;
  
  if (rank !== 'CHALLENGER') {
    if (newLp >= 100) {
      if (division === '1') {
        const currentRankIndex = RANKS.indexOf(rank);
        if (currentRankIndex < RANKS.length - 1) {
          rank = RANKS[currentRankIndex + 1];
          division = rank === 'MASTER' || rank === 'GRANDMASTER' || rank === 'CHALLENGER' 
            ? null 
            : '4';
          lp = 0;
        }
      } else if (division) {
        division = DIVISIONS[DIVISIONS.indexOf(division) + 1];
        lp = 0;
      }
    } else if (newLp < 0) {
      if (division === '4' || division === null) {
        const currentRankIndex = RANKS.indexOf(rank);
        if (currentRankIndex > 0) {
          rank = RANKS[currentRankIndex - 1];
          division = rank === 'MASTER' || rank === 'GRANDMASTER' || rank === 'CHALLENGER'
            ? null
            : '1';
          lp = 75;
        } else {
          lp = 0;
        }
      } else if (division) {
        division = DIVISIONS[DIVISIONS.indexOf(division) - 1];
        lp = 75;
      }
    }
  }

  return {
    ...gameState,
    player: {
      ...gameState.player,
      rank,
      division,
      lp,
      gold: newGold,
      lastLpChange: lpChange,
      wins: gameState.player.wins + (isWin ? 1 : 0),
      losses: gameState.player.losses + (isWin ? 0 : 1),
      lpHistory,
      rankHistory,
      divisionHistory,
      lastGameTime,
      inactivityWarning: false // Reset warning when playing a game
    }
  };
};