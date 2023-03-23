import { crx } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import manifest from "./manifest.json";
import stdLibBrowser from "node-stdlib-browser";
import inject from "@rollup/plugin-inject";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
  plugins: [
    {
      ...inject({
        global: ["node-stdlib-browser/helpers/esbuild/shim", "global"],
        process: ["node-stdlib-browser/helpers/esbuild/shim", "process"],
        Buffer: ["node-stdlib-browser/helpers/esbuild/shim", "Buffer"],
      }),
      enforce: "post",
    },
    svelte(),
    crx({ manifest }),
  ],
  resolve: {
    alias: stdLibBrowser,
  },
  optimizeDeps: {
    include: ["buffer", "process"],
  },
});
