import { Champion, Item, Rank } from "../types";
import { RANK_DIFFICULTY_MULTIPLIER } from "./ranks";
import { calculateTotalStats } from "./stats";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const calculateWinChance = (
  inventory: Record<string, Item>,
  rank: Rank,
  lp: number,
  champions: Champion[]
): number => {
  const baseWinChance = 0.5;
  const totalStats = calculateTotalStats(inventory);

  const statBonus =
    // totalStats.ad * 35 +
    // totalStats.armor * 20 +
    // totalStats.magicResist * 20 +
    // totalStats.critChance * 40 +
    // totalStats.attackSpeed * 25 +
    // totalStats.healthRegen * 3 +
    // totalStats.lethality * 30 +
    // totalStats.armorPen * 40 +
    (totalStats.ap * 20 +
      totalStats.abilityHaste * 50 +
      totalStats.mana +
      totalStats.manaRegen * 4 +
      totalStats.magicPen * 30) *
    0.0002;

  const rankMultiplier = RANK_DIFFICULTY_MULTIPLIER[rank];
  const lpScaling = (lp / 100) * 0.2;

  // having 150 champions gives you +0.25 win chance
  const perChampionBonus = champions.length / 150;

  return clamp(
    (baseWinChance + statBonus + perChampionBonus) /
      (rankMultiplier + lpScaling),
    0.05,
    0.95
  );
};
