import Test from "../models/Test.js";
import Question from "../models/Question.js";
import Student from "../models/Student.js";
import User from "../models/User.js";

const createTest = async (req, res) => {
   try {
      const { title, start_time, end_time, sharedLink } = req.body

      const test = await Test.create({
         title,
         examiner: req.user._id,
         start_time,
         end_time,
         sharedLink
      })

      res.status(200).json({ msg: "Test created" }, test)

   } catch (error) {
      return res.status(500).json({ 'An error occured while creating the test'})
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


export { createTest, addQuestions }