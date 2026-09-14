const transporter = require("../utils/mailer");
const express = require("express");
const router = express.Router();
const db = require("../database/db");

// ======================================
// Admin Authentication Middleware
// ======================================

function requireAdmin(req, res, next) {

    if (!req.session.user) {

        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });

    }

    next();

}

// ======================================
// ADMIN - GET SINGLE REQUEST
// ======================================

router.get("/:id", requireAdmin, (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM website_requests
        WHERE id = ?
    `;

    db.get(sql, [id], (err, row) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve request."
            });

        }

        if (!row) {

            return res.status(404).json({
                success: false,
                message: "Request not found."
            });

        }

        res.json({
            success: true,
            request: row
        });

    });

});

// ======================================
// PUBLIC - Submit Website Request
// POST /api/request
// ======================================

router.post("/", (req, res) => {

    const {
        full_name,
        company_name,
        email,
        phone,
        website_type,
        budget,
        timeline,
        project_description
    } = req.body;

    if (!full_name || !email || !website_type || !project_description) {

        return res.status(400).json({
            success: false,
            message: "Please fill in all required fields."
        });

    }

    const sql = `
        INSERT INTO website_requests
        (
            full_name,
            company_name,
            email,
            phone,
            website_type,
            budget,
            timeline,
            project_description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    console.log("Saving request:", req.body);

    db.run(
        sql,
        [
            full_name,
            company_name,
            email,
            phone,
            website_type,
            budget,
            timeline,
            project_description
        ],
        function (err) {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to save request."
                });

            }

            console.log("Saved with ID:", this.lastID);

            const mailOptions = {

                from: process.env.EMAIL_USER,

                to: process.env.EMAIL_USER,

                subject: `New Website Request - ${full_name}`,

                html: `
                    <h2>New Website Consultation Request</h2>

                    <p><strong>Full Name:</strong> ${full_name}</p>
                    <p><strong>Company:</strong> ${company_name || "N/A"}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || "N/A"}</p>
                    <p><strong>Website Type:</strong> ${website_type}</p>
                    <p><strong>Budget:</strong> ${budget || "N/A"}</p>
                    <p><strong>Timeline:</strong> ${timeline || "N/A"}</p>

                    <h3>Project Description</h3>

                    <p>${project_description}</p>
                `

            };

            transporter.sendMail(mailOptions, (mailErr, info) => {

                if (mailErr) {

                    console.error("Email Error:", mailErr);

                } else {

                    console.log("Email sent:", info.response);

                }

            });

            res.status(201).json({
                success: true,
                message: "Website request submitted successfully.",
                requestId: this.lastID
            });

        }

    );

});

// ======================================
// ADMIN - GET ALL REQUESTS
// ======================================

router.get("/", requireAdmin, (req, res) => {

    const sql = `
        SELECT *
        FROM website_requests
        ORDER BY created_at DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve requests."
            });

        }

        res.json({
            success: true,
            requests: rows
        });

    });

});

// ======================================
// ADMIN - UPDATE STATUS
// ======================================

router.put("/:id", requireAdmin, (req, res) => {

    const { status } = req.body;
    const { id } = req.params;

    const sql = `
        UPDATE website_requests
        SET status = ?
        WHERE id = ?
    `;

    db.run(sql, [status, id], function (err) {

        if (err) {

            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Unable to update status."
            });

        }

        res.json({
            success: true,
            message: "Status updated."
        });

    });

});

// ======================================
// ADMIN - DELETE REQUEST
// ======================================

router.delete("/:id", requireAdmin, (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM website_requests
        WHERE id = ?
    `;

    db.run(sql, [id], function (err) {

        if (err) {

            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Unable to delete request."
            });

        }

        res.json({
            success: true,
            message: "Request deleted successfully."
        });

    });

});

module.exports = router;