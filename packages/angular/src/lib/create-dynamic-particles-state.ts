import { signal, type WritableSignal } from "@angular/core";
import { loadFull } from "tsparticles";
import type { Engine } from "@tsparticles/engine";
import {
  DynamicSpeedMover,
  DYNAMIC_SPEED_MOVER_ID,
} from "../repo-shared/DynamicSpeedMover";
import { createAngularParticleControlRefs } from "./refs";

export interface CreateDynamicParticlesStateOptions {
  /** Initial move speed (same scale as tsParticles move.speed). @default 2 */
  initialSpeed?: number;
  /** Whether audio-driven mode toggles move.random @default false */
  initialPlaying?: boolean;
  /** Link lines between particles @default true */
  initialParticlesLink?: boolean;
}

export interface DynamicParticlesState {
  speed: WritableSignal<number>;
  isPlaying: WritableSignal<boolean>;
  particlesLink: WritableSignal<boolean>;
  /** Pass to `NgParticlesService.init()` from `@tsparticles/angular` (once per app). */
  initTsParticles: (engine: Engine) => Promise<void>;
}

export function createDynamicParticlesState(
  options: CreateDynamicParticlesStateOptions = {}
): DynamicParticlesState {
  const speed = signal(options.initialSpeed ?? 2);
  const isPlaying = signal(options.initialPlaying ?? false);
  const particlesLink = signal(options.initialParticlesLink ?? true);
  const refs = createAngularParticleControlRefs(speed, isPlaying, particlesLink);
  const initTsParticles = async (engine: Engine): Promise<void> => {
    await loadFull(engine);
    await engine.addMover(
      DYNAMIC_SPEED_MOVER_ID,
      () => Promise.resolve(new DynamicSpeedMover(refs)),
      true
    );
  };
  return { speed, isPlaying, particlesLink, initTsParticles };
}
