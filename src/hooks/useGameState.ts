import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Champion, GameState, Item } from "../types";
import { getItemStats } from "../utils/extractStatFromDescription";
import { SPECIAL_ITEMS } from "../constants/specialItems";

const STORAGE_KEY = "league-clicker-save";
const ITEM_API_URL =
  "https://ddragon.leagueoflegends.com/cdn/15.2.1/data/en_US/item.json";

// Initial game state
const INITIAL_STATE: GameState = {
  player: {
    id: "",
    username: String(Math.random()).slice(2, 8),
    rank: "IRON",
    division: "4",
    lp: 0,
    gold: 500,
    lastGoldChange: 0,
    lastLpChange: 0,
    wins: 0,
    losses: 0,
    lpHistory: [],
    rankHistory: [],
    divisionHistory: [],
    lastGameTime: Date.now(),
    inactivityWarning: false,
    champions: [],
  },
  inventory: {},
  baseGoldPerClick: 10,
  baseLpPerClick: 20,
};

// Function to get game state from Local Storage
const getGameState = (): GameState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : INITIAL_STATE;
};

// Function to save game state to Local Storage
const saveGameState = (state: GameState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

// Function to reset game state
const resetGameState = (): GameState => {
  localStorage.removeItem(STORAGE_KEY);
  return INITIAL_STATE;
};
// Function to fetch items from API
const fetchItems = async (): Promise<Item[]> => {
  const response = await fetch(ITEM_API_URL);
  if (!response.ok) throw new Error("Failed to fetch items");

  const data = await response.json();
  const blacklistedItems = ["Empyrean Promise"];

  const newItems = Object.entries(data.data)
    .filter(
      ([, item]: [string, any]) =>
        item.maps["11"] &&
        !blacklistedItems.includes(item.name) &&
        item.gold.purchasable
    )
    .map(([id, item]: [string, any]) => {
      return {
        id,
        name: item.name,
        description: item.description,
        cost: item.gold.total,
        image: `https://ddragon.leagueoflegends.com/cdn/15.2.1/img/item/${item.image.full}`,
        ...getItemStats(item),
        count: 1,
        from: item?.from?.length ? item.from : [],
      };
    });

  const fullItems = [...newItems, ...SPECIAL_ITEMS];

  return fullItems;
};

const fetchChampions = async () => {
  // try {
  //   const response = await fetch(
  //     "https://ddragon.leagueoflegends.com/cdn/15.2.1/data/en_US/champion.json"
  //   );
  //   const data = await response.json();

  //   const processedChampions = (
  //     Object.values(data.data || {}) as Champion[]
  //   ).map((champion: Champion) => ({
  //     id: champion.id,
  //     name: champion.name,
  //     title: champion.title,
  //     image: `https://ddragon.leagueoflegends.com/cdn/15.2.1/img/champion/${champion.image.full}`,
  //     stats: champion.stats,
  //     info: champion.info,
  //     tags: champion.tags,
  //     inventory: [],
  //   }));

  //   setChampions(processedChampions);
  //   setLoading(false);
  // } catch (error) {
  //   console.error("Error fetching champions:", error);
  //   setLoading(false);
  // }

  const response = await fetch(
    "https://ddragon.leagueoflegends.com/cdn/15.2.1/data/en_US/champion.json"
  );
  if (!response.ok) throw new Error("Failed to fetch champions");

  const data = await response.json();

  return Object.values(data.data || {}).map((champion: any) => ({
    id: champion.id,
    name: champion.name,
    title: champion.title,
    image: `https://ddragon.leagueoflegends.com/cdn/15.2.1/img/champion/${champion.image.full}`,
    stats: champion.stats,
    info: champion.info,
    tags: champion.tags,
    inventory: [],
  }));
};

// Hook to manage game state using React Query
export const useGameState = () => {
  const queryClient = useQueryClient();

  // Get game state from Local Storage
  const { data: gameState } = useQuery({
    queryKey: ["gameState"],
    queryFn: () => getGameState(), // Ensure function is synchronous
    staleTime: Infinity, // Prevents refetching unnecessarily
    gcTime: Infinity, // Prevents garbage collection
    initialData: getGameState(), // Ensure Local Storage loads initially
  });

  // Update game state mutation
  const updateGameState = useMutation({
    mutationFn: (newState: GameState) => {
      saveGameState(newState);
      return newState;
    },
    onSuccess: (newState) => {
      queryClient.setQueryData(["gameState"], newState);
    },
  });

  // Reset game mutation
  const resetGame = useMutation({
    mutationFn: resetGameState,
    onSuccess: () => {
      queryClient.setQueryData(["gameState"], INITIAL_STATE);
    },
  });

  // Fetch items from API
  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
    staleTime: Infinity, // Keep the data fresh until user refreshes
  });

  // Fetch champions from API
  const { data: champions = [], isLoading: championsLoading } = useQuery({
    queryKey: ["champions"],
    queryFn: fetchChampions,
    staleTime: Infinity, // Keep the data fresh until user refreshes
  });

  return {
    gameState,
    setGameState: updateGameState.mutate,
    resetGame: resetGame.mutate,
    items,
    itemsLoading,
    champions,
    championsLoading,
  };
};

//   ad:
//     item.stats.FlatPhysicalDamageMod ||
//     extractStatFromDescription(plainDesc, "Attack Damage") ||
//     0,
//   ap:
//     item.stats.FlatMagicDamageMod ||
//     extractStatFromDescription(plainDesc, "Ability Power") ||
//     0,
//   armor:
//     item.stats.FlatArmorMod ||
//     extractStatFromDescription(plainDesc, "Armor") ||
//     0,
//   magicResist:
//     item.stats.FlatSpellBlockMod ||
//     extractStatFromDescription(plainDesc, "Magic Resist") ||
//     0,
//   critChance:
//     item.stats.FlatCritChanceMod ||
//     extractStatFromDescription(plainDesc, "Critical Strike Chance") ||
//     0,
//   lethality:
//     item.stats.ArmorPenetration ||
//     extractStatFromDescription(plainDesc, "Lethality") ||
//     0,
//   armorPen:
//     item.stats.PercentArmorPenetrationMod ||
//     extractStatFromDescription(plainDesc, "Armor Penetration") ||
//     0,
//   magicPen:
//     item.stats.FlatMagicPenetrationMod ||
//     extractStatFromDescription(plainDesc, "Magic Penetration") ||
//     0,
//   moveSpeed:
//     item.stats.FlatMovementSpeedMod ||
//     extractStatFromDescription(plainDesc, "Move Speed") ||
//     0,
//   attackSpeed:
//     (item.stats.FlatAttackSpeedMod || 0) +
//     (item.stats.PercentAttackSpeedMod ||
//       extractStatFromDescription(plainDesc, "Attack Speed") ||
//       0),
//   health:
//     item.stats.FlatHPPoolMod ||
//     extractStatFromDescription(plainDesc, "Health") ||
//     0,
//   mana:
//     item.stats.FlatMPPoolMod ||
//     extractStatFromDescription(plainDesc, "Mana") ||
//     0,
// },
