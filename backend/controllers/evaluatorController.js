import Test from "../models/Test.js";
import Examiner from "../models/Examiner.js";
import transporter from "../utils/mailer.js";
import { getEvaluationMailHTML } from "../utils/mailTemplate.js";

export const sendEvaluationLink = async (req, res) => {
   try {
      const { testId } = req.params;
      console.log("testId:",testId);
      const test = await Test.findById(testId);
      if (!test) return res.status(404).json({ msg: "Test not found" });

      const examiner = await Examiner.findOne({user : test.examiner}).populate("user");
      console.log("examiner:",examiner);
      if (!examiner || !examiner.user) return res.status(404).json({ msg: "Examiner not found" });

      const mailHTML = getEvaluationMailHTML({
         recipientName: examiner.user.name,
         testTitle: test.title,
         evaluationLink: `https://${process.env.FRONTEND_URL}/evaluate/${testId}`,
         additionalText: "These are the student responses to be evaluated",
         footerText: "Please complete the evaluation by the specified deadline."
      });

      await transporter.sendMail({
         from: process.env.USER_GMAIL,
         to: examiner.user.email,
         subject: "Test Answers Ready for Evaluation",
         html: mailHTML,
      });

      res.status(200).json({ msg: "Evaluation link sent to examiner." });
   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal error" });
   }
};
