// // pages/api/track-event.js


// import axios from "axios";
// import { isBot } from "../../lib/blockBots"; // ← ADDED

// // Only these events are allowed from the browser. SSR-only events
// // (listing_view, category_view, city_view) are intentionally excluded.
// const ALLOWED_EVENTS = new Set([
//   "listing_call",
//   "listing_favorite",
//   "listing_share",
//   "search",
//   "filter_apply",
//   "auth",
//   "contact_submit",
//   "city_select",
//   "city_view",
//   "contact_intent",
//   "contact_call_click",
//   "contact_form_started",
//   "contact_form_submitted",
//   "contact_form_verified",
//   "contact_success",
// ]);

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ ok: false });
//   }

//   const { event_name, payload, client_ip } = req.body || {};

//   // ─── Parse cookies (fallback sources for identity + IP) ───
//   // ← MOVED UP: we need cookies before the bot check so we can use
//   //   the same priority chain to resolve the real IP.
//   const cookies = Object.fromEntries(
//     (req.headers.cookie || "").split(";").map((c) => {
//       const [k, ...v] = c.trim().split("=");
//       return [k, decodeURIComponent(v.join("=") || "")];
//     })
//   );

//   // ─── Resolve client IP (same priority as before) ───
//   const xff = req.headers["x-forwarded-for"];
//   const clientIp =
//     client_ip ||
//     cookies["ajur_client_ip"] ||
//     (typeof xff === "string" && xff.split(",")[0].trim()) ||
//     req.headers["x-real-ip"] ||
//     req.headers["cf-connecting-ip"] ||
//     req.headers["ar-real-ip"] ||
//     (req.socket && req.socket.remoteAddress) ||
//     null;

//   const userAgent = req.headers["user-agent"] || null;

//   // ─── BOT BLOCK ─── ← ADDED
//   // Runs BEFORE the debug log and BEFORE axios — bots never reach
//   // your Laravel analytics API.
//   const botCheck = isBot(clientIp, userAgent || "");
//   if (botCheck.bot) {
//     // eslint-disable-next-line no-console
//     console.log(`[track-event] BLOCKED ${clientIp} | ${botCheck.reason}`);
//     // Return 200 so bots don't retry aggressively.
//     return res.status(200).json({ ok: true, skipped: true });
//   }
//   // ─── END BOT BLOCK ───

//   // ─── DEBUG ───
//   // eslint-disable-next-line no-console
//   console.log("[track-event] incoming", {
//     event_name,
//     client_ip_from_body: client_ip || null,
//     resolved_client_ip: clientIp,          // ← ADDED (useful when debugging)
//     cookieHeader: req.headers.cookie || null,
//     xff: req.headers["x-forwarded-for"] || null,
//     xRealIp: req.headers["x-real-ip"] || null,
//     cfConnectingIp: req.headers["cf-connecting-ip"] || null,
//     arRealIp: req.headers["ar-real-ip"] || null,
//     socketRemote: (req.socket && req.socket.remoteAddress) || null,
//   });
//   // ─── END DEBUG ───

//   if (!event_name || !ALLOWED_EVENTS.has(event_name)) {
//     return res.status(400).json({ ok: false, error: "invalid event" });
//   }

//   try {
//     await axios.post(
//       "https://api.ajur.app/api/analytics/track",
//       {
//         event_name,
//         platform: "web",
//         payload: payload || {},
//       },
//       {
//         timeout: 3000,
//         headers: {
//           Accept: "application/json",

//           // ─── Gate: mark this as a page-originated event ───
//           "X-Client-From-Page": "1",

//           // ─── Real browser context (Laravel stores these) ───
//           ...(clientIp ? { "X-Client-Ip": clientIp } : {}),
//           ...(userAgent ? { "X-Client-User-Agent": userAgent } : {}),

//           // ─── Referer + page URL ───
//           ...(req.headers["referer"]
//             ? { "X-Client-Referer": req.headers["referer"] }
//             : {}),
//           ...(req.headers["referer"]
//             ? { "X-Client-Page-Url": req.headers["referer"] }
//             : {}),

//           // ─── Identity (cookies, may be null on first visit) ───
//           ...(cookies["ajur_anonymous_id"]
//             ? { "X-Client-Anonymous-Id": cookies["ajur_anonymous_id"] }
//             : {}),
//           ...(cookies["ajur_session_id"]
//             ? { "X-Client-Session-Id": cookies["ajur_session_id"] }
//             : {}),

//           // ─── Source marker so we can distinguish SSR vs client hits ───
//           "X-Client-Source": "client-event",
//         },
//       }
//     );

//     return res.status(200).json({ ok: true });
//   } catch (err) {
//     console.warn("[track-event] failed:", err?.message || err);
//     // Always return 200 — analytics must not block the client.
//     return res.status(200).json({ ok: false });
//   }
// }



// pages/api/track-event.js
//
// Same-origin proxy: browser POSTs here, this forwards to api.ajur.app
// with X-Client-* headers so Laravel sees the real browser IP / UA
// instead of our Next.js server's.
//
// Used for CLICK events (which can't fire from SSR). SSR events use
// fireSsrEvent() directly in getServerSideProps.

