import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css"; // carrega primeiro: normaliza comportamento antes dos estilos
import "./index.css";
import App from "./App.jsx";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";
import LoadingWrapper from "./components/LoadingWrapper.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>
      <LoadingWrapper>
        <App />
      </LoadingWrapper>
    </LoadingProvider>
  </StrictMode>
);
