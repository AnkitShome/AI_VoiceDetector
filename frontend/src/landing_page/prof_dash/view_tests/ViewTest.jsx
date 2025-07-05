import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Hero from "../Hero";

const ViewTest = () => {
   const [tests, setTests] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();
   const { profName } = useParams();

   useEffect(() => {
      const fetchTests = async () => {
         try {
            const res = await axios.get(
               "http://localhost:5000/api/examiner/get-tests",
               { withCredentials: true }
            );
            setTests(res.data.tests || []);
         } catch (err) {
            toast.error("Failed to fetch tests");
         } finally {
            setLoading(false);
         }
      };
      fetchTests();
   }, []);

   if (loading)
      return (
         <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <div>Loading tests...</div>
         </div>
      );

   return (
      <>
         <Hero />
         <div className="container py-4">
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center mb-4">
               <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
                  Created Tests
               </h2>
               <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/prof-dash/${profName}`)}
               >
                  Back to Dashboard
               </button>
            </div>
            {tests.length === 0 ? (
               <div className="alert alert-warning text-center">
                  <img
                     src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
                     alt="No Tests"
                     style={{ maxWidth: "90px", marginBottom: "12px" }}
                  />
                  <div>No tests found.</div>
               </div>
            ) : (
               <div className="row g-4">
                  {tests.map((test) => (
                     <div className="col-md-6 col-lg-4" key={test._id}>
                        <div className="card shadow-sm h-100 border-0">
                           <div className="card-body d-flex flex-column">
                              <h5 className="card-title mb-2">{test.title}</h5>
                              <p className="card-text mb-1">
                                 <strong>Department:</strong> {test.department || "N/A"}
                              </p>
                              <p className="card-text mb-1">
                                 <strong>Start:</strong>{" "}
                                 {new Date(test.start_time).toLocaleString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                 })}
                              </p>
                              <p className="card-text mb-1">
                                 <strong>End:</strong>{" "}
                                 {new Date(test.end_time).toLocaleString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                 })}
                              </p>

                              <p className="card-text mb-1">
                                 <strong>No. of Questions:</strong>{" "}
                                 {test.questions ? test.questions.length : 0}
                              </p>
                              <p className="card-text mb-1">
                                 <strong>No. of Students:</strong>{" "}
                                 {test.students ? test.students.length : 0}
                              </p>
                              <div className="mt-auto d-flex gap-2 justify-content-end">
                                 <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() =>
                                       navigate(
                                          `/prof-dash/${profName}/test/${test._id}`
                                       )
                                    }
                                 >
                                    View Details
                                 </button>
                                 {/* You can add more actions here, e.g. Edit, Delete, etc */}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </>
   );
};

export default ViewTest;
