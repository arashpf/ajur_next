// lib/ssrTrack.js
//
// Shared SSR-side analytics helpers.
// Used by getServerSideProps in any page that wants to fire analytics.
//
// Design:
//   - fireSsrEvent() posts to the Laravel /api/analytics/track endpoint
//     server-to-server (no CORS).
//   - buildClientContext() extracts the real client IP / UA / referer
//     from the incoming browser request.
//   - Reads `ajur_attribution` cookie and includes it in every event payload
//     for UTM / referrer attribution tracking.
//   - The IP is also returned so pages can pass it as `__clientIp` prop
//     for use by client-side click events.

import axios from "axios";

const PING_TIMEOUT_MS = 3000;

// ─── Public IP check ───
function isPublicIp(ip) {
  if (!ip || typeof ip !== "string") return false;

  let v = ip.toLowerCase().trim();
  if (v.startsWith("::ffff:")) v = v.slice(7);

  if (v === "::1" || v === "127.0.0.1" || v === "localhost") return false;
  if (v.startsWith("127.")) return false;
  if (v.startsWith("169.254.")) return false;
  if (v.startsWith("fe80:")) return false;
  if (v.startsWith("10.")) return false;
  if (v.startsWith("192.168.")) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(v)) return false;
  if (/^f[cd][0-9a-f]{2}:/.test(v)) return false;
  if (v === "255.255.255.255" || v === "0.0.0.0") return false;

  return true;
}

// ─── Extract the real client IP from the incoming request ───
export function getClientIp(req) {
  const headers = req.headers || {};
  const candidates = [
    headers["cf-connecting-ip"],
    headers["true-client-ip"],
    headers["x-real-ip"],
    headers["x-client-ip"],
    headers["x-forwarded-for"],
    headers["forwarded"],
    headers["x-forwarded"],
    headers["forwarded-for"],
    headers["x-cluster-client-ip"],
    headers["fastly-client-ip"],
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const first = String(value).split(",")[0].trim();
    if (isPublicIp(first)) return first;
  }

  const sock = req.socket && req.socket.remoteAddress;
  if (isPublicIp(sock)) return sock;

  return null;
}

// ─── Parse first-party cookies ───
export function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("=") || "")];
    })
  );
}

// ─── Read attribution from cookies ───
// Returns the parsed attribution object or null.
function getAttributionFromCookies(cookies) {
  const raw = cookies["ajur_attribution"];
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ─── Build the analytics context from the incoming request ───
export function buildClientContext(context, pageUrl) {
  const { req, query } = context;
  const cookies = parseCookies(req.headers.cookie);

  return {
    clientIp: getClientIp(req),
    userAgent: req.headers["user-agent"] || null,
    referer: req.headers["referer"] || req.headers["referrer"] || null,
    acceptLanguage: req.headers["accept-language"] || null,
    position: query?.position || null,
    source: query?.source || "ssr-page",
    pageUrl: pageUrl || null,
    anonymousId: cookies["ajur_anonymous_id"] || null,
    sessionId: cookies["ajur_session_id"] || null,
    attribution: getAttributionFromCookies(cookies),   // ← NEW
  };
}

// ─── Fire an SSR analytics event ───
export async function fireSsrEvent(eventName, payload, ctx) {
  const headers = {
    Accept: "application/json",
    "X-Client-From-Page": "1",
    ...(ctx.clientIp ? { "X-Client-Ip": ctx.clientIp } : {}),
    ...(ctx.userAgent ? { "X-Client-User-Agent": ctx.userAgent } : {}),
    ...(ctx.referer ? { "X-Client-Referer": ctx.referer } : {}),
    ...(ctx.acceptLanguage
      ? { "X-Client-Accept-Language": ctx.acceptLanguage }
      : {}),
    ...(ctx.position ? { "X-Client-Position": String(ctx.position) } : {}),
    ...(ctx.source ? { "X-Client-Source": ctx.source } : {}),
    ...(ctx.pageUrl ? { "X-Client-Page-Url": ctx.pageUrl } : {}),
    ...(ctx.anonymousId ? { "X-Client-Anonymous-Id": ctx.anonymousId } : {}),
    ...(ctx.sessionId ? { "X-Client-Session-Id": ctx.sessionId } : {}),
  };

  // Enrich payload with attribution if available
  const enrichedPayload = {
    ...payload,
    ...(ctx.attribution ? { attribution: ctx.attribution } : {}),
  };

  await axios.post(
    "https://api.ajur.app/api/analytics/track",
    {
      event_name: eventName,
      platform: "web",
      payload: enrichedPayload,
    },
    {
      timeout: PING_TIMEOUT_MS,
      headers,
    }
  );
}