// index.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const stringSimilarity = require("string-similarity");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST"],
    credentials: true
  })
);

app.use(express.json());

const AI_API = "https://api.ajur.app/api/ai/v1";

let cities = [];
let neighborhoods = [];
let categories = [];

/**
 * Load metadata (cities, neighborhoods, categories)
 * from the single combined AI_API endpoint.
 */
async function loadMetadata() {
  try {
    const resp = await axios.get(AI_API);
    const json = resp.data;

    const citiesArr = Array.isArray(json.cities) ? json.cities : [];
    const hoodsArr = Array.isArray(json.neighborhoods)
      ? json.neighborhoods
      : [];

    let listingsArr = [];
    for (const key of Object.keys(json)) {
      if (
        Array.isArray(json[key]) &&
        json[key].length > 0 &&
        typeof json[key][0] === "object" &&
        "category_name" in json[key][0]
      ) {
        listingsArr = json[key];
        console.log(
          `🧩 Found listings under key "${key}" (count: ${listingsArr.length})`
        );
        break;
      }
    }

    // ✅ Now safe to log sample listing
    console.log("🧪 Sample listing:", listingsArr[0]);

    const citySet = new Set();
    const hoodSet = new Set();
    const categorySet = new Set();

    citiesArr.forEach(c => {
      if (c.title) citySet.add(c.title.trim().toLowerCase());
    });
    hoodsArr.forEach(n => {
      if (n.name) hoodSet.add(n.name.trim().toLowerCase());
    });
    listingsArr.forEach(item => {
      const raw = item.category_name;
      if (typeof raw === "string") {
        const cleaned = raw.replace(/[\r\n\t]+/g, " ").trim().toLowerCase();
        if (cleaned) categorySet.add(cleaned);
      }
    });

    cities = Array.from(citySet);
    neighborhoods = Array.from(hoodSet);
    categories = Array.from(categorySet);

    console.log("✅ Loaded metadata:", {
      cities: cities.length,
      neighborhoods: neighborhoods.length,
      categories: categories.length
    });
    console.log("📁 Sample categories:", categories.slice(0, 20));
  } catch (err) {
    console.error("❌ Failed to load metadata:", err.message);
  }
}

/**
 * Normalize text: convert Persian digits to Latin, lowercase & trim.
 */
function normalize(str = "") {
  return str
    .toString()
    .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .trim()
    .toLowerCase();
}

/**
 * Flatten a listing’s decoded props into a simple object.
 */
function flattenListing(listing, decodedProps = []) {
  const flat = {
    id: listing.id,
    name: listing.name,
    city: listing.city,
    neighborhood: listing.neighbourhood,
    category: listing.category_name,
    price: null,
    area: null,
    rooms: null,
    parking: false,
    storage: false,
    elevator: false,
    balcony: false
  };

  decodedProps.forEach(({ name, value }) => {
    const key = normalize(name);
    if (/قیمت/.test(key)) flat.price = Number(value);
    if (/متراژ/.test(key)) flat.area = Number(value);
    if (/خوابه/.test(key)) flat.rooms = Number(value);
    if (/پارکینگ/.test(key)) flat.parking = true;
    if (/انباری/.test(key)) flat.storage = true;
    if (/آسانسور/.test(key)) flat.elevator = true;
    if (/تراس/.test(key)) flat.balcony = true;
  });

  return flat;
}

/**
 * POST /api/search-intent
 * Receives { query }, returns { filters, chips, suggestions, results }.
 */
