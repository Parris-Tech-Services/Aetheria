import { create } from "zustand";
import { type Character } from "@shared/schema";
import { GameData, type EntityData } from "./data";

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

type GameStore = {
  character: Character | null;
  mapId: string;
  mapData: string[][];
  fogData: boolean[][];
  playerPos: { x: number, y: number };
  combat: CombatState;
  
  // Actions
  initGame: (char: Character) => void;
  movePlayer: (dx: number, dy: number) => void;
  startCombat: (enemyChar: string, x: number, y: number) => void;
  attackEnemy: () => void;
  endTurn: () => void;
  addLog: (msg: string) => void;
};

// Dispatch custom events for juice
const emitJuice = (type: 'damage' | 'heal' | 'miss', amount: number | string, x: number, y: number) => {
  window.dispatchEvent(new CustomEvent('game-juice', {
    detail: { type, amount, x, y }
  }));
};

const emitShake = () => {
  window.dispatchEvent(new Event('game-shake'));
};

export const useGameStore = create<GameStore>((set, get) => ({
  character: null,
  mapId: "village",
  mapData: [],
  fogData: [],
  playerPos: { x: 1, y: 1 },
  combat: {
    isActive: false,
    enemyId: null,
    enemyMaxHp: 0,
    enemyHp: 0,
    enemyData: null,
    actionAvailable: true,
    bonusAvailable: true,
    movementLeft: 6,
    log: []
  },

  initGame: (char) => {
    const rawMap = GameData.maps[char.mapId as keyof typeof GameData.maps]?.layout || GameData.maps.village.layout;
    const grid = rawMap.map(row => row.split(''));
    
    // Initialize fog (all hidden initially)
    const fog = grid.map(row => row.map(() => true));
    
    // Reveal starting area
    for(let dy = -3; dy <= 3; dy++) {
      for(let dx = -3; dx <= 3; dx++) {
        if (char.y + dy >= 0 && char.y + dy < fog.length && char.x + dx >= 0 && char.x + dx < fog[0].length) {
          if (dx*dx + dy*dy <= 10) { // Rough circle
            fog[char.y + dy][char.x + dx] = false;
          }
        }
      }
    }

    set({ 
      character: char, 
      mapId: char.mapId,
      playerPos: { x: char.x, y: char.y },
      mapData: grid,
      fogData: fog,
      combat: { ...get().combat, isActive: false, log: ["Welcome to Aetheria."] }
    });
  },

  addLog: (msg) => {
    set(state => ({
      combat: { ...state.combat, log: [...state.combat.log, msg].slice(-5) }
    }));
  },

  movePlayer: (dx, dy) => {
    const state = get();
    if (!state.character) return;
    if (state.combat.isActive && state.combat.movementLeft <= 0) {
      state.addLog("No movement left this turn.");
      return;
    }

    const nx = state.playerPos.x + dx;
    const ny = state.playerPos.y + dy;

    if (ny < 0 || ny >= state.mapData.length || nx < 0 || nx >= state.mapData[0].length) return;
    
    const targetTile = state.mapData[ny][nx];

    if (targetTile === '#') return; // Wall

    // Check for entities
    if (targetTile !== '.' && targetTile !== '@') {
      const entity = GameData.entities[targetTile];
      if (entity) {
        if (entity.isHostile) {
          if (!state.combat.isActive) {
            get().startCombat(targetTile, nx, ny);
          } else {
            get().attackEnemy();
          }
          return; // Don't move into enemy tile
        } else {
          state.addLog(`You encounter: ${entity.name}`);
          return;
        }
      }
    }

    // Actually move
    const newFog = [...state.fogData.map(r => [...r])];
    for(let fdy = -3; fdy <= 3; fdy++) {
      for(let fdx = -3; fdx <= 3; fdx++) {
        if (ny + fdy >= 0 && ny + fdy < newFog.length && nx + fdx >= 0 && nx + fdx < newFog[0].length) {
          if (fdx*fdx + fdy*fdy <= 10) {
            newFog[ny + fdy][nx + fdx] = false;
          }
        }
      }
    }

    set(s => ({
      playerPos: { x: nx, y: ny },
      fogData: newFog,
      combat: s.combat.isActive ? { ...s.combat, movementLeft: s.combat.movementLeft - 1 } : s.combat
    }));
  },

  startCombat: (enemyChar, ex, ey) => {
    const enemyData = GameData.entities[enemyChar];
    if (!enemyData) return;

    set(state => ({
      combat: {
        isActive: true,
        enemyId: enemyChar,
        enemyData,
        enemyHp: enemyData.maxHp,
        enemyMaxHp: enemyData.maxHp,
        actionAvailable: true,
        bonusAvailable: true,
        movementLeft: 6, // Base speed
        log: [...state.combat.log, `Combat started with ${enemyData.name}!`]
      }
    }));
  },

  attackEnemy: () => {
    const state = get();
    if (!state.combat.isActive || !state.character || !state.combat.enemyData) return;
    if (!state.combat.actionAvailable) {
      state.addLog("No action available!");
      return;
    }

    const { enemyData } = state.combat;
    const char = state.character;
    
    // Simplistic stats mapping for attack
    let mod = calculateModifier(char.str);
    if (char.characterClass === "Rogue") mod = calculateModifier(char.dex);
    if (char.characterClass === "Wizard") mod = calculateModifier(char.int);

    const attackRoll = rollD20();
    const toHit = attackRoll.total + mod + Math.floor(char.level / 4 + 2); // Prof bonus rough calc

    state.addLog(`You rolled ${attackRoll.total} to hit...`);

    if (attackRoll.isFail) {
      state.addLog("Critical Miss!");
      emitJuice('miss', 'Miss', state.playerPos.x, state.playerPos.y); // Rough pos
    } else if (attackRoll.isCrit || toHit >= enemyData.ac) {
      // Hit!
      const diceCount = attackRoll.isCrit ? 2 : 1;
      const dmg = rollDice(diceCount, char.characterClass === "Fighter" ? 10 : 6) + mod;
      
      emitJuice('damage', dmg, state.playerPos.x, state.playerPos.y);
      emitShake();

      const newHp = Math.max(0, state.combat.enemyHp - dmg);
      
      if (attackRoll.isCrit) state.addLog(`CRITICAL HIT! Dealt ${dmg} damage.`);
      else state.addLog(`Hit! Dealt ${dmg} damage.`);

      if (newHp === 0) {
        state.addLog(`Defeated ${enemyData.name}! Gained 50 XP.`);
        // Remove enemy from map (Simplified: just clear surrounding tiles that match)
        const newMap = state.mapData.map(r => [...r]);
        for(let y=0; y<newMap.length; y++) {
          for(let x=0; x<newMap[y].length; x++) {
            if (newMap[y][x] === state.combat.enemyId) newMap[y][x] = '.';
          }
        }

        set(s => ({
          mapData: newMap,
          combat: { ...s.combat, isActive: false, enemyId: null, enemyData: null }
        }));
      } else {
        set(s => ({
          combat: { ...s.combat, enemyHp: newHp, actionAvailable: false }
        }));
      }
    } else {
      state.addLog("Missed the target.");
      emitJuice('miss', 'Miss', state.playerPos.x, state.playerPos.y);
      set(s => ({
        combat: { ...s.combat, actionAvailable: false }
      }));
    }
  },

  endTurn: () => {
    const state = get();
    if (!state.combat.isActive || !state.combat.enemyData || !state.character) return;

    state.addLog("--- Enemy Turn ---");
    
    // Enemy AI: if adjacent, attack. (Assuming adjacent for this demo)
    const enemyRoll = rollD20();
    const enemyToHit = enemyRoll.total + state.combat.enemyData.attackMod;
    
    if (enemyRoll.isCrit || enemyToHit >= state.character.ac) {
      const dmg = rollDice(enemyRoll.isCrit ? 2 : 1, state.combat.enemyData.damageDie);
      state.addLog(`Enemy hits you for ${dmg} damage!`);
      emitShake();
      emitJuice('damage', dmg, state.playerPos.x, state.playerPos.y);
      
      // Update character HP (ideally this triggers a DB save too, managed in component)
      set(s => ({
        character: s.character ? { ...s.character, hp: Math.max(0, s.character.hp - dmg) } : null
      }));
    } else {
      state.addLog("Enemy attacks and misses.");
    }

    state.addLog("--- Your Turn ---");
    set(s => ({
      combat: { ...s.combat, actionAvailable: true, bonusAvailable: true, movementLeft: 6 }
    }));
  }
}));
