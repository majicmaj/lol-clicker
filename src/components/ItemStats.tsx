import React from "react";
import { Champion, Item, Rank } from "../types";
import { calculateTotalStats } from "../utils/stats";
import { statIconMap } from "../constants/statIcons";
import { formatBigNumbers } from "../utils/formatBigNumbers";
import gold_divider_sm from "../assets/dividers/gold_divider_sm.png";
import { calculateWinChance } from "../utils/winChance";
import { calculateLpGain, calculateLpLoss } from "../utils/lpCalculations";
import { calculateGoldGain } from "../utils/goldGain";

interface ItemStatsProps {
  inventory: Record<string, Item>;
  champions: Champion[];
  rank: Rank;
  lp: number;
}

export const ItemStats: React.FC<ItemStatsProps> = ({
  inventory,
  rank,
  lp,
  champions,
}) => {
  const totalStats = calculateTotalStats(inventory);

  const statGroups = [
    {
      title: "Attack Damage",
      description: "LP Gain",
      value: calculateLpGain(inventory, rank, lp),
      stats: [
        {
          icon: statIconMap.Damage,
          name: "AD",
          value: totalStats.ad,
          color: "text-orange-500",
          suffix: "",
        },
        {
          icon: statIconMap.AttackSpeed,
          name: "AS",
          value: (totalStats.attackSpeed || 0).toFixed(0),
          color: "text-yellow-100",
          suffix: "%",
        },
        {
          icon: statIconMap.ArmorPenetration,
          name: "Lethality",
          value: totalStats.lethality,
          color: "text-red-500",
          suffix: "",
        },
        {
          icon: statIconMap.ArmorPenetration,
          name: "Pen",
          value: totalStats.armorPen,
          color: "text-red-500",
          suffix: "",
        },
        {
          icon: statIconMap.CriticalStrike,
          name: "Crit",
          value: (totalStats.critChance || 0) * 100,
          color: "text-orange-600",
          suffix: "%",
        },
        {
          icon: statIconMap.LifeSteal,
          name: "Life Steal",
          value: (totalStats.lifesteal || 0).toFixed(1),
          color: "text-red-400",
          suffix: "%",
        },
      ],
    },
    {
      title: "Ability Power",
      description: "Win Chance",
      value: calculateWinChance(inventory, rank, lp, champions) * 100,
      stats: [
        {
          icon: statIconMap.SpellDamage,
          name: "AP",
          value: totalStats.ap,
          color: "text-purple-500",
          suffix: "",
        },
        {
          icon: statIconMap.MagicPenetration,
          name: "AP Pen",
          value: totalStats.magicPen,
          color: "text-purple-400",
          suffix: "",
        },
        {
          icon: statIconMap.MagicPenetration,
          name: "AP Pen %",
          value: (totalStats.magicPenPercent || 0).toFixed(1),
          color: "text-purple-400",
          suffix: "%",
        },
        {
          icon: statIconMap.AbilityHaste,
          name: "Ability Haste",
          value: totalStats.abilityHaste,
          color: "text-yellow-100",
          suffix: "",
        },
        {
          icon: statIconMap.Mana,
          name: "Mana",
          value: totalStats.mana,
          color: "text-sky-400",
          suffix: "",
        },
        {
          icon: statIconMap.ManaRegen,
          name: "Mana Regen",
          value: totalStats.manaRegen?.toFixed(0),
          color: "text-sky-400",
          suffix: "",
        },
      ],
    },
    {
      title: "Defensive",
      description: "LP Loss",
      value: calculateLpLoss(inventory, rank, lp),
      stats: [
        {
          icon: statIconMap.Armor,
          name: "Armor",
          value: totalStats.armor,
          color: "text-[#C8AA6E]",
          suffix: "",
        },
        {
          icon: statIconMap.SpellBlock,
          name: "Magic Resist",
          value: totalStats.magicResist,
          color: "text-sky-300",
          suffix: "",
        },
        {
          icon: statIconMap.Health,
          name: "Health",
          value: totalStats.health,
          color: "text-green-400",
          suffix: "",
        },
        {
          icon: statIconMap.HealthRegen,
          name: "Health Regen",
          value: totalStats.healthRegen?.toFixed(1),
          color: "text-green-500",
          suffix: "",
        },
      ],
    },
    {
      title: "Movement",
      description: "Gold Gain",
      value: calculateGoldGain(totalStats, rank, lp),
      stats: [
        {
          icon: statIconMap.Boots,
          name: "MS",
          value: totalStats.moveSpeed?.toFixed(0),
          color: "text-yellow-100",
          suffix: "",
        },
        {
          icon: statIconMap.Boots,
          name: "% MS",
          value: (totalStats.moveSpeedPercent || 0)?.toFixed(0),
          color: "text-yellow-100",
          suffix: "%",
        },
        {
          icon: statIconMap.Tenacity,
          name: "Tenacity",
          value: (totalStats.tenacity || 0).toFixed(1),
          color: "text-[#C8AA6E]",
          suffix: "%",
        },
        {
          icon: statIconMap.HealAndShieldPower,
          name: "Heal/Shield",
          value: (totalStats.healAndShieldPower || 0).toFixed(1),
          color: "text-green-400",
          suffix: "%",
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {statGroups?.map((group, index) => (
        <div key={index} className="flex flex-col items-center">
          <h3 className="text-sm font-beaufort text-[#C8AA6E]">
            {group.title}
          </h3>
          <p className="text-sm font-spiegel italic text-white/75 mb-1">
            {group.description}{" "}
            <span className="font-bold">({group.value.toFixed(1)})</span>
          </p>
          <div className="grid grid-cols-2 w-full">
            {group.stats?.map((stat, statIndex) => (
              <div
                key={statIndex}
                className="w-full flex items-center justify-between px-1 pb-0.5 rounded-none"
              >
                <img
                  src={stat.icon}
                  alt={stat.name}
                  className="h-4 w-4 inline-block mr-2"
                />

                <div className="text-sm font-beaufort font-bold text-white">
                  {formatBigNumbers(stat?.value || 0)}
                  {stat.suffix}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
