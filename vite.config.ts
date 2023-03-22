import { crx } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import manifest from "./manifest.json";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
  plugins: [svelte(), crx({ manifest })],
  resolve: {
    alias: {
      process: "rollup-plugin-node-polyfills/polyfills/process-es6",
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
});
