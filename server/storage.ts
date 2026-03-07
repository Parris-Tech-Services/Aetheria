import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  characters,
  type Character,
  type InsertCharacter,
  type CharacterUpdate
} from "@shared/schema";

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

export const storage = new DatabaseStorage();
