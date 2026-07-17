const form = document.getElementById("loginForm");

const loginButton = document.querySelector(".login-btn");

const error = document.getElementById("error");

// ===========================================
// Check Existing Session
// ===========================================

async function checkSession() {

    try {

        const response = await fetch(
            "https://koracraft-backend.onrender.com/api/auth/check",
            {
                credentials: "include"
            }
        );

        const result = await response.json();

        if (result.loggedIn) {

            window.location.href = "index.html";

        }

    } catch (err) {

        console.error(err);

    }

}

checkSession();

// ===========================================
// Login
// ===========================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    error.textContent = "";

    loginButton.disabled = true;

    loginButton.textContent = "Signing In...";

    const username = document
        .getElementById("username")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    try {

        const response = await fetch(
            "https://koracraft-backend.onrender.com/api/auth/login",
            {

                method: "POST",

                credentials: "include",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })

            }
        );

        const result = await response.json();

        if (result.success) {

            window.location.href = "index.html";

        } else {

            error.textContent = result.message;

        }

    } catch (err) {

        console.error(err);

        error.textContent =
            "Unable to connect to the KoraCraft server.";

    }

    loginButton.disabled = false;

    loginButton.textContent = "LOGIN";

});