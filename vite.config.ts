import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
	plugins: [
		react(),
		nodePolyfills({
			include: ["buffer", "crypto", "stream", "util"],
			globals: {
				Buffer: true,
				global: true,
				process: true,
			},
		}),
	],
	optimizeDeps: {
		esbuildOptions: {
			target: "esnext",
		},
	},
});