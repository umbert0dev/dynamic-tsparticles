/**
 * Vue 3 adapter — npm package `dynamic-tsparticles-vue3`.
 */
export {
  DynamicSpeedMover,
  DYNAMIC_SPEED_MOVER_ID,
  type ParticleControlRefs,
} from "../shared/DynamicSpeedMover";
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
