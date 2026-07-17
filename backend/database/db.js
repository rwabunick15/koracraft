const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database file location
const dbPath = path.join(__dirname, "koracraft.db");

// Connect to SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to SQLite database.");

        db.run(`
            CREATE TABLE IF NOT EXISTS website_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                company_name TEXT,
                email TEXT NOT NULL,
                phone TEXT,
                website_type TEXT NOT NULL,
                budget TEXT,
                timeline TEXT,
                project_description TEXT NOT NULL,
                status TEXT DEFAULT 'New',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error("❌ Error creating table:", err.message);
            } else {
                console.log("✅ website_requests table is ready.");
            }
        });
    }
});

module.exports = db;