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

  // Handle purchase: prompt for quantity and update game state if purchase is valid.
  const handlePurchase = (item: Item) => {
    const alreadyOwned = gameState.inventory[item.id]?.count || 0;
    const maxCanAfford = Math.min(
      ITEM_CAP - alreadyOwned,
      Math.floor(gameState.player.gold / item.cost)
    );

    const quantityInput = prompt(
      `How many ${item.name} would you like to purchase? (Max: ${maxCanAfford})`
    );
    const quantity = parseInt(quantityInput || "0", 10);

    if (isNaN(quantity) || quantity < 1) return;

    const newGameState = purchaseItem(gameState, item, quantity);
    if (newGameState) {
      setGameState(newGameState);
    }
  };

  // Toggle the stat filter for the given stat key.
  const toggleStatFilter = (stat: string) => {
    setSelectedStats((prev) =>
      prev.includes(stat) ? prev.filter((s) => s !== stat) : [...prev, stat]
    );
  };

  // Filter items based on the search query and selected stat filters.
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const hasStats =
      selectedStats.length === 0 ||
      selectedStats.every((stat) => !!item.stats?.[stat]);
    return matchesSearch && hasStats;
  });

  // Determine if any available upgrade components exist.
  const availableUpgrades = getAvailableUpgrades(items, gameState.inventory);

  const getHasComponents = (item: Item) => {
    return item.from?.some((componentId) => componentId in gameState.inventory);
  };

  // Suggestions for the search dropdown.
  const filteredSuggestions = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col overflow-auto">
      <div className="max-w-4xl mx-auto flex flex-col overflow-auto">
        <h2
          className="text-xl font-bold text-center
                     bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 
                     text-transparent bg-clip-text"
        >
          Shop
        </h2>
        <Divider />

        {/* Controls Container */}
        <div className="flex flex-col gap-4 w-full overflow-auto">
          {/* Search Input */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-[600px]" ref={searchRef}>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(!!e.target.value);
                }}
                onFocus={() => setShowSuggestions(!!searchQuery)}
                className="w-full px-1 bg-[#0A1428] border-2 border-[#C8AA6E]/50
                           text-[#C8AA6E] focus:outline-none focus:border-[#C8AA6E]"
              />
            </div>
          </div>

          {/* Stat Filter Buttons and Items Grid */}
          <div className="flex gap-4 overflow-auto">
            {/* Stat Filter Buttons */}
            <div className="flex flex-col gap-2 overflow-auto">
              {/* Clear Filters Button */}
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
              {Object.keys(STAT_LABELS).map((statKey) => (
                <button
                  key={statKey}
                  onClick={() => toggleStatFilter(statKey)}
                  className={`p-1 text-sm transition-colors ${
                    selectedStats.includes(statKey)
                      ? "bg-[#C8AA6E] text-[#091428]"
                      : "bg-[#0A1428] text-[#C8AA6E]"
                  }`}
                >
                  <img
                    src={
                      STATS_LABELS_ICON_MAP[
                        statKey as keyof typeof STATS_LABELS_ICON_MAP
                      ]
                    }
                    alt={`${statKey} icon`}
                    className="h-4 w-4"
                  />
                </button>
              ))}
            </div>

            {/* Main Items Grid */}
            <div
              className="flex flex-wrap gap-4 p-4 border border-[#C8AA6E]
                         w-full justify-center items-start overflow-auto"
            >
              {filteredItems.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  onPurchase={handlePurchase}
                  hasComponents={getHasComponents(item, availableUpgrades)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
