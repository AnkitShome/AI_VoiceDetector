import express from "express";
import {
   registerFromInvite,
   evaluatorLogin,
   getEvaluatorTests,
   getTestAttempts,
   reviewStudentAnswer,
} from "../controllers/evaluatorController.js";

import { requireEvaluatorAuth } from "../middlewares/evaluatorMiddleware.js";

const router = express.Router();

router.post("/invite-register", registerFromInvite); // body: testId, token, name, password
router.post("/login", evaluatorLogin);

router.get("/tests", requireEvaluatorAuth, getEvaluatorTests);
router.get("/test/:testId/attempts", requireEvaluatorAuth, getTestAttempts);
router.post("/review/:testAttemptId/:questionId", requireEvaluatorAuth, reviewStudentAnswer);

export default router;