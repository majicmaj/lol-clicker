import React from "react";
import { Item } from "../types";
import { calculateTotalStats } from "../utils/stats";

interface ItemStatsProps {
  inventory: Item[];
}

export const ItemStats: React.FC<ItemStatsProps> = ({ inventory }) => {
  const totalStats = calculateTotalStats(inventory);

  const statGroups = [
    {
      title: "AP",
      stats: [
        {
          name: "Ability Power",
          value: totalStats.ap,
          color: "text-[#0397AB]",
          suffix: "",
        },
        {
          name: "Magic Pen",
          value: totalStats.magicPen,
          color: "text-purple-400",
          suffix: "",
        },
        {
          name: "Magic Pen %",
          value: (totalStats.magicPenPercent * 100).toFixed(1),
          color: "text-purple-500",
          suffix: "%",
        },
      ],
    },
    {
      title: "AD",
      stats: [
        {
          name: "Attack Damage",
          value: totalStats.ad,
          color: "text-red-400",
          suffix: "",
        },
        {
          name: "Armor Pen",
          value: totalStats.armorPen,
          color: "text-red-500",
          suffix: "",
        },
        {
          name: "Lethality",
          value: totalStats.lethality,
          color: "text-red-600",
          suffix: "",
        },
        // Crit chance
        {
          name: "Crit Chance",
          value: totalStats.critChance * 100,
          color: "text-red-300",
          suffix: "%",
        },
      ],
    },
    {
      title: "Defensive",
      stats: [
        {
          name: "Armor",
          value: totalStats.armor,
          color: "text-[#C8AA6E]",
          suffix: "",
        },
        {
          name: "Magic Resist",
          value: totalStats.magicResist,
          color: "text-purple-300",
          suffix: "",
        },
        {
          name: "Health",
          value: totalStats.health,
          color: "text-green-400",
          suffix: "",
        },
        {
          name: "Health Regen",
          value: totalStats.healthRegen.toFixed(1),
          color: "text-green-500",
          suffix: "",
        },
      ],
    },
    {
      title: "Utility",
      stats: [
        {
          name: "Move Speed",
          value: totalStats.moveSpeed,
          color: "text-cyan-300",
          suffix: "",
        },
        {
          name: "% Move Speed",
          value: totalStats.moveSpeedPercent,
          color: "text-cyan-400",
          suffix: "%",
        },
        {
          name: "Mana",
          value: totalStats.mana,
          color: "text-blue-400",
          suffix: "",
        },
        {
          name: "Mana Regen",
          value: totalStats.manaRegen.toFixed(0),
          color: "text-blue-500",
          suffix: "",
        },
        {
          name: "Ability Haste",
          value: totalStats.abilityHaste,
          color: "text-blue-300",
          suffix: "",
        },
      ],
    },
  ];

  return (
    <div className="bg-[#091428] p-6 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
        Champion Stats
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {statGroups.map((group, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-lg font-beaufort text-[#C8AA6E] mb-2">
              {group.title}
            </h3>
            {group.stats.map((stat, statIndex) => (
              <div
                key={statIndex}
                className="flex justify-between bg-[#0A1428] p-2 border border-[#0397AB]/30 rounded-none"
              >
                <div className={`${stat.color} text-sm font-bold`}>
                  {stat.name}
                </div>
                <div className="text-sm font-bold text-white">
                  +{stat.value}
                  {stat.suffix}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
