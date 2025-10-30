import React, { useState, useCallback } from "react";
import { ANIMATIONS, TRANSITIONS } from "../lib/constants";
import pedroDappsLogo from "../assets/pedro_dapps_logo.png";

// Component props TS-like comment for clarity
// isLoading: boolean; logoPath?: string; logoAlt?: string; fallbackText?: string
const LoadingScreen = ({ isLoading, logoPath, logoAlt = "Pedro dApps", fallbackText = "Pedro dApps" }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    console.warn("Erro ao carregar logo do Pedro dApps, usando fallback");
    setImageError(true);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`loading-overlay ${TRANSITIONS?.slow || ""}`}
      aria-live="polite"
      aria-busy={true}
      role="alert"
    >
      <div className="loading-overlay__content">
        {!imageError ? (
          <img
            src={logoPath || pedroDappsLogo}
            alt={logoAlt}
            className={`${ANIMATIONS?.fadeIn || ""} loading-overlay__logo`}
            loading="eager"
            decoding="async"
            onError={handleImageError}
            style={{
              maxWidth: "200px",
              height: "auto",
              display: "block"
            }}
          />
        ) : (
          <div className={`loading-overlay__fallback ${ANIMATIONS?.fadeIn || ""}`}>
            {fallbackText}
          </div>
        )}
        <LoadingDots />
      </div>
    </div>
  );
};

const LoadingDots = () => {
  const dots = [0, 1, 2];
  return (
    <div className="loading-dots">
      {dots.map((index) => (
        <div
          key={index}
          className="loading-dot animate-pulse-slow"
          style={{ animationDelay: `${index * 0.2}s` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default LoadingScreen;
