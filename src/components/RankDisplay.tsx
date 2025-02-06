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
import { Divider } from "./dividers/Divider";
import { useGameState } from "../hooks/useGameState";
import { handleGameClick } from "../utils/gameLogic";
import PlayButton from "./PlayButton";
import DrakeDisplay from "./DrakeDisplay";

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
  const { gameState, setGameState } = useGameState();
  const rankImage = useMemo(() => getRankImage(player.rank), [player.rank]);
  const rankGradient = useMemo(() => getRankColor(player.rank), [player.rank]);

  const handleClick = () => {
    const newState = handleGameClick(gameState);
    setGameState(newState);
  };

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

      <div className="relative bg-[#091428]/90 p-4 pb-8 px-4 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20 max-w-md w-full backdrop-blur-sm">
        <div className="flex flex-col items-center h-full justify-start">
          {/* Rank Image with Glow */}
          <div className="text-center w-full flex flex-col gap-4">
            <div
              className={`text-4xl font-beaufort font-bold bg-gradient-to-r ${rankGradient} text-transparent bg-clip-text`}
            >
              {player.rank}
            </div>
            <Divider />

            <DrakeDisplay />

            {/* No selecting */}
            <div className="relative grid place-items-center select-none">
              <img
                src={rankImage}
                alt={player.rank}
                draggable="false"
                className="w-full h-full object-contain blur-[16px] absolute inset-0 select-none"
              />
              <img
                src={rankImage}
                alt={player.rank}
                draggable="false"
                className="w-44 h-44 2xl:w-72 2xl:h-72 aspect-square object-contain relative select-none"
              />
            </div>
          </div>
          {/* Rank Information */}
          <div className="text-center w-full flex flex-col gap-2">
            {player.division && (
              <div className="text-2xl text-white font-beaufort">
                Division {player.division}
              </div>
            )}

            {/* LP Bar */}
            <div className="h-6 w-[90%] mx-auto p-1 border border-[#C8AA6E] rounded-full bg-[#0A1428]">
              <div
                className={`h-full rounded-full transition-all bg-gradient-to-r from-[#005A82] ${
                  player.lastLpChange > 0
                    ? "from-[#005A82] to-[#0AC8B9]"
                    : "from-[#5c1d1d] to-[#d80707]"
                } `}
                style={{
                  width: `${
                    player.lp > 100 ? String(player.lp).slice(-2) : player.lp
                  }%`,
                }}
              />
            </div>

            {/* LP Display */}
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

            {/* Gold Display */}
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

            {/* Play Button */}
          </div>
        </div>
        <PlayButton handleClick={handleClick} />
      </div>
    </div>
  );
};
