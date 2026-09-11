import React, { useState } from "react";

const SearchDiv = () => {
  const [query, setQuery] = useState("");
  const [useAiMode, setUseAiMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);

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
    } catch (err) {
      console.error("Search error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "60px 20px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Search Bar */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1080,
          height: 65,
          borderRadius: 30,
         background: "linear-gradient(135deg, rgba(139,0,0,1.0), rgba(173,0,0,1.0))",
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
          paddingLeft: 20,
          paddingRight: 20,
          color: "rgba(255, 255, 255, 0.9)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* Toggle */}
        <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fff", fontSize: "14px", marginRight: 18 }}>
          <input type="checkbox" checked={useAiMode} onChange={() => setUseAiMode(!useAiMode)} style={{ transform: "scale(1.3)", cursor: "pointer" }} />
          AI Mode
        </label>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search for homes..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 18,
            color: "rgba(255, 255, 255, 0.95)",
            fontWeight: "500",
            caretColor: "#ffffffcc",
          }}
        />

        {/* Search Icon */}
        <div
          onClick={handleSearch}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 10,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 24 24" width="28" fill="rgba(255, 255, 255, 0.75)">
            <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-5.34C15.07 5.59 12.48 3 9 3S2.93 5.59 2.93 9.39c0 3.8 2.59 6.39 6.07 6.39a6.48 6.48 0 005.34-1.48l.27.28v.79l4.25 4.25 1.49-1.49L15.5 14zm-6.5 0c-2.34 0-4.25-1.91-4.25-4.25S6.66 5.5 9 5.5 13.25 7.41 13.25 9.75 11.34 14 9 14z" />
          </svg>
        </div>

        {/* Optional Shine */}
        <div
          style={{
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: 30,
            background: "linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%)",
            mixBlendMode: "screen",
            filter: "blur(4px)",
          }}
        />
      </div>

      {/* Error */}
      {error && <p style={{ color: "salmon", marginTop: 10 }}>{error}</p>}

      {/* Results */}
      {listings.length > 0 && (
        <div
          style={{
            marginTop: 30,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            width: "100%",
            maxWidth: 1080,
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

export default SearchDiv;
