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
  moveSpeedPercent: "MS %",
  lethality: "Lethal",
  armorPen: "Armor Pen",
  magicPen: "Magic Pen",
  magicPenPercent: "Magic Pen %",
  health: "HP",
  mana: "Mana",
  healthRegen: "HP Regen",
  manaRegen: "Mana Regen",
};

export const STATS_LABELS_ICON_MAP = {
  abilityHaste: statIconMap.AbilityHaste,
  ad: statIconMap.Damage,
  ap: statIconMap.SpellDamage,
  armor: statIconMap.Armor,
  armorPen: statIconMap.ArmorPenetration,
  attackSpeed: statIconMap.AttackSpeed,
  critChance: statIconMap.CriticalStrike,
  healAndShieldPower: statIconMap.HealAndShieldPower,
  health: statIconMap.Health,
  healthRegen: statIconMap.HealthRegen,
  lethality: statIconMap.ArmorPenetration,
  lifesteal: statIconMap.LifeSteal,
  magicPen: statIconMap.MagicPenetration,
  magicResist: statIconMap.SpellBlock,
  magicPenPercent: statIconMap.MagicPenetration,
  mana: statIconMap.Mana,
  manaRegen: statIconMap.ManaRegen,
  moveSpeed: statIconMap.Boots,
  moveSpeedPercent: statIconMap.Boots,
  tenacity: statIconMap.Tenacity,
};
