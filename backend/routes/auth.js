// routes/auth.js
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  sendOtp,
} from "../controllers/userController.js";

import {verifyToken,authorizeRoles} from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);
router.get("/refresh", refreshAccessToken);
router.post("/send-otp", sendOtp);

export default router;
