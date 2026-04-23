const STORAGE_KEY = "rwby-dnd-local-v1";
const DM_PASSWORD = "123456789";

const STAT_ORDER = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

const DUST_TYPES = [
    "Fire Dust",
    "Ice Dust",
    "Electricity Dust",
    "Wind Dust",
    "Earth Dust",
    "Gravity Dust",
    "Hard Light Dust"
];

const DUST_CLASS_MAP = {
    "Fire Dust": "dust-fire",
    "Ice Dust": "dust-ice",
    "Electricity Dust": "dust-electricity",
    "Wind Dust": "dust-wind",
    "Earth Dust": "dust-earth",
    "Gravity Dust": "dust-gravity",
    "Hard Light Dust": "dust-hardlight"
};

const SKILL_MAP = {
    STR: ["STR Saving Throw", "Athletics"],
    DEX: ["DEX Saving Throw", "Acrobatics", "Sleight of Hand", "Stealth"],
    CON: ["CON Saving Throw", "Endurance"],
    INT: ["INT Saving Throw", "Aura Mastery", "History", "Investigation", "Nature", "Religion"],
    WIS: ["WIS Saving Throw", "Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
    CHA: ["CHA Saving Throw", "Deception", "Intimidation", "Performance", "Persuasion"]
};

function makeBlankSkills() {
    const skills = {};
    Object.entries(SKILL_MAP).forEach(([stat, list]) => {
        list.forEach((skill) => {
            skills[skill] = { stat, bonus: 0 };
        });
    });
    return skills;
}

function blankStage() {
    return {
        active: "",
        activeDescription: "",
        passiveName: "",
        passiveDescription: "",
        auraCost: 0
    };
}

function blankCharacter(index) {
    const dustInventory = {};
    DUST_TYPES.forEach((type) => {
        dustInventory[type] = 0;
    });

    return {
        id: `char-${Date.now()}-${index}`,
        name: "",
        race: "",
        className: "",
        age: "",
        level: 1,
        background: "",
        semblanceName: "",
        proficiencyBonus: 2,
        state: index < 4 ? "active" : "reserve",
        stats: {
            STR: 10,
            DEX: 10,
            CON: 10,
            INT: 10,
            WIS: 10,
            CHA: 10
        },
        skills: makeBlankSkills(),
        hp: { current: 0, max: 0 },
        aura: { current: 0, max: 0 },
        armor: 0,
        initiative: "",
        speed: "",
        weaponsText: "",
        abilitiesText: "",
        inventoryText: "",
        notesText: "",
        dustInventory,
        dustSpells: [],
        techniques: [],
        semblance: {
            base: blankStage(),
            first: blankStage(),
            second: blankStage(),
            third: blankStage(),
            ascended: blankStage(),
            unlocked: {
                first: false,
                second: false,
                third: false,
                ascended: false
            }
        }
    };
}

const defaultState = {
    selectedCharacter: 0,
    activeTab: "skills",
    showReserve: false,
    showDead: false,
    characters: [
        blankCharacter(0),
        blankCharacter(1),
        blankCharacter(2),
        blankCharacter(3)
    ]
};

let state = loadState();
let dmUnlocked = false;

const els = {
    characterTabs: document.getElementById("characterTabs"),
    selectedNameSmall: document.getElementById("selectedNameSmall"),
    selectedState: document.getElementById("selectedState"),
    selectedAscendedStatus: document.getElementById("selectedAscendedStatus"),
    selectedTechniqueCount: document.getElementById("selectedTechniqueCount"),
    topCharacterName: document.getElementById("topCharacterName"),
    topHpMini: document.getElementById("topHpMini"),
    topAuraMini: document.getElementById("topAuraMini"),
    topArmorMini: document.getElementById("topArmorMini"),

    charName: document.getElementById("charName"),
    charLevel: document.getElementById("charLevel"),
    charRace: document.getElementById("charRace"),
    charClass: document.getElementById("charClass"),
    charAge: document.getElementById("charAge"),
    charBackground: document.getElementById("charBackground"),
    charSemblanceName: document.getElementById("charSemblanceName"),
    charPB: document.getElementById("charPB"),

    currentHp: document.getElementById("currentHp"),
    maxHp: document.getElementById("maxHp"),
    currentAura: document.getElementById("currentAura"),
    maxAura: document.getElementById("maxAura"),
    armor: document.getElementById("armor"),
    initiative: document.getElementById("initiative"),
    speed: document.getElementById("speed"),

    hpDisplay: document.getElementById("hpDisplay"),
    auraDisplay: document.getElementById("auraDisplay"),
    hpBar: document.getElementById("hpBar"),
    auraBar: document.getElementById("auraBar"),

    statsGrid: document.getElementById("statsGrid"),
    semblanceStages: document.getElementById("semblanceStages"),
    skillsMatrix: document.getElementById("skillsMatrix"),

    weaponsText: document.getElementById("weaponsText"),
    abilitiesText: document.getElementById("abilitiesText"),
    inventoryText: document.getElementById("inventoryText"),
    notesText: document.getElementById("notesText"),

    grantedTechniques: document.getElementById("grantedTechniques"),

    dustInventoryGrid: document.getElementById("dustInventoryGrid"),
    dustSpellName: document.getElementById("dustSpellName"),
    dustSpellType: document.getElementById("dustSpellType"),
    dustSpellDescription: document.getElementById("dustSpellDescription"),
    addDustSpellBtn: document.getElementById("addDustSpellBtn"),
    dustSpellList: document.getElementById("dustSpellList"),

    dmTechName: document.getElementById("dmTechName"),
    dmTechLevel: document.getElementById("dmTechLevel"),
    dmTechCost: document.getElementById("dmTechCost"),
    dmTechType: document.getElementById("dmTechType"),
    dmTechDescription: document.getElementById("dmTechDescription"),
    createTechniqueBtn: document.getElementById("createTechniqueBtn"),
    dmTechniqueDatabase: document.getElementById("dmTechniqueDatabase"),

    stateActive: document.getElementById("stateActive"),
    stateReserve: document.getElementById("stateReserve"),
    stateDead: document.getElementById("stateDead"),
    saveCharacterStateBtn: document.getElementById("saveCharacterStateBtn"),

    dmBaseActive: document.getElementById("dmBaseActive"),
    dmBaseActiveDesc: document.getElementById("dmBaseActiveDesc"),
    dmBasePassiveName: document.getElementById("dmBasePassiveName"),
    dmBasePassiveDesc: document.getElementById("dmBasePassiveDesc"),
    dmBaseCost: document.getElementById("dmBaseCost"),

    dmFirstActive: document.getElementById("dmFirstActive"),
    dmFirstActiveDesc: document.getElementById("dmFirstActiveDesc"),
    dmFirstPassiveName: document.getElementById("dmFirstPassiveName"),
    dmFirstPassiveDesc: document.getElementById("dmFirstPassiveDesc"),
    dmFirstCost: document.getElementById("dmFirstCost"),

    dmSecondActive: document.getElementById("dmSecondActive"),
    dmSecondActiveDesc: document.getElementById("dmSecondActiveDesc"),
    dmSecondPassiveName: document.getElementById("dmSecondPassiveName"),
    dmSecondPassiveDesc: document.getElementById("dmSecondPassiveDesc"),
    dmSecondCost: document.getElementById("dmSecondCost"),

    dmThirdActive: document.getElementById("dmThirdActive"),
    dmThirdActiveDesc: document.getElementById("dmThirdActiveDesc"),
    dmThirdPassiveName: document.getElementById("dmThirdPassiveName"),
    dmThirdPassiveDesc: document.getElementById("dmThirdPassiveDesc"),
    dmThirdCost: document.getElementById("dmThirdCost"),

    dmAscendedActive: document.getElementById("dmAscendedActive"),
    dmAscendedActiveDesc: document.getElementById("dmAscendedActiveDesc"),
    dmAscendedPassiveName: document.getElementById("dmAscendedPassiveName"),
    dmAscendedPassiveDesc: document.getElementById("dmAscendedPassiveDesc"),
    dmAscendedCost: document.getElementById("dmAscendedCost"),

    unlockFirst: document.getElementById("unlockFirst"),
    unlockSecond: document.getElementById("unlockSecond"),
    unlockThird: document.getElementById("unlockThird"),
    unlockAscended: document.getElementById("unlockAscended"),
    saveSemblanceBtn: document.getElementById("saveSemblanceBtn"),

    rollHpBtn: document.getElementById("rollHpBtn"),
    rollAuraBtn: document.getElementById("rollAuraBtn"),
    restoreAuraBtn: document.getElementById("restoreAuraBtn"),
    restoreHpBtn: document.getElementById("restoreHpBtn"),

    addCharacterBtn: document.getElementById("addCharacterBtn"),
    deleteCharacterBtn: document.getElementById("deleteCharacterBtn"),
    toggleReserveBtn: document.getElementById("toggleReserveBtn"),
    toggleDeadBtn: document.getElementById("toggleDeadBtn"),

    openDmOverlayBtn: document.getElementById("openDmOverlayBtn"),
    dmOverlay: document.getElementById("dmOverlay"),
    dmLoginPanel: document.getElementById("dmLoginPanel"),
    dmFullscreenPanel: document.getElementById("dmFullscreenPanel"),
    dmPasswordInput: document.getElementById("dmPasswordInput"),
    dmLoginBtn: document.getElementById("dmLoginBtn"),
    dmCloseBtn: document.getElementById("dmCloseBtn"),
    dmCloseFullBtn: document.getElementById("dmCloseFullBtn"),
    dmLogoutBtn: document.getElementById("dmLogoutBtn"),
    dmSelectedCharacterName: document.getElementById("dmSelectedCharacterName"),

    exportDataBtn: document.getElementById("exportDataBtn"),
    importDataBtn: document.getElementById("importDataBtn"),
    importDataInput: document.getElementById("importDataInput"),
};

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return structuredClone(defaultState);

        const loaded = JSON.parse(raw);
        return normalizeState(loaded);
    } catch (err) {
        console.error("Failed to load local state:", err);
        return structuredClone(defaultState);
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
        console.error("Failed to save local state:", err);
    }
}

