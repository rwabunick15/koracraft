const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
require("dotenv").config();

// Database
require("./database/db");

// Routes
const requestRoutes = require("./routes/requests");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// =====================
// Middleware
// =====================

app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://koracraft.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(helmet());

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || "KoracraftSuperSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));

// Serve Admin Dashboard
app.use("/admin", express.static("admin"));

// =====================
// Routes
// =====================

app.get("/", (req, res) => {
    res.send("🚀 Welcome to the KoraCraft Backend API!");
});

app.use("/api/request", requestRoutes);
app.use("/api/auth", authRoutes);

// =====================
// Start Server
// =====================

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});