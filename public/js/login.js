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

// Handle demo login
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Clear previous message
    loginMessage.textContent = "";
    loginMessage.classList.remove("success");

    // Demo credentials
    if (username === "teacher" && password === "1234") {
        loginMessage.textContent = "Login successful! Redirecting...";
        loginMessage.classList.add("success");

        // Save login state
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("teacherName", "teacher");

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800);

    } else {
        loginMessage.textContent =
            "Invalid username or password. Please try again.";
    }
});