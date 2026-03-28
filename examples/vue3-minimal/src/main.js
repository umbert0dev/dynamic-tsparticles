import { createApp, reactive } from "vue";
import Particles from "@tsparticles/vue3";
import { createDynamicParticlesState, DynamicParticles } from "dynamic-tsparticles-vue3";
import App from "./App.vue";

const app = createApp(App);
const state = reactive(
  createDynamicParticlesState({
    initialSpeed: 3,
    initialParticlesLink: true,
  })
);

app.component("DynamicParticles", DynamicParticles);
app.use(Particles, { init: state.initTsParticles });
app.provide("particlesState", state);

app.mount("#app");
