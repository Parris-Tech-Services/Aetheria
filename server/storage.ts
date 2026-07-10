import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  characters,
  type Character,
  type InsertCharacter,
  type CharacterUpdate
} from "@shared/schema";
import fs from "fs";
import path from "path";

export interface IStorage {
  getCharacters(): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, characterUpdate: CharacterUpdate): Promise<Character>;
  deleteCharacter(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCharacters(): Promise<Character[]> {
    return await db.select().from(characters);
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    const [character] = await db.select().from(characters).where(eq(characters.id, id));
    return character;
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    const [newCharacter] = await db.insert(characters).values(character).returning();
    return newCharacter;
  }

  async updateCharacter(id: number, characterUpdate: CharacterUpdate): Promise<Character> {
    const [updatedCharacter] = await db
      .update(characters)
      .set(characterUpdate)
      .where(eq(characters.id, id))
      .returning();
    
    if (!updatedCharacter) {
      throw new Error("Character not found");
    }
    return updatedCharacter;
  }

  async deleteCharacter(id: number): Promise<void> {
    await db.delete(characters).where(eq(characters.id, id));
  }
}

export class MemoryStorage implements IStorage {
  private characters: Character[] = [];
  private nextId = 1;

  private applyDefaults(character: Partial<Character>): Character {
    return {
      id: character.id || 0,
      name: character.name || "Unknown",
      characterClass: character.characterClass || "Fighter",
      level: character.level ?? 1,
      hp: character.hp ?? 30,
      maxHp: character.maxHp ?? 30,
      ac: character.ac ?? 10,
      gold: character.gold ?? 0,
      xp: character.xp ?? 0,
      xpToNextLevel: character.xpToNextLevel ?? 100,
      str: character.str ?? 10,
      dex: character.dex ?? 10,
      con: character.con ?? 10,
      int: character.int ?? 10,
      wis: character.wis ?? 10,
      cha: character.cha ?? 10,
      mapId: character.mapId || "village",
      x: character.x ?? 1,
      y: character.y ?? 1,
      inventory: character.inventory || [],
      quests: character.quests || [],
      createdAt: character.createdAt || new Date(),
      updatedAt: character.updatedAt || new Date(),
    };
  }

  async getCharacters(): Promise<Character[]> {
    return [...this.characters];
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.find(c => c.id === id);
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    const newCharacter = this.applyDefaults({
      ...character,
      id: this.nextId++,
    }) as Character;
    this.characters.push(newCharacter);
    return newCharacter;
  }

  async updateCharacter(id: number, characterUpdate: CharacterUpdate): Promise<Character> {
    const index = this.characters.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error("Character not found");
    }
    this.characters[index] = {
      ...this.characters[index],
      ...characterUpdate,
      updatedAt: new Date(),
    };
    return this.characters[index];
  }

  async deleteCharacter(id: number): Promise<void> {
    const index = this.characters.findIndex(c => c.id === id);
    if (index !== -1) {
      this.characters.splice(index, 1);
    }
  }
}

export class LocalJsonStorage implements IStorage {
  private filePath = path.join(process.cwd(), ".local", "data", "characters.json");

  private ensureDirectoryExists() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private applyDefaults(character: Partial<Character>): Character {
    return {
      id: character.id || 0,
      name: character.name || "Unknown",
      characterClass: character.characterClass || "Fighter",
      level: character.level ?? 1,
      hp: character.hp ?? 30,
      maxHp: character.maxHp ?? 30,
      ac: character.ac ?? 10,
      gold: character.gold ?? 0,
      xp: character.xp ?? 0,
      xpToNextLevel: character.xpToNextLevel ?? 100,
      str: character.str ?? 10,
      dex: character.dex ?? 10,
      con: character.con ?? 10,
      int: character.int ?? 10,
      wis: character.wis ?? 10,
      cha: character.cha ?? 10,
      mapId: character.mapId || "village",
      x: character.x ?? 1,
      y: character.y ?? 1,
      inventory: character.inventory || [],
      quests: character.quests || [],
      createdAt: character.createdAt || new Date(),
      updatedAt: character.updatedAt || new Date(),
    };
  }

  private readData(): Character[] {
    try {
      if (!fs.existsSync(this.filePath)) {
        return [];
      }
      const data = fs.readFileSync(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading characters data:", error);
      return [];
    }
  }

  private writeData(data: Character[]) {
    try {
      this.ensureDirectoryExists();
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error writing characters data:", error);
    }
  }

  async getCharacters(): Promise<Character[]> {
    return this.readData();
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    const characters = this.readData();
    return characters.find(c => c.id === id);
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    const characters = this.readData();
    const newId = characters.length > 0 ? Math.max(...characters.map(c => c.id)) + 1 : 1;
    const newCharacter = this.applyDefaults({
      ...character,
      id: newId,
    }) as Character;
    characters.push(newCharacter);
    this.writeData(characters);
    return newCharacter;
  }

  async updateCharacter(id: number, characterUpdate: CharacterUpdate): Promise<Character> {
    const characters = this.readData();
    const index = characters.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error("Character not found");
    }
    characters[index] = {
      ...characters[index],
      ...characterUpdate,
      updatedAt: new Date(),
    };
    this.writeData(characters);
    return characters[index];
  }

  async deleteCharacter(id: number): Promise<void> {
    const characters = this.readData();
    const filtered = characters.filter(c => c.id !== id);
    this.writeData(filtered);
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new LocalJsonStorage();
