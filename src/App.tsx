import { useState } from "react";
import { handleGameClick } from "./utils/gameLogic";
import { sellItem } from "./utils/inventory";
import { useGameState } from "./hooks/useGameState";
import { RankDisplay } from "./components/RankDisplay";
import { ItemShop } from "./components/ItemShop";
import { Inventory } from "./components/Inventory";
import { GameStats } from "./components/GameStats";
import { ItemStats } from "./components/ItemStats";
import { Navigation } from "./components/Navigation";
import { RotateCcw } from "lucide-react";
import { ChampionShop } from "./components/ChampionShop";
import { ChampionInventory } from "./components/ChampionInventory";
import { Champion } from "./types";

function App() {
  const { gameState, setGameState, items, loading, resetGame } = useGameState();
  const [activeTab, setActiveTab] = useState("overview");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleClick = () => {
    const newState = handleGameClick(gameState);
    setGameState(newState);
  };

  const handleSellItem = (index: number) => {
    const newState = sellItem(gameState, index);
    setGameState(newState);
  };

  const handlePurchaseChampion = (champion: Champion) => {
    setGameState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        lp: prev.player.lp - 6300,
        champions: [...prev.player.champions, champion],
      },
    }));
  };

  const handleReset = () => {
    if (showResetConfirm) {
      resetGame();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      // Auto-hide the confirmation after 3 seconds
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

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
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_center,rgba(0,168,255,0.15),rgba(9,20,40,0))] p-6 pb-24 lg:pb-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Reset Button */}
        <div className="absolute top-2 right-6">
          <button
            onClick={handleReset}
            className={`flex items-center gap-2 px-4 py-1 text-sm transition-all duration-300
              ${
                showResetConfirm
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-[#0A1428] hover:bg-[#0A1428]/80"
              } 
              border border-[#C8AA6E]/30`}
          >
            <RotateCcw size={12} />
            <span>{showResetConfirm ? "Confirm" : "Reset"}</span>
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          <GameStats
            player={gameState.player}
            inventory={gameState.inventory}
          />
          <RankDisplay player={gameState.player} />
          <ItemStats inventory={gameState.inventory} />
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <RankDisplay player={gameState.player} />
              <button
                onClick={handleClick}
                className="relative w-full grid place-items-center mb-6 active:brightness-50"
              >
                <div
                  style={{
                    transform: "perspective(100px) rotateX(20deg)",
                  }}
                  className="absolute w-full max-w-32 bg-gradient-to-b from-slate-900 to-[#0397AB]/50
                           text-white font-bold py-5 px-1 transition-all duration-300
                           border-2 border-[#0397AB]/80 hover:border-[#0AC8B9]
                           shadow-lg shadow-[#0397AB]/20 hover:shadow-[#0AC8B9]/40
                           transform hover:-translate-y-1"
                />
                <div className="relative flex items-center justify-center text-md font-beaufort uppercase">
                  Play Game
                </div>
              </button>
            </div>
          )}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <GameStats
                player={gameState.player}
                inventory={gameState.inventory}
              />
              <ItemStats inventory={gameState.inventory} />
            </div>
          )}
          {activeTab === "shop" && (
            <div className="space-y-6">
              <ItemShop
                items={items}
                gameState={gameState}
                onPurchase={setGameState}
              />
              <ChampionShop
                gameState={gameState}
                onPurchase={handlePurchaseChampion}
              />
            </div>
          )}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <Inventory items={gameState.inventory} onSell={handleSellItem} />
              <ChampionInventory champions={gameState.player.champions} />
            </div>
          )}
        </div>

        {/* Desktop Play Button and Inventory */}
        <div className="hidden lg:visible lg:flex flex-col gap-8">
          <button
            onClick={handleClick}
            className="relative w-full grid place-items-center mb-6 active:brightness-50"
          >
            <div
              style={{
                transform: "perspective(100px) rotateX(20deg)",
              }}
              className="absolute w-full max-w-32 bg-gradient-to-b from-slate-900 to-[#0397AB]/50
                           text-white font-bold py-5 px-1 transition-all duration-300
                           border-2 border-[#0397AB]/80 hover:border-[#0AC8B9]
                           shadow-lg shadow-[#0397AB]/20 hover:shadow-[#0AC8B9]/40
                           transform hover:-translate-y-1"
            />
            <div className="relative flex items-center justify-center text-md font-beaufort uppercase">
              Play Game
            </div>
          </button>

          <Inventory items={gameState.inventory} onSell={handleSellItem} />
          <ChampionInventory champions={gameState.player.champions} />

          <div className="grid grid-cols-2 gap-8">
            <ItemShop
              items={items}
              gameState={gameState}
              onPurchase={setGameState}
            />

            <ChampionShop
              gameState={gameState}
              onPurchase={handlePurchaseChampion}
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
