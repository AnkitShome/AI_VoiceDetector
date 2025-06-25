import User from "../models/User.js";
import Test from "../models/Test.js";

export const getAllStudentEmails = async (req, res) => {
   try {
      const students = await User.find({ role: "student" }).select("email");
      res.json({ emails: students.map(s => s.email) });
   } catch {
      res.status(500).json({ msg: "Failed to fetch student emails" });
   }
};

export const getAllProfEmails = async (req, res) => {
   try {
      const profs = await User.find({ role: "examiner" }).select("email username");
      res.json({ professors: profs });
   } catch {
      res.status(500).json({ msg: "Failed to fetch prof emails and usernames" });
   }
};
