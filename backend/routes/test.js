
// routes/test.js
import express from "express";
import { createTest, addQuestion, addQuestions } from "../controllers/testController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/create", verifyToken, authorizeRoles("examiner"), createTest);
router.post("/:testId/question", verifyToken, authorizeRoles("examiner"), addQuestion);
router.post("/:testId/questions", verifyToken, authorizeRoles("examiner"), addQuestions);

export default router;
