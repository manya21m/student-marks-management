const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Create the database folder automatically if it does not exist
const databaseFolder = path.join(__dirname, "database");

if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder, { recursive: true });
}

// Database file location
const dbPath = path.join(databaseFolder, "marks.db");

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Enable foreign key support
db.run("PRAGMA foreign_keys = ON");

// Create students table
db.run(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        usn TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        course TEXT NOT NULL,
        branch TEXT NOT NULL,
        semester INTEGER NOT NULL,
        section TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Create marks table
db.run(`
    CREATE TABLE IF NOT EXISTS marks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL UNIQUE,
        mathematics REAL NOT NULL,
        physics REAL NOT NULL,
        chemistry REAL NOT NULL,
        english REAL NOT NULL,
        programming REAL NOT NULL,
        total REAL NOT NULL,
        average REAL NOT NULL,
        percentage REAL NOT NULL,
        grade TEXT NOT NULL,
        result TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id)
            REFERENCES students(id)
            ON DELETE CASCADE
    )
`);

console.log("Database tables are ready.");

module.exports = db;