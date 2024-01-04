import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte()
  ],
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext"
    },
    exclude: [
      "three"
    ]
  },
  esbuild: {
    supported: {
      "top-level-await": true
    },
    dropLabels: ["DEV"]
  },
  worker: {
    format: "es"
  }
});