// Pure world-state rules: flags, reputation, quests, lore, inventory. No UI, no randomness, no DOM.
// The engine owns truth: dialogue only REQUESTS effects; this module decides whether they apply.
import type { Condition, Effect, Quest, QuestStatus } from "./types";
import { QuestData } from "./quest-data";
import { ItemData } from "./item-data";

export interface QuestProgress { status: QuestStatus; counts: Record<string, number> }
export interface WorldState {
  flags: Record<string, boolean | number | string>;
  reputation: number;
  quests: Record<string, QuestProgress>;
  lore: string[];
  inventory: { itemId: string; quantity: number }[];
  stats: Record<string, number>;
}
export type Rewards = { xp: number; gold: number };
export type ProgressEvent =
  | { type: "kill"; targetId: string; tags?: string[] }
  | { type: "collect"; itemId: string }
  | { type: "talk"; npcId: string }
  | { type: "reach"; tag: string };

export function newWorld(init?: Partial<WorldState>): WorldState {
  return { flags: {}, reputation: 0, quests: {}, lore: [], inventory: [], stats: {}, ...init };
}
const clone = (w: WorldState): WorldState => ({
  ...w, flags: { ...w.flags }, quests: Object.fromEntries(Object.entries(w.quests).map(([k, v]) => [k, { status: v.status, counts: { ...v.counts } }])),
  lore: [...w.lore], inventory: w.inventory.map((i) => ({ ...i })), stats: { ...w.stats },
});

export function itemCount(w: WorldState, itemId: string): number {
  return w.inventory.find((i) => i.itemId === itemId)?.quantity ?? 0;
}
export function addItem(w: WorldState, itemId: string, qty = 1): WorldState {
  const n = clone(w);
  const e = n.inventory.find((i) => i.itemId === itemId);
  if (e) e.quantity += qty; else n.inventory.push({ itemId, quantity: qty });
  return n;
}
function removeItem(w: WorldState, itemId: string, qty: number): WorldState {
  const n = clone(w);
  const e = n.inventory.find((i) => i.itemId === itemId);
  if (e) { e.quantity -= qty; if (e.quantity <= 0) n.inventory = n.inventory.filter((i) => i.itemId !== itemId); }
  return n;
}

// ---- quests
export function objectiveCount(w: WorldState, q: Quest, objId: string): number {
  const obj = q.objectives.find((o) => o.id === objId);
  if (!obj) return 0;
  if (obj.type === "collect") return Math.min(obj.count, itemCount(w, obj.targetId)); // truthful: you either carry it or you do not
  return Math.min(obj.count, w.quests[q.id]?.counts[objId] ?? 0);
}
export function questReady(w: WorldState, id: string): boolean {
  const q = QuestData[id], p = w.quests[id];
  if (!q || !p || p.status !== "active") return false;
  return q.objectives.every((o) => objectiveCount(w, q, o.id) >= o.count);
}
export function questState(w: WorldState, id: string): "inactive" | "active" | "ready" | "completed" | "failed" {
  const p = w.quests[id];
  if (!p) return "inactive";
  if (p.status === "active") return questReady(w, id) ? "ready" : "active";
  return p.status as "inactive" | "completed" | "failed";
}

// ---- conditions
export function conditionMet(c: Condition | undefined, w: WorldState): boolean {
  if (!c) return true;
  if (c.flag !== undefined && !w.flags[c.flag]) return false;
  if (c.notFlag !== undefined && w.flags[c.notFlag]) return false;
  if (c.item !== undefined && itemCount(w, c.item) < 1) return false;
  if (c.questStatus && questState(w, c.questStatus.id) !== c.questStatus.status) return false;
  if (c.minRep !== undefined && w.reputation < c.minRep) return false;
  if (c.maxRep !== undefined && w.reputation > c.maxRep) return false;
  if (c.stat !== undefined) { const v = w.stats[c.stat]; if (v === undefined || v < (c.minValue ?? 0)) return false; } // unknown stat denies
  return true;
}

