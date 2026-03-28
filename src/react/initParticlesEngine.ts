import type { Engine } from "@tsparticles/engine";
import { tsParticles } from "@tsparticles/engine";

/** Same contract as `@tsparticles/react` — runs your `loadFull` / `addMover` setup on the shared engine singleton. */
export async function initParticlesEngine(
  cb: (engine: Engine) => Promise<void>
): Promise<void> {
  await cb(tsParticles);
}
