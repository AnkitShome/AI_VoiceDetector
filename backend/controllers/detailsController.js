import User from "../models/User.js";
import Student from "../models/Student.js";
import Test from "../models/Test.js";
import Student from "../models/Student.js";

export const getAllStudentEmails = async (req, res) => {
   try {
<<<<<<< HEAD
      const students = await User.find({ role: "student" }).select("email -_id");
=======
      const students = await User.find({ role: "student" }).select("email");
      
>>>>>>> 587950ddd6b1d81183998ee5a3b3c3c01bfc1aa5
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

<<<<<<< HEAD
export const getAllScholarIds = async (req, res) => {
   try {
      const students = await Student.find().select("scholarId -_id")
      return res.json({ scholarIds: students.map(s => s.scholarId) })
   } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Failed to fetchScholarIDs" })
   }
}
=======
export const getAllStudentScholarId = async (req, res) => {
  try {
    const students = await Student.find({}, "scholarId"); // 👈 only get scholarId
    const scholarIds = students.map(s => s.scholarId);
    res.status(200).json({ scholarIds });
  } catch (err) {
    console.error("Server error:", err); // 👈 check this in terminal
    res.status(500).json({ msg: "Server error" });
  }
};

>>>>>>> 587950ddd6b1d81183998ee5a3b3c3c01bfc1aa5
