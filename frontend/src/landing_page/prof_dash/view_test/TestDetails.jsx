import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select"; // <-- ADDED

import Hero from "../Hero";

const TestDetails = () => {
   const { profName, testId } = useParams();
   const navigate = useNavigate();
   const [test, setTest] = useState(null);
   const [loading, setLoading] = useState(true);

   // ScholarId select
   const [scholarOptions, setScholarOptions] = useState([]);
   const [selectedScholar, setSelectedScholar] = useState(null);

   const [addQuestionText, setAddQuestionText] = useState("");

   // Fetch test
   const fetchTest = async () => {
      setLoading(true);
      try {
         const res = await axios.get(
            `http://localhost:5000/api/test/${testId}`,
            { withCredentials: true }
         );
         setTest(res.data.test);
      } catch (err) {
         toast.error("Failed to fetch test details");
      } finally {
         setLoading(false);
      }
   };

   // Fetch all scholar IDs
   useEffect(() => {
      axios.get(`http://localhost:5000/api/details/unaddedScholarId/${testId}`, {
         withCredentials: true,
      })
         .then((res) => {
            setScholarOptions(
               res.data.scholarIds.map((sid) => ({
                  value: sid,
                  label: sid,
               }))
            );
         })
         .catch(() => toast.error("Failed to fetch scholar IDs"));
   }, []);

   useEffect(() => {
      fetchTest();
      // eslint-disable-next-line
   }, [testId]);

   // Remove Student
   const handleRemoveStudent = async (studentId) => {
      try {
         await axios.delete(
            `http://localhost:5000/api/examiner/remove/${test._id}/student/${studentId}`,
            { withCredentials: true }
         );
         toast.success("Student removed");
         fetchTest();
      } catch {
         toast.error("Failed to remove student");
      }
   };

   // Add Student
   const handleAddStudent = async () => {
      if (!selectedScholar) {
         toast.warn("Choose a Scholar ID");
         return;
      }
      try {
         await axios.post(
            `http://localhost:5000/api/examiner/invite/${test._id}`,
            { scholarIds: [selectedScholar.value] },
            { withCredentials: true }
         );
         toast.success("Student added");
         setSelectedScholar(null);
         fetchTest();
      } catch (err) {
         toast.error(
            err?.response?.data?.msg || "Failed to add student"
         );
      }
   };

   // Remove Question
   const handleRemoveQuestion = async (questionId) => {
      try {
         await axios.delete(
            `http://localhost:5000/api/examiner/${test._id}/question/${questionId}`,
            { withCredentials: true }
         );
         toast.success("Question removed");
         fetchTest();
      } catch {
         toast.error("Failed to remove question");
      }
   };

   // Add Question
   const handleAddQuestion = async () => {
      if (!addQuestionText.trim()) {
         toast.warn("Enter a question");
         return;
      }
      try {
         await axios.post(
            `http://localhost:5000/api/test/${test._id}/question`,
            { question: addQuestionText },
            { withCredentials: true }
         );
         toast.success("Question added");
         setAddQuestionText("");
         fetchTest();
      } catch {
         toast.error("Failed to add question");
      }
   };

   if (loading)
      return (
         <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <div>Loading test details...</div>
         </div>
      );

   if (!test)
      return (
         <div className="container py-4">
            <ToastContainer />
            <div className="alert alert-danger text-center">
               Test not found or failed to load.
            </div>
         </div>
      );

   return (
      <>
         <Hero />
         <ToastContainer />
         <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
               <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
                  Test Details
               </h2>
               <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/prof-dash/:profName/view-tests`)}
               >
                  Back to All Tests
               </button>
            </div>

            <div className="card shadow-sm mb-4">
               <div className="card-body">
                  <h4 className="card-title">{test.title}</h4>
                  <p className="card-text">
                     <strong>Department:</strong> {test.department || "N/A"}
                  </p>
                  <p className="card-text">
                     <strong>Start:</strong>{" "}
                     {new Date(test.start_time).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                     })}
                  </p>
                  <p className="card-text">
                     <strong>End:</strong>{" "}
                     {new Date(test.end_time).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                     })}
                  </p>
                  <p className="card-text">
                     <strong>Test Link:</strong>
                     <br />
                     <span className="text-primary small">
                        {test.sharedLinkId
                           ? `${window.location.origin}/test/${test.sharedLinkId}`
                           : "-"}
                     </span>
                  </p>
                  <p className="card-text">
                     <strong>No. of Questions:</strong>{" "}
                     {test.questions?.length ?? 0}
                  </p>
                  <p className="card-text">
                     <strong>No. of Students:</strong>{" "}
                     {test.students?.length ?? 0}
                  </p>
               </div>
            </div>

            <div className="row">
               {/* Questions */}
               <div className="col-md-6 mb-4">
                  <div className="card h-100">
                     <div className="card-header fw-bold bg-primary text-white d-flex justify-content-between align-items-center">
                        Questions
                        <span className="badge bg-light text-primary">{test.questions?.length ?? 0}</span>
                     </div>
                     <ul className="list-group list-group-flush">
                        {(test.questions || []).length === 0 ? (
                           <li className="list-group-item text-muted">No questions found.</li>
                        ) : (
                           test.questions.map((q, idx) => (
                              <li
                                 key={q._id || idx}
                                 className="list-group-item d-flex justify-content-between align-items-center"
                              >
                                 <span>
                                    <strong>Q{idx + 1}:</strong> {q.questionText || "Untitled"}
                                 </span>
                                 <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleRemoveQuestion(q._id)}
                                 >
                                    Remove
                                 </button>
                              </li>
                           ))
                        )}
                     </ul>
                     {/* Add question */}
                     <div className="input-group p-3 border-top">
                        <input
                           type="text"
                           className="form-control"
                           placeholder="Enter new question"
                           value={addQuestionText}
                           onChange={(e) => setAddQuestionText(e.target.value)}
                        />
                        <button
                           className="btn btn-primary"
                           onClick={handleAddQuestion}
                           type="button"
                        >
                           Add
                        </button>
                     </div>
                  </div>
               </div>

               {/* Students */}
               <div className="col-md-6 mb-4">
                  <div className="card h-100">
                     <div className="card-header fw-bold bg-success text-white d-flex justify-content-between align-items-center">
                        Students
                        <span className="badge bg-light text-success">{test.students?.length ?? 0}</span>
                     </div>
                     <ul className="list-group list-group-flush">
                        {(test.students || []).length === 0 ? (
                           <li className="list-group-item text-muted">
                              No students invited.
                           </li>
                        ) : (
                           test.students.map((s, idx) => (
                              <li
                                 key={s._id || idx}
                                 className="list-group-item d-flex justify-content-between align-items-center"
                              >
                                 <span>
                                    <strong>{s.scholarId}</strong>
                                    {" — "}
                                    {s.user?.name || "Unknown"} (
                                    {s.user?.email || "No email"})
                                 </span>
                                 <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleRemoveStudent(s._id)}
                                 >
                                    Remove
                                 </button>
                              </li>
                           ))
                        )}
                     </ul>
                     {/* Add student */}
                     <div className="p-3 border-top d-flex gap-2 align-items-center">
                        <Select
                           options={scholarOptions}
                           value={selectedScholar}
                           onChange={setSelectedScholar}
                           isClearable
                           placeholder="Select Scholar ID..."
                           className="flex-grow-1"
                        />
                        <button
                           className="btn btn-primary"
                           onClick={handleAddStudent}
                           type="button"
                           disabled={!selectedScholar}
                        >
                           Add
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default TestDetails;
