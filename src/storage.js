import { modeById } from "./registry.js";
import { normalizeRules, clamp } from "./core.js";
export const SAVE_KEY = "omniverse-forge:v1";
export const DEFAULT_SETTINGS = {
  volume: 0.35,
  sound: true,
  reducedMotion: false,
  contrast: false,
  textScale: 1,
  difficulty: "standard",
  keys: {
    up: "KeyW",
    left: "KeyA",
    down: "KeyS",
    right: "KeyD",
    fire: "Space",
    dash: "ShiftLeft",
    interact: "KeyE",
    build: "KeyB",
  },
};
export const defaultSave = () => ({
  version: 1,
  xp: 0,
  completed: {},
  best: {},
  settings: structuredClone(DEFAULT_SETTINGS),
  session: null,
});
export function sanitizeSettings(value) {
  const s = value && typeof value === "object" ? value : {};
  const keys = { ...DEFAULT_SETTINGS.keys };
  const proposed = s.keys || {};
  for (const k of Object.keys(keys))
    if (
      typeof proposed[k] === "string" &&
      /^(Key[A-Z]|Digit[0-9]|Space|ShiftLeft|ShiftRight)$/.test(proposed[k])
    )
      keys[k] = proposed[k];
  if (new Set(Object.values(keys)).size !== Object.keys(keys).length)
    Object.assign(keys, DEFAULT_SETTINGS.keys);
  return {
    volume: Number.isFinite(s.volume) ? clamp(s.volume, 0, 1) : 0.35,
    sound: s.sound !== false,
    reducedMotion: s.reducedMotion === true,
    contrast: s.contrast === true,
    textScale: s.textScale === 1.15 ? 1.15 : 1,
    difficulty: normalizeRules(s).difficulty,
    keys,
  };
}
export function validateSession(session) {
  if (!session || !modeById(session.mode)) return null;
  const mode = modeById(session.mode),
    state = session.state;
  try {
    if (!mode.validate(state) || state.status !== "playing") return null;
    if (state.type === "action" && state.hybrid !== (mode.id === "frontier"))
      return null;
    state.rules = normalizeRules(state.rules);
    return { mode: mode.id, state };
  } catch {
    return null;
  }
}
export function loadSave(storage) {
  const fresh = defaultSave();
  try {
    storage ??= globalThis.localStorage;
    const raw = storage.getItem(SAVE_KEY);
    if (!raw) return { data: fresh, error: null };
    if (raw.length > 500000) throw Error("Save exceeds the safe size limit.");
    const s = JSON.parse(raw);
    if (s?.version !== 1) throw Error("Save version is not supported.");
    fresh.xp = Number.isFinite(s.xp) ? clamp(Math.floor(s.xp), 0, 10000000) : 0;
    fresh.settings = sanitizeSettings(s.settings);
    for (const id of ["rift", "bastion", "signal", "frontier"]) {
      if (Number.isInteger(s.completed?.[id]))
        fresh.completed[id] = clamp(s.completed[id], 0, 100000);
      if (Number.isFinite(s.best?.[id]))
        fresh.best[id] = clamp(s.best[id], 0, 100000);
    }
    fresh.session = validateSession(s.session);
    return {
      data: fresh,
      error:
        s.session && !fresh.session
          ? "The suspended expedition was invalid. Your profile and settings were recovered."
          : null,
    };
  } catch {
    return {
      data: fresh,
      error:
        "Your local save could not be read. A fresh profile is ready; saving will replace the invalid data.",
    };
  }
}
export function writeSave(data, storage) {
  try {
    storage ??= globalThis.localStorage;
    storage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
export function award(save, id, state) {
  if (state.status !== "won") return 0;
  const xp = id === "frontier" ? 180 : 120;
  save.xp += xp;
  save.completed[id] = (save.completed[id] || 0) + 1;
  const score =
    state.type === "puzzle"
      ? state.moves
      : state.type === "tactics"
        ? state.turn
        : Math.round(state.time);
  save.best[id] = Math.min(save.best[id] ?? Infinity, score);
  save.session = null;
  return xp;
}
