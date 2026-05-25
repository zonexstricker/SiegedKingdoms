// Sieged Kingdoms — landing page behaviour

(() => {
    "use strict";

    // --- Live server status -------------------------------------------------
    const SERVER_ADDRESS = "185.207.165.18:19011";
    const statusEl = document.getElementById("server-status");

    async function loadServerStatus() {
        if (!statusEl) return;

        try {
            const res = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER_ADDRESS}`);
            const data = await res.json();

            if (data.online) {
                const serverName = "Sieged Kingdoms: Elysium</span>";

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

        // iOS 13+ only delivers tilt after permission, requested on a user gesture
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
            window.addEventListener("touchend", function request() {
                DeviceOrientationEvent.requestPermission()
                    .then((state) => { if (state === "granted") start(); })
                    .catch(() => {});
            }, { once: true });
        } else {
            start();
        }
    }

    loadServerStatus();
    startSlideshow();
    setupParallax();
})();
