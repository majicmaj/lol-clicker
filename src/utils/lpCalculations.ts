import { Item } from '../types';
import { calculateTotalStats } from './stats';

export const calculateLpGain = (inventory: Item[]): number => {
  const baseGain = 20;
  const totalStats = calculateTotalStats(inventory);
  
  // AD synergies - only work if you have AD
  const adBonus = totalStats.ad * 0.5;
  const lethalityBonus = totalStats.ad > 0 ? totalStats.lethality * 0.8 : 0;
  const attackSpeedBonus = totalStats.ad > 0 ? totalStats.attackSpeed * 1.0 : 0;
  const critBonus = totalStats.ad > 0 ? totalStats.critChance * 100 : 0;
  
  // AP synergies - only work if you have AP
  const apBonus = totalStats.ap * 0.5;
  const magicPenBonus = totalStats.ap > 0 ? (totalStats.magicPen * 0.8 + totalStats.magicPenPercent * 40) : 0;
  const abilityHasteBonus = totalStats.ap > 0 ? totalStats.abilityHaste * 0.6 : 0;
  
  return baseGain + adBonus + lethalityBonus + attackSpeedBonus + critBonus + apBonus + magicPenBonus + abilityHasteBonus;
};

export const calculateLpLoss = (inventory: Item[]): number => {
  const baseLoss = 15;
  const armorReduction = inventory.reduce((sum, item) => sum + (item.stats.armor || 0) * 0.4, 0);
  const mrReduction = inventory.reduce((sum, item) => sum + (item.stats.magicResist || 0) * 0.4, 0);
  
  return Math.max(5, baseLoss - armorReduction - mrReduction);
};