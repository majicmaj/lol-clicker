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
      item.from.length > 0 &&
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
  const tempInventory = { ...inventory };
  let componentCost = 0;

  for (const componentId of item.from) {
    if (componentId in tempInventory) {
      componentCost += tempInventory[componentId].cost;

      if (
        tempInventory[componentId].count &&
        tempInventory[componentId].count > 1
      ) {
        tempInventory[componentId].count -= 1;
      } else {
        delete tempInventory[componentId];
      }
    }

    // If a component is missing, the item cannot be purchased.
    // else {
    //   return 0;
    // }
  }

  // The discounted cost is the item's cost minus the total component cost.
  return Math.max(0, item.cost - componentCost);
};

export const purchaseItem = (
  gameState: GameState,
  item: Item
): GameState | null => {
  const cost = calculateDiscountedCost(item, gameState.inventory);

  if (cost === 0) return null;

  const newInventory = { ...gameState.inventory };

  if (item.id in newInventory) {
    newInventory[item.id].count += 1;
  } else {
    newInventory[item.id] = { ...item, count: 1 };
  }

  // remove components from inventory
  for (const componentId of item.from) {
    if (newInventory[componentId]?.count > 1) {
      newInventory[componentId].count -= 1;
    } else {
      delete newInventory[componentId];
    }
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