function normalizeState(loaded) {
    const merged = structuredClone(defaultState);
    Object.assign(merged, loaded || {});

    merged.characters = (loaded?.characters?.length ? loaded.characters : defaultState.characters).map((character, index) => {
        const base = blankCharacter(index);
        const mergedChar = { ...base, ...character };

        mergedChar.stats = { ...base.stats, ...(character.stats || {}) };
        mergedChar.hp = { ...base.hp, ...(character.hp || {}) };
        mergedChar.aura = { ...base.aura, ...(character.aura || {}) };
        mergedChar.dustInventory = { ...base.dustInventory, ...(character.dustInventory || {}) };
        mergedChar.skills = { ...base.skills, ...(character.skills || {}) };
        mergedChar.dustSpells = Array.isArray(character.dustSpells) ? character.dustSpells : [];
        mergedChar.techniques = Array.isArray(character.techniques) ? character.techniques : [];
        mergedChar.semblance = {
            ...base.semblance,
            ...(character.semblance || {}),
            base: { ...base.semblance.base, ...(character.semblance?.base || {}) },
            first: { ...base.semblance.first, ...(character.semblance?.first || {}) },
            second: { ...base.semblance.second, ...(character.semblance?.second || {}) },
            third: { ...base.semblance.third, ...(character.semblance?.third || {}) },
            ascended: { ...base.semblance.ascended, ...(character.semblance?.ascended || {}) },
            unlocked: { ...base.semblance.unlocked, ...(character.semblance?.unlocked || {}) }
        };

        return mergedChar;
    });

    if (merged.selectedCharacter >= merged.characters.length) {
        merged.selectedCharacter = Math.max(0, merged.characters.length - 1);
    }

    return merged;
}

