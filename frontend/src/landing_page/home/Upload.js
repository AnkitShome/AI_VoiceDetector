import React from "react";
import { Card, Form, Button } from "react-bootstrap";
import "./Upload.css"; // Custom hover styles

function Upload() {
  return (
    <div className="container">
      <div className="row">

        {/* ✅ Left Side with curved, compact container and hover zoom */}
        <div className="col-6 d-flex justify-content-center align-items-center">
          <div
            className="p-4 zoom-on-hover"
            style={{
              // backgroundColor: "#f0f8ff",
              borderRadius: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              width: "100%",
              maxWidth: "550px",
            }}
          >
            <h4
              className="fw-bold display-6 mb-3 text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Be Protected Against AI Cloned Voices and Deepfakes
            </h4>
            <p
              className="text-dark fs-5 text-center"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              We offer an AI tool that can identify if an audio is real or AI generated
            </p>

            {[
              "Detects AI cloned voices from all major AI models",
              "Integrated background noise/music remover",
              "Available as a Chrome extension to scan any voice across the web",
            ].map((text, idx) => (
              <h5 key={idx} className="mb-3 text-primary text-center">
                <i className="fa fa-chevron-circle-right me-2" aria-hidden="true"></i>
                {text}
              </h5>
            ))}
          </div>
        </div>

        {/* ✅ Right Side - Upload Card with hover zoom */}
        <div
          className="col-6 mt-4 d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div className="zoom-on-hover" style={{ width: "100%", maxWidth: "600px" }}>
            <Card
              style={{
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 0 15px rgba(0,0,0,0.1)",
                marginTop: "-50px",
              }}
            >
              <div className="text-center mb-4">
                <img
                  src="proj_img/audio-file.png"
                  alt="Upload Icon"
                  style={{ width: "60px" }}
                />
              </div>

              <Form.Group controlId="formFile" className="mb-4">
                <Form.Control type="file" />
              </Form.Group>

              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  style={{ padding: "8px 24px", borderRadius: "6px" }}
                >
                  Detect Now
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
