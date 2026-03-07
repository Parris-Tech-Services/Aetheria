import { storage } from "./storage";

async function seedDatabase() {
  console.log("Seeding database...");
  const existingCharacters = await storage.getCharacters();
  if (existingCharacters.length === 0) {
    await storage.createCharacter({
      name: "Tharivol",
      characterClass: "Fighter",
      level: 1,
      hp: 30,
      maxHp: 30,
      ac: 16,
      gold: 15,
      xp: 0,
      str: 16,
      dex: 14,
      con: 15,
      int: 9,
      wis: 11,
      cha: 13,
      mapId: "village",
      x: 1,
      y: 1,
      inventory: [
        { id: "sword1", name: "Longsword", type: "weapon", damage: "1d8" },
        { id: "shield1", name: "Wooden Shield", type: "armor", acBonus: 2 }
      ],
      quests: [
        { id: "q1", name: "Rat Problem", status: "active", description: "Clear out the rats in the cellar." }
      ]
    });
    
    await storage.createCharacter({
      name: "Elowen",
      characterClass: "Wizard",
      level: 1,
      hp: 18,
      maxHp: 18,
      ac: 11,
      gold: 25,
      xp: 50,
      str: 8,
      dex: 13,
      con: 12,
      int: 17,
      wis: 14,
      cha: 10,
      mapId: "village",
      x: 2,
      y: 2,
      inventory: [
        { id: "staff1", name: "Quarterstaff", type: "weapon", damage: "1d6" },
        { id: "book1", name: "Spellbook", type: "misc" }
      ],
      quests: []
    });

    console.log("Database seeded successfully with test characters.");
  } else {
    console.log("Database already has characters, skipping seed.");
  }
}

seedDatabase().catch(console.error);
