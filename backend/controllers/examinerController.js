import User from "../models/User.js";
import Test from "../models/Test.js";
import Student from "../models/Student.js";
import Examiner from "../models/Examiner.js";

export const inviteStudents = async (req, res) => {
   try {
      const { testId } = req.params;
      let { studentEmails } = req.body;
      const { user } = req;

      if (typeof studentEmails === "string")
         studentEmails = [studentEmails];

      if (!Array.isArray(studentEmails) || !studentEmails.length)
         return res.status(400).json({ msg: "Provide at least one student email" });

      const test = await Test.findById(testId);
      if (test.examiner.toString() !== user._id.toString())
         return res.status(401).json({ msg: "Unauthorized" });

      const users = await User.find({ email: { $in: studentEmails }, role: "student" });

      if (!user) {
         return res.status(404).json({ msg: "User not found" })
      }

      const students = await Student.find({ user: { $in: users.map(u => u._id) } });

      for (const s of students) {
         if (!test.students.includes(s._id)) test.students.push(s._id);
      }
      await test.save();
      res.status(200).json({ msg: "Students added to Test" });
   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal error occured" });
   }
};

export const removeStudent = async (req, res) => {
   try {
      const { testId } = req.params;
      const { studentId } = req.body;
      const { user } = req;

      const examiner = await Examiner.findOne({ user: user._id });
      if (!examiner) return res.status(401).json({ msg: "Unauthorized" });

      const test = await Test.findById(testId);
      if (!test) return res.status(404).json({ msg: "Test not found" });
      if (test.examiner.toString() !== examiner._id.toString())
         return res.status(401).json({ msg: "Unauthorized" });

      test.students = test.students.filter(id => id.toString() !== studentId);
      await test.save();
      res.status(200).json({ msg: "Student removed from Test" });
   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal error occurred" });
   }
};
