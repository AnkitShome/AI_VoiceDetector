import React, { useEffect, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { motion, useAnimation } from "framer-motion";
import "./Upload.css";

function Upload() {
  const leftControls = useAnimation();
  const rightControls = useAnimation();
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          leftControls.start({ opacity: 1, x: 0 });
          rightControls.start({ opacity: 1, x: 0 });
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [leftControls, rightControls]);

  return (
    <div className="container" ref={ref}>
      <div className="row">

        {/* ✅ Left Side with horizontal transition + hover zoom */}
        <motion.div
          className="col-6 d-flex justify-content-center align-items-center"
          initial={{ opacity: 0, x: -100 }}
          animate={leftControls}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div
            className="p-4 zoom-on-hover"
            style={{
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
        </motion.div>

        {/* ✅ Right Side with horizontal transition + hover zoom */}
        <motion.div
          className="col-6 mt-4 d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
          initial={{ opacity: 0, x: 100 }}
          animate={rightControls}
          transition={{ duration: 0.8, ease: "easeOut" }}
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
                <Form.Control type="file" disabled />
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
        </motion.div>
      </div>
    </div>
  );
}

export default Upload;
