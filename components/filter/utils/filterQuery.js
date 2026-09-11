// components/filter/utils/filterQuery.js

export const RANGE_SUFFIXES = ["_min", "_max"];

export function getSingleParam(value) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export function parseNumber(value) {
  const s = getSingleParam(value);
  if (s === "" || s === null || s === undefined) return "";
  const n = String(s).replace(/[^0-9.-]/g, "");
  return n === "" ? "" : n;
}

export function parseNeighborhoodIds(query) {
  const raw = getSingleParam(query?.neighborhoods);
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseFeatures(query) {
  const raw = getSingleParam(query?.features);
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Reserved keys that must never be parsed as a field value.
 */
const RESERVED_QUERY_KEYS = new Set([
  "categories",
  "slug",
  "page",
  "per_page",
  "features",
  "neighborhoods",
  "sortBy",
  "categoryId",
  "category_id",
  "catname",
  "city",
]);

/**
 * Read every field value from the query.
 *
 * Returns an object that may contain, per slug:
 *   { min: "..", max: ".." }       for range fields (slug_min / slug_max)
 *   ["a", "b"]                     for tick fields (slug=a,b)
 *   "some string"                  for predefine / text fields (slug=value)
 *
 * `fieldSlugs` (optional array of strings) — limits which slugs we look for.
 *   Pass `null` to accept any non-reserved key.
 *
 * `fieldTypes` (optional map { [slug]: type }) — used to decide how to parse
 *   a scalar value: type "2" → array, everything else → string.
 */
export function parseFieldValues(query, fieldSlugs = null, fieldTypes = null) {
  const result = {};
  const source = query || {};
  const slugSet =
    Array.isArray(fieldSlugs) && fieldSlugs.length > 0
      ? new Set(fieldSlugs)
      : null;

  Object.keys(source).forEach((key) => {
    if (RESERVED_QUERY_KEYS.has(key)) return;

    let slug = null;
    let side = null;

    if (key.endsWith("_min")) {
      slug = key.slice(0, -4);
      side = "min";
    } else if (key.endsWith("_max")) {
      slug = key.slice(0, -4);
      side = "max";
    }

    if (slug) {
      // Range side
      if (slugSet && !slugSet.has(slug)) return;
      if (!result[slug] || Array.isArray(result[slug]) || typeof result[slug] !== "object") {
        result[slug] = { min: "", max: "" };
      }
      result[slug][side] = parseNumber(source[key]);
      return;
    }

    // Scalar / tick — only accept keys we know about
    if (slugSet && !slugSet.has(key)) return;

    const raw = getSingleParam(source[key]);
    if (raw === "") return;

    // Determine field type if provided
    const type = fieldTypes ? String(fieldTypes[key] ?? "") : "";

    // Tick fields: value is "a,b,c" → split into array
    if (type === "2" || (raw.includes(",") && type !== "3")) {
      result[key] = String(raw)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return;
    }

    // Predefine / text → keep as string
    result[key] = String(raw);
  });

  return result;
}

export function parseSort(query) {
  const s = getSingleParam(query?.sortBy);
  if (s === "oldest" || s === "most_viewed") return s;
  return "newest";
}

/**
 * Build a fresh query object with filter values applied.
 * Preserves unrelated keys (page, etc.) — but resets page to "1".
 *
 * Handles three value shapes:
 *   - { min, max }  → slug_min / slug_max
 *   - ["a","b"]     → slug=a,b
 *   - "value"       → slug=value
 *
 * `fieldTypes` (optional map) — enables clearing stale scalar keys when a
 *   field is removed.
 */
export function buildQueryFromFilters(
  baseQuery,
  { fieldValues = {}, neighborhoods = [], features = [], sortBy = "newest", fieldTypes = {} } = {}
) {
  const q = { ...(baseQuery || {}) };

  // wipe all filter-related keys — ranges, scalars, ticks, features, sort, page
  Object.keys(q).forEach((key) => {
    if (
      key.endsWith("_min") ||
      key.endsWith("_max") ||
      key === "neighborhoods" ||
      key === "features" ||
      key === "sortBy" ||
      key === "page"
    ) {
      delete q[key];
      return;
    }
    // Also wipe any key that matches a known field slug (scalar/tick params)
    if (fieldTypes && Object.prototype.hasOwnProperty.call(fieldTypes, key)) {
      delete q[key];
    }
  });

  // ranges / ticks / scalars
  Object.entries(fieldValues).forEach(([slug, v]) => {
    if (v === undefined || v === null || v === "") return;

    // Tick field → array
    if (Array.isArray(v)) {
      if (v.length === 0) return;
      q[slug] = v.map(String).join(",");
      return;
    }

    // Range field → object with min/max
    if (typeof v === "object") {
      const hasMin = v.min !== "" && v.min !== undefined && v.min !== null;
      const hasMax = v.max !== "" && v.max !== undefined && v.max !== null;
      if (hasMin) q[`${slug}_min`] = String(v.min);
      if (hasMax) q[`${slug}_max`] = String(v.max);
      return;
    }

    // Scalar (predefine / text)
    q[slug] = String(v);
  });

  if (neighborhoods.length > 0) {
    q.neighborhoods = neighborhoods.map(String).join(",");
  }
  if (features.length > 0) {
    q.features = features.join(",");
  }
  if (sortBy && sortBy !== "newest") {
    q.sortBy = sortBy;
  }

  q.page = "1";
  return q;
}

/** Count active filters for the badge (category excluded — it's route-level). */
export function countActiveFilters({
  fieldValues = {},
  neighborhoods = [],
  features = [],
  sortBy = "newest",
} = {}) {
  let n = 0;

  Object.values(fieldValues).forEach((v) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) {
      if (v.length > 0) n += 1;
      return;
    }
    if (typeof v === "object") {
      const hasMin = v.min !== "" && v.min !== undefined && v.min !== null;
      const hasMax = v.max !== "" && v.max !== undefined && v.max !== null;
      if (hasMin || hasMax) n += 1;
      return;
    }
    if (v !== "0") n += 1;
  });

  n += neighborhoods.length;
  n += features.length;
  if (sortBy && sortBy !== "newest") n += 1;

  return n;
}