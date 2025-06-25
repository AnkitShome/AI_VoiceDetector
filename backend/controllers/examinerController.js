import User from "../models/User.js";
import Test from "../models/Test.js";
import Student from "../models/Student.js";
import Examiner from "../models/Examiner.js";

export const inviteStudents = async (req, res) => {
   try {
      const { testId } = req.params;
      let { studentEmails } = req.body;
      const { user } = req;

      if (typeof studentEmails === "string") studentEmails = [studentEmails];

      if (!Array.isArray(studentEmails) || !studentEmails.length)
         return res.status(400).json({ msg: "Provide at least one student email" });

      const test = await Test.findById(testId);
      if (!test) return res.status(404).json({ msg: "Test not found" });

      if (test.examiner.toString() !== user._id.toString())
         return res.status(401).json({ msg: "Unauthorized" });

      const users = await User.find({ email: { $in: studentEmails }, role: "student" });

      const foundEmails = users.map(u => u.email);
      const notFoundEmails = studentEmails.filter(email => !foundEmails.includes(email));
      const students = await Student.find({ user: { $in: users.map(u => u._id) } });

      let added = [];
      for (const s of students) {
         if (!test.students.includes(s._id)) {
            test.students.push(s._id);
            added.push(s._id);
         }
      }
      await test.save();

      let msg;
      if (added.length === 0) {
         msg = "No valid student emails were added.";
      } else if (notFoundEmails.length) {
         msg = `Some students added. Not found: ${notFoundEmails.join(", ")}`;
      } else {
         msg = "All students added to Test.";
      }

      res.status(200).json({
         msg,
         addedStudents: added,
         notFoundEmails
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal error occurred" });
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

      const wasPresent = test.students.some(id => id.toString() === studentId);
      if (!wasPresent) {
         return res.status(404).json({ msg: "Student was not part of the test" });
      }

      test.students = test.students.filter(id => id.toString() !== studentId);
      await test.save();

      res.status(200).json({ msg: "Student removed from Test" });
   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal error occurred" });
   }
};
