import { STAT_LABELS } from "../constants/statLabels";
import { Item, GameState } from "../types";
import { calculateDiscountedCost } from "../utils/inventory";

const ShopItemCard: React.FC<{
  item: Item;
  gameState: GameState;
  onPurchase: (item: Item) => void;
  isUpgrade?: boolean;
  hasComponents?: boolean;
}> = ({
  item,
  gameState,
  onPurchase,
  isUpgrade = false,
  hasComponents = false,
}) => {
  const discountedCost = calculateDiscountedCost(item, gameState.inventory);
  const canAfford = gameState.player.gold >= discountedCost;

  return (
    <div
      onClick={() => canAfford && onPurchase(item)}
      className={`relative bg-[#0A1428] p-3 border-2 transition-all duration-300 ${
        canAfford
          ? "border-[#C8AA6E]/30 hover:border-[#C8AA6E] cursor-pointer hover:shadow-lg hover:shadow-[#C8AA6E]/20"
          : "border-[#C8AA6E]/10 cursor-not-allowed opacity-50"
      } ${hasComponents ? "border-[#0397AB]/50" : ""}`}
    >
      {/* Item Badges */}
      <div className="absolute top-2 right-2 flex gap-1">
        {isUpgrade && (
          <span className="px-2 py-1 bg-[#C8AA6E] text-[#091428] text-xs">
            Upgrade
          </span>
        )}
        {hasComponents && (
          <span className="px-2 py-1 bg-[#0397AB] text-white text-xs">
            Components Owned
          </span>
        )}
      </div>

      {/* Item Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 mx-auto mb-3 border border-[#C8AA6E]/30"
      />

      {/* Item Name */}
      <h4 className="text-center font-bold mb-2 text-[#C8AA6E]">{item.name}</h4>

      {/* Price */}
      <div className="text-center mb-3">
        <span
          className={`font-bold ${
            canAfford ? "text-[#C8AA6E]" : "text-gray-500"
          }`}
        >
          {discountedCost}g
        </span>
        {discountedCost !== item.cost && (
          <span className="ml-2 text-sm text-gray-400 line-through">
            {item.cost}g
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid text-xs">
        {Object.entries(item.stats || {})?.map(([stat, value]) => {
          if (!value) return null;
          return (
            <div
              key={stat}
              className="flex items-center justify-center px-2 bg-[#091428]/50"
            >
              <span className="text-[#C8AA6E]">+</span>
              <span className="ml-1 text-white">
                {stat === "critChance" ||
                stat === "attackSpeed" ||
                stat === "moveSpeedPercent"
                  ? `${(value * 100).toFixed(0)}%`
                  : value}
              </span>
              <span className="ml-1 text-[#C8AA6E]/80 text-xs uppercase">
                {STAT_LABELS[stat as keyof typeof STAT_LABELS]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopItemCard;
