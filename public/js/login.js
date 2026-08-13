const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");
const togglePassword = document.getElementById("togglePassword");

// Show / hide password
togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.innerHTML = isPassword
        ? '<i class="fa-solid fa-eye-slash"></i>'
        : '<i class="fa-solid fa-eye"></i>';
});

// Handle login
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Clear previous message
    loginMessage.textContent = "";
    loginMessage.classList.remove("success");

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            loginMessage.textContent = "Login successful! Redirecting...";
            loginMessage.classList.add("success");

            // Save login state
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("teacherName", data.user.username);

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);

        } else {
            loginMessage.textContent =
                data.message || "Login failed. Please try again.";
        }

    } catch (error) {
        loginMessage.textContent =
            "Unable to connect to the server. Please try again.";

        console.error(error);
    }
});