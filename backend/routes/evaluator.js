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

router.post("/evaluator/invite-register", registerFromInvite); // body: testId, token, name, password
router.post("/evaluator/login", evaluatorLogin);

router.get("/evaluator/tests", requireEvaluatorAuth, getEvaluatorTests);
router.get("/evaluator/test/:testId/attempts", requireEvaluatorAuth, getTestAttempts);
router.post("/evaluator/review/:testAttemptId/:questionId", requireEvaluatorAuth, reviewStudentAnswer);

export default router;