import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { SectionTitle } from "@/components/Layout";
import { EventCard } from "@/components/EventCard";
import { EVENTS, INSTAGRAM, dayLabel, type EventItem } from "@/lib/site";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events | Sensors Week 2026" },
      { name: "description", content: "Filter the flagship Hardware Hackathon, the SENSORS FUSION drone workshop and more by type or day at Sensors Week 2026, BMSCE." },
      { property: "og:title", content: "Events | Sensors Week 2026" },
      { property: "og:description", content: "Pick your events and register for Sensors Week 2026." },
    ],
  }),
  component: Events,
});

type Cat = "All" | EventItem["category"];
const CATS: Cat[] = ["All", ...Array.from(new Set(EVENTS.map((e) => e.category)))];
const DAYS: string[] = ["All", ...Array.from(new Set(EVENTS.map((e) => e.day || "tba")))];
const dayText = (v: string) => (v === "All" ? "All days" : v === "tba" ? "Dates TBA" : dayLabel(v));

function Pills({ label, options, value, onPick, text, id }: { label: string; options: string[]; value: string; onPick: (v: string) => void; text: (v: string) => string; id: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o} onClick={() => onPick(o)} aria-pressed={value === o} className="relative rounded-full px-4 py-2 text-sm">
          {value === o && <motion.span layoutId={id} className="absolute inset-0 rounded-full bg-gradient-primary" />}
          <span className={`relative ${value === o ? "text-primary-foreground" : "text-muted-foreground"}`}>{text(o)}</span>
        </button>
      ))}
    </div>
  );
}

function Events() {
  const [cat, setCat] = useState<Cat>("All");
  const [day, setDay] = useState<string>("All");
  const list = EVENTS.filter((e) => (cat === "All" || e.category === cat) && (day === "All" || (e.day || "tba") === day));
  const flagship = list.find((e) => e.flagship);
  const rest = list.filter((e) => !e.flagship);
  const filtered = cat !== "All" || day !== "All";
  const clear = () => { setCat("All"); setDay("All"); };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <SectionTitle kicker="Events" title="Pick your challenge" />

      <div className="mb-4 flex flex-col items-center gap-3">
        <Pills label="Filter by type" options={CATS} value={cat} onPick={(v) => setCat(v as Cat)} text={(v) => (v === "All" ? "All types" : v)} id="pill-cat" />
        <Pills label="Filter by day" options={DAYS} value={day} onPick={setDay} text={dayText} id="pill-day" />
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
        <p aria-live="polite" aria-atomic="true">
          Showing {list.length} of {EVENTS.length} events{filtered ? ` · type ${cat === "All" ? "any" : cat}, day ${day === "All" ? "any" : dayText(day)}` : ""}
        </p>
        {filtered && (
          <button onClick={clear} className="rounded-full border border-border px-3 py-1 transition-colors hover:bg-secondary">Clear all filters</button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="glass mx-auto max-w-md rounded-2xl p-6 text-center">
          <p className="text-3xl">🔍</p>
          <p className="mt-3 font-semibold">No events match those filters yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Nothing is scheduled for {cat === "All" ? "that" : cat} on {day === "All" ? "that" : dayText(day)}. Try another day or type — new events are added every week.
          </p>
          <button onClick={clear} className="mt-4 rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Show all events</button>
        </div>
      ) : (
        <>
          {flagship ? (
            <div className="mb-6">
              <EventCard e={flagship} wide />
            </div>
          ) : null}
          <div className={`grid gap-6 ${rest.length > 1 ? "lg:grid-cols-2" : ""}`}>
            {rest.map((e, i) => <EventCard key={e.slug} e={e} i={i} />)}
          </div>
        </>
      )}

      <p className="glass mx-auto mt-10 max-w-xl rounded-xl p-4 text-center text-sm text-muted-foreground">
        More events are being added for Sensors Week 2026 — follow <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="text-primary hover:underline">@bmsce_ieeepes</a> for announcements.
      </p>
    </section>
  );
}
