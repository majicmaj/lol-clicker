// A helper that extracts a stat's value from an item description.
// It first isolates the <stats> block (if it exists) so that values in other sections (like passives)

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
  moveSpeedPercent: "Move Speed %",
  omnivamp: "Spell Vamp",
  tenacity: "Tenacity",
};

const REVERSE_NAMES_MAP = Object.fromEntries(
  Object.entries(NAMES_MAP).map(([key, value]) => [value, key])
);
// "\u003CmainText\u003E\u003C[[stats\u003E\u003Cattention\u003E20\u003C/attention\u003E Attack "Damage\u003Cbr\u003E\u003Cattention\u003E18%\u003C/attention\u003E Armor Penetration\u003C/stats\u003E\u003Cbr\u003E\u003Cbr\u003E\u003C/mainText\u003E",

export const extractStatFromDescription = (
  description: string,
  label: string
) => {
  const match = description.match(
    new RegExp(`<attention>(.*?)</attention> ${label}`, "i")
  );

  if (match) {
    return parseFloat(match[1]);
  }
  return null;
};

// aren't accidentally matched.
export function getItemStats(item: Item) {
  const stats = {};
  const passiveAbilities = [];
  const activeAbilities = [];

  const { description } = item;

  // Extract stats
  STAT_LABELS.forEach((label) => {
    const key = REVERSE_NAMES_MAP[label];
    const value = extractStatFromDescription(description, label);

    if (value !== null) {
      stats[key] = Number(value);
    }
  });

  // Extract passive abilities
  const passiveMatches = [
    ...description.matchAll(/<passive>(.*?)<\/passive><br>(.*?)<br>/g),
  ];
  passiveMatches.forEach((match) => {
    passiveAbilities.push({ name: match[1], description: match[2] });
  });

  // Extract active abilities (assuming active abilities are marked in some way, adjust accordingly)
  const activeMatches = [
    ...description.matchAll(/<active>(.*?)<\/active><br>(.*?)<br>/g),
  ];

  activeMatches.forEach((match) => {
    activeAbilities.push({
      name: match[1],
      description: match[2],
    });
  });

  return { stats, passiveAbilities, activeAbilities };
}
