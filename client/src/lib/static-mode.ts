// Static hosting support. When Aetheria is served as plain files (from file://, a
// folder such as Repository Town's arcade, or any host without the Express API),
// routes use the URL hash and characters are kept in localStorage instead of Postgres.

const KEY = "aetheria.characters.v1";

export const isStaticHost =
  typeof window !== "undefined" &&
  (window.location.protocol === "file:" || /\.html?$/i.test(window.location.pathname));

const DEFAULTS = {
  level: 1, hp: 30, maxHp: 30, ac: 10, gold: 0, xp: 0, xpToNextLevel: 100,
  str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
  mapId: "village", x: 1, y: 1, inventory: [], quests: [],
};

type Stored = Record<string, unknown> & { id: number };

function load(): Stored[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function store(list: Stored[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage unavailable */ }
}

const json = (body: unknown, status = 200) =>
  new Response(status === 204 ? null : JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

async function handle(path: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method || "GET").toUpperCase();
  const list = load();
  const match = path.match(/^\/api\/characters(?:\/(\d+))?$/);
  if (!match) return json({ message: "Not available offline" }, 404);
  const id = match[1] ? Number(match[1]) : null;
  const body = init.body ? JSON.parse(String(init.body)) : {};
  const now = new Date().toISOString();
  if (id === null && method === "GET") return json(list);
  if (id === null && method === "POST") {
    const created = { ...DEFAULTS, ...body, id: list.reduce((m, c) => Math.max(m, c.id), 0) + 1, lastSaved: now };
    store([...list, created]);
    return json(created, 201);
  }
  const index = list.findIndex((c) => c.id === id);
  if (index < 0) return json({ message: "Character not found" }, 404);
  if (method === "GET") return json(list[index]);
  if (method === "PUT" || method === "PATCH") {
    list[index] = { ...list[index], ...body, id: id!, lastSaved: now };
    store(list);
    return json(list[index]);
  }
  if (method === "DELETE") {
    store(list.filter((c) => c.id !== id));
    return json(null, 204);
  }
  return json({ message: "Method not allowed" }, 405);
}

// Routes /api/characters requests to localStorage on static hosts; everything else
// still goes to the network.
export function installStaticApi() {
  if (!isStaticHost) return;
  const network = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const path = url.startsWith("/api/") ? url : null;
    return path ? handle(path, init) : network(input, init);
  };
}
