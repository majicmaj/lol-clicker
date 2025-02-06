import { Item, Rank } from "../types";
import { getStatBonus } from "./lpCalculations";
import { RANK_DIFFICULTY_MULTIPLIER } from "./ranks";
import { calculateTotalStats } from "./stats";

export const calculateLpGain = (
  inventory: Record<string, Item>,
  rank: Rank,
  lp: number
): number => {
  const baseGain = 20;
  const totalStats = calculateTotalStats(inventory);

  const lethalityBonus = getStatBonus("lethality", totalStats?.lethality);
  const armorPenBonus = getStatBonus("armorPen", totalStats?.armorPen);
  const magicPenBonus = getStatBonus("magicPen", totalStats?.magicPen);
  const magicPenPercentBonus = getStatBonus(
    "magicPenPercent",
    totalStats?.magicPenPercent
  );
  const statsBonus =
    (adBonus +
      lethalityBonus +
      armorPenBonus +
      attackSpeedBonus +
      critBonus +
      lifeStealBonus) /
    100;

  const lpScaling = (lp / 10000) * 0.3;
  const rankMultiplier = (RANK_DIFFICULTY_MULTIPLIER[rank] + lpScaling) ** 1.1;

  return Math.max(1, Math.round((baseGain + statsBonus) / rankMultiplier));
};
