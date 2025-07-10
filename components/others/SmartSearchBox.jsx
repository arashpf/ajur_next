import React, { useState } from "react";
import Fuse from "fuse.js";
import ClipLoader from "react-spinners/ClipLoader";

const sampleNeighborhoods = [
  "شهرک جانبازان", "شهرک شهرداری", "مرکز شهر", "رباط قدیم", "گلدشت",
  "خلیج فارس", "عطر یاس", "بخشداری- شهرک فداییان", "نیرو انتظامی", "آبرسانی",
  "انقلاب 1 تا 13", "داودیه", "تقی آباد", "وحیدیه", "گرجی", "طالقانی-امینی",
  "وهن آباد", "حکیم آباد-شهرستانک", "اشکانیه و بازارک", "منجیل آباد", "کیکاور",
  "اصغرآباد", "سفیدار", "شترخوار", "الارد-پرندک", "حصار مهتر", "شهرآباد", "انجم آباد",
  "پیغمبر", "شهرک خانه", "آبشناسان", "ملکی", "مصلی", "فرهنگیان"
];

export default function SmartSearchBox({ onSearch, showDebug = false }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [chips, setChips] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({});
  const [backendSuggestions, setBackendSuggestions] = useState([]);

  const fuse = new Fuse(sampleNeighborhoods.map(n => ({ name: n })), {
    keys: ["name"],
    threshold: 0.35,
  });

  const handleInputChange = (e) => {
    const val = e.target.value;
    setValue(val);
    const results = fuse.search(val).map(r => r.item.name);
    setSuggestions(results.slice(0, 5));
  };

  const runSmartSearch = async (queryText) => {
    setLoading(true);
    setSuggestions([]);

    try {
      const response = await fetch("http://localhost:8000/api/search-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText }),
      });

      const { filters, chips: tags, suggestions: backendSugg } = await response.json();
      setFilters(filters);
      setChips(tags);
      setBackendSuggestions(backendSugg);
      onSearch?.(filters, tags, backendSugg);

      if (showDebug) {
        console.log("🔍 Filters:", filters);
        console.log("🧠 Chips:", tags);
        console.log("💡 Suggestions:", backendSugg);
      }
    } catch (err) {
      console.error("Smart search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runSmartSearch(value);
    }
  };

  const handleSuggestionClick = (text) => {
    setValue(text);
    runSmartSearch(text);
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: 600,
      background: "rgba(255,255,255,0.25)",
      border: "1px solid rgba(255,255,255,0.3)",
      borderRadius: "20px",
      padding: "16px",
      backdropFilter: "blur(16px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
    }}>
      <input
        type="text"
        value={value}
        placeholder="مثلاً: ویلا سه خوابه زیر ۵ میلیارد با پارکینگ در فرهنگیان"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          padding: "14px 18px",
          border: "none",
          borderRadius: "12px",
          fontSize: "1.05em",
          color: "#333",
          fontWeight: 500,
          outline: "none",
          boxShadow: "inset 0 1px 4px rgba(0,0,0,0.1)",
          background: "rgba(255,255,255,0.5)"
        }}
      />

      {loading && (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <ClipLoader color="#b92a31" size={25} />
        </div>
      )}

      {suggestions.length > 0 && (
        <ul style={{
          marginTop: "10px",
          padding: "8px 12px",
          background: "#fff",
          borderRadius: "8px",
          listStyle: "none",
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
        }}>
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => handleSuggestionClick(s)}
              style={{
                padding: "6px 4px",
                cursor: "pointer",
                borderBottom: idx !== suggestions.length - 1 ? "1px solid #eee" : "none"
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {chips.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
          {chips.map((chip, idx) => (
            <div key={idx} style={{
              background: "#fff",
              padding: "5px 10px",
              borderRadius: "10px",
              fontSize: "0.9em",
              color: "#444",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)"
            }}>
              {chip}
            </div>
          ))}
        </div>
      )}

      {showDebug && (
        <div style={{
          marginTop: "24px",
          fontSize: "0.9em",
          color: "#555",
          padding: "12px",
          background: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.05)"
        }}>
          <strong>🧠 Filters:</strong>
          <pre>{JSON.stringify(filters, null, 2)}</pre>
          <strong>💡 Backend Suggestions:</strong>
          <ul>{backendSuggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
