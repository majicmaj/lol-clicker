import { GameState, Item } from "../types";

export const sellItem = (
  gameState: GameState,
  id: string,
  count: number
): GameState => {
  const item = gameState.inventory[id];
  if (!item) return gameState;

  const sellValue = Math.floor(item.cost * 0.7);
  const newInventory = { ...gameState.inventory };

  if (item.count && item.count > count) {
    newInventory[id].count -= count;
  } else {
    delete newInventory[id];
  }

  return {
    ...gameState,
    player: {
      ...gameState.player,
      gold: gameState.player.gold + sellValue,
      lastGoldChange: sellValue,
    },
    inventory: newInventory,
  };
};

export const getAvailableUpgrades = (
  items: Item[],
  inventory: Record<string, Item>
): Record<string, Item> => {
  const inventoryIds = Object.keys(inventory);

  const upgrades = items.filter(
    (item) =>
      item.from?.length > 0 &&
      item.from.some((componentId) => inventoryIds.includes(componentId)) &&
      !inventoryIds.includes(item.id)
  );

  return upgrades.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<string, Item>);
};

export const calculateDiscountedCost = (
  item: Item,
  inventory: Record<string, Item>
): number => {
  const discount = Object.values(inventory).reduce(
    (acc, invItem) => acc + (invItem?.discount || 0),
    0
  );

  return Math.max(0, item.cost - discount);
};

export const purchaseItem = (
  gameState: GameState,
  item: Item,
  quantity = 1
): GameState | null => {
  const cost = calculateDiscountedCost(item, gameState.inventory) * quantity;

  if (gameState.player.gold < cost) return null;

  const newInventory = { ...gameState.inventory };

  if (item.id in newInventory) {
    newInventory[item.id].count += quantity;
  } else {
    newInventory[item.id] = { ...item, count: quantity };
  }

  return {
    ...gameState,
    player: {
      ...gameState.player,
      gold: gameState.player.gold - cost,
      lastGoldChange: -cost,
    },
    inventory: newInventory,
  };
};
