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


// Get elements
const resultsTableBody = document.getElementById("resultsTableBody");
const resultsEmptyMessage = document.getElementById("resultsEmptyMessage");
const searchResultInput = document.getElementById("searchResultInput");
const downloadResultsBtn = document.getElementById("downloadResultsBtn");

let allStudents = [];


// Calculate grade
function calculateGrade(percentage) {
    if (percentage >= 90) {
        return "A+";
    } else if (percentage >= 80) {
        return "A";
    } else if (percentage >= 70) {
        return "B";
    } else if (percentage >= 60) {
        return "C";
    } else if (percentage >= 50) {
        return "D";
    } else if (percentage >= 35) {
        return "E";
    } else {
        return "F";
    }
}


// Get students who have saved marks
function getStudentsWithMarks(students) {
    return students.filter(
        (student) =>
            student.mathematics !== null &&
            student.mathematics !== undefined
    );
}


// Display results in the table
function displayResults(students) {

    resultsTableBody.innerHTML = "";

    const studentsWithMarks = getStudentsWithMarks(students);


    if (studentsWithMarks.length === 0) {
        resultsEmptyMessage.textContent =
            "No student results available yet.";

        resultsEmptyMessage.style.display = "block";

        return;
    }


    resultsEmptyMessage.style.display = "none";


    studentsWithMarks.forEach((student) => {

        const percentage = Number(student.percentage);

        const grade =
            student.grade || calculateGrade(percentage);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.usn}</td>
            <td>${student.mathematics}</td>
            <td>${student.physics}</td>
            <td>${student.chemistry}</td>
            <td>${student.programming}</td>
            <td>${student.english}</td>
            <td>${student.total}</td>
            <td>${Number(student.average).toFixed(2)}</td>
            <td>${percentage.toFixed(2)}%</td>
            <td>${grade}</td>
            <td>
                <span class="result-status ${
                    student.result === "PASS" ? "pass" : "fail"
                }">
                    ${student.result}
                </span>
            </td>
        `;

        resultsTableBody.appendChild(row);
    });
}


// Load results from server
async function loadResults() {

    try {
        const response = await fetch("/api/students");

        if (!response.ok) {
            throw new Error("Failed to load results");
        }

        allStudents = await response.json();

        displayResults(allStudents);

    } catch (error) {

        console.error("Error loading results:", error);

        resultsEmptyMessage.textContent =
            "Unable to load results. Please check the server.";

        resultsEmptyMessage.style.display = "block";
    }
}


// Search results
searchResultInput.addEventListener("input", () => {

    const searchText =
        searchResultInput.value.toLowerCase().trim();

    const filteredStudents = allStudents.filter((student) => {

        return (
            student.name.toLowerCase().includes(searchText) ||
            student.usn.toLowerCase().includes(searchText)
        );
    });

    displayResults(filteredStudents);
});


// DOWNLOAD RESULTS AS PDF
downloadResultsBtn.addEventListener("click", () => {

    const searchText =
        searchResultInput.value.toLowerCase().trim();


    // Get searched students who have marks
    const studentsToDownload = getStudentsWithMarks(
        allStudents.filter((student) => {

            return (
                student.name.toLowerCase().includes(searchText) ||
                student.usn.toLowerCase().includes(searchText)
            );
        })
    );


    if (studentsToDownload.length === 0) {
        alert("No results available to download.");
        return;
    }


    // Check PDF library
    if (!window.jspdf) {
        alert("PDF library failed to load. Please refresh and try again.");
        return;
    }


    // Create PDF
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });


    // Heading
    doc.setFontSize(20);
    doc.text(
        "STUDENT RESULTS REPORT",
        148,
        18,
        { align: "center" }
    );

    doc.setFontSize(10);
    doc.text(
        "Marks Manager - Academic Performance Report",
        148,
        26,
        { align: "center" }
    );


    // Table headings
    const headers = [[
        "Name",
        "USN",
        "Maths",
        "Physics",
        "Chemistry",
        "Computer",
        "English",
        "Total",
        "Average",
        "Percentage",
        "Grade",
        "Result"
    ]];


    // Table rows
    const rows = studentsToDownload.map((student) => {

        const percentage = Number(student.percentage);

        const grade =
            student.grade || calculateGrade(percentage);

        return [
            student.name,
            student.usn,
            student.mathematics,
            student.physics,
            student.chemistry,
            student.programming,
            student.english,
            student.total,
            Number(student.average).toFixed(2),
            percentage.toFixed(2) + "%",
            grade,
            student.result
        ];
    });


    // Generate table
    doc.autoTable({
        head: headers,
        body: rows,
        startY: 35,

        styles: {
            fontSize: 7,
            cellPadding: 2,
            halign: "center"
        },

        headStyles: {
            fontStyle: "bold"
        },

        margin: {
            left: 8,
            right: 8
        }
    });


    // Add footer to every page
    const pageCount = doc.internal.getNumberOfPages();

    for (let page = 1; page <= pageCount; page++) {

        doc.setPage(page);
        doc.setFontSize(8);

        doc.text(
            `Generated by Marks Manager | Page ${page} of ${pageCount}`,
            148,
            205,
            { align: "center" }
        );
    }


    // Download PDF
    doc.save("student-results-report.pdf");
});


// Load results when page opens
loadResults();