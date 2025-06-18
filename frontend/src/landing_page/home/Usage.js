import React, { useState } from "react";
import "./Usage.css"; // Make sure this has the zoom-on-hover CSS

function Usage() {
  const [activeTab, setActiveTab] = useState("individuals");

  const tabStyle = (tab) => ({
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "500",
    color: activeTab === tab ? "#000" : "#3b5bdb",
    borderBottom: activeTab === tab ? "2px solid #3b5bdb" : "none",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    transition: "transform 0.3s ease",
  });

  return (
    <div className="container">
      <div className="row">

        {/* ✅ Left Image with hover effect */}
        <div className="col-6 d-flex justify-content-center align-items-center">
          <img
            src="proj_img/fakeVoice.png"
            className="img-fluid mb-5 zoom-on-hover"
            alt="Usage"
            style={{ maxWidth: "100%", borderRadius: "10px" }}
          />
        </div>

        {/* ✅ Right full content with one zoom */}
        <div
          className="col-6 zoom-on-hover"
          style={{
            maxWidth: "700px",
            margin: "auto",
            fontFamily: "sans-serif",
            borderRadius: "12px",
            transition: "transform 0.3s ease",
            padding: "10px",
          }}
        >
          <h1 className="fw-bold mb-3">
            AI Voices against
            <br />
            individuals and businesses
          </h1>

          <p style={{ color: "#555", fontSize: "16px" }}>
            Today, AI voices are so sophisticated that using our ears, we cannot
            differentiate
            <br />
            between AI voices and human voices.
          </p>

          <div
            className="p-3 mt-3"
            style={{
              border: "1px solid #dfe3e6",
              borderRadius: "10px",
              backgroundColor: "#fff",
            }}
          >
            {/* Tabs */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #ccc",
                marginBottom: "15px",
              }}
            >
              <button
                style={tabStyle("individuals")}
                onClick={() => setActiveTab("individuals")}
              >
                For individuals
              </button>
              <button
                style={tabStyle("businesses")}
                onClick={() => setActiveTab("businesses")}
              >
                For businesses
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "individuals" && (
              <div>
                <p>
                  Individuals may have lost money to an AI voice scam after
                  receiving messages
                  <br />
                  that mimicked and cloned the voices of their loved ones.
                </p>
                <p>
                  Using our AI Voice Detector, individuals can analyze voice
                  messages and calls
                  <br />
                  they receive using our extension or by uploading the audio
                  file to determine
                  <br />
                  whether the audio comes from an AI-generated voice or not.
                </p>
              </div>
            )}

            {activeTab === "businesses" && (
              <div>
                <p>
                  Businesses can lose a lot of money to scammers using fake
                  voices of important people in the company to ask for
                  investment money. This has happened before and will likely
                  increase.
                </p>
                <p>
                  Using our AI Voice Detector, businesses can help their
                  employees to either use our extension or integrate our API
                  into their work environment to verify the authenticity of all
                  received audio messages, calls, or meetings.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usage;
