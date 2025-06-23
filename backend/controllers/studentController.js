import User from "../models/User";
import Student from "../models/Student";
import Examiner from "../models/Examiner";
import Test from "../models/Test";
import Question from "../models/Question";

const joinTest = async (req, res) => {
   try {
      const { user } = req;
      const { testId } = req.params;

      const student = await Student.findOne({ userId: user._id }).populate({
         path: "user",
         select: "name email role",
      });

      if (!student) {
         return res
            .status(403)
            .json({ msg: "Only registered students can access the test" });
      }

      const test = await Test.findById(testId);

      if (!test) {
         return res.status(404).json({ msg: "Test does not exist" });
      }

      const isAllowed = test.students.some((studentId) => {
         studentId.toString() === user._id.toString();
      });

      if (!isAllowed) {
         return res
            .status(403)
            .json({ msg: "Student is not allowed to access this test" });
      }

      const now = new Date();

      if (now < new Date(test.startTime)) {
         return res.status(403).json({ msg: "Test has not started yet" });
      }

      if (now > new Date(test.endTime)) {
         return res.status(403).json({ msg: "Test has already ended" });
      }

      let attempt = await TestAttempt.findOne({
         testId: test._id,
         studentId: student._id,
      });

      if (!attempt) {
         attempt = await TestAttempt.create({
            testId: test._id,
            studentId: student._id,
         });
      }

      return res.status(200).json({
         msg: "Student can access the test",
         test,
         student: {
            name: student.user.name,
            role: student.user.role,
            scholarId: student.scholarId,
            emai: student.user.email,
         },
         attemptId: attempt._id,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Server error" });
   }
};

const startTest = async (req, res) => {
   try {
      const { user } = req;
      const { testId } = req.params;

      const student = await Student.findOne({ userId: user._id });
      if (!student) {
         return res.status(403).json({ msg: "Unauthorized" });
      }

      const attempt = await TestAttempt.findOne({
         testId,
         studentId: student._id,
      });

      if (attempt.startedAt) {
         return res.status(400).json({ msg: "Test already started" });
      }

      attempt.startedAt = new Date();
      await attempt.save();

      return res
         .status(200)
         .json({ msg: "Test started", startedAt: attempt.startedAt });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Server error" });
   }
};

const submitTest = async (req, res) => {
   try {
      const { user } = req;
      const { testId } = req.params;

      const student = await Student.findById(user._id);
      if (!student) {
         return res.status(403).json({ msg: "Unauthorized" });
      }

      const attempt = await TestAttempt.findOne({
         testId,
         studentId: student._id,
      });

      if (!attempt) {
         return res.status(404).json({ msg: "Test not attempted" });
      }

      if (attempt.submittedAt) {
         return res.status(400).json({ msg: "Test already submitted" });
      }

      attempt.submittedAt = new Date();
      attempt.answers = answers || [];
      await attempt.save();

      return res.status(200).json({ msg: "Test submitted successfully" });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Server error" });
   }
};

const getUpcomingTestsForStudent = async (req, res) => {
   try {
      const { email } = req.user;
      const now = new Date();

      const student = await Student.findOne({ userId: req.user._id });
      if (!student) return res.status(404).json({ msg: "Student not found" });

      const tests = await Test.find({
         students: student._id,
         endTime: { $gt: now },
      }).select("title startTime endTime examinerId sharedLinkId createdAt");

      res.status(200).json({ tests });
   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server Error" });
   }
};

export {
   joinTest,
   startTest,
   submitTest,
   getUpcomingTestsForStudent
}