import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CharacterInput, type CharacterUpdateInput } from "@shared/routes";

// Log zod errors for debugging
function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useCharacters() {
  return useQuery({
    queryKey: [api.characters.list.path],
    queryFn: async () => {
      const res = await fetch(api.characters.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch characters");
      const data = await res.json();
      return parseWithLogging(api.characters.list.responses[200], data, "characters.list");
    },
  });
}

export function useCharacter(id: number | null) {
  return useQuery({
    queryKey: [api.characters.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.characters.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch character");
      const data = await res.json();
      return parseWithLogging(api.characters.get.responses[200], data, "characters.get");
    },
    enabled: id !== null,
  });
}

export function useCreateCharacter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CharacterInput) => {
      const validated = api.characters.create.input.parse(data);
      const res = await fetch(api.characters.create.path, {
        method: api.characters.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create character");
      }
      
      const responseData = await res.json();
      return parseWithLogging(api.characters.create.responses[201], responseData, "characters.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.characters.list.path] });
    },
  });
}

export function useUpdateCharacter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & CharacterUpdateInput) => {
      const validated = api.characters.update.input.parse(updates);
      const url = buildUrl(api.characters.update.path, { id });
      const res = await fetch(url, {
        method: api.characters.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update character");
      const responseData = await res.json();
      return parseWithLogging(api.characters.update.responses[200], responseData, "characters.update");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.characters.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.characters.get.path, data.id] });
    },
  });
}

export function useDeleteCharacter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.characters.delete.path, { id });
      const res = await fetch(url, {
        method: api.characters.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete character");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.characters.list.path] });
    },
  });
}
