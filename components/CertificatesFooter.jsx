import React from "react";

const CertificatesFooter = (props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",     // text on top, logo under it
        alignItems: "center",        // center horizontally
        justifyContent: "center",    // center vertically (inside this box)
        gap: "8px",                  // space between text and logo
      }}
    >
      <p>this section for certifications</p>

      <a
        referrerPolicy="origin"
        target="_blank"
        rel="noopener noreferrer"
        href="https://trustseal.enamad.ir/?id=623264&Code=uahyFEzqRfBnF1liGadDJ52zuWiLOJQW"
      >
        <img
          referrerPolicy="origin"
          src="https://trustseal.enamad.ir/logo.aspx?id=623264&Code=uahyFEzqRfBnF1liGadDJ52zuWiLOJQW"
          alt="نماد اعتماد الکترونیکی"
          style={{ cursor: "pointer" }}
          code="uahyFEzqRfBnF1liGadDJ52zuWiLOJQW"
        />
      </a>
    </div>
  );
};

export default CertificatesFooter;
