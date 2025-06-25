
// routes/examiner.js
import express from "express";
import {
   inviteStudents,
   removeStudent,
} from "../controllers/examinerController.js";

import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/invite/:testId", verifyToken, authorizeRoles("examiner"), inviteStudents);
router.post("/remove/:testId", verifyToken, authorizeRoles("examiner"), removeStudent);

export default router;