import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EvaluatorDashboard = () => {

   const [tests, setTests] = useState([])
   const navigate = useNavigate()

   useEffect(() => {
      axios.get("http://localhost:5000/api/evaluator/tests", { withCredentials: true })
         .then(res => setTests(res.data.tests))
         .catch(() => toast.error("Could not fetch assigned tests"));
   }, [])

   return (
      <div className="container mt-5">
         <h2>Assigned Tests</h2>
         {tests.length === 0 && <div>No tests assigned.</div>}
         <ul className="list-group">
            {tests.map(test => (
               <li key={test._id} className="list-group-item d-flex justify-content-between">
                  <span>
                     <b>{test.title}</b> ({test.department || "N/A"})
                  </span>
                  <button
                     className="btn btn-outline-success btn-sm"
                     onClick={() => navigate(`/evaluator/test/${test._id}/attempts`)}
                  >
                     Review Submissions
                  </button>
               </li>
            ))}
         </ul>
      </div>
   );
}

export default EvaluatorDashboard