app.post("/api/search-intent", async (req, res) => {
  const raw = normalize(req.body.query || "");
  const filters = {};
  const chips = [];
  const suggestions = [];

  // 1. Rent vs Buy
  if (/(اجاره|رهن|کرایه)/.test(raw)) {
    filters.intent = "rent";
    chips.push("اجاره");
  } else {
    filters.intent = "buy";
  }

  let typeSuggestions = [];

  if (filters.intent === "buy") {
    typeSuggestions = categories.filter(
      cat => cat.includes("خرید") || cat.includes("فروش")
    );
  }

  if (filters.intent === "rent") {
    typeSuggestions = categories.filter(
      cat => cat.includes("اجاره") || cat.includes("رهن")
    );
  }

  // 2. Feature keywords
  ["مبله", "پارکینگ", "انباری", "آسانسور", "تراس"].forEach(feat => {
    if (raw.includes(feat)) {
      filters[normalize(feat)] = true;
      chips.push(feat);
    }
  });

  // 3. Numeric filters: area, rooms, price
  const areaM = raw.match(/(\d+)\s*متر/);
  const roomM = raw.match(/(\d+)\s*خوابه/);
  const priceM = raw.match(/زیر\s*(\d+)\s*(میلیارد|میلیون)?/);

  if (areaM) {
    filters.area = Number(areaM[1]);
    chips.push(`${areaM[1]} متر`);
  }
  if (roomM) {
    filters.rooms = Number(roomM[1]);
    chips.push(`${roomM[1]} خواب`);
  }
  if (priceM) {
    let p = Number(priceM[1]);
    if (priceM[2] === "میلیارد") p *= 1_000_000_000;
    if (priceM[2] === "میلیون") p *= 1_000_000;
    filters.price = p;
    chips.push(`زیر ${priceM[1]} ${priceM[2] || ""}`);
  }

  // 4. Fuzzy match city, category, neighborhood
  const cityMatch = stringSimilarity.findBestMatch(raw, cities);
  if (cityMatch.bestMatch.rating > 0.25) {
    filters.city = cityMatch.bestMatch.target;
    chips.push(cityMatch.bestMatch.target);
  }

  const catMatch = stringSimilarity.findBestMatch(raw, categories);
  if (catMatch.bestMatch.rating > 0.3) {
    filters.category_name = catMatch.bestMatch.target;
    chips.push(catMatch.bestMatch.target);
  }

  const hoodMatch = stringSimilarity.findBestMatch(raw, neighborhoods);
  if (hoodMatch.bestMatch.rating > 0.3) {
    filters.neighborhood = hoodMatch.bestMatch.target;
    chips.push(hoodMatch.bestMatch.target);
  }

  // 5. Fetch all listings again and apply filters
  try {
    const resp = await axios.get(AI_API);
    const allListings = Array.isArray(resp.data.data)
      ? resp.data.data
      : Array.isArray(resp.data.listings) ? resp.data.listings : [];
    const results = allListings
      .map(item =>
        flattenListing(item, JSON.parse(item.json_properties || "[]"))
      )
      .filter(listing =>
        Object.entries(filters).every(([k, v]) => {
          const val = listing[k];
          if (v === true) return Boolean(val);
          if (typeof v === "number") return val != null && val <= v;
          return val && val.toString().includes(v.toString());
        })
      );

    // Auto-suggest categories based on intent keywords
    if (raw.includes("خرید") || raw.includes("فروش")) {
      const buyCategories = categories.filter(cat => /خرید|فروش/.test(cat));
      suggestions.push(...buyCategories.slice(0, 6));
    }

    if (/(اجاره|رهن|کرایه)/.test(raw)) {
      const rentCategories = categories.filter(cat =>
        /اجاره|رهن|کرایه/.test(cat)
      );
      suggestions.push(...rentCategories.slice(0, 6));
    }

    // Fallback generic suggestions
    if (suggestions.length === 0) {
      suggestions.push("ویلا", "زمین", "آپارتمان", "اجاره", "زیر ۳ میلیارد");
    }

    return res.json({
      filters,
      chips,
      suggestions: [...suggestions, ...typeSuggestions.slice(0, 6)],
      results,
      confidence: Object.keys(filters).length ? 0.9 : 0.3
    });
  } catch (err) {
    console.error("❌ Failed to fetch listings:", err.message);
    return res.status(500).json({ error: "Failed to fetch listings." });
  }
});

// Bootstrap server
(async () => {
  await loadMetadata();
  const port = process.env.PORT || 8000;
  app.listen(port, () =>
    console.log(`🚀 Smart Search API listening on http://localhost:${port}`)
  );
})();
