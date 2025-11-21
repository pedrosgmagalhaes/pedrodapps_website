import React, { useEffect, useRef, useState } from "react";

export default function TurnstileWidget({
  sitekey = import.meta.env.VITE_TURNSTILE_SITEKEY,
  theme = "dark",
  size = "flexible",
  onToken = () => {},
  className = "turnstile__container",
  containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 70,
    width: "100%",
  },
}) {
  const containerRef = useRef(null);
  const [widgetId, setWidgetId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!sitekey) {
      setUnavailable(true);
      return;
    }

    let tries = 0;
    const maxTries = 30; // ~9s em 300ms
    const interval = setInterval(() => {
      tries++;
      if (window.turnstile && containerRef.current && !widgetId) {
        try {
          const id = window.turnstile.render(containerRef.current, {
            sitekey,
            theme,
            size,
            callback: (token) => {
              try {
                onToken(token);
              } catch (e) {
                void e;
              }
            },
            "expired-callback": () => {
              try {
                onToken("");
              } catch (e) {
                void e;
              }
            },
            "error-callback": () => {
              setUnavailable(true);
            },
          });
          setWidgetId(id);
          setLoaded(true);
          clearInterval(interval);
        } catch (e) {
          void e;
        }
      }
      if (tries >= maxTries) {
        clearInterval(interval);
        setUnavailable(true);
      }
    }, 300);

    return () => {
      clearInterval(interval);
      try {
        if (widgetId && window.turnstile?.remove) {
          window.turnstile.remove(widgetId);
        }
      } catch (e) {
        void e;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sitekey, theme, size]);

  return (
    <div ref={containerRef} className={className} aria-live="polite" style={containerStyle}>
      {!loaded && !unavailable && (
        <span className="turnstile__loading" aria-label="Carregando verificação" />
      )}
      {unavailable && (
        <span className="turnstile__unavailable" role="note">
          Verificação indisponível. Tente novamente mais tarde.
        </span>
      )}
    </div>
  );
}
