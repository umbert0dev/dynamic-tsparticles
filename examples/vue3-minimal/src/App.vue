<template>
  <div class="layout">
    <div class="particles-wrap">
      <DynamicParticles
        :speed-ref="state.speedRef"
        :is-playing-ref="state.isPlayingRef"
        :particles-link-ref="state.particlesLinkRef"
        :shape="shape"
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
      <label>
        Shape
        <select v-model="shape" class="shape-select">
          <option v-for="opt in shapeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </label>
      <div class="audio-block">
        <label class="audio-label">Audio track (optional)</label>
        <input
          class="file-input"
          type="file"
          accept="audio/*"
          @change="onAudioFile"
        />
        <audio
          v-if="audioObjectUrl"
          ref="audioRef"
          class="audio-el"
          :src="audioObjectUrl"
          controls
          crossorigin="anonymous"
          @play="onAudioPlay"
          @pause="onAudioStop"
          @ended="onAudioStop"
        />
        <p v-else class="audio-hint">Choose a file, then press play — particle speed follows the beat.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, onUnmounted } from "vue";
import { AudioAnalyzer } from "dynamic-tsparticles-vue3";

const state = inject("particlesState");

const shapeOptions = [
  { value: "circle", label: "Circle" },
  { value: "square", label: "Square" },
  { value: "triangle", label: "Triangle" },
  { value: "star", label: "Star" },
  { value: "polygon", label: "Polygon" },
];
const shape = ref("circle");

const audioRef = ref(null);
const audioObjectUrl = ref(null);
const analyzer = AudioAnalyzer.getInstance();

function onAudioFile(event) {
  const file = event.target.files?.[0];
  if (audioObjectUrl.value) {
    URL.revokeObjectURL(audioObjectUrl.value);
    audioObjectUrl.value = null;
  }
  if (!file) return;
  audioObjectUrl.value = URL.createObjectURL(file);
}

function onAudioPlay() {
  const el = audioRef.value;
  if (!el) return;
  if (!analyzer.isReady()) {
    analyzer.init(el);
  }
  void analyzer.audioContext?.resume();
  analyzer.clearInterval();
  state.isPlayingRef = true;
  analyzer.setInterval(() => {
    state.speedRef = analyzer.getNewAudioSpeed(state.speedRef);
  });
}

function onAudioStop() {
  analyzer.clearInterval();
  state.isPlayingRef = false;
}

onUnmounted(() => {
  analyzer.clearInterval();
  if (audioObjectUrl.value) {
    URL.revokeObjectURL(audioObjectUrl.value);
  }
});
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
  max-width: min(280px, calc(100vw - 2rem));
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
.audio-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.audio-label {
  font-weight: 600;
  font-size: 0.8rem;
  color: #333;
}
.file-input {
  font-size: 0.8rem;
  max-width: 100%;
}
.audio-el {
  width: 100%;
  margin-top: 0.25rem;
}
.audio-hint {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.35;
  color: #555;
}
.shape-select {
  width: 100%;
  padding: 0.35rem 0.5rem;
  font: inherit;
  font-size: 0.85rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
}
</style>
