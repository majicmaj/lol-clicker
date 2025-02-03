import { GameState, Item } from "../types";

export const sellItem = (
  gameState: GameState,
  itemIndex: number
): GameState => {
  const item = gameState.inventory[itemIndex];
  if (!item) return gameState;

  const sellValue = Math.floor(item.cost * 0.7);
  const newInventory = [...gameState.inventory];

  if (item.count && item.count > 1) {
    newInventory[itemIndex] = { ...item, count: item.count - 1 };
  } else {
    newInventory.splice(itemIndex, 1);
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
  inventory: Item[]
): Item[] => {
  const inventoryIds = inventory?.map((item) => item.id);

  return items.filter(
    (item) =>
      item.from.length > 0 &&
      item.from.some((componentId) => inventoryIds.includes(componentId)) &&
      !inventoryIds.includes(item.id)
  );
};

export const calculateDiscountedCost = (
  item: Item,
  inventory: Item[]
): number => {
  // Create a temporary copy of the inventory so we can remove components as they’re used.
  const tempInventory = [...inventory];
  let componentCost = 0;

  // Loop through each required component in the recipe.
  for (const componentId of item.from) {
    // Find the index of a matching component in the temporary inventory.
    const index = tempInventory.findIndex(
      (invItem) => invItem.id === componentId
    );
    if (index !== -1) {
      // Add its cost and remove it so it can't be used again.
      componentCost += tempInventory[index].cost;

      // If its count > 1, decrement the count. Otherwise, remove it from the inventory.
      if (tempInventory[index].count && tempInventory[index].count > 1) {
        tempInventory[index].count -= 1;
      } else {
        tempInventory.splice(index, 1);
      }
    }
  }

  // The discounted cost is the item's cost minus the total component cost.
  return Math.max(0, item.cost - componentCost);
};

export const purchaseItem = (
  gameState: GameState,
  item: Item
): GameState | null => {
  const discountedCost = calculateDiscountedCost(item, gameState.inventory);

  if (gameState.player.gold < discountedCost) {
    return null;
  }

  const newInventory = [...gameState.inventory];

  // Find the item's components in the inventory and decrement their counts / remove them if they become 0.
  for (const componentId of item.from) {
    const index = newInventory.findIndex(
      (invItem) => invItem.id === componentId
    );
    if (index !== -1) {
      if (newInventory[index].count && newInventory[index].count > 1) {
        newInventory[index].count -= 1;
      } else {
        newInventory.splice(index, 1);
      }
    }
  }

  // Find the index of the item in the inventory.
  const index = newInventory.findIndex((invItem) => invItem.id === item.id);

  if (index !== -1) {
    // If the item is already in the inventory, increment its count.
    newInventory[index] = {
      ...newInventory[index],
      count: newInventory[index].count + 1,
    };
  } else {
    // Otherwise, add the item to the inventory.
    newInventory.push({ ...item, count: 1 });
  }

  return {
    ...gameState,
    player: {
      ...gameState.player,
      gold: gameState.player.gold - discountedCost,
      lastGoldChange: -discountedCost,
    },
    inventory: newInventory,
  };
};
