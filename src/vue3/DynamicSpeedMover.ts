import type { IParticleMover, Particle, IDelta } from "@tsparticles/engine";
import type { Ref } from "vue";

/**
 * Custom tsParticles mover: reads speed / link / random move from Vue refs (slider, audio, toggles).
 */
export default class DynamicSpeedMover implements IParticleMover {
  private readonly speedRef: Ref<number>;
  private readonly isPlaying: Ref<boolean>;
  private readonly links: Ref<boolean>;

  constructor(speedRef: Ref<number>, isPlaying: Ref<boolean>, particlesLink: Ref<boolean>) {
    this.speedRef = speedRef;
    this.isPlaying = isPlaying;
    this.links = particlesLink;
  }

  init(_particle: Particle): void {}

  isEnabled(particle: Particle): boolean {
    return !particle.destroyed && particle.options.move.enable;
  }

  move(particle: Particle, _delta: IDelta): void {
    if (!particle.options.move.enable) return;
    const pxRatio = particle.container.retina.pixelRatio;
    const newSpeed = this.speedRef.value * pxRatio;
    const opts = particle.options as unknown as { links?: { enable: boolean } };
    if (opts.links) {
      opts.links.enable = this.links.value;
    }
    particle.options.move.random = this.isPlaying.value;
    particle.retina.moveSpeed = newSpeed;
  }
}
