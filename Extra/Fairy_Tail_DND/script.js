const API_STATE = "/api/state";

const STATS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

const SKILLS = [
  { name: "STR Saving Throw", stat: "STR", type: "Save" },
  { name: "Athletics", stat: "STR", type: "Skill" },
  { name: "DEX Saving Throw", stat: "DEX", type: "Save" },
  { name: "Acrobatics", stat: "DEX", type: "Skill" },
  { name: "Sleight of Hand", stat: "DEX", type: "Skill" },
  { name: "Stealth", stat: "DEX", type: "Skill" },
  { name: "CON Saving Throw", stat: "CON", type: "Save" },
  { name: "Endurance", stat: "CON", type: "Skill" },
  { name: "INT Saving Throw", stat: "INT", type: "Save" },
  { name: "Arcana", stat: "INT", type: "Skill" },
  { name: "History", stat: "INT", type: "Skill" },
  { name: "Investigation", stat: "INT", type: "Skill" },
  { name: "Nature", stat: "INT", type: "Skill" },
  { name: "Religion", stat: "INT", type: "Skill" },
  { name: "WIS Saving Throw", stat: "WIS", type: "Save" },
  { name: "Animal Handling", stat: "WIS", type: "Skill" },
  { name: "Insight", stat: "WIS", type: "Skill" },
  { name: "Medicine", stat: "WIS", type: "Skill" },
  { name: "Perception", stat: "WIS", type: "Skill" },
  { name: "Survival", stat: "WIS", type: "Skill" },
  { name: "CHA Saving Throw", stat: "CHA", type: "Save" },
  { name: "Deception", stat: "CHA", type: "Skill" },
  { name: "Intimidation", stat: "CHA", type: "Skill" },
  { name: "Performance", stat: "CHA", type: "Skill" },
  { name: "Persuasion", stat: "CHA", type: "Skill" }
];

const WEAPONS = [
  { name: "Club", category: "Simple Melee", damage: "1d4 bludgeoning", stat: "STR", properties: "Light" },
  { name: "Dagger", category: "Simple Melee", damage: "1d4 piercing", stat: "STR or DEX", properties: "Finesse, light, thrown 20/60" },
  { name: "Greatclub", category: "Simple Melee", damage: "1d8 bludgeoning", stat: "STR", properties: "Two-handed" },
  { name: "Handaxe", category: "Simple Melee", damage: "1d6 slashing", stat: "STR", properties: "Light, thrown 20/60" },
  { name: "Javelin", category: "Simple Melee", damage: "1d6 piercing", stat: "STR", properties: "Thrown 30/120" },
  { name: "Light Hammer", category: "Simple Melee", damage: "1d4 bludgeoning", stat: "STR", properties: "Light, thrown 20/60" },
  { name: "Mace", category: "Simple Melee", damage: "1d6 bludgeoning", stat: "STR", properties: "None" },
  { name: "Quarterstaff", category: "Simple Melee", damage: "1d6 bludgeoning", stat: "STR", properties: "Versatile 1d8" },
  { name: "Sickle", category: "Simple Melee", damage: "1d4 slashing", stat: "STR", properties: "Light" },
  { name: "Spear", category: "Simple Melee", damage: "1d6 piercing", stat: "STR", properties: "Thrown 20/60, versatile 1d8" },
  { name: "Light Crossbow", category: "Simple Ranged", damage: "1d8 piercing", stat: "DEX", properties: "Ammunition 80/320, loading, two-handed" },
  { name: "Dart", category: "Simple Ranged", damage: "1d4 piercing", stat: "DEX", properties: "Finesse, thrown 20/60" },
  { name: "Shortbow", category: "Simple Ranged", damage: "1d6 piercing", stat: "DEX", properties: "Ammunition 80/320, two-handed" },
  { name: "Sling", category: "Simple Ranged", damage: "1d4 bludgeoning", stat: "DEX", properties: "Ammunition 30/120" },
  { name: "Battleaxe", category: "Martial Melee", damage: "1d8 slashing", stat: "STR", properties: "Versatile 1d10" },
  { name: "Flail", category: "Martial Melee", damage: "1d8 bludgeoning", stat: "STR", properties: "None" },
  { name: "Glaive", category: "Martial Melee", damage: "1d10 slashing", stat: "STR", properties: "Heavy, reach, two-handed" },
  { name: "Greataxe", category: "Martial Melee", damage: "1d12 slashing", stat: "STR", properties: "Heavy, two-handed" },
  { name: "Greatsword", category: "Martial Melee", damage: "2d6 slashing", stat: "STR", properties: "Heavy, two-handed" },
  { name: "Halberd", category: "Martial Melee", damage: "1d10 slashing", stat: "STR", properties: "Heavy, reach, two-handed" },
  { name: "Lance", category: "Martial Melee", damage: "1d12 piercing", stat: "STR", properties: "Reach, special" },
  { name: "Longsword", category: "Martial Melee", damage: "1d8 slashing", stat: "STR", properties: "Versatile 1d10" },
  { name: "Maul", category: "Martial Melee", damage: "2d6 bludgeoning", stat: "STR", properties: "Heavy, two-handed" },
  { name: "Morningstar", category: "Martial Melee", damage: "1d8 piercing", stat: "STR", properties: "None" },
  { name: "Rapier", category: "Martial Melee", damage: "1d8 piercing", stat: "STR or DEX", properties: "Finesse" },
  { name: "Scimitar", category: "Martial Melee", damage: "1d6 slashing", stat: "STR or DEX", properties: "Finesse, light" },
  { name: "Shortsword", category: "Martial Melee", damage: "1d6 piercing", stat: "STR or DEX", properties: "Finesse, light" },
  { name: "Warhammer", category: "Martial Melee", damage: "1d8 bludgeoning", stat: "STR", properties: "Versatile 1d10" },
  { name: "Blowgun", category: "Martial Ranged", damage: "1 piercing", stat: "DEX", properties: "Ammunition 25/100, loading" },
  { name: "Hand Crossbow", category: "Martial Ranged", damage: "1d6 piercing", stat: "DEX", properties: "Ammunition 30/120, light, loading" },
  { name: "Heavy Crossbow", category: "Martial Ranged", damage: "1d10 piercing", stat: "DEX", properties: "Ammunition 100/400, heavy, loading, two-handed" },
  { name: "Longbow", category: "Martial Ranged", damage: "1d8 piercing", stat: "DEX", properties: "Ammunition 150/600, heavy, two-handed" }
];

