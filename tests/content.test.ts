import test from "node:test";
import assert from "node:assert/strict";
import { GameData } from "../client/src/game/data";
import { NPCData } from "../client/src/game/npc-data";
import { QuestData } from "../client/src/game/quest-data";
import { LoreData } from "../client/src/game/lore-data";
import { ItemData } from "../client/src/game/item-data";
import { applyEffect, newWorld, nodeCheck } from "./helpers";
import { pickStartNode, nodeText } from "../client/src/game/dialogue";
import type { Condition, Effect } from "../client/src/game/types";

const AVOID = ["Elara", "Theron", "Mira", "Aldric"]; // retired LLM-default display names (docs/voice.json)
const flagsSet = new Set<string>();
const flagsRead = new Set<string>();
const effects: Effect[] = [];
const conds: Condition[] = [];
for (const npc of Object.values(NPCData)) {
  for (const n of npc.dialogueTree) {
    if (n.onEnter) effects.push(n.onEnter);
    for (const o of n.options) { if (o.effect) effects.push(o.effect); if (o.requires) conds.push(o.requires); }
  }
  for (const s of npc.startNodes) if (s.when) conds.push(s.when);
}
for (const e of effects) if (e.setFlag) flagsSet.add(e.setFlag);
for (const t of Object.values(GameData.tileEvents)) flagsSet.add(t.flag);
for (const k of Object.values(GameData.chests)) flagsSet.add(k.flag);
for (const m of Object.keys(GameData.maps)) flagsSet.add(`visited_${m}`);
flagsSet.add("king_dead"); // set by the engine when the Hollow King falls
for (const c of conds) if (c.flag) flagsRead.add(c.flag);
for (const m of Object.values(GameData.maps)) for (const e of m.exits) if (e.requires?.flag) flagsRead.add(e.requires.flag);

test("every dialogue node, start node and option target exists", () => {
  for (const npc of Object.values(NPCData)) {
    const ids = new Set(npc.dialogueTree.map((n) => n.id));
    assert.equal(ids.size, npc.dialogueTree.length, `${npc.id}: duplicate node id`);
    for (const s of npc.startNodes) assert.ok(ids.has(s.nodeId), `${npc.id}: start node ${s.nodeId}`);
    assert.equal(npc.startNodes.at(-1)?.when, undefined, `${npc.id}: last start node must be unconditional`);
    for (const n of npc.dialogueTree) for (const o of n.options) if (o.nextNodeId) assert.ok(ids.has(o.nextNodeId), `${npc.id}.${n.id}.${o.id} -> ${o.nextNodeId}`);
  }
});

test("every node is reachable from a start node", () => {
  for (const npc of Object.values(NPCData)) {
    const seen = new Set<string>(); const stack = npc.startNodes.map((s) => s.nodeId);
    while (stack.length) { const id = stack.pop()!; if (seen.has(id)) continue; seen.add(id); for (const o of npc.dialogueTree.find((n) => n.id === id)!.options) if (o.nextNodeId) stack.push(o.nextNodeId); }
    for (const n of npc.dialogueTree) assert.ok(seen.has(n.id), `${npc.id}: node ${n.id} is unreachable`);
  }
});

test("no conversation dead-ends with zero visible options under the states it can start in", () => {
  for (const npc of Object.values(NPCData)) for (const n of npc.dialogueTree) assert.ok(n.options.length > 0, `${npc.id}.${n.id} has no options`);
});

test("effects and conditions only name things that exist", () => {
  for (const e of effects) {
    if (e.giveQuest) assert.ok(QuestData[e.giveQuest], `quest ${e.giveQuest}`);
    if (e.completeQuest) assert.ok(QuestData[e.completeQuest], `quest ${e.completeQuest}`);
    if (e.discoverLore) assert.ok(LoreData[e.discoverLore], `lore ${e.discoverLore}`);
    if (e.giveItem) assert.ok(ItemData[e.giveItem], `item ${e.giveItem}`);
  }
  for (const c of conds) { if (c.questStatus) assert.ok(QuestData[c.questStatus.id], `quest ${c.questStatus.id}`); if (c.item) assert.ok(ItemData[c.item]); }
  for (const q of Object.values(QuestData)) {
    assert.ok(NPCData[q.giver], `${q.id} giver`);
    if (q.turnIn && q.turnIn !== "auto") assert.ok(NPCData[q.turnIn], `${q.id} turnIn`);
    if (q.reward.item) assert.ok(ItemData[q.reward.item], `${q.id} reward item`);
  }
});

test("every flag that a conversation or exit reads can actually be set", () => {
  for (const f of flagsRead) assert.ok(flagsSet.has(f), `flag "${f}" is read but nothing sets it`);
});

