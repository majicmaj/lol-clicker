import { Item } from "../types";

export const SPECIAL_ITEMS: Item[] = [
  {
    id: "224403",
    name: "The Golden Cloak",
    description:
      '\u003CmainText\u003E\u003Cstats\u003E\u003Cattention\u003E90\u003C/attention\u003E Attack Damage\u003Cbr\u003E\u003Cattention\u003E125\u003C/attention\u003E Ability Power\u003Cbr\u003E\u003Cattention\u003E60%\u003C/attention\u003E Attack Speed\u003Cbr\u003E\u003Cattention\u003E25%\u003C/attention\u003E Critical Strike Chance\u003Cbr\u003E\u003Cattention\u003E250\u003C/attention\u003E Health\u003Cbr\u003E\u003Cattention\u003E30\u003C/attention\u003E Armor\u003Cbr\u003E\u003Cattention\u003E30\u003C/attention\u003E Magic Resist\u003Cbr\u003E\u003Cattention\u003E250\u003C/attention\u003E Mana\u003Cbr\u003E\u003Cattention\u003E20\u003C/attention\u003E Ability Haste\u003Cbr\u003E\u003Cattention\u003E10%\u003C/attention\u003E Move Speed\u003Cbr\u003E\u003Cattention\u003E10%\u003C/attention\u003E Life Steal\u003Cbr\u003E\u003Cattention\u003E100%\u003C/attention\u003E Base Health Regen\u003Cbr\u003E\u003Cattention\u003E100%\u003C/attention\u003E Base Mana Regen\u003C/stats\u003E\u003Cbr\u003E\u003Cbr\u003E\u003Cpassive\u003EDoing Something\u003C/passive\u003E\u003Cbr\u003EYou are permanently doing cloak activites!\u003Cbr\u003E\u003Cbr\u003E\u003CflavorText\u003E"It must do something...\u003Cbr\u003EDeclined, it does EVERYTHING"\u003C/flavorText\u003E\u003C/mainText\u003E',
    cost: 4200000000,
    image: "https://i.imgur.com/A81tKFN.png",
    stats: {
      abilityHaste: 0,
      ad: 1000,
      ap: 0,
      armor: 0,
      armorPen: 0,
      attackSpeed: 0,
      critChance: 0,
      healAndShieldPower: 0,
      health: 0,
      healthRegen: 0,
      lethality: 1000,
      lifesteal: 0,
      magicPen: 0,
      magicPenPercent: 0,
      magicResist: 0,
      mana: 0,
      manaRegen: 0,
      moveSpeed: 1000,
      moveSpeedPercent: 0,
      omnivamp: 0,
      tenacity: 0,
    },
    passiveAbilities: ["Cloak Activities"],
    activeAbilities: [],
    count: 1,
    from: [],
  },
];
