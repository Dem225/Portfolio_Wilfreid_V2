
const SIDEBAR_ITEMS = [
    { page: "dashboard.html", label: "Vue d'ensemble", icon: "dashboard" },
    { page: "projets.html", label: "Projets", icon: "code" },
    { page: "competences.html", label: "Compétences", icon: "psychology" },
    { page: "formations.html", label: "Formations", icon: "school" },
    { page: "messages.html", label: "Messages", icon: "mail" }
];

function renderSidebar() {
    const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";

    const sidebar = document.querySelector("aside");

    if (!sidebar) return;

    sidebar.className =
        "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white";

    sidebar.innerHTML = `
        <div class="flex items-center gap-3 px-6 py-7">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <span class="material-symbols-outlined">terminal</span>
            </div>

            <div>
                <h1 class="text-lg font-bold text-gray-900">Wilfried</h1>
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
}

renderSidebar();
