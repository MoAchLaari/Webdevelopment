"use strict";

/*
    StorageUtil handles localStorage safely.
    This prevents repeated JSON.parse and JSON.stringify everywhere.
*/
class StorageUtil {
    static get(key, fallback = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch (error) {
            console.warn(`Could not read localStorage key: ${key}`, error);
            return fallback;
        }
    }

    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static remove(key) {
        localStorage.removeItem(key);
    }

    static has(key) {
        return localStorage.getItem(key) !== null;
    }
}

/*
    Popup creates a simple modal message.
    It can be closed with the X button, by clicking the background, or with Escape.
*/
class Popup {
    constructor(content, title = "Message") {
        this.background = document.createElement("div");
        this.background.className = "popup-background";

        this.element = document.createElement("div");
        this.element.className = "popup";
        this.element.setAttribute("role", "dialog");
        this.element.setAttribute("aria-modal", "true");

        const header = document.createElement("div");
        header.className = "popup-header";

        const titleEl = document.createElement("h3");
        titleEl.className = "popup-title";
        titleEl.textContent = title;

        const closeBtn = document.createElement("button");
        closeBtn.className = "close-btn";
        closeBtn.type = "button";
        closeBtn.textContent = "×";
        closeBtn.setAttribute("aria-label", "Close popup");

        const message = document.createElement("p");
        message.className = "popup-message";
        message.textContent = content;

        header.appendChild(titleEl);
        header.appendChild(closeBtn);

        this.element.appendChild(header);
        this.element.appendChild(message);

        document.body.appendChild(this.background);
        document.body.appendChild(this.element);

        this.handleEscape = (event) => {
            if (event.key === "Escape") {
                this.close();
            }
        };

        closeBtn.addEventListener("click", () => this.close());
        this.background.addEventListener("click", () => this.close());
        document.addEventListener("keydown", this.handleEscape);
    }

    close() {
        this.element.remove();
        this.background.remove();
        document.removeEventListener("keydown", this.handleEscape);
    }
}

/*
    Main application class.
    It reads commands, opens the search link, and saves the history.
*/
class StartPage {
    constructor() {
        this.storage = {
            cardKey: "startPage.cards",
            sortDirectionKey: "startPage.sortDirection"
        };

        /*
            Each command has:
            key: what the user types after /
            name: the display name
            color: used for the card style
            buildUrl: creates the final search URL
        */
        this.commands = [
            {
                key: "g",
                name: "Google",
                color: "#2f70e9",
                buildUrl: (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`
            },
            {
                key: "y",
                name: "YouTube",
                color: "#ff0000",
                buildUrl: (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
            },
            {
                key: "x",
                name: "X",
                color: "#1d9bf0",
                buildUrl: (query) => `https://x.com/search?q=${encodeURIComponent(query)}`
            },
            {
                key: "i",
                name: "Instagram",
                color: "#fc0077",
                buildUrl: (query) => `https://www.instagram.com/explore/tags/${encodeURIComponent(query.replace(/\s+/g, ""))}/`
            },
            {
                key: "d",
                name: "DuckDuckGo",
                color: "#de5833",
                buildUrl: (query) => `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
            },
            {
                key: "t",
                name: "TikTok",
                color: "#fe2c55",
                buildUrl: (query) => `https://www.tiktok.com/search?q=${encodeURIComponent(query)}`
            }
        ];

        this.sortAscending = this.loadSortDirection();
        this.elements = {};

        this.init();
    }

    init() {
        this.initElements();
        this.setupEventListeners();
        this.updateSortButtonText();
        this.refreshCardDisplay();
    }

    initElements() {
        this.elements.form = document.querySelector("#search-form");
        this.elements.commandInput = document.querySelector("#command-input");
        this.elements.cardsContainer = document.querySelector("#cards-container");
        this.elements.changeSort = document.querySelector("#change-sort");
        this.elements.clearHistory = document.querySelector("#clear-history");
        this.elements.emptyState = document.querySelector("#empty-state");
    }

    setupEventListeners() {
        this.elements.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.submit();
        });

        this.elements.changeSort.addEventListener("click", () => {
            this.changeSortDirection();
        });

