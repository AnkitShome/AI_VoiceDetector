
// routes/examiner.js
import express from "express";
import {
   inviteStudents,
   removeStudent,
   getTestStudents
} from "../controllers/examinerController.js";

import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/invite/:testId", verifyToken, authorizeRoles("examiner"), inviteStudents);
router.delete("/remove", verifyToken, authorizeRoles("examiner"), removeStudent);
router.get("/test/:testId/students", verifyToken, authorizeRoles("examiner"), getTestStudents);

export default router;