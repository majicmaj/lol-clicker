import React, { useMemo } from "react";
import { PlayerStats } from "../types";

// Import all rank images
import bronzeRank from "../assets/ranks/bronze.webp";
import challengerRank from "../assets/ranks/challenger.webp";
import diamondRank from "../assets/ranks/diamond.webp";
import emeraldRank from "../assets/ranks/emerald.webp";
import goldRank from "../assets/ranks/gold.webp";
import grandmasterRank from "../assets/ranks/grandmaster.webp";
import ironRank from "../assets/ranks/iron.webp";
import masterRank from "../assets/ranks/master.webp";
import platinumRank from "../assets/ranks/platinum.webp";
import silverRank from "../assets/ranks/silver.webp";
import { formatBigNumbers } from "../utils/formatBigNumbers";
import { GOLD_ICON } from "../constants/goldIcon";

interface RankDisplayProps {
  player: PlayerStats;
}

const getRankImage = (rank: string): string => {
  const images: Record<string, string> = {
    IRON: ironRank,
    BRONZE: bronzeRank,
    SILVER: silverRank,
    GOLD: goldRank,
    PLATINUM: platinumRank,
    EMERALD: emeraldRank,
    DIAMOND: diamondRank,
    MASTER: masterRank,
    GRANDMASTER: grandmasterRank,
    CHALLENGER: challengerRank,
  };
  return images[rank] || ironRank;
};

const getRankColor = (rank: string): string => {
  const colors: Record<string, string> = {
    IRON: "from-[#A1A1A1] to-[#5C5C5C]",
    BRONZE: "from-[#CD7F32] to-[#A05A2C]",
    SILVER: "from-[#C0C0C0] to-[#808080]",
    GOLD: "from-[#FFD700] to-[#FFA500]",
    PLATINUM: "from-[#0AC8B9] to-[#0A8F85]",
    EMERALD: "from-[#50C878] to-[#2E8B57]",
    DIAMOND: "from-[#B9F2FF] to-[#00A3CC]",
    MASTER: "from-[#9D4DC3] to-[#6A0DAD]",
    GRANDMASTER: "from-[#EF233C] to-[#D90429]",
    CHALLENGER: "from-[#F4C874] to-[#C8AA6E]",
  };
  return colors[rank] || colors.IRON;
};

export const RankDisplay: React.FC<RankDisplayProps> = ({ player }) => {
  const rankImage = useMemo(() => getRankImage(player.rank), [player.rank]);
  const rankGradient = useMemo(() => getRankColor(player.rank), [player.rank]);

  return (
    <div className="relative flex justify-center">
      {/* Background blur effect */}
      <div
        className="absolute inset-0 opacity-50 blur-2xl"
        style={{
          backgroundImage: `url(${rankImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative bg-[#091428]/90 p-8 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20 max-w-md w-full backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#C8AA6E] via-[#C8AA6E]/80 to-[#C8AA6E] text-transparent bg-clip-text">
          Current Rank
        </h2>

        <div className="flex flex-col items-center">
          {/* Rank Image with Glow */}
          <div className="relative grid place-items-center">
            <img
              src={rankImage}
              alt={player.rank}
              className="w-48 h-48 object-contain blur-xl absolute inset-0"
            />
            <img
              src={rankImage}
              alt={player.rank}
              className="w-48 h-48 object-contain relative"
            />
          </div>

          {/* Rank Information */}
          <div className="text-center space-y-2">
            <div
              className={`text-4xl font-beaufort font-bold bg-gradient-to-r ${rankGradient} text-transparent bg-clip-text`}
            >
              {player.rank}
            </div>

            {player.division && (
              <div className="text-2xl text-white font-beaufort">
                Division {player.division}
              </div>
            )}

            <div className="text-3xl font-bold text-white font-beaufort">
              {formatBigNumbers(player.lp)} LP
              {player.lastLpChange !== 0 && (
                <span
                  className={`ml-2 ${
                    player.lastLpChange > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {player.lastLpChange > 0 ? "+" : ""}
                  {player.lastLpChange}
                </span>
              )}
            </div>

            <div className="mt-4 text-2xl font-bold bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
              {formatBigNumbers(player.gold)}{" "}
              {
                <span
                  className={`${
                    player.lastGoldChange > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {player.lastGoldChange > 0 ? "+" : ""}
                  {player.lastGoldChange}
                </span>
              }
              <img src={GOLD_ICON} className="h-4 w-4 inline-block mr-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
