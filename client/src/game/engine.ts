import { create } from "zustand";
import { type Character } from "@shared/schema";
import { GameData, type EntityData } from "./data";
import { NPCData } from "./npc-data";
import { QuestData } from "./quest-data";
import { ItemData } from "./item-data";
import { nodeById, nodeText, pickStartNode, visibleOptions } from "./dialogue";
import { addItem, applyEffect, conditionMet, newWorld, parseWorld, progress, serializeWorld, type WorldState } from "./world";

// 5e Mechanics Engine

export function rollD20(advantage: "none" | "adv" | "dis" = "none"): { total: number, rolls: number[], isCrit: boolean, isFail: boolean } {
  const r1 = Math.floor(Math.random() * 20) + 1;
  const r2 = Math.floor(Math.random() * 20) + 1;
  
  let finalRoll = r1;
  if (advantage === "adv") finalRoll = Math.max(r1, r2);
  if (advantage === "dis") finalRoll = Math.min(r1, r2);
  
  return {
    total: finalRoll,
    rolls: advantage === "none" ? [r1] : [r1, r2],
    isCrit: finalRoll === 20,
    isFail: finalRoll === 1
  };
}

export function rollDice(count: number, sides: number): number {
  let sum = 0;
  for (let i = 0; i < count; i++) {
    sum += Math.floor(Math.random() * sides) + 1;
  }
  return sum;
}

export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// Game State Management

export type CombatState = {
  isActive: boolean;
  enemyId: string | null;
  enemyMaxHp: number;
  enemyHp: number;
  enemyData: EntityData | null;
  actionAvailable: boolean;
  bonusAvailable: boolean;
  movementLeft: number;
  log: string[];
};

export type DialogueState = {
  isOpen: boolean;
  npcId: string | null;
  npcName: string;
  currentText: string;
  options: Array<{ id: string; label: string }>;
};

export type InventoryItem = { itemId: string; quantity: number };

type GameStore = {
  character: Character | null;
  mapId: string;
  mapData: string[][];
  fogData: boolean[][];
  playerPos: { x: number; y: number };
  combat: CombatState;
  dialogue: DialogueState;
  inventory: InventoryItem[];
  world: WorldState;
  dialogueNodeId: string | null;

  initGame: (char: Character) => void;
  movePlayer: (dx: number, dy: number) => void;
  startCombat: (enemyChar: string, x: number, y: number) => void;
  attackEnemy: () => void;
  endTurn: () => void;
  addLog: (msg: string) => void;
  openDialogue: (npcId: string) => void;
  selectDialogueOption: (optionId: string) => void;
  closeDialogue: () => void;
  addInventoryItem: (itemId: string, quantity?: number) => void;
};

const emitJuice = (type: 'damage' | 'heal' | 'miss', amount: number | string, x: number, y: number) => {
  window.dispatchEvent(new CustomEvent('game-juice', { detail: { type, amount, x, y } }));
};
const emitShake = () => { window.dispatchEvent(new Event('game-shake')); };

const LOG_LIMIT = 40;
const STARTING_INVENTORY = [{ itemId: "healing_potion", quantity: 2 }, { itemId: "iron_sword", quantity: 1 }];
const saveKey = (id: number) => `aetheria-save-${id}`;

type SavedGame = { world: string; mapId: string; x: number; y: number };
function readSave(id: number): SavedGame | null {
  try { const raw = localStorage.getItem(saveKey(id)); return raw ? JSON.parse(raw) as SavedGame : null; } catch { return null; }
}
function writeSave(id: number, world: WorldState, mapId: string, x: number, y: number) {
  try { localStorage.setItem(saveKey(id), JSON.stringify({ world: serializeWorld(world), mapId, x, y } satisfies SavedGame)); } catch { /* storage unavailable: play on without saving */ }
}

function buildMap(mapId: string, x: number, y: number) {
  const info = GameData.maps[mapId as keyof typeof GameData.maps] ?? GameData.maps.village;
  const grid = info.layout.map((row) => row.split(''));
  const fog = grid.map((row) => row.map(() => true));
  revealAround(fog, x, y);
  return { grid, fog };
}
function revealAround(fog: boolean[][], x: number, y: number) {
  for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
    const yy = y + dy, xx = x + dx;
    if (yy >= 0 && yy < fog.length && xx >= 0 && xx < fog[0].length && dx * dx + dy * dy <= 10) fog[yy][xx] = false;
  }
}

