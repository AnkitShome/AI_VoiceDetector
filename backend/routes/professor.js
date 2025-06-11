import express from 'express';
// import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// router.post('/start-test', authenticateJWT, authorizeRoles('professor'), (req, res) => {
//   res.json({ message: 'Test started' });
// });

export default router;