const STORAGE_KEY = "neon-sheet-system-v2";

const STAT_ORDER = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

const SKILL_MAP = {
    STR: ["Athletics"],
    DEX: ["Acrobatics", "Sleight of Hand", "Stealth"],
    CON: ["Endurance"],
    INT: ["History", "Investigation", "Nature", "Religion", "Aura Master"],
    WIS: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
    CHA: ["Deception", "Intimidation", "Performance", "Persuasion"]
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

function blankCharacter(index) {
    return {
        id: index + 1,
        name: "",
        race: "",
        className: "",
        age: "",
        level: 1,
        background: "",
        semblanceName: "",
        proficiencyBonus: 2,

        stats: {
            STR: 10,
            DEX: 10,
            CON: 10,
            INT: 10,
            WIS: 10,
            CHA: 10
        },

        skills: makeBlankSkills(),

        hp: {
            current: 0,
            max: 0
        },

        aura: {
            current: 0,
            max: 0
        },

        armor: 0,
        initiative: "",
        speed: "",

        weaponsText: "",
        abilitiesText: "",
        inventoryText: "",
        notesText: "",

        grantedTechniqueIds: [],

        semblance: {
            basePassive: "",
            baseActive: "",
            firstEvolution: "",
            secondEvolution: "",
            thirdEvolution: "",
            ascended: "",
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
    characters: [
        blankCharacter(0),
        blankCharacter(1),
        blankCharacter(2),
        blankCharacter(3)
    ],
    techniqueDatabase: []
};

let state = loadState();

const els = {
    characterTabs: document.getElementById("characterTabs"),
    selectedNameSmall: document.getElementById("selectedNameSmall"),
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

    dmTechName: document.getElementById("dmTechName"),
    dmTechLevel: document.getElementById("dmTechLevel"),
    dmTechCost: document.getElementById("dmTechCost"),
    dmTechType: document.getElementById("dmTechType"),
    dmTechDescription: document.getElementById("dmTechDescription"),
    createTechniqueBtn: document.getElementById("createTechniqueBtn"),
    dmTechniqueDatabase: document.getElementById("dmTechniqueDatabase"),

    dmBasePassive: document.getElementById("dmBasePassive"),
    dmBaseActive: document.getElementById("dmBaseActive"),
    dmFirstEvolution: document.getElementById("dmFirstEvolution"),
    dmSecondEvolution: document.getElementById("dmSecondEvolution"),
    dmThirdEvolution: document.getElementById("dmThirdEvolution"),
    dmAscendedEvolution: document.getElementById("dmAscendedEvolution"),

    unlockFirst: document.getElementById("unlockFirst"),
    unlockSecond: document.getElementById("unlockSecond"),
    unlockThird: document.getElementById("unlockThird"),
    unlockAscended: document.getElementById("unlockAscended"),
    saveSemblanceBtn: document.getElementById("saveSemblanceBtn"),

    rollHpBtn: document.getElementById("rollHpBtn"),
    rollAuraBtn: document.getElementById("rollAuraBtn"),
    restoreAuraBtn: document.getElementById("restoreAuraBtn"),
    restoreHpBtn: document.getElementById("restoreHpBtn")
};

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return structuredClone(defaultState);
        return JSON.parse(raw);
    } catch {
        return structuredClone(defaultState);
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCharacter() {
    return state.characters[state.selectedCharacter];
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

function renderCharacterTabs() {
    els.characterTabs.innerHTML = "";
    state.characters.forEach((character, index) => {
        const tab = document.createElement("div");
        tab.className = `character-tab ${index === state.selectedCharacter ? "active" : ""}`;
        tab.innerHTML = `
      <strong>${character.name || `Character ${index + 1}`}</strong>
      <span>${character.semblanceName || "No Semblance Set"}</span>
    `;
        tab.addEventListener("click", () => {
            state.selectedCharacter = index;
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
    els.selectedTechniqueCount.textContent = c.grantedTechniqueIds.length;
}

function renderMainFields() {
    const c = getCharacter();

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

            const row = document.createElement("div");
            row.className = "skill-row";
            row.innerHTML = `
        <div class="skill-row-label">
          <strong>${skillName}</strong>
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
    const s = c.semblance;

    const stages = [
        {
            title: "Base Passive",
            text: s.basePassive || "No value added yet.",
            locked: false
        },
        {
            title: "Base Active",
            text: s.baseActive || "No value added yet.",
            locked: false
        },
        {
            title: "First Evolution",
            text: s.firstEvolution || "No value added yet.",
            locked: !s.unlocked.first
        },
        {
            title: "Second Evolution",
            text: s.secondEvolution || "No value added yet.",
            locked: !s.unlocked.second
        },
        {
            title: "Third Evolution",
            text: s.thirdEvolution || "No value added yet.",
            locked: !s.unlocked.third
        },
        {
            title: "Ascended",
            text: s.ascended || "No value added yet.",
            locked: !s.unlocked.ascended
        }
    ];

    els.semblanceStages.innerHTML = "";
    stages.forEach((stage) => {
        const card = document.createElement("div");
        card.className = `sem-stage ${stage.locked ? "stage-locked" : ""}`;
        card.innerHTML = `
      <div class="sem-stage-header">
        <div class="stage-name">${stage.title}</div>
        <div class="stage-status">${stage.locked ? "Locked" : "Unlocked"}</div>
      </div>
      <div class="stage-description">${stage.text}</div>
    `;
        els.semblanceStages.appendChild(card);
    });
}

function renderGrantedTechniques() {
    const c = getCharacter();
    const techniques = state.techniqueDatabase.filter((t) => c.grantedTechniqueIds.includes(t.id));

    els.grantedTechniques.innerHTML = "";

    if (!techniques.length) {
        els.grantedTechniques.innerHTML = `
      <div class="technique-card">
        <strong>No granted Aura Techniques.</strong>
        <div class="small-note">The DM needs to create and grant them first.</div>
      </div>
    `;
        return;
    }

    techniques.forEach((tech) => {
        const card = document.createElement("div");
        card.className = "technique-card";
        card.innerHTML = `
      <div class="technique-top">
        <div>
          <strong>${tech.name}</strong>
          <div class="small-note">${tech.description}</div>
        </div>
        <div class="technique-meta">
          <div class="meta-pill">Lvl ${tech.level}</div>
          <div class="meta-pill">Cost ${tech.cost}</div>
          <div class="meta-pill">${tech.type}</div>
        </div>
      </div>
      <div class="technique-actions">
        <button class="neo-btn small use-tech-btn" data-tech-id="${tech.id}">Use Technique</button>
      </div>
    `;
        els.grantedTechniques.appendChild(card);
    });

    els.grantedTechniques.querySelectorAll(".use-tech-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const techId = Number(btn.dataset.techId);
            useTechnique(techId);
        });
    });
}

function renderDmTechniqueDatabase() {
    const c = getCharacter();
    els.dmTechniqueDatabase.innerHTML = "";

    if (!state.techniqueDatabase.length) {
        els.dmTechniqueDatabase.innerHTML = `
      <div class="technique-card">
        <strong>No techniques created yet.</strong>
      </div>
    `;
        return;
    }

    state.techniqueDatabase.forEach((tech) => {
        const granted = c.grantedTechniqueIds.includes(tech.id);

        const card = document.createElement("div");
        card.className = "technique-card";
        card.innerHTML = `
      <div class="technique-top">
        <div>
          <strong>${tech.name}</strong>
          <div class="small-note">${tech.description}</div>
        </div>
        <div class="technique-meta">
          <div class="meta-pill">Lvl ${tech.level}</div>
          <div class="meta-pill">Cost ${tech.cost}</div>
          <div class="meta-pill">${tech.type}</div>
        </div>
      </div>
      <div class="dm-tech-actions">
        <button class="neo-btn small ${granted ? "ghost" : ""}" data-action="grant-tech" data-tech-id="${tech.id}">
          ${granted ? "Revoke From Selected" : "Grant To Selected"}
        </button>
        <button class="neo-btn small ghost" data-action="delete-tech" data-tech-id="${tech.id}">
          Delete Technique
        </button>
      </div>
    `;
        els.dmTechniqueDatabase.appendChild(card);
    });

    els.dmTechniqueDatabase.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
            const action = btn.dataset.action;
            const techId = Number(btn.dataset.techId);

            if (action === "grant-tech") {
                toggleGrantTechnique(techId);
            }

            if (action === "delete-tech") {
                deleteTechnique(techId);
            }
        });
    });
}

function renderDmSemblanceFields() {
    const s = getCharacter().semblance;

    els.dmBasePassive.value = s.basePassive;
    els.dmBaseActive.value = s.baseActive;
    els.dmFirstEvolution.value = s.firstEvolution;
    els.dmSecondEvolution.value = s.secondEvolution;
    els.dmThirdEvolution.value = s.thirdEvolution;
    els.dmAscendedEvolution.value = s.ascended;

    els.unlockFirst.checked = s.unlocked.first;
    els.unlockSecond.checked = s.unlocked.second;
    els.unlockThird.checked = s.unlocked.third;
    els.unlockAscended.checked = s.unlocked.ascended;
}

function renderTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.tab === state.activeTab);
    });

    document.querySelectorAll(".tab-content").forEach((tab) => {
        tab.classList.toggle("active", tab.id === `tab-${state.activeTab}`);
    });
}

function render() {
    renderCharacterTabs();
    renderHeader();
    renderMainFields();
    renderStats();
    renderSkills();
    renderSemblanceStages();
    renderGrantedTechniques();
    renderDmTechniqueDatabase();
    renderDmSemblanceFields();
    renderTabs();
}

function updateCharacterField(field, value) {
    const c = getCharacter();

    if (field === "name") c.name = value;
    if (field === "level") c.level = Number(value) || 1;
    if (field === "race") c.race = value;
    if (field === "className") c.className = value;
    if (field === "age") c.age = value;
    if (field === "background") c.background = value;
    if (field === "semblanceName") c.semblanceName = value;
    if (field === "proficiencyBonus") c.proficiencyBonus = Number(value) || 0;

    if (field === "currentHp") c.hp.current = Number(value) || 0;
    if (field === "maxHp") c.hp.max = Number(value) || 0;
    if (field === "currentAura") c.aura.current = Number(value) || 0;
    if (field === "maxAura") c.aura.max = Number(value) || 0;
    if (field === "armor") c.armor = Number(value) || 0;
    if (field === "initiative") c.initiative = value;
    if (field === "speed") c.speed = value;

    if (field === "weaponsText") c.weaponsText = value;
    if (field === "abilitiesText") c.abilitiesText = value;
    if (field === "inventoryText") c.inventoryText = value;
    if (field === "notesText") c.notesText = value;

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
    const tech = state.techniqueDatabase.find((t) => t.id === techId);
    if (!tech) return;

    if (!c.grantedTechniqueIds.includes(techId)) {
        alert("This technique is not granted to the selected character.");
        return;
    }

    if (c.aura.current < tech.cost) {
        alert("Not enough Aura Points.");
        return;
    }

    c.aura.current -= tech.cost;
    saveState();
    render();
}

function createTechnique() {
    const name = els.dmTechName.value.trim();
    const level = Number(els.dmTechLevel.value);
    const cost = Number(els.dmTechCost.value);
    const type = els.dmTechType.value.trim();
    const description = els.dmTechDescription.value.trim();

    if (!name || !type || !description || !Number.isFinite(level) || !Number.isFinite(cost)) {
        alert("Fill out the full Aura Technique form.");
        return;
    }

    state.techniqueDatabase.push({
        id: Date.now(),
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

function toggleGrantTechnique(techId) {
    const c = getCharacter();
    const index = c.grantedTechniqueIds.indexOf(techId);

    if (index === -1) {
        c.grantedTechniqueIds.push(techId);
    } else {
        c.grantedTechniqueIds.splice(index, 1);
    }

    saveState();
    render();
}

function deleteTechnique(techId) {
    state.techniqueDatabase = state.techniqueDatabase.filter((t) => t.id !== techId);
    state.characters.forEach((character) => {
        character.grantedTechniqueIds = character.grantedTechniqueIds.filter((id) => id !== techId);
    });
    saveState();
    render();
}

function saveSemblanceFromDm() {
    const c = getCharacter();

    c.semblance.basePassive = els.dmBasePassive.value;
    c.semblance.baseActive = els.dmBaseActive.value;
    c.semblance.firstEvolution = els.dmFirstEvolution.value;
    c.semblance.secondEvolution = els.dmSecondEvolution.value;
    c.semblance.thirdEvolution = els.dmThirdEvolution.value;
    c.semblance.ascended = els.dmAscendedEvolution.value;

    c.semblance.unlocked.first = els.unlockFirst.checked;
    c.semblance.unlocked.second = els.unlockSecond.checked;
    c.semblance.unlocked.third = els.unlockThird.checked;
    c.semblance.unlocked.ascended = els.unlockAscended.checked;

    saveState();
    render();
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

    document.querySelectorAll(".tab-btn").forEach((btn) => {
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
    els.createTechniqueBtn.addEventListener("click", createTechnique);
    els.saveSemblanceBtn.addEventListener("click", saveSemblanceFromDm);
}

bindInputs();
render();