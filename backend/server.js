const express = require("express");
const cors = require("cors");
const path = require("path");

// Connect and initialize the SQLite database
require("./database");

// Import routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", authRoutes);
app.use("/api/students", studentRoutes);

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Test API route
app.get("/api", (req, res) => {
    res.json({
        message: "Student Marks Management System API is running!"
    });
});

// Open Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});