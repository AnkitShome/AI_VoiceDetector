import express from "express";
import {
   getAllStudentEmails,
   getAllProfEmails,
   getAllScholarIds
} from "../controllers/detailsController.js";
import transporter from "../utils/mailer.js";

const router = express.Router();

// New routes for fetching student and examiner emails
router.get("/allStudentEmails", getAllStudentEmails);
router.get("/allProfEmails", getAllProfEmails);
router.get("/allScholarIds", getAllScholarIds)

export default router;
