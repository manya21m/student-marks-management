// Check whether the teacher is logged in
if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("teacherName");

        window.location.href = "index.html";
    });
}

// Student form
const studentForm = document.getElementById("studentForm");
const studentMessage = document.getElementById("studentMessage");

studentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get values from the form
    const studentData = {
        id: Date.now(),
        name: document.getElementById("name").value.trim(),
        usn: document.getElementById("usn").value.trim().toUpperCase(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        course: document.getElementById("course").value.trim(),
        branch: document.getElementById("branch").value.trim(),
        semester: document.getElementById("semester").value.trim(),
        section: document.getElementById("section").value.trim().toUpperCase()
    };

    // Clear previous message
    studentMessage.textContent = "";
    studentMessage.classList.remove("success");

    // Get existing students
    const students = JSON.parse(localStorage.getItem("students")) || [];

    // Check whether USN already exists
    const existingStudent = students.find(
        (student) => student.usn === studentData.usn
    );

    if (existingStudent) {
        studentMessage.textContent =
            "A student with this USN already exists.";
        return;
    }

    // Save new student
    students.push(studentData);
    localStorage.setItem("students", JSON.stringify(students));

    // Show success message
    studentMessage.textContent = "Student added successfully!";
    studentMessage.classList.add("success");

    // Clear form
    studentForm.reset();

    // Remove message after 3 seconds
    setTimeout(() => {
        studentMessage.textContent = "";
        studentMessage.classList.remove("success");
    }, 3000);
});