import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SectionTitle } from "@/components/Layout";
import { SCHEDULE } from "@/lib/site";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule | Sensors Week 2026" },
      { name: "description", content: "Timings and venues for Sensors Week 2026 events at BMSCE, Bengaluru." },
      { property: "og:title", content: "Schedule | Sensors Week 2026" },
      { property: "og:description", content: "Day-wise timings and venues for Sensors Week 2026." },
    ],
  }),
  component: Schedule,
});

function Schedule() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <SectionTitle kicker="Timeline" title="Schedule" />
      <p className="glass mb-10 rounded-xl p-4 text-center text-sm text-muted-foreground">
        Confirmed sessions are listed below. The flagship Hardware Hackathon and the rest of the week will be added as soon as they are finalised.
      </p>
      <div className="relative border-l-2 border-primary/30 pl-8">
        {SCHEDULE.map((d, i) => (
          <motion.div key={d.day} initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="relative mb-10">
            <span className="absolute -left-[41px] top-1 size-4 rounded-full bg-primary shadow-glow" />
            <h3 className="font-display text-lg text-primary">{d.day}</h3>
            <div className="mt-3 space-y-3">
              {d.items.map((it) => (
                <div key={it.n} className="glass flex flex-wrap items-center justify-between gap-2 rounded-xl px-4 py-3">
                  <span className="font-semibold">{it.n}</span>
                  <span className="text-sm text-muted-foreground">{it.t} · {it.v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
        <div className="glass rounded-xl px-4 py-3 text-sm text-muted-foreground">
          Hardware Hackathon — date and timings to be announced.
        </div>
      </div>
    </section>
  );
}
