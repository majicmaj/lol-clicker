import React from "react";
import { Item } from "../types";

interface GroupedItem {
  item: Item;
  count: number;
}

interface InventoryProps {
  items: Item[];
  // When selling an item, the callback receives the item's id so that
  // one instance of that item is removed.
  onSell?: (itemId: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, onSell }) => {
  // Group items by id. This creates an array of { item, count }
  const groupedItems: GroupedItem[] = Object.values(
    items.reduce((acc: Record<string, GroupedItem>, item) => {
      if (acc[item.id]) {
        acc[item.id].count++;
      } else {
        acc[item.id] = { item, count: 1 };
      }
      return acc;
    }, {} as Record<string, GroupedItem>)
  );

  const handleContextMenu = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    onSell?.(itemId);
  };

  return (
    <div className="bg-[#091428] p-6 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
        Inventory
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {groupedItems.map((group) => (
          <div
            key={group.item.id}
            onContextMenu={(e) => handleContextMenu(e, group.item.id)}
            title={`${
              group.item.name
            }\nRight-click to sell one for ${Math.floor(
              group.item.cost * 0.7
            )} gold`}
            className="bg-[#0A1428] p-2 border-2 border-[#0397AB]/30 hover:border-[#0397AB]/50 transition-colors cursor-pointer relative group"
          >
            <img
              src={group.item.image}
              alt={group.item.name}
              className="w-12 h-12 mx-auto border border-[#C8AA6E]/30"
            />
            {/* If there is more than one copy, display an overlay with the count */}
            {group.count > 1 && (
              <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs font-bold px-1 rounded">
                x{group.count}
              </div>
            )}
            {/* Optional hover overlay for selling info */}
            <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-red-500/10 flex items-center justify-center transition-opacity">
              <div className="text-xs text-[#C8AA6E] font-bold text-center">
                Sell: {Math.floor(group.item.cost * 0.7)}g
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
