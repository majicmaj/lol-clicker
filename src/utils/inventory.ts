import { GameState, Item } from '../types';

export const sellItem = (gameState: GameState, itemIndex: number): GameState => {
  const item = gameState.inventory[itemIndex];
  if (!item) return gameState;

  const sellValue = Math.floor(item.cost * 0.7);
  const newInventory = [...gameState.inventory];
  newInventory.splice(itemIndex, 1);

  return {
    ...gameState,
    player: {
      ...gameState.player,
      gold: gameState.player.gold + sellValue
    },
    inventory: newInventory
  };
};

export const getAvailableUpgrades = (items: Item[], inventory: Item[]): Item[] => {
  const inventoryIds = inventory.map(item => item.id);
  
  return items.filter(item => 
    item.from.length > 0 &&
    item.from.some(componentId => inventoryIds.includes(componentId)) &&
    !inventoryIds.includes(item.id)
  );
};

export const calculateDiscountedCost = (item: Item, inventory: Item[]): number => {
  const componentCost = item.from.reduce((total, componentId) => {
    const componentInInventory = inventory.find(invItem => invItem.id === componentId);
    return total + (componentInInventory ? componentInInventory.cost : 0);
  }, 0);
  
  return Math.max(0, item.cost - componentCost);
};

export const purchaseItem = (gameState: GameState, item: Item): GameState | null => {
  const discountedCost = calculateDiscountedCost(item, gameState.inventory);
  
  if (gameState.player.gold < discountedCost) {
    return null;
  }
  
  const newInventory = gameState.inventory.filter(invItem => 
    !item.from.includes(invItem.id)
  );
  
  return {
    ...gameState,
    player: {
      ...gameState.player,
      gold: gameState.player.gold - discountedCost
    },
    inventory: [...newInventory, item]
  };
};