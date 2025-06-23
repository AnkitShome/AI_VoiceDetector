import User from "../models/User";
import Student from "../models/Student";
import Examiner from "../models/Examiner";
import Test from "../models/Test";
import Question from "../models/Question";

const inviteStudents = async (req, res) => {
   try {
      const { testId } = req.params;
      let { studentEmails } = req.body;
      const { user } = req;

      if (typeof studentEmails === "string") {
         studentEmails = [studentEmails];
      }

      if (!Array.isArray(studentEmails) || studentEmails.length === 0) {
         return res.status(400).json({
            msg: "Student emails are required and must be a non-empty array or string",
         });
      }

      const test = await Test.findById(testId);

      if (test.examinerId.toString() !== user._id.toString()) {
         return res.status(401).json({ msg: "Unauthorized" })
      }

      const users = await User.find({
         email: { $in: studentEmails },
         role: "student"
      })

      const students = await Student.find({
         user: { $in: users.map(u => u._id) }
      });

      for (const student of students) {
         if (!test.students.includes(student._id)) {
            test.students.push(student._id);
         }
      }

      await test.save();

      return res.status(200).json({ msg: "Students added to Test" })

   } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Internal error occured" })
   }
}


const removeStudent = async (req, res) => {
   try {
      const { testId } = req.params;
      const { studentId } = req.body;
      const { user } = req;

      const examiner = await Examiner.findOne({ userId: user._id });
      if (!examiner) return res.status(401).json({ msg: "Unauthorized" });

      const test = await Test.findById(testId);
      if (!test) return res.status(404).json({ msg: "Test not found" });

      if (test.examinerId.toString() !== examiner._id.toString()) {
         return res.status(401).json({ msg: "Unauthorized" });
      }

      const student = await Student.findById(studentId);
      if (!student) return res.status(404).json({ msg: "Student not found" });

      test.students = test.students.filter(
         (id) => id.toString() !== student._id.toString()
      );
      await test.save();

      return res.status(200).json({ msg: "Student removed from Test" });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal error occurred" });
   }
};


export {
   inviteStudents,
   removeStudent
}