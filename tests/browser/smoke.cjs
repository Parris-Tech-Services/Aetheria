// Real-browser first-playthrough: walk, talk, quest, exits, XP. Run: BASE=http://127.0.0.1:5173 node tests/browser/smoke.cjs
// Needs the dev server (npm run dev) and Playwright's chromium. Exits non-zero on any failed step.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const maps = JSON.parse(execFileSync('npx', ['tsx', '-e', 'import {GameData} from "./client/src/game/data"; console.log(JSON.stringify(Object.fromEntries(Object.entries(GameData.maps).map(([k,v])=>[k,{l:v.layout,e:v.exits}]))))'], { encoding: 'utf8' }).trim().split('\n').pop());
const base = process.env.BASE || 'http://127.0.0.1:5173';
const fails = []; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails.push(m); };
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = []; page.on('pageerror', e => errors.push(String(e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  const res = await page.request.post(base + '/api/characters', { data: { name: 'Tester', characterClass: 'Fighter', level: 1, hp: 30, maxHp: 30, ac: 14, gold: 0, xp: 0, xpToNextLevel: 100, str: 16, dex: 12, con: 14, int: 10, wis: 10, cha: 10, mapId: 'village', x: 1, y: 1, inventory: [], quests: [] } });
  const id = (await res.json()).id;
  await page.goto(base + '/play/' + id); await page.waitForSelector('[data-testid=xp-gold]');
  const body = async () => (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  const key = { '0,-1': 'ArrowUp', '0,1': 'ArrowDown', '-1,0': 'ArrowLeft', '1,0': 'ArrowRight' };
  let map = 'village', pos = [1, 1];
  const grid = () => maps[map].l;
  // BFS to a tile adjacent to (tx,ty); hostile letters and walls block, so we never fight by accident.
  const walkNextTo = async (tx, ty) => {
    const L = grid(), H = L.length, W = L[0].length; const block = c => '#SWZKGHCMFBAT'.includes(c);
    const goal = (x, y) => Math.abs(x - tx) + Math.abs(y - ty) === 1;
    const q = [[pos[0], pos[1]]], prev = { [pos]: null };
    while (q.length) { const [x, y] = q.shift(); if (goal(x, y)) { const path = []; let k = `${x},${y}`; while (prev[k]) { path.unshift(k); k = prev[k]; } for (const s of path) { const [sx, sy] = s.split(',').map(Number); await page.keyboard.press(key[`${sx - pos[0]},${sy - pos[1]}`]); pos = [sx, sy]; await page.waitForTimeout(40); } return true; }
      for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H || block(L[ny][nx]) || L[ny][nx] === '>' || prev[`${nx},${ny}`] !== undefined) continue; prev[`${nx},${ny}`] = `${x},${y}`; q.push([nx, ny]); } }
    return false;
  };
  const step = async (dx, dy) => { await page.keyboard.press(key[`${dx},${dy}`]); await page.waitForTimeout(80); };
  const pick = async (label) => { await page.locator('div.fixed button', { hasText: label }).first().click(); await page.waitForTimeout(120); };
  const dlg = () => page.locator('[data-testid=dialogue-text]').innerText();
  const talkTo = async (x, y) => { await walkNextTo(x, y); const dx = Math.sign(x - pos[0]) || 0, dy = Math.sign(y - pos[1]) || 0; await step(dx, dy); };
  const useExit = async (x, y, nm, np) => { await walkNextTo(x, y); await step(Math.sign(x - pos[0]), Math.sign(y - pos[1])); map = nm; pos = np; };

  // 1. Jila: first meeting, answers are visible, quest accepted
  await talkTo(3, 2);
  ok(/Mind the thistle/.test(await dlg()), 'Jila greets with her first-meeting line');
  await pick('Where do they grow'); ok(/Ashfields/.test(await dlg()), 'choosing an option shows the response (was silent before)');
  await pick("I'll do it"); await pick('Understood');
  ok(/Quest started: Moonbloom for Jila/.test(await body()), 'quest start is announced in the chronicle');
  ok((await page.locator('[data-testid=journal]').innerText()).includes('Moonbloom for Jila'), 'journal lists the quest');
  // 2. Collect three moonbloom: one here, two in the Ashfields (leave via the west exit and return)
  await walkNextTo(17, 1); await step(1, 0).catch(() => {}); pos = [17, 1];
  await walkNextTo(0, 5); await step(-1, 0); map = 'overworld'; pos = [17, 5];
  ok((await body()).includes('The Ashfields'), 'the village west exit leads to the Ashfields (was unreachable before)');
  await walkNextTo(3, 1); await step(...[Math.sign(3 - pos[0]), Math.sign(1 - pos[1])]); pos = [3, 1];
  await walkNextTo(15, 4); await step(Math.sign(15 - pos[0]), Math.sign(4 - pos[1])); pos = [15, 4];
  ok(/3\/3/.test(await page.locator('[data-testid=journal]').innerText()), 'journal counts 3/3 moonbloom');
  await useExit(18, 5, 'village', [1, 5]);
  // 3. Hand in
  await talkTo(3, 2);
  ok(/Those are real/.test(await dlg()), 'Jila switches to her ready-to-hand-in state');
  await pick("They're yours"); ok(/50 coins/.test(await dlg()), 'her line quotes the true reward (50 coins, from quest data)');
  const x = await page.locator('[data-testid=xp-gold]').innerText();
  ok(/XP 100/.test(x) || /level/i.test(await body()), 'XP applied after the quest');
  ok(/50 gold/.test(x), 'gold applied after the quest');
  await pick('Goodbye');
  await talkTo(3, 2); ok(/captain's girl slept/.test(await dlg()), 'Jila remembers what the player did');
  await pick('Goodbye');
  // 4. Haddow sees the consequence
  await talkTo(7, 2); ok(/Jila told me about the syrup/.test(await dlg()), 'Captain Haddow reacts to the syrup');
  await pick('Nothing');
  // 5. Tavern door, then Dunna's gossip reflects the world
  await useExit(9, 9, 'tavern', [9, 1]);
  ok((await body()).includes('Tipped Flagon'), 'the tavern door works');
  await talkTo(10, 3); await pick("What's the talk"); await pick('About the herbalist');
  ok(/children have noticed/.test(await dlg()), 'Dunna gossips about the player\'s deed');
  await page.screenshot({ path: process.env.SHOT || '/tmp/aeth/after.png' });
  // 6. Persistence: reload keeps the world
  await page.reload(); await page.waitForSelector('[data-testid=xp-gold]');
  ok((await page.locator('[data-testid=journal]').innerText()).includes('Moonbloom for Jila'), 'journal survives a reload');
  ok(errors.length === 0, 'no page or console errors' + (errors.length ? ': ' + errors[0] : ''));
  await browser.close();
  console.log(fails.length ? `\n${fails.length} FAILED` : '\nALL PASSED'); process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
