import { Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { NgParticlesService } from "@tsparticles/angular";
import {
  AudioAnalyzer,
  createDynamicParticlesState,
  DynamicParticlesComponent,
} from "dynamic-tsparticles-angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [DynamicParticlesComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly ngParticles = inject(NgParticlesService);
  private readonly analyzer = AudioAnalyzer.getInstance();

  readonly state = createDynamicParticlesState({
    initialSpeed: 3,
    initialParticlesLink: true,
  });

  readonly shape = signal("circle");
  readonly linksUi = signal(true);
  readonly speedUi = signal(3);
  readonly audioUrl = signal<string | null>(null);

  readonly shapeOptions = [
    { value: "circle", label: "Circle" },
    { value: "square", label: "Square" },
    { value: "triangle", label: "Triangle" },
    { value: "star", label: "Star" },
    { value: "polygon", label: "Polygon" },
  ] as const;

  ngOnInit(): void {
    void this.ngParticles.init(this.state.initTsParticles);
  }

  ngOnDestroy(): void {
    this.analyzer.clearInterval();
    const u = this.audioUrl();
    if (u) {
      URL.revokeObjectURL(u);
    }
  }

  onSpeedInput(ev: Event): void {
    const n = Number((ev.target as HTMLInputElement).value);
    this.speedUi.set(n);
    this.state.speed.set(n);
  }

  onLinksChange(ev: Event): void {
    const v = (ev.target as HTMLInputElement).checked;
    this.linksUi.set(v);
    this.state.particlesLink.set(v);
  }

  onShapeChange(ev: Event): void {
    this.shape.set((ev.target as HTMLSelectElement).value);
  }

  onAudioFile(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    const prev = this.audioUrl();
    if (prev) {
      URL.revokeObjectURL(prev);
    }
    if (!file) {
      this.audioUrl.set(null);
      return;
    }
    this.audioUrl.set(URL.createObjectURL(file));
  }

  onAudioPlay(audioEl: HTMLAudioElement): void {
    if (!this.analyzer.isReady()) {
      this.analyzer.init(audioEl);
    }
    void this.analyzer.audioContext?.resume();
    this.analyzer.clearInterval();
    this.state.isPlaying.set(true);
    this.analyzer.setInterval(() => {
      const next = this.analyzer.getNewAudioSpeed(this.state.speed());
      this.state.speed.set(next);
      this.speedUi.set(next);
    });
  }

  onAudioStop(): void {
    this.analyzer.clearInterval();
    this.state.isPlaying.set(false);
  }
}