export const useGameStore = create<GameStore>((set, get) => {
  // Everything the world changes goes through here, so rewards, log lines and saving cannot drift apart.
  const commit = (world: WorldState, messages: string[], rewards = { xp: 0, gold: 0 }) => {
    const s = get();
    let character = s.character;
    if (character && (rewards.xp || rewards.gold)) {
      let { xp, level, xpToNextLevel, maxHp, hp } = character;
      xp += rewards.xp;
      while (xp >= xpToNextLevel) {
        xp -= xpToNextLevel; level += 1; xpToNextLevel = level * 100; maxHp += 6; hp = Math.min(maxHp, hp + 6);
        messages = [...messages, `You reach level ${level}. Max HP +6.`];
      }
      character = { ...character, xp, level, xpToNextLevel, maxHp, hp, gold: character.gold + rewards.gold };
    }
    set({ world, inventory: world.inventory, character, combat: { ...s.combat, log: [...s.combat.log, ...messages].slice(-LOG_LIMIT) } });
    const now = get();
    if (now.character) writeSave(now.character.id, world, now.mapId, now.playerPos.x, now.playerPos.y);
  };

  const enterNode = (npcId: string, nodeId: string) => {
    const npc = NPCData[npcId];
    const node = nodeById(npc, nodeId);
    const fx = applyEffect(node.onEnter, get().world);
    commit(fx.world, fx.messages, fx.rewards);
    const options = visibleOptions(node, get().world).map((o) => ({ id: o.id, label: o.label }));
    set({ dialogueNodeId: nodeId, dialogue: { isOpen: true, npcId, npcName: npc.name, currentText: nodeText(node), options } });
  };

  const changeMap = (mapId: string, x: number, y: number) => {
    const { grid, fog } = buildMap(mapId, x, y);
    set((s) => ({ mapId, playerPos: { x, y }, mapData: grid, fogData: fog, combat: { ...s.combat, isActive: false, enemyId: null, enemyData: null } }));
    const w = get().world;
    commit({ ...w, flags: { ...w.flags, [`visited_${mapId}`]: true } }, []);
  };

  return {
  character: null,
  mapId: "village",
  mapData: [],
  fogData: [],
  playerPos: { x: 1, y: 1 },
  combat: { isActive: false, enemyId: null, enemyMaxHp: 0, enemyHp: 0, enemyData: null, actionAvailable: true, bonusAvailable: true, movementLeft: 6, log: [] },
  dialogue: { isOpen: false, npcId: null, npcName: "", currentText: "", options: [] },
  inventory: STARTING_INVENTORY,
  world: newWorld({ inventory: STARTING_INVENTORY }),
  dialogueNodeId: null,

  initGame: (char) => {
    const saved = readSave(char.id);
    const world = saved ? parseWorld(saved.world) : newWorld({ inventory: STARTING_INVENTORY });
    const mapId = saved?.mapId && GameData.maps[saved.mapId as keyof typeof GameData.maps] ? saved.mapId : char.mapId;
    const x = saved ? saved.x : char.x, y = saved ? saved.y : char.y;
    const { grid, fog } = buildMap(mapId, x, y);
    set({
      character: char, mapId, playerPos: { x, y }, mapData: grid, fogData: fog, world, inventory: world.inventory,
      combat: { ...get().combat, isActive: false, log: [saved ? "You take up the road again." : "Welcome to Aetheria."] },
    });
  },

  openDialogue: (npcId) => {
    const npc = NPCData[npcId];
    if (!npc) { get().addLog("They have nothing to say."); return; }
    const w = get().world;
    const talk = progress(w, { type: "talk", npcId });
    if (talk.messages.length) commit(talk.world, talk.messages);
    enterNode(npcId, pickStartNode(npc, get().world).id);
  },

  selectDialogueOption: (optionId) => {
    const { dialogue, dialogueNodeId, world } = get();
    if (!dialogue.npcId || !dialogueNodeId) return;
    const npc = NPCData[dialogue.npcId];
    const option = nodeById(npc, dialogueNodeId).options.find((o) => o.id === optionId);
    if (!option || !conditionMet(option.requires, world)) return;
    const fx = applyEffect(option.effect, world);
    commit(fx.world, fx.messages, fx.rewards);
    if (option.nextNodeId) enterNode(dialogue.npcId, option.nextNodeId);
    else get().closeDialogue();
  },

  closeDialogue: () => {
    set({ dialogueNodeId: null, dialogue: { isOpen: false, npcId: null, npcName: "", currentText: "", options: [] } });
  },

  addInventoryItem: (itemId, quantity = 1) => {
    const w = addItem(get().world, itemId, quantity);
    commit(w, []);
  },

  addLog: (msg) => {
    set((state) => ({ combat: { ...state.combat, log: [...state.combat.log, msg].slice(-LOG_LIMIT) } }));
  },

  movePlayer: (dx, dy) => {
    const state = get();
    if (!state.character || state.dialogue.isOpen) return;
    if (state.combat.isActive && state.combat.movementLeft <= 0) { state.addLog("No movement left this turn."); return; }

    const nx = state.playerPos.x + dx;
    const ny = state.playerPos.y + dy;
    if (ny < 0 || ny >= state.mapData.length || nx < 0 || nx >= state.mapData[0].length) return;
    const targetTile = state.mapData[ny][nx];
    if (targetTile === '#') return;

    // Exits
    if (targetTile === '>') {
      const info = GameData.maps[state.mapId as keyof typeof GameData.maps];
      const exit = info?.exits.find((e) => e.x === nx && e.y === ny);
      if (!exit) { state.addLog("The way is shut."); return; }
      if (state.combat.isActive) { state.addLog("You cannot leave in the middle of a fight."); return; }
      if (!conditionMet(exit.requires, state.world)) { state.addLog(exit.blockedMessage ?? "Something stops you."); return; }
      state.addLog(`You take ${exit.label}.`);
      changeMap(exit.targetMapId, exit.targetX, exit.targetY);
      return;
    }

    // Entities
    const entity = GameData.entities[targetTile];
    if (entity) {
      if (entity.isHostile) {
        if (!state.combat.isActive) get().startCombat(targetTile, nx, ny); else get().attackEnemy();
        return;
      }
      if (entity.id === "chest") {
        const chest = GameData.chests[state.mapId];
        if (!chest) { state.addLog("The chest is empty."); return; }
        if (state.world.flags[chest.flag]) { state.addLog("You already emptied this chest."); return; }
        const w = addItem({ ...state.world, flags: { ...state.world.flags, [chest.flag]: true } }, chest.itemId);
        const p = progress(w, { type: "collect", itemId: chest.itemId });
        commit(p.world, [chest.text, `Received: ${ItemData[chest.itemId]?.name ?? chest.itemId}.`, ...p.messages]);
        return;
      }
      get().openDialogue(entity.id);
      return;
    }

    // Pickups and tile events clear or trigger as you step on them
    const pickup = GameData.pickups[targetTile];
    const event = GameData.tileEvents[targetTile];
    let world = state.world; let messages: string[] = [];
    let mapData = state.mapData;
    if (pickup) {
      world = addItem(world, pickup.itemId);
      messages.push(pickup.text, `Received: ${ItemData[pickup.itemId]?.name ?? pickup.itemId}.`);
      if (pickup.lore && !world.lore.includes(pickup.lore)) { world = { ...world, lore: [...world.lore, pickup.lore] }; messages.push("Journal updated: new lore."); }
      const p = progress(world, { type: "collect", itemId: pickup.itemId });
      world = p.world; messages.push(...p.messages);
      mapData = mapData.map((r) => [...r]); mapData[ny][nx] = '.';
    } else if (event) {
      if (!world.flags[event.flag]) {
        world = { ...world, flags: { ...world.flags, [event.flag]: true } };
        messages.push(event.text);
        const p = progress(world, { type: "reach", tag: event.reach });
        world = p.world; messages.push(...p.messages);
      }
    }

    const newFog = state.fogData.map((r) => [...r]);
    revealAround(newFog, nx, ny);
    set((s) => ({
      playerPos: { x: nx, y: ny }, fogData: newFog, mapData,
      combat: s.combat.isActive ? { ...s.combat, movementLeft: s.combat.movementLeft - 1 } : s.combat,
    }));
    if (pickup || event) commit(world, messages);
  },

  startCombat: (enemyChar) => {
    const enemyData = GameData.entities[enemyChar];
    if (!enemyData) return;
    set((state) => ({
      combat: {
        isActive: true, enemyId: enemyChar, enemyData, enemyHp: enemyData.maxHp, enemyMaxHp: enemyData.maxHp,
        actionAvailable: true, bonusAvailable: true, movementLeft: 6,
        log: [...state.combat.log, `Combat started with ${enemyData.name}!`, ...(enemyData.openingLine ? [enemyData.openingLine] : [])].slice(-LOG_LIMIT),
      }
    }));
  },

  attackEnemy: () => {
    const state = get();
    if (!state.combat.isActive || !state.character || !state.combat.enemyData) return;
    if (!state.combat.actionAvailable) { state.addLog("No action available!"); return; }

    const { enemyData } = state.combat;
    const char = state.character;
    let mod = calculateModifier(char.str);
    if (char.characterClass === "Rogue") mod = calculateModifier(char.dex);
    if (char.characterClass === "Wizard") mod = calculateModifier(char.int);

    const attackRoll = rollD20();
    const toHit = attackRoll.total + mod + Math.floor(char.level / 4 + 2);
    state.addLog(`You rolled ${attackRoll.total} to hit...`);

    if (attackRoll.isFail) {
      state.addLog("Critical Miss!");
      emitJuice('miss', 'Miss', state.playerPos.x, state.playerPos.y);
      set((s) => ({ combat: { ...s.combat, actionAvailable: false } }));
    } else if (attackRoll.isCrit || toHit >= enemyData.ac) {
      const dmg = rollDice(attackRoll.isCrit ? 2 : 1, char.characterClass === "Fighter" ? 10 : 6) + mod;
      emitJuice('damage', dmg, state.playerPos.x, state.playerPos.y);
      emitShake();
      const newHp = Math.max(0, state.combat.enemyHp - dmg);
      state.addLog(attackRoll.isCrit ? `CRITICAL HIT! Dealt ${dmg} damage.` : `Hit! Dealt ${dmg} damage.`);

      if (newHp === 0) {
        const xp = enemyData.xp ?? 50;
        const newMap = state.mapData.map((r) => [...r]);
        for (let y = 0; y < newMap.length; y++) for (let x = 0; x < newMap[y].length; x++) if (newMap[y][x] === state.combat.enemyId) newMap[y][x] = '.';
        set((s) => ({ mapData: newMap, combat: { ...s.combat, isActive: false, enemyId: null, enemyData: null } }));
        let world = enemyData.id === "hollow_king" ? { ...get().world, flags: { ...get().world.flags, king_dead: true } } : get().world;
        const p = progress(world, { type: "kill", targetId: enemyData.id, tags: enemyData.tags });
        world = p.world;
        const msgs = [enemyData.defeatLine ?? `Defeated ${enemyData.name}.`, `Gained ${xp} XP.`, ...p.messages];
        // A quest that completes on its own (turnIn "auto") pays out when its objectives are met.
        let rewards = { xp, gold: 0 };
        for (const q of Object.values(QuestData)) {
          if (q.turnIn !== "auto") continue;
          const fx = applyEffect({ completeQuest: q.id }, world);
          if (fx.messages.length) { world = fx.world; msgs.push(...fx.messages); rewards = { xp: rewards.xp + fx.rewards.xp, gold: rewards.gold + fx.rewards.gold }; }
        }
        commit(world, msgs, rewards);
      } else {
        set((s) => ({ combat: { ...s.combat, enemyHp: newHp, actionAvailable: false } }));
      }
    } else {
      state.addLog("Missed the target.");
      emitJuice('miss', 'Miss', state.playerPos.x, state.playerPos.y);
      set((s) => ({ combat: { ...s.combat, actionAvailable: false } }));
    }
  },

  endTurn: () => {
    const state = get();
    if (!state.combat.isActive || !state.combat.enemyData || !state.character) return;
    state.addLog("--- Enemy Turn ---");
    const enemyRoll = rollD20();
    const enemyToHit = enemyRoll.total + state.combat.enemyData.attackMod;
    if (enemyRoll.isCrit || enemyToHit >= state.character.ac) {
      const dmg = rollDice(enemyRoll.isCrit ? 2 : 1, state.combat.enemyData.damageDie);
      state.addLog(`Enemy hits you for ${dmg} damage!`);
      emitShake();
      emitJuice('damage', dmg, state.playerPos.x, state.playerPos.y);
      set((s) => ({ character: s.character ? { ...s.character, hp: Math.max(0, s.character.hp - dmg) } : null }));
    } else {
      state.addLog("Enemy attacks and misses.");
    }
    state.addLog("--- Your Turn ---");
    set((s) => ({ combat: { ...s.combat, actionAvailable: true, bonusAvailable: true, movementLeft: 6 } }));
  }
  };
});
