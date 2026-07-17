const express = require("express");
const router = express.Router();

// Login
router.post("/login", (req, res) => {

    console.log("===== LOGIN ATTEMPT =====");
    console.log(req.body);

    const { username, password } = req.body;

    console.log("Username:", username);
    console.log("Password:", password);

    if (
         username === process.env.ADMIN_USERNAME &&
         password === process.env.ADMIN_PASSWORD
      ) {

        console.log("LOGIN SUCCESS");

        req.session.user = {
            username: "admin"
        };

        return res.json({
            success: true,
            message: "Login successful."
        });

    }

    console.log("LOGIN FAILED");

    res.status(401).json({
        success: false,
        message: "Invalid username or password."
    });

});

// Check Session
router.get("/check", (req, res) => {

    if (req.session.user) {

        return res.json({
            loggedIn: true,
            user: req.session.user
        });

    }

    res.json({
        loggedIn: false
    });

});

// Logout
router.post("/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({
            success: true,
            message: "Logged out."
        });

    });

});

module.exports = router;