import { Item } from "../types";

export const calculateTotalStats = (
  inventory: Record<string, Item>
): { [key: string]: number } => {
  const totalStats: { [key: string]: number } = {};

  for (const item of Object.values(inventory)) {
    for (const [key, value] of Object.entries(item.stats)) {
      if (typeof value === "number") {
        totalStats[key] =
          (totalStats[key] || 0) + (value || 1) * (item.count || 1);
      }
    }
  }
  return totalStats;
};

export const calculateCritChance = (inventory: Item[]): number => {
  return inventory.reduce(
    (sum, item) => sum + (item.count || 1) * (item.stats.critChance || 0),
    0
  );
};
