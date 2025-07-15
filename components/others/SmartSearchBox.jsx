import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ClipLoader from "react-spinners/ClipLoader";
import styles from "./SmartSearchBox.module.css";

const API_BASE = "https://api.ajur.app/api/ai/v1";
const SEARCH_INTENT = "http://localhost:8000/api/search-intent";

export default function SmartSearchBox({ onSearch, showDebug = false }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [chips, setChips] = useState([]);
  const [filters, setFilters] = useState({});
  const [intentSuggestions, setIntentSuggestions] = useState([]);
  const [results, setResults] = useState([]);

  const [cityList, setCityList] = useState([]);
  const [neighborhoodList, setNeighborhoodList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await fetch(API_BASE);
        const json = await res.json();
        setCityList(json.cities?.map(i => i.name) || []);
        setNeighborhoodList(json.neighborhoods?.map(i => i.name) || []);
        setCategoryList(json.categories?.map(i => i.name) || []);
      } catch (err) {
        console.error("❌ Failed to load metadata:", err.message);
      }
    }
    loadMeta();
  }, []);

  const handleInputChange = (e) => {
    const txt = e.target.value;
    setValue(txt);
    if (!txt.trim()) {
      setSuggestions([]);
      return;
    }

    const q = txt.toLowerCase();
    const pool = [...new Set([...categoryList, ...neighborhoodList, ...cityList])];

    const matches = pool
      .filter(item => typeof item === "string" && item.toLowerCase().includes(q))
      .slice(0, 5);

    setSuggestions(matches);
  };

  const runSmartSearch = async (queryText) => {
  setLoading(true);
  setSuggestions([]);

  try {
    const res = await fetch(SEARCH_INTENT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryText }),
    });

    const {
      filters: fb,
      chips: tags,
      suggestions: backendSugg,
      results: apiResults,
    } = await res.json();
   setIntentSuggestions(backendSugg);
    setFilters(fb);
    setChips(tags);
    setResults(apiResults);

    // 🔐 PROTECT AGAINST BAD FILTERS
    const category = fb.category_name?.trim();
    const city     = fb.city?.trim();
    const hood     = fb.neighborhood?.trim();

    if (!category || !city || category === "search-intent" || city === "api") {
      console.warn("🚫 Blocked bad redirect:", { category, city });
      return; // ⛔ do not redirect
    }

    const encodedCity     = encodeURIComponent(city);
    const encodedCategory = encodeURIComponent(category);
    const encodedHood     = hood ? encodeURIComponent(hood) : "";

    let url = `/${encodedCity}/${encodedCategory}?city=${encodedCity}`;
    if (hood) url += `&neighbor=${encodedHood}`;

    console.log("🚀 Redirecting to:", url);
    router.push(url);

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
    <div className={styles.searchboxContainer}>
      <input
        type="text"
        className={styles.searchboxInput}
        value={value}
        placeholder="مثلاً: ویلا سه خوابه زیر ۵ میلیارد با پارکینگ در فرهنگیان"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      {loading && (
        <div className={styles.loader}>
          <ClipLoader color="#b92a31" size={25} />
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className={styles.suggestionList}>
          {suggestions.map((s, i) => (
            <li key={i} className={styles.suggestionItem} onClick={() => handleSuggestionClick(s)}>
              {s}
            </li>
          ))}
        </ul>
      )}

      {chips.length > 0 && (
        <div className={styles.chipContainer}>
          {chips.map((chip, i) => (
            <div key={i} className={styles.chip}>{chip}</div>
          ))}
        </div>
      )}

      {showDebug && (
        <div className={styles.debugBox}>
          <strong>🧠 Filters:</strong>
          <pre>{JSON.stringify(filters, null, 2)}</pre>
          <strong>🏷️ Chips:</strong>
          <pre>{JSON.stringify(chips, null, 2)}</pre>
          <strong>💡 Intent Suggestions:</strong>
          <ul>
           {intentSuggestions.length > 0 && (
  <ul className={styles.suggestionList}>
    {intentSuggestions.map((text, i) => (
      <li
        key={i}
        className={styles.suggestionItem}
        onClick={() => handleSuggestionClick(text)}
      >
        {text}
      </li>
    ))}
  </ul>
)}


          </ul>
          <strong>📄 Results:</strong>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
