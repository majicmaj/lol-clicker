import { Item, Rank } from "../types";
import { RANK_DIFFICULTY_MULTIPLIER } from "./ranks";
import { calculateTotalStats } from "./stats";

export const calculateLpGain = (
  inventory: Item[],
  rank: Rank,
  lp: number
): number => {
  const baseGain = 20;
  const totalStats = calculateTotalStats(inventory);

  // AD synergies - only work if you have AD
  const adBonus = totalStats.ad * 0.2;
  const lethalityBonus = totalStats.ad > 0 ? totalStats.lethality * 0.8 : 0;
  const attackSpeedBonus = totalStats.ad > 0 ? totalStats.attackSpeed * 1.0 : 0;
  const critBonus = totalStats.ad > 0 ? totalStats.critChance * 100 : 0;

  // AP synergies - only work if you have AP
  // const apBonus = totalStats.ap * 0.2;
  // const magicPenBonus =
  //   totalStats.ap > 0
  //     ? totalStats.magicPen * 0.8 + totalStats.magicPenPercent * 40
  //     : 0;
  // const abilityHasteBonus =
  //   totalStats.ap > 0 ? totalStats.abilityHaste * 0.6 : 0;

  const rankMultiplier = RANK_DIFFICULTY_MULTIPLIER[rank];
  const lpScaling = (lp / 100) * 0.2;

  return Math.max(
    1,
    Math.round(
      (baseGain + adBonus + lethalityBonus + attackSpeedBonus + critBonus) /
        // + apBonus +
        // magicPenBonus +
        // abilityHasteBonus
        (rankMultiplier + lpScaling) ** 1.3
    )
  );
};

export const calculateLpLoss = (
  inventory: Item[],
  rank: Rank,
  lp: number
): number => {
  const baseLoss = 20;
  const totalStats = calculateTotalStats(inventory);

  const armorReduction = totalStats.armor * 0.4;
  const mrReduction = totalStats.magicResist * 0.4;
  const healthReduction = totalStats.health * 0.02;

  const rankMultiplier = RANK_DIFFICULTY_MULTIPLIER[rank];
  const lpScaling = (lp / 100) * 0.2;

  return Math.round(
    Math.max(
      1,
      baseLoss +
        (rankMultiplier + lpScaling) ** 1.3 -
        armorReduction -
        mrReduction -
        healthReduction
    )
  );
};
