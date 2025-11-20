/* eslint-env node */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: 8085,
      host: "0.0.0.0", // Permite acesso externo
      strictPort: false, // Usa próxima porta disponível se a atual estiver ocupada
    },
    // Fallback seguro para env em clientes onde import.meta.env não esteja disponível
    define: {
      __APP_VITE_GOOGLE_CLIENT_ID__: JSON.stringify(env.VITE_GOOGLE_CLIENT_ID || ""),
    },
  };
});
