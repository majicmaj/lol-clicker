import { GameState, Rank, Division } from "../types";
import { RANKS, DIVISIONS } from "./ranks";
import { calculateTotalStats } from "./stats";
import { calculateLpGain, calculateLpLoss } from "./lpCalculations";
import { calculateWinChance } from "./winChance";
import { calculateGoldGain } from "./goldGain";

export const handleGameClick = (gameState: GameState): GameState => {
  const winChance = calculateWinChance(
    gameState.inventory,
    gameState.player.rank,
    gameState.player.lp,
    gameState.player.champions
  );

  const totalStats = calculateTotalStats(gameState.inventory);
  const isWin = Math.random() < winChance;

  const lpChange = isWin
    ? calculateLpGain(
        gameState.inventory,
        gameState.player.rank,
        gameState.player.lp
      )
    : -calculateLpLoss(
        gameState.inventory,
        gameState.player.rank,
        gameState.player.lp
      );

  // Movement speed affects gold gain
  const goldGain = isWin
    ? calculateGoldGain(totalStats, gameState.player.rank, gameState.player.lp)
    : 0;

  const newLp = gameState.player.lp + lpChange;
  const newGold = (gameState.player.gold || 0) + goldGain;

  // Store current rank and division before any changes
  const currentRank = gameState.player.rank;
  const currentDivision = gameState.player.division;

  // Update histories
  const updatedRankHistory = [
    ...gameState.player.rankHistory,
    currentRank,
  ].slice(-100); // Keep only the last 100 games
  const updatedDivisionHistory = [
    ...gameState.player.divisionHistory,
    currentDivision,
  ].slice(-100); // Keep only the last 100 games
  const updatedLpHistory = [...gameState.player.lpHistory, lpChange].slice(
    -100
  ); // Keep only the last 100 games

  return updateGameState(
    gameState,
    newLp,
    newGold,
    goldGain,
    lpChange,
    isWin,
    updatedLpHistory,
    updatedRankHistory,
    updatedDivisionHistory,
    Date.now()
  );
};

export const handleFreeWinClick = (
  gameState: GameState,
  modifier = 1
): GameState => {
  const lpGain = calculateLpGain(
    gameState.inventory,
    gameState.player.rank,
    gameState.player.lp
  );

  const goldGain = calculateGoldGain(
    calculateTotalStats(gameState.inventory),
    gameState.player.rank,
    gameState.player.lp
  );

  const newLp = gameState.player.lp + lpGain * modifier;
  const newGold = (gameState.player.gold || 0) + goldGain * modifier;

  const updatedRankHistory = [
    ...gameState.player.rankHistory,
    gameState.player.rank,
  ].slice(-100); // Keep only the last 100 games

  const updatedDivisionHistory = [
    ...gameState.player.divisionHistory,
    gameState.player.division,
  ].slice(-100); // Keep only the last 100 games

  const updatedLpHistory = [
    ...gameState.player.lpHistory,
    lpGain * modifier,
  ].slice(-100); // Keep only the last 100 games

  return updateGameState(
    gameState,
    newLp,
    newGold,
    goldGain * modifier,
    lpGain * modifier,
    true,
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
  goldChange: number,
  lpChange: number,
  isWin: boolean,
  lpHistory: number[],
  rankHistory: Rank[],
  divisionHistory: Division[],
  lastGameTime: number
): GameState => {
  let { rank, division } = gameState.player;
  let lp = newLp;

  // Handle promotion/demotion for ranks that use divisions
  if (rank !== "CHALLENGER" && division !== null) {
    if (newLp >= 100) {
      if (division === "1") {
        const currentRankIndex = RANKS.indexOf(rank);
        if (currentRankIndex < RANKS?.length - 1) {
          rank = RANKS[currentRankIndex + 1];
          // For ranks that use divisions, set starting division to "4"
          division =
            rank === "MASTER" || rank === "GRANDMASTER" || rank === "CHALLENGER"
              ? null
              : "4";
          lp = 0;
        }
      } else {
        division = DIVISIONS[DIVISIONS.indexOf(division) + 1];
        lp = 0;
      }
    } else if (newLp < 0) {
      if (division === "4" || division === null) {
        const currentRankIndex = RANKS.indexOf(rank);
        if (currentRankIndex > 0) {
          rank = RANKS[currentRankIndex - 1];
          // When demoting, if the new rank uses divisions, start at "1"
          division =
            rank === "MASTER" || rank === "GRANDMASTER" || rank === "CHALLENGER"
              ? null
              : "1";
          lp = 75;
        } else {
          lp = 0;
        }
      } else {
        division = DIVISIONS[DIVISIONS.indexOf(division) - 1];
        lp = 75;
      }
    }
  }

  // Additional logic for masters+ (ranks without divisions)
  if (division === null && rank !== "CHALLENGER") {
    // First, check for negative LP (demotion)
    if (lp < 0) {
      const currentRankIndex = RANKS.indexOf(rank);
      if (currentRankIndex > 0) {
        rank = RANKS[currentRankIndex - 1];
        // Set the division based on the new rank. If the new rank uses divisions, we set it to "1".
        division =
          rank === "MASTER" || rank === "GRANDMASTER" || rank === "CHALLENGER"
            ? null
            : "1";
        lp = 75;
      } else {
        lp = 0;
      }
    }
    // Then, check for promotions
    else if (rank === "MASTER" && lp >= 200) {
      rank = "GRANDMASTER";
      lp = 0; // Or subtract 200 if you prefer carry-over LP
    } else if (rank === "GRANDMASTER" && lp >= 500) {
      rank = "CHALLENGER";
      lp = 0; // Or subtract 500 if you prefer carry-over LP
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
      lastGoldChange: goldChange,
      wins: gameState.player.wins + (isWin ? 1 : 0),
      losses: gameState.player.losses + (isWin ? 0 : 1),
      lpHistory,
      rankHistory,
      divisionHistory,
      lastGameTime,
      inactivityWarning: false, // Reset warning when playing a game
    },
  };
};
