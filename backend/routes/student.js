import express from 'express';
import multer from 'multer';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware.js';
import VoiceSubmission from '../models/VoiceSubmission.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/submit', authenticateJWT, authorizeRoles('student'), upload.single('voice'), async (req, res) => {
  try {
    const submission = await VoiceSubmission.create({
      student: req.user.id,
      filePath: req.file.path,
      originalName: req.file.originalname,
      submittedAt: new Date(),
    });
    res.json({ message: 'Submission successful', submission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;