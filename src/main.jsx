import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css"; // carrega primeiro: normaliza comportamento antes dos estilos
import "./index.css";
import App from "./App.jsx";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";
import LoadingWrapper from "./components/LoadingWrapper.jsx";
import { BrowserRouter } from "react-router-dom";

// Diagnóstico: verificar se import.meta.env está disponível no ambiente atual
if (typeof console !== "undefined" && console.log) {
  try {
    console.log("[main] MODE:", import.meta?.env?.MODE, "DEV:", import.meta?.env?.DEV, "PROD:", import.meta?.env?.PROD);
    console.log("[main] VITE_GOOGLE_CLIENT_ID:", import.meta?.env?.VITE_GOOGLE_CLIENT_ID || "(não definido)");
  } catch {
    console.log("[main] import.meta.env inacessível no contexto atual");
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>
      <LoadingWrapper>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LoadingWrapper>
    </LoadingProvider>
  </StrictMode>
);
