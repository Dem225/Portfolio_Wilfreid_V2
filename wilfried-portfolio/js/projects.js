
const PROJECTS_API_URL = "https://wilfreid-portfolio-api.onrender.com/projects/";

const projectsContainer = document.getElementById("projects-container");
const projectForm = document.getElementById("project-form");
const formSection = document.getElementById("project-form-section");
const statusBox = document.getElementById("project-status");

const openFormButton = document.getElementById("open-project-form");
const closeFormButton = document.getElementById("close-project-form");
const cancelFormButton = document.getElementById("cancel-project-form");

let editingProjectId = null;

const token = localStorage.getItem("access_token");


// Afficher un message
function showStatus(message, success = true) {
    statusBox.textContent = message;
    statusBox.className = success
        ? "mb-6 p-4 rounded-lg text-sm bg-green-50 text-green-700"
        : "mb-6 p-4 rounded-lg text-sm bg-red-50 text-red-700";
}


// SÃ©curiser les textes affichÃ©s
function escapeProjectHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}


// RequÃªte vers l'API
async function projectRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Authorization": `Bearer ${token}`,
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...options.headers
        }
    });

    if (!response.ok) {
        let detail = "Une erreur est survenue.";

        try {
            const data = await response.json();
            detail = typeof data.detail === "string"
                ? data.detail
                : JSON.stringify(data.detail);
        } catch {
            detail = `Erreur HTTP ${response.status}`;
        }

        throw new Error(detail);
    }

    if (response.status === 204) {
        return null;
    }

    return await response.json();
}


// Charger tous les projets
async function loadProjects() {
    try {
        const projects = await projectRequest(PROJECTS_API_URL);

        if (projects.length === 0) {
            projectsContainer.innerHTML = `
                <p class="text-center text-gray-400 py-8">
                    Aucun projet enregistrÃ© pour le moment.
                </p>
            `;
            return;
        }

        projectsContainer.innerHTML = projects.map(project => `
            <article class="border border-gray-200 rounded-xl p-5 mb-4">

                <div class="flex flex-col md:flex-row justify-between gap-4">

                    <div class="flex-1">

                        <div class="flex items-center gap-2 flex-wrap">

                            <h4 class="font-bold text-gray-900">
                                ${escapeProjectHTML(project.title)}
                            </h4>

                            ${project.is_featured ? `
                                <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    Mis en avant
                                </span>
                            ` : ""}

                        </div>

                        <p class="text-sm text-gray-500 mt-2">
                            ${escapeProjectHTML(project.description)}
                        </p>

                        <p class="text-xs text-gray-400 mt-3">
                            Slug : ${escapeProjectHTML(project.slug)}
                        </p>

                        <div class="flex flex-wrap gap-2 mt-3">

                            ${(project.technologies || []).map(technology => `
                                <span class="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                    ${escapeProjectHTML(technology)}
                                </span>
                            `).join("")}

                        </div>

                        <div class="flex flex-wrap gap-4 mt-4 text-sm">

                            ${project.github_url ? `
                                <a href="${escapeProjectHTML(project.github_url)}" target="_blank" rel="noopener noreferrer" class="text-gray-700 underline">
                                    GitHub
                                </a>
                            ` : ""}

                            ${project.demo_url ? `
                                <a href="${escapeProjectHTML(project.demo_url)}" target="_blank" rel="noopener noreferrer" class="text-gray-700 underline">
                                    DÃ©monstration
                                </a>
                            ` : ""}

                        </div>

                    </div>


                    <div class="flex gap-2 items-start">

                        <button
                            type="button"
                            onclick="editProject(${project.id})"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                        >
                            Modifier
                        </button>

                        <button
                            type="button"
                            onclick="deleteProject(${project.id})"
                            class="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50"
                        >
                            Supprimer
                        </button>

                    </div>

                </div>

            </article>
        `).join("");

    } catch (error) {
        console.error(error);

        projectsContainer.innerHTML = `
            <p class="text-center text-red-500 py-8">
                Impossible de charger les projets.
            </p>
        `;
    }
}


// Ouvrir le formulaire pour ajouter
function openCreateForm() {
    editingProjectId = null;

    projectForm.reset();

    document.getElementById("form-title").textContent = "Ajouter un projet";

    document.getElementById("save-project-btn").textContent =
        "Enregistrer le projet";

    formSection.classList.remove("hidden");
    formSection.scrollIntoView({ behavior: "smooth" });
}


// Fermer le formulaire
function closeProjectForm() {
    formSection.classList.add("hidden");
    projectForm.reset();
    editingProjectId = null;
}


// Remplir le formulaire pour modifier
async function editProject(projectId) {
    try {
        const project = await projectRequest(
            `${PROJECTS_API_URL}${projectId}`
        );

        editingProjectId = projectId;

        document.getElementById("title").value = project.title;
        document.getElementById("slug").value = project.slug;
        document.getElementById("description").value = project.description;
        document.getElementById("image_url").value = project.image_url || "";
        document.getElementById("github_url").value = project.github_url || "";
        document.getElementById("demo_url").value = project.demo_url || "";
        document.getElementById("technologies").value =
            (project.technologies || []).join(", ");
        document.getElementById("is_featured").checked = project.is_featured;

        document.getElementById("form-title").textContent = "Modifier le projet";

        document.getElementById("save-project-btn").textContent =
            "Enregistrer les modifications";

        formSection.classList.remove("hidden");
        formSection.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        showStatus(error.message, false);
    }
}


// CrÃ©er ou modifier un projet
projectForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const projectData = {
        title: document.getElementById("title").value.trim(),
        slug: document.getElementById("slug").value.trim(),
        description: document.getElementById("description").value.trim(),
        image_url: document.getElementById("image_url").value.trim() || null,
        github_url: document.getElementById("github_url").value.trim() || null,
        demo_url: document.getElementById("demo_url").value.trim() || null,
        technologies: document.getElementById("technologies").value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean),
        is_featured: document.getElementById("is_featured").checked
    };

    try {
        if (editingProjectId) {
            await projectRequest(
                `${PROJECTS_API_URL}${editingProjectId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(projectData)
                }
            );

            showStatus("Projet modifiÃ© avec succÃ¨s.");

        } else {
            await projectRequest(PROJECTS_API_URL, {
                method: "POST",
                body: JSON.stringify(projectData)
            });

            showStatus("Projet ajoutÃ© avec succÃ¨s.");
        }

        closeProjectForm();
        await loadProjects();

    } catch (error) {
        showStatus(error.message, false);
    }
});


// Supprimer un projet
async function deleteProject(projectId) {
    const confirmed = confirm(
        "Es-tu sÃ»r de vouloir supprimer ce projet ?"
    );

    if (!confirmed) {
        return;
    }

    try {
        await projectRequest(
            `${PROJECTS_API_URL}${projectId}`,
            { method: "DELETE" }
        );

        showStatus("Projet supprimÃ© avec succÃ¨s.");

        await loadProjects();

    } catch (error) {
        showStatus(error.message, false);
    }
}


// Ã‰vÃ©nements des boutons
openFormButton.addEventListener("click", openCreateForm);
closeFormButton.addEventListener("click", closeProjectForm);
cancelFormButton.addEventListener("click", closeProjectForm);


// DÃ©connexion
const logoutButton = document.getElementById("logout-btn");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("access_token");
        window.location.href = "login.html";
    });
}


// Chargement initial
loadProjects();