function getCharacter() {
    return state.characters[state.selectedCharacter] || state.characters[0];
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function modifierFromScore(score) {
    return Math.floor((Number(score) - 10) / 2);
}

function formatModifier(mod) {
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

function rollD10() {
    return Math.floor(Math.random() * 10) + 1;
}

function ensureCurrentWithinMax(character) {
    character.hp.max = Math.max(0, Number(character.hp.max) || 0);
    character.aura.max = Math.max(0, Number(character.aura.max) || 0);
    character.hp.current = clamp(Number(character.hp.current) || 0, 0, character.hp.max);
    character.aura.current = clamp(Number(character.aura.current) || 0, 0, character.aura.max);
}

function visibleCharacters() {
    return state.characters.filter((character) => {
        if (character.state === "dead") return state.showDead;
        if (character.state === "reserve") return state.showReserve;
        return true;
    });
}

function stageLocked(stageKey, character) {
    if (stageKey === "base") return false;
    return !character.semblance.unlocked[stageKey];
}

function stageTitle(stageKey) {
    return {
        base: "Base",
        first: "First Evolution",
        second: "Second Evolution",
        third: "Third Evolution",
        ascended: "Ascended"
    }[stageKey];
}

function renderCharacterTabs() {
    els.characterTabs.innerHTML = "";
    const visible = visibleCharacters();

    if (!visible.length) {
        els.characterTabs.innerHTML = `<div class="character-tab"><strong>No characters visible</strong><span>Toggle reserve or dead to see more.</span></div>`;
        return;
    }

    visible.forEach((character) => {
        const actualIndex = state.characters.findIndex((c) => c.id === character.id);
        const tab = document.createElement("div");
        tab.className = `character-tab ${actualIndex === state.selectedCharacter ? "active" : ""} ${character.state}`;
        tab.innerHTML = `
      <strong>${character.name || `Character ${actualIndex + 1}`}</strong>
      <span>${character.semblanceName || "No Semblance Set"}</span>
    `;
        tab.addEventListener("click", () => {
            state.selectedCharacter = actualIndex;
            saveState();
            render();
        });
        els.characterTabs.appendChild(tab);
    });
}

function renderHeader() {
    const c = getCharacter();
    els.selectedNameSmall.textContent = c.name || `Character ${state.selectedCharacter + 1}`;
    els.topCharacterName.textContent = c.name || `Character ${state.selectedCharacter + 1}`;
    els.topHpMini.textContent = `${c.hp.current} / ${c.hp.max}`;
    els.topAuraMini.textContent = `${c.aura.current} / ${c.aura.max}`;
    els.topArmorMini.textContent = c.armor;
    els.selectedAscendedStatus.textContent = c.semblance.unlocked.ascended ? "Unlocked" : "Locked";
    els.selectedTechniqueCount.textContent = c.techniques.length;
    els.selectedState.textContent = c.state.charAt(0).toUpperCase() + c.state.slice(1);
    els.toggleReserveBtn.textContent = state.showReserve ? "Hide Reserve" : "Show Reserve";
    els.toggleDeadBtn.textContent = state.showDead ? "Hide Dead" : "Show Dead";
    els.dmSelectedCharacterName.textContent = c.name || `Character ${state.selectedCharacter + 1}`;
}

function renderMainFields() {
    const c = getCharacter();
    ensureCurrentWithinMax(c);

    els.charName.value = c.name;
    els.charLevel.value = c.level;
    els.charRace.value = c.race;
    els.charClass.value = c.className;
    els.charAge.value = c.age;
    els.charBackground.value = c.background;
    els.charSemblanceName.value = c.semblanceName;
    els.charPB.value = c.proficiencyBonus;

    els.currentHp.value = c.hp.current;
    els.maxHp.value = c.hp.max;
    els.currentAura.value = c.aura.current;
    els.maxAura.value = c.aura.max;
    els.armor.value = c.armor;
    els.initiative.value = c.initiative;
    els.speed.value = c.speed;

    els.weaponsText.value = c.weaponsText;
    els.abilitiesText.value = c.abilitiesText;
    els.inventoryText.value = c.inventoryText;
    els.notesText.value = c.notesText;

    els.hpDisplay.textContent = `${c.hp.current} / ${c.hp.max}`;
    els.auraDisplay.textContent = `${c.aura.current} / ${c.aura.max}`;

    const hpWidth = c.hp.max > 0 ? (c.hp.current / c.hp.max) * 100 : 0;
    const auraWidth = c.aura.max > 0 ? (c.aura.current / c.aura.max) * 100 : 0;
    els.hpBar.style.width = `${clamp(hpWidth, 0, 100)}%`;
    els.auraBar.style.width = `${clamp(auraWidth, 0, 100)}%`;
}

function renderStats() {
    const c = getCharacter();
    els.statsGrid.innerHTML = "";

    STAT_ORDER.forEach((stat) => {
        const score = c.stats[stat];
        const mod = modifierFromScore(score);

        const card = document.createElement("div");
        card.className = "stat-card";
        card.innerHTML = `
      <div class="stat-key">${stat}</div>
      <input class="stat-score-input" data-stat="${stat}" type="number" value="${score}" />
      <div class="stat-score">${score}</div>
      <div class="stat-mod">Modifier ${formatModifier(mod)}</div>
      <div class="stat-controls">
        <button data-stat="${stat}" data-action="minus">-</button>
        <button data-stat="${stat}" data-action="plus">+</button>
      </div>
    `;
        els.statsGrid.appendChild(card);
    });

    els.statsGrid.querySelectorAll(".stat-score-input").forEach((input) => {
        input.addEventListener("input", (e) => {
            const stat = e.target.dataset.stat;
            c.stats[stat] = Number(e.target.value) || 0;
            saveState();
            render();
        });
    });
}

function renderSkills() {
    const c = getCharacter();
    els.skillsMatrix.innerHTML = "";

    Object.entries(SKILL_MAP).forEach(([stat, skills]) => {
        const group = document.createElement("div");
        group.className = "skill-group";
        const statMod = modifierFromScore(c.stats[stat]);

        group.innerHTML = `
      <div class="skill-group-header">
        <strong>${stat}</strong>
        <span>Stat Modifier ${formatModifier(statMod)}</span>
      </div>
      <div class="skill-list"></div>
    `;

        const listEl = group.querySelector(".skill-list");

        skills.forEach((skillName) => {
            const skillData = c.skills[skillName] || { stat, bonus: 0 };
            const displayName = skillName.includes("Saving Throw") ? "Saving Throw" : skillName;

            const row = document.createElement("div");
            row.className = "skill-row";
            row.innerHTML = `
        <div class="skill-row-label">
          <strong>${displayName}</strong>
          <span>Falls under ${stat}</span>
        </div>
        <input type="number" data-skill="${skillName}" value="${skillData.bonus}" />
      `;
            listEl.appendChild(row);
        });

        els.skillsMatrix.appendChild(group);
    });

    els.skillsMatrix.querySelectorAll("input[data-skill]").forEach((input) => {
        input.addEventListener("input", (e) => {
            const skill = e.target.dataset.skill;
            c.skills[skill].bonus = Number(e.target.value) || 0;
            saveState();
        });
    });
}

function renderSemblanceStages() {
    const c = getCharacter();
    const keys = ["base", "first", "second", "third", "ascended"];
    els.semblanceStages.innerHTML = "";

    keys.forEach((key) => {
        const stage = c.semblance[key];
        const locked = stageLocked(key, c);

        const card = document.createElement("div");
        card.className = `sem-stage ${locked ? "stage-locked" : ""}`;
        card.innerHTML = `
      <details class="collapse-block" ${locked ? "" : "open"}>
        <summary class="collapse-summary">
          <div class="sem-stage-header">
            <div class="stage-name">${stageTitle(key)}</div>
            <div class="stage-status">${locked ? "Locked" : "Unlocked"}</div>
          </div>
        </summary>
        <div class="collapse-body">
          <div class="stage-lines">
            <div class="stage-line">
              <strong>${stage.active || "Active"}</strong>
              <div>${stage.activeDescription || "No active description yet."}</div>
            </div>
            <div class="stage-line">
              <strong>${stage.passiveName || "Passive"} [Passive]</strong>
              <div>${stage.passiveDescription || "No passive description yet."}</div>
            </div>
            <div class="stage-line">
              <strong>Aura Cost</strong>
              <div>${stage.auraCost || 0}</div>
            </div>
          </div>
          <div class="technique-actions">
            <button class="neo-btn small use-semblance-btn" data-stage="${key}" ${locked ? "disabled" : ""}>Use Active</button>
          </div>
        </div>
      </details>
    `;
        els.semblanceStages.appendChild(card);
    });

    els.semblanceStages.querySelectorAll(".use-semblance-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            useSemblanceStage(btn.dataset.stage);
        });
    });
}

