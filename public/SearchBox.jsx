import React, { useState } from "react";

const SearchBox = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Search for:", query);
    // insert your search logic here
  };

  return (
    <div style={{ position: "relative", width: "1000px", height: "50px" }}>
      {/* SVG Background */}
      <svg
        width="1000"
        height="50"
        viewBox="0 0 1280 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <g filter="url(#filter0_iiiii_1_7)">
          <rect
            width="1280"
            height="50"
            rx="25"
            fill="#1A1A1A"
            style={{ mixBlendMode: "plus-lighter" }}
          />
          <path
            d="M18.375 29.375C21.1364 29.375 23.375 27.1364 23.375 24.375C23.375 21.6136 21.1364 19.375 18.375 19.375C15.6136 19.375 13.375 21.6136 13.375 24.375C13.375 27.1364 15.6136 29.375 18.375 29.375Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24.6249 30.6252L21.9062 27.9065"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <filter
            id="filter0_iiiii_1_7"
            x="-12"
            y="-12"
            width="1304"
            height="74"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="11" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.94902 0 0 0 0 0.94902 0 0 0 0 0.94902 0 0 0 0.5 0"
            />
            <feBlend
              mode="plus-darker"
              in2="shape"
              result="effect1_innerShadow_1_7"
            />
            {/* Rest of filters trimmed for brevity */}
          </filter>
        </defs>
      </svg>

      {/* Actual input box */}
      <input
        type="text"
        placeholder="Search for properties..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        style={{
          position: "absolute",
          top: "10px",
          left: "60px",
          width: "80%",
          height: "30px",
          border: "none",
          borderRadius: "15px",
          paddingLeft: "10px",
          background: "transparent",
          color: "white",
          outline: "none",
          fontSize: "16px",
        }}
      />
    </div>
  );
};

export default SearchBox;
