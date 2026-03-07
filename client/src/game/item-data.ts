import { Item } from "./types";

export const ItemData: Record<string, Item> = {
  // CONSUMABLES
  healing_potion: {
    id: "healing_potion",
    name: "Healing Potion",
    sprite: "🧪",
    type: "consumable",
    rarity: "common",
    description: "Restores 2d4+2 hit points.",
    effect: {
      stat: "hp",
      modifier: 10, // Average
      duration: "permanent",
    },
  },

  lesser_healing_potion: {
    id: "lesser_healing_potion",
    name: "Lesser Healing Potion",
    sprite: "🧴",
    type: "consumable",
    rarity: "common",
    description: "Restores 1d4+1 hit points.",
    effect: {
      stat: "hp",
      modifier: 3,
      duration: "permanent",
    },
  },

  greater_healing_potion: {
    id: "greater_healing_potion",
    name: "Greater Healing Potion",
    sprite: "🧪",
    type: "consumable",
    rarity: "rare",
    description: "Restores 4d4+4 hit points.",
    effect: {
      stat: "hp",
      modifier: 20,
      duration: "permanent",
    },
  },

  antidote: {
    id: "antidote",
    name: "Antidote",
    sprite: "⚗️",
    type: "consumable",
    rarity: "uncommon",
    description: "Cures poison.",
  },

  hearty_stew: {
    id: "hearty_stew",
    name: "Hearty Stew",
    sprite: "🍲",
    type: "consumable",
    rarity: "common",
    description: "Grants +5 temporary HP for 1 hour.",
    effect: {
      stat: "tempHp",
      modifier: 5,
      duration: "combat",
    },
  },

  wizard_focus: {
    id: "wizard_focus",
    name: "Wizard's Focus",
    sprite: "🔮",
    type: "consumable",
    rarity: "uncommon",
    description: "+1 spell save DC for 1 combat.",
    effect: {
      stat: "spellSaveDC",
      modifier: 1,
      duration: "combat",
    },
  },

  // WEAPONS
  iron_sword: {
    id: "iron_sword",
    name: "Iron Sword",
    sprite: "⚔️",
    type: "weapon",
    rarity: "common",
    description: "+1 to attack rolls and damage. Does 1d8 damage.",
    effect: {
      stat: "attackMod",
      modifier: 1,
    },
  },

  goblin_shortbow: {
    id: "goblin_shortbow",
    name: "Goblin's Shortbow",
    sprite: "🏹",
    type: "weapon",
    rarity: "uncommon",
    description: "Ranged weapon. Does 1d6 damage from afar.",
  },

  fenwick_hammer: {
    id: "fenwick_hammer",
    name: "Fenwick's Hammer",
    sprite: "🔨",
    type: "weapon",
    rarity: "rare",
    description: "A masterwork hammer. Does 1d10 damage. +2 damage vs. constructs.",
    effect: {
      stat: "damageMod",
      modifier: 2,
    },
  },

  shadow_blade: {
    id: "shadow_blade",
    name: "Shadow Blade",
    sprite: "🗡️",
    type: "weapon",
    rarity: "rare",
    description: "An otherworldly sword. Does 1d8 damage. Advantage in dim light.",
  },

  hollow_crown: {
    id: "hollow_crown",
    name: "Hollow King's Crown",
    sprite: "👑",
    type: "weapon",
    rarity: "legendary",
    description: "A cursed artifact. +3 to attack and damage, but -2 to Wisdom checks.",
    effect: {
      stat: "attackMod",
      modifier: 3,
    },
  },

  // ARMOR
  leather_armor: {
    id: "leather_armor",
    name: "Leather Armor",
    sprite: "🧥",
    type: "armor",
    rarity: "common",
    description: "+2 to AC.",
    effect: {
      stat: "ac",
      modifier: 2,
    },
  },

  chain_mail: {
    id: "chain_mail",
    name: "Chain Mail",
    sprite: "🛡️",
    type: "armor",
    rarity: "uncommon",
    description: "+4 to AC, but -5 to movement.",
    effect: {
      stat: "ac",
      modifier: 4,
    },
  },

  shadow_cloak: {
    id: "shadow_cloak",
    name: "Shadow Cloak",
    sprite: "🧛",
    type: "armor",
    rarity: "rare",
    description: "Advantage on Dexterity saves. +1 to AC.",
    effect: {
      stat: "ac",
      modifier: 1,
    },
  },

  blessed_amulet: {
    id: "blessed_amulet",
    name: "Blessed Amulet",
    sprite: "✨",
    type: "armor",
    rarity: "rare",
    description: "+1 to AC. Resistance to necrotic damage.",
    effect: {
      stat: "ac",
      modifier: 1,
    },
  },

  iron_shield: {
    id: "iron_shield",
    name: "Iron Shield",
    sprite: "🛡️",
    type: "armor",
    rarity: "uncommon",
    description: "+2 to AC.",
    effect: {
      stat: "ac",
      modifier: 2,
    },
  },

  // QUEST ITEMS
  moonbloom_flower: {
    id: "moonbloom_flower",
    name: "Moonbloom Flower",
    sprite: "🌙",
    type: "quest",
    rarity: "uncommon",
    description: "A rare flower that blooms only in cursed soil. Sought by Elara.",
  },

  riven_family_locket: {
    id: "riven_family_locket",
    name: "Riven's Family Locket",
    sprite: "💍",
    type: "quest",
    rarity: "uncommon",
    description: "A memento of a lost family. Proof of connection.",
  },

  barrow_seal: {
    id: "barrow_seal",
    name: "Barrow Seal",
    sprite: "🔐",
    type: "quest",
    rarity: "rare",
    description: "Unlocks the entrance to the Boss Chamber.",
  },

  crown_of_dominion: {
    id: "crown_of_dominion",
    name: "Crown of Dominion",
    sprite: "👑",
    type: "quest",
    rarity: "legendary",
    description: "The crown of the Hollow King. Proof of victory.",
  },

  // LORE ITEMS
  crumbled_journal: {
    id: "crumbled_journal",
    name: "Crumbled Journal",
    sprite: "📖",
    type: "lore",
    rarity: "uncommon",
    description: "An ancient journal. Contains world history.",
  },

  ancient_coin: {
    id: "ancient_coin",
    name: "Ancient Coin",
    sprite: "🪙",
    type: "lore",
    rarity: "rare",
    description: "A coin from a fallen civilization.",
  },

  hollow_kings_decree: {
    id: "hollow_kings_decree",
    name: "Hollow King's Decree",
    sprite: "📜",
    type: "lore",
    rarity: "rare",
    description: "A proclamation written by the Hollow King himself.",
  },

  bread_and_cheese: {
    id: "bread_and_cheese",
    name: "Bread and Cheese",
    sprite: "🥘",
    type: "consumable",
    rarity: "common",
    description: "A simple meal. Restores 1d4 HP.",
    effect: {
      stat: "hp",
      modifier: 3,
      duration: "permanent",
    },
  },
};
