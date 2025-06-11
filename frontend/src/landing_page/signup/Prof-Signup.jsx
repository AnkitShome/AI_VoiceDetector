import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Prof-Signup.css";

const Prof_Signup = ({ onClose }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });

  const { email, password, username } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3002/signup",
        { ...inputValue },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      email: "",
      password: "",
      username: "",
    });
  };

  return (
    <div className="signup-wrapper">
      <h2 className="signup-title">Register</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleOnChange}
            placeholder="Enter your name"
            required
          />
        </div>
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
          Create an Account
        </button>
        <div className="login-redirect">
          Already have an account? <a href="/prof-login">Login</a>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Prof_Signup;
