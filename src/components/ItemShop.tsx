import React, { useEffect } from "react";
import { Item, GameState } from "../types";
import {
  purchaseItem,
  calculateDiscountedCost,
  getAvailableUpgrades,
} from "../utils/inventory";
import { STAT_LABELS } from "../constants/statLabels";
import ShopItemCard from "./ShopItemCard";

interface ItemShopProps {
  items: Item[];
  gameState: GameState;
  onPurchase: (newState: GameState) => void;
}

export const ItemShop: React.FC<ItemShopProps> = ({
  items,
  gameState,
  onPurchase,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStats, setSelectedStats] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  const handlePurchase = (item: Item) => {
    const discountedCost = calculateDiscountedCost(item, gameState.inventory);
    if (gameState.player.gold >= discountedCost) {
      const newState = purchaseItem(gameState, item);
      if (newState) onPurchase(newState);
    }
  };

  const toggleStatFilter = (stat: string) => {
    setSelectedStats((prev) =>
      prev.includes(stat) ? prev.filter((s) => s !== stat) : [...prev, stat]
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const hasStats =
      selectedStats.length === 0 ||
      selectedStats.every(
        (stat) => item.stats[stat as keyof typeof item.stats]
      );
    return matchesSearch && hasStats;
  });

  const availableUpgrades = getAvailableUpgrades(items, gameState.inventory);

  const filteredSuggestions = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-[#091428] p-6 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
          Hextech Shop
        </h2>

        {/* Controls Container */}
        <div className="flex flex-col gap-4">
          <div className="flex w-full  items-center justify-between gap-4">
            <div
              className="relative w-full max-w-[600px] flex-1"
              ref={searchRef}
            >
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(!!e.target.value);
                }}
                onFocus={() => setShowSuggestions(!!searchQuery)}
                className="w-full p-3 bg-[#0A1428] border-2 border-[#C8AA6E]/50 text-[#C8AA6E] focus:outline-none focus:border-[#C8AA6E]"
              />

              {showSuggestions && (
                <div className="absolute z-10 w-full mt-2 bg-[#0A1428] border-2 border-[#C8AA6E]/50 shadow-lg">
                  {filteredSuggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSearchQuery(item.name);
                        setShowSuggestions(false);
                      }}
                      className="p-2 cursor-pointer hover:bg-[#091428] text-[#C8AA6E]"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border-2 border-[#C8AA6E]/50 hover:border-[#C8AA6E] transition-colors"
            >
              <svg
                className={`w-6 h-6 text-[#C8AA6E] transform transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {showFilters && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#C8AA6E]">
                Filter by Stats:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {Object.entries(STAT_LABELS || {})?.map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => toggleStatFilter(key)}
                    className={`px-3 py-1 text-sm transition-colors ${
                      selectedStats.includes(key)
                        ? "bg-[#C8AA6E] text-[#091428]"
                        : "bg-[#0A1428] text-[#C8AA6E] border border-[#C8AA6E]/50 hover:border-[#C8AA6E]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Available Upgrades */}
        {availableUpgrades.length > 0 && (
          <section className="mb-8 max-h-96 overflow-auto border border-[#C8AA6E] p-4">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
              Available Upgrades
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableUpgrades?.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  gameState={gameState}
                  onPurchase={handlePurchase}
                  isUpgrade
                />
              ))}
            </div>
          </section>
        )}

        {/* Main Item Grid */}
        <section>
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
            All Items
          </h3>
          <div className="max-h-96 overflow-auto border border-[#C8AA6E] p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems?.map((item) => (
              <ShopItemCard
                key={item.id}
                item={item}
                gameState={gameState}
                onPurchase={handlePurchase}
                hasComponents={item.from.some((id) =>
                  gameState.inventory.some((invItem) => invItem.id === id)
                )}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
