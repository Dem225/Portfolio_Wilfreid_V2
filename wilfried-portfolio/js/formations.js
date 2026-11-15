
const FORMATIONS_API_URL = "https://wilfreid-portfolio-api.onrender.com/formations/";

const token = () => localStorage.getItem("access_token");

const form = document.getElementById("formation-form");
const formSection = document.getElementById("formation-form-section");
const container = document.getElementById("formations-container");

let editingFormationId = null;

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function showFormationStatus(message, success = true) {
    const status = document.getElementById("formation-status");

    status.textContent = message;
    status.className = success
        ? "mb-4 rounded-lg bg-green-100 p-3 text-green-800"
        : "mb-4 rounded-lg bg-red-100 p-3 text-red-800";
}

async function formationRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token()}`,
            ...options.headers
        }
    });

    if (!response.ok) {
        let message = "Une erreur est survenue.";

        try {
            const data = await response.json();
            message = data.detail || message;
        } catch (error) {
            message = response.statusText || message;
        }

        throw new Error(
            typeof message === "string"
                ? message
                : JSON.stringify(message)
        );
    }

    if (response.status === 204) return null;

    return response.json();
}

function formatDate(date) {
    if (!date) return "Non renseignÃ©e";

    return new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR");
}


// AFFICHER LES FORMATIONS
async function loadFormations() {
    try {
        const formations = await formationRequest(FORMATIONS_API_URL);

        if (!formations || formations.length === 0) {
            container.innerHTML = `
                <div class="p-8 text-center text-gray-500">
                    Aucune formation enregistrÃ©e pour le moment.
                </div>
            `;
            return;
        }

        container.innerHTML = formations.map(formation => `
            <article class="border-b border-gray-200 p-6 last:border-b-0">
                <div class="flex flex-col justify-between gap-4 md:flex-row">

                    <div class="flex-1">
                        <div class="mb-2 flex flex-wrap items-center gap-2">
                            <h3 class="text-lg font-bold text-gray-900">
                                ${escapeHTML(formation.title)}
                            </h3>

                            <span class="rounded-full bg-gray-100 px-3 py-1 text-xs">
                                ${escapeHTML(formation.type)}
                            </span>

                            ${formation.is_completed
                                ? '<span class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-800">TerminÃ©e</span>'
                                : '<span class="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-800">En cours</span>'
                            }

                            ${formation.is_featured
                                ? '<span class="rounded-full bg-black px-3 py-1 text-xs text-white">Mise en avant</span>'
                                : ""
                            }
                        </div>

                        <p class="font-medium text-gray-700">
                            ${escapeHTML(formation.institution)}
                        </p>

                        <p class="mt-3 whitespace-pre-line text-sm text-gray-600">
                            ${escapeHTML(formation.description)}
                        </p>

                        <p class="mt-3 text-sm text-gray-500">
                            Du ${formatDate(formation.start_date)}
                            au ${formatDate(formation.end_date)}
                        </p>

                        ${formation.certificate_url
                            ? `<a href="${escapeHTML(formation.certificate_url)}"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="mt-3 inline-block text-sm font-semibold underline">
                                  Voir le certificat
                               </a>`
                            : ""
                        }
                    </div>

                    <div class="flex h-fit gap-2">
                        <button
                            onclick="editFormation(${formation.id})"
                            class="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">
                            Modifier
                        </button>

                        <button
                            onclick="deleteFormation(${formation.id})"
                            class="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800">
                            Supprimer
                        </button>
                    </div>

                </div>
            </article>
        `).join("");

    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <p class="p-6 text-center text-red-600">
                Impossible de charger les formations.
            </p>
        `;
    }
}


// OUVRIR LE FORMULAIRE
function openFormationForm() {
    editingFormationId = null;
    form.reset();

    document.getElementById("formation-form-title").textContent =
        "Ajouter une formation";

    document.getElementById("save-formation-btn").textContent =
        "Enregistrer";

    formSection.classList.remove("hidden");
}


// FERMER LE FORMULAIRE
function closeFormationForm() {
    formSection.classList.add("hidden");
    form.reset();
    editingFormationId = null;
}


// MODIFIER UNE FORMATION
async function editFormation(id) {
    try {
        const formation = await formationRequest(
            `${FORMATIONS_API_URL}${id}`
        );

        editingFormationId = id;

        document.getElementById("formation-title").value = formation.title;
        document.getElementById("formation-institution").value = formation.institution;
        document.getElementById("formation-description").value = formation.description;
        document.getElementById("formation-type").value = formation.type;
        document.getElementById("formation-start-date").value = formation.start_date || "";
        document.getElementById("formation-end-date").value = formation.end_date || "";
        document.getElementById("formation-certificate").value = formation.certificate_url || "";
        document.getElementById("formation-completed").checked = formation.is_completed;
        document.getElementById("formation-featured").checked = formation.is_featured;

        document.getElementById("formation-form-title").textContent =
            "Modifier la formation";

        document.getElementById("save-formation-btn").textContent =
            "Enregistrer les modifications";

        formSection.classList.remove("hidden");

    } catch (error) {
        showFormationStatus(error.message, false);
    }
}


// AJOUTER OU MODIFIER UNE FORMATION
form.addEventListener("submit", async event => {
    event.preventDefault();

    const data = {
        title: document.getElementById("formation-title").value.trim(),
        institution: document.getElementById("formation-institution").value.trim(),
        description: document.getElementById("formation-description").value.trim(),
        type: document.getElementById("formation-type").value,
        start_date: document.getElementById("formation-start-date").value || null,
        end_date: document.getElementById("formation-end-date").value || null,
        certificate_url: document.getElementById("formation-certificate").value.trim() || null,
        is_completed: document.getElementById("formation-completed").checked,
        is_featured: document.getElementById("formation-featured").checked
    };

    try {
        if (editingFormationId !== null) {
            await formationRequest(
                `${FORMATIONS_API_URL}${editingFormationId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(data)
                }
            );

            showFormationStatus("Formation modifiÃ©e avec succÃ¨s !");

        } else {
            await formationRequest(FORMATIONS_API_URL, {
                method: "POST",
                body: JSON.stringify(data)
            });

            showFormationStatus("Formation ajoutÃ©e avec succÃ¨s !");
        }

        closeFormationForm();
        await loadFormations();

    } catch (error) {
        showFormationStatus(error.message, false);
    }
});


// SUPPRIMER UNE FORMATION
async function deleteFormation(id) {
    if (!confirm("Voulez-vous vraiment supprimer cette formation ?")) {
        return;
    }

    try {
        await formationRequest(`${FORMATIONS_API_URL}${id}`, {
            method: "DELETE"
        });

        showFormationStatus("Formation supprimÃ©e avec succÃ¨s !");
        await loadFormations();

    } catch (error) {
        showFormationStatus(error.message, false);
    }
}


// Ã‰VÃ‰NEMENTS DES BOUTONS
document.getElementById("open-formation-form")
    .addEventListener("click", openFormationForm);

document.getElementById("close-formation-form")
    .addEventListener("click", closeFormationForm);

document.getElementById("cancel-formation-form")
    .addEventListener("click", closeFormationForm);


// CHARGEMENT INITIAL
loadFormations();
