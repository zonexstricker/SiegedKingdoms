// Sieged Kingdoms — landing page behaviour

(() => {
    "use strict";

    // --- Live server status -------------------------------------------------
    const SERVER_ADDRESS = "172.255.251.28:25577";
    const statusEl = document.getElementById("server-status");

    async function loadServerStatus() {
        if (!statusEl) return;

        try {
            const res = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER_ADDRESS}`);
            const data = await res.json();

            if (data.online) {
                const serverName = "<span><span style=\"color: #aa00aa;\">--===</span><span style=\"color: #55ff55;font-weight: bold;\"> Sieged Kingdoms:</span><span style=\"color: #ffaa00;font-weight: bold;\"> World at War</span><span style=\"color: #aa00aa;\"> ===--</span>";

                statusEl.innerHTML = `
                    <div class="server-info">
                        <div class="server-logo">
                            <img src="${data.icon}" alt="Server Logo" class="logo" />
                        </div>
                        <div class="server-details">
                            <h3 class="server-name">${serverName}</h3>
                            <p class="server-status"><span class="online">Online</span></p>
                            <p class="player-count">${data.players.online} / ${data.players.max} Players</p>
                        </div>
                    </div>`;
            } else {
                statusEl.innerHTML = `
                    <div class="server-info">
                        <div class="server-logo">
                            <img src="default-logo.png" alt="Server Logo" class="logo" />
                        </div>
                        <div class="server-details">
                            <h3 class="server-name">Server Offline</h3>
                            <p class="server-status"><span class="offline">Offline</span></p>
                        </div>
                    </div>`;
            }
        } catch (error) {
            statusEl.innerHTML = `<p>Error fetching server status: ${error.message}</p>`;
        }
    }

    // --- Promotional slideshow ----------------------------------------------
    function startSlideshow() {
        const slides = document.querySelectorAll(".photo-album img");
        if (slides.length < 2) return;

        let index = 0;
        setInterval(() => {
            slides[index].classList.remove("active");
            index = (index + 1) % slides.length;
            slides[index].classList.add("active");
        }, 5000);
    }

    // --- Background parallax ------------------------------------------------
    function setupParallax() {
        const motionOK = window.matchMedia("(prefers-reduced-motion: reduce)").matches === false;
        const finePointer = window.matchMedia("(pointer: fine)").matches;
        if (!motionOK || !finePointer) return;

        const strength = 14;
        let pending = false;

        window.addEventListener("mousemove", (event) => {
            if (pending) return;
            pending = true;
            requestAnimationFrame(() => {
                const x = (event.clientX / window.innerWidth - 0.5) * 2;
                const y = (event.clientY / window.innerHeight - 0.5) * 2;
                document.body.style.setProperty("--par-x", `${(-x * strength).toFixed(1)}px`);
                document.body.style.setProperty("--par-y", `${(-y * strength).toFixed(1)}px`);
                pending = false;
            });
        }, { passive: true });
    }

    loadServerStatus();
    startSlideshow();
    setupParallax();
})();
