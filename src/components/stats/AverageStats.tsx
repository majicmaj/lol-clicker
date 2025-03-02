import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatBigNumbers } from "../../utils/formatBigNumbers";

interface AverageStatsProps {
  lpGains: number[];
  lpLosses: number[];
}

export const AverageStats: React.FC<AverageStatsProps> = ({
  lpGains,
  lpLosses,
}) => {
  const avgLpGain =
    lpGains.length > 0
      ? lpGains.slice(-10).reduce((sum, lp) => sum + lp, 0) / 10
      : 0;

  const avgLpLoss =
    lpLosses.length > 0
      ? lpLosses.slice(-10).reduce((sum, lp) => sum + Math.abs(lp), 0) / 10
      : 0;

  return (
    <div className="grid grid-cols-2 gap-2 mb-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <div className="text-green-400 text-sm font-bold">+LP</div>
        </div>
        <div className="text-lg font-bold text-white">
          +{formatBigNumbers(avgLpGain)}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <TrendingDown className="w-4 h-4 text-red-400" />
          <div className="text-red-400 text-sm font-bold">-LP</div>
        </div>
        <div className="text-lg font-bold text-white">
          -{formatBigNumbers(avgLpLoss)}
        </div>
      </div>
    </div>
  );
};
