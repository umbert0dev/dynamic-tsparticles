import type { WritableSignal } from "@angular/core";
import type { ParticleControlRefs } from "../repo-shared/DynamicSpeedMover";

/** Wire Angular `WritableSignal` values into {@link ParticleControlRefs}. */
export function createAngularParticleControlRefs(
  speed: WritableSignal<number>,
  isPlaying: WritableSignal<boolean>,
  links: WritableSignal<boolean>
): ParticleControlRefs {
  return {
    getSpeed: () => speed(),
    getIsPlaying: () => isPlaying(),
    getLinks: () => links(),
  };
}
