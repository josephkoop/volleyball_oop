import express from "express";
import {
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    logout,
    getDashboard,
    getUserManagement,
    postAddAdmin,
    postDeleteUser
} from "../controllers/authController.js";

const router = express.Router();

router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/signup", getSignup);
router.post("/signup", postSignup);
router.get("/logout", logout);

router.get("/dashboard", getDashboard);

router.get("/usermanagement", getUserManagement);  // User management route
router.post("/usermanagement/add-admin", postAddAdmin);  // Add admin
router.post("/usermanagement/delete-user", postDeleteUser);  // Delete user (admin or regular)

export default router;
