import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "stats.html", // File where the visualization will be generated
      open: true, // Automatically opens the visualization in your default browser
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
