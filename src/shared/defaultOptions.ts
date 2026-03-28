export function buildDefaultParticleOptions(
  speedValue: number,
  particlesLink: boolean,
  overrides?: Record<string, unknown>
): Record<string, unknown> {
  const defaultColor = "#00a85c";
  const base: Record<string, unknown> = {
    fpsLimit: 120,
    interactivity: {
      modes: {
        bubble: {
          distance: 400,
          duration: 2,
          opacity: 0.8,
          size: 40,
        },
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: defaultColor,
      },
      links: {
        color: defaultColor,
        distance: 150,
        enable: particlesLink,
        opacity: 0.42,
        width: 2,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: "bounce",
        random: false,
        speed: speedValue,
        vibrate: false,
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        value: 80,
      },
      opacity: {
        value: 0.62,
      },
      shape: {
        type: "triangle",
      },
      size: {
        value: { min: 1, max: 7 },
      },
    },
    detectRetina: true,
  };

  return overrides ? deepMerge(base, overrides) : base;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    if (sv === undefined) continue;
    const tv = out[key];
    if (isPlainObject(tv) && isPlainObject(sv)) {
      out[key] = deepMerge(tv, sv);
    } else {
      out[key] = sv;
    }
  }
  return out;
}
