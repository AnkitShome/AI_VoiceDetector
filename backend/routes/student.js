// routes/student.js
import express from "express";
import {
   joinTest,
   startTest,
   submitTest,
   getUpcomingTestsForStudent,
} from "../controllers/studentController.js";
import {
   ensureAuthenticated,
   ensureAuthenticated_jw,
   authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Student joins a test
router.post("/join/:testId", ensureAuthenticated, authorizeRoles("student"), joinTest);

// Student starts a test attempt
router.post("/start/:testId", ensureAuthenticated, authorizeRoles("student"), startTest);

// Student submits test attempt
router.post("/submit/:testId", ensureAuthenticated, authorizeRoles("student"), submitTest);

// Get upcoming tests for logged-in student
router.get("/upcoming", ensureAuthenticated_jw, authorizeRoles("student"), getUpcomingTestsForStudent);

export default router;
