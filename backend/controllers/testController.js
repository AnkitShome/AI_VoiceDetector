import Test from "../models/Test.js";
import Question from "../models/Question.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import TestAttempt from "../models/TestAttempt.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer"; // or const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
   service: "Gmail", // or "Outlook", "Yahoo", or use `host`, `port`, and `auth` manually
   auth: {
      user: "your-email@gmail.com",
      pass: "your-app-password", // ✅ NOT your Gmail password – use App Password or env var
   },
});


const createTest = async (req, res) => {
   try {
      const { title, start_time, end_time } = req.body;

      const sharedLinkId = uuidv4();

      const test = await Test.create({
         title,
         examiner: req.user._id,
         start_time,
         end_time,
         sharedLinkId,
      });

      const link = `${process.env.FRONTEND_URL}/join/test/${sharedLinkId}`;

      res.status(200).json({ msg: "Test created", test });
   } catch (error) {
      console.error("Error creating test:", error);
      return res
         .status(500)
         .json({ msg: "An error occurred while creating the test" });
   }
};

const addQuestion = async (req, res) => {
   try {
      const { testId } = req.params;
      const { question } = req.body;

      if (!testId) {
         return res.status(404).json({ msg: "Test not found" });
      }

      const test = await Test.findById(testId);

      const questionDoc = await Question.create({
         testId: testId,
         questionText: question
      })

      test.questions.push(questionDoc._id)

      await test.save();

      res.status(200).json({ msg: "Question added successfully" })
   } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal error occurred" })
   }
}

const addQuestions = async (req, res) => {

   try {
      const { testId } = req.params;
      const { questions } = req.body;

      if (!testId || !Array.isArray(questions)) {
         return res.status(400).json({ msg: "Invalid testId or questions" });
      }

      const test = await Test.findById(testId);
      if (!test) {
         return res.status(404).json({ msg: "Test not found" });
      }

      const questionDocs = await Promise.all(
         questions.map((questionText) =>
            Question.create({
               testId,
               questionText
            })
         )
      );

      test.questions = [...test.questions, ...questionDocs.map(q => q._id)]
      await test.save();

      res.status(200).json({ msg: "Questions added successfully" });

   } catch (error) {
      console.error("Add questions error:", error);
      res.status(500).json({ msg: "Server error while adding questions" });
   }
};



// GET /api/tests/student-upcoming
// const getUpcomingTestsForStudent = async (req, res) => {
//    try {
//       const { email } = req.user;
//       console.log("req.user: ", req.user);
//       console.log("Current logged in email:", req.user.email);

//       const now = new Date(); // UTC

//       console.log("NOW (UTC):", now.toISOString());

//       const tests = await Test.find({
//          student: email,
//          end_time: { $gt: now }, // Compare with UTC
//       }).select("title start_time end_time examiner sharedLinkId createdAt");
//       console.log(tests);
//       return res.status(200).json({ tests });
//    } catch (err) {
//       console.error(err);
//       return res.status(500).json({ msg: "Server Error" });
//    }
// };


//get all emails of registered students
// const getAllStudentEmails = async (req, res) => {
//    try {
//       const students = await User.find({ role: "student" }).select("email");
//       const emails = students.map((student) => student.email);
//       res.json({ emails });
//    } catch (err) {
//       res.status(500).json({ msg: "Failed to fetch student emails" });
//    }
// };

//get all emails of registered prof
// const getAllProfEmails = async (req, res) => {
//    try {
//       const professors = await User.find({ role: "examiner" }).select("email username");
//       res.json({ professors }); // 🔄 key should match what frontend expects
//    } catch (err) {
//       res.status(500).json({ msg: "Failed to fetch prof emails and usernames" });
//    }
// };


// export const assignEvaluator = async (req, res) => {
//   const { testId, evaluatorUsername } = req.body;

//   const evaluator = await User.findOne({
//     username: evaluatorUsername,
//     role: "examiner",
//   });
//   if (!evaluator) {
//     console.log("evaluator", evaluator);
//     return res.status(404).json({ msg: "Evaluator not found" });
//   }

//   const test = await Test.findById(testId);
//   if (!test) {
//     return res.status(404).json({ msg: "Test not found" });
//   }

//   // // Optional: update test with evaluator info
//   // test.evaluator = evaluator._id;
//   // await test.save();

//   // Send email
//   await sendEvaluatorEmail({
//     to: evaluator.email,
//     testTitle: test.title,
//     evaluatorUsername,
//     tempPassword: "some-password", // optional
//     link: `http://localhost:3000/evaluator/${test._id}`,
//   });

//   return res.status(200).json({ msg: "Evaluator assigned and email sent." });
// };

// const sendEvaluatorEmail = async ({
//   to,
//   testTitle,
//   evaluatorUsername,
//   tempPassword,
//   link,
// }) => {
//   await transporter.sendMail({
//     from: "admin@yourapp.com",
//     to,
//     subject: `You’ve been assigned as evaluator for: ${testTitle}`,
//     html: `
//       <h3>Hello ${evaluatorUsername},</h3>
//       <p>You’ve been selected to evaluate the test titled <strong>${testTitle}</strong>.</p>
//       <p><strong>Login:</strong> ${evaluatorUsername}</p>
//       <p><strong>Password:</strong> ${tempPassword}</p>
//       <p>Access the evaluator page here: <a href="${link}">Evaluator Link</a></p>
//     `,
//   });
// };


