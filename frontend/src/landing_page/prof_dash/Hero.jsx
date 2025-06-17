import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

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
    <div className="container mt-3">
      {/* Logout button aligned to top right */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-danger" onClick={handleLogout}>
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
