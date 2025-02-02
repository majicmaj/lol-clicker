import { Rank, Division } from '../types';

export const RANKS: Rank[] = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'];
export const DIVISIONS: Division[] = ['4', '3', '2', '1'];

export const RANK_DIFFICULTY_MULTIPLIER: { [key in Rank]: number } = {
  'IRON': 1,
  'BRONZE': 1.2,
  'SILVER': 1.4,
  'GOLD': 1.6,
  'PLATINUM': 1.8,
  'EMERALD': 2,
  'DIAMOND': 2.2,
  'MASTER': 2.5,
  'GRANDMASTER': 2.8,
  'CHALLENGER': 3
};

export const RANK_VALUES = {
  'IRON': 0,
  'BRONZE': 400,
  'SILVER': 800,
  'GOLD': 1200,
  'PLATINUM': 1600,
  'EMERALD': 2000,
  'DIAMOND': 2400,
  'MASTER': 2800,
  'GRANDMASTER': 3200,
  'CHALLENGER': 3600
};

export const DIVISION_VALUES = {
  '4': 0,
  '3': 100,
  '2': 200,
  '1': 300
};