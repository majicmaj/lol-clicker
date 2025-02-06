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
  const discountedCost = calculateDiscountedCost(item, gameState.inventory);
  const canAfford = gameState.player.gold >= discountedCost;
  const formattedDiscountedCost = formatBigNumbers(discountedCost);
  const formattedCost = formatBigNumbers(item.cost);

  // Build the container classes in an array and join them.
  const containerClasses = [
    "w-[100px] relative bg-[#0A1428] p-1 flex flex-col items-center overflow-hidden border-2 transition-all duration-300",
    canAfford
      ? "border-[#C8AA6E]/30 hover:border-[#C8AA6E] cursor-pointer hover:shadow-lg hover:shadow-[#C8AA6E]/20"
      : "border-[#C8AA6E]/10 cursor-not-allowed opacity-50",
    hasComponents && "border-[#0397AB]/50",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      onClick={() => canAfford && onPurchase(item)}
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
        className="w-16 h-16 mb-1 mx-auto border border-[#C8AA6E]/30"
      />

      {/* Item Name */}
      <h4 className="text-center text-xs font-bold text-[#C8AA6E]">
        {item.name}
      </h4>

      {/* Price */}
      <div className="text-center">
        <span
          className={`text-xs ${
            canAfford ? "text-[#C8AA6E]" : "text-gray-500"
          }`}
        >
          {formattedDiscountedCost}
          <img
            src={GOLD_ICON}
            className="h-3 w-3 inline-block"
            alt="gold icon"
          />
        </span>
        {discountedCost !== item.cost && (
          <span className="text-sm text-gray-400 line-through">
            {formattedCost}g
          </span>
        )}
      </div>

      {/* Stats Grid */}
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
    </div>
  );
};

export default ShopItemCard;