const MAGIC_RULES = {
  Sense: {
    abilities: ["INT", "WIS", "CHA"],
    title: "Sense Magic",
    effect: "Uses INT, WIS, or CHA for spell checks and attacks. Mana rolls use 1d10 instead of 1d8."
  },
  Power: {
    abilities: ["CON", "STR"],
    title: "Power Magic",
    effect: "Uses CON or STR for spell checks and attacks. HP rolls use 1d10 and you gain Unarmed Strike."
  },
  Agility: {
    abilities: ["DEX"],
    title: "Agility Magic",
    effect: "Uses DEX for spell checks and attacks. When you take the Attack action, your Speed increases by 10 feet and Opportunity Attacks have Disadvantage against you until the end of your turn."
  }
};

const DEFAULT_THEME = {
  bg: "#09070d",
  card: "#15111d",
  accent: "#8b5cf6",
  mana: "#7c4dff",
  text: "#f3efff",
  soft: "#1d1728"
};

let state = {
  version: 1,
  selectedCharacterId: null,
  activeTab: "overview",
  showReserve: false,
  showDead: false,
  theme: null,
  characters: []
};

let saveTimer = null;
let lastSavedString = "";
let isLoading = true;

const els = {
  syncStatus: document.getElementById("syncStatus"),
  characterList: document.getElementById("characterList"),
  addCharacterBtn: document.getElementById("addCharacterBtn"),
  toggleReserveBtn: document.getElementById("toggleReserveBtn"),
  toggleDeadBtn: document.getElementById("toggleDeadBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importBtn: document.getElementById("importBtn"),
  importInput: document.getElementById("importInput"),
  sideSelectedName: document.getElementById("sideSelectedName"),
  sideSelectedState: document.getElementById("sideSelectedState"),
  sideSelectedLevel: document.getElementById("sideSelectedLevel"),
  sideSelectedProf: document.getElementById("sideSelectedProf"),
  charName: document.getElementById("charName"),
  charLevel: document.getElementById("charLevel"),
  charClass: document.getElementById("charClass"),
  charRace: document.getElementById("charRace"),
  charBackground: document.getElementById("charBackground"),
  charAge: document.getElementById("charAge"),
  charVibe: document.getElementById("charVibe"),
  topHp: document.getElementById("topHp"),
  topMana: document.getElementById("topMana"),
  topAc: document.getElementById("topAc"),
  topProf: document.getElementById("topProf"),
  portraitPreview: document.getElementById("portraitPreview"),
  imageUrlInput: document.getElementById("imageUrlInput"),
  saveImageUrlBtn: document.getElementById("saveImageUrlBtn"),
  uploadImageBtn: document.getElementById("uploadImageBtn"),
  imageUploadInput: document.getElementById("imageUploadInput"),
  clearImageBtn: document.getElementById("clearImageBtn"),
  hpText: document.getElementById("hpText"),
  manaText: document.getElementById("manaText"),
  hpBar: document.getElementById("hpBar"),
  manaBar: document.getElementById("manaBar"),
  currentHp: document.getElementById("currentHp"),
  maxHp: document.getElementById("maxHp"),
  currentMana: document.getElementById("currentMana"),
  maxMana: document.getElementById("maxMana"),
  armorClass: document.getElementById("armorClass"),
  speed: document.getElementById("speed"),
  initiative: document.getElementById("initiative"),
  rollHpBtn: document.getElementById("rollHpBtn"),
  rollManaBtn: document.getElementById("rollManaBtn"),
  restoreHpBtn: document.getElementById("restoreHpBtn"),
  restoreManaBtn: document.getElementById("restoreManaBtn"),
  backstory: document.getElementById("backstory"),
  levelBenefits: document.getElementById("levelBenefits"),
  statsGrid: document.getElementById("statsGrid"),
  skillsGrid: document.getElementById("skillsGrid"),
  magicName: document.getElementById("magicName"),
  magicType: document.getElementById("magicType"),
  magicAbility: document.getElementById("magicAbility"),
  magicDescription: document.getElementById("magicDescription"),
  magicEffectBox: document.getElementById("magicEffectBox"),
  spellCheckBtn: document.getElementById("spellCheckBtn"),
  spellNameInput: document.getElementById("spellNameInput"),
  spellCostInput: document.getElementById("spellCostInput"),
  spellEffectInput: document.getElementById("spellEffectInput"),
  addSpellBtn: document.getElementById("addSpellBtn"),
  spellList: document.getElementById("spellList"),
  weaponCatalogue: document.getElementById("weaponCatalogue"),
  characterWeapons: document.getElementById("characterWeapons"),
  inventoryText: document.getElementById("inventoryText"),
  notesText: document.getElementById("notesText"),
  themeBg: document.getElementById("themeBg"),
  themeCard: document.getElementById("themeCard"),
  themeAccent: document.getElementById("themeAccent"),
  themeMana: document.getElementById("themeMana"),
  themeText: document.getElementById("themeText"),
  themeSoft: document.getElementById("themeSoft"),
  saveThemeBtn: document.getElementById("saveThemeBtn"),
  resetThemeBtn: document.getElementById("resetThemeBtn"),
  setActiveBtn: document.getElementById("setActiveBtn"),
  setReserveBtn: document.getElementById("setReserveBtn"),
  setDeadBtn: document.getElementById("setDeadBtn"),
  deleteCharacterBtn: document.getElementById("deleteCharacterBtn")
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createBlankCharacter(index = 0) {
  const skills = {};

  SKILLS.forEach((skill) => {
    skills[skill.name] = {
      proficient: false,
      expertise: false
    };
  });

  return {
    id: `character-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    state: index < 4 ? "active" : "reserve",
    name: "",
    className: "",
    race: "",
    background: "",
    age: "",
    vibe: "",
    level: 1,
    image: "",
    hp: { current: 0, max: 0 },
    mana: { current: 0, max: 0 },
    armorClass: 10,
    speed: "30 ft",
    initiative: "",
    stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    skills,
    magic: {
      name: "",
      type: "Sense",
      ability: "INT",
      description: "",
      spells: []
    },
    weapons: [],
    inventoryText: "",
    notesText: "",
    backstory: ""
  };
}

function normalizeState(input) {
  const normalized = {
    version: 1,
    selectedCharacterId: input?.selectedCharacterId || null,
    activeTab: input?.activeTab || "overview",
    showReserve: Boolean(input?.showReserve),
    showDead: Boolean(input?.showDead),
    theme: input?.theme === null ? null : { ...DEFAULT_THEME, ...(input?.theme || {}) },
    characters: Array.isArray(input?.characters) ? input.characters : []
  };

  if (!normalized.characters.length) {
    normalized.characters = [
      createBlankCharacter(0),
      createBlankCharacter(1),
      createBlankCharacter(2),
      createBlankCharacter(3)
    ];
  }

  normalized.characters = normalized.characters.map((character, index) => {
    const base = createBlankCharacter(index);
    const merged = {
      ...base,
      ...character,
      hp: { ...base.hp, ...(character.hp || {}) },
      mana: { ...base.mana, ...(character.mana || {}) },
      stats: { ...base.stats, ...(character.stats || {}) },
      skills: { ...base.skills, ...(character.skills || {}) },
      magic: {
        ...base.magic,
        ...(character.magic || {}),
        spells: Array.isArray(character.magic?.spells) ? character.magic.spells : []
      },
      weapons: Array.isArray(character.weapons) ? character.weapons : []
    };

    if (!MAGIC_RULES[merged.magic.type]) {
      merged.magic.type = "Sense";
    }

    const allowed = MAGIC_RULES[merged.magic.type].abilities;
    if (!allowed.includes(merged.magic.ability)) {
      merged.magic.ability = allowed[0];
    }

    return merged;
  });

  if (!normalized.selectedCharacterId || !normalized.characters.some((c) => c.id === normalized.selectedCharacterId)) {
    normalized.selectedCharacterId = normalized.characters[0].id;
  }

  const allowedTabs = ["overview", "stats", "magic", "weapons", "inventory", "notes", "style"];
  if (!allowedTabs.includes(normalized.activeTab)) {
    normalized.activeTab = "overview";
  }

  return normalized;
}

function getCharacter() {
  return state.characters.find((character) => character.id === state.selectedCharacterId) || state.characters[0];
}

function getModifier(score) {
  return Math.floor((Number(score) - 10) / 2);
}

function formatMod(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function getProficiencyBonus(level) {
  const lvl = Number(level) || 1;
  if (lvl >= 17) return 6;
  if (lvl >= 13) return 5;
  if (lvl >= 9) return 4;
  if (lvl >= 5) return 3;
  return 2;
}

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getSkillTotal(character, skillName) {
  const skill = SKILLS.find((entry) => entry.name === skillName);
  if (!skill) return 0;

  const skillState = character.skills[skillName] || { proficient: false, expertise: false };
  const abilityMod = getModifier(character.stats[skill.stat]);
  const pb = getProficiencyBonus(character.level);

  if (skillState.expertise) return abilityMod + pb * 2;
  if (skillState.proficient) return abilityMod + pb;
  return abilityMod;
}

function getMagicRule(character) {
  return MAGIC_RULES[character.magic.type] || MAGIC_RULES.Sense;
}

function getHpDie(character) {
  return character.magic.type === "Power" ? 10 : 8;
}

function getManaDie(character) {
  return character.magic.type === "Sense" ? 10 : 8;
}

function cleanResources(character) {
  character.hp.max = Math.max(0, Number(character.hp.max) || 0);
  character.mana.max = Math.max(0, Number(character.mana.max) || 0);
  character.hp.current = clamp(Number(character.hp.current) || 0, 0, character.hp.max);
  character.mana.current = clamp(Number(character.mana.current) || 0, 0, character.mana.max);
}

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveRemoteState, 250);
}

async function loadRemoteState() {
  try {
    const response = await fetch(API_STATE, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load server state.");

    const data = await response.json();
    state = normalizeState(data);
    lastSavedString = JSON.stringify(state);
    els.syncStatus.textContent = "Synced";
    render();
  } catch (error) {
    console.error(error);
    els.syncStatus.textContent = "Sync failed";
    state = normalizeState(state);
    render();
  } finally {
    isLoading = false;
  }
}

async function saveRemoteState() {
  if (isLoading) return;

  const payload = JSON.stringify(state);
  lastSavedString = payload;

  try {
    const response = await fetch(API_STATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload
    });

    if (!response.ok) throw new Error("Could not save.");
    els.syncStatus.textContent = "Synced";
  } catch (error) {
    console.error(error);
    els.syncStatus.textContent = "Save failed";
  }
}

async function pollRemoteState() {
  const active = document.activeElement;
  const editing = active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName);
  if (editing) return;

  try {
    const response = await fetch(API_STATE, { cache: "no-store" });
    if (!response.ok) return;

    const data = await response.json();
    const normalizedRemote = normalizeState(data);
    const remoteString = JSON.stringify(normalizedRemote);

    if (remoteString !== lastSavedString) {
      state = normalizedRemote;
      lastSavedString = remoteString;
      render();
    }
  } catch {
    els.syncStatus.textContent = "Sync paused";
  }
}

function applyTheme() {
  const theme = { ...DEFAULT_THEME, ...(state.theme || {}) };
  document.documentElement.style.setProperty("--bg", theme.bg);
  document.documentElement.style.setProperty("--card", theme.card);
  document.documentElement.style.setProperty("--accent", theme.accent);
  document.documentElement.style.setProperty("--mana", theme.mana);
  document.documentElement.style.setProperty("--text", theme.text);
  document.documentElement.style.setProperty("--card-soft", theme.soft);
}

function renderLevelDropdown() {
  const current = String(getCharacter().level || 1);
  els.charLevel.innerHTML = "";

  for (let i = 1; i <= 20; i++) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = `Level ${i}`;
    els.charLevel.appendChild(option);
  }

  els.charLevel.value = current;
}

function renderCharacterList() {
  els.characterList.innerHTML = "";

  const visible = state.characters.filter((character) => {
    if (character.state === "dead") return state.showDead;
    if (character.state === "reserve") return state.showReserve;
    return true;
  });

  if (!visible.length) {
    els.characterList.innerHTML = `<div class="hint">No visible characters.</div>`;
    return;
  }

  visible.forEach((character, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `character-chip ${character.id === state.selectedCharacterId ? "active" : ""} ${character.state}`;
    button.innerHTML = `
      <strong>${escapeHtml(character.name || `Character ${index + 1}`)}</strong>
      <span>${escapeHtml(character.className || "No class")} • Level ${escapeHtml(character.level || 1)}</span>
    `;

    button.addEventListener("click", () => {
      state.selectedCharacterId = character.id;
      scheduleSave();
      render();
    });

    els.characterList.appendChild(button);
  });

  els.toggleReserveBtn.textContent = state.showReserve ? "Hide Reserve" : "Show Reserve";
  els.toggleDeadBtn.textContent = state.showDead ? "Hide Dead" : "Show Dead";
}

function renderHeader() {
  const c = getCharacter();
  const pb = getProficiencyBonus(c.level);

  els.sideSelectedName.textContent = c.name || "Unnamed";
  els.sideSelectedState.textContent = c.state;
  els.sideSelectedLevel.textContent = c.level;
  els.sideSelectedProf.textContent = formatMod(pb);
  els.topHp.textContent = `${c.hp.current} / ${c.hp.max}`;
  els.topMana.textContent = `${c.mana.current} / ${c.mana.max}`;
  els.topAc.textContent = c.armorClass;
  els.topProf.textContent = formatMod(pb);
}

function renderOverview() {
  const c = getCharacter();

  els.charName.value = c.name;
  els.charClass.value = c.className;
  els.charRace.value = c.race;
  els.charBackground.value = c.background;
  els.charAge.value = c.age;
  els.charVibe.value = c.vibe;
  els.currentHp.value = c.hp.current;
  els.maxHp.value = c.hp.max;
  els.currentMana.value = c.mana.current;
  els.maxMana.value = c.mana.max;
  els.armorClass.value = c.armorClass;
  els.speed.value = c.speed;
  els.initiative.value = c.initiative;
  els.hpText.textContent = `${c.hp.current} / ${c.hp.max}`;
  els.manaText.textContent = `${c.mana.current} / ${c.mana.max}`;
  els.backstory.value = c.backstory;

  const hpPercent = c.hp.max > 0 ? clamp((c.hp.current / c.hp.max) * 100, 0, 100) : 0;
  const manaPercent = c.mana.max > 0 ? clamp((c.mana.current / c.mana.max) * 100, 0, 100) : 0;
  els.hpBar.style.width = `${hpPercent}%`;
  els.manaBar.style.width = `${manaPercent}%`;

  renderPortrait();
  renderLevelBenefits();
}

function renderPortrait() {
  const c = getCharacter();
  if (!c.image) {
    els.portraitPreview.innerHTML = `<span>No Image</span>`;
    return;
  }

  els.portraitPreview.innerHTML = `<img src="${escapeHtml(c.image)}" alt="Character image" />`;
}

function renderLevelBenefits() {
  const c = getCharacter();
  const level = Number(c.level) || 1;
  const pb = getProficiencyBonus(level);

  const benefits = [
    `Proficiency Bonus: ${formatMod(pb)}`,
    `Hit Point Die: 1d${getHpDie(c)} + CON modifier`,
    `Mana Pool Die: 1d${getManaDie(c)} + ${c.magic.ability} modifier`,
    "Class Feature: usually gained at this level, depending on class."
  ];

  if ([4, 8, 12, 16, 19].includes(level)) benefits.push("Ability Score Improvement or Feat.");
  if ([5, 11, 17].includes(level)) benefits.push("Major power spike level for many DnD classes.");
  if (level === 20) benefits.push("Level 20 capstone feature for most classes.");

  els.levelBenefits.innerHTML = benefits.map((benefit) => {
    return `<div class="level-benefit">${escapeHtml(benefit)}</div>`;
  }).join("");
}

function renderStats() {
  const c = getCharacter();

  els.statsGrid.innerHTML = STATS.map((stat) => {
    const score = c.stats[stat];
    const mod = getModifier(score);
    return `
      <div class="stat-card">
        <h3>${stat}</h3>
        <input type="number" data-stat="${stat}" value="${escapeHtml(score)}" />
        <div class="stat-mod">${formatMod(mod)}</div>
      </div>
    `;
  }).join("");

  els.statsGrid.querySelectorAll("input[data-stat]").forEach((input) => {
    input.addEventListener("input", (event) => {
      c.stats[event.target.dataset.stat] = Number(event.target.value) || 0;
      scheduleSave();
      renderStats();
      renderSkills();
      renderMagic();
      renderLevelBenefits();
    });
  });
}

function renderSkills() {
  const c = getCharacter();

  els.skillsGrid.innerHTML = SKILLS.map((skill) => {
    const data = c.skills[skill.name] || { proficient: false, expertise: false };
    const total = getSkillTotal(c, skill.name);
    const displayName = skill.name.includes("Saving Throw") ? "Saving Throw" : skill.name;

    return `
      <div class="skill-row">
        <div class="skill-main">
          <strong>${escapeHtml(displayName)}</strong>
          <span>${escapeHtml(skill.type)} • ${escapeHtml(skill.stat)}</span>
        </div>
        <button type="button" class="orb prof ${data.proficient ? "active" : ""}" title="Proficiency" data-skill="${escapeHtml(skill.name)}" data-kind="proficient"></button>
        <button type="button" class="orb exp ${data.expertise ? "active" : ""}" title="Expertise" data-skill="${escapeHtml(skill.name)}" data-kind="expertise"></button>
        <div class="skill-total">${formatMod(total)}</div>
      </div>
    `;
  }).join("");

  els.skillsGrid.querySelectorAll(".orb").forEach((orb) => {
    orb.addEventListener("click", () => {
      const skillName = orb.dataset.skill;
      const kind = orb.dataset.kind;

      c.skills[skillName] ||= { proficient: false, expertise: false };

      if (kind === "proficient") {
        c.skills[skillName].proficient = !c.skills[skillName].proficient;
        if (!c.skills[skillName].proficient) c.skills[skillName].expertise = false;
      }

      if (kind === "expertise") {
        c.skills[skillName].expertise = !c.skills[skillName].expertise;
        if (c.skills[skillName].expertise) c.skills[skillName].proficient = true;
      }

      scheduleSave();
      renderSkills();
    });
  });
}

function renderMagic() {
  const c = getCharacter();
  const rule = getMagicRule(c);

  els.magicName.value = c.magic.name;
  els.magicType.value = c.magic.type;
  els.magicDescription.value = c.magic.description;
  els.magicAbility.innerHTML = rule.abilities.map((ability) => `<option value="${ability}">${ability}</option>`).join("");

  if (!rule.abilities.includes(c.magic.ability)) c.magic.ability = rule.abilities[0];
  els.magicAbility.value = c.magic.ability;

  const abilityMod = getModifier(c.stats[c.magic.ability]);
  const pb = getProficiencyBonus(c.level);

  els.magicEffectBox.innerHTML = `
    <div class="effect-card">
      <strong>${escapeHtml(rule.title)}</strong>
      <div>${escapeHtml(rule.effect)}</div>
    </div>
    <div class="effect-card">
      <strong>Spell Checks / Spell Attacks</strong>
      <div>d20 + ${escapeHtml(c.magic.ability)} (${formatMod(abilityMod)}) + PB (${formatMod(pb)}) = ${formatMod(abilityMod + pb)}</div>
    </div>
    <div class="effect-card">
      <strong>Resource Rolls</strong>
      <div>HP Roll: 1d${getHpDie(c)} + CON modifier</div>
      <div>Mana Roll: 1d${getManaDie(c)} + ${escapeHtml(c.magic.ability)} modifier</div>
    </div>
  `;
}

function renderSpells() {
  const c = getCharacter();
  if (!Array.isArray(c.magic.spells)) c.magic.spells = [];

  if (!c.magic.spells.length) {
    els.spellList.innerHTML = `<div class="hint">No spells added yet.</div>`;
    return;
  }

  els.spellList.innerHTML = c.magic.spells.map((spell) => {
    return `
      <div class="spell-card">
        <div class="spell-top">
          <div>
            <strong>${escapeHtml(spell.name)}</strong>
            <span>Cost: ${escapeHtml(spell.cost)} Mana</span>
          </div>
          <div class="spell-actions">
            <button type="button" class="btn mana-btn" data-use-spell="${escapeHtml(spell.id)}">Use</button>
            <button type="button" class="btn danger" data-delete-spell="${escapeHtml(spell.id)}">Delete</button>
          </div>
        </div>
        <div class="spell-effect">${escapeHtml(spell.effect || "No effect written.")}</div>
      </div>
    `;
  }).join("");

  els.spellList.querySelectorAll("[data-use-spell]").forEach((button) => {
    button.addEventListener("click", () => useSpell(button.dataset.useSpell));
  });

  els.spellList.querySelectorAll("[data-delete-spell]").forEach((button) => {
    button.addEventListener("click", () => deleteSpell(button.dataset.deleteSpell));
  });
}

function addSpell() {
  const c = getCharacter();
  const name = els.spellNameInput.value.trim();
  const cost = Math.max(0, Number(els.spellCostInput.value) || 0);
  const effect = els.spellEffectInput.value.trim();

  if (!name) {
    alert("Give the spell a name first.");
    return;
  }

  if (!effect) {
    alert("Write what the spell does first.");
    return;
  }

  c.magic.spells.push({
    id: `spell-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    cost,
    effect
  });

  els.spellNameInput.value = "";
  els.spellCostInput.value = "";
  els.spellEffectInput.value = "";

  scheduleSave();
  renderSpells();
}

function useSpell(spellId) {
  const c = getCharacter();
  const spell = c.magic.spells.find((item) => item.id === spellId);
  if (!spell) return;

  const cost = Math.max(0, Number(spell.cost) || 0);

  if (c.mana.current < cost) {
    alert(`Not enough Mana. You need ${cost}, but you only have ${c.mana.current}.`);
    return;
  }

  c.mana.current -= cost;
  cleanResources(c);
  scheduleSave();
  render();
  alert(`${spell.name} used. ${cost} Mana spent.`);
}

function deleteSpell(spellId) {
  const c = getCharacter();
  const spell = c.magic.spells.find((item) => item.id === spellId);
  if (!spell) return;
  if (!confirm(`Delete ${spell.name}?`)) return;

  c.magic.spells = c.magic.spells.filter((item) => item.id !== spellId);
  scheduleSave();
  renderSpells();
}

function rollSpellCheck() {
  const c = getCharacter();
  const abilityMod = getModifier(c.stats[c.magic.ability]);
  const pb = getProficiencyBonus(c.level);
  const roll = rollDie(20);
  const total = roll + abilityMod + pb;
  alert(`Spell Check: d20 (${roll}) + ${c.magic.ability} (${formatMod(abilityMod)}) + PB (${formatMod(pb)}) = ${total}`);
}

function renderWeaponCatalogue() {
  els.weaponCatalogue.innerHTML = WEAPONS.map((weapon, index) => {
    return `
      <div class="weapon-card">
        <div class="weapon-top">
          <strong>${escapeHtml(weapon.name)}</strong>
          <button type="button" class="btn primary" data-add-weapon="${index}">Add</button>
        </div>
        <div class="weapon-meta">
          <span class="pill">${escapeHtml(weapon.category)}</span>
          <span class="pill">${escapeHtml(weapon.damage)}</span>
          <span class="pill">${escapeHtml(weapon.stat)}</span>
        </div>
        <div class="hint">${escapeHtml(weapon.properties)}</div>
      </div>
    `;
  }).join("");

  els.weaponCatalogue.querySelectorAll("[data-add-weapon]").forEach((button) => {
    button.addEventListener("click", () => addWeapon(Number(button.dataset.addWeapon)));
  });
}

function renderCharacterWeapons() {
  const c = getCharacter();

  if (!c.weapons.length) {
    els.characterWeapons.innerHTML = `<div class="hint">No weapons added yet.</div>`;
    return;
  }

  els.characterWeapons.innerHTML = c.weapons.map((weapon) => {
    return `
      <div class="weapon-card">
        <div class="weapon-top">
          <strong>${escapeHtml(weapon.name)}</strong>
          <button type="button" class="btn danger" data-delete-weapon="${escapeHtml(weapon.id)}">Delete</button>
        </div>
        <div class="weapon-meta">
          <span class="pill">${escapeHtml(weapon.category)}</span>
          <span class="pill">${escapeHtml(weapon.damage)}</span>
          <span class="pill">${escapeHtml(weapon.stat)}</span>
        </div>
        <div class="hint">${escapeHtml(weapon.properties)}</div>
        <textarea class="weapon-notes" data-weapon-notes="${escapeHtml(weapon.id)}" placeholder="Weapon notes, upgrades, ammo, special effects...">${escapeHtml(weapon.notes || "")}</textarea>
      </div>
    `;
  }).join("");

  els.characterWeapons.querySelectorAll("[data-delete-weapon]").forEach((button) => {
    button.addEventListener("click", () => deleteWeapon(button.dataset.deleteWeapon));
  });

  els.characterWeapons.querySelectorAll("[data-weapon-notes]").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      const weapon = c.weapons.find((item) => item.id === textarea.dataset.weaponNotes);
      if (!weapon) return;
      weapon.notes = textarea.value;
      scheduleSave();
    });
  });
}

