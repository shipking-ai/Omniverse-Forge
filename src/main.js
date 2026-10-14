import { genres } from "./genres.js";
import "./style.css";
import { modes, modeById, validateCombination } from "./registry.js";
import { normalizeRules, clamp } from "./core.js";
import { W, H, actionCamera, tacticalLayout, puzzleLayout } from "./render.js";
import {
  loadSave,
  writeSave,
  award,
  DEFAULT_SETTINGS,
  sanitizeSettings,
} from "./storage.js";
import { AudioEngine } from "./audio.js";
const icons = {
  universe:
    '<circle cx="12" cy="12" r="7"/><ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(-35 12 12)"/>',
  play: '<path d="m9 5 10 7-10 7z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  forge: '<path d="m12 3 9 5v9l-9 5-9-5V8zM3 8l9 5 9-5M12 13v9M7.5 5.5l9 5"/>',
  book: '<path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1zm0 0v15"/>',
  settings:
    '<path d="m10 3-1 3-3 1-3 3v4l3 3 3 1 1 3h4l1-3 3-1 3-3v-4l-3-3-3-1-1-3z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  spark:
    '<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  sound:
    '<path d="m11 4-5 5H2v6h4l5 5zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  reset: '<path d="M4 10a8 8 0 1 1 1 8M4 3v7h7"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
};
const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.spark}</svg>`;
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const loaded = loadSave();
let save = loaded.data,
  active = null,
  paused = false,
  route = "home",
  filter = "all",
  search = "",
  pendingBind = null,
  dialogClose = null,
  toastTimer,
  lastSaved = 0,
  frame = 0,
  hudClock = 0;
const audio = new AudioEngine();
let keys = new Set(),
  pointerFire = false,
  aim = null,
  lastStamp = 0,
  accumulator = 0;
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 4500);
}
function persist() {
  if (!writeSave(save)) {
    toast(
      "Storage unavailable. You can keep playing, but this session cannot be saved.",
    );
    return false;
  }
  return true;
}
function checkpoint() {
  if (active && active.state.status === "playing")
    save.session = {
      mode: active.mode.id,
      state: structuredClone(active.state),
    };
  persist();
  lastSaved = performance.now();
}
function applySettings() {
  document.documentElement.style.setProperty(
    "--text-scale",
    save.settings.textScale,
  );
  document.body.classList.toggle("reduced-motion", save.settings.reducedMotion);
  document.body.classList.toggle("high-contrast", save.settings.contrast);
  audio.settings = save.settings;
}
function updateProfile() {
  $$("#profile-xp").forEach((e) => (e.textContent = `${save.xp} XP`));
  $$(".profile-level").forEach(
    (e) => (e.textContent = `LEVEL ${1 + Math.floor(save.xp / 360)}`),
  );
  $$(".profile-progress").forEach(
    (e) => (e.style.width = `${((save.xp % 360) / 360) * 100}%`),
  );
}
$("#app").innerHTML =
  `<aside class="sidebar"><a class="brand" href="#" aria-label="Omniverse Forge home"><span class="brand-symbol">${icon("forge")}</span><span>OMNIVERSE<span class="brand-sub">F O R G E</span></span></a><div class="workspace-label">YOUR UNIVERSE</div><nav class="nav-primary" aria-label="Main navigation"><button data-route="home">${icon("universe")}<span>Overview</span></button><button data-route="modes">${icon("grid")}<span>Explore worlds</span><span class="nav-count">4</span></button><button data-route="lab">${icon("forge")}<span>Forge lab</span><span class="new-dot"></span></button></nav><div class="nav-divider"></div><div class="workspace-label">THE TOOLKIT</div><nav aria-label="Tools"><button data-route="guide">${icon("book")}<span>Field guide</span></button><button data-settings>${icon("settings")}<span>Settings</span></button></nav><div class="sidebar-bottom"><div class="open-source"><span class="live-dot"></span>OPEN SOURCE. OPEN WORLDS.<p>Built to play. Made to expand.</p></div><button class="profile" data-route="profile"><span class="avatar">E</span><span><strong>Explorer</strong><small class="profile-level">LEVEL 1</small></span>${icon("chevron")}<span class="profile-meter"><i class="profile-progress"></i></span></button><div class="sidebar-version"><span>FORGE v0.1.0</span><span>LOCAL BUILD</span></div></div></aside><div class="main-shell"><header class="topbar"><div class="breadcrumb">Workspace <span>/</span> <strong id="route-label">Overview</strong></div><div class="header-tools"><label class="search-box">${icon("search")}<input id="search" type="search" placeholder="Find your next world…" aria-label="Search worlds"><kbd>/</kbd></label><span class="save-indicator"><span class="live-dot"></span>LOCAL PROFILE</span><button class="icon-button" data-settings aria-label="Open settings">${icon("settings")}</button></div></header><main id="page"></main></div>`;
const dialog = document.createElement("dialog");
dialog.id = "modal";
document.body.append(dialog);
function showDialog(html, onClose = null) {
  if (dialog.open) dialog.close();
  pendingBind = null;
  dialogClose = onClose;
  dialog.innerHTML = `<button class="dialog-close icon-button" aria-label="Close dialog">${icon("close")}</button>${html}`;
  dialog.querySelector(".dialog-close").onclick = closeDialog;
  dialog.showModal();
}
function closeDialog() {
  dialog.close();
  pendingBind = null;
  const callback = dialogClose;
  dialogClose = null;
  callback?.();
}
dialog.addEventListener("cancel", (e) => {
  e.preventDefault();
  closeDialog();
});
function nav(routeName) {
  if (active) {
    checkpoint();
    active = null;
    paused = false;
  }
  keys.clear();
  pointerFire = false;
  route = routeName;
  $$("[data-route]").forEach((b) =>
    b.classList.toggle("active", b.dataset.route === routeName),
  );
  const names = {
    home: "Overview",
    modes: "Explore worlds",
    lab: "Forge lab",
    guide: "Field guide",
    profile: "Explorer profile",
  };
  $("#route-label").textContent = names[routeName] || "Overview";
  $("#search").value = "";
  search = "";
  filter = "all";
  if (routeName === "home" || routeName === "modes")
    renderHome(routeName === "modes");
  else if (routeName === "lab") renderLab();
  else if (routeName === "guide") renderGuide();
  else renderProfile();
  window.scrollTo(0, 0);
}
function card(mode) {
  const completed = save.completed[mode.id] || 0;
  return `<button class="world-card" data-mode="${mode.id}" style="--accent:${mode.color}" aria-label="Explore ${mode.title}"><div class="card-art"><img src="/art/${mode.image}.svg" alt="" loading="lazy"><span class="world-number">SECTOR ${mode.number}</span>${mode.id === "frontier" ? '<span class="hybrid-badge">HYBRID WORLD</span>' : ""}<span class="card-launch">${icon("arrow")}</span></div><div class="card-copy"><div class="card-genre">${mode.tag}</div><h3>${mode.title}</h3><p>${mode.description}</p><div class="card-meta"><span>${icon("clock")}${mode.duration}</span><span>${completed ? icon("check") + " " + completed + " CLEARED" : "SOLO EXPEDITION"}</span></div></div></button>`;
}
function renderHome(modesOnly = false) {
  const cleared = Object.keys(save.completed).length;
  $("#page").innerHTML =
    `<div class="page-content"><section class="welcome"><div><div class="eyebrow">THE POSSIBILITIES ARE OPEN</div><h1>${modesOnly ? "Find your next world." : "Welcome to your universe."}</h1><p>Different worlds. Different rules. One place to call your own.</p></div><div class="worlds-status"><span class="live-dot"></span>4 worlds ready to explore</div></section>${!modesOnly ? `<section class="hero"><img class="hero-art" src="/art/universe.svg" alt="A luminous portal floating above a distant, mountainous world"><div class="hero-shade"></div><div class="hero-content"><span class="hero-badge">${icon("spark")}THE OPEN-WORLD EXPERIMENT</span><h2>One universe.<br>Infinite ways<br>to <em>play.</em></h2><p>Step through the ordinary.<br>Discover a universe shaped by curiosity.</p><div class="hero-actions"><button class="primary" data-mode="rift">Enter the universe ${icon("arrow")}</button><button class="text-button" id="view-worlds">Explore worlds ${icon("chevron")}</button></div></div><div class="hero-coordinate"><span class="coordinate-cross">+</span> SECTOR 01 · THE FRACTURED REACH <span>27° 01′ N</span></div><span class="hero-index">01 <i>/</i> 04</span></section>` : ""}
 ${save.session ? `<button class="resume-banner" id="continue-session">${icon("play")}<span><strong>Your expedition is waiting</strong><small>Continue ${esc(modeById(save.session.mode).title)} · saved on this device</small></span><span>Resume ${icon("arrow")}</span></button>` : ""}
 <section id="worlds" class="worlds-section"><div class="section-heading"><div><span class="eyebrow">CHOOSE YOUR ADVENTURE</span><h2>Four worlds. No wrong turn.</h2></div><div class="filters" role="group" aria-label="Filter worlds">${[
   ["all", "All worlds"],
   ["action", "Action"],
   ["strategy", "Strategy"],
   ["puzzle", "Puzzle"],
   ["hybrid", "Hybrid"],
 ]
   .map(
     ([id, text]) =>
       `<button data-filter="${id}" class="${id === filter ? "selected" : ""}">${text}</button>`,
   )
   .join(
     "",
   )}</div></div><div class="world-grid">${modes.map(card).join("")}</div><div class="empty-search" hidden>No worlds match that search. Try a title or genre.</div></section>
 <section class="bottom-row"><button class="lab-banner" data-route="lab"><span class="lab-icon">${icon("forge")}</span><span><span class="eyebrow">A LITTLE OF THIS. A WORLD OF THAT.</span><strong>Your rules. Your frontier.</strong><small>Combine survival and construction in the Forge lab.</small></span><span class="round-arrow">${icon("arrow")}</span></button><div class="journey"><div class="journey-title"><span class="eyebrow">YOUR JOURNEY</span><span>${cleared} / 4 WORLDS</span></div><div class="journey-track">${modes.map((m) => `<i style="background:${save.completed[m.id] ? m.color : ""}"></i>`).join("")}</div><p>${cleared ? "Every expedition leaves a mark. Keep exploring." : "Every great universe starts with a first step."}</p></div></section><footer class="page-footer"><span><span class="live-dot"></span>All systems ready <i>·</i> No account required</span><button data-route="guide">Made for the curious ${icon("arrow")}</button></footer></div>`;
  $("#view-worlds")?.addEventListener("click", () =>
    $("#worlds").scrollIntoView({
      behavior: save.settings.reducedMotion ? "instant" : "smooth",
    }),
  );
  $("#continue-session")?.addEventListener("click", () =>
    start(
      modeById(save.session.mode),
      save.session.state.rules,
      structuredClone(save.session.state),
    ),
  );
  $$("[data-filter]").forEach(
    (b) =>
      (b.onclick = () => {
        filter = b.dataset.filter;
        $$("[data-filter]").forEach((e) =>
          e.classList.toggle("selected", e === b),
        );
        filterWorlds();
      }),
  );
}
function filterWorlds() {
  let visible = 0;
  $$(".world-card").forEach((card) => {
    const mode = modeById(card.dataset.mode);
    const matches =
      (!search ||
        `${mode.title} ${mode.tag} ${mode.description}`
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (filter === "all" ||
        (filter === "action" && mode.id === "rift") ||
        (filter === "strategy" && mode.id === "bastion") ||
        (filter === "puzzle" && mode.id === "signal") ||
        (filter === "hybrid" && mode.id === "frontier"));
    card.hidden = !matches;
    if (matches) visible++;
  });
  $(".empty-search")?.toggleAttribute("hidden", visible > 0);
}
function modeDialog(id, rules = null) {
  const mode = modeById(id);
  audio.unlock();
  showDialog(
    `<div class="mode-preview" style="--accent:${mode.color}"><img src="/art/${mode.image}.svg" alt=""><span class="eyebrow">SECTOR ${mode.number} / ${mode.tag}</span><h2>${mode.title}</h2><p>${mode.description}</p></div><div class="dialog-body"><h3>Your mission</h3><p>${mode.objective}</p><h3>In the field</h3><p>${controlText(mode)}</p><div class="tip">${icon("spark")}<span>${mode.hint}</span></div><div class="dialog-actions"><span>${icon("clock")}${mode.duration} <i>·</i> ${esc((rules?.difficulty || save.settings.difficulty).toUpperCase())}</span><button class="primary" id="begin-expedition">Launch expedition ${icon("arrow")}</button></div></div>`,
  );
  $("#begin-expedition").onclick = () => {
    closeDialog();
    start(
      mode,
      normalizeRules(rules || { difficulty: save.settings.difficulty }),
    );
  };
}
function keyName(code) {
  return code
    .replace("Key", "")
    .replace("Digit", "")
    .replace("ShiftLeft", "L Shift")
    .replace("ShiftRight", "R Shift");
}
function controlText(mode) {
  if (!["rift", "frontier"].includes(mode.id)) return mode.controls;
  const k = save.settings.keys;
  return (
    `Move with ${[k.up, k.left, k.down, k.right].map(keyName).join("/")} or arrow keys. Hold ${keyName(k.fire)} to auto-fire, or click to aim. ${keyName(k.dash)} dashes.` +
    (mode.id === "frontier"
      ? ` ${keyName(k.interact)} mines nearby crystals; ${keyName(k.build)} builds a turret for 3 ore.`
      : " Walk over all three shards, clear every wave, then return to the portal.")
  );
}
function start(mode, rules, saved = null) {
  if (active) checkpoint();
  audio.unlock();
  active = { mode, state: saved || mode.create(rules), reported: false };
  paused = false;
  keys.clear();
  pointerFire = false;
  aim = null;
  route = "play";
  accumulator = 0;
  $("#route-label").textContent = mode.title;
  $$("[data-route]").forEach((b) => b.classList.remove("active"));
  $("#page").innerHTML =
    `<div class="play-page"><div class="play-heading"><button class="text-button" id="leave-game">${icon("back")} Save & leave</button><span>SECTOR ${mode.number} <i>/</i> ${mode.tag}</span><div><button class="icon-button" id="help-game" aria-label="Game instructions">${icon("book")}</button><button class="icon-button" data-settings aria-label="Game settings">${icon("settings")}</button></div></div><div class="game-title-row"><div><span class="eyebrow">EXPEDITION IN PROGRESS</span><h1>${mode.title}</h1></div><div class="game-top-actions"><button class="secondary compact" id="restart-game">${icon("reset")} Restart</button><button class="secondary compact" id="pause-game">${icon("pause")} Pause</button></div></div><div class="hud" aria-label="Expedition statistics"></div><div class="game-stage"><canvas id="game" width="1000" height="620" tabindex="0" aria-label="${mode.title} playfield. ${esc(controlText(mode))}"></canvas><div id="game-overlay" hidden></div></div><div class="game-message"><span class="live-dot"></span><span id="game-message" role="status" aria-live="polite"></span><span id="game-timer">00:00</span></div><div class="game-controls"><p>${esc(controlText(mode))}</p><div id="mode-actions">${mode.id === "bastion" ? '<button class="primary compact" data-command="end-turn">End turn →</button>' : mode.id === "signal" ? '<button class="secondary compact" data-command="undo">↶ Undo rotation</button>' : ""}</div></div><div class="touch-controls" aria-label="Touch controls">${["rift", "frontier"].includes(mode.id) ? '<div class="d-pad"><button data-hold="up" aria-label="Move up">↑</button><button data-hold="left" aria-label="Move left">←</button><button data-hold="down" aria-label="Move down">↓</button><button data-hold="right" aria-label="Move right">→</button></div><button data-hold="fire">Fire</button><button data-command="dash">Dash</button>' + (mode.id === "frontier" ? '<button data-command="interact">Mine</button><button data-command="build">Build</button>' : "") : ""}</div><footer class="page-footer"><span>SEED ${active.state.rules.seed} <i>·</i> ${active.state.rules.difficulty.toUpperCase()}</span><span>Auto-saves every 5 seconds <i>·</i> Esc to pause</span></footer></div>`;
  const canvas = $("#game");
  active.ctx = canvas.getContext("2d");
  if (!active.ctx) {
    toast("Canvas 2D is unavailable in this browser.");
    nav("home");
    return;
  }
  canvas.focus({ preventScroll: true });
  $("#leave-game").onclick = () => nav("home");
  $("#pause-game").onclick = () => setPause(!paused);
  $("#restart-game").onclick = confirmRestart;
  $("#help-game").onclick = showGameHelp;
  canvas.addEventListener("pointerdown", (e) => {
    if (paused || active.state.status !== "playing") return;
    audio.unlock();
    canvas.focus({ preventScroll: true });
    const pos = canvasPoint(e);
    if (active.state.type === "action") {
      pointerFire = true;
      const cam = actionCamera(active.state);
      aim = { x: pos.x + cam.x, y: pos.y + cam.y };
      canvas.setPointerCapture(e.pointerId);
    } else {
      const l = active.state.type === "tactics" ? tacticalLayout : puzzleLayout;
      const x = Math.floor((pos.x - l.x) / l.cell),
        y = Math.floor((pos.y - l.y) / l.cell);
      if (x >= 0 && x < l.cols && y >= 0 && y < l.rows)
        command(
          e.button === 2 && active.state.type === "puzzle"
            ? "reverse"
            : "select",
          active.state.type === "tactics" ? { x, y } : y * 5 + x,
        );
    }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (active?.state.type === "action") {
      const pos = canvasPoint(e),
        cam = actionCamera(active.state);
      aim = { x: pos.x + cam.x, y: pos.y + cam.y };
    }
  });
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  $$("[data-hold]").forEach((button) => {
    button.onpointerdown = (e) => {
      e.preventDefault();
      audio.unlock();
      button.setPointerCapture(e.pointerId);
      keys.add(save.settings.keys[button.dataset.hold]);
    };
    button.onpointerup = button.onpointercancel = () =>
      keys.delete(save.settings.keys[button.dataset.hold]);
  });
  updateHUD();
  checkpoint();
}
function canvasPoint(e) {
  const r = $("#game").getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) / r.width) * W,
    y: ((e.clientY - r.top) / r.height) * H,
  };
}
function command(action, payload) {
  if (!active || paused || dialog.open || active.state.status !== "playing")
    return;
  active.mode.command(active.state, action, payload);
  audio.tone("tap");
  updateHUD();
  checkResult();
  if (active?.state.status === "playing")
    $("#game")?.focus({ preventScroll: true });
}
function setPause(value) {
  if (!active || active.state.status !== "playing") return;
  paused = value;
  keys.clear();
  pointerFire = false;
  $("#pause-game").innerHTML =
    icon(value ? "play" : "pause") + (value ? " Resume" : " Pause");
  const overlay = $("#game-overlay");
  overlay.hidden = !value;
  if (value) {
    checkpoint();
    overlay.innerHTML = `<div class="result-card"><span class="eyebrow">TAKE YOUR TIME</span><h2>Between worlds.</h2><p>Your expedition is paused and saved.</p><button class="primary" id="resume-game">Resume expedition ${icon("play")}</button><button class="text-button" id="pause-leave">Return to overview</button></div>`;
    $("#resume-game").onclick = () => setPause(false);
    $("#pause-leave").onclick = () => nav("home");
    $("#resume-game").focus();
  } else $("#game").focus({ preventScroll: true });
}
function confirmRestart() {
  if (!active) return;
  const wasPaused = paused;
  setPause(true);
  showDialog(
    `<div class="dialog-body"><span class="eyebrow">A FRESH START</span><h2>Try this world again?</h2><p>The seed and rules stay the same. Your current expedition will be replaced; your profile progress is safe.</p><div class="dialog-actions"><button class="secondary" id="cancel-restart">Keep exploring</button><button class="primary" id="confirm-restart">Restart expedition</button></div></div>`,
    () => {
      if (!wasPaused) setPause(false);
    },
  );
  $("#cancel-restart").onclick = closeDialog;
  $("#confirm-restart").onclick = () => {
    const mode = active.mode,
      rules = active.state.rules;
    closeDialog();
    active = null;
    start(mode, rules);
  };
}
function showGameHelp() {
  if (!active) return;
  const wasPaused = paused;
  setPause(true);
  showDialog(
    `<div class="dialog-body"><span class="eyebrow">FIELD NOTES</span><h2>${active.mode.title}</h2><h3>Your mission</h3><p>${active.mode.objective}</p><h3>Controls</h3><p>${esc(controlText(active.mode))}</p><div class="tip">${icon("spark")}<p>${active.mode.hint}</p></div><button class="primary" id="help-done">Got it</button></div>`,
    () => {
      if (!wasPaused) setPause(false);
    },
  );
  $("#help-done").onclick = closeDialog;
}
function updateHUD() {
  if (!active || !$(".hud")) return;
  const items = active.mode.hud(active.state);
  $(".hud").innerHTML = items
    .map(
      (item, i) =>
        `<div class="hud-item"><span>${item.label}</span><strong style="color:${i === 0 ? active.mode.color : ""}">${esc(item.value)}</strong></div>`,
    )
    .join("");
  const text = active.state.message;
  if ($("#game-message").textContent !== text)
    $("#game-message").textContent = text;
  const seconds = Math.floor(active.state.time);
  $("#game-timer").textContent =
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
function checkResult() {
  if (!active || active.state.status === "playing" || active.reported) return;
  active.reported = true;
  keys.clear();
  pointerFire = false;
  const won = active.state.status === "won",
    xp = award(save, active.mode.id, active.state);
  save.session = null;
  persist();
  updateProfile();
  audio.tone(won ? "win" : "lose");
  const overlay = $("#game-overlay");
  overlay.hidden = false;
  overlay.innerHTML = `<div class="result-card"><span class="result-emblem">${icon(won ? "spark" : "reset")}</span><span class="eyebrow">${won ? "EXPEDITION COMPLETE" : "EXPEDITION ENDED"}</span><h2>${won ? "A world of possibility." : "Every ending is a beginning."}</h2><p>${esc(active.state.message)}</p>${won ? `<div class="xp-award">+${xp} EXPLORER XP</div>` : ""}<button class="primary" id="play-again">Explore again ${icon("reset")}</button><button class="text-button" id="result-home">Back to your universe ${icon("arrow")}</button></div>`;
  $("#play-again").onclick = () => {
    const mode = active.mode,
      rules = active.state.rules;
    active = null;
    start(mode, rules);
  };
  $("#result-home").onclick = () => nav("home");
  $("#play-again").focus();
}
function renderLab() {
  $("#page").innerHTML =
    `<div class="page-content narrow-page"><span class="eyebrow">THE FORGE LAB / EXPERIMENT 001</span><h1>Your rules. Your frontier.</h1><p class="intro">A shared universe shouldn’t mean a single way to play. Combine compatible mechanics, then test your own expedition.</p><div class="lab-layout"><div class="lab-config"><h2>Compose a world</h2><div class="mechanic selected">${icon("play")}<span><strong>Survival action</strong><small>Movement · combat · resources</small></span><span class="pill">FOUNDATION</span></div><label class="mechanic">${icon("forge")}<span><strong>Outpost construction</strong><small>Mine crystals and build automated turrets</small></span><input type="checkbox" id="lab-turrets" checked></label><label class="mechanic">${icon("clock")}<span><strong>Turn-based clock</strong><small>Test a conflicting simulation requirement</small></span><input type="checkbox" id="lab-turns"></label><div id="compatibility" class="compatibility" role="status"></div><label class="field">World seed <input id="lab-seed" type="number" min="1" max="999999" value="2701"></label><div class="field-row"><label class="field">Difficulty<select id="lab-difficulty"><option value="explorer">Explorer · relaxed</option><option value="standard" selected>Standard · balanced</option><option value="veteran">Veteran · demanding</option></select></label><label class="field">Enemy waves<select id="lab-waves"><option>2</option><option selected>3</option><option>4</option><option>5</option></select></label></div><div class="dialog-actions"><button class="secondary" id="export-rules">${icon("download")} Export rules</button><button class="primary" id="launch-custom">Forge & play ${icon("arrow")}</button></div><label class="import-label">Import a ruleset <input type="file" id="import-rules" accept="application/json,.json"></label></div><div class="lab-explain"><img src="/art/frontier.svg" alt="Original illustration of a frontier outpost"><span class="eyebrow">THE RESULTING WORLD</span><h2>Frontier Zero</h2><p>One simulation. Two interlocking systems. Every crystal you gather can become a defense, and every defense gives you room to explore.</p><ul><li>Seeded, reproducible environments</li><li>Configurable pressure and wave count</li><li>Local saves and shared progression</li><li>Data-only rulesets. No scripts executed.</li></ul><div class="tip">${icon("spark")}<span>${genres.length} genres are registered for design. Other combinations are a roadmap, not playable modules yet.</span></div></div></div></div>`;
  const rules = () =>
    normalizeRules({
      seed: $("#lab-seed").value,
      difficulty: $("#lab-difficulty").value,
      waves: $("#lab-waves").value,
      turrets: $("#lab-turrets").checked,
    });
  function check() {
    const genres = [
      "action",
      "survival",
      ...($("#lab-turrets").checked ? ["building", "tower-defense"] : []),
      ...($("#lab-turns").checked ? ["turn-based-strategy"] : []),
    ];
    const result = validateCombination(genres, rules());
    $("#compatibility").classList.toggle("conflict", !result.valid);
    $("#compatibility").textContent = result.valid
      ? "✓ Compatible systems · ready to forge"
      : result.issues.join(" ");
    $("#launch-custom").disabled = !result.valid;
    $("#export-rules").disabled = !result.valid;
    return result.valid;
  }
  $("#lab-turrets").onchange = $("#lab-turns").onchange = check;
  check();
  $("#launch-custom").onclick = () => {
    if (check()) modeDialog("frontier", rules());
  };
  $("#export-rules").onclick = () =>
    download(
      "frontier-rules.json",
      JSON.stringify(
        {
          format: "omniverse-rules",
          version: 1,
          mode: "frontier",
          rules: rules(),
        },
        null,
        2,
      ),
    );
  $("#import-rules").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      if (file.size > 8192) throw Error("Ruleset too large (8 KB maximum).");
      const v = JSON.parse(await file.text());
      if (
        v.format !== "omniverse-rules" ||
        v.version !== 1 ||
        v.mode !== "frontier" ||
        !v.rules ||
        typeof v.rules !== "object" ||
        Array.isArray(v.rules)
      )
        throw Error("Not a supported Frontier ruleset.");
      const r = normalizeRules(v.rules);
      $("#lab-seed").value = r.seed;
      $("#lab-difficulty").value = r.difficulty;
      $("#lab-waves").value = r.waves;
      $("#lab-turrets").checked = r.turrets;
      $("#lab-turns").checked = false;
      check();
      toast("Ruleset imported. Values validated; no code was executed.");
    } catch (error) {
      toast(error.message || "The ruleset could not be read.");
    }
    e.target.value = "";
  };
}
function download(name, text) {
  const blob = new Blob([text], { type: "application/json" }),
    url = URL.createObjectURL(blob),
    link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function renderGuide() {
  $("#page").innerHTML =
    `<div class="page-content narrow-page"><span class="eyebrow">THE EXPLORER’S FIELD GUIDE</span><h1>A universe, without the guesswork.</h1><p class="intro">Four short expeditions. Three different simulation models. A shared place to grow.</p><div class="guide-grid">${modes.map((m) => `<article class="guide-card"><span class="eyebrow" style="color:${m.color}">SECTOR ${m.number} / ${m.tag}</span><h2>${m.title}</h2><p>${m.objective}</p><h3>Controls</h3><p>${esc(controlText(m))}</p><div class="tip">${icon("spark")}<span>${m.hint}</span></div><button class="text-button" data-mode="${m.id}">Explore this world ${icon("arrow")}</button></article>`).join("")}</div><section class="notes"><h2>Genre atlas</h2><p>${genres.length} design entries. “Implemented” means a small mechanic subset in this slice, not a full genre engine.</p><details><summary>View the registry and current coverage</summary><div class="genre-atlas">${genres.map((g) => `<span class="genre-entry ${g.status}">${g.name}<small>${g.status}</small></span>`).join("")}</div></details><h2>Good to know</h2><details open><summary>Your progress stays with you</summary><p>Every completed expedition earns 120 XP, or 180 XP for Frontier Zero. A new level starts every 360 XP. These are cosmetic milestones; no mode is locked. Active expeditions save every five seconds and when you leave. Saves are local to this browser and preview origin, not a cloud account.</p></details><details><summary>Accessibility & input</summary><p>All menus use standard keyboard controls. Both grid modes support arrows and Enter; action modes include on-screen touch controls. Remap action keys, adjust audio, increase UI text, or reduce motion in Settings. Color is paired with labels and shapes. The real-time canvas is not fully screen-reader accessible; gamepad and localization are not implemented.</p></details><details><summary>What’s open, and what’s next</summary><p>The original game source, vector art, and synthesized sounds are MIT licensed. The runtime uses Canvas 2D and Web Audio with no third-party runtime library. Research and the adapter roadmap live in the repository’s docs folder. Multiplayer, 3D, arbitrary engine mixing, and executable community mods are not included in this build.</p></details></section></div>`;
}
function renderProfile() {
  const count = Object.values(save.completed).reduce((a, b) => a + b, 0);
  $("#page").innerHTML =
    `<div class="page-content narrow-page"><span class="eyebrow">YOUR EXPLORER PROFILE / LOCAL ONLY</span><h1>Leave a little light behind.</h1><p class="intro">Every world is open from the start. Your progress is a record of the paths you’ve taken.</p><div class="profile-stats"><div><span>EXPLORER LEVEL</span><strong>${1 + Math.floor(save.xp / 360)}</strong></div><div><span>TOTAL EXPERIENCE</span><strong>${save.xp} <small>XP</small></strong></div><div><span>EXPEDITIONS CLEARED</span><strong>${count}</strong></div></div><div class="profile-worlds">${modes.map((m) => `<button data-mode="${m.id}" class="profile-world"><img src="/art/${m.image}.svg" alt=""><span><strong>${m.title}</strong><small>${save.completed[m.id] || 0} expeditions cleared</small></span><span>${save.best[m.id] !== undefined ? "BEST " + save.best[m.id] + (m.id === "signal" ? " ROTATIONS" : m.id === "bastion" ? " TURNS" : "s") : "UNEXPLORED"}</span>${icon("arrow")}</button>`).join("")}</div></div>`;
}
function openSettings() {
  const wasPaused = paused;
  if (active) setPause(true);
  const s = save.settings;
  showDialog(
    `<div class="dialog-body settings-body"><span class="eyebrow">MAKE YOURSELF AT HOME</span><h2>Your universe, your way.</h2><div class="settings-section"><h3>Experience</h3><label class="setting-line"><span>Sound effects<small>Original, procedurally synthesized audio</small></span><input type="checkbox" id="setting-sound" ${s.sound ? "checked" : ""}></label><label class="setting-line"><span>Master volume</span><input type="range" id="setting-volume" min="0" max="1" step="0.05" value="${s.volume}"></label><label class="setting-line"><span>New expedition difficulty</span><select id="setting-difficulty">${["explorer", "standard", "veteran"].map((d) => `<option value="${d}" ${d === s.difficulty ? "selected" : ""}>${d[0].toUpperCase() + d.slice(1)}</option>`).join("")}</select></label></div><div class="settings-section"><h3>Accessibility</h3>${[
      ["reducedMotion", "Reduced motion", "Quiet menus and decorative effects"],
      [
        "contrast",
        "High contrast",
        "Brighter text and stronger focus outlines",
      ],
    ]
      .map(
        ([k, label, help]) =>
          `<label class="setting-line"><span>${label}<small>${help}</small></span><input type="checkbox" id="setting-${k}" ${s[k] ? "checked" : ""}></label>`,
      )
      .join(
        "",
      )}<label class="setting-line"><span>Larger interface text</span><input type="checkbox" id="setting-textScale" ${s.textScale > 1 ? "checked" : ""}></label></div><div class="settings-section"><h3>Action controls <span>Click a key to rebind</span></h3><div class="keybinds">${Object.entries(
      s.keys,
    )
      .map(
        ([action, code]) =>
          `<div><span>${action}</span><button class="keybind" data-bind="${action}">${keyName(code)}</button></div>`,
      )
      .join(
        "",
      )}</div><p id="bind-notice">Arrow keys always move or select. Esc always pauses. Use letters, numbers, Space, or Shift. Duplicate keys are rejected.</p><button class="text-button" id="reset-controls">Restore default controls</button></div><div class="dialog-actions"><span>Saved automatically on this device</span><button class="primary" id="settings-done">All set ${icon("check")}</button></div></div>`,
    () => {
      if (active && !wasPaused) setPause(false);
    },
  );
  for (const name of [
    "sound",
    "volume",
    "difficulty",
    "reducedMotion",
    "contrast",
    "textScale",
  ])
    $("#setting-" + name).oninput = (e) => {
      let value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      if (name === "volume") value = Number(value);
      if (name === "textScale") value = value ? 1.15 : 1;
      save.settings = sanitizeSettings({ ...save.settings, [name]: value });
      applySettings();
      persist();
      if (name === "volume") {
        audio.unlock();
        audio.tone("tap");
      }
    };
  $$("[data-bind]").forEach(
    (b) =>
      (b.onclick = () => {
        pendingBind = b.dataset.bind;
        $("#bind-notice").textContent =
          `Press a new key for ${pendingBind}, or Escape to cancel.`;
        b.textContent = "…";
      }),
  );
  $("#reset-controls").onclick = () => {
    save.settings.keys = { ...DEFAULT_SETTINGS.keys };
    pendingBind = null;
    $$("[data-bind]").forEach(
      (b) => (b.textContent = keyName(save.settings.keys[b.dataset.bind])),
    );
    persist();
    $("#bind-notice").textContent = "Default controls restored.";
  };
  $("#settings-done").onclick = closeDialog;
}
// Delegated UI actions stay bound across page transitions.
document.addEventListener("click", (e) => {
  const routeButton = e.target.closest("[data-route]"),
    modeButton = e.target.closest("[data-mode]"),
    settings = e.target.closest("[data-settings]"),
    cmd = e.target.closest("[data-command]");
  if (routeButton) {
    audio.unlock();
    audio.tone("tap");
    nav(routeButton.dataset.route);
  } else if (modeButton) modeDialog(modeButton.dataset.mode);
  else if (settings) {
    audio.unlock();
    openSettings();
  } else if (cmd) {
    audio.unlock();
    command(cmd.dataset.command);
  }
});
$$(".sidebar nav button").forEach((b) =>
  b.setAttribute("aria-label", b.textContent.trim().replace(/4$/, "").trim()),
);
$(".brand").onclick = (e) => {
  e.preventDefault();
  nav("home");
};
$("#search").oninput = (e) => {
  const value = e.target.value;
  if (!["home", "modes"].includes(route)) nav("modes");
  search = value;
  $("#search").value = value;
  filterWorlds();
};
document.addEventListener("keydown", (e) => {
  if (pendingBind) {
    e.preventDefault();
    if (e.code === "Escape") {
      pendingBind = null;
      $$("[data-bind]").forEach(
        (b) => (b.textContent = keyName(save.settings.keys[b.dataset.bind])),
      );
      return;
    }
    if (!/^(Key[A-Z]|Digit[0-9]|Space|ShiftLeft|ShiftRight)$/.test(e.code)) {
      $("#bind-notice").textContent = "Use a letter, number, Space, or Shift.";
      return;
    }
    if (
      Object.entries(save.settings.keys).some(
        ([k, v]) => k !== pendingBind && v === e.code,
      )
    ) {
      $("#bind-notice").textContent =
        "That key is already assigned. Choose another.";
      return;
    }
    save.settings.keys[pendingBind] = e.code;
    $$("[data-bind]").forEach(
      (b) => (b.textContent = keyName(save.settings.keys[b.dataset.bind])),
    );
    $("#bind-notice").textContent = `${pendingBind} is now ${keyName(e.code)}.`;
    pendingBind = null;
    persist();
    return;
  }
  if (dialog.open) return;
  if (
    e.code === "Slash" &&
    !active &&
    !["INPUT", "TEXTAREA"].includes(e.target.tagName)
  ) {
    e.preventDefault();
    $("#search").focus();
    return;
  }
  if (
    !active ||
    (["INPUT", "SELECT", "TEXTAREA", "BUTTON"].includes(e.target.tagName) &&
      e.code !== "Escape")
  )
    return;
  const k = save.settings.keys;
  if (
    [
      ...Object.values(k),
      "ArrowUp",
      "ArrowLeft",
      "ArrowDown",
      "ArrowRight",
      "Enter",
      "Escape",
    ].includes(e.code)
  )
    e.preventDefault();
  if (e.code === "Escape") {
    if (!e.repeat) setPause(!paused);
    return;
  }
  if (paused || active.state.status !== "playing") return;
  audio.unlock();
  keys.add(e.code);
  if (e.repeat) return;
  if (active.state.type === "action") {
    for (const action of ["dash", "interact", "build"])
      if (e.code === k[action]) command(action);
  } else {
    const vectors = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
    };
    if (vectors[e.code]) command("cursor", vectors[e.code]);
    if (e.code === "Enter" || e.code === "Space") command("select");
  }
});
document.addEventListener("keyup", (e) => keys.delete(e.code));
document.addEventListener("pointerup", () => (pointerFire = false));
document.addEventListener("pointercancel", () => {
  pointerFire = false;
  keys.clear();
});
window.addEventListener("blur", () => {
  keys.clear();
  pointerFire = false;
  if (active && !dialog.open) setPause(true);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && active) setPause(true);
});
window.addEventListener("pagehide", () => {
  if (active) checkpoint();
});
function loop(stamp) {
  const elapsed = Math.min((stamp - lastStamp) / 1000 || 0, 0.1);
  lastStamp = stamp;
  if (active) {
    const { mode, state } = active;
    if (!paused && !dialog.open && state.status === "playing") {
      accumulator += elapsed;
      let steps = 0;
      const shots = state.shotCount,
        shards = state.collected,
        ore = state.ore;
      const k = save.settings.keys;
      while (accumulator >= 1 / 60 && steps++ < 6) {
        mode.step(state, 1 / 60, {
          up: keys.has(k.up) || keys.has("ArrowUp"),
          down: keys.has(k.down) || keys.has("ArrowDown"),
          left: keys.has(k.left) || keys.has("ArrowLeft"),
          right: keys.has(k.right) || keys.has("ArrowRight"),
          fire: keys.has(k.fire) || pointerFire,
          aim: pointerFire ? aim : null,
        });
        if (state.type !== "action") state.time += 1 / 60;
        accumulator -= 1 / 60;
      }
      if (state.shotCount > shots) audio.tone("shot");
      if (state.collected > shards || state.ore > ore) audio.tone("collect");
      checkResult();
      if (stamp - lastSaved > 5000 && state.status === "playing") checkpoint();
    } else accumulator = 0;
    mode.draw(active.ctx, state, save.settings);
    hudClock += elapsed;
    if (hudClock > 0.15) {
      updateHUD();
      hudClock = 0;
    }
  }
  frame++;
  requestAnimationFrame(loop);
}
// Read-only development diagnostics, deliberately excluded from production bundles by Vite.
if (import.meta.env.DEV)
  window.__forge = {
    snapshot: () =>
      active
        ? structuredClone({ mode: active.mode.id, state: active.state, paused })
        : null,
    profile: () => structuredClone(save),
    frames: () => frame,
  };
applySettings();
updateProfile();
nav("home");
requestAnimationFrame(loop);
if (loaded.error) setTimeout(() => toast(loaded.error), 200);
