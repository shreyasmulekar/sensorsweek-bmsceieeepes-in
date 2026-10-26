import { useEffect, useRef } from "react";

/**
 * Animated network of sensor nodes + drifting drones that react to the mouse.
 *
 * Kept deliberately cheap so the rest of the page stays smooth while it runs:
 * the theme colour is resolved to a plain rgba triple once, edges are batched
 * into six paths per frame instead of thousands of separate stroke calls, the
 * device pixel ratio is capped, and the loop is throttled to ~30fps and paused
 * whenever the tab is hidden.
 */
export function TechBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0, last = 0;

    const FRAME_MS = 1000 / 30;
    const mouse = { x: -999, y: -999 };

    // Resolve --primary (oklch) to an rgb triple once. Building a colour-mix()
    // string for every stroke was the main per-frame cost.
    const probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
    probe.fillStyle = "#22d3ee";
    const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
    if (primary) probe.fillStyle = primary;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b] = Array.from(probe.getImageData(0, 0, 1, 1).data);
    const rgba = (a: number) => `rgba(${r},${g},${b},${a.toFixed(3)})`;

    const INK = 118;            // distance in px within which nodes are linked
    const INK2 = INK * INK;
    const BANDS = 6;            // distance bands, one stroke per band
    const ink = Array.from({ length: BANDS }, (_, k) => rgba(0.34 * (1 - k / BANDS)));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const n = Math.min(56, Math.max(18, Math.floor((w * h) / 26000)));
    const pts = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
    const drones = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random() * w,
      y: 80 + i * (h / 5),
      s: 0.35 + Math.random() * 0.5,
      t: Math.random() * 10,
    }));

    const drawDrone = (x: number, y: number, t: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = ink[0]!;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-16, -8); ctx.lineTo(16, 8);
      ctx.moveTo(16, -8); ctx.lineTo(-16, 8);
      ctx.stroke();
      // Rotors turn slowly — a fast flicker reads as the page glitching.
      const spin = Math.abs(Math.sin(t * 3)) * 6 + 2;
      ctx.beginPath();
      for (const [dx, dy] of [[-16, -8], [16, -8], [-16, 8], [16, 8]] as const) {
        ctx.moveTo(dx + spin, dy);
        ctx.ellipse(dx, dy, spin, 2, 0, 0, Math.PI * 2);
      }
      ctx.stroke();
      ctx.fillStyle = rgba(0.8);
      ctx.fillRect(-4, -3, 8, 6);
      const grad = ctx.createLinearGradient(0, 0, 0, 90);
      grad.addColorStop(0, rgba(0.22));
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-3, 4); ctx.lineTo(3, 4); ctx.lineTo(28, 90); ctx.lineTo(-28, 90);
      ctx.fill();
      ctx.restore();
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < FRAME_MS) return;
      last = t;

      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14400 && d2 > 0.01) {
          const k = 1.2 / Math.sqrt(d2);
          p.x += dx * k; p.y += dy * k;
        }
      }

      const paths = Array.from({ length: BANDS }, () => new Path2D());
      for (let i = 0; i < n; i++) {
        const a = pts[i]!;
        for (let j = i + 1; j < n; j++) {
          const b2 = pts[j]!;
          const dx = a.x - b2.x, dy = a.y - b2.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > INK2) continue;
          const band = Math.min(BANDS - 1, Math.floor((d2 / INK2) * BANDS));
          paths[band]!.moveTo(a.x, a.y);
          paths[band]!.lineTo(b2.x, b2.y);
        }
      }
      ctx.lineWidth = 1;
      for (let k = 0; k < BANDS; k++) {
        ctx.strokeStyle = ink[k]!;
        ctx.stroke(paths[k]!);
      }

      const nodes = new Path2D();
      for (const p of pts) { nodes.moveTo(p.x + 1.6, p.y); nodes.arc(p.x, p.y, 1.6, 0, Math.PI * 2); }
      ctx.fillStyle = rgba(0.8);
      ctx.fill(nodes);

      for (const d of drones) {
        d.t += 0.012;
        d.x += d.s;
        if (d.x > w + 40) d.x = -40;
        drawDrone(d.x, d.y + Math.sin(d.t * 2) * 12, d.t);
      }
    };

    const start = () => { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--primary)_1px,transparent_1px),linear-gradient(90deg,var(--primary)_1px,transparent_1px)] [background-size:48px_48px]" />
      <canvas ref={ref} className="absolute inset-0" />
    </div>
  );
}
