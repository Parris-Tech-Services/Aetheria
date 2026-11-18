import { LoreEntry } from "./types";

// Short, local, concrete. Lore is learned from people and objects in the world, never from a narrator.
export const LoreData: Record<string, LoreEntry> = {
  the_sour: {
    id: "the_sour",
    title: "The Sour",
    text: "Nobody in the village says \"curse\". They say the soil has gone sour: wells that taste of copper, bread that will not rise, the dead who will not stay down. It started at the barrow and it creeps a few paces every year.",
    category: "history",
    discoverable: true,
    discoveredBy: "dialogue:jila_mossbind",
  },
  the_ashfields: {
    id: "the_ashfields",
    title: "The Ashfields",
    text: "A kingdom, until the king came. The stories say one day. Katon says a season, because nothing burns that well that fast. What is left is stone and a great deal of wind. Moonbloom grows at the old cairns.",
    category: "history",
    discoverable: true,
    discoveredBy: "dialogue:katon_wanderer",
  },
  the_rotted_barrow: {
    id: "the_rotted_barrow",
    title: "The Rotted Barrow",
    text: "The barrow was a spring shrine before it was a graveyard. The spirits left first. The village kept bringing offerings for a century, then bread for names nobody could read, then nothing at all.",
    category: "history",
    discoverable: true,
    discoveredBy: "dialogue:resad_priest",
  },
  spring_spirits: {
    id: "spring_spirits",
    title: "The Spring Spirits",
    text: "From the journal: \"They were never gods. They were the reason a well stayed sweet. We paid them in bread and they paid us in not being thirsty. When they stopped answering we told ourselves they were sulking.\"",
    category: "legend",
    discoverable: true,
    discoveredBy: "item:crumbled_journal",
  },
  the_hollow_king: {
    id: "the_hollow_king",
    title: "The Hollow King",
    text: "A man who wanted to stay. That is all anyone has left of him. He stayed too long, and the staying got into the soil.",
    category: "legend",
    discoverable: true,
    discoveredBy: "dialogue:resad_priest",
  },
  fenwick_master: {
    id: "fenwick_master",
    title: "Fenwick's Master",
    text: "Hobb Skerry forged the village's first iron: the gate hinges, a plough, one hammer he would not let Fenwick touch for six years. \"Hold it when you've earned the weight,\" he said. Fenwick held it twice.",
    category: "npc",
    discoverable: true,
    discoveredBy: "dialogue:fenwick_blacksmith",
  },
};
