# Genre registry and roadmap

## What the numbers mean

`src/genres.js` is the executable design registry; `docs/genre-registry.json` is its exported data. It contains **106 entries**, with stable IDs, families, required capabilities, clock families, status, and current mode references. The field guide can display this atlas.

- **8 implemented mechanic subsets:** action, survival, building, tower defense, tactical combat, turn-based strategy, puzzle, logic.
- **2 partial:** roguelite, procedural challenge. Rift has seeded runs and reset/retry, but not a full roguelite loot/ability/meta-upgrade system. Signal has seeded generated challenges.
- **96 planned:** registry entries, not shipped gameplay. Broad support requires implementing the actual domain systems—not just adding a tag.
- **4 playable mode plugins**, built on **3 distinct simulation architectures**.

## Family coverage

| Family | Registered genres (all included; most planned) |
|---|---|
| Action | Action, adventure, platformer, metroidvania, FPS, TPS, fighting, beat-'em-up, hack-and-slash, character action, stealth, survival, horror, psychological horror, immersive sim, extraction shooter |
| Role playing | RPG, MMORPG, action RPG, tactical RPG, JRPG, creature collector |
| Strategy | Strategy, RTS, turn-based strategy, grand strategy, 4X, tactical combat, auto-battler, tower defense, tower offense |
| Simulation | Simulation, life sim, farming, colony management, city building, god game, automation, transport tycoon |
| Sandbox | Sandbox, open world, crafting, building, voxel, physics sandbox |
| Vehicles | Racing, driving, flight, space simulation, vehicle combat, space trading |
| Sports | Sports, wrestling, martial arts, competitive |
| Music | Rhythm, music, dance, musical performance |
| Puzzles/tabletop | Puzzle, logic, word, trivia, board, card, tabletop, deckbuilder, nonogram, programming puzzle, escape room |
| Procedural challenges | Roguelike, roguelite, dungeon crawler, procedural challenge |
| Narrative | Visual novel, interactive fiction, branching narrative, detective, walking simulator |
| Learning | Educational, serious, historical, scientific, training simulation |
| Social | Party, social deduction, cooperative, competitive multiplayer, massively multiplayer |
| Economy | Idle, incremental, clicker, management, tycoon, economic |
| Arcade | Arcade, retro, bullet hell, shoot-'em-up, score attack |
| Experimental | Experimental, abstract, artistic, generative, unconventional, asymmetric multiplayer |

The user's genre requirements seed this taxonomy. Additional source-backed hybrid/niche examples come from [Mindustry](https://github.com/Anuken/Mindustry) (automation/tower defense/RTS), [OpenTTD](https://github.com/OpenTTD/OpenTTD) (transport simulation/tycoon), [Endless Sky](https://github.com/endless-sky/endless-sky) (space trading/exploration), and [Cataclysm: DDA](https://github.com/CleverRaven/Cataclysm-DDA) (turn-based procedural survival). Other niche labels are design additions, not separately verified research findings.

## Current compatibility rules

| Combination | Status | Meaningful choice / constraint |
|---|---|---|
| Action + survival + construction + tower defense | **Playable: Frontier Zero** | Seed, 2–5 waves, difficulty; disable construction to get action survival without claiming tower defense |
| Tactical combat + turn-based strategy | **Playable: Bastion** | One AP/turn authority; path range and cover are shared |
| Puzzle + logic | **Playable: Signal** | Graph/rotation rules; reversible actions and bounded budget |
| Action + roguelite | **Partial: Rift** | Run lifecycle and seeded environment only; deeper progression remains planned |
| Action + turn-based strategy in one simulation | **Rejected in lab** | Select real-time or turn-based authority, or isolate activities behind a transition. The validator can describe an explicit clock choice, but the slice does not implement that arbitration. |
| Tower defense with no construction | **Rejected** when both genres are requested | Enable turrets or remove tower defense; the lab removes that genre when construction is disabled |
| Unknown genre ID | **Rejected** | Register a stable definition and capabilities first |
| Unimplemented genre requirements | **Not launchable as a module** | Capability-gap checks expose missing systems; adding a label never supplies them |

## Architectural conflicts beyond the current lab

These are policies for future integrations, not completed runtime adapters:

- **Camera ownership:** a third-person action controller cannot coexist with an independent RTS camera on the same viewport without an explicit mode transition or split view.
- **Physics ownership:** grid positions and continuous rigid-body transforms need a single authority or a carefully specified conversion boundary.
- **Time:** rhythm uses audio-time scheduling, idle games use persistent elapsed time, tactics use turns; tying every genre to the same wall clock is wrong.
- **Authority:** a cosmetic local save cannot become an MMO's economic source of truth. Multiplayer demands authoritative validation, reconnection and replay protection.
- **Scale:** “open world” is not a synonym for the current 1800×1200 arena. Streaming, navigation, memory budgets and persistence require additional systems.
- **Domain knowledge:** scientific/educational simulations need validated subject models and assessment, not only an alternate coat of paint.

## Hybrid roadmap

| Target hybrid | Reuse | New modules / acceptance criteria |
|---|---|---|
| Tactical strategy + colony simulation | Bastion grid/turns | Resource production, jobs, schedules, persistence; deterministic multi-day scenario |
| Horror roguelike + procedural investigation | Seeded runs, future Ink/Yarn adapter | Evidence graph with solvable clues, stealth/senses, narrative QA and accessibility review |
| Racing + RPG + economy | Shared profile/rules | Vehicle model, tracks, lap validation, upgrade balance, transactions; no reuse of action movement as pretend driving |
| Rhythm action platformer | Input/settings shell | Platform collision, coyote/jump mechanics, audio-clock scheduling and measured latency |
| Multiplayer life/business simulation | Candidate Colyseus/Nakama boundary | Server-owned economy, accounts, concurrency, abuse/security and moderation policies |
| Physics construction challenges | Ruleset pipeline | One rigid-body adapter, joint constraints, stable replay/serialization, bounded constructions |
| Space exploration + trading + strategy + survival | Profile and future scene adapter | Ship flight, navigation map, trading simulation and world persistence |
| Survival RPG + vehicle combat | Frontier resource/combat interfaces | Inventory/crafting, quests, vehicles, larger content/world streaming |

## Extension order

Prioritize content depth and accessibility in the current modes before adding many superficially distinct mode names. See [ranked next steps](NEXT_STEPS.md) for concrete gates.
