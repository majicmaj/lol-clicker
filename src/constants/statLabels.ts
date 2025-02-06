import { statIconMap } from "./statIcons";

export const STAT_LABELS = {
  ad: "AD",
  attackSpeed: "AS",
  critChance: "Crit Chance",
  lethality: "Lethal",
  armorPen: "Armor Pen",

  ap: "AP",
  magicPen: "Magic Pen",
  magicPenPercent: "Magic Pen %",
  abilityHaste: "Haste",
  mana: "Mana",
  manaRegen: "Mana Regen",

  armor: "Armor",
  magicResist: "MR",
  health: "HP",
  healthRegen: "HP Regen",

  moveSpeed: "MS",
  moveSpeedPercent: "MS %",
  tenacity: "Tenacity",
  healAndShieldPower: "Heal/Shield",
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