import axios from "axios";
import { isBot } from "../../lib/blockBots";

// Only these events are allowed from the browser. SSR-only events
// (listing_view, category_view, city_view) are intentionally excluded.
const ALLOWED_EVENTS = new Set([
  "listing_call",
  "listing_favorite",
  "listing_share",
  "search",
  "filter_apply",
  "auth",
  "contact_submit",
  "city_select",
  "city_view",
  "contact_intent",
  "contact_call_click",
  "contact_form_started",
  "contact_form_submitted",
  "contact_form_verified",
  "contact_success",
]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const {
    event_name,
    payload,
    client_ip,
    anonymous_id: body_anonymous_id,   // ← optional: if lib/track.js sends it
    session_id: body_session_id,       // ← optional
    page_url: body_page_url,           // ← optional
  } = req.body || {};

  // ─── Parse cookies (fallback sources for identity + IP) ───
  const cookies = Object.fromEntries(
    (req.headers.cookie || "").split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("=") || "")];
    })
  );

  // ─── Resolve client IP ───
  // Priority:
  //   1. `client_ip` from request body — set by SSR via page props.
  //   2. SSR-set cookie (`ajur_client_ip`).
  //   3. CDN/proxy headers.
  //   4. Raw socket.
  const xff = req.headers["x-forwarded-for"];
  const clientIp =
    client_ip ||
    cookies["ajur_client_ip"] ||
    (typeof xff === "string" && xff.split(",")[0].trim()) ||
    req.headers["x-real-ip"] ||
    req.headers["cf-connecting-ip"] ||
    req.headers["ar-real-ip"] ||
    (req.socket && req.socket.remoteAddress) ||
    null;

  const userAgent = req.headers["user-agent"] || null;

  // ─── Resolve identity ───
  // Priority: body value first (if client sends it), then cookie.
  // Either source is fine — both come from the browser.
  const anonymousId =
    body_anonymous_id || cookies["ajur_anonymous_id"] || null;
  const sessionId =
    body_session_id || cookies["ajur_session_id"] || null;

  // ─── Resolve page URL / referer ───
  const referer = req.headers["referer"] || req.headers["referrer"] || null;
  const pageUrl = body_page_url || referer || null;

  // ─── BOT BLOCK ───
  // Runs BEFORE the debug log and BEFORE axios — bots never reach
  // your Laravel analytics API.
  const botCheck = isBot(clientIp, userAgent || "");
  if (botCheck.bot) {
    // eslint-disable-next-line no-console
    console.log(`[track-event] BLOCKED ${clientIp} | ${botCheck.reason}`);
    // Return 200 so bots don't retry aggressively.
    return res.status(200).json({ ok: true, skipped: true });
  }

  // ─── DEBUG ───
  // eslint-disable-next-line no-console
  console.log("[track-event] incoming", {
    event_name,
    client_ip_from_body: client_ip || null,
    resolved_client_ip: clientIp,
    has_anonymous_id: !!anonymousId,
    has_session_id: !!sessionId,
    cookieHeader: req.headers.cookie || null,
    xff: req.headers["x-forwarded-for"] || null,
    xRealIp: req.headers["x-real-ip"] || null,
    cfConnectingIp: req.headers["cf-connecting-ip"] || null,
    arRealIp: req.headers["ar-real-ip"] || null,
    socketRemote: (req.socket && req.socket.remoteAddress) || null,
  });

  if (!event_name || !ALLOWED_EVENTS.has(event_name)) {
    return res.status(400).json({ ok: false, error: "invalid event" });
  }

  try {
    await axios.post(
      "https://api.ajur.app/api/analytics/track",
      {
        event_name,
        platform: "web",
        payload: payload || {},
      },
      {
        timeout: 3000,
        headers: {
          Accept: "application/json",

          // ─── Gate: mark this as a page-originated event ───
          "X-Client-From-Page": "1",
          "X-Client-Platform": "web",

          // ─── Real browser context (Laravel stores these) ───
          ...(clientIp ? { "X-Client-Ip": clientIp } : {}),
          ...(userAgent ? { "X-Client-User-Agent": userAgent } : {}),

          // ─── Referer + page URL ───
          ...(referer ? { "X-Client-Referer": referer } : {}),
          ...(pageUrl ? { "X-Client-Page-Url": pageUrl } : {}),

          // ─── Identity (body OR cookie, whichever is present) ───
          ...(anonymousId
            ? { "X-Client-Anonymous-Id": anonymousId }
            : {}),
          ...(sessionId
            ? { "X-Client-Session-Id": sessionId }
            : {}),

          // ─── Source marker so we can distinguish SSR vs client hits ───
          "X-Client-Source": "client-event",
        },
      }
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.warn("[track-event] failed:", err?.message || err);
    // Always return 200 — analytics must not block the client.
    return res.status(200).json({ ok: false });
  }
}