// const inviteStudents = async (req, res) => {
//    console.log("BODY RECEIVED:", req.body);
//    try {
//       const { id: testId } = req.params;
//       let { studentEmails } = req.body;
//       const { user } = req;

//       // Normalize studentEmails to an array if it's a string
//       if (typeof studentEmails === "string") {
//          studentEmails = [studentEmails];
//       }

//       if (!Array.isArray(studentEmails) || studentEmails.length === 0) {
//          return res.status(400).json({
//             msg: "Student emails are required and must be a non-empty array or string",
//          });
//       }

//       const test = await Test.findById(testId);
//       if (!test) {
//          return res.status(404).json({ msg: "Test not found" });
//       }

//       if (test.examiner.toString() !== user._id.toString()) {
//          return res.status(403).json({
//             msg: "You are not authorized to invite students to this test",
//          });
//       }

//       const users = await User.find({
//          email: { $in: studentEmails },
//          role: "student",
//       });

//       if (users.length === 0) {
//          return res
//             .status(404)
//             .json({ msg: "No matching students found for the provided emails" });
//       }

//       const studentDocs = await Student.find({
//          user: { $in: users.map((u) => u._id) },
//       });

//       if (studentDocs.length === 0) {
//          return res
//             .status(404)
//             .json({ msg: "No student records found for these users" });
//       }

//       const studentIds = studentDocs.map((s) => s._id.toString());
//       const existingStudentIds = test.students?.map((id) => id.toString()) || [];
//       const newStudentIds = studentIds.filter(
//          (id) => !existingStudentIds.includes(id)
//       );

//       test.students = [...existingStudentIds, ...newStudentIds];
//       await test.save();

//       return res.status(200).json({
//          msg: "Students successfully invited",
//          invitedStudents: newStudentIds.length,
//       });
//    } catch (error) {
//       console.error(error);
//       return res.status(500).json({ msg: "Server error", error: error.message });
//    }
// };

// const joinTest = async (req, res) => {
//    try {
//       const { user } = req;
//       const { testId } = req.params;

//       const student = await Student.findOne({ userId: user._id }).populate({
//          path: "user",
//          select: "name email role",
//       });

//       if (!student) {
//          return res
//             .status(403)
//             .json({ msg: "Only registered students can access the test" });
//       }

//       const test = await Test.findById(testId);

//       if (!test) {
//          return res.status(404).json({ msg: "Test does not exist" });
//       }

//       const isAllowed = test.students.some((studentId) => {
//          studentId.toString() === user._id.toString();
//       });

//       if (!isAllowed) {
//          return res
//             .status(403)
//             .json({ msg: "Student is not allowed to access this test" });
//       }

//       const now = new Date();

//       if (now < new Date(test.startTime)) {
//          return res.status(403).json({ msg: "Test has not started yet" });
//       }

//       if (now > new Date(test.endTime)) {
//          return res.status(403).json({ msg: "Test has already ended" });
//       }

//       let attempt = await TestAttempt.findOne({
//          testId: test._id,
//          studentId: student._id,
//       });

//       if (!attempt) {
//          attempt = await TestAttempt.create({
//             testId: test._id,
//             studentId: student._id,
//          });
//       }

//       return res.status(200).json({
//          msg: "Student can access the test",
//          test,
//          student: {
//             name: student.user.name,
//             role: student.user.role,
//             scholarId: student.scholarId,
//             emai: student.user.email,
//          },
//          attemptId: attempt._id,
//       });
//    } catch (error) {
//       console.log(error);
//       return res.status(500).json({ msg: "Server error" });
//    }
// };

// const startTest = async (req, res) => {
//    try {
//       const { user } = req;
//       const { testId } = req.params;

//       const student = await Student.findOne({ userId: user._id });
//       if (!student) {
//          return res.status(403).json({ msg: "Unauthorized" });
//       }

//       const attempt = await TestAttempt.findOne({
//          testId,
//          studentId: student._id,
//       });

//       if (attempt.startedAt) {
//          return res.status(400).json({ msg: "Test already started" });
//       }

//       attempt.startedAt = new Date();
//       await attempt.save();

//       return res
//          .status(200)
//          .json({ msg: "Test started", startedAt: attempt.startedAt });
//    } catch (error) {
//       console.log(error);
//       return res.status(500).json({ msg: "Server error" });
//    }
// };

// const submitTest = async (req, res) => {
//    try {
//       const { user } = req;
//       const { id: testId } = req.params;

//       const student = await Student.findById(user._id);
//       if (!student) {
//          return res.status(403).json({ msg: "Unauthorized" });
//       }

//       const attempt = await TestAttempt.findOne({
//          test: testId,
//          student: student._id,
//       });

//       if (!attempt) {
//          return res.status(404).json({ msg: "Test not attempted" });
//       }

//       if (attempt.submittedAt) {
//          return res.status(400).json({ msg: "Test already submitted" });
//       }

//       attempt.submittedAt = new Date();
//       attempt.answers = answers || [];
//       await attempt.save();

//       return res.status(200).json({ msg: "Test submitted successfully" });
//    } catch (error) {
//       console.log(error);
//       return res.status(500).json({ msg: "Server error" });
//    }
// };

export {
   createTest,
   addQuestions,
   addQuestion,
   getUpcomingTestsForStudent,
   getAllStudentEmails,
   getAllProfEmails,
};
