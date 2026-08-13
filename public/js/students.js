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

// Elements
const studentsTableBody = document.getElementById("studentsTableBody");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");

let students = [];

// Load students from localStorage
function loadStudents() {
    students = JSON.parse(localStorage.getItem("students")) || [];

    displayStudents(students);
}

// Display students in table
function displayStudents(studentList) {
    studentsTableBody.innerHTML = "";

    if (studentList.length === 0) {
        emptyMessage.textContent = "No students found.";
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    studentList.forEach((student) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.usn}</td>
            <td>${student.course}</td>
            <td>${student.branch}</td>
            <td>${student.semester}</td>
            <td>${student.section}</td>
            <td>
                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </td>
        `;

        studentsTableBody.appendChild(row);
    });
}

// Search students
searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase().trim();

    const filteredStudents = students.filter((student) => {
        return (
            student.name.toLowerCase().includes(searchText) ||
            student.usn.toLowerCase().includes(searchText)
        );
    });

    displayStudents(filteredStudents);
});

// Delete student from localStorage
function deleteStudent(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
        return;
    }

    students = students.filter((student) => student.id !== id);

    // Save updated list
    localStorage.setItem("students", JSON.stringify(students));

    alert("Student deleted successfully!");

    // Refresh table
    displayStudents(students);
}

// Load students when page opens
loadStudents();