import { useEffect, useState } from "react";
import { GOLD_ICON } from "../constants/goldIcon";
import { GameState, Item } from "../types";
import { Divider } from "./dividers/Divider";

interface InventoryProps {
  items: Item[];
  onSell?: (index: number, count: number) => void;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const Inventory: React.FC<InventoryProps> = ({
  items,
  onSell,
  setGameState,
}) => {
  const [sellPrompt, setSellPrompt] = useState<{
    id: string;
    max: number;
    index: number;
  } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, item: Item) => {
    e.preventDefault();
    setSellPrompt({ id: item.id, max: item.count, index: items.indexOf(item) });
  };

  const confirmSell = () => {
    if (sellPrompt) {
      const sellAmount = Number(
        prompt(`Sell how many? (Max: ${sellPrompt.max})`, "1")
      );
      if (
        !isNaN(sellAmount) &&
        sellAmount > 0 &&
        sellAmount <= sellPrompt.max
      ) {
        onSell?.(sellPrompt.index, sellAmount);
      }
      setSellPrompt(null);
    }
  };

  useEffect(() => {
    if (sellPrompt) {
      window.addEventListener("click", confirmSell);
      confirmSell();
      return () => window.removeEventListener("click", confirmSell);
    }
  }, [sellPrompt]);

  // Find duplicates in the inventory and stack them by incrementing their count, also if they don't have a count give them a count of 1.
  const stackItems = (items: Item[]): Item[] => {
    const stackedItems: Item[] = [];
    items.forEach((item) => {
      const existingItem = stackedItems.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.count++;
      } else {
        stackedItems.push({ ...item, count: 1 });
      }
    });
    return stackedItems;
  };

  useEffect(() => {
    if (items) {
      const stackedItems = stackItems(items);
      setGameState((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          inventory: stackedItems,
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <div className="relative bg-[#091428] p-6 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
        Inventory
      </h2>
      <Divider size="sm" />
      <div className="border border-[#C8AA6E] max-h-48 overflow-auto flex flex-wrap items-center justify-center gap-2 p-2">
        {items?.map((item) => (
          <div
            key={item.id}
            className="bg-[#0A1428] p-2 border-2 border-[#0397AB]/30 hover:border-[#0397AB]/50 transition-colors cursor-pointer relative group"
            onContextMenu={(e) => handleContextMenu(e, item)}
            title={`${item.name} x${item.count}`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 mx-auto border border-[#C8AA6E]/30"
            />
            {/* Show correct count badge */}
            {item.count > 1 && (
              <div className="absolute bottom-0 right-0 text-xs text-[#C8AA6E] font-bold bg-[#0A1428] border border-[#C8AA6E] px-1">
                {item.count}
              </div>
            )}
            <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-slate-950/60 flex items-center justify-center transition-opacity">
              <div className="flex flex-col text-xs text-[#C8AA6E] font-bold text-center">
                <span>Sell</span>
                <span>
                  {Math.floor(item.cost * 0.7)}{" "}
                  <img src={GOLD_ICON} className="h-4 w-4 inline-block mr-2" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
