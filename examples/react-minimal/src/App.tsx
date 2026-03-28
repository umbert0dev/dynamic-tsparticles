import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  AudioAnalyzer,
  DynamicParticles,
  initParticlesEngine,
  useDynamicParticlesState,
} from "dynamic-tsparticles-react";

const SHAPE_OPTIONS = [
  { value: "circle", label: "Circle" },
  { value: "square", label: "Square" },
  { value: "triangle", label: "Triangle" },
  { value: "star", label: "Star" },
  { value: "polygon", label: "Polygon" },
] as const;

export default function App() {
  const [engineReady, setEngineReady] = useState(false);
  const state = useDynamicParticlesState({
    initialSpeed: 3,
    initialParticlesLink: true,
  });

  const [speedUi, setSpeedUi] = useState(3);
  const [shape, setShape] = useState("circle");
  const [linksUi, setLinksUi] = useState(true);

  useEffect(() => {
    void initParticlesEngine(state.initTsParticles).then(() => setEngineReady(true));
  }, [state.initTsParticles]);

  useEffect(() => {
    state.speedRef.current = speedUi;
  }, [speedUi, state.speedRef]);

  useEffect(() => {
    state.particlesLinkRef.current = linksUi;
  }, [linksUi, state.particlesLinkRef]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const analyzer = AudioAnalyzer.getInstance();

  const onAudioFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (!file) return;
    setAudioUrl(URL.createObjectURL(file));
  };

  const onAudioPlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (!analyzer.isReady()) {
      analyzer.init(el);
    }
    void analyzer.audioContext?.resume();
    analyzer.clearInterval();
    state.isPlayingRef.current = true;
    analyzer.setInterval(() => {
      const next = analyzer.getNewAudioSpeed(state.speedRef.current);
      state.speedRef.current = next;
      setSpeedUi(next);
    });
  };

  const onAudioStop = () => {
    analyzer.clearInterval();
    state.isPlayingRef.current = false;
  };

  useEffect(() => {
    return () => {
      analyzer.clearInterval();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="layout">
      <div className="particles-wrap">
        {engineReady ? (
          <DynamicParticles
            speedRef={state.speedRef}
            isPlayingRef={state.isPlayingRef}
            particlesLinkRef={state.particlesLinkRef}
            shape={shape}
          />
        ) : null}
      </div>
      <div className="controls">
        <label>
          Speed: {speedUi}
          <input
            type="range"
            min={0}
            max={20}
            value={speedUi}
            onChange={(e) => {
              const n = Number(e.target.value);
              setSpeedUi(n);
              state.speedRef.current = n;
            }}
          />
        </label>
        <label className="row">
          <input
            type="checkbox"
            checked={linksUi}
            onChange={(e) => {
              const v = e.target.checked;
              setLinksUi(v);
              state.particlesLinkRef.current = v;
            }}
          />
          Links
        </label>
        <label>
          Shape
          <select
            className="shape-select"
            value={shape}
            onChange={(e) => setShape(e.target.value)}
          >
            {SHAPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <div className="audio-block">
          <span className="audio-label">Audio track (optional)</span>
          <input
            className="file-input"
            type="file"
            accept="audio/*"
            onChange={onAudioFile}
          />
          {audioUrl ? (
            <audio
              ref={audioRef}
              className="audio-el"
              src={audioUrl}
              controls
              onPlay={onAudioPlay}
              onPause={onAudioStop}
              onEnded={onAudioStop}
            />
          ) : (
            <p className="audio-hint">
              Choose a file, then press play — particle speed follows the beat.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
