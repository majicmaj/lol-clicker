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
  // Create a temporary copy of the inventory so we can remove components as they’re used.
  // const tempInventory =
  // let componentCost = 0;

  // // Loop through each required component in the recipe.
  // for (const componentId of item.from) {
  //   // Find the index of a matching component in the temporary inventory.
  //   const index = tempInventory.findIndex(
  //     (invItem) => invItem.id === componentId
  //   );
  //   if (index !== -1) {
  //     // Add its cost and remove it so it can't be used again.
  //     componentCost += tempInventory[index].cost;

  //     // If its count > 1, decrement the count. Otherwise, remove it from the inventory.
  //     if (tempInventory[index].count && tempInventory[index].count > 1) {
  //       tempInventory[index].count -= 1;
  //     } else {
  //       tempInventory.splice(index, 1);
  //     }
  //   }

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
    else {
      return 0;
    }
  }

  // The discounted cost is the item's cost minus the total component cost.
  return Math.max(0, item.cost - componentCost);
};

export const purchaseItem = (
  gameState: GameState,
  item: Item,
  quantity: number
): GameState | null => {
  const cost = item.cost * quantity;

  if (gameState.player.gold < cost) {
    return null; // Not enough gold
  }

  // Ensure deep copy of inventory
  const newInventory = { ...gameState.inventory };

  if (newInventory[item.id]) {
    newInventory[item.id] = {
      ...newInventory[item.id], // Ensure new reference
      count: newInventory[item.id].count + quantity, // Correctly increment count
    };
  } else {
    newInventory[item.id] = { ...item, count: quantity }; // Create new entry
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
