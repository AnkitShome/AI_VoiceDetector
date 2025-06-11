import express from 'express';
import { createTest } from '../controllers/testController';
import { ensureAuthenticated, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create-test', ensureAuthenticated, authorizeRoles('professor'), createTest)

export default router;