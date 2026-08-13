const express = require("express");

const router = express.Router();

// Demo login for the college project
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if fields are empty
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter username and password"
        });
    }

    // Demo credentials
    if (username === "teacher" && password === "1234") {
        return res.json({
            success: true,
            message: "Login successful",
            user: {
                username: "teacher",
                role: "Teacher"
            }
        });
    }

    // Wrong credentials
    return res.status(401).json({
        success: false,
        message: "Invalid username or password"
    });
});

module.exports = router;