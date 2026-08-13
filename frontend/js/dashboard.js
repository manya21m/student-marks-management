// Check whether the teacher is logged in
if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// Display teacher name
const teacherName = sessionStorage.getItem("teacherName") || "Teacher";
document.getElementById("teacherName").textContent = teacherName;


// Load dashboard statistics
async function loadDashboard() {
    try {
        const response = await fetch("/api/students");
        const students = await response.json();

        // Total students
        document.getElementById("totalStudents").textContent = students.length;

        // Students with marks entered
        const studentsWithMarks = students.filter(
            (student) => student.average !== null && student.average !== undefined
        );

        // Calculate average percentage
        let averagePercentage = 0;

        if (studentsWithMarks.length > 0) {
            const totalAverage = studentsWithMarks.reduce(
                (sum, student) => sum + Number(student.average),
                0
            );

            averagePercentage = totalAverage / studentsWithMarks.length;
        }

        document.getElementById("averagePercentage").textContent =
            `${averagePercentage.toFixed(1)}%`;

        // Passed students
        const passedStudents = students.filter(
            (student) => student.result === "PASS"
        ).length;

        document.getElementById("passedStudents").textContent =
            passedStudents;

        // Failed students
        const failedStudents = students.filter(
            (student) => student.result === "FAIL"
        ).length;

        document.getElementById("failedStudents").textContent =
            failedStudents;

    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}


// Logout
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("teacherName");

    window.location.href = "index.html";
});


// Load dashboard when page opens
loadDashboard();