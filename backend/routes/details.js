import express from "express";
import transporter from "../utils/mailer.js";

const router = express.Router();

router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ msg: "Email param is required" });

    console.log("Received request to send mail to:", email);

    const info = await transporter.sendMail({
      from: process.env.USER_GMAIL,
      to: email,
      subject: "Details Param Email",
      html: "<h2>This is a details param email!</h2>",
    });

    console.log("Mail sent! Nodemailer info:", info);

    res.send("Details mail sent!");
  } catch (err) {
    console.error("Mail failed:", err);
    res.status(500).json({ msg: "Mail failed", error: err.message });
  }
});

export default router;
