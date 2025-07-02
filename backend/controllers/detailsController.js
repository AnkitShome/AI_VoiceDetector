import User from "../models/User.js";
import Test from "../models/Test.js";
import Student from "../models/Student.js";

export const getAllStudentEmails = async (req, res) => {
   try {
      const students = await User.find({ role: "student" }).select("email -_id");
      res.json({ emails: students.map(s => s.email) });
   } catch {
      res.status(500).json({ msg: "Failed to fetch student emails" });
   }
};

export const getAllProfEmails = async (req, res) => {
   try {
      const profs = await User.find({ role: "examiner" }).select("email -_id");
      res.json({ emails: profs.map(s => s.email) });
   } catch {
      res.status(500).json({ msg: "Failed to fetch prof emails and usernames" });
   }
};

export const getAllScholarIds = async (req, res) => {
   try {
      const students = await Student.find().select("scholarId -_id")
      return res.json({ scholarIds: students.map(s => s.scholarId) })
   } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Failed to fetchScholarIDs" })
   }
}