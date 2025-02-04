import React from "react";
import { calculateWinChance } from "../../utils/winChance";
import { PlayerStats, Item } from "../../types";

interface WinRateStatsProps {
  player: PlayerStats;
  inventory: Item[];
}

export const WinRateStats: React.FC<WinRateStatsProps> = ({
  player,
  inventory,
}) => {
  const totalGames = player.wins + player.losses;
  const winRate =
    totalGames > 0 ? ((player.wins / totalGames) * 100).toFixed(1) : "0.0";
  const winChance = (
    calculateWinChance(inventory, player.rank, player.lp, player.champions) *
    100
  ).toFixed(1);

  return (
    <div className="grid grid-cols-2 gap-2 mb-1">
      <div className="flex justify-between items-center">
        <div className="text-[#C8AA6E] text-sm font-bold">Win Rate</div>
        <div className="text-lg font-bold text-white">{winRate}%</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-[#0397AB] text-sm font-bold">Win Chance</div>
        <div className="text-lg font-bold text-white">{winChance}%</div>
      </div>
    </div>
  );
};
