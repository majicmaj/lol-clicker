import { ItemStats } from "../types";

export const calculateGoldGain = (totalStats: ItemStats) => {
  const { moveSpeed = 0, moveSpeedPercent = 0 } = totalStats;
  //   const percentAdjustedMoveSpeed = moveSpeed * (1 + moveSpeedPercent / 100);

  return Math.round(
    10 * (1 + (moveSpeed * 0.1 + (moveSpeedPercent * moveSpeed) / 100) / 10)
  );
};
