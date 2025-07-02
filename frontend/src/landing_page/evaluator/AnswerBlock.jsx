// src/components/AnswerBlock.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AnswerBlock = ({ answer, studentName }) => {
  const [remark, setRemark] = useState("");
  const [rating, setRating] = useState(0);

  return (
    <div className="card shadow-lg mb-4 border-0" style={{ fontFamily: 'Segoe UI', fontSize: '1.1rem' }}>
      <div className="card-body">
        <h5 className="card-title text-primary fw-semibold mb-2">
          {studentName}'s Answer:
        </h5>
        <p className="card-text text-dark">{answer}</p>

        <div className="form-group mt-3">
          <label className="fw-semibold mb-1">Evaluator Remark:</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Write your remarks here..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </div>

        <div className="mt-3">
          <label className="fw-semibold me-2">Rating:</label>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`fs-4 me-1 ${
                star <= rating ? "text-warning" : "text-secondary"
              }`}
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              onClick={() => setRating(star)}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.3)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1.0)")}
              title={`${star} Star`}
            >
              ★
            </span>
          ))}
          <span className="ms-2 fw-medium">{rating}/5</span>
        </div>
      </div>
    </div>
  );
};

export default AnswerBlock;
