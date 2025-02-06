import { ItemStats } from "../types";
import { RANK_DIFFICULTY_MULTIPLIER } from "./ranks";

const nLogN = (n: number) => n * Math.log(n);

export const calculateGoldGain = (
  totalStats: ItemStats,
  rank: string,
  lp: number
): number => {
  const {
    moveSpeed = 0,
    moveSpeedPercent = 0,
    tenacity = 0,
    healAndShieldPower = 0,
  } = totalStats;

  const statsBonus =
    (moveSpeed + moveSpeedPercent * 4 + tenacity + healAndShieldPower) / 4;

  const lpScaling = lp / 100;

  const rankMultiplier = nLogN(
    RANK_DIFFICULTY_MULTIPLIER[
      rank as keyof typeof RANK_DIFFICULTY_MULTIPLIER
    ] + lpScaling
  );

  return Math.max(10, Math.round(10 + statsBonus - rankMultiplier));
};
