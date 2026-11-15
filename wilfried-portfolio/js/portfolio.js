
    const API_URL = "https://wilfreid-portfolio-api.onrender.com";

    // SÃ©curisation du texte affichÃ© dans le HTML
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]);
    }

/* ==============================
   PRELOADER
============================== */

function setupPreloader() {
    const preloader = document.getElementById("preloader");
    const percentage = document.getElementById("loader-percent");
    const progressBar = document.getElementById("loader-progress-bar");

    if (!preloader || !percentage || !progressBar) return;

    let progress = 0;
    let finished = false;

    function updateProgress() {
        if (finished) return;

        // Progression visuelle pendant le chargement
        if (progress < 90) {
            progress += Math.max(1, Math.ceil((90 - progress) / 45));
        }

        percentage.textContent = progress;
        progressBar.style.width = `${progress}%`;

        requestAnimationFrame(() => {
            if (progress < 90) {
               setTimeout(updateProgress, 100);
            }
        });
    }

    updateProgress();

    window.addEventListener("load", () => {
        if (finished) return;

        finished = true;
        progress = 100;

        percentage.textContent = "100";
        progressBar.style.width = "100%";

        setTimeout(() => {
            preloader.classList.add("preloader-hidden");
            document.body.classList.add("page-loaded");

            setTimeout(() => {
                preloader.remove();
            }, 750);
        }, 600);
    }, { once: true });
}

