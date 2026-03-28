import { ref, type Ref } from "vue";
import { loadFull } from "tsparticles";
import type { Engine } from "@tsparticles/engine";
import {
  DynamicSpeedMover,
  DYNAMIC_SPEED_MOVER_ID,
  type ParticleControlRefs,
} from "../shared/DynamicSpeedMover";

export interface CreateDynamicParticlesStateOptions {
  /** Initial move speed (same scale as tsParticles move.speed). @default 2 */
  initialSpeed?: number;
  /** Whether audio-driven mode toggles move.random @default false */
  initialPlaying?: boolean;
  /** Link lines between particles @default true */
  initialParticlesLink?: boolean;
}

export interface DynamicParticlesState {
  speedRef: Ref<number>;
  isPlayingRef: Ref<boolean>;
  particlesLinkRef: Ref<boolean>;
  /**
   * Pass to `app.use(Particles, { init: state.initTsParticles })` from `@tsparticles/vue3`.
   */
  initTsParticles: (engine: Engine) => Promise<void>;
}

function createVueParticleControlRefs(
  speedRef: Ref<number>,
  isPlayingRef: Ref<boolean>,
  linksRef: Ref<boolean>
): ParticleControlRefs {
  return {
    getSpeed: () => speedRef.value,
    getIsPlaying: () => isPlayingRef.value,
    getLinks: () => linksRef.value,
  };
}

export function createDynamicParticlesState(
  options: CreateDynamicParticlesStateOptions = {}
): DynamicParticlesState {
  const speedRef = ref(options.initialSpeed ?? 2);
  const isPlayingRef = ref(options.initialPlaying ?? false);
  const particlesLinkRef = ref(options.initialParticlesLink ?? true);

  const controlRefs = createVueParticleControlRefs(
    speedRef,
    isPlayingRef,
    particlesLinkRef
  );

  const initTsParticles = async (engine: Engine): Promise<void> => {
    await loadFull(engine);
    await engine.addMover(
      DYNAMIC_SPEED_MOVER_ID,
      () => Promise.resolve(new DynamicSpeedMover(controlRefs)),
      true
    );
  };

  return {
    speedRef,
    isPlayingRef,
    particlesLinkRef,
    initTsParticles,
  };
}
