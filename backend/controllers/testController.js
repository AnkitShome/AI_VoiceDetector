import Test from "../models/Test.js";
import Question from "../models/Question.js";

const createTest = async (req, res) => {
   try {
      const { title, description, start_time, end_time, questions } = req.body

      const test = await Test.create({
         title,
         description,
         created_by: req.user._id,
         start_time,
         end_time
      })

      const questionsCreated = await Question.insertMany(
         questions.map(q => ({ test: test._id, q }))
      )

      test.questions = questionsCreated.map(q => q._id)
      await test.save()

      res.status(200).json({ msg: "Test created" }, test)

   } catch (error) {
      return res.status(500).json({ 'An error occured while creating the test'})
   }
}

export { createTest }