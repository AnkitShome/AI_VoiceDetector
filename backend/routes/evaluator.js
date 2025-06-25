
// routes/evaluator.js
import express from "express";
import { sendEvaluationLink } from "../controllers/evaluatorController.js";

import {verifyToken,authorizeRoles} from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/send-link/:testId", verifyToken, authorizeRoles("examiner"), sendEvaluationLink);

export default router;
