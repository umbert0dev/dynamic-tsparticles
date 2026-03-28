<template>
  <div :class="wrapperClass" :style="wrapperStyle">
    <vue-particles
      :id="canvasId"
      :options="particleOptions"
      @particles-loaded="onParticlesLoaded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Container } from "@tsparticles/engine";
import { buildDefaultParticleOptions } from "../shared/defaultOptions";
import type { Ref } from "vue";

const props = withDefaults(
  defineProps<{
    /** Vue ref used by DynamicSpeedMover (same as createDynamicParticlesState). */
    speedRef: Ref<number>;
    isPlayingRef: Ref<boolean>;
    particlesLinkRef: Ref<boolean>;
    /** Particle shape type (triangle, circle, square, …). */
    shape?: string;
    /** Deep-merge over default tsParticles options. */
    options?: Record<string, unknown>;
    canvasId?: string;
    wrapperClass?: string;
  }>(),
  {
    shape: "triangle",
    options: undefined,
    canvasId: "dynamic-tsparticles",
    wrapperClass: "dynamic-tsparticles-bg",
  }
);

const wrapperStyle = computed(() => ({
  width: "100%",
  height: "100%",
  position: "absolute" as const,
}));

let container: Container | null = null;

const particleOptions = ref(
  buildDefaultParticleOptions(props.speedRef.value, props.particlesLinkRef.value, props.options)
);

watch(
  () => props.shape,
  (type) => {
    if (!container?.options?.particles?.shape) return;
    container.options.particles.shape.type = type;
    container.refresh();
  }
);

watch(
  () => props.options,
  () => {
    particleOptions.value = buildDefaultParticleOptions(
      props.speedRef.value,
      props.particlesLinkRef.value,
      props.options
    );
    container?.refresh();
  },
  { deep: true }
);

function onParticlesLoaded(c: Container) {
  container = c;
}
</script>
