(function () {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

    const searchInput = $("#searchInput");
    const emptyState = $("#emptyState");
    const openAllBtn = $("#openAllBtn");
    const closeAllBtn = $("#closeAllBtn");

    const allDetails = $$("details.lab");
    const allLinks = $$("a[href]");
    const semesterCards = $$(".card");

    // Keyboard shortcut: Ctrl + /
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "/") {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === "Escape") {
            searchInput.value = "";
            applyFilter("");
            searchInput.blur();
        }
    });

    // Add counts per lab + per semester
    allDetails.forEach(d => {
        const count = $$("ol a[href]", d).length;
        const meta = $(".meta", d);
        if (meta) meta.textContent = count ? `${count} links` : "";
    });

    function updateSemesterCounts() {
        const cards = semesterCards;
        cards.forEach(card => {
            const visibleLinks = $$("a[href]", card).filter(a => a.closest("details") && !a.closest("details").hidden);
            const pill = card.querySelector(".pill");
            if (pill) pill.textContent = `${visibleLinks.length} links`;
        });
    }

    function applyFilter(raw) {
        const q = raw.trim().toLowerCase();
        let anyVisible = false;

        allDetails.forEach(d => {
            const summaryText = $("summary", d).innerText.toLowerCase();
            const items = $$("ol li", d);

            let hasMatchInThisLab = false;

            items.forEach(li => {
                const text = li.innerText.toLowerCase();
                const match = !q || text.includes(q) || summaryText.includes(q);
                li.hidden = !match;
                if (match) hasMatchInThisLab = true;
            });

            // Hide entire lab if nothing matches (except when q empty)
            d.hidden = !!q && !hasMatchInThisLab && !summaryText.includes(q);

            // Auto-open labs when searching so results are visible
            if (q && !d.hidden && hasMatchInThisLab) d.open = true;

            if (!d.hidden) anyVisible = true;
        });

        emptyState.hidden = anyVisible;
        updateSemesterCounts();
    }

    searchInput.addEventListener("input", (e) => applyFilter(e.target.value));

    openAllBtn.addEventListener("click", () => {
        allDetails.forEach(d => { if (!d.hidden) d.open = true; });
    });

    closeAllBtn.addEventListener("click", () => {
        allDetails.forEach(d => d.open = false);
    });

    // Initial counts
    updateSemesterCounts();
})();