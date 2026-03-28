import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const packageRoot = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ["dynamic-tsparticles/vue3"],
  },
  server: {
    fs: {
      allow: [packageRoot],
    },
  },
});
