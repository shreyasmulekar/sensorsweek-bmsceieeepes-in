import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { SectionTitle } from "@/components/Layout";
import { EventCard } from "@/components/EventCard";
import { EVENTS, INSTAGRAM, type EventItem } from "@/lib/site";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events | Sensors Week 2026" },
      { name: "description", content: "The flagship Hardware Hackathon and the SENSORS FUSION drone workshop at Sensors Week 2026, BMSCE." },
      { property: "og:title", content: "Events | Sensors Week 2026" },
      { property: "og:description", content: "Pick your events and register for Sensors Week 2026." },
    ],
  }),
  component: Events,
});

type Cat = "All" | EventItem["category"];
const CATS: Cat[] = ["All", ...Array.from(new Set(EVENTS.map((e) => e.category)))];

function Events() {
  const [cat, setCat] = useState<Cat>("All");
  const list = EVENTS.filter((e) => cat === "All" || e.category === cat);
  const flagship = list.find((e) => e.flagship);
  const rest = list.filter((e) => !e.flagship);
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <SectionTitle kicker="Events" title="Pick your challenge" />
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className="relative rounded-full px-4 py-2 text-sm">
            {cat === c && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-gradient-primary" />}
            <span className={`relative ${cat === c ? "text-primary-foreground" : "text-muted-foreground"}`}>{c}</span>
          </button>
        ))}
      </div>

      {flagship ? (
        <div className="mb-6">
          <EventCard e={flagship} wide />
        </div>
      ) : null}

      <div className={`grid gap-6 ${rest.length > 1 ? "lg:grid-cols-2" : ""}`}>
        {rest.map((e, i) => <EventCard key={e.slug} e={e} i={i} />)}
      </div>

      <p className="glass mx-auto mt-10 max-w-xl rounded-xl p-4 text-center text-sm text-muted-foreground">
        More events are being added for Sensors Week 2026 — follow <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="text-primary hover:underline">@bmsce_ieeepes</a> for announcements.
      </p>
    </section>
  );
}
