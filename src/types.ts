export type Rank = 'IRON' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'EMERALD' | 'DIAMOND' | 'MASTER' | 'GRANDMASTER' | 'CHALLENGER';
export type Division = '4' | '3' | '2' | '1' | null;

export interface PlayerStats {
  rank: Rank;
  division: Division;
  lp: number;
  gold: number;
  lastLpChange: number;
  wins: number;
  losses: number;
  lpHistory: number[];
  rankHistory: Rank[];
  divisionHistory: Division[];
  lastGameTime: number;
  inactivityWarning: boolean;
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
}

export interface Item {
  id: string;
  name: string;
  description: string;
  cost: number;
  stats: ItemStats;
  image: string;
  from: string[];
}

export interface GameState {
  player: PlayerStats;
  inventory: Item[];
  baseGoldPerClick: number;
  baseLpPerClick: number;
}