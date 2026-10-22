import { useEffect, useRef } from "react";

/** Animated network of sensor nodes + drifting drones that react to the mouse. */
export function TechBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const mouse = { x: -999, y: -999 };
    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
    resize();
    const n = Math.min(90, Math.floor((w * h) / 16000));
    const pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 }));
    const drones = Array.from({ length: 4 }, (_, i) => ({ x: Math.random() * w, y: 80 + i * (h / 5), s: 0.4 + Math.random() * 0.6, t: Math.random() * 10 }));
    const cs = getComputedStyle(document.documentElement);
    const pri = cs.getPropertyValue("--primary").trim() || "cyan";
    const color = (a: number) => `color-mix(in oklab, ${pri} ${Math.round(a * 100)}%, transparent)`;

    const drawDrone = (x: number, y: number, t: number) => {
      ctx.save(); ctx.translate(x, y);
      ctx.strokeStyle = color(0.55); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(-16, -8); ctx.lineTo(16, 8); ctx.moveTo(16, -8); ctx.lineTo(-16, 8); ctx.stroke();
      for (const [dx, dy] of [[-16, -8], [16, -8], [-16, 8], [16, 8]]) {
        ctx.beginPath(); ctx.ellipse(dx, dy, 8 * Math.abs(Math.sin(t * 20)) + 2, 2, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = color(0.8); ctx.fillRect(-4, -3, 8, 6);
      const g = ctx.createLinearGradient(0, 0, 0, 90);
      g.addColorStop(0, color(0.25)); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-3, 4); ctx.lineTo(3, 4); ctx.lineTo(28, 90); ctx.lineTo(-28, 90); ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dm < 120) { p.x += (p.x - mouse.x) / dm; p.y += (p.y - mouse.y) / dm; }
      }
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 130) { ctx.strokeStyle = color(0.35 * (1 - d / 130)); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
        }
        ctx.fillStyle = color(0.8); ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      for (const d of drones) {
        d.t += 0.01; d.x += d.s; if (d.x > w + 40) d.x = -40;
        drawDrone(d.x, d.y + Math.sin(d.t * 2) * 12, d.t);
      }
      raf = requestAnimationFrame(loop);
    };
    const mm = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", mm);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", mm); };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--primary)_1px,transparent_1px),linear-gradient(90deg,var(--primary)_1px,transparent_1px)] [background-size:48px_48px]" />
      <canvas ref={ref} className="absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-32 animate-scan bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
    </div>
  );
}
