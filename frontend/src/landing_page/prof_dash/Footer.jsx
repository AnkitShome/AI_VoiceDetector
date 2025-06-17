import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TestFormSection = () => {
  const { profName } = useParams();

  // Convert dash-case to Title Case
  const displayName = profName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    professorName: displayName,
    testTitle: "",
    startTime: "",
    endTime: "",
    studentEmail: "",
    numberOfQuestions: 1,
    questions: [""],
    department: "",
  });

  const handleQuestionChange = (index, value) => {
    const updated = [...formData.questions];
    updated[index] = value;
    setFormData({ ...formData, questions: updated });
  };

  const handleNumQuestionsChange = (e) => {
    const num = parseInt(e.target.value);
    const updatedQuestions = Array(num).fill("");
    setFormData({
      ...formData,
      numberOfQuestions: num,
      questions: updatedQuestions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create Test
      const testPayload = {
        title: formData.testTitle,
        department: formData.department,
        start_time: formData.startTime,
        end_time: formData.endTime,
        student: formData.studentEmail,
      };

      const createTestRes = await axios.post(
        "http://localhost:5000/api/professor/createTest",
        testPayload,
        {
          withCredentials: true,
        }
      );

      const { test, msg: testMsg } = createTestRes.data;
      const testId=test._id;
      toast.success(testMsg);

      // 2. Add Questions
      const questionPayload = {
        testId,
        questions: formData.questions,
      };
      console.log("➡️ Sending questions: ", questionPayload);
      const questionRes = await axios.post(
        "http://localhost:5000/api/professor/addQuestions",
        
          questionPayload,
        
        { withCredentials: true }
      );

      toast.success(questionRes.data.msg);

      console.log("Submitting Questions:", formData.questions);

  //     // 3. Invite Student
  //     const invitePayload = {
  //       testId,
  //       studentEmails: [formData.studentEmail], // wrap it in an array
  //     };

  //     const inviteRes = await axios.post(
  //       "http://localhost:5000/api/professor/inviteStudent",
  //       invitePayload,
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     toast.success(inviteRes.data.msg);

  //     setShowForm(false);
    } catch (err) {
      console.error("Test creation failed", err);
      console.error("Response error:", err?.response);
      console.log(err);
      const errorMsg = err?.response?.data?.msg || "Something went wrong";
      toast.error(errorMsg);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="d-flex justify-content-center mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary px-4 py-2 shadow"
        >
          Create Test
        </button>
      </div>

      {showForm && (
        <div className="card p-4 shadow mx-auto" style={{ maxWidth: "600px" }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Professor Name</label>
              <input
                type="text"
                value={formData.professorName}
                disabled
                className="form-control bg-light"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Department</label>
              <input
                type="text"
                required
                className="form-control"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Test Title</label>
              <input
                type="text"
                required
                className="form-control"
                value={formData.testTitle}
                onChange={(e) =>
                  setFormData({ ...formData, testTitle: e.target.value })
                }
              />
            </div>

            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Start Time</label>
                <input
                  type="datetime-local"
                  required
                  className="form-control"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>
              <div className="col">
                <label className="form-label">End Time</label>
                <input
                  type="datetime-local"
                  required
                  className="form-control"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Student Email</label>
              <input
                type="email"
                required
                className="form-control"
                value={formData.studentEmail}
                onChange={(e) =>
                  setFormData({ ...formData, studentEmail: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Number of Questions</label>
              <input
                type="number"
                min="1"
                required
                className="form-control"
                value={formData.numberOfQuestions}
                onChange={handleNumQuestionsChange}
              />
            </div>

            {formData.questions.map((q, idx) => (
              <div className="mb-3" key={idx}>
                <label className="form-label">Question {idx + 1}</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={q}
                  onChange={(e) => handleQuestionChange(idx, e.target.value)}
                />
              </div>
            ))}

            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="btn btn-success px-4">
                Submit
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-danger px-4"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TestFormSection;
