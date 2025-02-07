import { useEffect, useState } from "react";

import { sellItem } from "./utils/inventory";
import { useGameState } from "./hooks/useGameState";
import { RankDisplay } from "./components/RankDisplay";
import { ItemShop } from "./components/ItemShop";
import { Inventory } from "./components/Inventory";
import { GameStats } from "./components/GameStats";
import { ItemStats } from "./components/ItemStats";
import { Navigation } from "./components/Navigation";
import { Leaderboard } from "./components/Leaderboard";
import { Divider } from "./components/dividers/Divider";
import { Settings } from "lucide-react";
import SettingsModal from "./components/SettingsModal";

function App() {
  const {
    gameState,
    setGameState,
    items,
    itemsLoading: loading,
  } = useGameState();

  const [activeTab, setActiveTab] = useState("overview");
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => setShowSettings((prev) => !prev);

  const handleSellItem = (id: string, count: number) => {
    const newState = sellItem(gameState, id, count);
    setGameState(newState);
  };

  // Give the player a random UUID if they don't have one
  useEffect(() => {
    if (!gameState.player.id) {
      setGameState({
        ...gameState,
        player: {
          ...gameState.player,
          id: Math.random().toString(36).substr(2, 9),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.player.id]);

  // If player's inventory is an array, turn it into an object
  useEffect(() => {
    if (Array.isArray(gameState.inventory)) {
      const oldInv = gameState.inventory as any[];
      setGameState({
        ...gameState,
        inventory: oldInv.reduce(
          (acc, item) => {
            acc[item.id] = item;
            return acc;
          },
          {} as Record<string, any>,
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.inventory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#091428] flex items-center justify-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/70 text-transparent bg-clip-text">
          Loading Hextech Data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10A13] bg-gradient-to-b from-[#091428] to-[#0A1428]">
      <div className="lg:grid lg:grid-rows-1 h-[100vh] p-4 gap-8">
        {/* Mobile Layout */}
        <div className="lg:hidden overflow-auto h-full grid max-h-[calc(100vh-6rem)]">
          {activeTab === "overview" && (
            <RankDisplay player={gameState.player} />
          )}
          {activeTab === "stats" && (
            <div className="grid gap-2bg-[#091428] p-4 pb-6 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
              <GameStats
                player={gameState.player}
                inventory={gameState.inventory}
              />
              <ItemStats
                inventory={gameState.inventory}
                champions={gameState.player.champions}
                rank={gameState.player.rank}
                lp={gameState.player.lp}
              />
            </div>
          )}
          {activeTab === "leaderboard" && (
            <div className="grid bg-[#091428] p-4 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20 overflow-auto">
              <Leaderboard player={gameState.player} />
            </div>
          )}
          {activeTab === "shop" && <ItemShop items={items} />}
          {activeTab === "inventory" && (
            <Inventory items={gameState.inventory} onSell={handleSellItem} />
          )}
        </div>

        {/* Desktop Layout */}
        <div className="h-full overflow-auto hidden lg:grid lg:grid-cols-3 gap-6">
          <div className="bg-[#091428] p-4 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20 grid grid-rows-2 gap-6 overflow-auto">
            <Leaderboard player={gameState.player} />
            <div className="flex flex-col overflow-auto gap-2">
              <GameStats
                player={gameState.player}
                inventory={gameState.inventory}
              />
              <Divider size="sm" />
              <ItemStats
                inventory={gameState.inventory}
                champions={gameState.player.champions}
                rank={gameState.player.rank}
                lp={gameState.player.lp}
              />
            </div>
          </div>

          <RankDisplay player={gameState.player} />

          <div className="bg-[#091428] p-4 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20 grid grid-rows-2 gap-6 overflow-auto">
            <Inventory items={gameState.inventory} onSell={handleSellItem} />
            <ItemShop items={items} />
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-4 z-10">
        <button
          className="text-[#F0E6D2] p-1 rounded-md hover:bg-[#C8AA6E]/20"
          onClick={toggleSettings}
        >
          <Settings />
        </button>
      </div>

      {/* Settings */}
      {showSettings && <SettingsModal />}

      {/* Mobile Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
