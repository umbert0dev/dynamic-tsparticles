import type { App, Plugin } from "vue";
import Particles from "@tsparticles/vue3";
import DynamicParticles from "./DynamicParticles.vue";
import {
  createDynamicParticlesState,
  type CreateDynamicParticlesStateOptions,
  type DynamicParticlesState,
} from "./createDynamicParticlesState";

export interface InstallVueDynamicParticlesOptions {
  /** Pre-built state (e.g. shared across files). If omitted, a new state is created. */
  state?: DynamicParticlesState;
  /** Used only when `state` is omitted. */
  createStateOptions?: CreateDynamicParticlesStateOptions;
  /** Global component name @default 'DynamicParticles' */
  componentName?: string;
}

/**
 * Registers `@tsparticles/vue3` with the DynamicSpeedMover init and the `DynamicParticles` component.
 * Returns the reactive state refs for wiring sliders, audio, etc.
 */
export function installVueDynamicParticles(
  app: App,
  options: InstallVueDynamicParticlesOptions = {}
): DynamicParticlesState {
  const state = options.state ?? createDynamicParticlesState(options.createStateOptions ?? {});
  app.use(Particles, { init: state.initTsParticles });
  app.component(options.componentName ?? "DynamicParticles", DynamicParticles);
  return state;
}

/** Vue plugin: `app.use(VueDynamicParticlesPlugin, { ... })` */
export const VueDynamicParticlesPlugin: Plugin = {
  install(app, options?: InstallVueDynamicParticlesOptions) {
    installVueDynamicParticles(app, options ?? {});
  },
};
