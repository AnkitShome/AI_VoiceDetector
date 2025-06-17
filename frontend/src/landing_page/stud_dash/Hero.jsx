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
    navigate("/"); // Redirect to homepage after logout
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-end">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="row justify-content-center text-center mt-4">
        <img
          src="/proj_img/gpt4.png"
          alt="Hero image"
          className="mb-2"
          style={{
            width: "750px",
            height: "auto",
            // transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
        //   onMouseOver={(e) => {
        //     e.currentTarget.style.transform = "scale(1.03)";
        //     e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
        //   }}
        //   onMouseOut={(e) => {
        //     e.currentTarget.style.transform = "scale(1)";
        //     e.currentTarget.style.boxShadow = "none";
        //   }}
        />
      </div>
    </div>
  );
}

export default Hero;
