// src/components/EvaluationPage.jsx
import React from "react";
import QuestionBlock from "./QuestionBlock";
import AnswerBlock from "./AnswerBlock";
import "bootstrap/dist/css/bootstrap.min.css";

const mockData = [
  {
    question: "What is the capital of France?",
    answers: [
      { studentName: "Alice", answer: "Paris" },
      { studentName: "Bob", answer: "Lyon" },
    ],
  },
  {
    question: "Define Newton's second law.",
    answers: [
      { studentName: "Charlie", answer: "F = ma" },
      { studentName: "Dave", answer: "Force equals mass into acceleration" },
    ],
  },
];

const EvaluationPage = () => {
  return (
    <div className="container py-5" style={{ fontFamily: 'Segoe UI' }}>
      <h1 className="text-center mb-5 text-primary display-5 fw-bold">
        Evaluation Dashboard
      </h1>

      {mockData.map((item, index) => (
        <div key={index} className="mb-5">
          <QuestionBlock question={item.question} />
          <div className="mt-4">
            {item.answers.map((ans, idx) => (
              <AnswerBlock
                key={idx}
                studentName={ans.studentName}
                answer={ans.answer}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EvaluationPage;
