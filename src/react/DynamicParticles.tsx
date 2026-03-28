import { tsParticles } from "@tsparticles/engine";
import type { Container } from "@tsparticles/engine";
import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type MutableRefObject,
} from "react";
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
  /** Called once after the tsParticles container is created for this host. */
  onParticlesLoaded?: (container: Container) => void;
}

/**
 * Hosts tsParticles via `tsParticles.load({ element })` — avoids `@tsparticles/react`'s Particles component,
 * whose effect deps remount the canvas on every parent render.
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
  onParticlesLoaded,
}: DynamicParticlesProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<Container | null>(null);
  const shapeRef = useRef(shape);
  shapeRef.current = shape;

  const onLoadedRef = useRef(onParticlesLoaded);
  onLoadedRef.current = onParticlesLoaded;

  const particleOptions = useMemo(
    () =>
      buildDefaultParticleOptions(
        speedRef.current,
        particlesLinkRef.current,
        options
      ),
    [options, speedRef, particlesLinkRef]
  );

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    let cancelled = false;
    const live = { current: undefined as Container | undefined };

    void (async () => {
      const container = await tsParticles.load({
        id,
        element: el,
        options: particleOptions,
      });
      if (cancelled) {
        container?.destroy();
        return;
      }
      live.current = container ?? undefined;
      containerRef.current = live.current ?? null;
      const c = live.current;
      if (cancelled || !c) return;
      if (c.options?.particles?.shape) {
        c.options.particles.shape.type = shapeRef.current;
        await c.refresh();
      }
      onLoadedRef.current?.(c);
    })();

    return () => {
      cancelled = true;
      live.current?.destroy();
      live.current = undefined;
      containerRef.current = null;
    };
  }, [id, particleOptions]);

  useEffect(() => {
    const c = containerRef.current;
    if (!c?.options?.particles?.shape) return;
    c.options.particles.shape.type = shape;
    void c.refresh();
  }, [shape]);

  const wrapperClass = className ?? "dynamic-tsparticles-bg";

  const wrapperStyle = useMemo(
    () => ({
      position: "absolute" as const,
      width: "100%",
      height: "100%",
      ...style,
    }),
    [style]
  );

  return (
    <div className={wrapperClass} style={wrapperStyle}>
      <div
        ref={hostRef}
        className="dynamic-tsparticles-engine-host"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      />
    </div>
  );
}
