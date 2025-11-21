import { API } from "./api";

function genUUID() {
  try {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    // RFC4122 v4
    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;
    const hex = Array.from(buf).map((b) => b.toString(16).padStart(2, "0"));
    return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
  } catch {
    return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

function getSessionId() {
  try {
    const key = "checkout_session_id";
    let sid = localStorage.getItem(key);
    if (!sid) {
      sid = genUUID();
      localStorage.setItem(key, sid);
    }
    return sid;
  } catch {
    return genUUID();
  }
}

function collectUTMFromURL() {
  try {
    const url = new URL(window.location.href);
    const q = url.searchParams;
    const fields = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "origin",
      "ref",
      "gclid",
      "fbclid",
      "lang",
    ];
    const obj = {};
    fields.forEach((f) => {
      const v = q.get(f);
      if (v) obj[f] = v;
    });
    return obj;
  } catch {
    return {};
  }
}

export async function emitCheckoutEvent(payload = {}) {
  const sessionId = payload.sessionId || getSessionId();
  const utm = { ...collectUTMFromURL() };
  const lang = payload.lang || (typeof navigator !== "undefined" ? navigator.language : "pt");
  const base = {
    sessionId,
    lang,
    ...utm,
  };
  try {
    await API.checkout.trackEvent({ ...base, ...payload });
  } catch {
    // silencioso; não interrompe UX
  }
}

export function collectContextParams() {
  try {
    const url = new URL(window.location.href);
    const q = url.searchParams;
    const utmFields = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "origin",
      "ref",
      "gclid",
      "fbclid",
      "lang",
    ];
    const out = {};
    utmFields.forEach((f) => {
      const v = q.get(f);
      if (v) out[f] = v;
    });
    const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const isMobile = /Mobi|Android|iPhone|iPod/i.test(ua);
    const isTablet = /iPad|Tablet/i.test(ua) && !/Mobile/i.test(ua);
    const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";
    let os = "unknown";
    if (/Windows/i.test(ua)) os = "windows";
    else if (/Mac OS X/i.test(ua)) os = "macos";
    else if (/Android/i.test(ua)) os = "android";
    else if (/iPhone|iPad|iPod/i.test(ua)) os = "ios";
    else if (/Linux/i.test(ua)) os = "linux";
    let browser = "unknown";
    if (/Edg\//i.test(ua)) browser = "edge";
    else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = "opera";
    else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = "chrome";
    else if (/Firefox\//i.test(ua)) browser = "firefox";
    else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "safari";
    const viewport_w = typeof window !== "undefined" ? window.innerWidth : null;
    const viewport_h = typeof window !== "undefined" ? window.innerHeight : null;
    const screen_w = typeof window !== "undefined" && window.screen ? window.screen.width : null;
    const screen_h = typeof window !== "undefined" && window.screen ? window.screen.height : null;
    const referrer = typeof document !== "undefined" ? document.referrer || "" : "";
    let entry_url = "";
    try {
      entry_url = localStorage.getItem("entry_url") || "";
    } catch { void 0; }
    return {
      ...out,
      device,
      os,
      browser,
      viewport_w,
      viewport_h,
      screen_w,
      screen_h,
      referrer,
      entry_url,
    };
  } catch {
    return {};
  }
}
