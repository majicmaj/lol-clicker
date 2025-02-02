import { Item, Rank } from '../types';
import { RANK_DIFFICULTY_MULTIPLIER } from './ranks';
import { calculateTotalStats } from './stats';

export const calculateWinChance = (inventory: Item[], rank: Rank, lp: number): number => {
  const baseWinChance = 0.5;
  const totalStats = calculateTotalStats(inventory);
  const totalGoldValue = inventory.reduce((sum, item) => sum + item.cost, 0);
  
  const statBonus = (
    (totalStats.ad * (1/35)) +
    (totalStats.ap * (1/20)) +
    (totalStats.armor * (1/20)) +
    (totalStats.magicResist * (1/20)) +
    (totalStats.critChance * (1/40)) +
    (totalStats.abilityHaste * (1/50)) +
    (totalStats.attackSpeed * (1/25)) +
    (totalStats.health * (1/2.67)) +
    (totalStats.mana * (1/1)) +
    (totalStats.healthRegen * (1/3)) +
    (totalStats.manaRegen * (1/4)) +
    (totalStats.lethality * (1/30)) +
    (totalStats.armorPen * (1/40)) +
    (totalStats.magicPen * (1/30))
  ) * 0.01;

  const rankMultiplier = RANK_DIFFICULTY_MULTIPLIER[rank];
  const lpScaling = lp / 100 * 0.1;
  const maxRequiredGold = 15000 * (rankMultiplier / RANK_DIFFICULTY_MULTIPLIER.CHALLENGER);
  const goldValueContribution = Math.min(0.25, totalGoldValue / maxRequiredGold * 0.25);

  return Math.min(0.75, (baseWinChance + statBonus + goldValueContribution) / (rankMultiplier + lpScaling));
};