
const MESSAGES_API_URL = "http://localhost:8000/contact/";

const messagesContainer = document.getElementById("messages-container");
const messageModal = document.getElementById("message-modal");
const messageDetails = document.getElementById("message-details");


// SÃ©curiser les textes affichÃ©s
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}


// Afficher un message de statut
function showMessageStatus(message, success = true) {
    const status = document.getElementById("messages-status");

    status.textContent = message;
    status.classList.remove("hidden");

    status.className = success
        ? "mx-6 mt-4 rounded-lg bg-green-100 p-3 text-sm text-green-800"
        : "mx-6 mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-800";
}


// Effectuer une requÃªte vers l'API
async function messageRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
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


// Formater la date
function formatMessageDate(date) {
    if (!date) return "Date inconnue";

    return new Date(date).toLocaleString("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}


// Mettre Ã  jour les statistiques
function updateMessageStats(messages) {
    const total = messages.length;
    const unread = messages.filter(message => !message.is_read).length;
    const read = messages.filter(message => message.is_read).length;

    document.getElementById("total-messages").textContent = total;
    document.getElementById("unread-messages").textContent = unread;
    document.getElementById("read-messages").textContent = read;
}


// Afficher tous les messages
async function loadMessages() {
    try {
        const messages = await messageRequest(MESSAGES_API_URL);

        updateMessageStats(messages);

        if (!messages || messages.length === 0) {
            messagesContainer.innerHTML = `
                <div class="p-10 text-center text-gray-500">
                    <span class="material-symbols-outlined text-4xl">
                        inbox
                    </span>
                    <p class="mt-3">Aucun message reÃ§u pour le moment.</p>
                </div>
            `;
            return;
        }

        messagesContainer.innerHTML = messages.map(message => `
            <article class="flex flex-col justify-between gap-4 border-b border-gray-200 p-6 last:border-b-0 md:flex-row">

                <div class="min-w-0 flex-1">
                    <div class="mb-2 flex flex-wrap items-center gap-2">

                        <h4 class="font-bold text-gray-900">
                            ${escapeHTML(message.subject)}
                        </h4>

                        ${message.is_read
                            ? '<span class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">Lu</span>'
                            : '<span class="rounded-full bg-black px-3 py-1 text-xs text-white">Non lu</span>'
                        }

                    </div>

                    <p class="text-sm font-medium text-gray-700">
                        ${escapeHTML(message.name)}
                    </p>

                    <p class="mt-1 text-sm text-gray-500">
                        ${escapeHTML(message.email)}
                    </p>

                    <p class="mt-2 text-sm text-gray-400">
                        ${formatMessageDate(message.created_at)}
                    </p>

                    <p class="mt-3 text-sm text-gray-600">
                        ${escapeHTML(message.message.length > 150
                            ? message.message.substring(0, 150) + "..."
                            : message.message
                        )}
                    </p>
                </div>

                <div class="flex h-fit flex-wrap gap-2">

                    <button
                        onclick="readMessage(${message.id})"
                        class="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">
                        Lire
                    </button>

                    ${!message.is_read
                        ? `<button
                            onclick="markMessageAsRead(${message.id})"
                            class="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">
                            Marquer comme lu
                        </button>`
                        : ""
                    }

                    <button
                        onclick="deleteMessage(${message.id})"
                        class="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800">
                        Supprimer
                    </button>

                </div>

            </article>
        `).join("");

    } catch (error) {
        console.error(error);

        messagesContainer.innerHTML = `
            <p class="p-6 text-center text-red-600">
                Impossible de charger les messages.
            </p>
        `;
    }
}


// Lire un message
async function readMessage(id) {
    try {
        const message = await messageRequest(
            `${MESSAGES_API_URL}${id}`
        );

        if (!message.is_read) {
            await messageRequest(`${MESSAGES_API_URL}${id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    is_read: true
                })
            });
        }

        messageDetails.innerHTML = `
            <div>
                <p class="text-sm text-gray-500">ExpÃ©diteur</p>
                <p class="font-semibold text-gray-900">
                    ${escapeHTML(message.name)}
                </p>
            </div>

            <div>
                <p class="text-sm text-gray-500">Adresse e-mail</p>
                <a href="mailto:${escapeHTML(message.email)}"
                   class="font-medium text-gray-900 underline">
                    ${escapeHTML(message.email)}
                </a>
            </div>

            <div>
                <p class="text-sm text-gray-500">Sujet</p>
                <p class="font-semibold text-gray-900">
                    ${escapeHTML(message.subject)}
                </p>
            </div>

            <div>
                <p class="text-sm text-gray-500">Date de rÃ©ception</p>
                <p class="text-gray-900">
                    ${formatMessageDate(message.created_at)}
                </p>
            </div>

            <div>
                <p class="mb-2 text-sm text-gray-500">Message</p>
                <div class="whitespace-pre-line rounded-lg bg-gray-50 p-4 text-gray-800">
                    ${escapeHTML(message.message)}
                </div>
            </div>
        `;

        messageModal.classList.remove("hidden");
        messageModal.classList.add("flex");

        await loadMessages();

    } catch (error) {
        showMessageStatus(error.message, false);
    }
}


// Marquer un message comme lu
async function markMessageAsRead(id) {
    try {
        await messageRequest(`${MESSAGES_API_URL}${id}`, {
            method: "PATCH",
            body: JSON.stringify({
                is_read: true
            })
        });

        showMessageStatus("Message marquÃ© comme lu !");
        await loadMessages();

    } catch (error) {
        showMessageStatus(error.message, false);
    }
}


// Supprimer un message
async function deleteMessage(id) {
    const confirmed = confirm(
        "Voulez-vous vraiment supprimer ce message ?"
    );

    if (!confirmed) return;

    try {
        await messageRequest(`${MESSAGES_API_URL}${id}`, {
            method: "DELETE"
        });

        showMessageStatus("Message supprimÃ© avec succÃ¨s !");
        await loadMessages();

    } catch (error) {
        showMessageStatus(error.message, false);
    }
}


// Fermer la fenÃªtre de lecture
function closeMessageModal() {
    messageModal.classList.add("hidden");
    messageModal.classList.remove("flex");
}

document.getElementById("close-message-modal")
    .addEventListener("click", closeMessageModal);

document.getElementById("close-message-modal-bottom")
    .addEventListener("click", closeMessageModal);


// Charger les messages au dÃ©marrage
loadMessages();
