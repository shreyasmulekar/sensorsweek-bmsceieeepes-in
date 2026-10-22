import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Cpu, Radio, Zap, Wifi } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { RegisterButton, SectionTitle } from "@/components/Layout";
import { EventCard } from "@/components/EventCard";
import { DATES_LABEL, EVENTS, EVENT_START, SPONSORS } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sensors Week 2026 | BMSCE IEEE PES & Sensors Council" },
      { name: "description", content: "Workshops, drone challenges, a robotics hackathon and more — 30 Oct to 4 Nov 2026 at BMSCE." },
      { property: "og:title", content: "Sensors Week 2026 | BMSCE IEEE" },
      { property: "og:description", content: "Workshops, drones, robots and prizes — 30 Oct to 4 Nov 2026." },
    ],
  }),
  component: Index,
});

function useCountdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = Math.max(0, EVENT_START.getTime() - (now ?? EVENT_START.getTime()));
  return [["Days", diff / 864e5], ["Hours", (diff / 36e5) % 24], ["Mins", (diff / 6e4) % 60], ["Secs", (diff / 1e3) % 60]].map(([l, v]) => [l as string, Math.floor(v as number)] as const);
}

const TITLE = "SENSORS WEEK";

function Index() {
  const cd = useCountdown();
  return (
    <>
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <img src={heroBg} alt="" width={1920} height={1088} className="absolute inset-0 -z-10 h-full w-full animate-kenburns object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <div className="mx-auto max-w-6xl px-4 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.35em] text-primary md:text-sm">
            BMSCE IEEE PES & Sensors Council presents
          </motion.p>
          <h1 className="mt-6 text-5xl font-black md:text-8xl">
            {TITLE.split("").map((ch, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 60, rotateX: 90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.3 + i * 0.05, type: "spring" }} className={i < 7 ? "inline-block text-gradient" : "inline-block"}>
                {ch === " " ? "\u00a0" : ch}
              </motion.span>
            ))}
            <motion.span initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 }} className="mt-2 block text-3xl md:text-5xl">2026</motion.span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Six days of drones, robots, IoT and smart sensing. Build, compete, learn — {DATES_LABEL}.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-8 flex flex-wrap justify-center gap-4">
            <RegisterButton />
            <Link to="/events" className="rounded-full border border-primary/50 px-6 py-3 font-semibold transition hover:bg-primary/10">Explore Events</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }} className="mx-auto mt-12 grid max-w-md grid-cols-4 gap-3">
            {cd.map(([l, v]) => (
              <div key={l} className="glass rounded-xl py-3">
                <p className="font-display text-2xl font-bold text-primary md:text-3xl">{String(v).padStart(2, "0")}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle kicker="About" title="What is Sensors Week?" />
        <p className="mx-auto max-w-2xl text-center text-muted-foreground">
          A week-long tech fest by the BMSCE IEEE Power & Energy Society and Sensors Council, celebrating the tiny devices that make machines aware of the world.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[[Radio, "Sensors"], [Cpu, "Embedded"], [Wifi, "IoT"], [Zap, "Energy"]].map(([Icon, l], i) => {
            const I = Icon as typeof Cpu;
            return (
              <motion.div key={l as string} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ rotate: -3, scale: 1.05 }} className="glass rounded-2xl p-6 text-center">
                <I className="mx-auto size-8 animate-floaty text-primary" style={{ animationDelay: `${i * 0.4}s` }} />
                <p className="mt-3 font-display text-sm">{l as string}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionTitle kicker="Featured" title="Don't miss these" />
        <div className="grid gap-6 md:grid-cols-3">
          {EVENTS.slice(0, 3).map((e, i) => <EventCard key={e.slug} e={e} i={i} />)}
        </div>
        <div className="mt-8 text-center"><Link to="/events" className="text-primary hover:underline">See all events →</Link></div>
      </section>

      <section className="py-16">
        <SectionTitle kicker="Backed by" title="Our Sponsors" />
        <div className="overflow-hidden">
          <div className="flex w-max animate-[marquee_25s_linear_infinite] gap-6">
            {[...SPONSORS, ...SPONSORS].map((s, i) => (
              <div key={i} className="glass grid h-20 w-48 place-items-center rounded-xl font-display text-sm text-muted-foreground">{s}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
