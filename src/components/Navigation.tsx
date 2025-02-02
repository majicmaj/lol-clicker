import React from "react";
import { LayoutGrid, Sword, ShoppingBag, BarChart3 } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "overview", icon: LayoutGrid, label: "Overview" },
    { id: "stats", icon: BarChart3, label: "Stats" },
    { id: "shop", icon: ShoppingBag, label: "Shop" },
    { id: "inventory", icon: Sword, label: "Inventory" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#091428] border-t-2 border-[#C8AA6E]/30 lg:hidden">
      <div className="grid grid-cols-4 gap-1 p-1">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center p-2 transition-colors
              ${
                activeTab === id
                  ? "text-[#C8AA6E] bg-[#0A1428]"
                  : "text-gray-400 hover:text-[#C8AA6E]/80"
              }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1 uppercase">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
