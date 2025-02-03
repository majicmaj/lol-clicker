import { ItemStats } from "../types";
import { RANK_DIFFICULTY_MULTIPLIER } from "./ranks";

export const calculateGoldGain = (
  totalStats: ItemStats,
  rank: string,
  lp: number
): number => {
  const { moveSpeed = 0, moveSpeedPercent = 0 } = totalStats;
  //   const percentAdjustedMoveSpeed = moveSpeed * (1 + moveSpeedPercent / 100);

  const rankMultiplier =
    RANK_DIFFICULTY_MULTIPLIER[rank as keyof typeof RANK_DIFFICULTY_MULTIPLIER];

  const lpScaling = lp / 100;

  return Math.round(
    10 * (1 + (moveSpeed * 0.1 + (moveSpeedPercent * moveSpeed) / 100) / 10) -
      (rankMultiplier + lpScaling)
  );
};
