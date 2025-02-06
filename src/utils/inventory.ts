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
  // If there are no components, return the original cost.
  if (!item.from) return item.cost;

  // Build a frequency map of components from item.from.
  const componentCounts = item.from.reduce((acc, component) => {
    acc[component] = (acc[component] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Start with the base cost.
  let cost = item.cost;

  // For each unique component, subtract the appropriate discount.
  for (const component in componentCounts) {
    // Only proceed if the component exists in the inventory.
    if (component in inventory) {
      // Determine how many of this component can actually be discounted.
      const applicableCount = Math.min(
        inventory[component].count,
        componentCounts[component]
      );
      // Subtract the total discount for this component.
      cost -= inventory[component].cost * applicableCount;
    }
  }

  // Ensure the cost does not go below zero.
  return Math.max(0, cost);
};
export const purchaseItem = (
  gameState: GameState,
  item: Item,
  quantity = 1
): GameState | null => {
  // Calculate total cost based on the discounted cost for one item
  const costPerItem = calculateDiscountedCost(item, gameState.inventory);
  const totalCost = costPerItem * quantity;

  // Not enough gold? Abort the purchase.
  if (gameState.player.gold < totalCost) return null;

  // Make a shallow copy of the inventory for our updates.
  const newInventory = { ...gameState.inventory };

  // If the item uses discount components, remove them from the inventory.
  if (item.from) {
    // Create a frequency map for the discount components required per item.
    // For example, if item.from is ['wood', 'wood', 'nail'], then componentCounts
    // will be { wood: 2, nail: 1 }.
    const componentCounts = item.from.reduce((acc, component) => {
      acc[component] = (acc[component] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // For each discount component, remove the amount used.
    // Multiply the per-item requirement by the quantity purchased.
    for (const component in componentCounts) {
      if (newInventory[component]) {
        const requiredCount = componentCounts[component] * quantity;
        const availableCount = newInventory[component].count;
        const removeCount = Math.min(availableCount, requiredCount);

        // Update the component in the inventory.
        newInventory[component] = {
          ...newInventory[component],
          count: availableCount - removeCount,
        };

        // (Optional) If count reaches 0, you might choose to remove the key entirely:
        if (newInventory[component].count === 0) {
          delete newInventory[component];
        }
      }
    }
  }

  // Add the purchased item to the inventory.
  // If it already exists, just increment its count.
  if (newInventory[item.id]) {
    newInventory[item.id] = {
      ...newInventory[item.id],
      count: newInventory[item.id].count + quantity,
    };
  } else {
    newInventory[item.id] = { ...item, count: quantity };
  }

  // Return the updated game state with the new inventory and reduced gold.
  return {
    ...gameState,
    player: {
      ...gameState.player,
      gold: gameState.player.gold - totalCost,
      lastGoldChange: -totalCost,
    },
    inventory: newInventory,
  };
};
