import { Quest } from "./types";

export const QuestData: Record<string, Quest> = {
  elara_herbs: {
    id: "elara_herbs",
    title: "Elara's Rare Herbs",
    description: "Gather 3 moonbloom flowers for Elara the herbalist.",
    status: "inactive",
    objectives: [
      {
        id: "obj_1",
        description: "Collect 3 moonbloom flowers",
        type: "collect",
        targetId: "moonbloom_flower",
        count: 3,
        currentCount: 0,
        completed: false,
      },
    ],
    reward: {
      xp: 100,
      gold: 50,
      item: "lesser_healing_potion",
    },
    giver: "elara_mossbind",
  },

  clear_barrow: {
    id: "clear_barrow",
    title: "Clear the Rotted Barrow",
    description: "Defeat the undead in the Rotted Barrow crypt.",
    status: "inactive",
    objectives: [
      {
        id: "obj_2",
        description: "Defeat 3 undead enemies",
        type: "kill",
        targetId: "undead",
        count: 3,
        currentCount: 0,
        completed: false,
      },
      {
        id: "obj_3",
        description: "Reach the altar at the crypt's heart",
        type: "reach",
        targetId: "crypt_altar",
        count: 1,
        currentCount: 0,
        completed: false,
      },
    ],
    reward: {
      xp: 200,
      gold: 75,
      item: "iron_shield",
    },
    giver: "theron_captain",
  },

  fenwick_hammer: {
    id: "fenwick_hammer",
    title: "Old Fenwick's Hammer",
    description: "Retrieve the goblin-stolen hammer from the Rotted Barrow.",
    status: "inactive",
    objectives: [
      {
        id: "obj_4",
        description: "Defeat the goblin raider",
        type: "kill",
        targetId: "goblin_raider",
        count: 1,
        currentCount: 0,
        completed: false,
      },
      {
        id: "obj_5",
        description: "Return the hammer to Fenwick",
        type: "talk",
        targetId: "fenwick_blacksmith",
        count: 1,
        currentCount: 0,
        completed: false,
      },
    ],
    reward: {
      xp: 150,
      gold: 100,
      item: "fenwick_hammer",
    },
    giver: "fenwick_blacksmith",
  },

  find_riven_family: {
    id: "find_riven_family",
    title: "Find Riven's Family",
    description: "Help Riven find clues about their lost family in the Ashfields.",
    status: "inactive",
    objectives: [
      {
        id: "obj_6",
        description: "Talk to NPCs who have clues",
        type: "talk",
        targetId: "various_npcs",
        count: 3,
        currentCount: 0,
        completed: false,
      },
      {
        id: "obj_7",
        description: "Return to Riven with news",
        type: "reach",
        targetId: "riven_location",
        count: 1,
        currentCount: 0,
        completed: false,
      },
    ],
    reward: {
      xp: 175,
      gold: 100,
      item: "riven_family_locket",
    },
    giver: "riven_refugee",
  },

  oracle_test: {
    id: "oracle_test",
    title: "The Oracle's Test",
    description: "Answer 3 riddles from the Ashen Oracle.",
    status: "inactive",
    objectives: [
      {
        id: "obj_8",
        description: "Answer 3 riddles correctly",
        type: "talk",
        targetId: "ashen_oracle",
        count: 3,
        currentCount: 0,
        completed: false,
      },
    ],
    reward: {
      xp: 300,
      gold: 150,
      item: "barrow_seal",
    },
    giver: "ashen_oracle",
  },

  final_confrontation: {
    id: "final_confrontation",
    title: "The Final Confrontation",
    description: "Face the Hollow King in his throne chamber.",
    status: "inactive",
    objectives: [
      {
        id: "obj_9",
        description: "Defeat the Hollow King",
        type: "kill",
        targetId: "hollow_king",
        count: 1,
        currentCount: 0,
        completed: false,
      },
    ],
    reward: {
      xp: 500,
      gold: 500,
      item: "crown_of_dominion",
    },
    giver: "auto_triggered",
  },
};
