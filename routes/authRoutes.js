// routes/authRoutes.js
import express from "express";
import {
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    logout,
    getUserManagement,
    postAddAdmin,
    postDeleteAdmin
} from "../controllers/authController.js";

const router = express.Router();

router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/signup", getSignup);
router.post("/signup", postSignup);
router.get("/logout", logout);

router.get("/usermanagement", getUserManagement);  // This is the route you're checking
router.post("/usermanagement/add-admin", postAddAdmin);
router.post("/usermanagement/delete-admin", postDeleteAdmin);

export default router;
