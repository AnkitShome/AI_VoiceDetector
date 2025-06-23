// controllers/testController.js
import User from "../models/User.js";
import Student from "../models/Student.js";
import Examiner from "../models/Examiner.js";
import Test from "../models/Test.js";
import transporter from "../utils/mailer.js";
import { getEvaluationMailHTML } from "../utils/mailTemplate.js";

export const sendEvaluationLink = async (req, res) => {
   try {
      const { testId } = req.params;
      const test = await Test.findById(testId);
      if (!test) return res.status(404).json({ msg: "Test not found" });

      const examiner = await Examiner.findById(test.examinerId).populate("userId");
      if (!examiner || !examiner.userId) {
         return res.status(404).json({ msg: "Examiner not found" });
      }

      const examinerEmail = examiner.userId.email;
      const evaluationLink = `https://${process.env.FRONTEND_URL}/evaluate/${testId}`;

      const mailHTML = getEvaluationMailHTML({
         recipientName: examiner.userId.name,
         testTitle: test.title,
         evaluationLink,
         additionalText: "These are the student responses to be evaluated",
         footerText: "Please complete the evaluation by the specified deadline."
      });

      await transporter.sendMail({
         from: process.env.USER_GMAIL,
         to: examinerEmail,
         subject: "Test Answers Ready for Evaluation",
         html: mailHTML,
      });

      return res.status(200).json({ msg: "Evaluation link sent to examiner." });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal error" });
   }
};
