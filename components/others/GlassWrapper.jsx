// components/others/glasswrapper.jsx
import React from "react";

const GlassWrapper = ({ children }) => {
  return (
    <div
      style={{
        borderRadius: "30px",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px) saturate(150%) contrast(120%) brightness(110%)",
        WebkitBackdropFilter: "blur(10px) saturate(150%) contrast(120%) brightness(110%)",
        border: "1.8px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.4)",
        padding: "12px 20px",
        width: "100%",
        maxWidth: 1080,
        margin: "0 auto", // center it
        position: "relative",
      }}
    >
      {children}
    </div>
  );
};

export default GlassWrapper;
