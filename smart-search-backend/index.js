const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const stringSimilarity = require("string-similarity");
const synonyms = require("./synonyms");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const LIVE_API = "https://api.ajur.app/api/ai/v1";

const cityAliases = {
  "پرند": "شهر جدید پرند", "رباط": "رباط کریم", "چاف": "چاف و چمخانه",
  "لاهیجان": "لاهیجان", "نوشهر": "نوشهر", "مشهد": "مشهد", "رامسر": "رامسر",
  "آستانه اشرفیه": "آستانه اشرفیه", "اندیشه": "اندیشه"
};

const neighborhoods = [
  "شهرک جانبازان", "شهرک شهرداری", "مرکز شهر", "رباط قدیم", "گلدشت",
  "خلیج فارس", "عطر یاس", "بخشداری- شهرک فداییان", "نیرو انتظامی", "آبرسانی",
  "انقلاب 1 تا 13", "داودیه", "تقی آباد", "وحیدیه", "گرجی", "طالقانی-امینی",
  "وهن آباد", "حکیم آباد-شهرستانک", "اشکانیه و بازارک", "منجیل آباد", "کیکاور",
  "اصغرآباد", "سفیدار", "شترخوار", "الارد-پرندک", "حصار مهتر", "شهرآباد", "انجم آباد",
  "پیغمبر", "شهرک خانه", "آبشناسان", "ملکی", "مصلی", "فرهنگیان"
];

function digitsFaToEn(str) {
  return str.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}
function normalize(s) {
  return (s || "").toString().trim().toLowerCase();
}
function featureMap(fa) {
  return {
    "پارکینگ": "parking", "انباری": "storage",
    "آسانسور": "elevator", "تراس": "balcony"
  }[fa];
}

function flattenListing(listing, jsonProps) {
  const flat = {
    city: listing.city || "",
    category_name: listing.category_name || "",
    neighbor: listing.neighbourhood || "",
    intent: listing.category_name?.includes("اجاره") || listing.category_name?.includes("رهن") ? "rent" : "buy",
    name: listing.name || "", description: listing.description || "",
    price: null, rooms: null, area: null, year: null, floor: null,
    ownership: "", heating: "", cooling: "", deal: "", furnished: false,
    parking: false, storage: false, elevator: false, balcony: false,
  };

  jsonProps.forEach((prop) => {
    const name = normalize(prop.name);
    const val = prop.value?.toString().trim();
    if (!val) return;

    if (name.includes("قیمت")) flat.price = val;
    if (name.includes("متراژ")) flat.area = val;
    if (name.includes("خواب")) flat.rooms = val;
    if (name.includes("سال ساخت")) flat.year = val;
    if (name.includes("طبقه")) flat.floor = val;
    if (name.includes("مالکیت")) flat.ownership = val;
    if (name.includes("گرمایش")) flat.heating = val;
    if (name.includes("سرمایش")) flat.cooling = val;
    if (name.includes("معاوضه")) flat.deal = "معاوضه";
    if (name.includes("مبله") || name.includes("اثاث")) flat.furnished = true;
    if (name.includes("پارکینگ")) flat.parking = val === "1" || val === 1;
    if (name.includes("انباری")) flat.storage = val === "1" || val === 1;
    if (name.includes("آسانسور")) flat.elevator = val === "1" || val === 1;
    if (name.includes("تراس")) flat.balcony = val === "1" || val === 1;
  });

  return flat;
}

