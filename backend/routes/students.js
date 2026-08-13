const express = require("express");
const db = require("../database");

const router = express.Router();


// GET ALL STUDENTS WITH MARKS
router.get("/", (req, res) => {

    const sql = `
        SELECT
            students.*,
            marks.mathematics,
            marks.physics,
            marks.chemistry,
            marks.programming,
            marks.english,
            marks.total,
            marks.average,
            marks.percentage,
            marks.grade,
            marks.result
        FROM students
        LEFT JOIN marks
        ON students.id = marks.student_id
        ORDER BY students.id DESC
    `;

    db.all(sql, [], (err, students) => {

        if (err) {
            console.error("Error getting students:", err);

            return res.status(500).json({
                error: "Failed to get students"
            });
        }

        res.json(students);
    });
});


// ADD NEW STUDENT
router.post("/", (req, res) => {
    const {
        name,
        usn,
        email,
        phone,
        course,
        branch,
        semester,
        section
    } = req.body;

    if (
        !name || !usn || !email || !phone ||
        !course || !branch || !semester || !section
    ) {
        return res.status(400).json({
            error: "Please fill in all fields"
        });
    }

    const sql = `
        INSERT INTO students
        (name, usn, email, phone, course, branch, semester, section)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            name.trim(),
            usn.trim().toUpperCase(),
            email.trim(),
            phone.trim(),
            course.trim(),
            branch.trim(),
            Number(semester),
            section.trim().toUpperCase()
        ],
        function (err) {
            if (err) {
                console.error(err);

                if (err.message.includes("UNIQUE")) {
                    return res.status(400).json({
                        error: "A student with this USN already exists"
                    });
                }

                return res.status(500).json({
                    error: "Failed to add student"
                });
            }

            res.status(201).json({
                message: "Student added successfully!",
                studentId: this.lastID
            });
        }
    );
});


// SAVE OR UPDATE MARKS
router.put("/:id/marks", (req, res) => {
    const studentId = req.params.id;

    const {
        subject1,
        subject2,
        subject3,
        subject4,
        subject5,
        total,
        average,
        percentage,
        result
    } = req.body;

    // Calculate grade
    let grade;

    if (percentage >= 90) {
        grade = "A+";
    } else if (percentage >= 80) {
        grade = "A";
    } else if (percentage >= 70) {
        grade = "B";
    } else if (percentage >= 60) {
        grade = "C";
    } else if (percentage >= 50) {
        grade = "D";
    } else if (percentage >= 35) {
        grade = "E";
    } else {
        grade = "F";
    }


    // Check whether marks already exist
    db.get(
        "SELECT id FROM marks WHERE student_id = ?",
        [studentId],
        (err, existingMarks) => {
            if (err) {
                console.error("Check marks error:", err);

                return res.status(500).json({
                    error: "Failed to check marks"
                });
            }


            if (existingMarks) {

                // UPDATE MARKS
                const updateSql = `
                    UPDATE marks
                    SET
                        mathematics = ?,
                        physics = ?,
                        chemistry = ?,
                        programming = ?,
                        english = ?,
                        total = ?,
                        average = ?,
                        percentage = ?,
                        grade = ?,
                        result = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE student_id = ?
                `;

                db.run(
                    updateSql,
                    [
                        subject1,
                        subject2,
                        subject3,
                        subject4,
                        subject5,
                        total,
                        average,
                        percentage,
                        grade,
                        result,
                        studentId
                    ],
                    function (err) {
                        if (err) {
                            console.error("Update marks error:", err);

                            return res.status(500).json({
                                error: "Failed to update marks"
                            });
                        }

                        res.json({
                            message: "Marks updated successfully!"
                        });
                    }
                );

            } else {

                // INSERT MARKS
                const insertSql = `
                    INSERT INTO marks
                    (
                        student_id,
                        mathematics,
                        physics,
                        chemistry,
                        programming,
                        english,
                        total,
                        average,
                        percentage,
                        grade,
                        result
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.run(
                    insertSql,
                    [
                        studentId,
                        subject1,
                        subject2,
                        subject3,
                        subject4,
                        subject5,
                        total,
                        average,
                        percentage,
                        grade,
                        result
                    ],
                    function (err) {
                        if (err) {
                            console.error("Insert marks error:", err);

                            return res.status(500).json({
                                error: "Failed to save marks"
                            });
                        }

                        res.status(201).json({
                            message: "Marks saved successfully!"
                        });
                    }
                );
            }
        }
    );
});


// DELETE STUDENT
router.delete("/:id", (req, res) => {
    const studentId = req.params.id;

    db.run(
        "DELETE FROM students WHERE id = ?",
        [studentId],
        function (err) {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to delete student"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Student not found"
                });
            }

            res.json({
                message: "Student deleted successfully!"
            });
        }
    );
});


module.exports = router;