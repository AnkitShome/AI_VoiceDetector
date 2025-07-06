// src/landing_page/evaluator/EvaluatorInvite.jsx
import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EvaluatorInvite = () => {
   const [params] = useSearchParams();
   const testId = params.get("testId");
   const token = params.get("token");
   const navigate = useNavigate();
   const [form, setForm] = useState({ name: "", password: "" });
   const [loading, setLoading] = useState(false);

   const handleRegister = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         await axios.post("http://localhost:5000/api/evaluator/invite-register", {
            testId,
            token,
            name: form.name,
            password: form.password,
         }, { withCredentials: true });
         toast.success("Registration successful! Redirecting...");
         setTimeout(() => navigate("/evaluator/dashboard"), 1200);
      } catch (err) {
         toast.error(err?.response?.data?.msg || "Failed to register");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="container mt-5">
         <h2>Evaluator Registration</h2>
         <form onSubmit={handleRegister}>
            <input required type="text" placeholder="Full Name"
               value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input required type="password" placeholder="Set Password"
               value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <button className="btn btn-primary" type="submit" disabled={loading}>Register</button>
         </form>
      </div>
   );
};
export default EvaluatorInvite;
