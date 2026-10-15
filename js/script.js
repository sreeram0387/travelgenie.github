document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const menuBtn = document.querySelector("#menu-btn");

    if (navbar && menuBtn) {
        const closeMenu = () => {
            navbar.classList.remove("active");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.setAttribute("aria-label", "Open navigation");
            menuBtn.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        };

        menuBtn.addEventListener("click", () => {
            const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
            navbar.classList.toggle("active", !isOpen);
            menuBtn.setAttribute("aria-expanded", String(!isOpen));
            menuBtn.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
            menuBtn.innerHTML = isOpen
                ? '<i class="fa-solid fa-bars" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
        });

        navbar.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    }

    const video = document.querySelector(".about .video-container .video");
    document.querySelectorAll(".about .video-container .controls .control-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const source = button.getAttribute("data-src");

            if (video && source) {
                video.src = source;
                video.load();
                document.querySelectorAll(".about .video-container .controls .control-btn").forEach((control) => {
                    const isActive = control === button;
                    control.classList.toggle("is-active", isActive);
                    control.setAttribute("aria-pressed", String(isActive));
                });
            }
        });
    });

    const showcase = document.querySelector(".hero-showcase");
    const orbitRing = document.querySelector(".orbit-ring");
    const currentCount = document.querySelector(".showcase-current");
    const showcaseControls = document.querySelectorAll(".showcase-control");

    if (showcase && orbitRing && currentCount) {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const pauseButton = document.querySelector(".showcase-pause");
        let currentIndex = 0;
        let timer;
        let paused = reducedMotion.matches;

        const updateShowcase = (direction) => {
            currentIndex = (currentIndex + direction + 5) % 5;
            currentCount.textContent = String(currentIndex + 1).padStart(2, "0");
            showcase.style.setProperty("--ring-turn", `${currentIndex * -72}deg`);
        };

        const stopRotation = () => {
            window.clearInterval(timer);
            timer = undefined;
        };

        const startRotation = () => {
            stopRotation();
            if (!paused && !document.hidden) {
                timer = window.setInterval(() => updateShowcase(1), 8500);
            }
        };

        showcaseControls.forEach((button) => {
            if (button === pauseButton) {
                return;
            }
            button.addEventListener("click", () => {
                updateShowcase(Number(button.dataset.direction));
                startRotation();
            });
        });

        if (pauseButton) {
            pauseButton.addEventListener("click", () => {
                paused = !paused;
                const icon = pauseButton.querySelector("i");
                pauseButton.setAttribute("aria-label", paused ? "Resume destination rotation" : "Pause destination rotation");
                icon.classList.toggle("fa-pause", !paused);
                icon.classList.toggle("fa-play", paused);
                startRotation();
            });
        }

        document.addEventListener("visibilitychange", startRotation);
        reducedMotion.addEventListener("change", (event) => {
            if (event.matches) {
                paused = true;
                if (pauseButton) {
                    pauseButton.setAttribute("aria-label", "Resume destination rotation");
                    pauseButton.querySelector("i").classList.replace("fa-pause", "fa-play");
                }
            }
            startRotation();
        });

        showcase.addEventListener("pointermove", (event) => {
            if (event.pointerType === "touch") {
                return;
            }
            const bounds = showcase.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            showcase.style.setProperty("--tilt-y", `${x * 8}deg`);
            showcase.style.setProperty("--tilt-x", `${y * -6}deg`);
        });

        showcase.addEventListener("pointerleave", () => {
            showcase.style.setProperty("--tilt-y", "0deg");
            showcase.style.setProperty("--tilt-x", "0deg");
        });

        startRotation();
    }
});
