import React, { useState } from "react";
import axios from "axios";

const RemoveStudent = () => {
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleRemove = async () => {
    try {
      const res = await axios.delete("http://localhost:5000/api/professor/removeStudent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { username, email },
      });

      setMessage(res.data.msg);
      setUsername("");
      setEmail("");
      setShowForm(false);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error occurred");
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card shadow p-5"
        style={{
          maxWidth: "1240px",
          margin: "auto",
          transition: "transform 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <div className="d-flex justify-content-between align-items-start flex-wrap">
          {/* Left Side - Form */}
          <div style={{ flex: "1 1 55%" }}>
            <h3 className="text-primary fw-bold mb-3 d-flex align-items-center">
              <i className="bi bi-person-x-fill me-2 fs-4"></i> Remove Student?
            </h3>

            <p className="text-muted mb-4" style={{ fontSize: "1.05rem" }}>
              You are about to <strong>permanently remove</strong> a student’s access.
              Please confirm their username and email before proceeding.
            </p>

            <button
              className="btn btn-outline-primary mb-3"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "Remove"}
            </button>

            {showForm && (
              <div className="p-4 border rounded bg-light">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Student Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Student Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn btn-primary w-100" onClick={handleRemove}>
                  Confirm Remove
                </button>
              </div>
            )}

            {message && (
              <div className="mt-3 alert alert-info" style={{ maxWidth: "500px" }}>
                {message}
              </div>
            )}
          </div>

          {/* Right Side - Illustration or info */}
          <div
            style={{
              flex: "1 1 35%",
              textAlign: "center",
              paddingTop: "20px",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/6861/6861362.png"
              alt="Remove icon"
              style={{ maxWidth: "140px", marginBottom: "20px" }}
            />
            <p className="text-secondary" style={{ fontSize: "0.95rem" }}>
              Removing a student will revoke their test access and delete related records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveStudent;
