import { pgTable, serial, text, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  characterClass: text("class").notNull(), // Fighter, Wizard, Rogue
  level: integer("level").default(1).notNull(),
  hp: integer("hp").default(30).notNull(),
  maxHp: integer("max_hp").default(30).notNull(),
  ac: integer("ac").default(10).notNull(),
  gold: integer("gold").default(0).notNull(),
  xp: integer("xp").default(0).notNull(),
  xpToNextLevel: integer("xp_to_next_level").default(100).notNull(),
  
  // Stats
  str: integer("str").default(10).notNull(),
  dex: integer("dex").default(10).notNull(),
  con: integer("con").default(10).notNull(),
  int: integer("int").default(10).notNull(),
  wis: integer("wis").default(10).notNull(),
  cha: integer("cha").default(10).notNull(),
  
  // State
  mapId: text("map_id").default("village").notNull(),
  x: integer("x").default(1).notNull(),
  y: integer("y").default(1).notNull(),
  
  inventory: json("inventory").default([]).notNull(), // Array of items
  quests: json("quests").default([]).notNull(), // Array of active/completed quests
  
  lastSaved: timestamp("last_saved").defaultNow().notNull(),
});

export const insertCharacterSchema = createInsertSchema(characters).omit({ id: true, lastSaved: true });

export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type CharacterUpdate = Partial<InsertCharacter>;
