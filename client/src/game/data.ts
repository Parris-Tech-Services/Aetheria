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

export const GameData = {
  maps: {
    village: {
      name: "Whispering Woods Edge",
      layout: [
        "####################",
        "#..................#",
        "#.G...T.......S....#",
        "#......###.........#",
        "#......###.........#",
        "#......###......S..#",
        "#..................#",
        "#........W.........#",
        "#..................#",
        "####################"
      ],
    }
  },
  entities: {
    'G': { id: "guard_1", name: "Village Guard", sprite: "💂", maxHp: 20, ac: 16, attackMod: 4, damageDie: 8, isHostile: false },
    'S': { id: "slime_1", name: "Corrosive Slime", sprite: "💧", maxHp: 15, ac: 10, attackMod: 3, damageDie: 6, isHostile: true },
    'T': { id: "chest_1", name: "Old Chest", sprite: "🎁", maxHp: 1, ac: 5, attackMod: 0, damageDie: 1, isHostile: false },
    'W': { id: "wolf_1", name: "Dire Wolf", sprite: "🐺", maxHp: 25, ac: 14, attackMod: 5, damageDie: 8, isHostile: true }
  } as Record<string, EntityData>,
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
