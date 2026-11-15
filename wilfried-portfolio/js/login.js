
const API_URL = "https://wilfreid-portfolio-api.onrender.com";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const submitBtn = document.getElementById("submit-btn");
const btnText = document.getElementById("btn-text");

const errorAlert = document.getElementById("error-alert");
const errorMessage = document.getElementById("error-message");

const togglePassword = document.getElementById("toggle-password");
const eyeIcon = document.getElementById("eye-icon");


// Afficher ou masquer le mot de passe
togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.textContent = "visibility_off";
        togglePassword.setAttribute("aria-label", "Masquer le mot de passe");
    } else {
        passwordInput.type = "password";
        eyeIcon.textContent = "visibility";
        togglePassword.setAttribute("aria-label", "Afficher le mot de passe");
    }
});


// Afficher une erreur
function showError(message) {
    errorMessage.textContent = message;
    errorAlert.classList.add("visible");
}


// Connexion administrateur
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    errorAlert.classList.remove("visible");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    btnText.textContent = "VÃ©rification...";

    try {
        const formData = new URLSearchParams();

        formData.append("username", email);
        formData.append("password", password);

        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Email ou mot de passe incorrect."
            );
        }

        // Enregistrer le token JWT
        localStorage.setItem("access_token", data.access_token);

        btnText.textContent = "Connexion rÃ©ussie...";

        // Redirection vers le dashboard
        window.location.href = "dashboard.html";

    } catch (error) {
        showError(error.message || "Impossible de contacter le serveur.");

    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");

        if (btnText.textContent !== "Connexion rÃ©ussie...") {
            btnText.textContent = "Connexion sÃ©curisÃ©e";
        }
    }
});
