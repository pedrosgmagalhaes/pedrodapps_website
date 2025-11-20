// Pequeno utilitário de analytics
// Prioriza dataLayer (Google Tag Manager) se presente, senão tenta gtag; fallback para console.

export function trackEvent(event, payload = {}) {
  const data = { event, ...payload, ts: Date.now() };

  try {
    if (typeof window !== "undefined") {
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(data);
        return true;
      }
      if (typeof window.gtag === "function") {
        window.gtag("event", event, payload);
        return true;
      }
      // Fallback para depuração (apenas em desenvolvimento)
      if (import.meta?.env?.DEV) {
        console.debug("[analytics]", data);
      }
      return false;
    }
  } catch (err) {
    if (import.meta?.env?.DEV) {
      console.warn("[analytics] erro ao enviar evento", err);
    }
  }
  return false;
}

export function trackPageView(page, extra = {}) {
  return trackEvent("page_view", { page, ...extra });
}