// ---- effects
export function applyEffect(e: Effect | undefined, w: WorldState): { world: WorldState; messages: string[]; rewards: Rewards } {
  let world = clone(w); const messages: string[] = []; const rewards: Rewards = { xp: 0, gold: 0 };
  if (!e) return { world, messages, rewards };
  if (e.setFlag) world.flags[e.setFlag] = true;
  if (e.adjustRep) { world.reputation += e.adjustRep; messages.push(e.adjustRep > 0 ? "The village thinks a little better of you." : "The village thinks a little worse of you."); }
  if (e.giveItem) { world = addItem(world, e.giveItem); messages.push(`Received: ${ItemData[e.giveItem]?.name ?? e.giveItem}.`); }
  if (e.takeItem) world = removeItem(world, e.takeItem, 1);
  if (e.giveGold) { rewards.gold += e.giveGold; messages.push(`Received ${e.giveGold} gold.`); }
  if (e.discoverLore && !world.lore.includes(e.discoverLore)) { world.lore.push(e.discoverLore); messages.push("Journal updated: new lore."); }
  if (e.giveQuest && questState(world, e.giveQuest) === "inactive" && QuestData[e.giveQuest]) {
    world.quests[e.giveQuest] = { status: "active", counts: {} };
    messages.push(`Quest started: ${QuestData[e.giveQuest].title}.`);
  }
  if (e.completeQuest && questReady(world, e.completeQuest)) {
    const q = QuestData[e.completeQuest];
    for (const o of q.objectives) if (o.type === "collect") world = removeItem(world, o.targetId, o.count);
    world.quests[q.id] = { ...world.quests[q.id], status: "completed" };
    rewards.xp += q.reward.xp; rewards.gold += q.reward.gold;
    if (q.reward.item) world = addItem(world, q.reward.item);
    messages.push(`Quest complete: ${q.title}. +${q.reward.xp} XP, +${q.reward.gold} gold${q.reward.item ? `, ${ItemData[q.reward.item]?.name ?? q.reward.item}` : ""}.`);
  }
  return { world, messages, rewards };
}

// ---- progress events (kills, pickups, talking, reaching places)
export function progress(w: WorldState, ev: ProgressEvent): { world: WorldState; messages: string[] } {
  const world = clone(w); const messages: string[] = [];
  for (const [qid, p] of Object.entries(world.quests)) {
    if (p.status !== "active") continue;
    const q = QuestData[qid]; if (!q) continue;
    for (const o of q.objectives) {
      if (o.type === "collect" && ev.type === "collect" && ev.itemId === o.targetId) { messages.push(`${q.title}: ${Math.min(o.count, itemCount(world, o.targetId))}/${o.count} ${o.description.replace(/^Collect \d+ /, "")}`); continue; }
      const hit = (o.type === "kill" && ev.type === "kill" && (ev.targetId === o.targetId || ev.tags?.includes(o.targetId)))
        || (o.type === "talk" && ev.type === "talk" && ev.npcId === o.targetId)
        || (o.type === "reach" && ev.type === "reach" && ev.tag === o.targetId);
      if (!hit) continue;
      const before = p.counts[o.id] ?? 0;
      if (before >= o.count) continue;
      p.counts[o.id] = before + 1;
      messages.push(`${q.title}: ${o.description} (${p.counts[o.id]}/${o.count})`);
    }
    if (questReady(world, qid) && !questReady(w, qid)) messages.push(`${q.title}: report back to ${q.turnIn ?? q.giver}.`);
  }
  return { world, messages };
}

// ---- text tokens: NPCs quote the real numbers, so what they say always matches the quest data
export function resolveText(text: string): string {
  return text.replace(/\{(gold|xp|item):([a-z_0-9]+)\}/g, (_m, kind: string, id: string) => {
    const q = QuestData[id]; if (!q) return `[unknown quest ${id}]`;
    if (kind === "gold") return String(q.reward.gold);
    if (kind === "xp") return String(q.reward.xp);
    return q.reward.item ? (ItemData[q.reward.item]?.name ?? q.reward.item) : "nothing";
  });
}

// ---- persistence helpers (JSON-safe)
export const serializeWorld = (w: WorldState) => JSON.stringify(w);
export function parseWorld(raw: string | null): WorldState {
  if (!raw) return newWorld();
  try { const o = JSON.parse(raw); return newWorld({ flags: o.flags ?? {}, reputation: o.reputation ?? 0, quests: o.quests ?? {}, lore: o.lore ?? [], inventory: o.inventory ?? [], stats: o.stats ?? {} }); }
  catch { return newWorld(); }
}