function renderGrantedTechniques() {
    const c = getCharacter();
    els.grantedTechniques.innerHTML = "";

    if (!c.techniques.length) {
        els.grantedTechniques.innerHTML = `
      <div class="technique-card">
        <strong>No Aura Techniques.</strong>
        <div class="small-note">The DM needs to add them for this player.</div>
      </div>
    `;
        return;
    }

    c.techniques.forEach((tech) => {
        const card = document.createElement("div");
        card.className = "technique-card";
        card.innerHTML = `
      <details class="collapse-block">
        <summary class="collapse-summary">
          <div class="technique-top">
            <div><strong>${tech.name}</strong></div>
            <div class="technique-meta">
              <div class="meta-pill">Lvl ${tech.level}</div>
              <div class="meta-pill">Cost ${tech.cost}</div>
              <div class="meta-pill">${tech.type}</div>
            </div>
          </div>
        </summary>
        <div class="collapse-body">
          <div class="small-note">${tech.description}</div>
          <div class="technique-actions">
            <button class="neo-btn small use-tech-btn" data-tech-id="${tech.id}">Use Technique</button>
          </div>
        </div>
      </details>
    `;
        els.grantedTechniques.appendChild(card);
    });

    els.grantedTechniques.querySelectorAll(".use-tech-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            useTechnique(btn.dataset.techId);
        });
    });
}

