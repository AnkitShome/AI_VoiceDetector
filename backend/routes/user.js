// routes/user.js
import express from "express";
import { sendOtp, registerUser, loginUser, logoutUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
