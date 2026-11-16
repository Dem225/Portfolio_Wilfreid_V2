
const SIDEBAR_ITEMS = [
    { page: "dashboard.html", label: "Vue d'ensemble", icon: "dashboard" },
    { page: "projets.html", label: "Projets", icon: "code" },
    { page: "competences.html", label: "Compétences", icon: "psychology" },
    { page: "formations.html", label: "Formations", icon: "school" },
    { page: "messages.html", label: "Messages", icon: "mail" }
];

function renderSidebar() {
    const currentPage =
        window.location.pathname.split("/").pop() || "dashboard.html";

    const sidebar = document.querySelector("aside");

    if (!sidebar) {
        console.error("Barre latérale introuvable.");
        return;
    }

    sidebar.className = [
        "fixed",
        "left-0",
        "top-0",
        "z-50",
        "flex",
        "h-screen",
        "w-64",
        "flex-col",
        "border-r",
        "border-gray-200",
        "bg-white",
        "transition-transform",
        "duration-300",
        "-translate-x-full",
        "md:translate-x-0"
    ].join(" ");

    sidebar.innerHTML = `
        <div class="flex items-center gap-3 px-6 py-7">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <span class="material-symbols-outlined">terminal</span>
            </div>

            <div>
                <h1 class="text-lg font-bold text-gray-900">Wilfreid</h1>
                <p class="text-xs text-gray-500">Administration</p>
            </div>
        </div>

        <nav class="flex-1 space-y-2 px-4">
            ${SIDEBAR_ITEMS.map(item => {
                const active = currentPage === item.page;

                return `
                    <a href="${item.page}"
                       class="flex items-center gap-3 rounded-xl px-4 py-3 ${
                           active
                               ? "bg-[#5146e5] text-white"
                               : "text-gray-600 hover:bg-gray-100"
                       }">
                        <span class="material-symbols-outlined">${item.icon}</span>
                        <span class="text-sm font-medium">${item.label}</span>
                    </a>
                `;
            }).join("")}
        </nav>

        <div class="border-t border-gray-200 p-4">
            <button id="logout-btn"
                    class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 hover:bg-red-50">
                <span class="material-symbols-outlined">logout</span>
                <span class="text-sm font-medium">Déconnexion</span>
            </button>
        </div>
    `;

    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("access_token");
        window.location.href = "login.html";
    });

    setupResponsiveLayout(sidebar);
}

function setupResponsiveLayout(sidebar) {
    // Récupérer le contenu situé après la sidebar.
    const content = sidebar.nextElementSibling;

    if (!content) {
        console.error("Contenu principal introuvable.");
        return;
    }

    // Supprimer la marge fixe et appliquer une marge responsive.
    content.classList.remove("ml-64");
    content.classList.add("ml-0", "md:ml-64");

    // Récupérer le header, même s'il est dans un autre conteneur.
    const header = content.querySelector("header");

    if (!header) {
        console.error("Header introuvable.");
        return;
    }

    header.classList.remove("px-8");
    header.classList.add("px-4", "md:px-8");

    // Adapter les espacements du contenu.
    const main = content.tagName === "MAIN"
        ? content
        : content.querySelector("main");

    if (main) {
        main.classList.remove("p-8");
        main.classList.add("p-4", "md:p-8");
    }

    // Créer le fond qui recouvre la page sur mobile.
    const overlay = document.createElement("div");

    overlay.id = "sidebar-overlay";
    overlay.className =
        "fixed inset-0 z-40 hidden bg-black/40 md:hidden";

    document.body.appendChild(overlay);

    // Créer le bouton du menu mobile.
    const menuButton = document.createElement("button");

    menuButton.type = "button";
    menuButton.id = "mobile-menu-button";
    menuButton.setAttribute("aria-label", "Ouvrir le menu");
    menuButton.setAttribute("aria-expanded", "false");

    menuButton.className =
        "mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 md:hidden";

    menuButton.innerHTML =
        '<span class="material-symbols-outlined">menu</span>';

    header.prepend(menuButton);

    function openMenu() {
        sidebar.classList.remove("-translate-x-full");
        sidebar.classList.add("translate-x-0");

        overlay.classList.remove("hidden");

        menuButton.innerHTML =
            '<span class="material-symbols-outlined">close</span>';

        menuButton.setAttribute("aria-label", "Fermer le menu");
        menuButton.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
        sidebar.classList.add("-translate-x-full");
        sidebar.classList.remove("translate-x-0");

        overlay.classList.add("hidden");

        menuButton.innerHTML =
            '<span class="material-symbols-outlined">menu</span>';

        menuButton.setAttribute("aria-label", "Ouvrir le menu");
        menuButton.setAttribute("aria-expanded", "false");
    }

    menuButton.addEventListener("click", () => {
        const isOpen =
            menuButton.getAttribute("aria-expanded") === "true";

        isOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener("click", closeMenu);

    sidebar.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Fermer le menu si l'écran repasse en mode ordinateur.
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
            closeMenu();
        }
    });
}

renderSidebar();
