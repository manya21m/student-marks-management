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
const marksForm = document.getElementById("marksForm");
const studentSelect = document.getElementById("studentSelect");
const marksMessage = document.getElementById("marksMessage");

const subjectInputs = [
    document.getElementById("subject1"),
    document.getElementById("subject2"),
    document.getElementById("subject3"),
    document.getElementById("subject4"),
    document.getElementById("subject5")
];

const totalMarksElement = document.getElementById("totalMarks");
const averageMarksElement = document.getElementById("averageMarks");
const percentageMarksElement = document.getElementById("percentageMarks");
const resultStatusElement = document.getElementById("resultStatus");


// Load students into dropdown
async function loadStudents() {
    try {
        const response = await fetch("/api/students");

        if (!response.ok) {
            throw new Error("Failed to load students");
        }

        const students = await response.json();

        students.forEach((student) => {
            const option = document.createElement("option");

            option.value = student.id;
            option.textContent = `${student.name} (${student.usn})`;

            studentSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading students:", error);

        marksMessage.textContent =
            "Unable to load students. Please check the server.";
    }
}


// Calculate marks automatically
function calculateMarks() {
    const marks = subjectInputs.map((input) => {
        return Number(input.value) || 0;
    });

    const total = marks.reduce((sum, mark) => sum + mark, 0);
    const average = total / 5;
    const percentage = (total / 500) * 100;

    // PASS if every subject is 35 or above
    const isPass = marks.every((mark) => mark >= 35);

    totalMarksElement.textContent = `${total} / 500`;
    averageMarksElement.textContent = average.toFixed(2);
    percentageMarksElement.textContent = `${percentage.toFixed(2)}%`;

    // Show result only after all marks are entered
    const allMarksEntered = subjectInputs.every(
        (input) => input.value !== ""
    );

    if (!allMarksEntered) {
        resultStatusElement.textContent = "-";
        return;
    }

    resultStatusElement.textContent = isPass ? "PASS" : "FAIL";
}


// Calculate when teacher enters marks
subjectInputs.forEach((input) => {
    input.addEventListener("input", calculateMarks);
});


// Reset calculated values
document.getElementById("resetMarksBtn").addEventListener("click", () => {
    setTimeout(() => {
        totalMarksElement.textContent = "0 / 500";
        averageMarksElement.textContent = "0.00";
        percentageMarksElement.textContent = "0.00%";
        resultStatusElement.textContent = "-";
        marksMessage.textContent = "";
        marksMessage.classList.remove("success");
    }, 0);
});


// Save marks
marksForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const marks = subjectInputs.map((input) => Number(input.value));

    const total = marks.reduce((sum, mark) => sum + mark, 0);
    const average = total / 5;
    const percentage = (total / 500) * 100;

    const result = marks.every((mark) => mark >= 35)
        ? "PASS"
        : "FAIL";

    const marksData = {
        subject1: marks[0],
        subject2: marks[1],
        subject3: marks[2],
        subject4: marks[3],
        subject5: marks[4],
        total,
        average,
        percentage,
        result
    };

    marksMessage.textContent = "";
    marksMessage.classList.remove("success");

    try {
        const response = await fetch(
            `/api/students/${studentSelect.value}/marks`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(marksData)
            }
        );

        const data = await response.json();

        if (response.ok) {
            marksMessage.textContent =
                data.message || "Marks saved successfully!";

            marksMessage.classList.add("success");

        } else {
            marksMessage.textContent =
                data.error || "Failed to save marks.";
        }

    } catch (error) {
        console.error("Error saving marks:", error);

        marksMessage.textContent =
            "Unable to connect to the server.";
    }
});


// Load students when page opens
loadStudents();