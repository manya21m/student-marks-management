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

// Get elements
const resultsTableBody = document.getElementById("resultsTableBody");
const resultsEmptyMessage = document.getElementById("resultsEmptyMessage");
const searchResultInput = document.getElementById("searchResultInput");
const downloadResultsBtn = document.getElementById("downloadResultsBtn");

let allResults = [];

// Get students and marks from localStorage
function loadResults() {
    const students =
        JSON.parse(localStorage.getItem("students")) || [];

    const allMarks =
        JSON.parse(localStorage.getItem("marks")) || [];

    // Combine student details with marks
    allResults = allMarks.map((mark) => {
        const student = students.find(
            (item) => Number(item.id) === Number(mark.studentId)
        );

        if (!student) {
            return null;
        }

        return {
            ...student,
            ...mark
        };
    }).filter((item) => item !== null);

    displayResults(allResults);
}

// Display results in the table
function displayResults(results) {
    resultsTableBody.innerHTML = "";

    if (results.length === 0) {
        resultsEmptyMessage.textContent =
            "No student results available yet.";

        resultsEmptyMessage.style.display = "block";
        return;
    }

    resultsEmptyMessage.style.display = "none";

    results.forEach((student) => {
        const percentage = Number(student.percentage) || 0;
        const average = Number(student.average) || 0;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.usn}</td>
            <td>${student.subject1}</td>
            <td>${student.subject2}</td>
            <td>${student.subject3}</td>
            <td>${student.subject4}</td>
            <td>${student.subject5}</td>
            <td>${student.total}</td>
            <td>${average.toFixed(2)}</td>
            <td>${percentage.toFixed(2)}%</td>
            <td>${student.grade}</td>
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

// Search results
if (searchResultInput) {
    searchResultInput.addEventListener("input", () => {
        const searchText =
            searchResultInput.value.toLowerCase().trim();

        const filteredResults = allResults.filter((student) => {
            return (
                student.name.toLowerCase().includes(searchText) ||
                student.usn.toLowerCase().includes(searchText)
            );
        });

        displayResults(filteredResults);
    });
}

// Download results as PDF
if (downloadResultsBtn) {
    downloadResultsBtn.addEventListener("click", () => {
        const searchText =
            searchResultInput.value.toLowerCase().trim();

        const resultsToDownload = allResults.filter((student) => {
            return (
                student.name.toLowerCase().includes(searchText) ||
                student.usn.toLowerCase().includes(searchText)
            );
        });

        if (resultsToDownload.length === 0) {
            alert("No results available to download.");
            return;
        }

        // Check jsPDF library
        if (!window.jspdf) {
            alert(
                "PDF library failed to load. Please refresh and try again."
            );
            return;
        }

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
            "Subject 1",
            "Subject 2",
            "Subject 3",
            "Subject 4",
            "Subject 5",
            "Total",
            "Average",
            "Percentage",
            "Grade",
            "Result"
        ]];

        // Table rows
        const rows = resultsToDownload.map((student) => {
            return [
                student.name,
                student.usn,
                student.subject1,
                student.subject2,
                student.subject3,
                student.subject4,
                student.subject5,
                student.total,
                Number(student.average).toFixed(2),
                Number(student.percentage).toFixed(2) + "%",
                student.grade,
                student.result
            ];
        });

        // Generate table
        if (typeof doc.autoTable !== "function") {
            alert(
                "PDF table library failed to load. Please refresh and try again."
            );
            return;
        }

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

        // Footer
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
}

// Load results when page opens
loadResults();