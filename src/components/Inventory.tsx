import React from "react";
import { Item } from "../types";

interface InventoryProps {
  items: Item[];
  onSell?: (index: number) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, onSell }) => {
  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    onSell?.(index);
  };

  return (
    <div className="bg-[#091428] p-6 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
        Inventory
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="bg-[#0A1428] p-2 border-2 border-[#0397AB]/30 hover:border-[#0397AB]/50 transition-colors cursor-pointer relative group"
            onContextMenu={(e) => handleContextMenu(e, index)}
            title={`${item.name}\nRight-click to sell for ${Math.floor(
              item.cost * 0.7
            )} gold`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 mx-auto border border-[#C8AA6E]/30"
            />
            <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-red-500/10 flex items-center justify-center transition-opacity">
              <div className="text-xs text-[#C8AA6E] font-bold text-center">
                Sell: {Math.floor(item.cost * 0.7)}g
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
