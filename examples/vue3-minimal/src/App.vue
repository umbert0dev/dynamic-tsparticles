<template>
  <div class="layout">
    <div class="particles-wrap">
      <DynamicParticles
        :speed-ref="state.speedRef"
        :is-playing-ref="state.isPlayingRef"
        :particles-link-ref="state.particlesLinkRef"
        shape="circle"
      />
    </div>
    <div class="controls">
      <label>
        Speed: {{ state.speedRef }}
        <input v-model.number="state.speedRef" type="range" min="0" max="20" />
      </label>
      <label class="row">
        <input v-model="state.particlesLinkRef" type="checkbox" />
        Links
      </label>
    </div>
  </div>
</template>

<script setup>
import { inject } from "vue";

const state = inject("particlesState");
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
.layout {
  min-height: 100%;
  position: relative;
}
.particles-wrap {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: #1a1a2e;
}
.controls {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 8px;
  font-family: system-ui, sans-serif;
  font-size: 0.9rem;
  max-width: 240px;
}
.controls label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.controls label.row {
  flex-direction: row;
  align-items: center;
}
</style>
