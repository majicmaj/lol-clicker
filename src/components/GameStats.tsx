import React from "react";
import { PlayerStats } from "../types";
import { calculateWinChance } from "../utils/winChance";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface GameStatsProps {
  player: PlayerStats;
  inventory: any[];
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
  const totalGames = player.wins + player.losses;
  const winRate =
    totalGames > 0 ? ((player.wins / totalGames) * 100).toFixed(1) : "0.0";
  const winChance = (
    calculateWinChance(inventory, player.rank, player.lp) * 100
  ).toFixed(1);

  // Calculate average LP gains/losses separately
  const lpGains = player.lpHistory.filter((lp) => lp > 0);
  const lpLosses = player.lpHistory.filter((lp) => lp < 0);

  const avgLpGain =
    lpGains.length > 0
      ? lpGains.reduce((sum, lp) => sum + lp, 0) / lpGains.length
      : 0;

  const avgLpLoss =
    lpLosses.length > 0
      ? lpLosses.reduce((sum, lp) => sum + Math.abs(lp), 0) / lpLosses.length
      : 0;

  // Convert LP history to absolute values based on rank and division
  const lpChartData = player.lpHistory.map((lp, index) => {
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

  // Prepare data for win/loss distribution
  const distributionData = [
    { name: "Wins", value: player.wins, color: "#4ade80" },
    { name: "Losses", value: player.losses, color: "#f87171" },
  ];

  const formatTooltipValue = (value: number, entry: any) => {
    const data = entry.payload;
    if (!data) return "";

    return `${data.rank} ${data.division || ""} (${data.change > 0 ? "+" : ""}${
      data.change
    } LP)`;
  };

  // Add inactivity warning
  const isHighElo = ["DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"].includes(
    player.rank
  );
  const showInactivityWarning = isHighElo && player.inactivityWarning;

  return (
    <div className="bg-[#091428] p-4 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      {showInactivityWarning && (
        <div className="bg-red-500/10 border border-red-500/30 p-2 mb-4 text-center">
          <span className="text-red-400 font-bold">Warning: </span>
          <span className="text-white">Rank decay will begin in 24 hours!</span>
        </div>
      )}

      <h2 className="text-xl font-bold mb-3 text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
        Match Statistics
      </h2>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-[#0A1428] p-2 border border-[#0397AB]/30">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <div className="text-green-400 text-sm font-bold">Avg. LP Gain</div>
          </div>
          <div className="text-lg font-bold text-white">
            +{avgLpGain.toFixed(1)}
          </div>
        </div>
        <div className="bg-[#0A1428] p-2 border border-[#0397AB]/30">
          <div className="flex items-center gap-1">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <div className="text-red-400 text-sm font-bold">Avg. LP Loss</div>
          </div>
          <div className="text-lg font-bold text-white">
            -{avgLpLoss.toFixed(1)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-[#0A1428] p-2 border border-[#0397AB]/30">
          <div className="text-[#C8AA6E] text-sm font-bold">Win Rate</div>
          <div className="text-lg font-bold text-white">{winRate}%</div>
          <div className="text-xs text-[#A1A1A1]">{totalGames} games</div>
        </div>
        <div className="bg-[#0A1428] p-2 border border-[#0397AB]/30">
          <div className="text-[#0397AB] text-sm font-bold">Next Game</div>
          <div className="text-lg font-bold text-white">{winChance}%</div>
          <div className="text-xs text-[#A1A1A1]">chance to win</div>
        </div>
      </div>

      {/* LP History Chart */}
      <div className="bg-[#0A1428] p-2 border border-[#0397AB]/30 mb-2">
        <div className="text-[#C8AA6E] text-sm font-bold mb-1">LP History</div>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={lpChartData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="lpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0397AB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0397AB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="game" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0A1428",
                  border: "1px solid #0397AB",
                  borderRadius: "4px",
                }}
                labelStyle={{ color: "#C8AA6E" }}
                itemStyle={{ color: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="lp"
                stroke="#0397AB"
                fill="url(#lpGradient)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#0AC8B9" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Win/Loss Distribution */}
      <div className="bg-[#0A1428] p-2 border border-[#0397AB]/30">
        <div className="text-[#C8AA6E] text-sm font-bold mb-1">
          Win/Loss Distribution
        </div>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={distributionData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0A1428",
                  border: "1px solid #0397AB",
                  borderRadius: "4px",
                }}
                labelStyle={{ color: "#C8AA6E" }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" fill="#4ade80">
                {distributionData.map((entry, index) => (
                  <cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
