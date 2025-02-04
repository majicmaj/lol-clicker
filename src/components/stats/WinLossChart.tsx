import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface WinLossChartProps {
  wins: number;
  losses: number;
}

export const WinLossChart: React.FC<WinLossChartProps> = ({ wins, losses }) => {
  const distributionData = [
    { name: "Wins", value: wins, color: "#0AC8B9" },
    { name: "Losses", value: losses, color: "#0397AB" },
  ];

  return (
    <div className="bg-[#0A1428] p-2 border border-[#0397AB]/30">
      <div className="text-[#C8AA6E] text-sm font-bold mb-1">
        Win/Loss Distribution
      </div>
      <div className="h-24">
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
              {distributionData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
