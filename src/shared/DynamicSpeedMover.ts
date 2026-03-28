import type { IParticleMover, Particle, IDelta } from "@tsparticles/engine";

export const DYNAMIC_SPEED_MOVER_ID = "DynamicSpeedMover";

/** Mutable inputs read each frame by {@link DynamicSpeedMover} (Vue refs, React refs, or plain `{ current }`). */
export interface ParticleControlRefs {
  getSpeed(): number;
  getIsPlaying(): boolean;
  getLinks(): boolean;
}

/**
 * Custom tsParticles mover: speed, link visibility, and move.random from reactive refs.
 */
export class DynamicSpeedMover implements IParticleMover {
  constructor(private readonly refs: ParticleControlRefs) {}

  init(_particle: Particle): void {}

  isEnabled(particle: Particle): boolean {
    return !particle.destroyed && particle.options.move.enable;
  }

  move(particle: Particle, _delta: IDelta): void {
    if (!particle.options.move.enable) return;
    const pxRatio = particle.container.retina.pixelRatio;
    const newSpeed = this.refs.getSpeed() * pxRatio;
    const opts = particle.options as unknown as { links?: { enable: boolean } };
    if (opts.links) {
      opts.links.enable = this.refs.getLinks();
    }
    particle.options.move.random = this.refs.getIsPlaying();
    particle.retina.moveSpeed = newSpeed;
  }
}
