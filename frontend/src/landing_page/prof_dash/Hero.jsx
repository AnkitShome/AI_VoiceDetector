import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const username = location.pathname.split("/").filter(Boolean).pop();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to home/login if token is missing
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to home
  };

  return (
    <div>
      {/* Custom Navbar */}
      <div
        className="d-flex justify-content-between align-items-center px-4 py-3"
        style={{
          backgroundColor: "#cce5ff",
          fontSize: "1.5rem",
          fontWeight: "500",
          borderBottom: "2px solid #b8daff",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <i
            className="fa fa-graduation-cap"
            aria-hidden="true"
            style={{ fontSize: "2rem", color: "#004085" }}
          ></i>
          <span className="text-dark">
            Welcome <strong>{username}</strong>
          </span>
        </div>

        <button
          className="btn btn-danger btn-sm px-3 fw-semibold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Image row */}
      <div className="row justify-content-center text-center">
        <img
          src="/proj_img/gpt5.png"
          alt="Hero image"
          style={{
            width: "750px",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
}

export default Hero;