function renderDustInventory() {
    const c = getCharacter();
    els.dustInventoryGrid.innerHTML = "";

    DUST_TYPES.forEach((type) => {
        const dustClass = DUST_CLASS_MAP[type];
        const amount = c.dustInventory[type] || 0;

        const card = document.createElement("div");
        card.className = `dust-card ${dustClass}`;
        card.innerHTML = `
      <label>${type}</label>
      <input type="number" min="0" data-dust-type="${type}" value="${amount}" />
    `;
        els.dustInventoryGrid.appendChild(card);
    });

    els.dustInventoryGrid.querySelectorAll("input[data-dust-type]").forEach((input) => {
        input.addEventListener("input", (e) => {
            const type = e.target.dataset.dustType;
            c.dustInventory[type] = Math.max(0, Number(e.target.value) || 0);
            saveState();
        });
    });

    els.dustSpellType.innerHTML = DUST_TYPES.map((type) => `<option value="${type}">${type}</option>`).join("");
}

function renderDustSpells() {
    const c = getCharacter();
    els.dustSpellList.innerHTML = "";

    if (!c.dustSpells.length) {
        els.dustSpellList.innerHTML = `<div class="technique-card"><strong>No Dust Spells created yet.</strong></div>`;
        return;
    }

    c.dustSpells.forEach((spell) => {
        const card = document.createElement("div");
        card.className = "technique-card";
        card.innerHTML = `
      <details class="collapse-block">
        <summary class="collapse-summary">
          <div class="technique-top">
            <div><strong>${spell.name}</strong></div>
            <div class="technique-meta">
              <div class="meta-pill">${spell.type}</div>
              <div class="meta-pill">Consumes 1</div>
            </div>
          </div>
        </summary>
        <div class="collapse-body">
          <div class="small-note">${spell.description}</div>
          <div class="dust-card-actions">
            <button class="neo-btn small use-dust-spell-btn" data-spell-id="${spell.id}">Use Spell</button>
            <button class="neo-btn small ghost delete-dust-spell-btn" data-spell-id="${spell.id}">Delete</button>
          </div>
        </div>
      </details>
    `;
        els.dustSpellList.appendChild(card);
    });

    els.dustSpellList.querySelectorAll(".use-dust-spell-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            useDustSpell(btn.dataset.spellId);
        });
    });

    els.dustSpellList.querySelectorAll(".delete-dust-spell-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            deleteDustSpell(btn.dataset.spellId);
        });
    });
}

function renderDmTechniqueDatabase() {
    const c = getCharacter();
    els.dmTechniqueDatabase.innerHTML = "";

    if (!c.techniques.length) {
        els.dmTechniqueDatabase.innerHTML = `<div class="technique-card"><strong>No techniques for this player yet.</strong></div>`;
        return;
    }

    c.techniques.forEach((tech) => {
        const card = document.createElement("div");
        card.className = "technique-card";
        card.innerHTML = `
      <details class="collapse-block">
        <summary class="collapse-summary">
          <div class="technique-top">
            <div><strong>${tech.name}</strong></div>
            <div class="technique-meta">
              <div class="meta-pill">Lvl ${tech.level}</div>
              <div class="meta-pill">Cost ${tech.cost}</div>
              <div class="meta-pill">${tech.type}</div>
            </div>
          </div>
        </summary>
        <div class="collapse-body">
          <div class="form-grid">
            <div class="field">
              <label>Name</label>
              <input type="text" data-edit-tech="${tech.id}" data-field="name" value="${tech.name}" />
            </div>
            <div class="field">
              <label>Level</label>
              <input type="number" data-edit-tech="${tech.id}" data-field="level" value="${tech.level}" />
            </div>
            <div class="field">
              <label>Cost</label>
              <input type="number" data-edit-tech="${tech.id}" data-field="cost" value="${tech.cost}" />
            </div>
            <div class="field">
              <label>Type</label>
              <input type="text" data-edit-tech="${tech.id}" data-field="type" value="${tech.type}" />
            </div>
          </div>
          <div class="field">
            <label>Description</label>
            <textarea class="small-textarea" data-edit-tech="${tech.id}" data-field="description">${tech.description}</textarea>
          </div>
          <div class="dm-tech-actions">
            <button class="neo-btn small ghost" data-delete-tech="${tech.id}">Delete</button>
          </div>
        </div>
      </details>
    `;
        els.dmTechniqueDatabase.appendChild(card);
    });

    els.dmTechniqueDatabase.querySelectorAll("[data-edit-tech]").forEach((input) => {
        input.addEventListener("input", (e) => {
            const id = e.target.dataset.editTech;
            const field = e.target.dataset.field;
            const tech = c.techniques.find((t) => t.id === id);
            if (!tech) return;
            tech[field] = ["level", "cost"].includes(field) ? Number(e.target.value) || 0 : e.target.value;
            saveState();
            renderGrantedTechniques();
        });
    });

    els.dmTechniqueDatabase.querySelectorAll("[data-delete-tech]").forEach((btn) => {
        btn.addEventListener("click", () => {
            c.techniques = c.techniques.filter((t) => t.id !== btn.dataset.deleteTech);
            saveState();
            render();
        });
    });
}

