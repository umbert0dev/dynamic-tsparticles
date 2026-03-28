import {
  Component,
  computed,
  effect,
  input,
  signal,
  untracked,
} from "@angular/core";
import type { WritableSignal } from "@angular/core";
import { NgxParticlesModule } from "@tsparticles/angular";
import type { Container } from "@tsparticles/engine";
import { buildDefaultParticleOptions } from "../repo-shared/defaultOptions";

@Component({
  selector: "dynamic-particles",
  standalone: true,
  imports: [NgxParticlesModule],
  template: `
    <div [class]="resolvedClass()" style="position:absolute;width:100%;height:100%;">
      <ngx-particles
        [id]="canvasId()"
        [options]="particleOptions()"
        (particlesLoaded)="onParticlesLoaded($event)">
      </ngx-particles>
    </div>
  `,
})
export class DynamicParticlesComponent {
  readonly speed = input.required<WritableSignal<number>>();
  readonly isPlaying = input.required<WritableSignal<boolean>>();
  readonly particlesLink = input.required<WritableSignal<boolean>>();
  readonly shape = input<string>("triangle");
  readonly options = input<Record<string, unknown> | undefined>(undefined);
  readonly canvasId = input<string>("dynamic-tsparticles");
  readonly wrapperClass = input<string | undefined>(undefined);

  readonly resolvedClass = computed(
    () => this.wrapperClass() ?? "dynamic-tsparticles-bg"
  );

  readonly particleOptions = signal<Record<string, unknown>>({});
  private readonly container = signal<Container | undefined>(undefined);

  constructor() {
    effect(() => {
      void this.options();
      void this.particlesLink()();
      untracked(() => {
        const speed = this.speed()();
        const link = this.particlesLink()();
        this.particleOptions.set(
          buildDefaultParticleOptions(speed, link, this.options())
        );
      });
    });

    effect(() => {
      const s = this.shape();
      untracked(() => {
        const c = this.container();
        const shaped = c?.options?.particles?.shape;
        if (shaped) {
          shaped.type = s;
          c.refresh();
        }
      });
    });
  }

  onParticlesLoaded(c: Container): void {
    this.container.set(c);
    const s = this.shape();
    const shaped = c.options?.particles?.shape;
    if (shaped) {
      shaped.type = s;
      c.refresh();
    }
  }
}
