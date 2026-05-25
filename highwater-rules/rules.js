// Sieged Kingdoms — rules page behaviour

const glossary = {
    "Anarchy": "A society without a set government.",
    "Collectivism": "A political theory associated with communism, meaning people should prioritize society's good over the individual's welfare.",
    "Communism": "A system of social organization in which the community owns all property, and each person contributes and receives according to their ability and needs.",
    "Conservatism": "A cultural, social, and political philosophy that seeks to promote and to preserve traditional institutions, practices, and values.",
    "Fascism": "A strict form of government, as they are a centralized autocratic government guided by a dictatorial leader.",
    "Feudalism": "A military hierarchy in which a ruler or lord gives citizens or officials a unit of land to control in exchange for military service.",
    "Georgism": "A philosophy concerned with the distribution of economic rent (caused by land ownership), monopolies, pollution, control of the commons, etc.",
    "Green": "A sub-governing style focusing on renewable energy, sub-zero emissions, enhancing buildings, and finding ways to lessen damage to the planet.",
    "Imperialism": "A system of government in which one country exercises its power, sometimes excessively, often by taking over land and gaining economic/political control.",
    "Liberalism": "A system of government relating to moral philosophy, based on the individual's rights: liberty, consent of the governed, equality, right to private property, and equality before the law.",
    "Military Junta": "A governing style where military officers, including state police, lead their country.",
    "Monarchism": "A political system in which a monarch (individual) is the Head of State, often with a group of nobility.",
    "Objectivism": "A philosophy rejecting alternative notions of rights, such as positive rights, collective rights, or animal rights, claiming that capitalism fully recognizes individual rights.",
    "Socialism": "A philosophy and movement characterized by social ownership of the means of production, as opposed to private ownership.",
    "The Third Way": "A centrist political position that attempts to reconcile right-wing and left-wing politics by advocating a varying synthesis of center-right economic policies with center-left social policies.",
    "Totalitarianism": "A system of government that is centralized and dictatorial, requiring complete subservience to the state.",
    "Traditionalism": "A focus on the importance of transcendent moral principles, often manifested through specific natural laws.",
    "Unionism": "A set of political principles based on the idea that two or more political or national units should be joined or remain together.",
    "Voluntarism": "The principle that individuals are free to choose goals and how to achieve them within societal and cultural constraints, as opposed to coerced or predetermined actions.",
    "Doxxing": "The act of publishing private documents about an individual, such as their home address, phone number or their close families' details."
};

document.addEventListener("DOMContentLoaded", () => {
    setupDrawer();
    setupGlossary();
});

// ---- Slide-in navigation drawer -------------------------------------------
function setupDrawer() {
    const sidebar = document.getElementById("mySidebar");
    if (!sidebar) return;

    const openBtn = document.querySelector(".openbtn");
    const closeBtn = sidebar.querySelector(".closebtn");

    const backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    document.body.appendChild(backdrop);

    const open = () => {
        sidebar.classList.add("open");
        backdrop.classList.add("open");
    };
    const close = () => {
        sidebar.classList.remove("open");
        backdrop.classList.remove("open");
    };

    if (openBtn) openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", close);

    sidebar.querySelectorAll("ul a").forEach((link) => {
        link.addEventListener("click", close);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });
}

// ---- Glossary term popup ---------------------------------------------------
function setupGlossary() {
    const popup = document.getElementById("popup");
    if (!popup) return;

    const hide = () => {
        popup.style.display = "none";
    };

    document.body.addEventListener("click", (e) => {
        const target = e.target;

        if (!target.classList || !target.classList.contains("highlight")) {
            hide();
            return;
        }

        const term = target.dataset.term;
        const definition = glossary[term];
        if (!definition) {
            hide();
            return;
        }

        const heading = document.createElement("strong");
        heading.className = "popup-term";
        heading.textContent = term;
        popup.replaceChildren(heading, document.createTextNode(definition));
        popup.style.display = "block";

        // keep the popup inside the viewport
        const margin = 12;
        const maxLeft = window.scrollX + document.documentElement.clientWidth - popup.offsetWidth - margin;
        const maxTop = window.scrollY + document.documentElement.clientHeight - popup.offsetHeight - margin;
        popup.style.left = `${Math.max(margin, Math.min(e.pageX + margin, maxLeft))}px`;
        popup.style.top = `${Math.max(margin, Math.min(e.pageY + margin, maxTop))}px`;
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") hide();
    });
}
