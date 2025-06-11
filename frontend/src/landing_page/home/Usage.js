import React, { useState } from "react";

function Usage() {
  const [activeTab, setActiveTab] = useState("individuals");

  const tabStyle = (tab) => ({
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "500",
    color: activeTab === tab ? "#000" : "#3b5bdb", // dark for active, blue for inactive
    borderBottom: activeTab === tab ? "2px solid #3b5bdb" : "none",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-6 ">
          <img
            src="proj_img/fakeVoice.png"
            className="img-fluid mb-5"
            alt="Usage image"
          />
        </div>
        <div
          className="col-6"
          style={{
            maxWidth: "700px",
            margin: "auto",
            fontFamily: "sans-serif",
          }}
        >
          <h1 style={{ fontWeight: "800" }}>
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
            style={{
              border: "1px solid #dfe3e6",
              borderRadius: "10px",
              padding: "20px",
              marginTop: "20px",
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
                  received audio messages, calls, or meetings
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
