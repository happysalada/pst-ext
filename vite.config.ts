import { crx } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import manifest from "./manifest.json";
import stdLibBrowser from "node-stdlib-browser";
import inject from "@rollup/plugin-inject";

export default defineConfig({
  resolve: {
		alias: stdLibBrowser,
	},
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
  optimizeDeps: {
    include: ["buffer", "process"],
  },
});
