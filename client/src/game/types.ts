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

// A condition is true when EVERY listed field holds. Unknown state never passes.
export interface Condition {
  flag?: string;                 // flag is set (truthy)
  notFlag?: string;              // flag is not set
  item?: string;                 // player carries this item
  questStatus?: { id: string; status: QuestStatus | "ready" }; // "ready" = all objectives done, not yet turned in
  minRep?: number;               // reputation at or above
  maxRep?: number;               // reputation at or below
  stat?: string;                 // character stat name (str, dex, ...)
  minValue?: number;             // with stat
}

export interface Effect {
  giveQuest?: string;
  completeQuest?: string;        // only works when the quest is "ready"
  giveItem?: string;
  takeItem?: string;
  setFlag?: string;
  adjustRep?: number;
  discoverLore?: string;
  giveGold?: number;
}

export interface DialogueOption {
  id: string;
  label: string;
  nextNodeId: string | null;
  requires?: Condition;
  effect?: Effect;
}

export interface DialogueNode {
  id: string;
  text: string;                  // may contain {gold:quest_id} {xp:quest_id} {item:quest_id} tokens
  options: DialogueOption[];
  onEnter?: Effect;              // applied once when the node is shown
}

// What an NPC wants, will not do and knows. Not shown to the player; checked by the content tests.
export interface NpcProfile {
  want: string;                  // a want that is not "save the world"
  limit: string;                 // what they cannot or will not do
  publicKnowledge: string[];
  privateKnowledge: string[];    // only revealed when earned
  unknown: string[];             // things they honestly do not know
  taboo: string;                 // what they will not discuss
  noticesFirst: string;          // what they notice about the player first
  toneShift: string;             // what changes their tone
}

export interface NPC {
  id: string;
  name: string;
  sprite: string;
  mapId: MapId;
  x: number;
  y: number;
  role: "merchant" | "quest_giver" | "lore" | "companion" | "enemy_ally";
  profile: NpcProfile;
  // First entry whose condition holds is where a conversation starts. The last entry should have no condition.
  startNodes: Array<{ nodeId: string; when?: Condition }>;
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
  turnIn?: string; // NPC id to report to (defaults to giver)
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