function renderDmSemblanceFields() {
    const c = getCharacter();
    const s = c.semblance;

    els.dmBaseActive.value = s.base.active;
    els.dmBaseActiveDesc.value = s.base.activeDescription;
    els.dmBasePassiveName.value = s.base.passiveName;
    els.dmBasePassiveDesc.value = s.base.passiveDescription;
    els.dmBaseCost.value = s.base.auraCost;

    els.dmFirstActive.value = s.first.active;
    els.dmFirstActiveDesc.value = s.first.activeDescription;
    els.dmFirstPassiveName.value = s.first.passiveName;
    els.dmFirstPassiveDesc.value = s.first.passiveDescription;
    els.dmFirstCost.value = s.first.auraCost;

    els.dmSecondActive.value = s.second.active;
    els.dmSecondActiveDesc.value = s.second.activeDescription;
    els.dmSecondPassiveName.value = s.second.passiveName;
    els.dmSecondPassiveDesc.value = s.second.passiveDescription;
    els.dmSecondCost.value = s.second.auraCost;

    els.dmThirdActive.value = s.third.active;
    els.dmThirdActiveDesc.value = s.third.activeDescription;
    els.dmThirdPassiveName.value = s.third.passiveName;
    els.dmThirdPassiveDesc.value = s.third.passiveDescription;
    els.dmThirdCost.value = s.third.auraCost;

    els.dmAscendedActive.value = s.ascended.active;
    els.dmAscendedActiveDesc.value = s.ascended.activeDescription;
    els.dmAscendedPassiveName.value = s.ascended.passiveName;
    els.dmAscendedPassiveDesc.value = s.ascended.passiveDescription;
    els.dmAscendedCost.value = s.ascended.auraCost;

    els.unlockFirst.checked = s.unlocked.first;
    els.unlockSecond.checked = s.unlocked.second;
    els.unlockThird.checked = s.unlocked.third;
    els.unlockAscended.checked = s.unlocked.ascended;

    els.stateActive.checked = c.state === "active";
    els.stateReserve.checked = c.state === "reserve";
    els.stateDead.checked = c.state === "dead";
}

function renderTabs() {
    document.querySelectorAll(".tab-btn[data-tab]").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.tab === state.activeTab);
    });

    document.querySelectorAll(".tab-content").forEach((tab) => {
        tab.classList.toggle("active", tab.id === `tab-${state.activeTab}`);
    });
}

function render() {
    const c = getCharacter();
    ensureCurrentWithinMax(c);

    renderCharacterTabs();
    renderHeader();
    renderMainFields();
    renderStats();
    renderSkills();
    renderSemblanceStages();
    renderGrantedTechniques();
    renderDustInventory();
    renderDustSpells();
    renderDmTechniqueDatabase();
    renderDmSemblanceFields();
    renderTabs();
}

function updateCharacterField(field, value) {
    const c = getCharacter();

    if (field === "name") c.name = value;
    if (field === "level") c.level = Math.max(1, Number(value) || 1);
    if (field === "race") c.race = value;
    if (field === "className") c.className = value;
    if (field === "age") c.age = value;
    if (field === "background") c.background = value;
    if (field === "semblanceName") c.semblanceName = value;
    if (field === "proficiencyBonus") c.proficiencyBonus = Number(value) || 0;

    if (field === "maxHp") c.hp.max = Math.max(0, Number(value) || 0);
    if (field === "currentHp") c.hp.current = Math.max(0, Number(value) || 0);
    if (field === "maxAura") c.aura.max = Math.max(0, Number(value) || 0);
    if (field === "currentAura") c.aura.current = Math.max(0, Number(value) || 0);
    if (field === "armor") c.armor = Math.max(0, Number(value) || 0);
    if (field === "initiative") c.initiative = value;
    if (field === "speed") c.speed = value;

    if (field === "weaponsText") c.weaponsText = value;
    if (field === "abilitiesText") c.abilitiesText = value;
    if (field === "inventoryText") c.inventoryText = value;
    if (field === "notesText") c.notesText = value;

    ensureCurrentWithinMax(c);
    saveState();
    render();
}

function adjustStat(stat, amount) {
    const c = getCharacter();
    c.stats[stat] = (Number(c.stats[stat]) || 0) + amount;
    saveState();
    render();
}

function rollHp() {
    const c = getCharacter();
    const conMod = modifierFromScore(c.stats.CON);
    const roll = rollD10();
    const total = Math.max(1, roll + conMod);
    c.hp.max += total;
    c.hp.current = c.hp.max;
    saveState();
    render();
    alert(`HP Roll: d10 (${roll}) + CON mod (${conMod}) = +${total} HP`);
}

function rollAura() {
    const c = getCharacter();
    const conMod = modifierFromScore(c.stats.CON);
    const roll = rollD10();
    const total = Math.max(1, roll + conMod);
    c.aura.max += total;
    c.aura.current = c.aura.max;
    saveState();
    render();
    alert(`Aura Roll: d10 (${roll}) + CON mod (${conMod}) = +${total} Aura`);
}

function restoreHp() {
    const c = getCharacter();
    c.hp.current = c.hp.max;
    saveState();
    render();
}

function restoreAura() {
    const c = getCharacter();
    c.aura.current = c.aura.max;
    saveState();
    render();
}

function useTechnique(techId) {
    const c = getCharacter();
    const tech = c.techniques.find((t) => t.id === techId);
    if (!tech) return;

    if (c.aura.current < tech.cost) {
        alert("Not enough Aura Points.");
        return;
    }

    c.aura.current -= tech.cost;
    ensureCurrentWithinMax(c);
    saveState();
    render();
}

function useSemblanceStage(stageKey) {
    const c = getCharacter();
    const locked = stageLocked(stageKey, c);
    if (locked) {
        alert("That Semblance stage is still locked.");
        return;
    }

    const stage = c.semblance[stageKey];
    const cost = Math.max(0, Number(stage.auraCost) || 0);

    if (c.aura.current < cost) {
        alert("Not enough Aura Points.");
        return;
    }

    c.aura.current -= cost;
    ensureCurrentWithinMax(c);
    saveState();
    render();
}

