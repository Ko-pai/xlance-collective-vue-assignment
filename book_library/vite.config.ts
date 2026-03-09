import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import VueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools({
      // Explicitly point to the Trae binary
      launchEditor:
        "C:\\Users\\USER\\AppData\\Local\\Programs\\Trae\\bin\\trae.cmd",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
