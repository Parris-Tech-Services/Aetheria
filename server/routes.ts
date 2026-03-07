import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // GET all characters
  app.get(api.characters.list.path, async (req, res) => {
    try {
      const allCharacters = await storage.getCharacters();
      res.json(allCharacters);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  // POST create new character
  app.post(api.characters.create.path, async (req, res) => {
    try {
      const characterData = api.characters.create.input.parse(req.body);
      const newCharacter = await storage.createCharacter(characterData);
      res.status(201).json(newCharacter);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to create character" });
    }
  });

  // GET character by id
  app.get(api.characters.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid character ID" });
      }
      const character = await storage.getCharacter(id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch character" });
    }
  });

  // PUT update character
  app.put(api.characters.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid character ID" });
      }
      const characterUpdate = api.characters.update.input.parse(req.body);
      const updatedCharacter = await storage.updateCharacter(id, characterUpdate);
      res.json(updatedCharacter);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      if (err instanceof Error && err.message === "Character not found") {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ message: "Failed to update character" });
    }
  });

  // DELETE character
  app.delete(api.characters.delete.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid character ID" });
      }
      await storage.deleteCharacter(id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete character" });
    }
  });

  return httpServer;
}
