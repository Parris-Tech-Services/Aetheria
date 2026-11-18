// Pure dialogue selection: which node a conversation starts at, which options are visible, resolved text.
import type { DialogueNode, DialogueOption, NPC } from "./types";
import { conditionMet, resolveText, type WorldState } from "./world";

export function nodeById(npc: NPC, id: string): DialogueNode {
  const n = npc.dialogueTree.find((d) => d.id === id);
  if (!n) throw new Error(`${npc.id}: unknown dialogue node "${id}"`);
  return n;
}
export function pickStartNode(npc: NPC, w: WorldState): DialogueNode {
  for (const s of npc.startNodes) if (conditionMet(s.when, w)) return nodeById(npc, s.nodeId);
  throw new Error(`${npc.id}: no start node matches the current state (the last startNodes entry needs no condition)`);
}
export function visibleOptions(node: DialogueNode, w: WorldState): DialogueOption[] {
  return node.options.filter((o) => conditionMet(o.requires, w));
}
export const nodeText = (node: DialogueNode): string => resolveText(node.text);
