import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RANK_VALUES, DIVISION_VALUES } from "../../utils/ranks";
import { Rank, Division } from "../../types";

interface LPChartProps {
  lpHistory: number[];
  rankHistory: Rank[];
  divisionHistory: Division[];
}

interface ChartData {
  game: number;
  lp: number;
  rank: Rank;
  division: Division;
  change: number;
}

export const LPChart: React.FC<LPChartProps> = ({
  lpHistory,
  rankHistory,
  divisionHistory,
}) => {
  const lpChartData: ChartData[] = lpHistory.map((lp, index) => {
    const currentRank = rankHistory[index];
    const currentDivision = divisionHistory[index];

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

  // const formatTooltipValue = (value: number, entry: any) => {
  //   const data = entry.payload;
  //   if (!data) return "";

  //   return `${data.rank} ${data.division || ""} (${data.change > 0 ? "+" : ""}${
  //     data.change
  //   } LP)`;
  // };

  return (
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
  );
};
