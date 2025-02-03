import React from "react";
import { Champion, Item, Rank } from "../types";
import { calculateTotalStats } from "../utils/stats";
import { STAT_ICON_MAP } from "../constants/statIcons";
import { formatBigNumbers } from "../utils/formatBigNumbers";
import gold_divider_sm from "../assets/dividers/gold_divider_sm.png";
import { calculateWinChance } from "../utils/winChance";
import { calculateLpGain, calculateLpLoss } from "../utils/lpCalculations";
import { calculateGoldGain } from "../utils/goldGain";

interface ItemStatsProps {
  inventory: Item[];
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
      description: "Increases LP Gain",
      value: calculateLpGain(inventory, rank, lp),
      stats: [
        {
          icon: STAT_ICON_MAP.FlatPhysicalDamageMod,
          name: "AD",
          value: totalStats.ad,
          color: "text-red-500",
          suffix: "",
        },
        {
          icon: STAT_ICON_MAP.FlatArmorMod,
          name: "Armor Pen",
          value: totalStats.armorPen,
          color: "text-red-600",
          suffix: "",
        },
        {
          icon: STAT_ICON_MAP.FlatCritChanceMod,
          name: "Lethality",
          value: totalStats.lethality,
          color: "text-red-800",
          suffix: "",
        },
        {
          icon: STAT_ICON_MAP.FlatCritChanceMod,
          name: "Crit Chance",
          value: totalStats.critChance * 100,
          color: "text-amber-400",
          suffix: "%",
        },
        {
          icon: STAT_ICON_MAP.PercentLifeStealMod,
          name: "AS",
          value: (totalStats.attackSpeed * 100).toFixed(0),
          color: "text-amber-300",
          suffix: "/s",
        },
      ],
    },
    {
      title: "Ability Power",
      description: "Increases Win Chance",
      value: calculateWinChance(inventory, rank, lp, champions),
      stats: [
        {
          icon: STAT_ICON_MAP.FlatMagicDamageMod,
          name: "AP",
          value: totalStats.ap,
          color: "text-[#0397AB]",
          suffix: "",
        },
        {
          icon: STAT_ICON_MAP.FlatSpellBlockMod,
          name: "AP Pen",
          value: totalStats.magicPen,
          color: "text-purple-400",
          suffix: "",
        },
        {
          icon: STAT_ICON_MAP.PercentMagicPenetrationMod,
          name: "AP Pen %",
          value: (totalStats.magicPenPercent * 100).toFixed(1),
          color: "text-purple-500",
          suffix: "%",
        },
        {
          icon: STAT_ICON_MAP.rPercentCooldownMod,
          name: "Ability Haste",
          value: totalStats.abilityHaste,
          color: "text-blue-300",
          suffix: "",
        },
        {
          icon: STAT_ICON_MAP.Mana,
          name: "Mana",
          value: totalStats.mana,
          color: "text-blue-400",
          suffix: "",
        },
        {
          icon: STAT_ICON_MAP.ManaRegen,
          name: "Mana Regen",
          value: totalStats.manaRegen.toFixed(0),
          color: "text-blue-500",
          suffix: "",
        },
      ],
    },
    {
      title: "Defensive",
      description: "Reduces LP Loss",
      value: calculateLpLoss(inventory, rank, lp),
      stats: [
        {
          icon: STAT_ICON_MAP.FlatArmorMod,
          name: "Armor",
          value: totalStats.armor,
          color: "text-[#C8AA6E]",
          suffix: "",
        },
        {
          icon: STAT_ICON_MAP.FlatSpellBlockMod,
          name: "Magic Resist",
          value: totalStats.magicResist,
          color: "text-purple-300",
          suffix: "",
        },
        {
          icon: STAT_ICON_MAP.FlatHPPoolMod,
          name: "Health",
          value: totalStats.health,
          color: "text-green-400",
          suffix: "",
        },
        {
          icon: STAT_ICON_MAP.FlatHPRegenMod,
          name: "Health Regen",
          value: totalStats.healthRegen.toFixed(1),
          color: "text-green-500",
          suffix: "",
        },
      ],
    },
    {
      title: "Movement",
      description: "Increases Gold Gain",
      value: calculateGoldGain(totalStats),
      stats: [
        {
          icon: STAT_ICON_MAP.FlatMovementSpeedMod,
          name: "MS",
          value: totalStats.moveSpeed.toFixed(0),
          color: "text-cyan-300",
          suffix: "",
        },
        {
          icon: STAT_ICON_MAP.PercentMovementSpeedMod,
          name: "% MS",
          value: (totalStats.moveSpeedPercent * 100).toFixed(0),
          color: "text-cyan-400",
          suffix: "%",
        },
      ],
    },
  ];

  return (
    <div className="bg-[#091428] p-4 pb-6 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      <div className="grid grid-cols-1 gap-2">
        {statGroups?.map((group, index) => (
          <div key={index} className="flex flex-col items-center">
            <h3 className="text-lg font-beaufort text-[#C8AA6E]">
              {group.title}
            </h3>
            <p className="text-sm font-spiegel italic text-white/75 mb-1">
              {group.description}{" "}
              <span className="font-bold">({group.value.toFixed(1)})</span>
            </p>
            <img src={gold_divider_sm} className="w-full mb-2" />
            <div className="grid grid-cols-2 gap-1 w-full">
              {group.stats?.map((stat, statIndex) => (
                <div
                  key={statIndex}
                  className="w-full flex items-center justify-between bg-[#0A1428] px-1 py-0.5 border border-[#0397AB]/30 rounded-none"
                >
                  <div className={`${stat.color} text-sm font-bold`}>
                    <img
                      src={stat.icon}
                      alt={stat.name}
                      className="h-4 w-4 inline-block mr-2"
                    />
                    {stat.name}
                  </div>

                  <div className="text-sm font-bold text-white">
                    +{formatBigNumbers(stat?.value || 0)}
                    {stat.suffix}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
