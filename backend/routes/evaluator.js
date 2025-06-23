// routes/evaluator.js
import express from "express";
import { sendEvaluationLink } from "../controllers/evaluatorController.js";
import { ensureAuthenticated, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send evaluation link to examiner
router.post(
   "/send-eval-link/:testId",
   ensureAuthenticated,
   authorizeRoles("examiner"),
   sendEvaluationLink
);

export default router;
