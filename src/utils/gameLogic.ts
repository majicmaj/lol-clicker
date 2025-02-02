import { GameState, Rank, Division } from "../types";
import { RANKS, DIVISIONS } from "./ranks";
import { calculateTotalStats } from "./stats";
import { calculateCritChance } from "./stats";
import { calculateLpGain, calculateLpLoss } from "./lpCalculations";
import { calculateWinChance } from "./winChance";

const calculateChampionClickValue = (champion: any, inventory: any[]) => {
  const baseClick = champion.stats.attackdamage * (champion.info.attack / 10);
  const championStats = calculateTotalStats(champion.inventory);

  return (
    baseClick *
    (1 +
      (championStats.ad || 0) * 0.01 +
      (championStats.ap || 0) * 0.01 +
      (championStats.attackSpeed || 0) * 0.5)
  );
};

export const handleGameClick = (
  gameState: GameState,
  isChampionClick: boolean = false
): GameState => {
  const winChance = calculateWinChance(
    gameState.inventory,
    gameState.player.rank,
    gameState.player.lp
  );
  const totalStats = calculateTotalStats(gameState.inventory);

  // Calculate champion contributions
  const championContribution = isChampionClick
    ? gameState.player.champions.reduce((total, champion) => {
        return (
          total + calculateChampionClickValue(champion, champion.inventory)
        );
      }, 0)
    : 0;

  // AD-dependent crit chance
  const critChance =
    totalStats.ad > 0 ? calculateCritChance(gameState.inventory) : 0;
  const isCrit = Math.random() < critChance;
  const isWin = Math.random() < winChance;

  let lpChange = isWin
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

  // Add champion contribution to LP gain
  if (isChampionClick) {
    lpChange = Math.round(lpChange * (championContribution * 0.01));
  }

  if (isCrit && isWin) {
    lpChange *= 2;
  }

  // Movement speed affects gold gain
  const moveSpeedBonus =
    totalStats.moveSpeed * 0.2 + totalStats.moveSpeedPercent * 4;
  const goldGain = Math.round(
    gameState.baseGoldPerClick * (1 + moveSpeedBonus / 50)
  );

  const newLp = gameState.player.lp + lpChange;
  const newGold = gameState.player.gold + goldGain;

  // Store current rank and division before any changes
  const currentRank = gameState.player.rank;
  const currentDivision = gameState.player.division;

  // Update histories
  const updatedRankHistory = [...gameState.player.rankHistory, currentRank];
  const updatedDivisionHistory = [
    ...gameState.player.divisionHistory,
    currentDivision,
  ];
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
    isChampionClick ? gameState.player.lastGameTime : Date.now()
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
