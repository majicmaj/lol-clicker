import React, { useState } from "react";
import { Item, PlayerStats } from "../types";

import { WinLossChart } from "./stats/WinLossChart";
import { LPChart } from "./stats/LPChart";
import { AverageStats } from "./stats/AverageStats";
import { WinRateStats } from "./stats/WinRateStats";
import { Divider } from "./dividers/Divider";

interface GameStatsProps {
  player: PlayerStats;
  inventory: Record<string, Item>;
}

const RANK_VALUES = {
  IRON: 0,
  BRONZE: 400,
  SILVER: 800,
  GOLD: 1200,
  PLATINUM: 1600,
  EMERALD: 2000,
  DIAMOND: 2400,
  MASTER: 2800,
  GRANDMASTER: 3200,
  CHALLENGER: 3600,
};

const DIVISION_VALUES = {
  "4": 0,
  "3": 100,
  "2": 200,
  "1": 300,
};

export const GameStats: React.FC<GameStatsProps> = ({ player, inventory }) => {
  const [historyRange] = useState(100);

  // Calculate average LP gains/losses separately
  const lpGains = player.lpHistory.filter((lp) => lp > 0);
  const lpLosses = player.lpHistory.filter((lp) => lp < 0);

  // Convert LP history to absolute values based on rank and division
  const lpChartData = player.lpHistory?.map((lp, index) => {
    const currentRank = player.rankHistory[index];
    const currentDivision = player.divisionHistory[index];

    const baseValue = RANK_VALUES[currentRank] || 0;
    const divisionValue = currentDivision
      ? DIVISION_VALUES[currentDivision]
      : 0;
    const absoluteLp = baseValue + divisionValue + lp;

    return {
      game: index + 1,
      lp: absoluteLp,
      rank: currentRank,
      division: currentDivision,
      change: lp,
    };
  });

  const lpChartFilteredProps = lpChartData.slice(-historyRange);

  // Add inactivity warning
  const isHighElo = ["DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"].includes(
    player.rank
  );

  const showInactivityWarning = isHighElo && player.inactivityWarning;

  return (
    <div className="">
      {showInactivityWarning && (
        <div className="bg-red-500/10 border border-red-500/30 p-2 mb-4 text-center">
          <span className="text-red-400 font-bold">Warning: </span>
          <span className="text-white">
            Inactivity Rank decay will begin in 30 seconds!
          </span>
        </div>
      )}

      <h2 className="text-xl font-bold  text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
        Statistics
      </h2>
      <Divider />

      <AverageStats lpGains={lpGains} lpLosses={lpLosses} />
      <WinRateStats player={player} inventory={inventory} />

      {/* <div className="grid grid-cols-2 gap-2 mt-2">
        <LPChart
          lpHistory={lpChartFilteredProps?.map((data) => data.lp)}
          rankHistory={lpChartFilteredProps?.map((data) => data.rank)}
          divisionHistory={lpChartFilteredProps?.map((data) => data.division)}
        />
        <WinLossChart wins={player.wins} losses={player.losses} />
      </div> */}
    </div>
  );
};
