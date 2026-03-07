// Core type definitions for the game

export type MapId = "village" | "dungeon" | "overworld" | "tavern" | "boss_chamber";
export type CharacterClass = "Fighter" | "Wizard" | "Rogue";
export type ItemType = "weapon" | "armor" | "consumable" | "quest" | "lore";
export type ItemRarity = "common" | "uncommon" | "rare" | "legendary";
export type QuestStatus = "inactive" | "active" | "completed" | "failed";
export type ObjectiveType = "kill" | "collect" | "talk" | "reach";

// Map and Exits
export interface MapExit {
  direction: "N" | "S" | "E" | "W";
  targetMapId: MapId;
  targetX: number;
  targetY: number;
}

export interface MapData {
  name: string;
  layout: string[];
  description: string;
  ambientSound: string;
  exits: MapExit[];
}

// NPCs and Dialogue
export interface DialogueOption {
  id: string;
  label: string;
  nextNodeId: string | null;
  requires?: {
    questFlag?: string;
    item?: string;
    stat?: string;
    minValue?: number;
  };
  effect?: {
    giveQuest?: string;
    giveItem?: string;
    setFlag?: string;
    adjustRep?: number;
  };
}

export interface DialogueNode {
  id: string;
  text: string;
  options: DialogueOption[];
}

export interface NPC {
  id: string;
  name: string;
  sprite: string;
  mapId: MapId;
  x: number;
  y: number;
  role: "merchant" | "quest_giver" | "lore" | "companion" | "enemy_ally";
  greeting: string;
  repeatGreeting: string;
  dialogueTree: DialogueNode[];
  inventory?: string[]; // Item IDs they sell
}

// Quests
export interface QuestObjective {
  id: string;
  description: string;
  type: ObjectiveType;
  targetId: string;
  count: number;
  currentCount: number;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  objectives: QuestObjective[];
  reward: {
    xp: number;
    gold: number;
    item?: string;
  };
  giver: string; // NPC id
}

// Items
export interface ItemEffect {
  stat?: string;
  modifier?: number;
  duration?: "permanent" | "combat" | "turn";
}

export interface Item {
  id: string;
  name: string;
  sprite: string;
  type: ItemType;
  rarity: ItemRarity;
  description: string;
  effect?: ItemEffect;
}

// Enemies
export interface LootTableEntry {
  itemId: string;
  dropChance: number; // 0-1
}

export interface EnemyData {
  id: string;
  name: string;
  sprite: string;
  mapId: MapId;
  maxHp: number;
  ac: number;
  attackMod: number;
  damageDie: number;
  isHostile: boolean;
  xpReward: number;
  lootTable: LootTableEntry[];
  special?: string; // Special ability description
}

// Lore
export interface LoreEntry {
  id: string;
  title: string;
  text: string;
  category: "history" | "legend" | "artifact" | "faction" | "npc";
  discoverable: boolean;
  discoveredBy?: string; // How to unlock
}

// Game state
export interface GameFlags {
  [key: string]: boolean | number | string;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  equipped?: boolean;
}

export interface CharacterInventory {
  items: InventoryItem[];
  equipped: {
    weapon?: string;
    armor?: string;
  };
}
