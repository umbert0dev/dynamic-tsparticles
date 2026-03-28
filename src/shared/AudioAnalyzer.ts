/** Singleton Web Audio analyser: drive particle speed from an HTMLMediaElement. */
export default class AudioAnalyzer {
  static instance: AudioAnalyzer | null = null;

  audioContext: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  dataArray: Uint8Array | null = null;
  intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (AudioAnalyzer.instance) {
      return AudioAnalyzer.instance;
    }
    AudioAnalyzer.instance = this;
  }

  static getInstance(): AudioAnalyzer {
    if (!AudioAnalyzer.instance) {
      AudioAnalyzer.instance = new AudioAnalyzer();
    }
    return AudioAnalyzer.instance;
  }

  init(audioPlayer: HTMLMediaElement): void {
    if (!audioPlayer && this.audioContext != null) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioContext = new AC();
    this.analyser = this.audioContext.createAnalyser();
    const source = this.audioContext.createMediaElementSource(audioPlayer);
    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    this.analyser.fftSize = 256;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  isReady(): boolean {
    return this.audioContext != null;
  }

  setInterval(cb: () => void): void {
    this.intervalId = window.setInterval(cb, 100);
  }

  clearInterval(): void {
    if (this.intervalId != null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getAudioIntensity(): number {
    if (!this.analyser || !this.dataArray) return 0;
    this.analyser.getByteFrequencyData(this.dataArray as Parameters<AnalyserNode["getByteFrequencyData"]>[0]);
    let sum = 0;
    const rangeStart = 10;
    const rangeEnd = 50;
    for (let i = rangeStart; i < rangeEnd; i++) {
      sum += this.dataArray[i]!;
    }
    const average = sum / (rangeEnd - rangeStart);
    return average / 256;
  }

  lerp(start: number, end: number, t: number): number {
    return start + t * (end - start);
  }

  /** Maps intensity to a target speed and lerps toward it from currentSpeed. */
  getNewAudioSpeed(currentSpeed: number): number {
    const intensity = this.getAudioIntensity();
    const targetSpeed = 2 + Math.round(intensity * 20);
    return this.lerp(currentSpeed, targetSpeed, 0.1);
  }
}
