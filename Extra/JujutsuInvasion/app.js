const claimsContainer =
    document.getElementById("claims");

let claims = [];

async function loadClaims(){

    const res =
        await fetch("/claims");

    claims =
        await res.json();

    render();
}

function render(){

    const search =
        document
            .getElementById("search")
            .value
            .toLowerCase();

    const sort =
        document
            .getElementById("sort")
            .value;

    let filtered =
        claims.filter(c=>

            c.technique
                .toLowerCase()
                .includes(search)

            ||

            c.owner
                .toLowerCase()
                .includes(search)
        );

    if(sort==="tech"){

        filtered.sort(
            (a,b)=>
                a.technique.localeCompare(
                    b.technique
                )
        );
    }

    if(sort==="owner"){

        filtered.sort(
            (a,b)=>
                a.owner.localeCompare(
                    b.owner
                )
        );
    }

    if(sort==="newest"){

        filtered.reverse();
    }

    claimsContainer.innerHTML =
        filtered.map(c=>`

    <div class="card">

        <h2>${c.technique}</h2>

        <p>
        Claimed By:
        ${c.owner}
        </p>

        <p>
        <a href="${c.discord}">
        Discord
        </a>
        </p>

        <p>
        <a href="${c.wiki}">
        Wiki
        </a>
        </p>

    </div>

    `).join("");
}

document
    .getElementById("search")
    .addEventListener("input",render);

document
    .getElementById("sort")
    .addEventListener("change",render);

document
    .getElementById("claimBtn")
    .addEventListener("click",async()=>{

        const data = {

            technique:
            document.getElementById("technique").value,

            owner:
            document.getElementById("owner").value,

            discord:
            document.getElementById("discord").value,

            wiki:
            document.getElementById("wiki").value

        };

        const res =
            await fetch("/claim",{

                method:"POST",

                headers:{
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(data)

            });

        const result =
            await res.json();

        alert(result.message);

        loadClaims();
    });

const endDate =
    new Date("2026-12-31T23:59:59");

setInterval(()=>{

    const diff =
        endDate - new Date();

    const days =
        Math.floor(
            diff/86400000
        );

    const hours =
        Math.floor(
            (diff%86400000)
            /3600000
        );

    document
        .getElementById("countdown")
        .innerText =
        `Claim Period Ends In:
    ${days}d ${hours}h`;

},1000);

loadClaims();