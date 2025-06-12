import Test from "../models/Test.js";
import Question from "../models/Question.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import TestAttempt from "../models/TestAttempt.js";
import { v4 as uuidv4 } from 'uuid'

const createTest = async (req, res) => {
   try {
      const { title, start_time, end_time } = req.body

      const sharedLinkId = uuidv4();

      const test = await Test.create({
         title,
         examiner: req.user._id,
         start_time,
         end_time,
         sharedLink
      })

      const link = `${process.env.FRONTEND_URL}/join/test/${sharedLinkId}`;

      res.status(200).json({ msg: "Test created" }, test)

   } catch (error) {
      return res.status(500).json({ msg: 'An error occured while creating the test' })
   }
}

const addQuestions = async (req, res) => {
   try {

      const { questions } = req.body
      const { id: testId } = req.params.id
      const { user } = req.user

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
         return res.status(400).json({ msg: "Questions are required and must be an array" })
      }

      const test = await Test.findById(testId);
      if (!test) {
         return res.status(404).json({ msg: "Test not found" })
      }


      if (test.examiner.toString() !== user._id.toString()) {
         return res.status(403).json({ msg: "You are not authorised to add questions to this test" })
      }

      const questionDocs = await Question.insertMany(questions)
      const questionsId = questionDocs.map(q => q._id)

      test.questions.push(...questionsId)

      await test.save()

      return res.status(200).json({ msg: "Questions added successfully", questions: questionDocs })

   } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server error" });
   }
}

const inviteStudents = async (req, res) => {
   try {
      const { id: testId } = req.params
      const { studentEmails } = req.body
      const { user } = req

      if (!Array.isArray(studentEmails) || studentEmails.length === 0) {
         return res.status(400).json({ msg: "Student emails are required and must be an array" });
      }

      const test = await Test.findById(testId)
      if (!test) {
         return res.status(404).json({ msg: "test not found" })
      }

      if (test.examiner.toString() !== user._id.toString()) {
         return res.status(403).json({ msg: "You are not authorized to invite students to this test" })
      }

      const users = await User.find({ email: { $in: studentEmails }, role: 'student' })

      if (users.length === 0) {
         return res.status(404).json({ msg: "No matching students found for the provided emails" })
      }

      const studentDocs = await Student.find({ user: { $in: users.map(u => u._id) } })

      if (studentDocs.length === 0) {
         return res.status(404).json({ msg: "No student records foun for these users" })
      }

      const studentIds = studentDocs.map(s => s._id.toString())
      const existingStudentIds = test.students?.map(id => id.toString()) || []
      const newStudentIds = studentIds.filter(id => !existingStudentIds.includes(id));

      test.students = [...existingStudentIds, ...newStudentIds]
      await test.save()

   } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server error" });
   }
}

const joinTest = async (req, res) => {
   try {
      const { user } = req;
      const { id: testId } = req.params

      const student = await Student.findOne({ user: user._id }).populate({
         path: 'user',
         select: 'name email role'
      });

      if (!student) {
         return res.status(403).json({ msg: "Only registered students can access the test" });
      }

      const test = await Test.findById(testId)

      if (!test) { return res.status(404).json({ msg: "Test does not exist" }) }

      const isAllowed = test.students.some((studentId) => { studentId.toString() === user._id.toString() })

      if (!isAllowed) { return res.status(403).json({ msg: "Student is not allowed to access this test" }) }

      const now = new Date()
      if (now < new Date(test.start_time)) {
         return res.status(403).json({ msg: "Test has not started yet" });
      }

      if (now > new Date(test.end_time)) {
         return res.status(403).json({ msg: "Test has already ended" })
      }

      let attempt = await TestAttempt.findOne({ test: test._id, student: student._id });

      if (!attempt) {
         attempt = await TestAttempt.create({
            test: test._id,
            student: student._id
         });
      }

      return res.status(200).json({
         msg: "Student can access the test",
         test,
         student: {
            name: student.user.name,
            role: student.user.role,
            scholarId: student.scholarId,
            emai: student.user.email
         },
         attemptId: attempt._id
      })
   } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Server error" })
   }
}

const startTest = async (req, res) => {
   try {
      const { user } = req;
      const { id: testId } = req.params;

      const student = await Student.findOne({ user: user._id });
      if (!student) {
         return res.status(403).json({ msg: "Unauthorized" });
      }

      const attempt = await TestAttempt.findOne({ test: testId, student: student._id });

      if (attempt.startedAt) {
         return res.status(400).json({ msg: "Test already started" });
      }

      attempt.startedAt = new Date();
      await attempt.save();

      return res.status(200).json({ msg: "Test started", startedAt: attempt.startedAt })
   } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Server error" })
   }
}

const submitTest = async (req, res) => {
   try {
      const { user } = req;
      const { id: testId } = req.params;

      const student = await Student.findById(user._id)
      if (!student) {
         return res.status(403).json({ msg: "Unauthorized" })
      }

      const attempt = await TestAttempt.findOne({ test: testId, student: student._id })

      if (!attempt) {
         return res.status(404).json({ msg: "Test not attempted" })
      }

      if (attempt.submittedAt) {
         return res.status(400).json({ msg: "Test already submitted" })
      }

      attempt.submittedAt = new Date()
      attempt.answers = answers || []
      await attempt.save()

      return res.status(200).json({ msg: "Test submitted successfully" })

   } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Server error" })
   }
}

export { createTest, addQuestions, inviteStudents, joinTest }