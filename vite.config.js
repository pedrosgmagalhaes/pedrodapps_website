import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8085,
    host: "0.0.0.0", // Permite acesso externo
    strictPort: false, // Usa próxima porta disponível se a atual estiver ocupada
  },
});