function saveSemblanceFromDm() {
    const c = getCharacter();

    c.semblance.base.active = els.dmBaseActive.value;
    c.semblance.base.activeDescription = els.dmBaseActiveDesc.value;
    c.semblance.base.passiveName = els.dmBasePassiveName.value;
    c.semblance.base.passiveDescription = els.dmBasePassiveDesc.value;
    c.semblance.base.auraCost = Math.max(0, Number(els.dmBaseCost.value) || 0);

    c.semblance.first.active = els.dmFirstActive.value;
    c.semblance.first.activeDescription = els.dmFirstActiveDesc.value;
    c.semblance.first.passiveName = els.dmFirstPassiveName.value;
    c.semblance.first.passiveDescription = els.dmFirstPassiveDesc.value;
    c.semblance.first.auraCost = Math.max(0, Number(els.dmFirstCost.value) || 0);

    c.semblance.second.active = els.dmSecondActive.value;
    c.semblance.second.activeDescription = els.dmSecondActiveDesc.value;
    c.semblance.second.passiveName = els.dmSecondPassiveName.value;
    c.semblance.second.passiveDescription = els.dmSecondPassiveDesc.value;
    c.semblance.second.auraCost = Math.max(0, Number(els.dmSecondCost.value) || 0);

    c.semblance.third.active = els.dmThirdActive.value;
    c.semblance.third.activeDescription = els.dmThirdActiveDesc.value;
    c.semblance.third.passiveName = els.dmThirdPassiveName.value;
    c.semblance.third.passiveDescription = els.dmThirdPassiveDesc.value;
    c.semblance.third.auraCost = Math.max(0, Number(els.dmThirdCost.value) || 0);

    c.semblance.ascended.active = els.dmAscendedActive.value;
    c.semblance.ascended.activeDescription = els.dmAscendedActiveDesc.value;
    c.semblance.ascended.passiveName = els.dmAscendedPassiveName.value;
    c.semblance.ascended.passiveDescription = els.dmAscendedPassiveDesc.value;
    c.semblance.ascended.auraCost = Math.max(0, Number(els.dmAscendedCost.value) || 0);

    c.semblance.unlocked.first = els.unlockFirst.checked;
    c.semblance.unlocked.second = els.unlockSecond.checked;
    c.semblance.unlocked.third = els.unlockThird.checked;
    c.semblance.unlocked.ascended = els.unlockAscended.checked;

    saveState();
    render();
}

function saveCharacterState() {
    const c = getCharacter();

    if (els.stateActive.checked) c.state = "active";
    if (els.stateReserve.checked) c.state = "reserve";
    if (els.stateDead.checked) c.state = "dead";

    if (c.state === "dead") {
        c.hp.current = 0;
        c.aura.current = 0;
    }

    saveState();
    render();
}

function addCharacter() {
    const newCharacter = blankCharacter(state.characters.length);
    newCharacter.state = "reserve";
    state.characters.push(newCharacter);
    state.selectedCharacter = state.characters.length - 1;
    state.showReserve = true;
    saveState();
    render();
}

function deleteCharacter() {
    if (state.characters.length <= 1) {
        alert("You need to keep at least one character.");
        return;
    }

    const current = getCharacter();
    const name = current.name || `Character ${state.selectedCharacter + 1}`;
    const confirmed = confirm(`Delete ${name}? This cannot be undone.`);
    if (!confirmed) return;

    state.characters.splice(state.selectedCharacter, 1);

    if (state.selectedCharacter >= state.characters.length) {
        state.selectedCharacter = state.characters.length - 1;
    }

    saveState();
    render();
}

function addDustSpell() {
    const c = getCharacter();
    const name = els.dustSpellName.value.trim();
    const type = els.dustSpellType.value;
    const description = els.dustSpellDescription.value.trim();

    if (!name || !type || !description) {
        alert("Fill out the Dust Spell form first.");
        return;
    }

    c.dustSpells.push({
        id: `dust-${Date.now()}`,
        name,
        type,
        description
    });

    els.dustSpellName.value = "";
    els.dustSpellDescription.value = "";

    saveState();
    render();
}

function useDustSpell(spellId) {
    const c = getCharacter();
    const spell = c.dustSpells.find((s) => s.id === spellId);
    if (!spell) return;

    const amount = c.dustInventory[spell.type] || 0;
    if (amount < 1) {
        alert(`Not enough ${spell.type}.`);
        return;
    }

    c.dustInventory[spell.type] -= 1;
    saveState();
    render();
}

function deleteDustSpell(spellId) {
    const c = getCharacter();
    c.dustSpells = c.dustSpells.filter((spell) => spell.id !== spellId);
    saveState();
    render();
}

function createTechniqueForSelectedPlayer() {
    const c = getCharacter();
    const name = els.dmTechName.value.trim();
    const level = Number(els.dmTechLevel.value);
    const cost = Number(els.dmTechCost.value);
    const type = els.dmTechType.value.trim();
    const description = els.dmTechDescription.value.trim();

    if (!name || !type || !description || !Number.isFinite(level) || !Number.isFinite(cost)) {
        alert("Fill out the full Aura Technique form.");
        return;
    }

    c.techniques.push({
        id: `tech-${Date.now()}`,
        name,
        level,
        cost,
        type,
        description
    });

    els.dmTechName.value = "";
    els.dmTechLevel.value = "";
    els.dmTechCost.value = "";
    els.dmTechType.value = "";
    els.dmTechDescription.value = "";

    saveState();
    render();
}

function openDmOverlay() {
    els.dmOverlay.classList.remove("hidden");
    if (!dmUnlocked) {
        els.dmLoginPanel.classList.remove("hidden");
        els.dmFullscreenPanel.classList.add("hidden");
        els.dmPasswordInput.value = "";
        els.dmPasswordInput.focus();
    } else {
        els.dmLoginPanel.classList.add("hidden");
        els.dmFullscreenPanel.classList.remove("hidden");
    }
}

function closeDmOverlay() {
    els.dmOverlay.classList.add("hidden");
}

function lockDm() {
    dmUnlocked = false;
    els.dmFullscreenPanel.classList.add("hidden");
    els.dmLoginPanel.classList.remove("hidden");
}

