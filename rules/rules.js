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
    setupScrollSpy();
    setupBackToTop();
    setupParallax();
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

// ---- Highlight the section you're currently reading -----------------------
function setupScrollSpy() {
    const links = Array.from(document.querySelectorAll('.sidebar a[href^="#"]'));
    const targets = links
        .map((link) => {
            const id = decodeURIComponent(link.getAttribute("href").slice(1));
            const el = document.getElementById(id);
            return el ? { link, el } : null;
        })
        .filter(Boolean);
    if (targets.length < 2) return;

    // order targets by their position in the document
    targets.sort((a, b) =>
        a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    );

    const setActive = () => {
        const line = 140; // px below the top edge
        let current = null;
        for (const t of targets) {
            if (t.el.getBoundingClientRect().top - line <= 0) current = t;
        }

        links.forEach((l) => l.classList.remove("active"));
        // don't highlight the "Go To Top" entry
        if (current && current.link.getAttribute("href") !== "#top") {
            current.link.classList.add("active");
        }
    };

    setActive();
    window.addEventListener("scroll", setActive, { passive: true });
    window.addEventListener("resize", setActive, { passive: true });
}

// ---- Floating back-to-top button ------------------------------------------
function setupBackToTop() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.textContent = "↑";
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const toggle = () => {
        btn.classList.toggle("visible", window.scrollY > 400);
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
}

// ---- Background parallax --------------------------------------------------
function setupParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pending = false;
    const apply = (x, y) => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            document.body.style.setProperty("--par-x", `${x.toFixed(1)}px`);
            document.body.style.setProperty("--par-y", `${y.toFixed(1)}px`);
            pending = false;
        });
    };

    // Desktop: parallax follows the cursor
    if (window.matchMedia("(pointer: fine)").matches) {
        const strength = 14;
        window.addEventListener("mousemove", (event) => {
            const x = (event.clientX / window.innerWidth - 0.5) * 2;
            const y = (event.clientY / window.innerHeight - 0.5) * 2;
            apply(-x * strength, -y * strength);
        }, { passive: true });
        return;
    }

    // Mobile: parallax follows device tilt (accelerometer / gyroscope)
    if (!("DeviceOrientationEvent" in window)) return;

    const strength = 22;
    const range = 25; // degrees of tilt mapped to the full shift
    const clamp = (value, max) => Math.max(-max, Math.min(max, value));
    let baseBeta = null;
    let baseGamma = null;

    const onTilt = (event) => {
        if (event.beta === null || event.gamma === null) return;
        if (baseBeta === null) {
            baseBeta = event.beta;   // remember how the device is first held
            baseGamma = event.gamma;
        }
        const dx = clamp(event.gamma - baseGamma, range) / range; // left/right tilt
        const dy = clamp(event.beta - baseBeta, range) / range;   // front/back tilt
        apply(-dx * strength, -dy * strength);
    };

    const start = () => window.addEventListener("deviceorientation", onTilt, { passive: true });

    // Android & others: tilt works with no permission prompt
    if (typeof DeviceOrientationEvent.requestPermission !== "function") {
        start();
        return;
    }

    // iOS/Safari shows a system motion-access prompt — explain why first
    const requestTilt = () => DeviceOrientationEvent.requestPermission()
        .then((state) => { if (state === "granted") start(); })
        .catch(() => {});

    const choice = getMotionPref();
    if (choice === "off") return;            // user opted out before
    if (choice === "on") {                   // already granted — re-arm quietly on a tap
        window.addEventListener("touchend", function rearm() { requestTilt(); }, { once: true });
        return;
    }
    showMotionPrompt({
        onAllow: () => { setMotionPref("on"); requestTilt(); },
        onDismiss: () => { setMotionPref("off"); }
    });
}

// ---- iOS motion-permission explainer --------------------------------------
const MOTION_KEY = "sk-motion";
function getMotionPref() {
    try { return localStorage.getItem(MOTION_KEY); } catch (_) { return null; }
}
function setMotionPref(value) {
    try { localStorage.setItem(MOTION_KEY, value); } catch (_) { /* ignore */ }
}

function showMotionPrompt({ onAllow, onDismiss }) {
    if (document.querySelector(".motion-prompt")) return;

    const card = document.createElement("div");
    card.className = "motion-prompt";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", "Motion access");
    card.innerHTML =
        "<p>This site can use your phone’s gyroscope for a parallax effect.</p>" +
        '<div class="motion-actions">' +
        '<button type="button" class="motion-dismiss">No thanks</button>' +
        '<button type="button" class="motion-allow">Enable</button>' +
        "</div>";
    document.body.appendChild(card);
    requestAnimationFrame(() => card.classList.add("visible"));

    const close = () => {
        card.classList.remove("visible");
        setTimeout(() => card.remove(), 350);
    };
    card.querySelector(".motion-allow").addEventListener("click", () => { onAllow(); close(); });
    card.querySelector(".motion-dismiss").addEventListener("click", () => { onDismiss(); close(); });
}
