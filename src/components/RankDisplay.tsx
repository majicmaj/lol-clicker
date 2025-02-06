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
    <div
      className="relative bg-[#091428]/90 p-4 pb-8 px-4 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20 w-full backdrop-blur-sm"
      style={{
        backgroundColor: "#0a1428",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 152 152'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='temple' fill='%23c89b3c' fill-opacity='0.18'%3E%3Cpath d='M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="flex flex-col items-center h-full justify-center">
        {/* Rank Image with Glow */}
        <div className="text-center w-full flex flex-col gap-4">
          <div
            className={`text-4xl font-beaufort font-bold bg-gradient-to-r ${rankGradient} text-transparent bg-clip-text`}
          >
            {player.rank}
          </div>
          <Divider />

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
                {formatBigNumbers(player.lastLpChange)}
              </span>
            )}
          </div>

          {/* Gold Display */}
          <div className="mt-4 text-2xl font-bold bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
            {formatBigNumbers(player.gold)}{" "}
            {
              <span
                className={`${
                  player.lastGoldChange > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {player.lastGoldChange > 0 ? "+" : ""}
                {formatBigNumbers(player.lastGoldChange)}
              </span>
            }
            <img src={GOLD_ICON} className="h-4 w-4 inline-block mr-2" />
          </div>

          {/* Play Button */}
        </div>
      </div>
      <PlayButton handleClick={handleClick} />
    </div>
  );
};
