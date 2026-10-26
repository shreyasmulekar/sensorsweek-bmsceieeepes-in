import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Cpu, Radio, Zap, Wifi, Sparkles, CalendarDays } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { RegisterButton, SectionTitle } from "@/components/Layout";
import { GridFloor } from "@/components/CyberFx";
import { EventCard } from "@/components/EventCard";
import { DATES_LABEL, DEFAULT_REGISTER_URL, EVENTS, EVENT_START, NEXT_EVENT_LABEL, type EventItem } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sensors Week 2026 | BMSCE IEEE PES & Sensors Council" },
      { name: "description", content: "A flagship hardware hackathon, a hands-on drone and Raspberry Pi Pico workshop and more — Sensors Week 2026 at BMSCE, Bengaluru." },
      { property: "og:title", content: "Sensors Week 2026 | BMSCE IEEE" },
      { property: "og:description", content: "Hardware hackathon, drone workshop, sensors and robots at BMSCE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  const flagship = (EVENTS.find((e) => e.flagship) ?? EVENTS[0]) as EventItem;
  const others = EVENTS.filter((e) => e.slug !== flagship.slug);
  return (
    <>
      <section className="relative flex min-h-[80vh] items-center overflow-hidden">
        <img src={heroBg} alt="" width={1920} height={1088} className="absolute inset-0 -z-10 h-full w-full animate-kenburns object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <GridFloor className="opacity-30" />
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="neon-text text-[10px] uppercase tracking-[0.3em] sm:text-xs md:text-sm">
            BMSCE IEEE PES & Sensors Council presents
          </motion.p>
          <h1 className="mx-auto mt-5 max-w-4xl text-[2.1rem] font-black leading-[1.05] sm:text-6xl md:text-8xl">
            {TITLE.split(" ").map((w, wi) => (
              <span key={w} className="block whitespace-nowrap">
                {w.split("").map((ch, i) => (
                  <motion.span key={i} initial={{ opacity: 0, y: 60, rotateX: 90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.3 + (wi * 7 + i) * 0.05, type: "spring" }} className={wi === 0 ? "inline-block text-gradient" : "inline-block"}>
                    {ch}
                  </motion.span>
                ))}
              </span>
            ))}
            <motion.span initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 }} data-text="2026" className="glitch mt-2 block text-2xl sm:text-4xl md:text-5xl">2026</motion.span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="mx-auto mt-5 max-w-xl px-2 text-sm text-muted-foreground sm:text-base">
            A week of drones, robots and smart sensing, led by our flagship Hardware Hackathon. Build it, fly it, demo it.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.45 }} className="mt-4 flex justify-center px-2">
            <span className="hud cyber-clip neon-text inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm">
              <CalendarDays className="size-3.5" />
              {DATES_LABEL}
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <RegisterButton href={DEFAULT_REGISTER_URL} className="px-5 py-3 text-sm sm:px-6" />
            <Link to="/events" className="sweep cyber-clip border border-primary/50 bg-primary/5 px-5 py-3 text-sm font-semibold transition hover:bg-primary/10 sm:px-6 sm:text-base">Explore Events</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }} className="mx-auto mt-10 w-full max-w-md">
            <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:text-[11px]">{NEXT_EVENT_LABEL}</p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {cd.map(([l, v]) => (
                <div key={l} className="hud ticks cyber-clip px-1 py-3">
                  <p className="neon-text font-display text-lg font-bold sm:text-2xl md:text-3xl">{String(v).padStart(2, "0")}</p>
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground sm:text-[10px]">{l}</p>
                </div>
              ))}
            </div>
            <Link to="/events" className="hud cyber-clip mt-4 inline-flex items-center gap-2 px-5 py-2 text-[11px] uppercase tracking-widest text-primary transition hover:bg-primary/10">
              <Sparkles className="size-3.5" />Flagship: Hardware Hackathon
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <SectionTitle kicker="Flagship Event" title="The headline event" />
        <EventCard e={flagship} wide />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <SectionTitle kicker="About" title="What is Sensors Week?" />
        <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
          A week-long tech fest by the BMSCE IEEE Power & Energy Society and Sensors Council, celebrating the tiny devices that make machines aware of the world.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
          The week centres on our flagship <span className="font-semibold text-foreground">Hardware Hackathon</span> — <span className="font-semibold text-foreground">SENSORS ENCLAVE 4.0</span> — where teams design, build and demo sensor-powered hardware. Alongside it come hands-on workshops: SENSORS FUSION, KERNELX and GESTURE AI.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {[[Radio, "Sensors"], [Cpu, "Embedded"], [Wifi, "IoT"], [Zap, "Energy"]].map(([Icon, l], i) => {
            const I = Icon as typeof Cpu;
            return (
              <motion.div key={l as string} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ rotate: -3, scale: 1.05 }} className="sweep glass rounded-2xl p-5 text-center sm:p-6">
                <I className="mx-auto size-7 animate-floaty text-primary sm:size-8" style={{ animationDelay: `${i * 0.4}s` }} />
                <p className="mt-3 font-display text-xs sm:text-sm">{l as string}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <SectionTitle kicker="Also happening" title="Sign up for these" />
        <div className="mx-auto grid max-w-2xl gap-6">
          {others.map((e, i) => <EventCard key={e.slug} e={e} i={i} />)}
        </div>
        <div className="mt-8 text-center"><Link to="/events" className="text-sm text-primary hover:underline">See all events →</Link></div>
      </section>
    </>
  );
}