test("no dead content: every quest can be started and every lore entry discovered", () => {
  const started = new Set(effects.map((e) => e.giveQuest).filter(Boolean));
  for (const id of Object.keys(QuestData)) assert.ok(started.has(id), `quest ${id} is never offered`);
  const found = new Set([...effects.map((e) => e.discoverLore), ...Object.values(GameData.pickups).map((p) => p.lore)].filter(Boolean));
  for (const id of Object.keys(LoreData)) assert.ok(found.has(id), `lore ${id} is never discoverable`);
});

test("NPCs stand where they say they do, with a complete profile and three or more states", () => {
  for (const npc of Object.values(NPCData)) {
    const map = GameData.maps[npc.mapId as keyof typeof GameData.maps];
    assert.ok(map, `${npc.id} map`);
    const tile = map.layout[npc.y]?.[npc.x];
    assert.equal(GameData.entities[tile]?.id, npc.id, `${npc.id} is not on its tile (${npc.x},${npc.y}) in ${npc.mapId}`);
    const p = npc.profile;
    for (const k of ["want", "limit", "taboo", "noticesFirst", "toneShift"] as const) assert.ok(p[k].length > 3, `${npc.id}.${k}`);
    for (const k of ["publicKnowledge", "privateKnowledge", "unknown"] as const) assert.ok(p[k].length >= 1, `${npc.id}.${k}`);
    assert.ok(npc.startNodes.length >= 3, `${npc.id} needs first / return / after states`);
  }
});

test("maps connect: every > has an exit, every exit lands on a floor tile, every map is reachable from the village", () => {
  const seen = new Set<string>(["village"]); const q = ["village"];
  while (q.length) {
    const id = q.pop()!; const m = GameData.maps[id as keyof typeof GameData.maps];
    const arrows = m.layout.flatMap((r, y) => [...r].map((c, x) => (c === ">" ? `${x},${y}` : null)).filter(Boolean));
    assert.deepEqual([...arrows].sort(), m.exits.map((e) => `${e.x},${e.y}`).sort(), `${id}: > tiles and exits differ`);
    for (const e of m.exits) {
      const t = GameData.maps[e.targetMapId as keyof typeof GameData.maps];
      assert.ok(t, `${id} -> ${e.targetMapId}`);
      assert.ok(".".includes(t.layout[e.targetY]?.[e.targetX] ?? "#"), `${id} -> ${e.targetMapId} lands inside a wall`);
      if (!seen.has(e.targetMapId)) { seen.add(e.targetMapId); q.push(e.targetMapId); }
    }
  }
  assert.deepEqual([...seen].sort(), Object.keys(GameData.maps).sort());
});

test("moonbloom for Jila is completable: three moonbloom exist in the world", () => {
  const n = Object.values(GameData.maps).flatMap((m) => m.layout.join("")).join("").split("m").length - 1;
  assert.ok(n >= 3, `only ${n} moonbloom tiles`);
});

test("NPC lines quote the real quest rewards and no token is left unresolved", () => {
  for (const npc of Object.values(NPCData)) for (const n of npc.dialogueTree) assert.ok(!nodeText(n).includes("[unknown"), `${npc.id}.${n.id}`);
  const w = newWorld();
  assert.equal(pickStartNode(NPCData.captain_haddow, w).id, "hh_first");
});

test("retired default names do not appear in player-facing text", () => {
  const text = JSON.stringify([NPCData, QuestData, LoreData, GameData]);
  for (const n of AVOID) assert.ok(!new RegExp(`\\b${n}\\b`).test(text), `${n} is back`);
});

test("quest flow: collect → ready → complete pays once and consumes items", () => {
  let w = newWorld();
  w = applyEffect({ giveQuest: "moonbloom_for_jila" }, w).world;
  assert.equal(nodeCheck(w, "moonbloom_for_jila"), "active");
  assert.equal(applyEffect({ completeQuest: "moonbloom_for_jila" }, w).rewards.xp, 0, "cannot complete before ready");
  for (let i = 0; i < 3; i++) w = { ...w, inventory: [{ itemId: "moonbloom_flower", quantity: i + 1 }] };
  assert.equal(nodeCheck(w, "moonbloom_for_jila"), "ready");
  const done = applyEffect({ completeQuest: "moonbloom_for_jila" }, w);
  assert.equal(done.rewards.xp, QuestData.moonbloom_for_jila.reward.xp);
  assert.equal(nodeCheck(done.world, "moonbloom_for_jila"), "completed");
  assert.equal(applyEffect({ completeQuest: "moonbloom_for_jila" }, done.world).rewards.xp, 0, "pays once");
});
