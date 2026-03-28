/**
 * Vue 3 adapter — import da `dynamic-tsparticles/vue3`.
 * (Futuri: `dynamic-tsparticles/react`, `dynamic-tsparticles/angular`, …)
 */
export { default as DynamicSpeedMover } from "./DynamicSpeedMover";
export { AudioAnalyzer, buildDefaultParticleOptions } from "../shared";
export {
  createDynamicParticlesState,
  type CreateDynamicParticlesStateOptions,
  type DynamicParticlesState,
} from "./createDynamicParticlesState";
export {
  installVueDynamicParticles,
  VueDynamicParticlesPlugin,
  type InstallVueDynamicParticlesOptions,
} from "./install";
export { default as DynamicParticles } from "./DynamicParticles.vue";
