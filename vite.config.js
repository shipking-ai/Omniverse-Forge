import { defineConfig } from "vite";
export default defineConfig({
  server: { host: "0.0.0.0", allowedHosts: [".e2b.app"], port: 5173 },
  preview: { host: "0.0.0.0", allowedHosts: [".e2b.app"], port: 4173 },
  build: { target: "es2022" },
});
