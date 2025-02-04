import React, { useEffect, useState } from "react";
import { GameState, PlayerStats } from "../types";

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

interface LeaderboardProps {
  player: PlayerStats;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
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

const wsUrl = "https://clicker.hobbyhood.app/";

export const Leaderboard: React.FC<LeaderboardProps> = ({
  player,
  setGameState,
}) => {
  const [players, setPlayers] = useState<PlayerStats[]>([player]);
  const [isConnected, setIsConnected] = useState(false);
  const [usernameInput, setUsernameInput] = useState(player.username || ""); // Track username input

  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.send(JSON.stringify({ type: "updatePlayer", data: player }));
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "leaderboard") {
          setPlayers(message.data);
          console.log(message.data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [player]);

  const handleSetUsername = () => {
    if (usernameInput.trim() === "") return;

    // Update game state with new username
    setGameState((prevState) => ({
      ...prevState,
      player: { ...prevState.player, username: usernameInput },
    }));
  };

  return (
    <div className="bg-[#091428] p-4 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      <h2 className="text-center text-xl font-bold text-[#C8AA6E]">
        Leaderboard
        {isConnected ? (
          <span className="h-2 w-2 mb-1 bg-green-500 rounded-full inline-block ml-2" />
        ) : (
          <span className="h-2 w-2 mb-1 bg-red-500 rounded-full inline-block ml-2" />
        )}
      </h2>

      <Divider />

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

      <div className="flex flex-col gap-2">
        {players.map((player, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-[#C8AA6E]/20 pb-2"
          >
            <span className="text-lg font-bold text-white">{index + 1}.</span>
            <img
              src={getRankImage(player.rank)}
              alt={player.rank}
              className="w-8 h-8 object-cover"
            />
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold text-white">
                {player.username} — {player.rank.slice(0, 1)} {player.division}
              </span>
              <span className="text-sm text-[#C8AA6E]">
                {formatBigNumbers(player.lp)} LP -{" "}
                {formatBigNumbers(player.wins)} W{" "}
                {formatBigNumbers(player.losses)} L
              </span>
            </div>
            <div className="flex items-center gap-1">
              <img
                src={GOLD_ICON}
                alt="Gold"
                className="w-6 h-6 object-cover"
              />
              <span className="text-lg font-bold text-white">
                {formatBigNumbers(player.gold)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
