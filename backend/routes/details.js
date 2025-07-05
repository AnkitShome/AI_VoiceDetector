import express from "express";
import {
   getAllStudentEmails,
   getAllProfEmails,
   getAllStudentScholarId,
} from "../controllers/detailsController.js";
import transporter from "../utils/mailer.js";

const router = express.Router();

// New routes for fetching student and examiner emails
router.get("/allStudentEmails", getAllStudentEmails);
router.get("/allProfEmails", getAllProfEmails);
router.get("/allStudentScholarId", getAllStudentScholarId);

export default router;
