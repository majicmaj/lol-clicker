import { Item } from '../types';

export const calculateTotalStats = (inventory: Item[]): { [key: string]: number } => {
  return inventory.reduce((total, item) => ({
    ad: (total.ad || 0) + (item.stats.ad || 0),
    ap: (total.ap || 0) + (item.stats.ap || 0),
    armor: (total.armor || 0) + (item.stats.armor || 0),
    magicResist: (total.magicResist || 0) + (item.stats.magicResist || 0),
    critChance: (total.critChance || 0) + (item.stats.critChance || 0),
    lethality: (total.lethality || 0) + (item.stats.lethality || 0),
    armorPen: (total.armorPen || 0) + (item.stats.armorPen || 0),
    magicPen: (total.magicPen || 0) + (item.stats.magicPen || 0),
    magicPenPercent: (total.magicPenPercent || 0) + (item.stats.magicPenPercent || 0),
    moveSpeed: (total.moveSpeed || 0) + (item.stats.moveSpeed || 0),
    moveSpeedPercent: (total.moveSpeedPercent || 0) + (item.stats.moveSpeedPercent || 0),
    abilityHaste: (total.abilityHaste || 0) + (item.stats.abilityHaste || 0),
    attackSpeed: (total.attackSpeed || 0) + (item.stats.attackSpeed || 0),
    health: (total.health || 0) + (item.stats.health || 0),
    healthRegen: (total.healthRegen || 0) + (item.stats.healthRegen || 0),
    mana: (total.mana || 0) + (item.stats.mana || 0),
    manaRegen: (total.manaRegen || 0) + (item.stats.manaRegen || 0),
  }), {
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
  });
};

export const calculateCritChance = (inventory: Item[]): number => {
  return inventory.reduce((sum, item) => sum + (item.stats.critChance || 0), 0);
};