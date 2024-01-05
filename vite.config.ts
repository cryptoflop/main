import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
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
    dropLabels: command == "build" ? ["DEV"] : []
  },
  worker: {
    format: "es"
  }
}));