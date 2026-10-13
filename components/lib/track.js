export function trackEvent(eventName, payload = {}) {
    if (typeof window === "undefined") return;
  
    try {
      const body = JSON.stringify({ event_name: eventName, payload });
  
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon("/api/track-event", blob)) return;
      }
  
      fetch("/api/track-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }