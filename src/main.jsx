import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css"; // carrega primeiro: normaliza comportamento antes dos estilos
import "./index.css";
import App from "./App.jsx";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";
import LoadingWrapper from "./components/LoadingWrapper.jsx";
import { BrowserRouter } from "react-router-dom";

import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

// Silenciar logs em produção (mantém console.error)
if (import.meta?.env?.PROD && typeof console !== "undefined") {
  const noop = () => {};
  try {
    console.log = noop;
    console.info = noop;
    console.warn = noop;
    console.debug = noop;
  } catch (e) {
    void e; // evita bloco vazio e mantém lint satisfeito
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <LoadingProvider>
        <LoadingWrapper>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LoadingWrapper>
      </LoadingProvider>
    </I18nextProvider>
  </StrictMode>
);
