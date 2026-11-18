import { Quest } from "./types";

// Four quests, all reachable in the live world. Threads that need NPCs or enemies the game does not contain
// (a refugee, an oracle, a goblin raider) are parked in docs/ORIGINALITY-PROGRAM.md, not left half-wired here.
export const QuestData: Record<string, Quest> = {
  moonbloom_for_jila: {
    id: "moonbloom_for_jila",
    title: "Moonbloom for Jila",
    description: "Jila Mossbind needs three moonbloom for a cough syrup. They grow where the soil has soured: one in the woods east of the village, two out in the Ashfields.",
    status: "inactive",
    objectives: [
      { id: "obj_bloom", description: "Collect 3 moonbloom flowers", type: "collect", targetId: "moonbloom_flower", count: 3, currentCount: 0, completed: false },
    ],
    reward: { xp: 100, gold: 50, item: "lesser_healing_potion" },
    giver: "jila_mossbind",
  },

  clear_barrow: {
    id: "clear_barrow",
    title: "Quiet the Barrow",
    description: "Captain Haddow will not send another guard into the Rotted Barrow. Put three of the dead back down, and touch the altar at the crypt's heart.",
    status: "inactive",
    objectives: [
      { id: "obj_dead", description: "Put down 3 of the dead", type: "kill", targetId: "undead", count: 3, currentCount: 0, completed: false },
      { id: "obj_altar", description: "Touch the altar at the crypt's heart", type: "reach", targetId: "crypt_altar", count: 1, currentCount: 0, completed: false },
    ],
    reward: { xp: 200, gold: 75, item: "iron_shield" },
    giver: "captain_haddow",
  },

  fenwick_hammer: {
    id: "fenwick_hammer",
    title: "The Master's Hammerhead",
    description: "Something from the barrow carried off the head of Fenwick's master's hammer and left the haft. Find the head among the graves.",
    status: "inactive",
    objectives: [
      { id: "obj_head", description: "Collect Fenwick's hammerhead", type: "collect", targetId: "fenwick_hammerhead", count: 1, currentCount: 0, completed: false },
    ],
    reward: { xp: 150, gold: 100, item: "fenwick_hammer" },
    giver: "fenwick_blacksmith",
  },

  final_confrontation: {
    id: "final_confrontation",
    title: "Whatever Waits Behind the Door",
    description: "The seal on the barrow's north door has let go. Brother Resad will not say what is behind it.",
    status: "inactive",
    objectives: [
      { id: "obj_king", description: "Face the Hollow King", type: "kill", targetId: "hollow_king", count: 1, currentCount: 0, completed: false },
    ],
    reward: { xp: 500, gold: 500, item: "crown_of_dominion" },
    giver: "resad_priest",
    turnIn: "auto",
  },
};
