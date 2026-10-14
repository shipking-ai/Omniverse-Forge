# Ranked extension plan

These are future work, not implemented features. Favor a deeper, verified platform over a larger repository count.

## 1. Accessibility and cross-browser verification

**Highest priority.** Test real touch devices, Firefox, Safari/WebKit, screen-reader navigation and audio output with human players. Increase critical text/touch targets where needed; add alternative nonvisual or turn-paced action interaction rather than claiming Canvas becomes accessible through an aria-label. Add full remapping for tactical/puzzle commands and gamepad support. Honor OS reduced-motion defaults automatically. Gate: no keyboard traps, documented contrast, playable 200% zoom, device input tests, human audio assessment.

## 2. Improve the four existing games

Add enemy telegraphs, stronger hit/mining feedback, mission variation, contextual proximity prompts, replayable tactical maps and difficulty telemetry without personal data. Frontier needs a deeper build/repair/resource economy; Rift needs meaningful abilities/loot before claiming complete roguelite progression. Balance custom 2–5 wave/veteran variants, not just standard/default runs. Gate: successful and failed playtests across seeds and difficulties, no stranded agents, no mandatory grind or unbounded entities.

## 3. Harden content and save boundaries

Formalize JSON Schema, migrations, deterministic snapshot hashes and transactional profile writes. Split shell views/input/lifecycle modules as features grow. Add safe save export/import with explicit warnings, plus load-time canonicalization of derived puzzle/path fields. Keep the current four-ID whitelist until plugin manifests have reviewed schemas. Gate: fuzz tests, migration fixtures, recovery tests and quota behavior.

## 4. Add one external content adapter

Start with **Tiled or LDtk, not both**. Map validated export data into the existing grid/wall format; use original or verified licensed assets. Add an asset manifest with content hashes, attribution and dimensions. Gate: malicious/path-traversal/oversized maps rejected; one genuinely playable authored level; no editor code shipped as game runtime.

## 5. Prove a 3D renderer boundary with one mode

Prototype Three.js or Babylon.js based on a concrete exploration/vehicle requirement. Keep glTF assets and gameplay state distinct; add context-loss, resource-disposal and GPU profiling tests. Do not embed Godot/Bevy/O3DE in the browser app. Gate: three-platform input/render checks, documented download/VRAM/CPU budget and stable save behavior.

## 6. Add narrative or colony simulation depth

Choose one: Ink/Yarn dialogue with validated quests, or a colony job/resource system built on the tactical grid. Verify the precise runtime/compiler licenses, not only the umbrella repository. Gate: branching narrative/production states cannot soft-lock objectives; reproducible long-running simulation and useful content-authoring documentation.

## 7. Multiplayer only after an authoritative contract

Pilot **Colyseus** for one cooperative mode; compare Nakama if profiles/matchmaking are actually needed. Build a real server with validated input, tick ownership, snapshots, reconnect, authentication, rate limiting and trust boundaries. Local XP must never be accepted as authoritative. Gate: two-browser automated test, latency/loss simulation, adversarial commands, restart/persistence and cost/operations plan. Do not add empty lobby buttons first.

## 8. Expand physics and sandboxing only when justified

Choose one physics backend (Rapier/Matter for appropriate dimensions; native Jolt/PhysX only with a separate target). Prototype joints/vehicles and stable serialization before claiming a physics sandbox. For executable community mods, design a Worker/WASM authority boundary, quotas, timeouts, import allowlists and revocation; do not expose arbitrary JS evaluation. Gate: resource-exhaustion and escape testing plus independent security review.

## 9. Close the research and legal gaps

Review GitLab/Codeberg/official and academic sources from an unrestricted environment. Audit transitive dependencies and issue histories of shortlisted actual integrations. Investigate GPU/rendering, fluids, skeletal/mocap, robotics, nonvisual input and model-weight terms. Verify exact supported hardware and OS versions through builds. Complete project-name/trademark clearance and browser-appliance licensing before commercial distribution.

## 10. Community and release engineering

Add contributor guidelines, semantic release/version policy, signed artifact checksums, dependency-update automation and bug templates with seeds/version. The included CI workflow is authored but has not been executed by GitHub in this session; validate it on a PR before treating it as a release gate. Publish the static game artifact separately from toolchains/research snapshots.
