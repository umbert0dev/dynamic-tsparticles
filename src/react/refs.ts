import type { ParticleControlRefs } from "../shared/DynamicSpeedMover";

/** Wire React `MutableRefObject` / `useRef` into {@link ParticleControlRefs}. */
export function createReactParticleControlRefs(
  speedRef: { current: number },
  isPlayingRef: { current: boolean },
  linksRef: { current: boolean }
): ParticleControlRefs {
  return {
    getSpeed: () => speedRef.current,
    getIsPlaying: () => isPlayingRef.current,
    getLinks: () => linksRef.current,
  };
}
