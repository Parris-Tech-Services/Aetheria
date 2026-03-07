export type EntityData = {
  id: string;
  name: string;
  sprite: string;
  maxHp: number;
  ac: number;
  attackMod: number;
  damageDie: number;
  isHostile: boolean;
};

export type MapExit = {
  direction: "N" | "S" | "E" | "W";
  targetMapId: string;
  targetX: number;
  targetY: number;
};

export type MapInfo = {
  name: string;
  layout: string[];
  exits: MapExit[];
};

export const GameData = {
  maps: {
    village: {
      name: "Whispering Woods Edge",
      layout: [
        "####################",
        "#..................#",
        "#.E...T.......S....#",
        "#......###.........#",
        "#......###.........#",
        "#......###......S..#",
        "#..................#",
        "#........W.........#",
        "#..................#",
        "####################"
      ],
      exits: [
        { direction: "E", targetMapId: "dungeon", targetX: 2, targetY: 5 }
      ]
    },
    dungeon: {
      name: "The Rotted Barrow",
      layout: [
        "####################",
        "#..................#",
        "#.Z..Z..........Z..#",
        "#................Z.#",
        "#......ZZZZ.......##",
        ">.................##",
        "#Z................##",
        "#..................#",
        "#..................#",
        "####################"
      ],
      exits: [
        { direction: "W", targetMapId: "village", targetX: 18, targetY: 5 }
      ]
    },
    overworld: {
      name: "The Ashfields",
      layout: [
        "####################",
        "#..................#",
        "#.E..........E.....#",
        "#..................#",
        "#.........E.......##",
        "#..................##",
        "#..................##",
        "#..................#",
        "#..................#",
        "####################"
      ],
      exits: [
        { direction: "W", targetMapId: "village", targetX: 2, targetY: 5 }
      ]
    },
    tavern: {
      name: "The Tipped Flagon",
      layout: [
        "####################",
        "#..................#",
        "#....T....B.......#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..................#",
        "####################"
      ],
      exits: [
        { direction: "N", targetMapId: "village", targetX: 10, targetY: 8 }
      ]
    },
    boss_chamber: {
      name: "Throne of the Hollow King",
      layout: [
        "####################",
        "#..................#",
        "#..................#",
        "#.........K.......#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..................#",
        "####################"
      ],
      exits: [
        { direction: "S", targetMapId: "dungeon", targetX: 10, targetY: 2 }
      ]
    }
  } as Record<string, MapInfo>,
  
  entities: {
    'G': { id: "guard_1", name: "Village Guard", sprite: "💂", maxHp: 20, ac: 16, attackMod: 4, damageDie: 8, isHostile: false },
    'S': { id: "slime_1", name: "Corrosive Slime", sprite: "🟢", maxHp: 15, ac: 10, attackMod: 3, damageDie: 6, isHostile: true },
    'T': { id: "chest_1", name: "Old Chest", sprite: "🎁", maxHp: 1, ac: 5, attackMod: 0, damageDie: 1, isHostile: false },
    'W': { id: "wolf_1", name: "Dire Wolf", sprite: "🐺", maxHp: 25, ac: 14, attackMod: 5, damageDie: 8, isHostile: true },
    'Z': { id: "zombie_1", name: "Shambling Zombie", sprite: "🧟", maxHp: 22, ac: 8, attackMod: 3, damageDie: 6, isHostile: true },
    'K': { id: "hollow_king", name: "The Hollow King", sprite: "💀👑", maxHp: 120, ac: 18, attackMod: 8, damageDie: 12, isHostile: true },
    'E': { id: "elara_1", name: "Elara Mossbind", sprite: "🧙‍♀️", maxHp: 18, ac: 12, attackMod: 4, damageDie: 6, isHostile: false },
    'B': { id: "barkeep_1", name: "Barkeep Dunna", sprite: "🍺", maxHp: 16, ac: 11, attackMod: 3, damageDie: 4, isHostile: false }
  } as Record<string, EntityData>,

  // Simple NPC dialogue data - keyed by entity ID
  npcDialogue: {
    elara_1: {
      name: "Elara Mossbind",
      greeting: "Ah, a wanderer. The forest is troubled. Would you help me?",
      dialogueOptions: [
        { text: "Tell me more.", response: "The Rotted Barrow to the north holds dark secrets. I fear undead stir there." },
        { text: "Not interested.", response: "I understand. Safe travels then." }
      ]
    },
    barkeep_1: {
      name: "Barkeep Dunna",
      greeting: "Welcome to the Tipped Flagon! What brings you here?",
      dialogueOptions: [
        { text: "I'm looking for adventure.", response: "Hah! There's plenty of danger in these lands if you seek it. The barrow especially..." },
        { text: "I'll take a drink.", response: "Coming right up. On the house for brave folk like you." }
      ]
    },
    guard_1: {
      name: "Village Guard",
      greeting: "Greetings, adventurer. We could use someone with your skills.",
      dialogueOptions: [
        { text: "What's needed?", response: "The undead from the north have grown bold. Would you clear the barrow?" },
        { text: "I'm passing through.", response: "Safe travels then. But stay sharp—darkness is stirring." }
      ]
    }
  }
};

export const ClassData = {
  Fighter: {
    hpBase: 10,
    features: ["Action Surge", "Second Wind"],
    primaryStat: "str"
  },
  Wizard: {
    hpBase: 6,
    features: ["Spellcasting", "Arcane Recovery"],
    primaryStat: "int"
  },
  Rogue: {
    hpBase: 8,
    features: ["Sneak Attack", "Cunning Action"],
    primaryStat: "dex"
  }
};

// Simplified item data - placeholders
export const ItemData: Record<string, { name: string; sprite: string }> = {
  healing_potion: { name: "Healing Potion", sprite: "🧪" },
  iron_sword: { name: "Iron Sword", sprite: "⚔️" },
  leather_armor: { name: "Leather Armor", sprite: "🧥" },
  blessed_amulet: { name: "Blessed Amulet", sprite: "✨" },
  moonbloom_flower: { name: "Moonbloom Flower", sprite: "🌙" }
};
