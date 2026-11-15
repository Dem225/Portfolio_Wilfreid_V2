
const API_URL = "https://wilfreid-portfolio-api.onrender.com";

async function verifyAdminAccess() {
    const token = localStorage.getItem("access_token");

    // Aucun token : retour Ã  la connexion
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

        // Token invalide ou expirÃ©
        if (!response.ok) {
            localStorage.removeItem("access_token");
            window.location.replace("login.html");
            return;
        }

        console.log("AccÃ¨s administrateur autorisÃ©.");

    } catch (error) {
        console.error("Erreur de vÃ©rification :", error);
        document.body.innerHTML = `
            <p>Impossible de vÃ©rifier votre authentification.
            VÃ©rifiez que le serveur est dÃ©marrÃ©.</p>
        `;
    }
}

verifyAdminAccess();