app.post("/api/search-intent", async (req, res) => {
  const rawQuery = normalize(digitsFaToEn(req.body.query || ""));
  const filters = {};
  const chips = [];
  const suggestions = [];

   console.log("👉 API hit received with query:", req.body.query);
  console.log("🔍 Filters detected:", filters);
console.log("🔍 Chips detected:", chips);

  if (/اجاره|رهن|کرایه/.test(rawQuery)) filters.intent = "rent", chips.push("اجاره");
  if (/معاوضه/.test(rawQuery)) filters.deal = "معاوضه", chips.push("معاوضه");
  if (/مبله|اثاث/.test(rawQuery)) filters.furnished = true, chips.push("مبله");

  const areaMatch = rawQuery.match(/(\d+)\s*(?:متر|متراژ|متری)/);
  if (areaMatch) filters.area = parseInt(areaMatch[1]), chips.push(`${areaMatch[1]} متر`);

  const roomMatch = rawQuery.match(/(?:خانه\s*)?(\d+)\s*خوابه/);
  if (roomMatch) filters.rooms = parseInt(roomMatch[1]), chips.push(`${roomMatch[1]} خواب`);

  const yearMatch = rawQuery.match(/سال ساخت\s*(\d{4})/);
  if (yearMatch) filters.year = parseInt(yearMatch[1]), chips.push(`سال ساخت ${yearMatch[1]}`);

  const floorMatch = rawQuery.match(/طبقه\s*(\d+)/);
  if (floorMatch) filters.floor = parseInt(floorMatch[1]), chips.push(`طبقه ${floorMatch[1]}`);

  const ownershipMatch = rawQuery.match(/مالکیت\s*(\w+)/);
  if (ownershipMatch) filters.ownership = ownershipMatch[1], chips.push(`مالکیت ${ownershipMatch[1]}`);

  const heatingMatch = rawQuery.match(/گرمایش\s*(\w+)/);
  if (heatingMatch) filters.heating = heatingMatch[1], chips.push(`گرمایش ${heatingMatch[1]}`);

  const coolingMatch = rawQuery.match(/سرمایش\s*(\w+)/);
  if (coolingMatch) filters.cooling = coolingMatch[1], chips.push(`سرمایش ${coolingMatch[1]}`);

  const priceMatch = rawQuery.match(/زیر\s*(\d+)\s*(میلیارد|میلیون)?/);
  if (priceMatch) {
    let price = parseInt(priceMatch[1]);
    if (priceMatch[2] === "میلیارد") price *= 1_000_000_000;
    else if (priceMatch[2] === "میلیون") price *= 1_000_000;
    filters.price = price;
    chips.push(`زیر ${priceMatch[1]} ${priceMatch[2] || ""}`);
  }

  const fuzzyCity = stringSimilarity.findBestMatch(rawQuery, Object.keys(cityAliases));
  if (fuzzyCity.bestMatch.rating > 0.4) {
    filters.city = cityAliases[fuzzyCity.bestMatch.target];
    chips.push(fuzzyCity.bestMatch.target);
  }

  const normalizedNeighborhoods = neighborhoods.map(n => normalize(n));
  const bestNeighborhoodMatch = stringSimilarity.findBestMatch(rawQuery, normalizedNeighborhoods);
  if (bestNeighborhoodMatch.bestMatch.rating > 0.6 && rawQuery.includes(bestNeighborhoodMatch.bestMatch.target)) {
    const originalNeighbor = neighborhoods.find(n => normalize(n) === bestNeighborhoodMatch.bestMatch.target);
    filters.neighbor = originalNeighbor;
    chips.push(originalNeighbor);
  }

  for (const hint of Object.keys(synonyms.categories)) {
    if (rawQuery.includes(hint)) {
      filters.category_name = synonyms.categories[hint];
      chips.push(hint);
      break;
    }
  }

  ["پارکینگ", "انباری", "آسانسور", "تراس"].forEach((feature) => {
    if (rawQuery.includes(feature)) {
      filters[featureMap(feature)] = true;
      chips.push(feature);
    }
  });

  let listings = [];
  try {
    const response = await axios.get(LIVE_API);
    listings = response.data.data || [];
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch listings." });
  }

  const results = listings.filter((listing) => {
    const jsonProps = JSON.parse(listing.json_properties || "[]");
    const flat = flattenListing(listing, jsonProps);
    console.log("🧩 Listing:", flat);
      console.log("🧩 Flattened listing:", flat);

    return Object.entries(filters).every(([key, value]) => {
      const listingVal = flat[key];
      if (listingVal === undefined || listingVal === null) return false;
         if (typeof value === "boolean") {
        return listingVal === true || listingVal === "1" || listingVal === 1;
      }
      if (typeof value === "number") {
        return Number(listingVal) <= value;
      }
      if (typeof value === "string") {
        return normalize(listingVal).includes(normalize(value));
      }
      return false;
    });
  });

  if (!filters.category_name) {
    suggestions.push("ویلا", "زمین", "آپارتمان", "زیر ۳ میلیارد", "دو خواب");
  }

  res.json({
    filters,
    chips,
    suggestions,
    results,
    confidence: Object.keys(filters).length ? 0.9 : 0.3,
    suggestedQuery: rawQuery,
  });
});

app.listen(8000, () => {
  console.log("🚀 Smart Search API running at http://localhost:8000");
});
