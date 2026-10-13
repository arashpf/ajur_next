// lib/track.js
//
// Client-side event tracking.
// Enriches every event with anonymous_id, session_id, and attribution data
// (UTM / referrer code) before sending to the Next.js API proxy.

import { getAnonymousId, getSessionId } from "./identity";
import { getAttribution } from "./utm";

export function trackEvent(eventName, payload = {}, clientIp = null) {
  if (typeof window === "undefined") return;

  try {
    // ─── DEBUG: attribution check ───
    const attribution = getAttribution();
    const rawCookie = (typeof document !== "undefined")
      ? document.cookie.split("; ").find((c) => c.startsWith("ajur_attribution="))
      : null;

    console.log("🔍 [track-event DEBUG]", {
      eventName,
      rawCookieValue: rawCookie || "❌ NOT FOUND",
      attributionParsed: attribution,
      hasAttribution: !!attribution,
    });
    // ─── END DEBUG ───

    // Enrich payload with attribution
    const enrichedPayload = {
      ...payload,
      ...(attribution ? { attribution } : {}),
    };

    // ─── DEBUG: final payload ───
    console.log("🔍 [track-event] final payload:", enrichedPayload);
    // ─── END DEBUG ───

    const body = JSON.stringify({
      event_name: eventName,
      payload: enrichedPayload,
      client_ip: clientIp || null,
      anonymous_id: getAnonymousId(),
      session_id: getSessionId(),
      page_url: window.location.href,
      referer: document.referrer || null,
    });

    // Prefer sendBeacon (survives page unload)
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/track-event", blob)) return;
    }

    // Fallback to fetch
    fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch (err) {
    // ─── DEBUG: error ───
    console.error("🔍 [track-event] ERROR:", err);
    // ─── END DEBUG ───
  }
}