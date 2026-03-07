import { NPC, MapId } from "./types";

export const NPCData: Record<string, NPC> = {
  // VILLAGE NPCs
  elara_mossbind: {
    id: "elara_mossbind",
    name: "Elara Mossbind",
    sprite: "🧙‍♀️",
    mapId: "village",
    x: 5,
    y: 3,
    role: "quest_giver",
    greeting: "Ah, a wanderer. Perhaps you can help me gather rare herbs...",
    repeatGreeting: "Back so soon? Have you found those moonbloom flowers?",
    dialogueTree: [
      {
        id: "elara_1",
        text: "I am Elara Mossbind, herbalist of this forest edge. The curse of the Hollow King has twisted the plants here into something darker. I need moonbloom flowers—they only grow in cursed soil. Will you gather them?",
        options: [
          {
            id: "elara_opt_1",
            label: "I'll help you find them.",
            nextNodeId: "elara_2",
            effect: { giveQuest: "elara_herbs" },
          },
          {
            id: "elara_opt_2",
            label: "Tell me more about this curse.",
            nextNodeId: "elara_lore_1",
          },
          {
            id: "elara_opt_3",
            label: "I'm not interested.",
            nextNodeId: null,
          },
        ],
      },
      {
        id: "elara_2",
        text: "Wonderful! Seek the moonbloom flowers deep in the woods. Bring three to me, and I'll teach you the arts of herbalism. You'll have the knowledge of a true healer.",
        options: [
          {
            id: "elara_opt_4",
            label: "I'll be back.",
            nextNodeId: null,
          },
        ],
      },
      {
        id: "elara_lore_1",
        text: "Long ago, this region was blessed by the Spring Spirits. But a powerful sorcerer—the one we now call the Hollow King—corrupted the land to extend his reign over death itself. His influence lingers in every shadow.",
        options: [
          {
            id: "elara_opt_5",
            label: "How can the curse be broken?",
            nextNodeId: "elara_lore_2",
          },
          {
            id: "elara_opt_6",
            label: "That's terrifying.",
            nextNodeId: null,
          },
        ],
      },
      {
        id: "elara_lore_2",
        text: "Only by facing the Hollow King himself and severing his connection to the mortal realm. It is a task for heroes. Perhaps you have the strength for it?",
        options: [
          {
            id: "elara_opt_7",
            label: "I will try.",
            nextNodeId: null,
          },
        ],
      },
    ],
    inventory: ["healing_potion", "lesser_healing_potion"],
  },

  theron_captain: {
    id: "theron_captain",
    name: "Guard Captain Theron",
    sprite: "💂",
    mapId: "village",
    x: 3,
    y: 2,
    role: "quest_giver",
    greeting: "Halt, traveler. Are you here to help defend this settlement?",
    repeatGreeting: "Status report. Have you cleared the barrow yet?",
    dialogueTree: [
      {
        id: "theron_1",
        text: "I am Captain Theron. We've had undead rising from the Rotted Barrow to the north. My guards are stretched thin. I need someone brave—or mad—enough to clear that tomb. Will you?",
        options: [
          {
            id: "theron_opt_1",
            label: "I'll clear the barrow for you.",
            nextNodeId: "theron_2",
            effect: { giveQuest: "clear_barrow" },
          },
          {
            id: "theron_opt_2",
            label: "That sounds dangerous. What's in it for me?",
            nextNodeId: "theron_reward",
          },
          {
            id: "theron_opt_3",
            label: "I need more time to prepare.",
            nextNodeId: "theron_4",
          },
        ],
      },
      {
        id: "theron_2",
        text: "Excellent. The barrow is north of here. Do not return until the undead are destroyed. I will reward you handsomely.",
        options: [
          {
            id: "theron_opt_4",
            label: "I'm on my way.",
            nextNodeId: null,
          },
        ],
      },
      {
        id: "theron_reward",
        text: "200 gold and an iron shield—the finest armor we have. Plus, the village will owe you a debt.",
        options: [
          {
            id: "theron_opt_5",
            label: "That's acceptable. I'll go.",
            nextNodeId: "theron_2",
            effect: { giveQuest: "clear_barrow" },
          },
          {
            id: "theron_opt_6",
            label: "Not enough. Goodbye.",
            nextNodeId: null,
          },
        ],
      },
      {
        id: "theron_4",
        text: "Take your time, but not too long. The undead grow stronger each night.",
        options: [
          {
            id: "theron_opt_7",
            label: "I'll return when I'm ready.",
            nextNodeId: null,
          },
        ],
      },
    ],
  },

  mira_wanderer: {
    id: "mira_wanderer",
    name: "Mira the Wanderer",
    sprite: "🧝",
    mapId: "village",
    x: 8,
    y: 5,
    role: "lore",
    greeting: "Greetings, friend. I've traveled far lands.",
    repeatGreeting: "The roads are long, aren't they?",
    dialogueTree: [
      {
        id: "mira_1",
        text: "I am Mira. I've wandered the world and seen wonders and horrors alike. I've recently returned from the Ashfields—a wasteland of war and despair to the east.",
        options: [
          {
            id: "mira_opt_1",
            label: "Tell me about the Ashfields.",
            nextNodeId: "mira_2",
          },
          {
            id: "mira_opt_2",
            label: "Why would anyone go there?",
            nextNodeId: "mira_3",
          },
        ],
      },
      {
        id: "mira_2",
        text: "The Ashfields are the remnants of a great kingdom destroyed by the Hollow King's war for dominion. Ruins scatter the landscape, and survivors still hide there. It's dangerous, but treasures and secrets remain.",
        options: [
          {
            id: "mira_opt_3",
            label: "I'll explore that region.",
            nextNodeId: "mira_unlocked",
            effect: { setFlag: "unlock_overworld" },
          },
          {
            id: "mira_opt_4",
            label: "That sounds too risky.",
            nextNodeId: null,
          },
        ],
      },
      {
        id: "mira_3",
        text: "Knowledge, artifacts, and answers. The Ashfields hold relics of the old kingdoms. Some seekers go for power, others for redemption.",
        options: [
          {
            id: "mira_opt_5",
            label: "I might go there someday.",
            nextNodeId: null,
          },
        ],
      },
      {
        id: "mira_unlocked",
        text: "Safe travels. The Ashfields await to the east if you're brave enough.",
        options: [
          {
            id: "mira_opt_6",
            label: "Farewell.",
            nextNodeId: null,
          },
        ],
      },
    ],
  },

  fenwick_blacksmith: {
    id: "fenwick_blacksmith",
    name: "Old Fenwick",
    sprite: "🔨",
    mapId: "village",
    x: 12,
    y: 4,
    role: "merchant",
    greeting: "Need a weapon forged? I'm the best smith in the realm.",
    repeatGreeting: "Back for more steel, eh?",
    dialogueTree: [
      {
        id: "fenwick_1",
        text: "I'm Old Fenwick, blacksmith. I craft the finest weapons. But I've lost my pride and joy—a hammer passed down through my family. A goblin raider stole it from my shop!",
        options: [
          {
            id: "fenwick_opt_1",
            label: "I'll retrieve your hammer.",
            nextNodeId: "fenwick_2",
            effect: { giveQuest: "fenwick_hammer" },
          },
          {
            id: "fenwick_opt_2",
            label: "What would you pay?",
            nextNodeId: "fenwick_3",
          },
          {
            id: "fenwick_opt_3",
            label: "That's unfortunate.",
            nextNodeId: null,
          },
        ],
      },
      {
        id: "fenwick_2",
        text: "A true hero! The goblin fled to the Rotted Barrow. Find him and bring back my hammer. I'll reward you with my services—free weapon upgrades for life.",
        options: [
          {
            id: "fenwick_opt_4",
            label: "I won't let you down.",
            nextNodeId: null,
          },
        ],
      },
      {
        id: "fenwick_3",
        text: "200 gold and a masterwork weapon of your choice. It's worth it to me.",
        options: [
          {
            id: "fenwick_opt_5",
            label: "I'll get your hammer.",
            nextNodeId: "fenwick_2",
            effect: { giveQuest: "fenwick_hammer" },
          },
          {
            id: "fenwick_opt_6",
            label: "Not interested.",
            nextNodeId: null,
          },
        ],
      },
    ],
    inventory: ["iron_sword", "steel_mace", "crossbow"],
  },

  // DUNGEON NPCs
  aldric_priest: {
    id: "aldric_priest",
    name: "Brother Aldric",
    sprite: "⛪",
    mapId: "dungeon",
    x: 18,
    y: 10,
    role: "lore",
    greeting: "Thank the gods! Someone has come...",
    repeatGreeting: "You returned? I feared the worst.",
    dialogueTree: [
      {
        id: "aldric_1",
        text: "I am Brother Aldric, a priest trapped here for months. The undead hold me prisoner in this crypt. Please, help me escape!",
        options: [
          {
            id: "aldric_opt_1",
            label: "I'll free you.",
            nextNodeId: "aldric_2",
            effect: { giveItem: "blessed_amulet" },
          },
          {
            id: "aldric_opt_2",
            label: "Tell me about this place first.",
            nextNodeId: "aldric_lore_1",
          },
          {
            id: "aldric_opt_3",
            label: "I'm not a hero. Sorry.",
            nextNodeId: null,
          },
        ],
      },
      {
        id: "aldric_2",
        text: "Bless you, friend! Take this amulet—it was blessed by the temple. It will protect you from necrotic magic. Now go, flee this cursed place!",
        options: [
          {
            id: "aldric_opt_4",
            label: "I'll escape and return with help.",
            nextNodeId: null,
          },
        ],
      },
      {
        id: "aldric_lore_1",
        text: "This crypt is ancient, built over a thousand years ago. It was a temple to the Spring Spirits until the Hollow King desecrated it. Now it's a tomb of horrors.",
        options: [
          {
            id: "aldric_opt_5",
            label: "That's terrible.",
            nextNodeId: "aldric_1",
          },
        ],
      },
    ],
  },

  // TAVERN NPCs
  dunna_barkeep: {
    id: "dunna_barkeep",
    name: "Barkeep Dunna",
    sprite: "🍺",
    mapId: "tavern",
    x: 10,
    y: 8,
    role: "merchant",
    greeting: "What'll it be? A drink to calm the nerves?",
    repeatGreeting: "The usual, or something stronger?",
    dialogueTree: [
      {
        id: "dunna_1",
        text: "I'm Dunna, keeper of the Tipped Flagon. Best tavern in the realm. I've got food, drink, and gossip. What interests you?",
        options: [
          {
            id: "dunna_opt_1",
            label: "Sell me provisions.",
            nextNodeId: null,
          },
          {
            id: "dunna_opt_2",
            label: "What's the news?",
            nextNodeId: "dunna_gossip",
          },
        ],
      },
      {
        id: "dunna_gossip",
        text: "Well, there's talk of a Hollow King stirring in the northern throne. Dangerous times. Also, that Silas fellow in the corner—he buys stolen goods. Don't trust him too much.",
        options: [
          {
            id: "dunna_opt_3",
            label: "Thanks for the warning.",
            nextNodeId: null,
          },
        ],
      },
    ],
    inventory: ["hearty_stew", "healing_potion", "bread_and_cheese"],
  },

  // BOSS - will be encountered at the end
  hollow_king: {
    id: "hollow_king",
    name: "The Hollow King",
    sprite: "💀👑",
    mapId: "boss_chamber",
    x: 12,
    y: 7,
    role: "enemy_ally",
    greeting: "You dare enter my throne?",
    repeatGreeting: "Why do you return?",
    dialogueTree: [
      {
        id: "king_1",
        text: "I am the Hollow King, ruler of death itself. Mortals are insects before me. Why have you come to this chamber?",
        options: [
          {
            id: "king_opt_1",
            label: "I've come to stop you.",
            nextNodeId: "king_2",
          },
          {
            id: "king_opt_2",
            label: "I seek your power.",
            nextNodeId: "king_3",
          },
          {
            id: "king_opt_3",
            label: "I don't know why I'm here.",
            nextNodeId: "king_4",
          },
        ],
      },
      {
        id: "king_2",
        text: "FOOL! You think you can challenge me? I am eternal! Let us settle this in combat!",
        options: [
          {
            id: "king_opt_4",
            label: "So be it.",
            nextNodeId: null,
          },
        ],
      },
      {
        id: "king_3",
        text: "An interesting proposal. But you would only corrupt yourself. No. I shall consume your essence!",
        options: [
          {
            id: "king_opt_5",
            label: "You won't have it.",
            nextNodeId: null,
          },
        ],
      },
      {
        id: "king_4",
        text: "Trespasser! For that impertinence, you shall feed my hunger!",
        options: [
          {
            id: "king_opt_6",
            label: "Fight me then!",
            nextNodeId: null,
          },
        ],
      },
    ],
  },
};
