import { motion, type MotionStyle } from "motion/react";
import { EVENT_ACCENT, eventEndMs, eventStartMs, type EventItem } from "@/lib/site";
import { useNow } from "@/lib/useNow";

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
  const start = eventStartMs(e);
  const end = eventEndMs(e);
  const now = useNow();

  if (start == null) return null;

  const diff = Math.max(0, start - (now ?? start));
  const running = now != null && diff === 0 && (end == null || now < end);
  const finished = now != null && end != null && now >= end;
  const accent = EVENT_ACCENT[e.slug] ?? "var(--ev-cyan)";
  const v = values(diff);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ "--ev": accent } as MotionStyle}
      className="mt-5"
      aria-label={finished ? `${e.name} has finished` : running ? `${e.name} is happening now` : `Time remaining until ${e.name}`}
    >
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        <span aria-hidden className="animate-blink inline-block size-1.5 rounded-full bg-current" />
        {finished ? "Finished" : running ? "Happening now" : "Starts in"}
      </span>
      {running || finished ? null : (
        <div className="mt-2 grid grid-cols-4 gap-1.5 sm:gap-2">
          {UNITS.map((label, i) => (
            <span key={label} className="ev-tile rounded-lg px-1 py-1.5 text-center">
              <span className="ev-num block font-display text-lg font-bold tabular-nums sm:text-xl">
                {String(v[i]).padStart(2, "0")}
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
