import express from 'express';
import { createTest } from '../controllers/testController.js';
import { ensureAuthenticated, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-test', ensureAuthenticated, authorizeRoles('examiner'), createTest)

export default router;