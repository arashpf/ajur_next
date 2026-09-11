import React, { useState } from "react";
import { useRouter } from "next/router";

const GlassSearchBox = ({ placeholder }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/api/parser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data?.listings?.length > 0) {
        setListings(data.listings);
      } else {
        setListings([]);
        setError("No results found.");
      }

      // Optional: navigate if you want
      // const params = new URLSearchParams();
      // Object.entries(data.filters || {}).forEach(([key, val]) => {
      //   if (Array.isArray(val)) val.forEach((v) => params.append(key, v));
      //   else params.append(key, val);
      // });
      // router.push(`/search?${params.toString()}`);
    } catch (err) {
      console.error("AI parsing failed:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      {/* Search box wrapper */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1080,
          height: 65,
          borderRadius: 30,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px) saturate(150%) contrast(120%) brightness(110%)",
          WebkitBackdropFilter: "blur(10px) saturate(150%) contrast(120%) brightness(110%)",
          border: "1.8px solid rgba(255, 255, 255, 0.3)",
          boxShadow: `
            0 8px 32px 0 rgba(31, 38, 135, 0.4),
            inset 0 0 0 1px rgba(255, 255, 255, 0.15),
            inset 0 -4px 8px rgba(255, 255, 255, 0.1)
          `,
          display: "flex",
          alignItems: "center",
          paddingLeft: 25,
          paddingRight: 25,
          color: "rgba(255, 255, 255, 0.9)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          transition: "all 0.3s ease",
          userSelect: "none",
        }}
      >
        {/* Search Icon */}
        <div
          onClick={handleSearch}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="28"
            viewBox="0 0 24 24"
            width="28"
            fill="rgba(255, 255, 255, 0.75)"
          >
            <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-5.34C15.07 5.59 12.48 3 9 3S2.93 5.59 2.93 9.39c0 3.8 2.59 6.39 6.07 6.39a6.48 6.48 0 005.34-1.48l.27.28v.79l4.25 4.25 1.49-1.49L15.5 14zm-6.5 0c-2.34 0-4.25-1.91-4.25-4.25S6.66 5.5 9 5.5 13.25 7.41 13.25 9.75 11.34 14 9 14z" />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Search for properties..."}
          style={{
            flex: 1,
            marginLeft: 15,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 20,
            color: "rgba(255, 255, 255, 0.95)",
            fontWeight: "500",
            letterSpacing: "0.03em",
            caretColor: "#ffffffcc",
            userSelect: "text",
          }}
        />

        {/* Spinner */}
        {loading && (
          <div style={{ marginLeft: 10 }}>
            <div className="spinner" />
          </div>
        )}

        {/* Shine effect */}
        <div
          style={{
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: 30,
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%)",
            mixBlendMode: "screen",
            filter: "blur(4px)",
          }}
        />
      </div>

      {/* Error */}
      {error && <p style={{ color: "salmon", marginTop: 10 }}>{error}</p>}

      {/* Results */}
      {listings?.length > 0 && (
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {listings.map((item, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: 15,
                borderRadius: 15,
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
              }}
            >
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>{item.title || "Untitled"}</h3>
              <p style={{ fontSize: 14 }}>{item.location}</p>
              <p style={{ fontSize: 14 }}>{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlassSearchBox;
