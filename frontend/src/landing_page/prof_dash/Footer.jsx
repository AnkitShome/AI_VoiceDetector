import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch assigned students for the test
const fetchTestStudents = async (testId) => {
   const { data } = await axios.get(
      `http://localhost:5000/api/examiner/test/${testId}/students`,
      { withCredentials: true }
   );
   return data.students.map((s) => ({
      value: s._id,
      label: `${s.name} (${s.email})`,
   }));
};

// Section for removing students from test
function RemoveStudentsSection({ testId, refreshFlag, onRemoved }) {
   const [testStudents, setTestStudents] = useState([]);
   const [selected, setSelected] = useState(null);

   useEffect(() => {
      if (!testId) return;
      fetchTestStudents(testId).then(setTestStudents);
   }, [testId, refreshFlag]);

   const handleRemove = async () => {
      if (!selected) return;
      try {
         await axios.post(
            `http://localhost:5000/api/examiner/remove/${testId}`,
            { studentId: selected.value },
            { withCredentials: true }
         );
         toast.success("Student removed from test!");
         setSelected(null);
         if (onRemoved) onRemoved();
      } catch (err) {
         toast.error(err?.response?.data?.msg || "Failed to remove student.");
      }
   };

   if (testStudents.length === 0)
      return <div className="mb-3">No students assigned to this test.</div>;

   return (
      <div className="mb-4">
         <h5>Remove Student from Test</h5>
         <Select
            options={testStudents}
            value={selected}
            onChange={setSelected}
            placeholder="Select student to remove"
         />
         <button
            className="btn btn-danger mt-2"
            type="button"
            onClick={handleRemove}
            disabled={!selected}
         >
            Remove Student
         </button>
      </div>
   );
}

// Section for inviting evaluators to test
function InviteEvaluatorsSection({ testId, onInvited }) {
   const [emails, setEmails] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   function isValidEmail(email) {
      return /\S+@\S+\.\S+/.test(email);
   }

   const handleInvite = async () => {
      if (emails.length === 0) return toast.error("Enter evaluator emails!");
      const validEmails = emails.map(e => e.value).filter(isValidEmail);
      if (validEmails.length === 0) return toast.error("No valid emails!");

      setIsLoading(true);
      try {
         const { data } = await axios.post(
            `http://localhost:5000/api/examiner/invite-evaluator/${testId}`,
            { evaluatorEmails: validEmails },
            { withCredentials: true }
         );
         toast.success("Invitations sent!");
         setEmails([]);
         if (onInvited) onInvited();
      } catch (err) {
         toast.error(err?.response?.data?.msg || "Failed to invite evaluators.");
      }
      setIsLoading(false);
   };

   return (
      <div className="mb-4">
         <h5>Invite Evaluators</h5>
         <CreatableSelect
            isMulti
            value={emails}
            onChange={setEmails}
            placeholder="Enter evaluator emails…"
            formatCreateLabel={input => `Invite "${input}"`}
            isValidNewOption={isValidEmail}
            styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
         />
         <button
            className="btn btn-success mt-2"
            type="button"
            onClick={handleInvite}
            disabled={isLoading}
         >
            {isLoading ? "Sending..." : "Invite"}
         </button>
      </div>
   );
}

// Section for inviting students to test
function InviteStudentsSection({ testId, onInvited }) {
   const [studentOptions, setStudentOptions] = useState([]);
   const [selectedStudents, setSelectedStudents] = useState([]);
   const [refreshFlag, setRefreshFlag] = useState(false);

   useEffect(() => {
      const fetchStudents = async () => {
         const { data } = await axios.get(
            "http://localhost:5000/api/details/allStudentEmails",
            { withCredentials: true }
         );
         setStudentOptions(
            data.emails.map((email) => ({ value: email, label: email }))
         );
      };
      fetchStudents();
   }, [refreshFlag]);

   const handleAddStudents = async () => {
      if (selectedStudents.length === 0) return toast.error("No students selected.");
      try {
         const studentEmails = selectedStudents.map((s) => s.value);
         await axios.post(
            `http://localhost:5000/api/examiner/invite/${testId}`,
            { studentEmails },
            { withCredentials: true }
         );
         toast.success("Students added to test!");
         setSelectedStudents([]);
         setRefreshFlag((f) => !f);
         if (onInvited) onInvited();
      } catch (err) {
         toast.error(err?.response?.data?.msg || "Failed to add students.");
      }
   };

   return (
      <div className="mb-4">
         <h5>Add Students to Test</h5>
         <Select
            options={studentOptions}
            isMulti
            value={selectedStudents}
            onChange={setSelectedStudents}
            placeholder="Choose students..."
         />
         <button
            className="btn btn-success mt-2"
            type="button"
            onClick={handleAddStudents}
         >
            Add Students
         </button>
      </div>
   );
}

