// lib/identity.js
// Generates and persists anonymous_id + session_id cookies in the browser.
// Must run client-side only.

const ANON_COOKIE = "ajur_anonymous_id";
const SESSION_COOKIE = "ajur_session_id";
const ANON_MAX_AGE = 60 * 60 * 24 * 365 * 2; // 2 years
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;   // 30 days

function uuidv4() {
  // Small inline UUID v4 (no dependency needed)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, maxAge) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

export function ensureIdentity() {
  if (typeof window === "undefined") return null;

  let anonId = getCookie(ANON_COOKIE);
  if (!anonId) {
    anonId = uuidv4();
    setCookie(ANON_COOKIE, anonId, ANON_MAX_AGE);
  }

  let sessionId = getCookie(SESSION_COOKIE);
  if (!sessionId) {
    sessionId = uuidv4();
    setCookie(SESSION_COOKIE, sessionId, SESSION_MAX_AGE);
  }

  return { anonymousId: anonId, sessionId };
}

export function getAnonymousId() {
  return getCookie(ANON_COOKIE);
}

export function getSessionId() {
  return getCookie(SESSION_COOKIE);
}