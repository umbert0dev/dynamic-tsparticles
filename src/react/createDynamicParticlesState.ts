import { useCallback, useMemo, useRef, type MutableRefObject } from "react";
import { loadFull } from "tsparticles";
import type { Engine } from "@tsparticles/engine";
import {
  DynamicSpeedMover,
  DYNAMIC_SPEED_MOVER_ID,
} from "../shared/DynamicSpeedMover";
import { createReactParticleControlRefs } from "./refs";

export interface CreateDynamicParticlesStateOptions {
  /** Initial move speed (same scale as tsParticles move.speed). @default 2 */
  initialSpeed?: number;
  /** Whether audio-driven mode toggles move.random @default false */
  initialPlaying?: boolean;
  /** Link lines between particles @default true */
  initialParticlesLink?: boolean;
}

export interface DynamicParticlesState {
  speedRef: MutableRefObject<number>;
  isPlayingRef: MutableRefObject<boolean>;
  particlesLinkRef: MutableRefObject<boolean>;
  /** Pass to `initParticlesEngine` from `dynamic-tsparticles-react`. */
  initTsParticles: (engine: Engine) => Promise<void>;
}

/**
 * One-off state (e.g. `useMemo(() => createDynamicParticlesState(), [])`).
 * Do not call on every render without memoization.
 */
export function createDynamicParticlesState(
  options: CreateDynamicParticlesStateOptions = {}
): DynamicParticlesState {
  const speedRef: MutableRefObject<number> = {
    current: options.initialSpeed ?? 2,
  };
  const isPlayingRef: MutableRefObject<boolean> = {
    current: options.initialPlaying ?? false,
  };
  const particlesLinkRef: MutableRefObject<boolean> = {
    current: options.initialParticlesLink ?? true,
  };
  const controlRefs = createReactParticleControlRefs(
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

/**
 * Hook-friendly state: stable refs and init callback for `initParticlesEngine`.
 */
export function useDynamicParticlesState(
  options: CreateDynamicParticlesStateOptions = {}
): DynamicParticlesState {
  const speedRef = useRef(options.initialSpeed ?? 2);
  const isPlayingRef = useRef(options.initialPlaying ?? false);
  const particlesLinkRef = useRef(options.initialParticlesLink ?? true);
  const controlRefs = useMemo(
    () =>
      createReactParticleControlRefs(speedRef, isPlayingRef, particlesLinkRef),
    []
  );
  const initTsParticles = useCallback(
    async (engine: Engine): Promise<void> => {
      await loadFull(engine);
      await engine.addMover(
        DYNAMIC_SPEED_MOVER_ID,
        () => Promise.resolve(new DynamicSpeedMover(controlRefs)),
        true
      );
    },
    [controlRefs]
  );
  return {
    speedRef,
    isPlayingRef,
    particlesLinkRef,
    initTsParticles,
  };
}
