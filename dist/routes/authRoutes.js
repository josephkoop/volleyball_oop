"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_js_1 = require("../controllers/authController.js");
const router = express_1.default.Router();
router.get("/login", authController_js_1.getLogin);
router.post("/login", authController_js_1.postLogin);
router.get("/signup", authController_js_1.getSignup);
router.post("/signup", authController_js_1.postSignup);
router.get("/logout", authController_js_1.logout);
router.get("/dashboard", authController_js_1.getDashboard);
router.get("/usermanagement", authController_js_1.getUserManagement); // User management route
router.post("/usermanagement/add-admin", authController_js_1.postAddAdmin); // Add admin
router.post("/usermanagement/delete-user", authController_js_1.postDeleteUser); // Delete user (admin or regular)
exports.default = router;
