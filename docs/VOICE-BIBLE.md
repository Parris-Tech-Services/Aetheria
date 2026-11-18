# Aetheria Voice Bible (draft for Josh to approve)

Derived from existing canon. Machine-readable twin: `docs/voice.json` (naming grammar, reserved canon, avoid list).

**World:** a woodland-edge village beside the Rotted Barrow, in the shadow of the Hollow King. The land is "sour", not "cursed": wells taste of copper, bread will not rise, the dead will not stay down.

**Tone:** weathered, practical, quietly eerie. People talk about work, weather, debt and children, never destiny. Nobody says "chosen one".

**Sentences:** short. Concrete nouns (thistle, bottle, haft, lane). Each person has one verbal habit: Jila measures things; Haddow gives orders; Katon answers with directions and counts steps; Fenwick says "Heft it"; Dunna talks money; Resad names the dead.

**Every NPC has** (enforced by `tests/content.test.ts`): a want that is not "save the world", a limit, one thing they will not discuss (taboo), what they know publicly, privately and not at all, what they notice first, a reason their tone changes, and three or more conversation states (first, return, after the player acts).

**Names:** short Old-English-flavoured given names; surnames are plant, craft or landscape words (*Mossbind*, *Fenwick*, *Haddow*); places are compounds (*Tipped Flagon*, *Rotted Barrow*). New names come from `namegen.py --voice docs/voice.json`, picked by the showrunner (Josh). Retired defaults are in `voice.json` under `avoid`.

**Prose rules (positive):** say what the person does and wants; one specific detail per line; let an NPC refuse; end on the line, not on a moral. Checked by `slop_lint --code-strings` (target: no file above 15, aim for 5).
