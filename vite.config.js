import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import resolve from "@rollup/plugin-node-resolve";
import tsconfigPaths from "vite-tsconfig-paths";
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    {
      ...resolve({
        preferBuiltins: false,
        browser: true,
      }),
      enforce: "pre",
      apply: "build",
    },
  ],
  server: {
    host: "0.0.0.0",
    port: 3003,
  },

  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },
});
