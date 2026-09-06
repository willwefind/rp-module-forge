import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

// Multi-page build: `/` is 天道降维互助论坛, `/forge/` is the RP Module Forge
// workshop. Both are static pages, so a refresh on either path resolves to a
// real index.html on GitHub Pages without any SPA fallback.
export default defineConfig({
  appType: "mpa",
  build: {
    rollupOptions: {
      input: {
        forum: fileURLToPath(new URL("./index.html", import.meta.url)),
        forge: fileURLToPath(new URL("./forge/index.html", import.meta.url))
      }
    }
  }
});
