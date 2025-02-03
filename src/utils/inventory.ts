import { GameState, Item } from "../types";

export const sellItem = (
  gameState: GameState,
  itemIndex: number
): GameState => {
  const item = gameState.inventory[itemIndex];
  if (!item) return gameState;

  const sellValue = Math.floor(item.cost * 0.7);
  const newInventory = [...gameState.inventory];
  newInventory.splice(itemIndex, 1);

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
      tempInventory.splice(index, 1);
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

  // Build a frequency map for the items that should be removed
  const removalMap: { [id: string]: number } = {};
  item.from.forEach((id) => {
    removalMap[id] = (removalMap[id] || 0) + 1;
  });

  // Create a new inventory by removing only the required amount of items
  const newInventory = [];
  for (const invItem of gameState.inventory) {
    // If this item is required and we still need to remove one, skip it
    if (removalMap[invItem.id] && removalMap[invItem.id] > 0) {
      removalMap[invItem.id]--;
    } else {
      newInventory.push(invItem);
    }
  }

  return {
    ...gameState,
    player: {
      ...gameState.player,
      gold: gameState.player.gold - discountedCost,
      lastGoldChange: -discountedCost,
    },
    inventory: [...newInventory, item],
  };
};
