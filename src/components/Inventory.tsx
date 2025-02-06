import { useEffect, useState } from "react";
import { GOLD_ICON } from "../constants/goldIcon";
import { Item } from "../types";
import { Divider } from "./dividers/Divider";

interface InventoryProps {
  items: Record<string, Item>;
  onSell?: (id: string, count: number) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, onSell }) => {
  const [sellPrompt, setSellPrompt] = useState<{
    id: string;
    max: number;
  } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, item: Item) => {
    e.preventDefault();
    setSellPrompt({ id: item.id, max: item.count });
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
        onSell?.(sellPrompt.id, sellAmount);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellPrompt]);

  return (
    <div className="flex flex-col overflow-auto relative ">
      <h2 className="text-xl font-bold  text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
        Inventory
      </h2>
      <Divider />
      <div className="border border-[#C8AA6E] overflow-auto flex flex-wrap items-center justify-center gap-2 p-2">
        {/* {items?.map((item) => (
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
        ))} */}

        {Object.values(items).map((item) => (
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
