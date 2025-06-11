import React from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";

function Upload() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-6  d-flex flex-column justify-content-center  text-center">
          <h4
            className="fw-bold display-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Be Protected Against AI Cloned Voices and Deepfakes
          </h4>
          <p
            className="text-dark fs-5"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            We offer an AI tool that can identify if an audio is real or AI
            generated
          </p>
          <h5 className="mb-3" style={{ color: "darkblue" }}>
            <i className="fa fa-chevron-circle-right" aria-hidden="true"></i>{" "}
            Detects AI cloned voices from all major AI models
          </h5>
          <h5 className="mb-3" style={{ color: "darkblue" }}>
            <i className="fa fa-chevron-circle-right" aria-hidden="true"></i>{" "}
            Integrated background noise/music remover
          </h5>
          <h5 className="mb-3" style={{ color: "darkblue" }}>
            <i className="fa fa-chevron-circle-right" aria-hidden="true"></i>{" "}
            Available as a Chrome extension to scan any voice across the web
          </h5>
        </div>

        <div
          className="col-6 mt-4 mr-1 pe-1  d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: "600px",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 0 15px rgba(0,0,0,0.1)",
              marginTop: "-50px", // This will shift it upwards
            }}
          >
            {/* Placeholder for icon */}
            <div className="text-center mb-4">
              <img
                src="proj_img/audio-file.png"
                alt="Upload Icon"
                style={{ width: "60px" }}
              />
            </div>

            {/* File input */}
            <Form.Group controlId="formFile" className="mb-4">
              <Form.Control type="file" />
            </Form.Group>

            {/* Submit button */}
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
  );
}

export default Upload;
