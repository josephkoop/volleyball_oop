"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDeleteUser = exports.postAddAdmin = exports.getUserManagement = exports.getDashboard = exports.logout = exports.postSignup = exports.getSignup = exports.postLogin = exports.getLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_js_1 = __importDefault(require("../config/db.js"));
// Login GET handler
const getLogin = (req, res) => {
    const { error = '' } = req.query;
    const successMessage = req.session.successMessage || '';
    req.session.successMessage = null;
    res.render("login", { error, successMessage });
};
exports.getLogin = getLogin;
// Login POST handler
const postLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.redirect("/login?error=" + encodeURIComponent("All fields are required."));
    }
    try {
        const result = await db_js_1.default.query("SELECT * FROM users WHERE username = $1", [username]);
        if (result.rows.length === 0) {
            return res.redirect("/login?error=" + encodeURIComponent("Invalid credentials."));
        }
        const user = result.rows[0];
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.redirect("/login?error=" + encodeURIComponent("Invalid credentials."));
        }
        req.session.user = { username: user.username, role: user.role };
        req.session.successMessage = "You have logged in successfully!";
        res.redirect("/dashboard");
    }
    catch (error) {
        console.error(error);
        res.redirect("/login?error=" + encodeURIComponent("Login error."));
    }
};
exports.postLogin = postLogin;
// Signup GET handler
const getSignup = (req, res) => {
    const { error = '' } = req.query;
    res.render("signup", { error });
};
exports.getSignup = getSignup;
// Signup POST handler (only for regular users)
const postSignup = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.redirect("/signup?error=" + encodeURIComponent("All fields are required."));
    }
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await db_js_1.default.query("INSERT INTO users (username, password, role) VALUES ($1, $2, 'user')", // default to 'user' role
        [username, hashedPassword]);
        res.redirect("/login");
    }
    catch (error) {
        console.error(error);
        res.redirect("/signup?error=" + encodeURIComponent("User already exists or other error."));
    }
};
exports.postSignup = postSignup;
// Logout handler
const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};
exports.logout = logout;
// Dashboard route (after login)
const getDashboard = (req, res) => {
    if (!req.session.user)
        return res.redirect("/login");
    res.render("dashboard", { user: req.session.user });
};
exports.getDashboard = getDashboard;
// User Management Page for overall admin
const getUserManagement = async (req, res) => {
    if (req.session.user.role !== 'overall-admin') {
        return res.redirect("/dashboard");
    }
    try {
        const result = await db_js_1.default.query("SELECT id, username, role FROM users WHERE role != 'overall-admin'");
        const users = result.rows;
        res.render("usermanagement", { users, error: req.query.error || null });
    }
    catch (error) {
        console.error(error);
        res.render("usermanagement", { error: "Error fetching users", users: [] });
    }
};
exports.getUserManagement = getUserManagement;
// Add a new admin
const postAddAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db_js_1.default.query("SELECT * FROM users WHERE username = $1", [username]);
        if (result.rows.length > 0) {
            return res.redirect("/usermanagement?error=Username already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await db_js_1.default.query("INSERT INTO users (username, password, role) VALUES ($1, $2, 'admin')", [username, hashedPassword]);
        res.redirect("/usermanagement");
    }
    catch (error) {
        console.error(error);
        res.redirect("/usermanagement?error=Failed to add admin");
    }
};
exports.postAddAdmin = postAddAdmin;
// Delete a user (admin or regular)
const postDeleteUser = async (req, res) => {
    const { userId } = req.body;
    try {
        if (req.session.user.role === 'overall-admin' && req.session.user.username === "Admin" && userId === req.session.user.id) {
            return res.redirect("/usermanagement?error=You cannot delete the overall admin");
        }
        await db_js_1.default.query("DELETE FROM users WHERE id = $1", [userId]);
        res.redirect("/usermanagement");
    }
    catch (error) {
        console.error(error);
        res.redirect("/usermanagement?error=Failed to delete user");
    }
};
exports.postDeleteUser = postDeleteUser;
