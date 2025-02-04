// Leaderboard.tsx
import React, { useEffect, useState } from "react";
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

interface LeaderboardProps {
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

const wsUrl = "https://clicker.hobbyhood.app/";

export const Leaderboard: React.FC<LeaderboardProps> = ({ player }) => {
  // The leaderboard state. Initially, we include the current player.
  const [players, setPlayers] = useState<PlayerStats[]>([player]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      // Send the current player's data to the server.
      ws.send(JSON.stringify({ type: "updatePlayer", data: player }));
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "leaderboard") {
          // Update the leaderboard state with the data received from the server.
          setPlayers(message.data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up the connection when the component unmounts or dependencies change.
    return () => {
      ws.close();
    };
  }, [player]);

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
              {/* Display the player's username and rank/division */}
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
