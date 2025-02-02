import { useState, useEffect } from "react";
import { GameState, Item } from "../types";

const STORAGE_KEY = "league-clicker-save";

const INITIAL_STATE: GameState = {
  player: {
    rank: "IRON",
    division: "4",
    lp: 0,
    gold: 0,
    lastLpChange: 0,
    wins: 0,
    losses: 0,
    lpHistory: [],
    rankHistory: [],
    divisionHistory: [],
    lastGameTime: Date.now(),
    inactivityWarning: false,
  },
  inventory: [],
  baseGoldPerClick: 10,
  baseLpPerClick: 20,
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure lastGameTime is properly restored
      return {
        ...parsed,
        player: {
          ...parsed.player,
          lastGameTime: Number(parsed.player.lastGameTime),
        },
      };
    }
    return INITIAL_STATE;
  });

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Reset game function
  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState(INITIAL_STATE);
  };

  // Handle rank decay
  useEffect(() => {
    const decayInterval = setInterval(() => {
      setGameState((prevState) => {
        const now = Date.now();
        const inactivityTime = now - prevState.player.lastGameTime;
        const isHighElo = [
          "DIAMOND",
          "MASTER",
          "GRANDMASTER",
          "CHALLENGER",
        ].includes(prevState.player.rank);

        // Only apply decay to Diamond+ ranks
        if (!isHighElo) return prevState;

        // 7 days inactivity threshold
        const inactivityThreshold = 7 * 24 * 60 * 60 * 1000;

        // Show warning at 6 days
        const warningThreshold = 6 * 24 * 60 * 60 * 1000;
        const shouldWarn =
          inactivityTime >= warningThreshold &&
          !prevState.player.inactivityWarning;

        if (shouldWarn) {
          return {
            ...prevState,
            player: {
              ...prevState.player,
              inactivityWarning: true,
            },
          };
        }

        // Apply decay after 7 days
        if (inactivityTime >= inactivityThreshold) {
          const decayAmount = -1; // -1 LP per second of inactivity after threshold
          const newLp = Math.max(0, prevState.player.lp + decayAmount);

          // Update rank if LP drops below 0
          let { rank, division, lp } = prevState.player;
          if (newLp === 0) {
            if (rank === "CHALLENGER") {
              rank = "GRANDMASTER";
              lp = 75;
            } else if (rank === "GRANDMASTER") {
              rank = "MASTER";
              lp = 75;
            } else if (rank === "MASTER") {
              rank = "DIAMOND";
              division = "1";
              lp = 75;
            } else if (division === "4") {
              // Can't decay below Diamond IV
              lp = 0;
            } else if (division) {
              division = ["4", "3", "2", "1"][
                (["1", "2", "3", "4"].indexOf(division) + 1) % 4
              ] as "4" | "3" | "2" | "1";
              lp = 75;
            }
          }

          return {
            ...prevState,
            player: {
              ...prevState.player,
              rank,
              division,
              lp: newLp,
              lastGameTime: now,
              inactivityWarning: false,
            },
          };
        }

        return prevState;
      });
    }, 1000); // Check every second

    return () => clearInterval(decayInterval);
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          "https://ddragon.leagueoflegends.com/cdn/15.2.1/data/en_US/item.json"
        );
        const data = await response.json();

        const processedItems: Item[] = Object.entries(data.data)
          .filter(
            ([_, item]: [string, any]) =>
              item.gold.purchasable &&
              (item.stats.FlatPhysicalDamageMod ||
                item.stats.FlatMagicDamageMod ||
                item.stats.FlatArmorMod ||
                item.stats.FlatSpellBlockMod ||
                item.stats.FlatCritChanceMod ||
                item.stats.FlatMovementSpeedMod ||
                item.stats.PercentMovementSpeedMod ||
                item.stats.FlatAttackSpeedMod ||
                item.stats.PercentAttackSpeedMod ||
                item.stats.rFlatArmorPenetrationMod ||
                item.stats.rPercentArmorPenetrationMod ||
                item.stats.rFlatMagicPenetrationMod ||
                item.stats.rPercentMagicPenetrationMod ||
                item.stats.FlatHPPoolMod ||
                item.stats.FlatMPPoolMod ||
                item.stats.FlatHPRegenMod ||
                item.stats.FlatMPRegenMod)
          )
          .map(([id, item]: [string, any]) => ({
            id,
            name: item.name,
            description: item.description,
            cost: item.gold.total,
            image: `https://ddragon.leagueoflegends.com/cdn/15.2.1/img/item/${item.image.full}`,
            stats: {
              ad: item.stats.FlatPhysicalDamageMod || 0,
              ap: item.stats.FlatMagicDamageMod || 0,
              armor: item.stats.FlatArmorMod || 0,
              magicResist: item.stats.FlatSpellBlockMod || 0,
              critChance: item.stats.FlatCritChanceMod || 0,
              lethality: item.stats.rFlatArmorPenetrationMod || 0,
              armorPen: item.stats.rPercentArmorPenetrationMod || 0,
              magicPen: item.stats.rFlatMagicPenetrationMod || 0,
              magicPenPercent: item.stats.rPercentMagicPenetrationMod || 0,
              moveSpeed: item.stats.FlatMovementSpeedMod || 0,
              moveSpeedPercent: item.stats.PercentMovementSpeedMod || 0,
              abilityHaste: -(item.stats.rPercentCooldownMod || 0),
              attackSpeed:
                (item.stats.FlatAttackSpeedMod || 0) +
                (item.stats.PercentAttackSpeedMod || 0),
              health: item.stats.FlatHPPoolMod || 0,
              healthRegen: item.stats.FlatHPRegenMod || 0,
              mana: item.stats.FlatMPPoolMod || 0,
              manaRegen: item.stats.FlatMPRegenMod || 0,
            },
            from: item.from || [],
          }));

        setItems(processedItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { gameState, setGameState, items, loading, resetGame };
};
