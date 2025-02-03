export type Rank =
  | "IRON"
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "EMERALD"
  | "DIAMOND"
  | "MASTER"
  | "GRANDMASTER"
  | "CHALLENGER";
export type Division = "4" | "3" | "2" | "1" | null;

export interface Champion {
  id: string;
  name: string;
  title: string;
  image: string;
  stats: {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
  };
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  tags: string[];
  inventory: Item[];
}

export interface PlayerStats {
  rank: Rank;
  division: Division;
  lp: number;
  gold: number;
  lastGoldChange: number;
  lastLpChange: number;
  wins: number;
  losses: number;
  lpHistory: number[];
  rankHistory: Rank[];
  divisionHistory: Division[];
  lastGameTime: number;
  inactivityWarning: boolean;
  champions: Champion[];
}

export interface ItemStats {
  ad?: number;
  ap?: number;
  armor?: number;
  magicResist?: number;
  critChance?: number;
  lethality?: number;
  armorPen?: number;
  magicPen?: number;
  magicPenPercent?: number;
  moveSpeed?: number;
  moveSpeedPercent?: number;
  abilityHaste?: number;
  attackSpeed?: number;
  health?: number;
  healthRegen?: number;
  mana?: number;
  manaRegen?: number;
  omnivamp?: number;
  lifesteal?: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  cost: number;
  stats: ItemStats;
  image: string;
  from: string[];
  count: number;
}

export interface GameState {
  player: PlayerStats;
  inventory: Item[];
  baseGoldPerClick: number;
  baseLpPerClick: number;
}