// Lancement immédiat du préchargeur
setupPreloader();




    // VÃ©rification des liens externes
    function safeURL(value) {
        if (!value) return null;

        const cleanedValue = String(value).trim();

        // Accepter les chemins d'images locaux
        if (
            cleanedValue.startsWith("images/") ||
            cleanedValue.startsWith("./images/")
        ) {
            return cleanedValue;
        }

        // Accepter les liens HTTP et HTTPS
        try {
            const url = new URL(cleanedValue);

            return ["http:", "https:"].includes(url.protocol)
                ? url.href
                : null;
        } catch {
            return null;
        }
    }
    // Formatage des dates
    function formatDate(value) {
        if (!value) return "Date non prÃ©cisÃ©e";

        const date = new Date(`${value}T00:00:00`);

        if (Number.isNaN(date.getTime())) return value;

        return new Intl.DateTimeFormat("fr-FR", {
            month: "long",
            year: "numeric"
        }).format(date);
    }

    // Chargement des compÃ©tences
    async function loadSkills() {
        const container = document.getElementById("skills-container");

        try {
            const response = await fetch(`${API_URL}/skills/`);

            if (!response.ok) {
                throw new Error("Impossible de charger les compÃ©tences.");
            }

            const skills = await response.json();

            if (!Array.isArray(skills) || skills.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        Les compÃ©tences seront bientÃ´t disponibles.
                    </div>
                `;
                return;
            }

            container.innerHTML = skills.map(skill => {
                const icon = escapeHTML(skill.icon || "terminal");

                return `
                    <article class="skill-card">
                        <div class="skill-icon">
                            ${getSkillIcon(skill.icon)}
                        </div>

                        <h3>${escapeHTML(skill.name)}</h3>

                        <p>${escapeHTML(skill.category)}</p>

                        <span class="skill-level">
                            ${escapeHTML(skill.level)}
                        </span>
                    </article>
                `;
            }).join("");

        } catch (error) {
            console.error("Erreur compÃ©tences :", error);

            container.innerHTML = `
                <div class="empty-state error-state">
                    Impossible de charger les compÃ©tences.
                    VÃ©rifiez que le serveur API est dÃ©marrÃ©.
                </div>
            `;
        }
    }

    // Chargement des projets
    async function loadProjects() {
        const container = document.getElementById("projects-container");

        try {
            const response = await fetch(`${API_URL}/projects/`);

            if (!response.ok) {
                throw new Error("Impossible de charger les projets.");
            }

            const projects = await response.json();

            if (!Array.isArray(projects) || projects.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        Mes rÃ©alisations seront bientÃ´t prÃ©sentÃ©es ici.
                    </div>
                `;
                return;
            }

            // Les projets mis en avant apparaissent en premier
            projects.sort((a, b) =>
                Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured))
            );

            container.innerHTML = projects.map(project => {
                const imageURL = safeURL(project.image_url);
                const githubURL = safeURL(project.github_url);
                const demoURL = safeURL(project.demo_url);

                const technologies = Array.isArray(project.technologies)
                    ? project.technologies
                    : [];

                return `
                    <article class="project-card">

                        <div class="project-image">
                            ${
                                imageURL
                                    ? `<img src="${escapeHTML(imageURL)}"
                                        alt="${escapeHTML(project.title)}"
                                        loading="lazy"
                                        onerror="this.style.display='none'">`
                                    : `<span class="material-symbols-outlined project-placeholder">terminal</span>`
                            }
                        </div>

                        <div class="project-body">

                            <h3>${escapeHTML(project.title)}</h3>

                            <p>${escapeHTML(project.description)}</p>

                            <div class="project-technologies">
                                ${technologies.map(technology => `
                                    <span>${escapeHTML(technology)}</span>
                                `).join("")}
                            </div>

                            <div class="project-links">
                                ${
                                    githubURL
                                        ? `<a href="${escapeHTML(githubURL)}"
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            <span class="material-symbols-outlined">code</span>
                                            Code source
                                        </a>`
                                        : ""
                                }

                                ${
                                    demoURL
                                        ? `<a href="${escapeHTML(demoURL)}"
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            <span class="material-symbols-outlined">open_in_new</span>
                                            DÃ©mo
                                        </a>`
                                        : ""
                                }
                            </div>

                        </div>
                    </article>
                `;
            }).join("");

        } catch (error) {
            console.error("Erreur projets :", error);

            container.innerHTML = `
                <div class="empty-state error-state">
                    Impossible de charger les projets.
                    VÃ©rifiez que le serveur API est dÃ©marrÃ©.
                </div>
            `;
        }
    }

    // Chargement des formations
    async function loadFormations() {
        const container = document.getElementById("formations-container");

        try {
            const response = await fetch(`${API_URL}/formations/`);

            if (!response.ok) {
                throw new Error("Impossible de charger les formations.");
            }

            const formations = await response.json();

            if (!Array.isArray(formations) || formations.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        Mon parcours sera bientÃ´t disponible.
                    </div>
                `;
                return;
            }

            container.innerHTML = formations.map(formation => {
                const certificateURL = safeURL(formation.certificate_url);

                const startDate = formation.start_date
                    ? formatDate(formation.start_date)
                    : "";

                const endDate = formation.end_date
                    ? formatDate(formation.end_date)
                    : "";

                const period = [startDate, endDate].filter(Boolean).join(" â€” ");

                return `
                    <article class="timeline-item">
                        <div class="timeline-card">

                            <span class="timeline-date">
                                ${escapeHTML(period || formation.type || "Formation")}
                            </span>

                            <h3>${escapeHTML(formation.title)}</h3>

                            <p>
                                <strong>${escapeHTML(formation.institution)}</strong>
                            </p>

                            <p>${escapeHTML(formation.description)}</p>

                            ${
                                formation.is_completed
                                    ? `<span class="skill-level">Formation terminÃ©e</span>`
                                    : `<span class="skill-level">En cours ou Ã  suivre</span>`
                            }

                            ${
                                certificateURL
                                    ? `<p>
                                        <a class="text-link"
                                        href="${escapeHTML(certificateURL)}"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                            Voir le certificat
                                            <span class="material-symbols-outlined">open_in_new</span>
                                        </a>
                                    </p>`
                                    : ""
                            }

                        </div>
                    </article>
                `;
            }).join("");

        } catch (error) {
            console.error("Erreur formations :", error);

            container.innerHTML = `
                <div class="empty-state error-state">
                    Impossible de charger le parcours.
                    VÃ©rifiez que le serveur API est dÃ©marrÃ©.
                </div>
            `;
        }
    }

    // Envoi du formulaire de contact
    async function handleContactForm(event) {
        event.preventDefault();

        const form = document.getElementById("contact-form");
        const status = document.getElementById("contact-status");
        const submitButton = form.querySelector("button[type='submit']");

        const formData = new FormData(form);

        const message = {
            name: formData.get("name").trim(),
            email: formData.get("email").trim(),
            subject: formData.get("subject").trim(),
            message: formData.get("message").trim()
        };

        status.textContent = "Envoi de votre message...";
        status.style.color = "#c5c1ff";
        submitButton.disabled = true;
        submitButton.style.opacity = "0.6";

        try {
            const response = await fetch(`${API_URL}/contact/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(message)
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    result.detail || "Une erreur est survenue pendant l'envoi."
                );
            }

            status.textContent = "Votre message a Ã©tÃ© envoyÃ© avec succÃ¨s. Merci !";
            status.style.color = "#38c98b";

            form.reset();

        } catch (error) {
            console.error("Erreur formulaire :", error);

            status.textContent =
                error.message || "Impossible d'envoyer le message. RÃ©essayez.";

            status.style.color = "#ff7777";

        } finally {
            submitButton.disabled = false;
            submitButton.style.opacity = "1";
        }
    }



    // Gestion du thème sombre et clair
    function setupThemeToggle() {
        const themeToggle = document.getElementById("themeToggle");
        const themeIcon = document.getElementById("themeIcon");

        if (!themeToggle || !themeIcon) return;

        // Restaurer le dernier thème choisi
        const savedTheme = localStorage.getItem("portfolio-theme");
        const initialTheme = savedTheme === "light" ? "light" : "dark";

        function applyTheme(theme) {
            document.documentElement.setAttribute("data-theme", theme);

            themeIcon.textContent = theme === "dark"
                ? "light_mode"
                : "dark_mode";

            themeToggle.setAttribute(
                "aria-label",
                theme === "dark"
                    ? "Activer le thème clair"
                    : "Activer le thème sombre"
            );

            localStorage.setItem("portfolio-theme", theme);
        }

        applyTheme(initialTheme);

        // Changer de thème au clic
        themeToggle.addEventListener("click", () => {
            const currentTheme =
                document.documentElement.getAttribute("data-theme");

            const newTheme = currentTheme === "dark" ? "light" : "dark";

            applyTheme(newTheme);
        });
    }
    
    // Menu mobile
    function setupMobileMenu() {
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.getElementById("navLinks");

        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");

            const icon = menuToggle.querySelector(".material-symbols-outlined");

            icon.textContent = navLinks.classList.contains("open")
                ? "close"
                : "menu";
        });

        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");

                menuToggle.querySelector(
                    ".material-symbols-outlined"
                ).textContent = "menu";
            });
        });
    }

    // Initialisation du portfolio
    document.addEventListener("DOMContentLoaded", () => {
        setupThemeToggle();

        loadSkills();
        
        loadProjects();
        loadFormations();

        document.getElementById("contact-form")
            .addEventListener("submit", handleContactForm);

        setupMobileMenu();
    });
    setupScrollReveal();


    // Animations dÃ©clenchÃ©es pendant le dÃ©filement
        
    function setupScrollReveal() {
        const selectors = [
            ".section-heading",
            ".about-content",
            ".tech-strip",
            ".skill-card",
            ".project-card",
            ".timeline-item",
            ".contact-panel"
        ].join(", ");

        if (!("IntersectionObserver" in window)) {
            document.querySelectorAll(selectors).forEach(element => {
                element.classList.add("is-visible");
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        function observeElements(container = document) {
            container.querySelectorAll(selectors).forEach(element => {
                if (!element.classList.contains("reveal-on-scroll")) {
                    element.classList.add("reveal-on-scroll");
                    observer.observe(element);
                }
            });
        }

        // Éléments déjà présents
        observeElements();

        // Détection des éléments ajoutés dynamiquement
        const mutationObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches(selectors)) {
                            if (!node.classList.contains("reveal-on-scroll")) {
                                node.classList.add("reveal-on-scroll");
                                observer.observe(node);
                            }
                        }

                        observeElements(node);
                    }
                });
            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

