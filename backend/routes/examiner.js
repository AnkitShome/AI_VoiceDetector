import express from "express";
import {
  createTest,
  addQuestions,
  inviteStudents,
  joinTest,
  getUpcomingTestsForStudent,
  removeStudent,
} from "../controllers/testController.js";
import {
  ensureAuthenticated,
  ensureAuthenticated_jw,
  authorizeRoles,
  verifyToken,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Create a new test
router.post(
  "/createTest",
  ensureAuthenticated,
  authorizeRoles("examiner"),
  createTest
);

// 2. Add questions to a test
router.post(
  "/addQuestions",
  ensureAuthenticated,
  authorizeRoles("examiner"),
  addQuestions
);

// 3. Invite a student to a test
router.post(
  "/inviteStudent",
  ensureAuthenticated,
  authorizeRoles("examiner"),
  inviteStudents
);

// 4. Student joins a test (no role restriction)
router.post("/joinTest", ensureAuthenticated, joinTest);

//5. Test is visible to student
router.get("/showTest",ensureAuthenticated_jw ,getUpcomingTestsForStudent);

//6 delete student
router.delete("/removeStudent",verifyToken,  removeStudent);


export default router;
