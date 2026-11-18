# Originality and depth program: log

Branch work, not merged. Method: https://github.com/joshualparris/open-world-rpg-research (WRITERS-ROOM.md, ANTISLOP.md).

## Before (verified by reading code + a real-browser run)
- Only 3 NPCs with 2 options each were live; 7 NPC trees, the quests and the lore were imported by nothing.
- Choosing a dialogue option closed the window and showed nothing.
- The first map had no usable exit; tavern, barrow, Ashfields and boss room were unreachable.
- Chest did nothing; combat said "Gained 50 XP" but never applied it.
- LLM-default names: Elara, Theron, Mira, Aldric.
- No tests, no CI.

## After
- 5 maps connected by working exits (the boss door needs the altar touched).
- 6 NPCs, each with a profile and 3 to 6 conversation states; dialogue options appear only when earned (flags, quest state, items).
- 4 quests wired end to end (collect, kill by tag, reach, auto-complete); XP, gold, level-up, reward items; journal panel; save and restore of world state, map and position (localStorage).
- 6 lore entries discoverable in play.
- Names: 4 display names replaced; `name_audit --max 0` reports 0 hits.
- `npm test` (12 content-integrity and quest-flow tests, no new dependencies); `npm run test:browser` (real-browser walk of first quest).

## Measured
- `slop_lint --code-strings` on the content files: npc-data 4.3, lore-data 9.4, none above 15 after one findings-fed edit.
- `tsc` errors in client code after the work: 4, none in files I added; all four are in code this program did not author (enemy-data duplicate export, two `unknown` casts). I fixed the character-type errors in `use-characters.ts` along the way. Server errors in `server/storage.ts` untouched.

## Parked on purpose (not half-wired)
Riven, the oracle, goblin raider, factions, shop mechanics, the unused `enemy-data.ts`. They need NPCs or enemies the world does not contain. Decision for Josh: delete, or write them in.

## Not verified
Fun. Whether the writing sounds right to Josh. Mobile layout. Combat balance. A fight-the-king playthrough in a browser (logic tested, not played).
