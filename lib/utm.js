// lib/utm.js
//
// UTM + Referrer Code capture with First-Touch attribution (24-hour window).
//
// Two tracking modes supported:
//   1. Legacy UTM: ?utm_source=instagram&utm_medium=story&utm_campaign=test1
//   2. Short code: ?r=s789456-ig   (referrer channel code)
//
// If ?r= exists → saves as referrer_code (preferred)
// Else if any UTM params → saves as UTM
//
// Cookie lives 24 hours. First-touch wins.
//
// Cookie is scoped to .ajur.app so it's also sent to api.ajur.app on
// registration requests (needed for referrer attribution on signup).

const COOKIE_NAME = "ajur_attribution";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

/**
 * Captures UTM + ?r= from the current URL. First-touch wins.
 * Safe to call on every page load.
 */
export function captureAttribution() {
  if (typeof window === "undefined") return;

  // If cookie already exists — do NOT overwrite (First-Touch)
  if (readCookie(COOKIE_NAME)) return;

  const url = new URL(window.location.href);
  const params = url.searchParams;

  const referrerCode = params.get("r");

  // Prefer short code if present
  if (referrerCode) {
    const data = {
      type: "referrer",
      referrer_code: referrerCode,
      captured_at: new Date().toISOString(),
    };
    writeCookie(COOKIE_NAME, JSON.stringify(data), COOKIE_MAX_AGE_SECONDS);
    return;
  }

  // Fall back to UTM params
  const utm = {
    source:   params.get("utm_source"),
    medium:   params.get("utm_medium"),
    campaign: params.get("utm_campaign"),
    content:  params.get("utm_content"),
    term:     params.get("utm_term"),
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
  };

  const hasUtm = utm.source || utm.medium || utm.campaign || utm.content || utm.term;
  const hasExternalReferrer =
    utm.referrer && !isInternalReferrer(utm.referrer);

  if (!hasUtm && !hasExternalReferrer) return;

  const data = {
    type: "utm",
    ...utm,
    captured_at: new Date().toISOString(),
  };

  writeCookie(COOKIE_NAME, JSON.stringify(data), COOKIE_MAX_AGE_SECONDS);
}

/**
 * Returns the attribution object from the cookie, or null.
 * Use this when building event payloads.
 */
export function getAttribution() {
  if (typeof window === "undefined") return null;

  const raw = readCookie(COOKIE_NAME);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────

function readCookie(name) {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp("(^|; )" + name.replace(/([.*+?^${}()|[\]\\])/g, "\\$1") + "=([^;]*)")
  );

  return match ? decodeURIComponent(match[2]) : null;
}

function writeCookie(name, value, maxAgeSeconds) {
  if (typeof document === "undefined") return;

  const isSecure = window.location.protocol === "https:";

  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "path=/",
    `max-age=${maxAgeSeconds}`,
    "SameSite=Lax",
  ];

  // Share the cookie with all *.ajur.app subdomains so api.ajur.app
  // also sees it on registration/verify requests. Without this, the
  // cookie is scoped to ajur.app only and Laravel never receives it.
  const host = window.location.hostname;
  if (host === "ajur.app" || host.endsWith(".ajur.app")) {
    parts.push("Domain=.ajur.app");
  }

  if (isSecure) parts.push("Secure");

  document.cookie = parts.join("; ");
}

function isInternalReferrer(ref) {
  try {
    const url = new URL(ref);
    const currentHost = window.location.hostname;
    return url.hostname === currentHost || url.hostname.endsWith("." + currentHost);
  } catch {
    return false;
  }
}