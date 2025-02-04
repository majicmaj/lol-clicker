import { statIconMap } from "./statIcons";

export const STAT_LABELS = {
  ad: "AD",
  ap: "AP",
  armor: "Armor",
  magicResist: "MR",
  critChance: "Crit Chance",
  abilityHaste: "Haste",
  attackSpeed: "AS",
  moveSpeed: "MS",
  lethality: "Lethal",
  armorPen: "Armor Pen",
  magicPen: "Magic Pen",
  health: "HP",
  mana: "Mana",
  healthRegen: "HP Regen",
  manaRegen: "Mana Regen",
};

export const STATS_LABELS_ICON_MAP = {
  ad: statIconMap.Damage,
  ap: statIconMap.SpellDamage,
  armor: statIconMap.Armor,
  magicResist: statIconMap.SpellBlock,
  critChance: statIconMap.CriticalStrike,
  abilityHaste: statIconMap.AbilityHaste,
  attackSpeed: statIconMap.AttackSpeed,
  moveSpeed: statIconMap.Boots,
  lethality: statIconMap.ArmorPenetration,
  armorPen: statIconMap.ArmorPenetration,
  magicPen: statIconMap.MagicPenetration,
  health: statIconMap.Health,
  mana: statIconMap.Mana,
  healthRegen: statIconMap.HealthRegen,
  manaRegen: statIconMap.ManaRegen,
  lifesteal: statIconMap.LifeSteal,
};
