import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ["process"],
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["api.blendeo.shop"],
    proxy: {
      "/api": {
        target: " https://api.blendeo.shop",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  define: {
    global: "window",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      util: path.resolve(__dirname, "node_modules/util"),
      events: path.resolve(__dirname, "node_modules/events"),
    },
  },
});
