import Test from "../models/Test.js";
import Question from "../models/Question.js";
import TestAttempt from "../models/TestAttempt.js";
import { v4 as uuidv4 } from "uuid";

export const createTest = async (req, res) => {
   try {
      const { title, startTime, endTime, department } = req.body;

      const sharedLinkId = uuidv4();

      const test = await Test.create({
         title,
         examiner: req.user._id,
         department,
         startTime,
         endTime,
         sharedLinkId,
      });

      res.status(200).json({ msg: "Test created", test });

   } catch (err) {
      console.error("Error creating test:", err);
      res.status(500).json({ msg: "An error occurred while creating the test" });
   }
};

export const addQuestion = async (req, res) => {
   try {
      const { testId } = req.params;
      const { question } = req.body;

      const test = await Test.findById(testId);
      if (!test) return res.status(404).json({ msg: "Test not found" });

      const q = await Question.create({ testId, questionText: question });

      test.questions.push(q._id);

      await test.save();

      res.status(200).json({ msg: "Question added successfully" });
   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal error occurred" });
   }
};

export const addQuestions = async (req, res) => {
   try {
      const { testId } = req.params;
      const { questions } = req.body;

      if (!testId || !Array.isArray(questions))
         return res.status(400).json({ msg: "Invalid testId or questions" });

      const test = await Test.findById(testId);
      if (!test) return res.status(404).json({ msg: "Test not found" });

      const docs = await Promise.all(
         questions.map(qt => Question.create({ testId, questionText: qt }))
      );

      test.questions.push(...docs.map(d => d._id));

      await test.save();

      res.status(200).json({ msg: "Questions added successfully" });
   } catch (err) {
      console.error("Add questions error:", err);
      res.status(500).json({ msg: "Server error while adding questions" });
   }
};
