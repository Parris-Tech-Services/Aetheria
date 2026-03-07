// Core player and world data
const GameData = {
  player: {
    x: 1, y: 1,
    hp: 30, maxHp: 30,
    ac: 16,
    gold: 10,
    level: 1,
    cls: "Fighter",
    str: 3, dex: 2, con: 2, int: 0, wis: 1, cha: 2,
    speed: 6,
    inventory: [],
    quests: []
  },

  loreFlags: {},
  factionReputation: {},

  worldMap: [
    "##########",
    "#.@..H...#",
    "#..###...#",
    "#.G#T#...#",
    "#..###...#",
    "#........#",
    "#...S..WW#",
    "##########"
  ].map(r => r.split('')),

  entities: {
    'G': { id: "guard_1", name: "Village Guard", encounter: "guardToll", sprite: "💂" },
    'S': { id: "slime_1", name: "Angry Slime", encounter: "slimeCombat", sprite: "💧", maxHp: 15, currentHp: 15, ac: 10, attackMod: 3, damageDie: 6 },
    'T': { id: "chest_1", name: "Old Chest", encounter: "oldChest", sprite: "🎁" },
    'H': { id: "hermit_1", name: "Forest Hermit", encounter: "forestHermit", sprite: "🧙" }
  }
};
