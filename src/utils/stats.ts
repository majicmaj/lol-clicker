import { Item } from "../types";

export const calculateTotalStats = (
  inventory: Record<string, Item>
): { [key: string]: number } => {
  const totalStats: { [key: string]: number } = {
    ad: 0,
    ap: 0,
    armor: 0,
    magicResist: 0,
    critChance: 0,
    lethality: 0,
    armorPen: 0,
    magicPen: 0,
    magicPenPercent: 0,
    moveSpeed: 0,
    moveSpeedPercent: 0,
    abilityHaste: 0,
    attackSpeed: 0,
    health: 0,
    healthRegen: 0,
    mana: 0,
    manaRegen: 0,
    omnivamp: 0,
    lifesteal: 0,
  };

  for (const item of Object.values(inventory)) {
    for (const [key, value] of Object.entries(item.stats)) {
      totalStats[key] = (totalStats[key] || 0) + (item.count || 1) * value;
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
