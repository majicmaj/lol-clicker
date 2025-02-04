import { GOLD_EFFICIENCY } from "../constants/goldEfficiency";
import { Item, Rank } from "../types";
import { RANK_DIFFICULTY_MULTIPLIER } from "./ranks";
import { calculateTotalStats } from "./stats";

const getStatBonus = (
  stat: keyof typeof GOLD_EFFICIENCY,
  value: number
): number =>
  value ? value * GOLD_EFFICIENCY[stat as keyof typeof GOLD_EFFICIENCY] : 0;

export const calculateLpGain = (
  inventory: Record<string, Item>,
  rank: Rank,
  lp: number
): number => {
  const baseGain = 20;
  const totalStats = calculateTotalStats(inventory);

  const adBonus = getStatBonus("attackDamage", totalStats?.ad);
  const lethalityBonus = getStatBonus("lethality", totalStats?.lethality);
  const armorPenBonus = getStatBonus("armorPen", totalStats?.armorPen);
  const attackSpeedBonus = getStatBonus("magicPen", totalStats?.attackSpeed);
  const critBonus = getStatBonus("critChance", totalStats?.critChance);
  const lifeStealBonus = getStatBonus("lifesteal", totalStats?.lifeSteal);

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

  console.log({
    baseGain,
    statsBonus,
    rankMultiplier,
  });
  return Math.max(1, Math.round((baseGain + statsBonus) / rankMultiplier));
};

export const calculateLpLoss = (
  inventory: Record<string, Item>,
  rank: Rank,
  lp: number
): number => {
  const baseLoss = 19;
  const totalStats = calculateTotalStats(inventory);

  const armorReduction = getStatBonus("armor", totalStats.armor);
  const mrReduction = getStatBonus("magicResist", totalStats.magicResist);
  const healthReduction = getStatBonus("health", totalStats.health);

  const statsBonus = (armorReduction + mrReduction + healthReduction) / 100;

  const rankMultiplier = RANK_DIFFICULTY_MULTIPLIER[rank];
  const lpScaling = lp / 10000;

  return Math.round(
    Math.max(
      -100000000,
      baseLoss + (rankMultiplier + lpScaling) ** 1.1 - statsBonus
    )
  );
};
