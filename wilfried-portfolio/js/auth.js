
const API_URL = "http://127.0.0.1:8000";

async function verifyAdminAccess() {
    const token = localStorage.getItem("access_token");

    // Aucun token : retour à la connexion
    if (!token) {
        window.location.replace("login.html");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        // Token invalide ou expiré
        if (!response.ok) {
            localStorage.removeItem("access_token");
            window.location.replace("login.html");
            return;
        }

        console.log("Accès administrateur autorisé.");

    } catch (error) {
        console.error("Erreur de vérification :", error);
        document.body.innerHTML = `
            <p>Impossible de vérifier votre authentification.
            Vérifiez que le serveur est démarré.</p>
        `;
    }
}

verifyAdminAccess();
