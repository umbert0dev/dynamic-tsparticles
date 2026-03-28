import Particles from "@tsparticles/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MutableRefObject } from "react";
import type { Container } from "@tsparticles/engine";
import { buildDefaultParticleOptions } from "../shared/defaultOptions";

export interface DynamicParticlesProps {
  speedRef: MutableRefObject<number>;
  isPlayingRef: MutableRefObject<boolean>;
  particlesLinkRef: MutableRefObject<boolean>;
  shape?: string;
  options?: Record<string, unknown>;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * React counterpart of the Vue `DynamicParticles` SFC: `Particles` from `@tsparticles/react` with the same default options + shape / overrides wiring.
 */
export function DynamicParticles({
  speedRef,
  isPlayingRef,
  particlesLinkRef,
  shape = "triangle",
  options,
  id = "dynamic-tsparticles",
  className,
  style,
}: DynamicParticlesProps) {
  const containerRef = useRef<Container | null>(null);
  const [particleOptions, setParticleOptions] = useState(() =>
    buildDefaultParticleOptions(
      speedRef.current,
      particlesLinkRef.current,
      options
    )
  );

  useEffect(() => {
    setParticleOptions(
      buildDefaultParticleOptions(
        speedRef.current,
        particlesLinkRef.current,
        options
      )
    );
  }, [options, speedRef, particlesLinkRef]);

  const onParticlesLoaded = useCallback(
    async (container?: Container) => {
      containerRef.current = container ?? null;
      const c = container ?? null;
      if (c?.options?.particles?.shape) {
        c.options.particles.shape.type = shape;
        c.refresh();
      }
    },
    [shape]
  );

  useEffect(() => {
    const c = containerRef.current;
    if (!c?.options?.particles?.shape) return;
    c.options.particles.shape.type = shape;
    c.refresh();
  }, [shape]);

  const wrapperClass = className ?? "dynamic-tsparticles-bg";

  return (
    <div
      className={wrapperClass}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <Particles
        id={id}
        options={particleOptions}
        particlesLoaded={onParticlesLoaded}
      />
    </div>
  );
}
