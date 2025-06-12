import Test from "../models/Test.js";
import Question from "../models/Question.js";

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

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
         return res.status(400).json({ msg: "Questions are required and must be an array" })
      }

      const test = await Test.findById(testId);
      if (!test) {
         return res.status(404).json({ msg: "Test not found" })
      }

      const questionDocs = await Question.insertMany(questions)
      const questionsId = questionDocs.map(q => q._id)

      test.questions.push(...questionIds)

      await test.save()

      return res.status(200).json({ msg: "Questions added successfully", questions: questionDocs })

   } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server error" });
   }
}


export { createTest, addQuestions }