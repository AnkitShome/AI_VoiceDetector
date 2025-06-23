import User from "../models/User";
import Student from "../models/Student";
import Examiner from "../models/Examiner";
import Test from "../models/Test";
import Question from "../models/Question";


const getAllStudentEmails = async (req, res) => {
   try {
      const students = await User.find({ role: "student" }).select("email");
      const emails = students.map((student) => student.email);
      res.json({ emails });
   } catch (err) {
      res.status(500).json({ msg: "Failed to fetch student emails" });
   }
};

const getAllProfEmails = async (req, res) => {
   try {
      const professors = await User.find({ role: "examiner" }).select("email username");
      res.json({ professors });
   } catch (err) {
      res.status(500).json({ msg: "Failed to fetch prof emails and usernames" });
   }
};


export {
   getAllProfEmails,
   getAllStudentEmails
}