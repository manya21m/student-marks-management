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

// Load students from localStorage
function loadStudents() {
    const students = JSON.parse(localStorage.getItem("students")) || [];

    // Keep the default option
    studentSelect.innerHTML = '<option value="">Select a student</option>';

    if (students.length === 0) {
        marksMessage.textContent =
            "No students found. Please add a student first.";
        return;
    }

    students.forEach((student) => {
        const option = document.createElement("option");

        option.value = student.id;
        option.textContent = `${student.name} (${student.usn})`;

        studentSelect.appendChild(option);
    });
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
const resetMarksBtn = document.getElementById("resetMarksBtn");

if (resetMarksBtn) {
    resetMarksBtn.addEventListener("click", () => {
        setTimeout(() => {
            totalMarksElement.textContent = "0 / 500";
            averageMarksElement.textContent = "0.00";
            percentageMarksElement.textContent = "0.00%";
            resultStatusElement.textContent = "-";
            marksMessage.textContent = "";
            marksMessage.classList.remove("success");
        }, 0);
    });
}

// Save marks to localStorage
marksForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const studentId = Number(studentSelect.value);

    if (!studentId) {
        marksMessage.textContent = "Please select a student.";
        return;
    }

    const allMarksEntered = subjectInputs.every(
        (input) => input.value !== ""
    );

    if (!allMarksEntered) {
        marksMessage.textContent = "Please enter marks for all subjects.";
        return;
    }

    const marks = subjectInputs.map((input) => Number(input.value));

    // Validate marks
    const invalidMark = marks.some(
        (mark) => mark < 0 || mark > 100
    );

    if (invalidMark) {
        marksMessage.textContent =
            "Marks must be between 0 and 100.";
        return;
    }

    const total = marks.reduce((sum, mark) => sum + mark, 0);
    const average = total / 5;
    const percentage = (total / 500) * 100;

    const result = marks.every((mark) => mark >= 35)
        ? "PASS"
        : "FAIL";

    // Grade calculation
    let grade;

    if (percentage >= 90) {
        grade = "A+";
    } else if (percentage >= 80) {
        grade = "A";
    } else if (percentage >= 70) {
        grade = "B+";
    } else if (percentage >= 60) {
        grade = "B";
    } else if (percentage >= 50) {
        grade = "C";
    } else if (percentage >= 35) {
        grade = "D";
    } else {
        grade = "F";
    }

    const marksData = {
        studentId,
        subject1: marks[0],
        subject2: marks[1],
        subject3: marks[2],
        subject4: marks[3],
        subject5: marks[4],
        total,
        average,
        percentage,
        grade,
        result,
        updatedAt: new Date().toISOString()
    };

    // Get existing marks
    const allMarks = JSON.parse(localStorage.getItem("marks")) || [];

    // Check whether marks already exist for this student
    const existingIndex = allMarks.findIndex(
        (item) => Number(item.studentId) === studentId
    );

    if (existingIndex !== -1) {
        // Update existing marks
        allMarks[existingIndex] = marksData;
    } else {
        // Add new marks
        allMarks.push(marksData);
    }

    // Save marks
    localStorage.setItem("marks", JSON.stringify(allMarks));

    marksMessage.textContent = "Marks saved successfully!";
    marksMessage.classList.add("success");
});

// Load students when page opens
loadStudents();