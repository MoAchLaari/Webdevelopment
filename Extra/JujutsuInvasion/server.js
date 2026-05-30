const express =
    require("express");

const fs =
    require("fs");

const app =
    express();

app.use(express.json());

app.use(
    express.static("public")
);

const FILE =
    "./data/claims.json";

app.get("/claims",(req,res)=>{

    const claims =
        JSON.parse(
            fs.readFileSync(FILE)
        );

    res.json(claims);
});

app.post("/claim",(req,res)=>{

    const claims =
        JSON.parse(
            fs.readFileSync(FILE)
        );

    const exists =
        claims.find(
            c=>
                c.technique
                    .toLowerCase()
                ===
                req.body.technique
                    .toLowerCase()
        );

    if(exists){

        return res.json({
            message:
                "Technique already claimed."
        });
    }

    claims.push(req.body);

    fs.writeFileSync(
        FILE,
        JSON.stringify(
            claims,
            null,
            2
        )
    );

    res.json({
        message:
            "Claim successful."
    });
});

app.listen(
    3000,
    ()=>console.log(
        "Running on 3000"
    ));