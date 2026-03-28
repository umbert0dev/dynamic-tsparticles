# dynamic-tsparticles (monorepo)

**Two separate npm packages** so each install only pulls the peer dependencies for that framework (Vue or React).

| npm package | Use in |
|-------------|--------|
| [**`dynamic-tsparticles-vue3`**](https://www.npmjs.com/package/dynamic-tsparticles-vue3) | Vue 3 + [`@tsparticles/vue3`](https://www.npmjs.com/package/@tsparticles/vue3) |
| [**`dynamic-tsparticles-react`**](https://www.npmjs.com/package/dynamic-tsparticles-react) | React 18 + [`@tsparticles/engine`](https://www.npmjs.com/package/@tsparticles/engine) (no `@tsparticles/react` required) |

Each package bundles the shared mover/audio/options code and only lists **that stack’s** peers (`tsparticles`, `@tsparticles/engine`, plus the matching UI framework and tsparticles adapter).

These packages extend the [tsParticles](https://particles.js.org/) ecosystem (successor to classic [**particles.js**](https://github.com/VincentGarreau/particles.js)): custom mover, refs for speed / links / play·random, optional [Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) via `AudioAnalyzer`, same options model as upstream. Upstream: [tsparticles on GitHub](https://github.com/tsparticles/tsparticles).

Source layout: `src/shared/`, `src/vue3/`, `src/react/`. Builds: `packages/vue3/dist`, `packages/react/dist`.

**Examples** (not published): see `examples/README.md`. From repo root: `npm run example:vue3` or `example:react`.

---

## Vue 3 — `dynamic-tsparticles-vue3`

```bash
npm install dynamic-tsparticles-vue3 vue @tsparticles/vue3 tsparticles @tsparticles/engine
```

### Minimal `main.js` (or `main.ts`)

```js
import { createApp } from "vue";
import Particles from "@tsparticles/vue3";
import { createDynamicParticlesState, DynamicParticles } from "dynamic-tsparticles-vue3";
import App from "./App.vue";

const app = createApp(App);
const state = createDynamicParticlesState({ initialSpeed: 2 });

app.component("DynamicParticles", DynamicParticles);
app.use(Particles, { init: state.initTsParticles });
app.mount("#app");
```

In the template: `:speed-ref="state.speedRef"`, `:is-playing-ref="state.isPlayingRef"`, `:particles-link-ref="state.particlesLinkRef"`, `:shape`, optional `:options`.

### Plug & play (one call)

```js
import { createApp } from "vue";
import { installVueDynamicParticles } from "dynamic-tsparticles-vue3";
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

## React — `dynamic-tsparticles-react`

```bash
npm install dynamic-tsparticles-react react react-dom tsparticles @tsparticles/engine
```

```tsx
import { useEffect, useState } from "react";
import {
  initParticlesEngine,
  useDynamicParticlesState,
  DynamicParticles,
} from "dynamic-tsparticles-react";

export function ParticlesScene() {
  const [ready, setReady] = useState(false);
  const state = useDynamicParticlesState({ initialSpeed: 2, initialParticlesLink: true });

  useEffect(() => {
    void initParticlesEngine(state.initTsParticles).then(() => setReady(true));
  }, [state.initTsParticles]);

  if (!ready) return null;

  return (
    <DynamicParticles
      speedRef={state.speedRef}
      isPlayingRef={state.isPlayingRef}
      particlesLinkRef={state.particlesLinkRef}
      shape="triangle"
    />
  );
}
```

You can use **`createDynamicParticlesState()`** inside `useMemo(() => createDynamicParticlesState(), [])` instead of the hook. **`initParticlesEngine`** is provided by this package (same idea as the old `@tsparticles/react` helper: it runs your callback with the shared `tsParticles` engine).

---

## Overriding defaults (`options` prop)

`DynamicParticles` (Vue or React) accepts **`options`**: a partial tsParticles object **deep-merged** over `buildDefaultParticleOptions(speed, link)`.  
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

## Manual setup (Vue, already using `@tsparticles/vue3`)

```js
import Particles from "@tsparticles/vue3";
import { createDynamicParticlesState } from "dynamic-tsparticles-vue3";

const state = createDynamicParticlesState({ initialSpeed: 2 });
app.use(Particles, { init: state.initTsParticles });
```

## Audio-reactive speed

Use `AudioAnalyzer`: `init(audioElement)`, on play `setInterval(() => { state.speedRef.value = analyzer.getNewAudioSpeed(state.speedRef.value) })`, `clearInterval()` on pause. In React, use `state.speedRef.current`.

## API

### `dynamic-tsparticles-vue3`

| Export | Role |
|--------|------|
| `createDynamicParticlesState()` | Refs + `initTsParticles` for `app.use(Particles, { init })` |
| `installVueDynamicParticles(app, opts?)` | Registers Particles + `DynamicParticles` |
| `VueDynamicParticlesPlugin` | `app.use()` variant |
| `DynamicParticles` | SFC |
| `buildDefaultParticleOptions()` | Default tsParticles config + deep-merge |
| `DynamicSpeedMover` | Advanced |
| `DYNAMIC_SPEED_MOVER_ID` | Mover id on the engine |
| `AudioAnalyzer` | Optional Web Audio helper |

### `dynamic-tsparticles-react`

| Export | Role |
|--------|------|
| `useDynamicParticlesState(opts?)` | Hook: refs + `initTsParticles` for `initParticlesEngine` |
| `createDynamicParticlesState(opts?)` | Same shape; use with `useMemo` if not using the hook |
| `initParticlesEngine` | `await cb(tsParticles)` — run `loadFull` / `addMover` once before mounting `DynamicParticles` |
| `DynamicParticles` | Component wrapping `Particles` |
| `createReactParticleControlRefs` | Build `ParticleControlRefs` from three `{ current }` refs |
| Shared exports | `AudioAnalyzer`, `buildDefaultParticleOptions`, `DynamicSpeedMover`, `DYNAMIC_SPEED_MOVER_ID`, `ParticleControlRefs` |

## Develop & publish

```bash
npm install
npm run build
```

Publish **from each package** (version is in `packages/*/package.json`):

```bash
npm publish --access public -w dynamic-tsparticles-vue3
npm publish --access public -w dynamic-tsparticles-react
```

## License

MIT
