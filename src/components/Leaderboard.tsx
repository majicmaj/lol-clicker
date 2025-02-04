import React, { useEffect, useState, useCallback } from "react";
import { PlayerStats } from "../types";
import { throttle } from "lodash"; // Import Lodash throttle

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

interface LeaderboardProps {
  player: PlayerStats;
}

// Sorting order for ranks (higher rank = higher index)
const rankOrder = [
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "EMERALD",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
];

const romanToNumber: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
};

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

const wsUrl = "wss://lol-clicker.hobbyhood.app";

const lastSeen = (time: number | undefined) => {
  if (!time) return "Offline";
  const seconds = Math.floor((Date.now() - time) / 1000);
  if (seconds < 60) return "Online";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ player }) => {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [usernameInput, setUsernameInput] = useState(player.username || "");
  const [sortOption, setSortOption] = useState<
    "lp" | "gold" | "wins" | "losses" | "games" | "lastGameTime"
  >("lp");

  const { setGameState, gameState } = useGameState();

  const wsRef = React.useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
      sendPlayerUpdateThrottled(player); // Send initial update when connected
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "leaderboard") {
          setPlayers(message.data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      ws.close();
    };
  }, []);

  // Throttled function to send player updates
  const sendPlayerUpdateThrottled = useCallback(
    throttle((updatedPlayer: PlayerStats) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ type: "updatePlayer", data: updatedPlayer })
        );
      }
    }, 1000), // Adjust throttle rate here (500ms)
    []
  );

  // When player state changes (frequent in clicker games), throttle the updates
  useEffect(() => {
    sendPlayerUpdateThrottled(player);
  }, [player, sendPlayerUpdateThrottled]);

  const handleSetUsername = () => {
    if (usernameInput.trim() === "") return;

    setGameState({
      ...gameState,
      player: { ...gameState.player, username: usernameInput },
    });
  };

  // Sort players based on the selected sorting option
  const sortedPlayers = [...players].sort((a, b) => {
    if (sortOption === "lp") {
      // Compare ranks first
      const rankA = rankOrder.indexOf(a.rank.toUpperCase());
      const rankB = rankOrder.indexOf(b.rank.toUpperCase());

      if (rankA !== rankB) return rankB - rankA; // Higher rank first

      // Compare divisions if they exist
      const divisionA = a.division ? romanToNumber[a.division] || 0 : 0;
      const divisionB = b.division ? romanToNumber[b.division] || 0 : 0;

      if (divisionA !== divisionB) return divisionA - divisionB; // Lower division first (I < II)

      // Compare LP last
      return b.lp - a.lp;
    }

    switch (sortOption) {
      case "gold":
        return b.gold - a.gold;
      case "wins":
        return b.wins - a.wins;
      case "losses":
        return b.losses - a.losses;
      case "games":
        return b.wins + b.losses - (a.wins + a.losses);
      case "lastGameTime":
        return b.lastGameTime - a.lastGameTime;
      default:
        return 0;
    }
  });

  const isOnline = (player: PlayerStats) => {
    return player.lastGameTime && Date.now() - player.lastGameTime < 10000;
  };

  return (
    <div className="flex flex-col bg-[#091428] p-4 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      <h2 className="text-center text-xl font-bold text-[#C8AA6E]">
        Leaderboard
        {isConnected ? (
          <span className="h-2 w-2 mb-1 bg-green-500 rounded-full inline-block ml-2" />
        ) : (
          <span className="h-2 w-2 mb-1 bg-red-500 rounded-full inline-block ml-2" />
        )}
      </h2>

      <Divider />

      {/* Sorting Tabs */}
      <div className="flex justify-center mb-4">
        {["lp", "gold", "wins", "losses", "games", "activity"].map((option) => (
          <button
            key={option}
            onClick={() =>
              setSortOption(
                option as "lp" | "gold" | "wins" | "losses" | "games"
              )
            }
            className={`px-2 py-1 text-white font-bold text-sm font-beaufort ${
              sortOption === option
                ? "bg-[#C8AA6E] text-black"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Username input field */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter your name"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="p-2 border border-[#a58a5d] bg-slate-900 text-white w-full"
        />
        <button
          onClick={handleSetUsername}
          className="bg-[#C8AA6E] min-w-max text-black font-bold px-4 py-2 hover:bg-[#a58a5d]"
        >
          Set Name
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-96 overflow-auto scrollbar-thin scrollbar-thumb-[#C8AA6E] scrollbar-track-[#091428] border p-2 border-[#C8AA6E]/20">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className="flex flex-col gap-2 border-b border-[#C8AA6E]/20 pb-2"
          >
            <div className="flex items-center justify-start gap-2">
              <span className="text-lg font-bold text-white w-4 flex justify-between">
                <span>{index + 1}.</span>
              </span>

              <div className="relative">
                <img
                  src={getRankImage(player.rank)}
                  alt={player.rank}
                  className="w-8 h-8 object-cover"
                />
                {player.division && (
                  <span className="absolute top-0 right-0 bg-[#C8AA6E] text-black text-xs font-bold px-0.5">
                    {player.division}
                  </span>
                )}
              </div>
              <span className="flex flex-1 items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline(player) ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
                <span className="text-sm font-bold text-white truncate">
                  {player.username || "_"}
                </span>
                <div className="flex-1 w-full" />
                <span className="text-sm text-[#C8AA6E]">
                  {lastSeen(player.lastGameTime)}
                </span>
              </span>
            </div>

            <div className="w-full grid grid-cols-4 place-items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="text-white">
                  {formatBigNumbers(player.lp)}
                </span>
                <span className="text-sm text-[#C8AA6E]">LP</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white">
                  {formatBigNumbers(player.wins)}
                </span>
                <span className="text-sm text-[#C8AA6E]">W</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white">
                  {formatBigNumbers(player.losses)}
                </span>
                <span className="text-sm text-[#C8AA6E]">L</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white">
                  {formatBigNumbers(player.gold)}
                </span>
                <img
                  src={GOLD_ICON}
                  alt="Gold"
                  className="w-5 h-5 object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
