import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EvaluatorLogin = () => {
   const [form, setForm] = useState({ email: "", password: "" });
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);

   const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         await axios.post("http://localhost:5000/api/evaluator/login", {
            email: form.email,
            password: form.password,
         }, { withCredentials: true });
         toast.success("Login successful");
         setTimeout(() => navigate("/evaluator/dashboard"), 1000);
      } catch (err) {
         toast.error(err?.response?.data?.msg || "Failed to login");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="container mt-5">
         <h2>Evaluator Login</h2>
         <form onSubmit={handleLogin}>
            <input required type="email" placeholder="Email"
               value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input required type="password" placeholder="Password"
               value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <button className="btn btn-primary" type="submit" disabled={loading}>Login</button>
         </form>
      </div>
   );
};
export default EvaluatorLogin;
