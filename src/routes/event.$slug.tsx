import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Share2, Sparkles, Ticket, Trophy, Users } from "lucide-react";
import { RegisterButton } from "@/components/Layout";
import { EVENTS, isTba, type EventItem } from "@/lib/site";
import { shareEvent } from "@/lib/share";
import { EventPoster } from "@/components/EventPoster";
import { EventCountdown } from "@/components/EventCountdown";

export const Route = createFileRoute("/event/$slug")({
  head: ({ params }) => {
    const e = EVENTS.find((x) => x.slug === params.slug);
    const title = e ? `${e.name} | Sensors Week 2026` : "Event | Sensors Week 2026";
    const desc = e ? `${e.tagline}. ${e.description}` : "Event details for Sensors Week 2026 at BMSCE.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(e?.poster?.startsWith("https://") ? [
          { property: "og:image", content: e.poster },
          { name: "twitter:image", content: e.poster },
        ] : []),
      ],
    };
  },
  component: EventPage,
});

function Fact({ icon: Icon, label, value, tba = false }: { icon: typeof Calendar; label: string; value: string; tba?: boolean }) {
  return (
    <li className="glass flex items-start gap-3 rounded-xl p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <span className="min-w-0 text-sm">
        <span className="text-muted-foreground">{label}: </span>
        <span className={`font-semibold ${tba ? "text-warn" : ""}`}>{value}</span>
      </span>
    </li>
  );
}

function EventPage() {
  const { slug } = Route.useParams();
  const e = EVENTS.find((x) => x.slug === slug);
  if (!e) throw notFound();
  const open = e.status === "REGISTRATIONS OPEN" || e.status === "CLOSING SOON";
  // Full link is only known in the browser, so fill it in after the page loads.
  const [url, setUrl] = useState("");
  useEffect(() => { setUrl(window.location.href); }, []);

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <Link to="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="size-4" />All events
      </Link>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass mt-6 overflow-hidden rounded-2xl p-5 sm:p-8">
        {e.poster ? (
          <div className="-mx-5 -mt-5 mb-6 sm:-mx-8 sm:-mt-8 sm:mb-8">
            <EventPoster src={e.poster} name={e.name} eager />
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-5xl">{e.icon}</span>
          {e.flagship && <span className="rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-semibold tracking-wider text-primary-foreground">FLAGSHIP</span>}
          <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground">{e.category}</span>
        </div>

        <h1 className="mt-4 break-words font-display text-2xl font-black sm:text-4xl">{e.name}</h1>
        <p className="mt-2 text-base text-primary sm:text-lg">{e.tagline}</p>
        {e.hook ? <p className="mt-3 text-sm italic text-muted-foreground">"{e.hook}"</p> : null}
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">{e.description}</p>
        {e.note ? <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">{e.note}</p> : null}

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          <Fact icon={Calendar} label="Date" value={e.date} tba={isTba(e.date)} />
          <Fact icon={Clock} label="Time" value={e.time} tba={isTba(e.time)} />
          <Fact icon={MapPin} label="Venue" value={isTba(e.venue) ? "TBA" : e.venue} tba={isTba(e.venue)} />
          <Fact icon={Ticket} label="Fee" value={e.fee} tba={isTba(e.fee)} />
          <Fact icon={Users} label="Team" value={e.team} />
          {e.prize ? <Fact icon={Trophy} label="Prize" value={e.prize} /> : null}
        </ul>

        <EventCountdown e={e} />

        {e.learn?.length ? (
          <div className="mt-6">
            <p className="flex items-center gap-2 font-semibold text-primary"><Sparkles className="size-4" />What you'll learn</p>
            <ul className="mt-2 list-disc space-y-1 border-l-2 border-primary/30 pl-6 text-sm text-muted-foreground">
              {e.learn.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </div>
        ) : null}

        {e.contacts?.length ? (
          <div className="mt-6">
            <p className="flex items-center gap-2 font-semibold text-primary"><Phone className="size-4" />Event contacts</p>
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 pl-6 text-sm">
              {e.contacts.map((c) => (
                <li key={c.phone}><a href={`tel:+91${c.phone}`} className="text-muted-foreground transition-colors hover:text-primary">{c.name} · {c.phone}</a></li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {open && e.registerUrl ? (
            <RegisterButton href={e.registerUrl} className="px-6 py-3 text-sm sm:text-base">Register Now</RegisterButton>
          ) : (
            <span className="glass rounded-full px-4 py-3 text-sm text-muted-foreground">Registrations opening soon — we'll post updates on Instagram</span>
          )}
          {e.brochure ? (
            <a href={e.brochure} target="_blank" rel="noreferrer" className="rounded-full border border-primary/50 px-5 py-3 text-sm font-semibold transition-colors hover:bg-primary/10">Brochure</a>
          ) : null}
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => shareEvent(e as EventItem)}
            className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-5 py-3 text-sm font-semibold transition-colors hover:bg-primary/10"
          ><Share2 className="size-4" />Share</motion.button>
        </div>
      </motion.div>

      {url ? (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Sharing this page? The link is <span className="break-all text-primary">{url}</span>
        </p>
      ) : null}
    </section>
  );
}
