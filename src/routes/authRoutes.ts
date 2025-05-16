import { Router } from "express";
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
} from "../controllers/userController.js";

const router = Router();

router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/signup", getSignup);
router.post("/signup", postSignup);
router.get("/logout", logout);

router.get("/dashboard", getDashboard);

router.get("/users", getUserManagement);  // User management route
router.post("/users/add-admin", postAddAdmin);  // Add admin
router.post("/users/delete-user", postDeleteUser);  // Delete user (admin or regular)

export default router;
