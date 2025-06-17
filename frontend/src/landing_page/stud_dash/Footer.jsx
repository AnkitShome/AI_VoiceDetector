import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css"; // 🆕 Import custom CSS

const Footer = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
    console.log(token);
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/professor/showTest",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("tests:",res.data.tests);
        setTests(res.data.tests);
      } catch (err) {
        console.error("Error fetching tests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading tests...</div>;
  if (tests.length === 0)
    return (
      <div className="text-center mt-5 fw-bold mb-4">
        
        {/* <h2 className="text-center fw-bold mb-4" style={{ fontSize: "2rem" }}>
          Scheduled Tests
        </h2> */}
        No upcoming tests found.
      </div>
    );

  return (
    <div className="container mt-4 font-poppins">
      <h2 className="text-center fw-bold mb-4" style={{ fontSize: "2rem" }}>
        Scheduled Tests
      </h2>

      <div className="d-flex flex-column gap-4">
        {tests.map((test) => (
          <div key={test._id} className="card custom-card">
            <div className="card-body d-flex flex-column">
              <h4 className="card-title mb-3">{test.title}</h4>

              <p className="card-text mb-1">
                <strong>Start:</strong>{" "}
                {new Date(test.start_time).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </p>
              <p className="card-text mb-1">
                <strong>End:</strong>{" "}
                {new Date(test.end_time).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </p>

              <div className="mt-auto d-flex justify-content-end">
                <button className="btn btn-primary shadow-sm">
                  Start Test
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;
