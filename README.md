# dynamic-tsparticles

Single npm monorepo: **one subpath per framework**

| Import | Status |
|--------|--------|
| **`dynamic-tsparticles/vue3`** | Vue 3 + [tsParticles](https://particles.js.org/), dynamic mover, `AudioAnalyzer` |
| `dynamic-tsparticles/react` | *planned* |
| `dynamic-tsparticles/angular` | *planned* |

Source layout: `src/shared/` (reusable logic), `src/vue3/` (adapter). Build outputs only `dist/vue3.js`, `dist/vue3.cjs`, `dist/vue3.d.ts` — no root entry `import "dynamic-tsparticles"` (always use `/vue3`). The `main` / `module` / `types` fields in `package.json` point at `vue3` for legacy tooling.

**Examples** (repo only; not in `npm pack` — `package.json` `files` is `dist` + `README.md`): see `examples/README.md`. From repo root: `npm run example:vue3` (build library + run the minimal Vite demo).

## Installing in another project (after publish)

In a **Vue 3** app (e.g. Vite):

```bash
npm install dynamic-tsparticles
```

With **npm 7+**, **peer dependencies** declared in the package (`vue`, `@tsparticles/vue3`, `tsparticles`, `@tsparticles/engine`) are installed automatically if missing from the project. If you use **yarn** or **pnpm**, check the output: you may need to add peers manually; in that case:

```bash
npm install dynamic-tsparticles vue @tsparticles/vue3 tsparticles @tsparticles/engine
```

### Minimal `main.js` (or `main.ts`)

```js
import { createApp } from "vue";
import Particles from "@tsparticles/vue3";
import { createDynamicParticlesState, DynamicParticles } from "dynamic-tsparticles/vue3";
import App from "./App.vue";

const app = createApp(App);
const state = createDynamicParticlesState({ initialSpeed: 2 });

app.component("DynamicParticles", DynamicParticles);
app.use(Particles, { init: state.initTsParticles });
app.mount("#app");
```

In the template: `:speed-ref="state.speedRef"`, `:is-playing-ref="state.isPlayingRef"`, `:particles-link-ref="state.particlesLinkRef"`, `:shape`, optional `:options`.

## Plug & play (one call)

```js
import { createApp } from "vue";
import { installVueDynamicParticles } from "dynamic-tsparticles/vue3";
import App from "./App.vue";

const app = createApp(App);
const particles = installVueDynamicParticles(app, {
  createStateOptions: {
    initialSpeed: 2,
    initialPlaying: false,
    initialParticlesLink: true,
  },
});
app.provide("particles", particles);
app.mount("#app");
```

### Template

```vue
<template>
  <div class="particles-background">
    <DynamicParticles
      :speed-ref="particles.speedRef"
      :is-playing-ref="particles.isPlayingRef"
      :particles-link-ref="particles.particlesLinkRef"
      :shape="shape"
      :options="particleOverrides"
    />
  </div>
</template>

<script setup>
import { ref, inject } from "vue";

const particles = inject("particles");
const shape = ref("triangle");
const particleOverrides = ref({
  particles: { color: { value: "#00a85c" } },
});
</script>

<style scoped>
.particles-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
```

## Overriding defaults (`options` prop)

`DynamicParticles` accepts **`options`**: a partial tsParticles object **deep-merged** over `buildDefaultParticleOptions(speed, link)`.  
Typical pattern in your app:

```js
// particles.config.js
export default {
  particles: {
    color: { value: "#00e436" },
    number: { value: 100 },
  },
};
```

```vue
<DynamicParticles … :options="particlesConfig" />
```

`particles.move.speed` and `particles.links.enable` are still driven by the custom mover / refs (slider, audio, settings).

## Manual setup (already using `@tsparticles/vue3`)

```js
import Particles from "@tsparticles/vue3";
import { createDynamicParticlesState } from "dynamic-tsparticles/vue3";

const state = createDynamicParticlesState({ initialSpeed: 2 });
app.use(Particles, { init: state.initTsParticles });
```

## Audio-reactive speed

Use `AudioAnalyzer`: `init(audioElement)`, on play `setInterval(() => { state.speedRef.value = analyzer.getNewAudioSpeed(state.speedRef.value) })`, `clearInterval()` on pause.

## API

| Export | Role |
|--------|------|
| `createDynamicParticlesState()` | Refs + `initTsParticles` for `app.use(Particles, { init })` |
| `installVueDynamicParticles(app, opts?)` | Registers Particles + `DynamicParticles` |
| `VueDynamicParticlesPlugin` | `app.use()` variant |
| `DynamicParticles` | SFC |
| `buildDefaultParticleOptions()` | Default tsParticles config + deep-merge |
| `DynamicSpeedMover` | Advanced |
| `AudioAnalyzer` | Optional Web Audio helper |

## License

MIT
