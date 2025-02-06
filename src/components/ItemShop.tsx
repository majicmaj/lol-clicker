import { Item } from "../types";
import { getAvailableUpgrades, purchaseItem } from "../utils/inventory";
import { STAT_LABELS, STATS_LABELS_ICON_MAP } from "../constants/statLabels";
import ShopItemCard from "./ShopItemCard";
import { useGameState } from "../hooks/useGameState";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { Divider } from "./dividers/Divider";

interface ItemShopProps {
  items: Item[];
}

export const ItemShop: React.FC<ItemShopProps> = ({ items }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStats, setSelectedStats] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { gameState, setGameState } = useGameState();

  const ITEM_CAP = 1000000;

  const handlePurchase = (item: Item) => {
    const alreadyOwned = gameState.inventory[item.id]?.count || 0;
    // prompt user for quantity
    const maxCanAfford = Math.min(
      ITEM_CAP - alreadyOwned,
      Math.floor(gameState.player.gold / item.cost)
    );

    const quantity = parseInt(
      prompt(
        `How many ${item.name} would you like to purchase? (Max: ${maxCanAfford})`
      ) || "1",
      10
    );

    if (isNaN(quantity) || quantity < 1) {
      return;
    }

    const newGameState = purchaseItem(gameState, item, quantity);

    if (newGameState) {
      setGameState(newGameState);
    }
  };

  const toggleStatFilter = (stat: string) => {
    setSelectedStats((prev) =>
      prev.includes(stat) ? prev.filter((s) => s !== stat) : [...prev, stat]
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      ?.includes(searchQuery?.toLowerCase());
    const hasStats =
      selectedStats.length === 0 ||
      selectedStats.every(
        (stat) => item.stats[stat as keyof typeof item.stats]
      );
    return matchesSearch && hasStats;
  });

  const availableUpgrades = getAvailableUpgrades(items, gameState.inventory);

  const hasComponents = Object.keys(gameState.inventory).some(
    (id) => availableUpgrades[id]
  );

  const filteredSuggestions = items.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-auto flex flex-col ">
      <div className="max-w-4xl flex flex-col overflow-auto">
        <h2 className="text-xl font-bold  text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
          Shop
        </h2>
        <Divider />
        {/* Controls Container */}
        <div className="overflow-auto flex flex-col w-full gap-4">
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
                className="w-full px-1 bg-[#0A1428] border-2 border-[#C8AA6E]/50 text-[#C8AA6E] focus:outline-none focus:border-[#C8AA6E]"
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
          </div>

          <div className="overflow-auto flex flex-col gap-4 w-full">
            <div className="flex overflow-auto">
              <div className="flex flex-col overflow-auto min-w-8 pr-2 ">
                <button
                  onClick={() => setSelectedStats([])}
                  className={`p-1 text-sm transition-colors ${
                    selectedStats.length === 0
                      ? "bg-[#C8AA6E] text-[#091428]"
                      : "bg-[#0A1428] text-[#C8AA6E]"
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
                {Object.entries(STAT_LABELS || {})?.map(([key]) => (
                  <button
                    key={key}
                    onClick={() => toggleStatFilter(key)}
                    className={`p-1 text-sm transition-colors ${
                      selectedStats.includes(key)
                        ? "bg-[#C8AA6E] text-[#091428]"
                        : "bg-[#0A1428] text-[#C8AA6E]"
                    }`}
                  >
                    <img
                      src={
                        STATS_LABELS_ICON_MAP[
                          key as keyof typeof STATS_LABELS_ICON_MAP
                        ]
                      }
                      className="h-4 w-4"
                    />
                  </button>
                ))}
              </div>

              {/* Main Item Grid */}

              <div className="flex justify-center overflow-auto border border-[#C8AA6E] p-4 flex-wrap gap-4">
                {filteredItems?.map((item) => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    onPurchase={handlePurchase}
                    hasComponents={hasComponents}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
