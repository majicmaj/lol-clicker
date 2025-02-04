import { GOLD_EFFICIENCY } from "../constants/goldEfficiency";
import { Champion, Item, Rank } from "../types";
import { RANK_DIFFICULTY_MULTIPLIER } from "./ranks";
import { calculateTotalStats } from "./stats";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const getStatBonus = (
  stat: keyof typeof GOLD_EFFICIENCY,
  value: number
): number =>
  value ? value * GOLD_EFFICIENCY[stat as keyof typeof GOLD_EFFICIENCY] : 0;

export const calculateWinChance = (
  inventory: Record<string, Item>,
  rank: Rank,
  lp: number,
  champions: Champion[]
): number => {
  const baseWinChance = 0.5;
  const totalStats = calculateTotalStats(inventory);

  const apBonus = getStatBonus("abilityPower", totalStats.ap);
  const abilityHasteBonus = getStatBonus(
    "abilityHaste",
    totalStats.abilityHaste
  );
  const manaBonus = getStatBonus("mana", totalStats.mana);
  const manaRegenBonus = getStatBonus("manaRegen", totalStats.manaRegen);
  const magicPenBonus = getStatBonus("magicPen", totalStats.magicPen);

  const statBonus =
    (apBonus + abilityHasteBonus + manaBonus + manaRegenBonus + magicPenBonus) /
    5000;

  const rankMultiplier = (RANK_DIFFICULTY_MULTIPLIER[rank] + lp / 10000) ** 1.1;

  // having 150 Champions gives you a 100% win chance bonus
  const perChampionBonus = champions.length / 150;

  return clamp(
    (baseWinChance + statBonus + perChampionBonus) / rankMultiplier,
    0.05,
    99999.95
  );
};
