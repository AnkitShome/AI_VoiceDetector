// routes/examiner.js
import express from "express";
import {
   inviteStudents,
   removeStudent,
} from "../controllers/examinerController.js";
import {
   ensureAuthenticated,
   authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Invite students to a test
router.post("/invite/:testId", ensureAuthenticated, authorizeRoles("examiner"), inviteStudents);

// Remove student from a test
router.delete("/remove/:testId", ensureAuthenticated, authorizeRoles("examiner"), removeStudent);

export default router;
