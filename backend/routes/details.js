// routes/details.js
import express from "express";
import { getAllStudentEmails, getAllProfEmails } from "../controllers/detailsController.js";

const router = express.Router();

// Get all student emails
router.get("/students", getAllStudentEmails);

// Get all professor emails
router.get("/professors", getAllProfEmails);

export default router;
