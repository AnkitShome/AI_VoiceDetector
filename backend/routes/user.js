
import express from 'express';
import { loginUser, logoutUser, registerUser, sendOtp } from '../controllers/userController.js';
import { authenticateLogin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/send-otp', sendOtp)
router.post('/login', authenticateLogin, loginUser);
router.get('/logout', logoutUser);

export default router;
