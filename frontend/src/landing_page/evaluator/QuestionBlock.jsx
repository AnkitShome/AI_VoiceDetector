// src/components/QuestionBlock.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const QuestionBlock = ({ question }) => (
  <div className="alert alert-primary fs-5 fw-semibold" role="alert" style={{ fontFamily: 'Segoe UI' }}>
    Question: {question}
  </div>
);

export default QuestionBlock;
