import { useEffect, useState } from "react";
import { motion, type MotionStyle } from "motion/react";
import { EVENT_ACCENT, eventStartMs, type EventItem } from "@/lib/site";

const UNITS = ["Days", "Hours", "Mins", "Secs"] as const;

function values(diff: number) {
  return [
    Math.floor(diff / 864e5),
    Math.floor((diff / 36e5) % 24),
    Math.floor((diff / 6e4) % 60),
    Math.floor((diff / 1e3) % 60),
  ];
}

/** Live countdown to an event's start, in Bengaluru time. */
export function EventCountdown({ e }: { e: EventItem }) {
  const target = eventStartMs(e);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (target == null) return null;

  const diff = Math.max(0, target - (now ?? target));
  const started = now != null && diff === 0;
  const accent = EVENT_ACCENT[e.slug] ?? "var(--ev-cyan)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ "--ev": accent } as MotionStyle}
      className="mt-5 flex flex-wrap items-center gap-2"
      aria-label={started ? `${e.name} has started` : `Time remaining until ${e.name}`}
    >
      <span className="mr-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        <span aria-hidden className="animate-blink inline-block size-1.5 rounded-full bg-current" />
        {started ? "Happening now" : "Starts in"}
      </span>
      {started ? null : (
        UNITS.map((label, i) => (
          <span key={label} className="ev-tile rounded-lg px-2.5 py-1 text-center">
            <span className="ev-num block font-display text-base font-bold tabular-nums sm:text-lg">
              {String(values(diff)[i]).padStart(2, "0")}
            </span>
            <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
          </span>
        ))
      )}
    </motion.div>
  );
}
