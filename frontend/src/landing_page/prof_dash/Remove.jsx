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
    <div className="container mt-4">
      <h4 className="mb-3">Remove Student?</h4>

      <button className="btn btn-outline-danger mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Remove"}
      </button>

      {showForm && (
        <div className="card p-3 shadow-sm" style={{ maxWidth: "400px" }}>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Student Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            className="form-control mb-2"
            placeholder="Student Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-danger" onClick={handleRemove}>
            Confirm Remove
          </button>
        </div>
      )}

      {message && (
        <div className="mt-3 alert alert-info" style={{ maxWidth: "400px" }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default RemoveStudent;
