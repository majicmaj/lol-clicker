import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

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
  );
};