function addWeapon(index) {
  const c = getCharacter();
  const baseWeapon = WEAPONS[index];
  if (!baseWeapon) return;

  c.weapons.push({
    id: `weapon-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ...baseWeapon,
    notes: ""
  });

  scheduleSave();
  renderCharacterWeapons();
}

function deleteWeapon(weaponId) {
  const c = getCharacter();
  c.weapons = c.weapons.filter((weapon) => weapon.id !== weaponId);
  scheduleSave();
  renderCharacterWeapons();
}

function renderTextAreas() {
  const c = getCharacter();
  els.inventoryText.value = c.inventoryText;
  els.notesText.value = c.notesText;
}

function renderThemeInputs() {
  const theme = { ...DEFAULT_THEME, ...(state.theme || {}) };
  els.themeBg.value = theme.bg;
  els.themeCard.value = theme.card;
  els.themeAccent.value = theme.accent;
  els.themeMana.value = theme.mana;
  els.themeText.value = theme.text;
  els.themeSoft.value = theme.soft;
}

function renderTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === state.activeTab);
  });

  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `tab-${state.activeTab}`);
  });
}

function render() {
  const c = getCharacter();
  cleanResources(c);
  applyTheme();
  renderLevelDropdown();
  renderCharacterList();
  renderHeader();
  renderOverview();
  renderStats();
  renderSkills();
  renderMagic();
  renderSpells();
  renderWeaponCatalogue();
  renderCharacterWeapons();
  renderTextAreas();
  renderThemeInputs();
  renderTabs();
}

function updateCharacterField(field, value) {
  const c = getCharacter();

  if (field === "name") c.name = value;
  if (field === "className") c.className = value;
  if (field === "race") c.race = value;
  if (field === "background") c.background = value;
  if (field === "age") c.age = value;
  if (field === "vibe") c.vibe = value;
  if (field === "level") c.level = clamp(Number(value) || 1, 1, 20);
  if (field === "currentHp") c.hp.current = Math.max(0, Number(value) || 0);
  if (field === "maxHp") c.hp.max = Math.max(0, Number(value) || 0);
  if (field === "currentMana") c.mana.current = Math.max(0, Number(value) || 0);
  if (field === "maxMana") c.mana.max = Math.max(0, Number(value) || 0);
  if (field === "armorClass") c.armorClass = Math.max(0, Number(value) || 0);
  if (field === "speed") c.speed = value;
  if (field === "initiative") c.initiative = value;
  if (field === "backstory") c.backstory = value;
  if (field === "inventoryText") c.inventoryText = value;
  if (field === "notesText") c.notesText = value;

  cleanResources(c);
  scheduleSave();
  renderHeader();
  renderCharacterList();
  renderLevelBenefits();
  renderOverview();
}

function rollHp() {
  const c = getCharacter();
  const die = getHpDie(c);
  const conMod = getModifier(c.stats.CON);
  const roll = rollDie(die);
  const gained = Math.max(1, roll + conMod);

  c.hp.max += gained;
  c.hp.current = c.hp.max;
  scheduleSave();
  render();
  alert(`HP Roll: d${die} (${roll}) + CON (${formatMod(conMod)}) = +${gained} HP`);
}

function rollMana() {
  const c = getCharacter();
  const die = getManaDie(c);
  const ability = c.magic.ability;
  const abilityMod = getModifier(c.stats[ability]);
  const roll = rollDie(die);
  const gained = Math.max(1, roll + abilityMod);

  c.mana.max += gained;
  c.mana.current = c.mana.max;
  scheduleSave();
  render();
  alert(`Mana Roll: d${die} (${roll}) + ${ability} (${formatMod(abilityMod)}) = +${gained} Mana`);
}

function restoreHp() {
  const c = getCharacter();
  c.hp.current = c.hp.max;
  scheduleSave();
  render();
}

function restoreMana() {
  const c = getCharacter();
  c.mana.current = c.mana.max;
  scheduleSave();
  render();
}

function addCharacter() {
  const newCharacter = createBlankCharacter(state.characters.length);
  newCharacter.state = "reserve";
  state.characters.push(newCharacter);
  state.selectedCharacterId = newCharacter.id;
  state.showReserve = true;
  scheduleSave();
  render();
}

function setCharacterState(newState) {
  const c = getCharacter();
  c.state = newState;

  if (newState === "dead") {
    c.hp.current = 0;
    c.mana.current = 0;
  }

  scheduleSave();
  render();
}

function deleteCharacter() {
  if (state.characters.length <= 1) {
    alert("You need at least one character.");
    return;
  }

  const c = getCharacter();
  const name = c.name || "this character";
  if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

  state.characters = state.characters.filter((character) => character.id !== c.id);
  state.selectedCharacterId = state.characters[0].id;
  scheduleSave();
  render();
}

function saveImageUrl() {
  const c = getCharacter();
  const url = els.imageUrlInput.value.trim();

  if (!url) {
    alert("Paste an image URL first.");
    return;
  }

  c.image = url;
  els.imageUrlInput.value = "";
  scheduleSave();
  renderPortrait();
}

function uploadImage(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const c = getCharacter();
    c.image = reader.result;
    scheduleSave();
    renderPortrait();
  };
  reader.readAsDataURL(file);
}

function clearImage() {
  const c = getCharacter();
  c.image = "";
  scheduleSave();
  renderPortrait();
}

function updateMagicField(field, value) {
  const c = getCharacter();

  if (field === "name") c.magic.name = value;

  if (field === "type") {
    c.magic.type = value;
    const rule = getMagicRule(c);
    if (!rule.abilities.includes(c.magic.ability)) c.magic.ability = rule.abilities[0];
  }

  if (field === "ability") c.magic.ability = value;
  if (field === "description") c.magic.description = value;

  scheduleSave();
  renderMagic();
  renderLevelBenefits();
}

function saveTheme() {
  state.theme = {
    bg: els.themeBg.value,
    card: els.themeCard.value,
    accent: els.themeAccent.value,
    mana: els.themeMana.value,
    text: els.themeText.value,
    soft: els.themeSoft.value
  };

  scheduleSave();
  render();
}

function resetTheme() {
  state.theme = null;
  scheduleSave();
  render();
}

function exportSave() {
  try {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

    link.href = url;
    link.download = `mana-dnd-save-${date}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Export failed.");
  }
}

function importSave(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);

      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.characters)) {
        alert("That is not a valid save file.");
        return;
      }

      state = normalizeState(parsed);
      lastSavedString = JSON.stringify(state);
      scheduleSave();
      render();
      alert("Save imported.");
    } catch (error) {
      console.error(error);
      alert("Import failed. That file is not valid JSON.");
    }
  };

  reader.onerror = () => alert("Could not read that file.");
  reader.readAsText(file);
}

