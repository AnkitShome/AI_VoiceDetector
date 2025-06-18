import React, { useState } from "react";
import "./Cases.css";

const caseData = [
  {
    title: "Woman loses Rs 1,688.58 USD",
    heading: "Woman loses Rs 1,688.58 USD in AI voice scam",
    content:
      "A woman in Hyderabad lost Rs 1.4 lakh (1,688.58 USD) to a scammer using AI to mimic her nephew's voice, claiming he needed money due to an accident. The scam, involving a late-night call and a plea for secrecy, deceived her into transferring funds. Authorities warn that despite the rarity of AI voice scams, the public should verify such urgent financial requests to prevent fraud.",
    btnText: "Protect Yourself Now",
    img: "proj_img/mic.jpg",
  },
  {
    title: "Company Loses $25.6 Million by a Deepfake Scam",
    heading: "Company Loses $25.6 Million by a Deepfake Scam",
    content:
      "A finance worker at a multinational firm was tricked into sending $25 million due to a deepfake video call with fraudsters posing as the CFO and colleagues. The scam, uncovered after verification with the company's head office, led to six arrests and highlights the risks of deepfake technology in fraud. This incident is among several exploiting deepfakes for criminal purposes, raising global concern over the technology's misuse.",
    btnText: "Protect Your Company Now",
    img: "proj_img/skel.png",
  },
  {
    title: "Mom, these bad men have me",
    heading: "Mom, these bad men have me",
    content:
      "Jennifer DeStefano received a call claiming her daughter Brianna was kidnapped, demanding a $1 million ransom, which turned out to be a scam involving a voice cloning AI. The terrifying experience, full of threats and ransom negotiations, ended with the relief of discovering Brianna was safe. The incident highlighted the sophisticated nature of modern scams, exploiting AI to clone voices and manipulate families, causing significant distress and confusion.",
    btnText: "Protect Your Family Now",
    img: "proj_img/aivoicedetector.png",
  },
];

const Cases = () => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  const handleCaseClick = (index) => {
    setSelectedCaseIndex(index);
  };

  const selectedCase = caseData[selectedCaseIndex];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5">Real Cases of AI Voice Fraud</h1>
      </div>
      <div className="row align-items-stretch">
        <div className="col-md-4 mb-4 d-flex flex-column justify-content-between">
          {caseData.map((c, i) => (
            <button
              key={i}
              className={`btn mb-3 mt-3 text-start d-flex align-items-center justify-content-start px-3 py-5 w-100 zoom-btn-hover ${
                selectedCaseIndex === i
                  ? "btn-primary text-white"
                  : "btn-outline-secondary text-black"
              }`}
              style={{
                borderRadius: "10px",
                fontWeight: 500,
                minHeight: "60px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onClick={() => handleCaseClick(i)}
            >
              <i className="fa fa-bars me-4" aria-hidden="true"></i>
              <span className="text-wrap text-break">{c.title}</span>
            </button>
          ))}
        </div>
        <div className="col-md-4 d-flex align-items-stretch">
          <div className="me-md-4 mb-3 mb-md-0" style={{ flex: "1 1 40%" }}>
            <img
              src={selectedCase.img}
              alt="case"
              className="img-fluid rounded h-100 w-100 object-fit-cover zoom-btn-hover"
              style={{
                objectFit: "cover",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                borderRadius: "12px",
              }}
            />
          </div>
        </div>
        <div className="col-md-4 d-flex align-items-stretch right">
          <div
            style={{ flex: "1 1 60%" }}
            className="d-flex flex-column justify-content-between zoom-btn-hover"
          >
            <div>
              <h4 className="fw-bold mb-3">{selectedCase.heading}</h4>
              <p className="mb-4" style={{ lineHeight: "1.7" }}>
                {selectedCase.content}
              </p>
            </div>
            <button className="btn btn-primary align-self-start py-3">
              {selectedCase.btnText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cases;
