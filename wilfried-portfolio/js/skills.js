
const SKILLS_API_URL = "http://localhost:8000/skills/";

const skillForm = document.getElementById("skill-form");
const skillFormSection = document.getElementById("skill-form-section");
const skillsContainer = document.getElementById("skills-container");
const skillStatus = document.getElementById("skill-status");

let editingSkillId = null;


// RÃ©cupÃ©rer le token
function getToken() {
    return localStorage.getItem("access_token");
}


// Afficher un message
function showSkillStatus(message, success = true) {
    skillStatus.textContent = message;
    skillStatus.classList.remove("hidden", "bg-green-100", "text-green-800", "bg-red-100", "text-red-800");

    if (success) {
        skillStatus.classList.add("bg-green-100", "text-green-800");
    } else {
        skillStatus.classList.add("bg-red-100", "text-red-800");
    }
}


// SÃ©curiser les textes affichÃ©s dans le HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}


// RequÃªte vers l'API
async function skillRequest(url, method = "GET", data = null) {
    const options = {
        method,
        headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
        }
    };

    if (data !== null) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.detail || "Une erreur est survenue.");
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}


// Afficher les compÃ©tences
async function loadSkills() {
    try {
        const skills = await skillRequest(SKILLS_API_URL);

        if (!skills.length) {
            skillsContainer.innerHTML = `
                <p class="text-center text-gray-400 py-8">
                    Aucune compÃ©tence enregistrÃ©e pour le moment.
                </p>
            `;
            return;
        }

        skillsContainer.innerHTML = skills.map(skill => `
            <article class="border border-gray-200 rounded-lg p-5 mb-4">

                <div class="flex justify-between items-start gap-4">

                    <div class="flex items-start gap-3">

                        <div class="w-10 h-10 flex items-center justify-center">
                            ${getSkillIcon(skill.icon)}
                        </div>

                        <div>
                            <h4 class="font-bold text-gray-900">
                                ${escapeHTML(skill.name)}
                            </h4>

                            <p class="text-sm text-gray-500 mt-1">
                                ${escapeHTML(skill.category)}
                            </p>

                            <span class="inline-block mt-3 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                ${escapeHTML(skill.level)}
                            </span>

                            ${skill.is_featured ? `
                                <span class="inline-block mt-3 text-xs bg-gray-900 text-white px-3 py-1 rounded-full">
                                    Mise en avant
                                </span>
                            ` : ""}

                        </div>

                    </div>

                    <div class="flex gap-2">

                        <button
                            type="button"
                            onclick="editSkill(${skill.id})"
                            class="border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
                        >
                            Modifier
                        </button>

                        <button
                            type="button"
                            onclick="deleteSkill(${skill.id})"
                            class="border border-red-200 text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 text-sm"
                        >
                            Supprimer
                        </button>

                    </div>

                </div>

            </article>
        `).join("");

    } catch (error) {
        skillsContainer.innerHTML = `
            <p class="text-center text-red-600 py-8">
                Impossible de charger les compÃ©tences.
            </p>
        `;

        console.error(error);
    }
}


// Ouvrir le formulaire
function openSkillForm() {
    skillFormSection.classList.remove("hidden");
}


// Fermer le formulaire
function closeSkillForm() {
    skillFormSection.classList.add("hidden");
    skillForm.reset();
    editingSkillId = null;

    document.getElementById("skill-form-title").textContent =
        "Ajouter une compÃ©tence";

    document.getElementById("save-skill-btn").textContent =
        "Enregistrer la compÃ©tence";
}


// Modifier une compÃ©tence
async function editSkill(skillId) {
    try {
        const skill = await skillRequest(`${SKILLS_API_URL}${skillId}`);

        editingSkillId = skillId;

        document.getElementById("skill-name").value = skill.name;
        document.getElementById("skill-category").value = skill.category;
        document.getElementById("skill-level").value = skill.level;
        document.getElementById("skill-icon").value = skill.icon || "";
        document.getElementById("skill-is-featured").checked = skill.is_featured;

        document.getElementById("skill-form-title").textContent =
            "Modifier une compÃ©tence";

        document.getElementById("save-skill-btn").textContent =
            "Enregistrer les modifications";

        openSkillForm();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {
        showSkillStatus(error.message, false);
    }
}


// Ajouter ou modifier une compÃ©tence
skillForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const skillData = {
        name: document.getElementById("skill-name").value.trim(),
        category: document.getElementById("skill-category").value,
        level: document.getElementById("skill-level").value,
        icon: document.getElementById("skill-icon").value.trim() || null,
        is_featured: document.getElementById("skill-is-featured").checked
    };

    try {
        if (editingSkillId !== null) {
            await skillRequest(
                `${SKILLS_API_URL}${editingSkillId}`,
                "PATCH",
                skillData
            );

            showSkillStatus("CompÃ©tence modifiÃ©e avec succÃ¨s.");

        } else {
            await skillRequest(
                SKILLS_API_URL,
                "POST",
                skillData
            );

            showSkillStatus("CompÃ©tence ajoutÃ©e avec succÃ¨s.");
        }

        closeSkillForm();
        await loadSkills();

    } catch (error) {
        showSkillStatus(error.message, false);
    }
});


// Supprimer une compÃ©tence
async function deleteSkill(skillId) {
    const confirmation = confirm(
        "Voulez-vous vraiment supprimer cette compÃ©tence ?"
    );

    if (!confirmation) {
        return;
    }

    try {
        await skillRequest(
            `${SKILLS_API_URL}${skillId}`,
            "DELETE"
        );

        showSkillStatus("CompÃ©tence supprimÃ©e avec succÃ¨s.");
        await loadSkills();

    } catch (error) {
        showSkillStatus(error.message, false);
    }
}


// Boutons du formulaire
document.getElementById("open-skill-form").addEventListener("click", () => {
    closeSkillForm();
    openSkillForm();
});

document.getElementById("close-skill-form").addEventListener("click", closeSkillForm);

document.getElementById("cancel-skill-form").addEventListener("click", closeSkillForm);


// Chargement initial
loadSkills();