function bindEvents() {
  els.addCharacterBtn.addEventListener("click", addCharacter);

  els.toggleReserveBtn.addEventListener("click", () => {
    state.showReserve = !state.showReserve;
    scheduleSave();
    renderCharacterList();
  });

  els.toggleDeadBtn.addEventListener("click", () => {
    state.showDead = !state.showDead;
    scheduleSave();
    renderCharacterList();
  });

  els.exportBtn.addEventListener("click", exportSave);

  els.importBtn.addEventListener("click", () => els.importInput.click());

  els.importInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    importSave(file);
    event.target.value = "";
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.activeTab = tab.dataset.tab;
      scheduleSave();
      renderTabs();
    });
  });

  els.charName.addEventListener("input", (event) => updateCharacterField("name", event.target.value));
  els.charLevel.addEventListener("change", (event) => updateCharacterField("level", event.target.value));
  els.charClass.addEventListener("input", (event) => updateCharacterField("className", event.target.value));
  els.charRace.addEventListener("input", (event) => updateCharacterField("race", event.target.value));
  els.charBackground.addEventListener("input", (event) => updateCharacterField("background", event.target.value));
  els.charAge.addEventListener("input", (event) => updateCharacterField("age", event.target.value));
  els.charVibe.addEventListener("input", (event) => updateCharacterField("vibe", event.target.value));
  els.currentHp.addEventListener("input", (event) => updateCharacterField("currentHp", event.target.value));
  els.maxHp.addEventListener("input", (event) => updateCharacterField("maxHp", event.target.value));
  els.currentMana.addEventListener("input", (event) => updateCharacterField("currentMana", event.target.value));
  els.maxMana.addEventListener("input", (event) => updateCharacterField("maxMana", event.target.value));
  els.armorClass.addEventListener("input", (event) => updateCharacterField("armorClass", event.target.value));
  els.speed.addEventListener("input", (event) => updateCharacterField("speed", event.target.value));
  els.initiative.addEventListener("input", (event) => updateCharacterField("initiative", event.target.value));
  els.backstory.addEventListener("input", (event) => updateCharacterField("backstory", event.target.value));
  els.inventoryText.addEventListener("input", (event) => updateCharacterField("inventoryText", event.target.value));
  els.notesText.addEventListener("input", (event) => updateCharacterField("notesText", event.target.value));

  els.rollHpBtn.addEventListener("click", rollHp);
  els.rollManaBtn.addEventListener("click", rollMana);
  els.restoreHpBtn.addEventListener("click", restoreHp);
  els.restoreManaBtn.addEventListener("click", restoreMana);
  els.saveImageUrlBtn.addEventListener("click", saveImageUrl);
  els.uploadImageBtn.addEventListener("click", () => els.imageUploadInput.click());
  els.imageUploadInput.addEventListener("change", (event) => {
    uploadImage(event.target.files?.[0]);
    event.target.value = "";
  });
  els.clearImageBtn.addEventListener("click", clearImage);

  els.magicName.addEventListener("input", (event) => updateMagicField("name", event.target.value));
  els.magicType.addEventListener("change", (event) => updateMagicField("type", event.target.value));
  els.magicAbility.addEventListener("change", (event) => updateMagicField("ability", event.target.value));
  els.magicDescription.addEventListener("input", (event) => updateMagicField("description", event.target.value));
  els.spellCheckBtn.addEventListener("click", rollSpellCheck);
  els.addSpellBtn.addEventListener("click", addSpell);

  els.saveThemeBtn.addEventListener("click", saveTheme);
  els.resetThemeBtn.addEventListener("click", resetTheme);
  els.setActiveBtn.addEventListener("click", () => setCharacterState("active"));
  els.setReserveBtn.addEventListener("click", () => setCharacterState("reserve"));
  els.setDeadBtn.addEventListener("click", () => setCharacterState("dead"));
  els.deleteCharacterBtn.addEventListener("click", deleteCharacter);
}

bindEvents();
loadRemoteState();
setInterval(pollRemoteState, 3000);
