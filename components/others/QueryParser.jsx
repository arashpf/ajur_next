import React, { useMemo } from "react";
import Fuse from "fuse.js";

// --- SYNONYMS MAPS --- //
const CATEGORY_SYNONYMS = {
  "آپارتمان": ["آپارتمان", "اپارتمان", "پلاک", "واحد"],
  "ویلایی": ["ویلا", "ویلایی", "باغ", "ویلا دوبلکس"],
  "خانه": ["خانه", "خونه", "منزل", "مسکن"],
  "مغازه": ["مغازه", "دکه", "فروشگاه", "کیوسک"],
  "زمین": ["زمین", "قطعه زمین", "باغچه", "کلنگی"]
};

const FEATURE_SYNONYMS = [
  "پارکینگ", "آسانسور", "انباری", "بالکن", "دسترسی آسان", "پکیج", "استخر",
  "سونا", "جکوزی", "سرویس بهداشتی فرنگی", "سرویس بهداشتی ایرانی",
  "کابینت MDF", "کابینت ام دی اف", "کابینت فلزی", "نورگیر",
  "درب ریموت", "آب نما", "آلاچیق", "سیستم سرمایش", "سیستم گرمایش", "پارکینگ مسقف"
];

const CITY_LIST = ["تهران", "کرج", "اصفهان", "شیراز", "تبریز"];
const NEIGHBOURHOOD_LIST = ["ملکی", "رباط کریم", "ستارخان", "پونک", "شهرک غرب"];

function persianToEnglishNumber(str) {
  return str.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/٬/g, '');
}

function estimatePriceLevel(listing) {
  const priceObj = listing.json_properties?.find(p => p.key === "price");
  if (!priceObj) return null;
  const price = parseInt(persianToEnglishNumber(priceObj.value));
  if (isNaN(price)) return null;

  if (price < 3_000_000_000) return "low";
  if (price < 7_000_000_000) return "mid";
  return "high";
}

function getSynonymKey(word, synonymsMap) {
  for (const key in synonymsMap) {
    if (synonymsMap[key].some(syn => word.includes(syn))) return key;
  }
  return null;
}

function matchFuse(list, query) {
  const fuse = new Fuse(list, { threshold: 0.3 });
  const res = fuse.search(query);
  return res.length ? res[0].item : null;
}

const QueryParser = ({ query, listings, onResults }) => {
  const filters = useMemo(() => {
    if (!query) return {};

    const text = query.toLowerCase();
    const filters = {};

    filters.category = getSynonymKey(text, CATEGORY_SYNONYMS);
    filters.features = FEATURE_SYNONYMS.filter(f => text.includes(f));
    filters.city = matchFuse(CITY_LIST, text);
    filters.neighbourhood = matchFuse(NEIGHBOURHOOD_LIST, text);

    if (text.includes("ارزون") || text.includes("ارزان") || text.includes("قیمت پایین")) {
      filters.price_level = "low";
    } else if (text.includes("لوکس") || text.includes("گران") || text.includes("قیمت بالا")) {
      filters.price_level = "high";
    }

    return filters;
  }, [query]);

  useMemo(() => {
    if (!listings?.length) {
      onResults([]);
      return;
    }

    const filtered = listings.filter(listing => {
      if (filters.category && listing.category_name !== filters.category) return false;
      if (filters.city && listing.city !== filters.city) return false;
      if (filters.neighbourhood && listing.neighbourhood !== filters.neighbourhood) return false;
      if (filters.price_level && estimatePriceLevel(listing) !== filters.price_level) return false;

      if (filters.features?.length) {
        const allMatch = filters.features.every(f =>
          listing.description?.toLowerCase().includes(f.toLowerCase())
        );
        if (!allMatch) return false;
      }

      return true;
    });

    onResults(filtered);
  }, [filters, listings, onResults]);

  return null;
};

export default QueryParser;
