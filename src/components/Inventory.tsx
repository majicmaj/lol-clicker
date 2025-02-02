import { Item } from "../types";

interface InventoryProps {
  items: Item[];
  onSell?: (index: number) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, onSell }) => {
  // Group the items by id while storing their original indices.
  const groupedItems = Object.values(
    items.reduce((acc, item, index) => {
      if (!acc[item.id]) {
        acc[item.id] = { item, indices: [index] };
      } else {
        acc[item.id].indices.push(index);
      }
      return acc;
    }, {} as Record<string, { item: Item; indices: number[] }>)
  );

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    onSell?.(index);
  };

  return (
    <div className="bg-[#091428] p-6 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
        Inventory
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {groupedItems.map((group) => (
          <div
            key={group.item.id}
            className="bg-[#0A1428] p-2 border-2 border-[#0397AB]/30 hover:border-[#0397AB]/50 transition-colors cursor-pointer relative group"
            onContextMenu={(e) => handleContextMenu(e, group.indices[0])}
            title={
              group.indices.length > 1
                ? `${group.item.name} x${
                    group.indices.length
                  }\nRight-click to sell for ${Math.floor(
                    group.item.cost * 0.7
                  )} gold`
                : `${group.item.name}\nRight-click to sell for ${Math.floor(
                    group.item.cost * 0.7
                  )} gold`
            }
          >
            <img
              src={group.item.image}
              alt={group.item.name}
              className="w-12 h-12 mx-auto border border-[#C8AA6E]/30"
            />
            {/* Show a counter badge if there is more than one item in this group */}
            {group.indices.length > 1 && (
              <div className="absolute bottom-1 right-1 text-xs text-[#C8AA6E] font-bold bg-[#0A1428] border border-[#C8AA6E] px-1">
                {group.indices.length}
              </div>
            )}
            <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-red-500/50 flex items-center justify-center transition-opacity">
              <div className="flex flex-col text-xs text-[#C8AA6E] font-bold text-center">
                <span>Sell</span>
                <span>{Math.floor(group.item.cost * 0.7)}g</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
