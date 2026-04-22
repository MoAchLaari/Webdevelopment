const MAX = 10;

const people = [
    { name: "Player 1", items: [], extras: [], received: [], rolls: 0, guarantee: 3 },
    { name: "Player 2", items: [], extras: [], received: [], rolls: 0, guarantee: 3 },
    { name: "Player 3", items: [], extras: [], received: [], rolls: 0, guarantee: 3 },
    { name: "Player 4", items: [], extras: [], received: [], rolls: 0, guarantee: 3 }
];

// ---------- RENDER ----------
function render() {
    const container = document.getElementById("people");
    container.innerHTML = "";

    const select = document.getElementById("Player-select");
    select.innerHTML = "";

    people.forEach((p, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = p.name;
        select.appendChild(opt);

        const div = document.createElement("div");
        div.className = "Player";

        div.innerHTML = `
      <input value="${p.name}" onchange="people[${i}].name=this.value; render()" />

      <div>Guarantee Extra every 
        <input type="number" value="${p.guarantee}" min="1"
          onchange="people[${i}].guarantee = Number(this.value) || 1">
        rolls
      </div>

      <div class="input-row">
        <input class="item-input" data-i="${i}" placeholder="Add option..." />
        <button onclick="addItem(${i})">Add</button>
      </div>

      ${p.items.map((it, idx) => `
        <div class="item">
          ${it}
          <button onclick="removeItem(${i}, ${idx})">x</button>
        </div>
      `).join("")}

      <div class="input-row">
        <input class="extra-input" data-i="${i}" placeholder="Add extra..." />
        <button onclick="addExtra(${i})">Add</button>
      </div>

      ${p.extras.map((ex, idx) => `
        <div class="item">
          ${ex}
          <button onclick="removeExtra(${i}, ${idx})">x</button>
        </div>
      `).join("")}

      <div>
        <strong>Received:</strong>
        ${p.received.map(r => `<div class="item">${r}</div>`).join("")}
      </div>

      <div id="result-${i}"></div>
    `;

        container.appendChild(div);
    });
}

// ---------- INPUT ----------
document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const el = document.activeElement;

        if (el.classList.contains("item-input")) {
            addItem(el.dataset.i);
        }

        if (el.classList.contains("extra-input")) {
            addExtra(el.dataset.i);
        }
    }
});

function addItem(i) {
    const input = document.querySelector(`.item-input[data-i="${i}"]`);
    const val = input.value.trim();
    if (!val) return;

    if (people[i].items.length >= MAX) return alert("Max 10 items");

    people[i].items.push(val);
    input.value = "";
    render();
}

function addExtra(i) {
    const input = document.querySelector(`.extra-input[data-i="${i}"]`);
    const val = input.value.trim();
    if (!val) return;

    if (people[i].extras.length >= MAX) return alert("Max 10 extras");

    people[i].extras.push(val);
    input.value = "";
    render();
}

function removeItem(p, i) {
    people[p].items.splice(i, 1);
    render();
}

function removeExtra(p, i) {
    people[p].extras.splice(i, 1);
    render();
}

// ---------- RANDOM ----------
function pick(arr) {
    if (!arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

// ---------- ROLL ----------
function rollOne(i, used = new Set()) {
    const p = people[i];
    p.rolls++;

    let useExtra = false;

    if (p.rolls >= p.guarantee) {
        useExtra = true;
        p.rolls = 0;
    } else if (Math.random() < 0.5) {
        useExtra = true;
    }

    let result = null;

    if (useExtra && p.extras.length) {
        const idx = Math.floor(Math.random() * p.extras.length);
        result = p.extras.splice(idx, 1)[0];
        p.received.push(result);
        p.items.push(result);
    } else {
        let attempts = 0;
        do {
            result = pick(p.items);
            attempts++;
        } while (used.has(result) && attempts < 10);
    }

    used.add(result);

    document.getElementById(`result-${i}`).textContent =
        result || "No options";

    return result;
}

function rollSelected() {
    const i = document.getElementById("Player-select").value;
    rollOne(i);
    render();
}

function rollAll() {
    const used = new Set();

    people.forEach((_, i) => {
        rollOne(i, used);
    });

    render();
}

// ---------- SAVE / LOAD ----------
function savePreset() {
    localStorage.setItem("pickerPreset", JSON.stringify(people));
    alert("Saved.");
}

function loadPreset() {
    const data = localStorage.getItem("pickerPreset");
    if (!data) return alert("No save found.");

    const parsed = JSON.parse(data);

    for (let i = 0; i < people.length; i++) {
        people[i] = parsed[i] || people[i];
    }

    render();
}

// ---------- INIT ----------
render();