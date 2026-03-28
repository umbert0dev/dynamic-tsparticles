import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dts from "vite-plugin-dts";

const pkgDir = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = resolve(pkgDir, "../..");

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: [
        `${repoRoot}/src/react/**/*.ts`,
        `${repoRoot}/src/react/**/*.tsx`,
        `${repoRoot}/src/shared/**/*.ts`,
      ],
      rollupTypes: true,
    }),
  ],
  build: {
    outDir: resolve(pkgDir, "dist"),
    emptyOutDir: true,
    lib: {
      entry: resolve(repoRoot, "src/react/index.ts"),
      name: "DynamicTsParticlesReact",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "tsparticles",
        "@tsparticles/engine",
      ],
      output: {
        exports: "named",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          tsparticles: "tsParticles",
          "@tsparticles/engine": "tsParticlesEngine",
        },
      },
    },
  },
});
