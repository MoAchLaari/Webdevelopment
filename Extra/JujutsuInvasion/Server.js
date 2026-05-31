const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const FILE = path.join(__dirname, "data", "claims.json");

app.get("/claims", (req, res) => {
    const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
    res.json(data);
});

app.post("/claim", (req, res) => {

    const claims = JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

    const exists = claims.find(
        x =>
            x.technique.toLowerCase() ===
            req.body.technique.toLowerCase()
    );

    if (exists) {
        return res.json({
            success: false,
            message: "Technique already claimed."
        });
    }

    claims.push(req.body);

    fs.writeFileSync(
        FILE,
        JSON.stringify(claims, null, 2)
    );

    res.json({
        success: true,
        message: "Claim added."
    });
});

app.listen(3000, () => {
    console.log("Running on http://localhost:3000");
});