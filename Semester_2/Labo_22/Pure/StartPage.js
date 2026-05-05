let zoekopdrachten = [];

const setup = () => {
    const btn = document.getElementById("btn");
    const input = document.getElementById("input");

    btn.addEventListener("click", valideer);

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            valideer();
        }
    });

    const opgeslagen = localStorage.getItem("opdrachten");

    if (opgeslagen !== null) {
        zoekopdrachten = JSON.parse(opgeslagen);

        zoekopdrachten.forEach((zoekOpdracht) => {
            maakSwatch(zoekOpdracht);
        });
    }
};

const valideer = () => {
    const inputElement = document.getElementById("input");
    const input = inputElement.value.trim();

    if (input === "") {
        alert("Je hebt geen zoekopdracht ingegeven.");
        return;
    }

    if (input.charAt(0) !== "/") {
        alert("Ongeldig commando. Een commando moet starten met een slash.");
        return;
    }

    const spatieIndex = input.indexOf(" ");

    if (spatieIndex === -1) {
        alert("Ongeldig commando. Gebruik bijvoorbeeld: /g webdesign");
        return;
    }

    const prefix = input.substring(0, spatieIndex);
    const query = input.substring(spatieIndex + 1).trim();

    if (
        prefix !== "/g" &&
        prefix !== "/y" &&
        prefix !== "/x" &&
        prefix !== "/i"
    ) {
        alert("Onbekende prefix. Gebruik /g, /y, /x of /i.");
        return;
    }

    if (query === "") {
        alert("Je hebt geen zoekopdracht ingegeven.");
        return;
    }

    const title = buildTitle(prefix);
    const url = buildUrl(prefix, query);

    const h = {
        title: title,
        text: query,
        url: url
    };

    zoekopdrachten.push(h);
    localStorage.setItem("opdrachten", JSON.stringify(zoekopdrachten));

    maakSwatch(h);
    openInNieuwTabblad(h.url);

    inputElement.value = "";
};

const buildTitle = (prefix) => {
    if (prefix === "/g") return "Google";
    if (prefix === "/y") return "Youtube";
    if (prefix === "/x") return "X";
    if (prefix === "/i") return "Instagram";
};

const buildUrl = (prefix, query) => {
    const queryMetPlus = encodeURIComponent(query).replaceAll("%20", "+");
    const hashtagQuery = query.replaceAll(" ", "");

    if (prefix === "/g") {
        return "https://www.google.com/search?q=" + queryMetPlus;
    }

    if (prefix === "/y") {
        return "https://www.youtube.com/results?search_query=" + queryMetPlus;
    }

    if (prefix === "/x") {
        return "https://x.com/hashtag/" + encodeURIComponent(hashtagQuery);
    }

    if (prefix === "/i") {
        return "https://www.instagram.com/explore/tags/" + encodeURIComponent(hashtagQuery) + "/";
    }
};

const openInNieuwTabblad = (url) => {
    window.open(url, "_blank");
};

const getCardClass = (title) => {
    if (title === "Google") return "card-google";
    if (title === "Youtube") return "card-youtube";
    if (title === "X") return "card-x";
    if (title === "Instagram") return "card-instagram";
};

const maakSwatch = (h) => {
    const container = document.getElementById("swatches");

    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "card h-100 history-card " + getCardClass(h.title);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex flex-column";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = h.title;

    const text = document.createElement("p");
    text.className = "card-text flex-grow-1";
    text.textContent = h.text;

    const link = document.createElement("a");
    link.className = "btn mt-3";
    link.href = h.url;
    link.target = "_blank";
    link.textContent = "Go!";

    cardBody.appendChild(title);
    cardBody.appendChild(text);
    cardBody.appendChild(link);

    card.appendChild(cardBody);
    col.appendChild(card);

    container.appendChild(col);
};

window.addEventListener("load", setup);