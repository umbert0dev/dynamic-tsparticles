import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ["src/vue3/**/*.ts", "src/vue3/**/*.vue", "src/shared/**/*.ts"],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/vue3/index.ts"),
      name: "DynamicTsParticlesVue3",
      fileName: "vue3",
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
