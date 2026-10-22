import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { SectionTitle } from "@/components/Layout";
import { EventCard } from "@/components/EventCard";
import { EVENTS } from "@/lib/site";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events | Sensors Week 2026" },
      { name: "description", content: "Workshops, drone races, RoboHack, expert talks and the Sensor Expo at Sensors Week 2026." },
      { property: "og:title", content: "Events | Sensors Week 2026" },
      { property: "og:description", content: "Pick your events and register for Sensors Week 2026." },
    ],
  }),
  component: Events,
});

const CATS = ["All", "Workshop", "Competition", "Talk", "Exhibition"] as const;

function Events() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const list = EVENTS.filter((e) => cat === "All" || e.category === cat);
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionTitle kicker="Events" title="Pick your challenge" />
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className="relative rounded-full px-4 py-2 text-sm">
            {cat === c && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-gradient-primary" />}
            <span className={`relative ${cat === c ? "text-primary-foreground" : "text-muted-foreground"}`}>{c}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((e, i) => <EventCard key={e.slug} e={e} i={i} />)}
      </div>
    </section>
  );
}
