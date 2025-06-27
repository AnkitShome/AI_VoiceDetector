import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Select from "react-select";

const TestFormSection = () => {
  const { profName } = useParams();

  const displayName = profName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const [showForm, setShowForm] = useState(false);
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [formData, setFormData] = useState({
    professorName: displayName,
    testTitle: "",
    startTime: "",
    endTime: "",
    numberOfQuestions: 1,
    questions: [""],
    department: "",
  });

  const [assignEvaluator, setAssignEvaluator] = useState(false);
  const [evaluatorOptions, setEvaluatorOptions] = useState([]);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);

  // Fetch student emails
  useEffect(() => {
    const fetchScholarIds = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/details/allStudentScholarId",
          { withCredentials: true }
        );
        const options = res.data.scholarIds.map((scholarId) => ({
          label: scholarId,
          value: scholarId,
        }));
        setStudentOptions(options);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load student footer scholar ids");
      }
    };
    fetchScholarIds();
  }, []);

  // Fetch professor emails for evaluator dropdown
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/details/allProfEmails",
          { withCredentials: true }
        );

        const options = data.professors.map((prof) => ({
          value: prof.username, // ✅ send username to backend
          label: prof.username, // or just prof.username
        }));

        setEvaluatorOptions(options);
      } catch (err) {
        toast.error("Failed to load professor usernames");
      }
    };

    fetchProfessors();
  }, []);

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
      const schIds = selectedStudents.map((s) => s.value);

      for (let schId of schIds) {
        const testPayload = {
          title: formData.testTitle,
          department: formData.department,
          start_time: formData.startTime,
          end_time: formData.endTime,
          student: schId,
        };

        const createTestRes = await axios.post(
          "http://localhost:5000/api/test/create",
          testPayload,
          { withCredentials: true }
        );

        const { test, msg: testMsg } = createTestRes.data;
        // toast.success(`${email}: ${testMsg}`);

        const testId = test._id;

        const questionPayload = {
          testId,
          questions: formData.questions,
        };

        await axios.post(
          `http://localhost:5000/api/test/${testId}/questions`, // ✅ Use backticks & inject testId
          questionPayload,
          { withCredentials: true }
        );

        // ✅ Assign evaluator if selected
        if (assignEvaluator && selectedEvaluator) {
          const assignPayload = {
            testId,
            evaluatorUsername: selectedEvaluator.value, // value = username
          };

          await axios.post(
            `http://localhost:5000/api/evaluator/send-link/${testId}`,
            assignPayload,
            { withCredentials: true }
          );

          // toast.success(`Evaluator assigned to test for ${email}`);
        }
      }

      // ✅ Reset everything
      setFormData({
        professorName: displayName,
        testTitle: "",
        startTime: "",
        endTime: "",
        studentEmail: "",
        numberOfQuestions: 1,
        questions: [""],
        department: "",
      });
      setSelectedStudents([]);
      setSelectedEvaluator(null);
      setAssignEvaluator(false);
      toast.success("All tests created and evaluators assigned.");
    } catch (err) {
      const errorMsg = err?.response?.data?.msg || "Something went wrong";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="container mt-5">
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
        <div
          className="card shadow p-5 hover-scale-wrapper"
          style={{
            maxWidth: "1240px",
            margin: "auto",
            transition: "transform 0.3s ease",
            borderRadius: "20px",
          }}
        >
          <div className="d-flex justify-content-between align-items-start flex-wrap">
            <div style={{ flex: "1 1 60%" }}>
              <h3 className="fw-bold mb-3 text-primary">Create Test</h3>

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
                  <label className="form-label">Select Students</label>
                  <Select
                    options={studentOptions}
                    isMulti
                    value={selectedStudents}
                    onChange={(selected) => setSelectedStudents(selected)}
                    placeholder="Choose students..."
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
                      onChange={(e) =>
                        handleQuestionChange(idx, e.target.value)
                      }
                    />
                  </div>
                ))}

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="assignEvaluator"
                    checked={assignEvaluator}
                    onChange={(e) => setAssignEvaluator(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="assignEvaluator">
                    Assign a human evaluator?
                  </label>
                </div>

                {assignEvaluator && (
                  <div className="mb-3">
                    <label className="form-label">Select Evaluator</label>
                    <Select
                      options={evaluatorOptions}
                      value={selectedEvaluator}
                      onChange={(selected) => setSelectedEvaluator(selected)}
                      placeholder="Choose evaluator..."
                    />
                  </div>
                )}

                <div className="d-flex justify-content-between mt-4">
                  <button type="submit" className="btn btn-success px-4">
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-danger px-4"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div
              style={{
                flex: "1 1 35%",
                textAlign: "center",
                paddingTop: "20px",
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2221/2221190.png"
                alt="Test Illustration"
                style={{ maxWidth: "150px", marginBottom: "20px" }}
              />
              <p className="text-secondary" style={{ fontSize: "0.95rem" }}>
                Use this form to assign tests to students with full control over
                time and questions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestFormSection;
