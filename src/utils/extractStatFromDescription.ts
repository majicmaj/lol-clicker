import { Item } from "../types";

const STAT_LABELS = [
  "Ability Haste",
  "Ability Power",
  "Armor Penetration",
  "Armor",
  "Attack Damage",
  "Attack Range",
  "Attack Speed",
  "Critical Strike Chance",
  "Energy Penetration",
  "Energy Regen",
  "Energy",
  "Heal and Shield Power",
  "Base Health Regen",
  "Health",
  "Lethality",
  "Life Steal",
  "Magic Penetration",
  "Magic Resist",
  "Base Mana Regen",
  "Mana",
  "Move Speed",
  "Shield Penetration",
  "Shield Power",
  "Shield",
  "Spell Vamp",
  "Tenacity",
];

const NAMES_MAP = {
  abilityHaste: "Ability Haste",
  ad: "Attack Damage",
  ap: "Ability Power",
  armor: "Armor",
  armorPen: "Armor Penetration",
  attackSpeed: "Attack Speed",
  critChance: "Critical Strike Chance",
  healthRegen: "Base Health Regen",
  health: "Health",
  lethality: "Lethality",
  lifesteal: "Life Steal",
  magicPen: "Magic Penetration",
  magicPenPercent: "Magic Penetration %",
  magicResist: "Magic Resist",
  manaRegen: "Base Mana Regen",
  mana: "Mana",
  moveSpeed: "Move Speed",
  percentMoveSpeed: "Move Speed %",
  spellVamp: "Spell Vamp",
  tenacity: "Tenacity",
  healAndShieldPower: "Heal and Shield Power",
};

const REVERSE_NAMES_MAP = Object.fromEntries(
  Object.entries(NAMES_MAP).map(([key, value]) => [value, key])
);

const extractStats = (description) => {
  const stats = {};
  const statMatches = [
    ...description.matchAll(/<attention>(.*?)<\/attention>\s*([^<\n]+)/g),
  ];

  statMatches.forEach(([_, value, label]) => {
    label = label.trim();
    if (STAT_LABELS.includes(label)) {
      const mainKey = REVERSE_NAMES_MAP[label];
      let key = REVERSE_NAMES_MAP[label];

      if (value.includes("%")) {
        if (mainKey === "moveSpeed") key = "moveSpeedPercent";
        if (mainKey === "magicPen") key = "magicPenPercent";
      }

      // @ts-expect-error FIXME
      stats[key] = parseFloat(value.replace("%", ""));
    }
  });

  return stats;
};

const extractAbilities = (description, type) => {
  const abilities = [];
  const regex = new RegExp(`<${type}>(.*?)<\/${type}><br>(.*?)<br>`, "g");

  for (const match of description.matchAll(regex)) {
    abilities.push({ name: match[1], description: match[2] });
  }

  return abilities;
};

export function getItemStats(item) {
  const { description } = item;
  return {
    stats: extractStats(description),
    passiveAbilities: extractAbilities(description, "passive"),
    activeAbilities: extractAbilities(description, "active"),
  };
}
