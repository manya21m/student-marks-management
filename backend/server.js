const express = require("express");
const cors = require("cors");

// Connect and initialize the SQLite database
require("./database");

// Import routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", authRoutes);
app.use("/api/students", studentRoutes);

// Test API route
app.get("/api", (req, res) => {
    res.json({
        message: "Student Marks Management System API is running!"
    });
});

// Run locally only
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

// Export app for Vercel
module.exports = app;