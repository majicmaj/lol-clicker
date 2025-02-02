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
import { Sword, RotateCcw } from "lucide-react";

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
    <div className="min-h-screen bg-[#091428] bg-[radial-gradient(circle_at_center,rgba(0,168,255,0.15),rgba(9,20,40,0))] p-6 pb-24 lg:pb-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Reset Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={handleReset}
            className={`flex items-center gap-2 px-4 py-1 text-sm rounded transition-all duration-300
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
                className="relative w-full grid place-items-center mb-6"
              >
                <div
                  style={{
                    transform: "perspective(100px) rotateX(-30deg)",
                  }}
                  className="absolute w-full max-w-56 bg-gradient-to-r from-[#0397AB] to-[#0397AB]/80 hover:from-[#0AC8B9] hover:to-[#0AC8B9]/80 
                           text-white font-bold py-8 px-4 transition-all duration-300 
                           border-2 border-[#0397AB]/80 hover:border-[#0AC8B9]
                           shadow-lg shadow-[#0397AB]/20 hover:shadow-[#0AC8B9]/40
                           transform hover:-translate-y-1"
                />
                <div className="mb-3 relative flex items-center justify-center space-x-3">
                  <Sword size={32} className="text-white" />
                  <span className="text-2xl">Play Game</span>
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
            </div>
          )}
          {activeTab === "shop" && (
            <ItemShop
              items={items}
              gameState={gameState}
              onPurchase={setGameState}
            />
          )}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <ItemStats inventory={gameState.inventory} />
              <Inventory items={gameState.inventory} onSell={handleSellItem} />
            </div>
          )}
        </div>

        {/* Desktop Play Button and Inventory */}
        <div className="hidden lg:block">
          <button
            onClick={handleClick}
            className="relative w-full grid place-items-center mb-6"
          >
            <div
              style={{
                transform: "perspective(100px) rotateX(-30deg)",
              }}
              className="absolute w-full max-w-56 bg-gradient-to-r from-[#0397AB] to-[#0397AB]/80 hover:from-[#0AC8B9] hover:to-[#0AC8B9]/80 
                       text-white font-bold py-8 px-4 transition-all duration-300 
                       border-2 border-[#0397AB]/80 hover:border-[#0AC8B9]
                       shadow-lg shadow-[#0397AB]/20 hover:shadow-[#0AC8B9]/40
                       transform hover:-translate-y-1"
            />
            <div className="mb-3 relative flex items-center justify-center space-x-3">
              <Sword size={32} className="text-white" />
              <span className="text-2xl">Play Game</span>
            </div>
          </button>
          <Inventory items={gameState.inventory} onSell={handleSellItem} />
          <ItemShop
            items={items}
            gameState={gameState}
            onPurchase={setGameState}
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
