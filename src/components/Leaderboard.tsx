import React, { useEffect, useState, useCallback } from "react";
import { Item, PlayerStats } from "../types";
import { throttle } from "lodash"; // Import Lodash throttle

import { Divider } from "./dividers/Divider";
import { useGameState } from "../hooks/useGameState";
import LeaderboardRow from "./LeaderboardRow";

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

const wsUrl = "wss://lol-clicker.hobbyhood.app";

export const Leaderboard: React.FC<LeaderboardProps> = () => {
  const { gameState, setGameState } = useGameState();
  const { player, inventory } = gameState;
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [usernameInput, setUsernameInput] = useState(player.username || "");
  const [sortOption, setSortOption] = useState<
    "lp" | "gold" | "wins" | "losses" | "games" | "lastGameTime" | "activity"
  >("lp");

  const wsRef = React.useRef<WebSocket | null>(null);

  const handleReconnect = () => {
    if (!isConnected) {
      console.log("Attempting to reconnect...");
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Reconnected to WebSocket server");
        setIsConnected(true);
        sendPlayerUpdateThrottled(player);
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
    }
  };

  useEffect(() => {
    handleReconnect();

    return () => {
      wsRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getItemValue = (item: Item) => (item.count || 1) * (item.cost || 1);
  const top10Items = Object.values(inventory)
    .sort((a, b) => getItemValue(b) - getItemValue(a))
    .slice(0, 10);

  // Throttled function to send player updates
  const sendPlayerUpdateThrottled = useCallback(
    throttle((updatedPlayer: PlayerStats) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "updatePlayer",
            data: { ...updatedPlayer, items: top10Items },
          })
        );
      }
    }, 1000), // Adjust throttle rate here (500ms)
    [isConnected]
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
  const sortedPlayers = [...players]
    .filter((p) => p.wins + p.losses > 0)
    .sort((a, b) => {
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
        case "activity":
          return b.lastGameTime - a.lastGameTime;
        default:
          return 0;
      }
    });

  return (
    <div className="overflow-auto flex flex-col">
      <div className="grid gap-1 grid-cols-[1fr,auto,1fr] place-items-center">
        {isConnected ? (
          <div className="flex h-min w-min gap-1 px-1 items-center text-xs font-spiegel text-green-500">
            <span className="h-2 w-2 bg-green-500 rounded-full inline-block" />
          </div>
        ) : (
          <button
            className="flex h-min w-min gap-1 px-1 items-center text-xs font-spiegel border border-red-500 text-red-500"
            onClick={handleReconnect}
          >
            <span className="h-2 w-2 bg-red-500 rounded-full inline-block" />
            <span className="">Reconnect</span>
          </button>
        )}
        <h2 className="text-center text-xl font-bold text-[#C8AA6E]">
          Leaderboard
        </h2>
      </div>

      <Divider />

      {/* Username input field */}
      <div className="flex items-center gap-1 mb-1">
        <input
          type="text"
          placeholder="Enter your name"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="px-1 border border-[#a58a5d] bg-slate-900 text-white w-full"
        />
        <button
          onClick={handleSetUsername}
          className="bg-[#C8AA6E] min-w-max text-black text-sm font-beaufort px-2 py-[2.8px] hover:bg-[#a58a5d]"
        >
          SET NAME
        </button>
      </div>

      {/* Sorting Tabs */}
      <div className="overflow-auto h-12 grid gap-0.5 grid-cols-6 text-center">
        {["lp", "gold", "wins", "losses", "games", "activity"].map((option) => (
          <button
            key={option}
            onClick={() =>
              setSortOption(
                option as
                  | "lp"
                  | "gold"
                  | "wins"
                  | "losses"
                  | "games"
                  | "activity"
              )
            }
            className={`px-1.5 text-xs border-b-2 lg:font-medium font-beaufort ${
              sortOption === option
                ? "text-[#C8AA6E] border-[#C8AA6E]"
                : "bg-transparent border-transparent hover:text-amber-300 truncate"
            }`}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Leaderboard Rows */}
      <div className="overflow-auto border p-2 border-[#C8AA6E]">
        {sortedPlayers.map((player, index) => (
          <LeaderboardRow key={player.id} player={player} index={index} />
        ))}
      </div>
    </div>
  );
};