        this.elements.clearHistory.addEventListener("click", () => {
            this.clearHistory();
        });
    }

    submit() {
        const inputValue = this.elements.commandInput.value.trim();
        const commandInfo = this.parseCommand(inputValue);

        if (!commandInfo) {
            return;
        }

        const newCard = {
            id: this.createId(),
            key: commandInfo.key,
            name: commandInfo.name,
            color: commandInfo.color,
            query: commandInfo.query,
            link: commandInfo.link,
            createdAt: new Date().toISOString()
        };

        this.openLink(newCard.link);
        this.saveToStorage(newCard);
        this.resetInput();
        this.refreshCardDisplay();
    }

    /*
        Expected command format:
        /g cats
        /y music
        /d javascript tutorial
    */
    parseCommand(input) {
        if (!input) {
            new Popup("Type a command first. Example: /g cats", "Error");
            return null;
        }

        const match = input.match(/^\/([a-z])\s+(.+)$/i);

        if (!match) {
            new Popup("Use this format: /g your search text", "Error");
            return null;
        }

        const key = match[1].toLowerCase();
        const query = match[2].trim();

        const command = this.commands.find((item) => item.key === key);

        if (!command) {
            const commandList = this.commands.map((item) => `/${item.key}`).join(", ");
            new Popup(`Unknown command "/${key}". Available commands: ${commandList}`, "Error");
            return null;
        }

        return {
            key: command.key,
            name: command.name,
            color: command.color,
            query: query,
            link: command.buildUrl(query)
        };
    }

    addCard(cardInfo) {
        const card = document.createElement("article");
        card.className = "card";
        card.style.setProperty("--card-color", cardInfo.color);

        const content = document.createElement("div");
        content.className = "card-content";

        const top = document.createElement("div");
        top.className = "card-top";

        const badge = document.createElement("span");
        badge.className = "card-badge";
        badge.textContent = cardInfo.name;

        const date = document.createElement("span");
        date.className = "card-date";
        date.textContent = this.formatDate(cardInfo.createdAt);

        const title = document.createElement("h3");
        title.textContent = cardInfo.query;

        const description = document.createElement("p");
        description.textContent = `Search on ${cardInfo.name}`;

        const actions = document.createElement("div");
        actions.className = "card-actions";

        const link = document.createElement("a");
        link.href = cardInfo.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Open";

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-card";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            this.deleteCard(cardInfo.id);
        });

        top.appendChild(badge);
        top.appendChild(date);

        actions.appendChild(link);
        actions.appendChild(deleteButton);

        content.appendChild(top);
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(actions);

        card.appendChild(content);

        this.elements.cardsContainer.appendChild(card);
    }

    saveToStorage(card) {
        const list = StorageUtil.get(this.storage.cardKey, []);
        list.push(card);
        StorageUtil.set(this.storage.cardKey, list);
    }

    getCards() {
        return StorageUtil.get(this.storage.cardKey, []);
    }

    getSortedCards() {
        const list = this.getCards();

        return [...list].sort((a, b) => {
            const nameComparison = a.name.localeCompare(b.name);

            if (nameComparison !== 0) {
                return nameComparison;
            }

            return a.query.localeCompare(b.query);
        });
    }

    refreshCardDisplay() {
        this.elements.cardsContainer.innerHTML = "";

        let sortedCards = this.getSortedCards();

        if (!this.sortAscending) {
            sortedCards.reverse();
        }

        sortedCards.forEach((card) => {
            this.addCard(card);
        });

        this.elements.emptyState.style.display = sortedCards.length === 0 ? "block" : "none";
    }

    deleteCard(id) {
        const updatedList = this.getCards().filter((card) => card.id !== id);
        StorageUtil.set(this.storage.cardKey, updatedList);
        this.refreshCardDisplay();
    }

    clearHistory() {
        const cards = this.getCards();

        if (cards.length === 0) {
            new Popup("There is no history to clear.", "Info");
            return;
        }

        const confirmed = confirm("Are you sure you want to clear all history?");

        if (!confirmed) {
            return;
        }

        StorageUtil.remove(this.storage.cardKey);
        this.refreshCardDisplay();
    }

    changeSortDirection() {
        this.sortAscending = !this.sortAscending;
        this.saveSortDirection();
        this.updateSortButtonText();
        this.refreshCardDisplay();
    }

    updateSortButtonText() {
        this.elements.changeSort.textContent = this.sortAscending
            ? "Sort: A → Z"
            : "Sort: Z → A";
    }

    saveSortDirection() {
        StorageUtil.set(this.storage.sortDirectionKey, this.sortAscending);
    }

    loadSortDirection() {
        return StorageUtil.has(this.storage.sortDirectionKey)
            ? StorageUtil.get(this.storage.sortDirectionKey, true)
            : true;
    }

    resetInput() {
        this.elements.commandInput.value = "";
        this.elements.commandInput.focus();
    }

    openLink(url) {
        window.open(url, "_blank", "noopener,noreferrer");
    }

    createId() {
        if (crypto.randomUUID) {
            return crypto.randomUUID();
        }

        return `${Date.now()}-${Math.random()}`;
    }

    formatDate(dateString) {
        if (!dateString) {
            return "";
        }

        const date = new Date(dateString);

        return date.toLocaleDateString("nl-BE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }
}

window.addEventListener("load", () => {
    new StartPage();
});