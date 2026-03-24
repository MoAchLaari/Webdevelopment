const setup = () => {
    document.querySelectorAll("li").forEach(e => {
        e.className = "listitem";
    });

    const body = document.querySelector("body");

    const img = document.createElement("img");
    img.src = "Assets/Random.png";
    img.alt = "Mijn portret!";

    body.appendChild(img);
};

window.addEventListener("load", setup);