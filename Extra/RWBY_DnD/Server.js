const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data.json");
const DM_PASSWORD = process.env.DM_PASSWORD || "changeme123";

app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(__dirname, "public")));

function readData() {
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(raw);
    } catch (err) {
        console.error("Failed to read data.json:", err);
        return null;
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
        return true;
    } catch (err) {
        console.error("Failed to write data.json:", err);
        return false;
    }
}

app.get("/api/state", (req, res) => {
    const data = readData();
    if (!data) {
        return res.status(500).json({ error: "Could not load state." });
    }
    res.json(data);
});

app.post("/api/state", (req, res) => {
    const data = req.body;
    if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "Invalid state payload." });
    }

    const ok = writeData(data);
    if (!ok) {
        return res.status(500).json({ error: "Could not save state." });
    }

    res.json({ ok: true });
});

app.post("/api/dm-login", (req, res) => {
    const { password } = req.body || {};
    if (password === DM_PASSWORD) {
        return res.json({ ok: true });
    }
    res.status(401).json({ ok: false, error: "Wrong password." });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});