function unlockDm() {
    if (els.dmPasswordInput.value !== DM_PASSWORD) {
        alert("Wrong password.");
        return;
    }

    dmUnlocked = true;
    els.dmLoginPanel.classList.add("hidden");
    els.dmFullscreenPanel.classList.remove("hidden");
    renderDmSemblanceFields();
    renderDmTechniqueDatabase();
}

function exportSaveData() {
    try {
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        const date = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
        link.href = url;
        link.download = `rwby-dnd-save-${date}.json`;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            URL.revokeObjectURL(url);
            link.remove();
        }, 100);
    } catch (err) {
        console.error("Export failed:", err);
        alert("Could not export save data.");
    }
}

function importSaveDataFromFile(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
        try {
            const parsed = JSON.parse(reader.result);

            if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.characters)) {
                alert("That file is not a valid RWBY DnD save.");
                return;
            }

            state = normalizeState(parsed);
            saveState();
            render();
            alert("Save imported successfully.");
        } catch (err) {
            console.error("Import failed:", err);
            alert("Could not import that file.");
        }
    };

    reader.onerror = () => {
        alert("Could not read that file.");
    };

    reader.readAsText(file);
}

function bindInputs() {
    els.charName.addEventListener("input", (e) => updateCharacterField("name", e.target.value));
    els.charLevel.addEventListener("input", (e) => updateCharacterField("level", e.target.value));
    els.charRace.addEventListener("input", (e) => updateCharacterField("race", e.target.value));
    els.charClass.addEventListener("input", (e) => updateCharacterField("className", e.target.value));
    els.charAge.addEventListener("input", (e) => updateCharacterField("age", e.target.value));
    els.charBackground.addEventListener("input", (e) => updateCharacterField("background", e.target.value));
    els.charSemblanceName.addEventListener("input", (e) => updateCharacterField("semblanceName", e.target.value));
    els.charPB.addEventListener("input", (e) => updateCharacterField("proficiencyBonus", e.target.value));

    els.currentHp.addEventListener("input", (e) => updateCharacterField("currentHp", e.target.value));
    els.maxHp.addEventListener("input", (e) => updateCharacterField("maxHp", e.target.value));
    els.currentAura.addEventListener("input", (e) => updateCharacterField("currentAura", e.target.value));
    els.maxAura.addEventListener("input", (e) => updateCharacterField("maxAura", e.target.value));
    els.armor.addEventListener("input", (e) => updateCharacterField("armor", e.target.value));
    els.initiative.addEventListener("input", (e) => updateCharacterField("initiative", e.target.value));
    els.speed.addEventListener("input", (e) => updateCharacterField("speed", e.target.value));

    els.weaponsText.addEventListener("input", (e) => updateCharacterField("weaponsText", e.target.value));
    els.abilitiesText.addEventListener("input", (e) => updateCharacterField("abilitiesText", e.target.value));
    els.inventoryText.addEventListener("input", (e) => updateCharacterField("inventoryText", e.target.value));
    els.notesText.addEventListener("input", (e) => updateCharacterField("notesText", e.target.value));

    document.querySelectorAll(".tab-btn[data-tab]").forEach((btn) => {
        btn.addEventListener("click", () => {
            state.activeTab = btn.dataset.tab;
            saveState();
            renderTabs();
        });
    });

    els.statsGrid.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const stat = btn.dataset.stat;
        const action = btn.dataset.action;
        if (!stat || !action) return;
        if (action === "plus") adjustStat(stat, 1);
        if (action === "minus") adjustStat(stat, -1);
    });

    els.rollHpBtn.addEventListener("click", rollHp);
    els.rollAuraBtn.addEventListener("click", rollAura);
    els.restoreHpBtn.addEventListener("click", restoreHp);
    els.restoreAuraBtn.addEventListener("click", restoreAura);
    els.saveSemblanceBtn.addEventListener("click", saveSemblanceFromDm);
    els.saveCharacterStateBtn.addEventListener("click", saveCharacterState);
    els.addCharacterBtn.addEventListener("click", addCharacter);
    els.deleteCharacterBtn.addEventListener("click", deleteCharacter);
    els.addDustSpellBtn.addEventListener("click", addDustSpell);
    els.createTechniqueBtn.addEventListener("click", createTechniqueForSelectedPlayer);

    els.toggleReserveBtn.addEventListener("click", () => {
        state.showReserve = !state.showReserve;
        saveState();
        render();
    });

    els.toggleDeadBtn.addEventListener("click", () => {
        state.showDead = !state.showDead;
        saveState();
        render();
    });

    els.openDmOverlayBtn.addEventListener("click", openDmOverlay);
    els.dmLoginBtn.addEventListener("click", unlockDm);
    els.dmCloseBtn.addEventListener("click", closeDmOverlay);
    els.dmCloseFullBtn.addEventListener("click", closeDmOverlay);
    els.dmLogoutBtn.addEventListener("click", lockDm);
    els.dmPasswordInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") unlockDm();
    });

    if (els.exportDataBtn) {
        els.exportDataBtn.addEventListener("click", exportSaveData);
    } else {
        console.error("exportDataBtn not found in HTML");
    }

    if (els.importDataBtn && els.importDataInput) {
        els.importDataBtn.addEventListener("click", () => {
            els.importDataInput.click();
        });

        els.importDataInput.addEventListener("change", (e) => {
            const file = e.target.files?.[0];
            importSaveDataFromFile(file);
            e.target.value = "";
        });
    } else {
        console.error("importDataBtn or importDataInput not found in HTML");
    }
}

bindInputs();
console.log("script loaded");
console.log("export button:", els.exportDataBtn);
render();