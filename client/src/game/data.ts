import type { Condition } from "./types";
export { ItemData } from "./item-data";

export type EntityData = {
  id: string;            // for NPCs this is the NPC id in npc-data.ts
  name: string;
  sprite: string;
  maxHp: number;
  ac: number;
  attackMod: number;
  damageDie: number;
  isHostile: boolean;
  xp?: number;           // awarded on defeat
  tags?: string[];       // e.g. "undead", matched by quest objectives
  openingLine?: string;  // shown when combat starts
  defeatLine?: string;   // shown on defeat
};

export type MapExit = {
  x: number; y: number;  // the ">" tile on this map
  targetMapId: string;
  targetX: number; targetY: number;
  label: string;
  requires?: Condition;  // the exit is blocked until this holds
  blockedMessage?: string;
};

export type MapInfo = {
  name: string;
  layout: string[];
  exits: MapExit[];
};

// Tile legend: # wall, . floor, > exit, T chest, m moonbloom, h hammerhead, j journal, = altar,
// letters for NPCs and enemies are looked up in GameData.entities.
export const GameData = {
  maps: {
    village: {
      name: "Whispering Woods Edge",
      layout: [
        "####################",
        "#................m.#",
        "#..H...C...........#",
        "#......###.........#",
        "#......###....F....#",
        ">......###.........>",
        "#..............S...#",
        "#.......M..........#",
        "#..T..........W....#",
        "#########>##########"
      ],
      exits: [
        { x: 0, y: 5, targetMapId: "overworld", targetX: 17, targetY: 5, label: "the road west to the Ashfields" },
        { x: 19, y: 5, targetMapId: "dungeon", targetX: 1, targetY: 5, label: "the path to the Rotted Barrow" },
        { x: 9, y: 9, targetMapId: "tavern", targetX: 9, targetY: 1, label: "the door of the Tipped Flagon" }
      ]
    },
    dungeon: {
      name: "The Rotted Barrow",
      layout: [
        "#########>##########",
        "#..................#",
        "#..Z.........Z.....#",
        "#...............=..#",
        "#.A.........ZZZZ...#",
        ">..................#",
        "#Z.........h.......#",
        "#..................#",
        "#....j..Z..........#",
        "####################"
      ],
      exits: [
        { x: 0, y: 5, targetMapId: "village", targetX: 18, targetY: 5, label: "back to the village" },
        { x: 9, y: 0, targetMapId: "boss_chamber", targetX: 9, targetY: 8, label: "the sealed north door",
          requires: { flag: "altar_touched" },
          blockedMessage: "The north door will not move. Something at the crypt's heart is holding it shut." }
      ]
    },
    overworld: {
      name: "The Ashfields",
      layout: [
        "####################",
        "#..m...............#",
        "#.........W........#",
        "#..................#",
        "#.......W......m...#",
        "#.................>#",
        "#..................#",
        "#...........S......#",
        "#..................#",
        "####################"
      ],
      exits: [
        { x: 18, y: 5, targetMapId: "village", targetX: 1, targetY: 5, label: "back toward the village" }
      ]
    },
    tavern: {
      name: "The Tipped Flagon",
      layout: [
        "#########>##########",
        "#..................#",
        "#..................#",
        "#....T....B........#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..................#",
        "####################"
      ],
      exits: [
        { x: 9, y: 0, targetMapId: "village", targetX: 9, targetY: 8, label: "back out to the lane" }
      ]
    },
    boss_chamber: {
      name: "The Throne Beneath the Barrow",
      layout: [
        "####################",
        "#..................#",
        "#..................#",
        "#........K.........#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#########>##########"
      ],
      exits: [
        { x: 9, y: 9, targetMapId: "dungeon", targetX: 9, targetY: 1, label: "back up into the barrow" }
      ]
    }
  } as Record<string, MapInfo>,

  entities: {
    // NPCs (talkable)
    H: { id: "jila_mossbind", name: "Jila Mossbind", sprite: "🧙\u200d♀️", maxHp: 18, ac: 12, attackMod: 0, damageDie: 4, isHostile: false },
    C: { id: "captain_haddow", name: "Captain Remith Haddow", sprite: "💂", maxHp: 30, ac: 16, attackMod: 4, damageDie: 8, isHostile: false },
    M: { id: "katon_wanderer", name: "Katon the Wanderer", sprite: "🥾", maxHp: 20, ac: 13, attackMod: 3, damageDie: 6, isHostile: false },
    F: { id: "fenwick_blacksmith", name: "Old Fenwick", sprite: "⚒️", maxHp: 22, ac: 12, attackMod: 3, damageDie: 6, isHostile: false },
    B: { id: "dunna_barkeep", name: "Barkeep Dunna", sprite: "🍺", maxHp: 16, ac: 11, attackMod: 2, damageDie: 4, isHostile: false },
    A: { id: "resad_priest", name: "Brother Resad", sprite: "🕯️", maxHp: 20, ac: 11, attackMod: 0, damageDie: 4, isHostile: false },
    // Enemies
    S: { id: "slime_1", name: "Corrosive Slime", sprite: "🟢", maxHp: 15, ac: 10, attackMod: 3, damageDie: 6, isHostile: true, xp: 25 },
    W: { id: "wolf_1", name: "Dire Wolf", sprite: "🐺", maxHp: 25, ac: 14, attackMod: 5, damageDie: 8, isHostile: true, xp: 60 },
    Z: { id: "zombie_1", name: "Shambling Zombie", sprite: "🧟", maxHp: 22, ac: 8, attackMod: 3, damageDie: 6, isHostile: true, xp: 40, tags: ["undead"] },
    K: { id: "hollow_king", name: "The Hollow King", sprite: "💀👑", maxHp: 120, ac: 18, attackMod: 8, damageDie: 12, isHostile: true, xp: 0,
         openingLine: "\"You walked all this way to say my name. I stopped keeping it.\"",
         defeatLine: "\"Stay,\" the king says, to no one. The room is only a room after that." },
    // Interactables (not NPCs)
    T: { id: "chest", name: "Old Chest", sprite: "🎁", maxHp: 1, ac: 5, attackMod: 0, damageDie: 1, isHostile: false }
  } as Record<string, EntityData>,

  // Walk onto the tile to pick it up. The tile is cleared.
  pickups: {
    m: { itemId: "moonbloom_flower", text: "You pick a moonbloom. It is cold, and it closes slowly in your hand." },
    h: { itemId: "fenwick_hammerhead", text: "Under a toppled stone: a hammerhead, pitted iron, with a hollow circle stamped on one face." },
    j: { itemId: "crumbled_journal", text: "A journal, damp through. Most pages come away as paste. A few survive.", lore: "spring_spirits" }
  } as Record<string, { itemId: string; text: string; lore?: string }>,

  // Chests: one use each, per map.
  chests: {
    village: { flag: "chest_village", itemId: "bread_and_cheese", text: "Someone's lunch, wrapped in a cloth. You take it and say nothing." },
    tavern: { flag: "chest_tavern", itemId: "ancient_coin", text: "Under the cellar rugs: one coin, very old, with a face worn smooth." }
  } as Record<string, { flag: string; itemId: string; text: string }>,

  // Stepping on a tile can change the world.
  tileEvents: {
    "=": { flag: "altar_touched", reach: "crypt_altar", text: "You lay a hand on the altar. A door above you lets go of its frame." }
  } as Record<string, { flag: string; reach: string; text: string }>
};

export const ClassData = {
  Fighter: { hpBase: 10, features: ["Action Surge", "Second Wind"], primaryStat: "str" },
  Wizard: { hpBase: 6, features: ["Spellcasting", "Arcane Recovery"], primaryStat: "int" },
  Rogue: { hpBase: 8, features: ["Sneak Attack", "Cunning Action"], primaryStat: "dex" }
};
