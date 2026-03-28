# dynamic-tsparticles-angular

Angular adapter for tsParticles with a dynamic-speed mover and optional Web Audio. Peers: Angular, `@tsparticles/angular`, `tsparticles`, `@tsparticles/engine`, `rxjs`.

Full docs: [monorepo README](https://github.com/umbert0dev/dynamic-tsparticles#readme).

```bash
npm install dynamic-tsparticles-angular @angular/core @angular/common @tsparticles/angular tsparticles @tsparticles/engine rxjs
```

Call **`NgParticlesService.init(state.initTsParticles)` once** (e.g. in `App` `ngOnInit`), then use `<dynamic-particles [speed]="state.speed" … />`.
