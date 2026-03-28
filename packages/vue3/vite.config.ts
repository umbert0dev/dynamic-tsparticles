import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dts from "vite-plugin-dts";

const pkgDir = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = resolve(pkgDir, "../..");

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: [
        `${repoRoot}/src/vue3/**/*.ts`,
        `${repoRoot}/src/vue3/**/*.vue`,
        `${repoRoot}/src/shared/**/*.ts`,
      ],
      rollupTypes: true,
    }),
  ],
  build: {
    outDir: resolve(pkgDir, "dist"),
    emptyOutDir: true,
    lib: {
      entry: resolve(repoRoot, "src/vue3/index.ts"),
      name: "DynamicTsParticlesVue3",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vue", "@tsparticles/vue3", "tsparticles", "@tsparticles/engine"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          tsparticles: "tsParticles",
          "@tsparticles/vue3": "VueParticles",
          "@tsparticles/engine": "tsParticlesEngine",
        },
      },
    },
  },
});
