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


// Elements
const studentsTableBody = document.getElementById("studentsTableBody");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");

let students = [];


// Load all students
async function loadStudents() {
    try {
        const response = await fetch("/api/students");

        if (!response.ok) {
            throw new Error("Failed to load students");
        }

        students = await response.json();

        displayStudents(students);

    } catch (error) {
        console.error("Error loading students:", error);

        emptyMessage.textContent =
            "Unable to load students. Please check the server.";
    }
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


// Delete student
async function deleteStudent(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`/api/students/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || "Student deleted successfully!");

            // Reload student list
            loadStudents();

        } else {
            alert(data.error || "Failed to delete student.");
        }

    } catch (error) {
        console.error("Error deleting student:", error);
        alert("Unable to connect to the server.");
    }
}


// Load students when page opens
loadStudents();