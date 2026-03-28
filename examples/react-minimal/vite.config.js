import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const packageRoot = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["dynamic-tsparticles-react"],
  },
  server: {
    fs: {
      allow: [packageRoot],
    },
  },
});
