import React, { useState } from "react";
import { GOLD_ICON } from "../constants/goldIcon";
import { STATS_LABELS_ICON_MAP } from "../constants/statLabels";
import { useGameState } from "../hooks/useGameState";
import { Item } from "../types";
import { formatBigNumbers } from "../utils/formatBigNumbers";
import { calculateDiscountedCost } from "../utils/inventory";

interface ShopItemCardProps {
  item: Item;
  onPurchase: (item: Item) => void;
  isUpgrade?: boolean;
  hasComponents?: boolean;
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({
  item,
  onPurchase,
  isUpgrade = false,
  hasComponents = false,
}) => {
  const { gameState } = useGameState();
  const [expanded, setExpanded] = useState(false);
  const discountedCost = calculateDiscountedCost(item, gameState.inventory);
  const canAfford = gameState.player.gold >= discountedCost;
  const formattedDiscountedCost = formatBigNumbers(discountedCost);
  const formattedCost = formatBigNumbers(item.cost);

  // Build the container classes in an array and join them.
  const containerClasses = [
    "w-16 relative bg-[#0A1428] flex flex-col items-center overflow-hidden transition-all duration-300",
    canAfford
      ? "hover:border-[#C8AA6E] cursor-pointer"
      : "cursor-not-allowed opacity-50",
    hasComponents && "border-[#0397AB]/50",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      onClick={() => setExpanded((prev) => !prev)}
      className={containerClasses}
    >
      {/* Item Badges */}
      <div className="absolute w-full top-1 flex gap-1">
        {isUpgrade && (
          <span className="px-2 py-1 bg-[#C8AA6E] text-[#091428] text-xs">
            Upgrade
          </span>
        )}
        {hasComponents && (
          <span className="px-1 font-beaufort font-medium py-0.25 bg-[#C8AA6E] text-[#091428] text-xs">
            Upgrade
          </span>
        )}
      </div>

      {/* Item Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 mb-1 mx-auto border border-[#C8AA6E]/30 hover:shadow-lg hover:shadow-[#C8AA6E]/20"
      />

      {/* Price */}
      <div className="font-beaufort text-center">
        <span
          className={`text-sm ${
            canAfford ? "text-[#C8AA6E]" : "text-gray-500"
          }`}
        >
          {formattedDiscountedCost}
        </span>
        {discountedCost !== item.cost && (
          <span className="ml-1 text-sm text-[#785A28] line-through">
            {formattedCost}
          </span>
        )}
      </div>

      {/* Item Name */}
      {expanded && (
        <div className="text-center text-[#C8AA6E] text-xs font-beaufort font-medium">
          {item.name}
        </div>
      )}

      {/* Buy Button */}
      {expanded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            return canAfford && onPurchase(item);
          }}
          className={`flex items-center justify-center px-2 my-1 w-full bg-[#0A323C]/80 border border-[#785A28] ${
            canAfford ? "cursor-pointer" : "cursor-not-allowed"
          }`}
        >
          <span className="text-[#0AC8B9]/90 text-xs font-beaufort font-medium">
            PURCHASE
          </span>
        </button>
      )}

      {/* Stats Grid */}
      {expanded && (
        <div className="grid text-xs flex-1 items-end">
          {Object.entries(item.stats || {}).map(([stat, value]) => {
            if (!value) return null;

            const formattedValue =
              stat === "critChance" ||
              stat === "attackSpeed" ||
              stat === "moveSpeedPercent"
                ? `${(value as number).toFixed(0)}%`
                : value;

            return (
              <div
                key={stat}
                className="flex items-center justify-center px-2 bg-[#091428]/50"
              >
                <span className="text-amber-400">+</span>
                <span className="ml-1 text-white">{formattedValue}</span>
                <span className="ml-1 text-[#C8AA6E]/80 text-xs uppercase">
                  <img
                    src={
                      STATS_LABELS_ICON_MAP[
                        stat as keyof typeof STATS_LABELS_ICON_MAP
                      ]
                    }
                    className="h-3 w-3"
                    alt={`${stat} icon`}
                  />
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShopItemCard;
