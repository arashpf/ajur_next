// lib/blockBots.js
//
// Central bot-filtering module.
// Blocks known crawler IP subnets + bot user-agents before events
// ever reach the analytics API.
//
// Usage:
//   import { isBot } from "@/lib/blockBots";
//   const { bot, reason } = isBot(ip, userAgent);

// ─────────────────────────────────────────────────────────────
// 1. Confirmed bad IP subnets (CIDR notation)
//    Add new ranges here as you spot them in your DB/logs.
// ─────────────────────────────────────────────────────────────
export const BLOCKED_IP_RANGES = [
    // ─── Meta / Facebook crawlers ───
    "57.141.0.0/24",     // seen in your logs
    "57.141.1.0/24",
    "57.141.2.0/24",
    "57.141.3.0/24",
    "66.220.149.0/24",
    "69.63.184.0/24",
    "69.171.224.0/19",
    "173.252.64.0/18",
    "31.13.24.0/21",
    "31.13.64.0/18",
  
    // ─── Ahrefs SEO bot ───
    "51.89.83.0/24",     // seen in your logs
    "51.89.128.0/18",
    "54.36.148.0/24",
    "54.36.149.0/24",
  
    // ─── Semrush ───
    "46.229.168.0/24",
    "138.201.0.0/16",
  
    // ─── MJ12bot (Majestic) ───
    "85.93.0.0/16",
  
    // ─── PetalBot (Huawei) ───
    "114.119.128.0/18",
  
    // ─── Bytespider (ByteDance / TikTok) ───
    "110.249.201.0/24",
    "111.225.148.0/24",
  ];
  
  // ─────────────────────────────────────────────────────────────
  // 2. Bot user-agent regex patterns
  //    Case-insensitive. Covers the long tail of crawlers.
  // ─────────────────────────────────────────────────────────────
  export const BOT_UA_PATTERNS = [
    // Generic
    /bot\b/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /scraping/i,
  
    // Search engine crawlers
    /googlebot/i,
    /bingbot/i,
    /yandex/i,
    /baiduspider/i,
    /duckduckbot/i,
    /slurp/i,            // Yahoo
    /sogou/i,
    /exabot/i,
  
    // Social / preview bots
    /facebookexternalhit/i,
    /facebookcatalog/i,
    /facebot/i,
    /twitterbot/i,
    /linkedinbot/i,
    /whatsapp/i,
    /telegrambot/i,
    /discordbot/i,
    /slackbot/i,
    /pinterest/i,
    /embedly/i,
    /quora link preview/i,
    /outbrain/i,
    /vkshare/i,
    /skypeuripreview/i,
  
    // SEO tools
    /ahrefs/i,
    /semrush/i,
    /mj12bot/i,
    /dotbot/i,
    /petalbot/i,
    /bytespider/i,
    /screaming frog/i,
    /seznam/i,
  
    // Headless / automation
    /headlesschrome/i,
    /phantomjs/i,
    /puppeteer/i,
    /playwright/i,
    /selenium/i,
  
    // Scripts / CLI
    /python-requests/i,
    /python-urllib/i,
    /aiohttp/i,
    /httpx/i,
    /curl\//i,
    /wget/i,
    /go-http-client/i,
    /java\//i,           // java/<version> default UA
    /okhttp/i,
    /axios\//i,
    /node-fetch/i,
    /undici/i,
  
    // Misc
    /archive\.org_bot/i,
    /ia_archiver/i,
    /uptimerobot/i,
    /pingdom/i,
    /statuscake/i,
    /site24x7/i,
    /newrelicpinger/i,
  ];
  
  // ─────────────────────────────────────────────────────────────
  // 3. Helpers
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Convert an IPv4 string to a 32-bit integer.
   */
  function ipToLong(ip) {
    return (
      ip
        .split(".")
        .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
    );
  }
  
  /**
   * Check whether an IPv4 address falls inside a CIDR range.
   * Returns false for IPv6 or malformed input (we don't handle IPv6 yet).
   */
  function isIpInRange(ip, cidr) {
    if (!ip || typeof ip !== "string" || !ip.includes(".")) return false;
    try {
      const [range, bits] = cidr.split("/");
      const mask = ~(2 ** (32 - parseInt(bits, 10)) - 1) >>> 0;
      return (ipToLong(ip) & mask) === (ipToLong(range) & mask);
    } catch {
      return false;
    }
  }
  
  // ─────────────────────────────────────────────────────────────
  // 4. Main filter
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Determine whether a request is from a known bot.
   *
   * @param {string|null} ip        - Client IP address (IPv4)
   * @param {string}      userAgent - User-Agent header value
   * @returns {{ bot: boolean, reason?: string }}
   */
  export function isBot(ip, userAgent = "") {
    // 1. IP subnet check (fastest, most reliable)
    if (ip) {
      for (const range of BLOCKED_IP_RANGES) {
        if (isIpInRange(ip, range)) {
          return { bot: true, reason: `ip:${range}` };
        }
      }
    }
  
    // 2. User-Agent pattern check
    if (userAgent) {
      for (const pattern of BOT_UA_PATTERNS) {
        if (pattern.test(userAgent)) {
          return { bot: true, reason: `ua:${pattern}` };
        }
      }
    }
  
    return { bot: false };
  }
  
  /**
   * Extract the client IP from a Next.js API request.
   * Prefers proxy headers (Vercel, Cloudflare, Arvan) over the raw socket.
   *
   * @param {import('next').NextApiRequest} req
   * @returns {string|null}
   */
  export function getClientIp(req) {
    const xff = req.headers["x-forwarded-for"];
    if (typeof xff === "string" && xff.length) {
      return xff.split(",")[0].trim();
    }
    if (req.headers["x-real-ip"]) return req.headers["x-real-ip"];
    if (req.headers["cf-connecting-ip"]) return req.headers["cf-connecting-ip"];
    if (req.headers["ar-real-ip"]) return req.headers["ar-real-ip"];
    return req.socket?.remoteAddress || null;
  }