import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Prof-Login.css"; // We'll match styling with your register page

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleError = (err) => toast.error(err, { position: "bottom-left" });

  const handleSuccess = (msg) =>
    toast.success(msg, { position: "bottom-right" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      // ✅ Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("profile", JSON.stringify(data.profile));

      const role = data.user.role;
      const username = data.user.username?.replace(/\s+/g, "-").toLowerCase();

      if (role === "examiner") {
        handleSuccess("Login Successful");
      } else if (role === "student") {
        handleError("Login Failed. Try Again.");
      }

      setTimeout(() => {
        if (role === "examiner") {
          navigate(`/prof-dash/${username}`);
        }
      }, 1000);
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      if (error.response?.data?.msg) {
        handleError(error.response.data.msg);
      } else {
        handleError("Login failed. Try again.");
      }
    }

    setInputValue({
      email: "",
      password: "",
    });
  };

  return (
    <div className="signup-wrapper">
      <h2 className="signup-title">Professor Login</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleOnChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="form-check">
          <input type="checkbox" id="agree" required />
          <label htmlFor="agree">
            I agree to the AI Voice Detector <a href="/terms">user agreement</a>
          </label>
        </div>
        <button type="submit" className="submit-btn">
          Login
        </button>
        <div className="login-redirect">
          Don’t have an account? <a href="/prof-signup">Register</a>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
