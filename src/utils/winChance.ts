import { Item, Rank } from "../types";
import { RANK_DIFFICULTY_MULTIPLIER } from "./ranks";
import { calculateTotalStats } from "./stats";

export const calculateWinChance = (
  inventory: Item[],
  rank: Rank,
  lp: number
): number => {
  const baseWinChance = 0.5;
  const totalStats = calculateTotalStats(inventory);
  const totalGoldValue = inventory.reduce((sum, item) => sum + item.cost, 0);

  const statBonus =
    (totalStats.ad * 35 +
      totalStats.ap * 20 +
      totalStats.armor * 20 +
      totalStats.magicResist * 20 +
      totalStats.critChance * 40 +
      totalStats.abilityHaste * 50 +
      totalStats.attackSpeed * 25 +
      totalStats.mana +
      totalStats.healthRegen * 3 +
      totalStats.manaRegen * 4 +
      totalStats.lethality * 30 +
      totalStats.armorPen * 40 +
      totalStats.magicPen * 30) *
    0.0001;

  const rankMultiplier = RANK_DIFFICULTY_MULTIPLIER[rank];
  const lpScaling = (lp / 100) * 0.1;

  const maxRequiredGold =
    15000 * (rankMultiplier / RANK_DIFFICULTY_MULTIPLIER.CHALLENGER);

  const goldValueContribution = Math.min(
    0.25,
    (totalGoldValue / maxRequiredGold) * 0.25
  );

  return Math.min(
    0.75,
    (baseWinChance + statBonus + goldValueContribution) /
      (rankMultiplier + lpScaling)
  );
};
