// lib/skipTrackingParams.js
//
// Tracking params we never want to treat as filter values.
// Used when building API URLs from the URL query.

export const TRACKING_PARAMS = new Set([
    "r",              // referrer code
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "utm_id",
    "gclid",          // Google Ads
    "fbclid",         // Facebook
    "ref",            // misc referrer
    "source",         // misc source
  ]);
  
  /**
   * Returns true if the given query key should be skipped
   * (it's a tracking param, not a filter).
   */
  export function isTrackingParam(key) {
    if (!key) return false;
    const k = String(key).toLowerCase();
    if (TRACKING_PARAMS.has(k)) return true;
    if (k.startsWith("utm_")) return true;
    return false;
  }
  
  /**
   * Given an object of query params, return a copy
   * with all tracking params removed.
   */
  export function stripTrackingParams(query = {}) {
    const out = {};
    for (const [key, value] of Object.entries(query)) {
      if (isTrackingParam(key)) continue;
      out[key] = value;
    }
    return out;
  }