// controllers/authController.js
import bcrypt from "bcrypt";
import pool from "../config/db.js";

// Login GET handler
export const getLogin = (req, res) => {
    const { error = '' } = req.query;
    const successMessage = req.session.successMessage || '';
    req.session.successMessage = null;
    res.render("login", { error, successMessage });
};

// Login POST handler
export const postLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.redirect("/login?error=" + encodeURIComponent("All fields are required."));
    }

    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            return res.redirect("/login?error=" + encodeURIComponent("Invalid credentials."));
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.redirect("/login?error=" + encodeURIComponent("Invalid credentials."));
        }

        req.session.user = { username: user.username, role: user.role };
        req.session.successMessage = "You have logged in successfully!";
        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.redirect("/login?error=" + encodeURIComponent("Login error."));
    }
};

// Signup GET handler
export const getSignup = (req, res) => {
    const { error = '' } = req.query;
    res.render("signup", { error });
};

// Signup POST handler (only for regular users)
export const postSignup = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.redirect("/signup?error=" + encodeURIComponent("All fields are required."));
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO users (username, password, role) VALUES ($1, $2, 'user')", // default to 'user' role
            [username, hashedPassword]
        );
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.redirect("/signup?error=" + encodeURIComponent("User already exists or other error."));
    }
};

// Logout handler
export const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};

// Dashboard route (after login)
export const getDashboard = (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("dashboard", { user: req.session.user });
};

// User Management Page for overall admin
export const getUserManagement = async (req, res) => {
    if (req.session.user.role !== 'overall-admin') {
        return res.redirect("/dashboard");
    }

    try {
        const result = await pool.query("SELECT id, username FROM users WHERE role = 'admin'");
        const admins = result.rows;

        // Pass the admins list and any error message to the EJS view
        res.render("usermanagement", { admins, error: req.query.error || null });
    } catch (error) {
        console.error(error);
        res.render("usermanagement", { error: "Error fetching admins", admins: [] });
    }
};

// Add a new admin
export const postAddAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (result.rows.length > 0) {
            return res.redirect("/usermanagement?error=Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO users (username, password, role) VALUES ($1, $2, 'admin')", [username, hashedPassword]);
        res.redirect("/usermanagement");
    } catch (error) {
        console.error(error);
        res.redirect("/usermanagement?error=Failed to add admin");
    }
};

// Delete an admin
export const postDeleteAdmin = async (req, res) => {
    const { adminId } = req.body;

    try {
        if (req.session.user.role === 'overall-admin' && req.session.user.username === "Admin" && adminId === req.session.user.id) {
            return res.redirect("/usermanagement?error=You cannot delete the overall admin");
        }

        await pool.query("DELETE FROM users WHERE id = $1 AND role = 'admin'", [adminId]);
        res.redirect("/usermanagement");
    } catch (error) {
        console.error(error);
        res.redirect("/usermanagement?error=Failed to delete admin");
    }
};
