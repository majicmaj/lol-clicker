import { ItemStats } from "../types";
import { RANK_DIFFICULTY_MULTIPLIER } from "./ranks";

export const calculateGoldGain = (
  totalStats: ItemStats,
  rank: string,
  lp: number
): number => {
  const { moveSpeed = 0, moveSpeedPercent = 0 } = totalStats;

  const msBonus = moveSpeed * 0.1 + (moveSpeedPercent * moveSpeed) / 100;

  const lpScaling = lp / 10000;
  const rankMultiplier =
    RANK_DIFFICULTY_MULTIPLIER[
      rank as keyof typeof RANK_DIFFICULTY_MULTIPLIER
    ] +
    lpScaling ** 1.1;

  return Math.max(10, Math.round(10 * (1 + msBonus / 10) - rankMultiplier));
};
