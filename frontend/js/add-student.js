// Check whether the teacher is logged in
if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}


// Logout
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("teacherName");

    window.location.href = "index.html";
});


// Student form
const studentForm = document.getElementById("studentForm");
const studentMessage = document.getElementById("studentMessage");

studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get values from the form
    const studentData = {
        name: document.getElementById("name").value.trim(),
        usn: document.getElementById("usn").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        course: document.getElementById("course").value.trim(),
        branch: document.getElementById("branch").value.trim(),
        semester: document.getElementById("semester").value.trim(),
        section: document.getElementById("section").value.trim()
    };

    // Clear previous message
    studentMessage.textContent = "";
    studentMessage.classList.remove("success");

    try {
        const response = await fetch("/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        const data = await response.json();

        if (response.ok) {
            studentMessage.textContent =
                data.message || "Student added successfully!";

            studentMessage.classList.add("success");

            // Clear form after successful submission
            studentForm.reset();

            // Remove success message after 3 seconds
            setTimeout(() => {
                studentMessage.textContent = "";
                studentMessage.classList.remove("success");
            }, 3000);

        } else {
            studentMessage.textContent =
                data.error || "Failed to add student.";
        }

    } catch (error) {
        console.error("Error adding student:", error);

        studentMessage.textContent =
            "Unable to connect to the server. Please try again.";
    }
});
