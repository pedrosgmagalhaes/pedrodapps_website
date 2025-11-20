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