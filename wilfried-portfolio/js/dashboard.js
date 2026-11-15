
const DASHBOARD_API_URL = "https://wilfreid-portfolio-api.onrender.com";

// RÃ©cupÃ©rer le token administrateur
const token = localStorage.getItem("access_token");

// Fonction pour rÃ©cupÃ©rer les donnÃ©es de l'API
async function fetchAPI(endpoint) {
    const response = await fetch(`${DASHBOARD_API_URL}${endpoint}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Erreur API : ${endpoint}`);
    }

    return await response.json();
}

// Charger les statistiques
async function loadDashboard() {
    try {
        const [
            projects,
            skills,
            formations,
            messages
        ] = await Promise.all([
            fetchAPI("/projects/"),
            fetchAPI("/skills/"),
            fetchAPI("/formations/"),
            fetchAPI("/contact/")
        ]);

        // Afficher les statistiques
        document.getElementById("total-projects").textContent = projects.length;
        document.getElementById("total-skills").textContent = skills.length;
        document.getElementById("total-formations").textContent = formations.length;
        document.getElementById("total-messages").textContent = messages.length;

        // Compter les messages non lus
        const unreadMessages = messages.filter(
            message => !message.is_read
        );

        document.getElementById("unread-messages").textContent =
            unreadMessages.length;

        // Afficher les messages rÃ©cents
        displayRecentMessages(messages);

        // Afficher les projets rÃ©cents
        displayRecentProjects(projects);

    } catch (error) {
        console.error("Erreur de chargement du dashboard :", error);
    }
}


// Afficher les messages rÃ©cents
function displayRecentMessages(messages) {
    const container = document.getElementById("recent-messages");

    if (!messages.length) {
        container.innerHTML = `
            <p class="py-6 text-center text-sm text-gray-400">
                Aucun message reÃ§u pour le moment.
            </p>
        `;
        return;
    }

    const recentMessages = [...messages]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);

    container.innerHTML = recentMessages.map(message => `
        <div class="border-b border-gray-100 py-3">
            <div class="flex justify-between gap-3">
                <p class="font-semibold text-gray-800">
                    ${escapeHTML(message.name)}
                </p>

                <span class="text-xs ${
                    message.is_read ? "text-gray-400" : "text-green-600"
                }">
                    ${message.is_read ? "Lu" : "Non lu"}
                </span>
            </div>

            <p class="mt-1 text-sm font-medium text-gray-600">
                ${escapeHTML(message.subject)}
            </p>

            <p class="mt-1 text-xs text-gray-400">
                ${new Date(message.created_at).toLocaleDateString("fr-FR")}
            </p>
        </div>
    `).join("");
}


// Afficher les projets rÃ©cents
function displayRecentProjects(projects) {
    const container = document.getElementById("recent-projects");

    if (!projects.length) {
        container.innerHTML = `
            <p class="py-6 text-center text-sm text-gray-400">
                Aucun projet enregistrÃ© pour le moment.
            </p>
        `;
        return;
    }

    const recentProjects = [...projects].slice(-3).reverse();

    container.innerHTML = recentProjects.map(project => `
        <div class="border-b border-gray-100 py-3">
            <p class="font-semibold text-gray-800">
                ${escapeHTML(project.title)}
            </p>
        </div>
    `).join("");
}


// Ã‰viter l'injection de code HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}


// DÃ©connexion
const logoutButton = document.getElementById("logout-btn");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("access_token");
        window.location.href = "login.html";
    });
}


// Lancer le chargement
loadDashboard();
