import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8085,
    proxy: {
      "/config-api": {
        target: "http://123.176.35.22:8081",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/config-api/, ""),
      },
      "/admin-api": {
        target: "http://123.176.35.22:8082",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin-api/, ""),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
