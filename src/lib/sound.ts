// Browser-only sound effects. No audio files — every sound is a short
// synthesised tone, so nothing is downloaded and nothing can fail to load.
const MUTE_KEY = "sw-sound";

let ctx: AudioContext | null = null;
let muted = false;
let listeners: Array<(m: boolean) => void> = [];
try {
  muted = localStorage.getItem(MUTE_KEY) === "off";
} catch {
  /* server or storage disabled */
}

export function isMuted() {
  return muted;
}

export function onMuteChange(fn: (m: boolean) => void) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((f) => f !== fn);
  };
}

export function setMuted(v: boolean) {
  muted = v;
  listeners.forEach((f) => f(v));
  try {
    localStorage.setItem(MUTE_KEY, v ? "off" : "on");
  } catch {
    /* ignore */
  }
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

type Tone = { freq?: number; dur?: number; type?: OscillatorType; gain?: number; to?: number; delay?: number };

function tone({ freq = 440, dur = 0.09, type = "sine", gain = 0.05, to = 0, delay = 0 }: Tone = {}) {
  const c = ac();
  if (!c || muted) return;
  const t0 = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(Math.max(40, to), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

export const sfx = {
  click: () => tone({ freq: 620, to: 300, dur: 0.08, type: "triangle", gain: 0.05 }),
  tap: () => tone({ freq: 420, dur: 0.05, gain: 0.035 }),
  hover: () => tone({ freq: 1100, dur: 0.035, gain: 0.012 }),
  open: () => {
    tone({ freq: 420, to: 700, dur: 0.1, gain: 0.04 });
    tone({ freq: 700, to: 900, dur: 0.09, gain: 0.03, delay: 0.07 });
  },
  close: () => tone({ freq: 600, to: 240, dur: 0.11, gain: 0.035 }),
  sent: () => tone({ freq: 520, to: 880, dur: 0.1, gain: 0.045 }),
  reply: () => {
    tone({ freq: 880, dur: 0.07, gain: 0.035 });
    tone({ freq: 660, dur: 0.09, gain: 0.03, delay: 0.08 });
  },
  launch: () => [330, 440, 660, 880].forEach((f, i) => tone({ freq: f, to: f * 1.5, dur: 0.12, gain: 0.045, delay: i * 0.07 })),
};

let lastHover = 0;

// One listener for the whole page: every button, link and field gets a sound,
// so a clickable can never ship silent by accident.
export function attachSfx() {
  if (typeof document === "undefined") return () => {};
  const target = (t: EventTarget | null) =>
    t instanceof Element ? t.closest("button, a, [role='button'], input, select, textarea") : null;
  const down = (e: Event) => {
    if (target(e.target)) sfx.click();
  };
  const over = (e: Event) => {
    const now = performance.now();
    if (now - lastHover < 90) return;
    if (target(e.target)) {
      lastHover = now;
      sfx.hover();
    }
  };
  document.addEventListener("pointerdown", down, true);
  document.addEventListener("pointerover", over, true);
  return () => {
    document.removeEventListener("pointerdown", down, true);
    document.removeEventListener("pointerover", over, true);
  };
}