// Section for adding questions
function AddQuestionsSection({ testId }) {
   const [questions, setQuestions] = useState([""]);
   const [numQuestions, setNumQuestions] = useState(1);

   const handleNumChange = (e) => {
      const n = Math.max(1, parseInt(e.target.value) || 1);
      setNumQuestions(n);
      setQuestions((q) => {
         const arr = Array(n).fill("");
         q.forEach((item, idx) => (arr[idx] = item));
         return arr;
      });
   };

   const handleQuestionChange = (idx, value) => {
      setQuestions((q) => {
         const arr = [...q];
         arr[idx] = value;
         return arr;
      });
   };

   const handleAddQuestions = async () => {
      const filtered = questions.map((q) => q.trim()).filter((q) => q);
      if (filtered.length === 0) return toast.error("Add at least one question.");
      try {
         await axios.post(
            `http://localhost:5000/api/test/${testId}/questions`,
            { questions: filtered },
            { withCredentials: true }
         );
         toast.success("Questions added!");
         setQuestions([""]);
         setNumQuestions(1);
      } catch (err) {
         toast.error(err?.response?.data?.msg || "Failed to add questions.");
      }
   };

   return (
      <div className="mb-4">
         <h5>Add Questions to Test</h5>
         <div className="mb-2">
            <label>Number of Questions</label>
            <input
               type="number"
               min={1}
               value={numQuestions}
               onChange={handleNumChange}
               className="form-control w-auto"
            />
         </div>
         {Array.from({ length: numQuestions }).map((_, idx) => (
            <div className="mb-2" key={idx}>
               <label>Question {idx + 1}</label>
               <input
                  className="form-control"
                  value={questions[idx] || ""}
                  onChange={(e) => handleQuestionChange(idx, e.target.value)}
               />
            </div>
         ))}
         <button
            className="btn btn-success mt-2"
            type="button"
            onClick={handleAddQuestions}
         >
            Add Questions
         </button>
      </div>
   );
}

// MAIN COMPONENT
const TestFormSection = () => {
   const [showForm, setShowForm] = useState(false);
   const [testId, setTestId] = useState(null);
   const [refreshStudentsFlag, setRefreshStudentsFlag] = useState(false);

   const [formData, setFormData] = useState({
      testTitle: "",
      department: "",
      startTime: "",
      endTime: "",
   });

   const handleChange = (e) => {
      setFormData((f) => ({
         ...f,
         [e.target.name]: e.target.value,
      }));
   };

   const handleCreateTest = async (e) => {
      e.preventDefault();
      try {
         const res = await axios.post(
            "http://localhost:5000/api/test/create",
            {
               title: formData.testTitle,
               department: formData.department,
               startTime: formData.startTime,
               endTime: formData.endTime,
            },
            { withCredentials: true }
         );
         toast.success("Test created!");
         setTestId(res.data.test._id);
         setShowForm(false);
      } catch (err) {
         toast.error(
            err?.response?.data?.msg || "Failed to create test. Check your inputs."
         );
      }
   };

   return (
      <div className="container mt-5">
         <ToastContainer />
         {!testId && (
            <>
               <div className="d-flex justify-content-center mb-4">
                  <button
                     onClick={() => setShowForm(true)}
                     className="btn btn-primary px-4 py-2 shadow"
                  >
                     Create Test
                  </button>
               </div>
               {showForm && (
                  <div className="card shadow p-5 hover-scale-wrapper" style={{
                     maxWidth: "1240px",
                     margin: "auto",
                     transition: "transform 0.3s ease",
                     borderRadius: "20px",
                  }}>
                     <h3 className="fw-bold mb-3 text-primary">Create Test</h3>
                     <form onSubmit={handleCreateTest}>
                        <div className="mb-3">
                           <label className="form-label">Test Title</label>
                           <input
                              className="form-control"
                              name="testTitle"
                              value={formData.testTitle}
                              onChange={handleChange}
                              required
                           />
                        </div>
                        <div className="mb-3">
                           <label className="form-label">Department</label>
                           <input
                              className="form-control"
                              name="department"
                              value={formData.department}
                              onChange={handleChange}
                              required
                           />
                        </div>
                        <div className="mb-3">
                           <label className="form-label">Start Time</label>
                           <input
                              type="datetime-local"
                              className="form-control"
                              name="startTime"
                              value={formData.startTime}
                              onChange={handleChange}
                              required
                           />
                        </div>
                        <div className="mb-3">
                           <label className="form-label">End Time</label>
                           <input
                              type="datetime-local"
                              className="form-control"
                              name="endTime"
                              value={formData.endTime}
                              onChange={handleChange}
                              required
                           />
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                           <button type="submit" className="btn btn-success px-4">
                              Create
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
               )}
            </>
         )}

         {testId && (
            <>
               <div className="alert alert-info">
                  <strong>Test Created!</strong> Test ID: <code>{testId}</code>
               </div>
               <InviteEvaluatorsSection
                  testId={testId}
                  onInvited={() => toast.info("Evaluators invited!")}
               />
               <InviteStudentsSection
                  testId={testId}
                  onInvited={() => setRefreshStudentsFlag((f) => !f)}
               />
               <AddQuestionsSection testId={testId} />
               <RemoveStudentsSection
                  testId={testId}
                  refreshFlag={refreshStudentsFlag}
                  onRemoved={() => setRefreshStudentsFlag((f) => !f)}
               />
            </>
         )}
      </div>
   );
};

export default TestFormSection;
