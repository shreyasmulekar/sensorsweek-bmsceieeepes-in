import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, type MotionStyle } from "motion/react";
import { Calendar, Clock, MapPin, Users, Trophy, Ticket, Phone, Sparkles, Share2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { REGISTER_URL, isTba, type EventItem } from "@/lib/site";
import { shareEvent } from "@/lib/share";
import { RegisterButton } from "./Layout";
import { EventPoster } from "./EventPoster";

const STATUS: Record<EventItem["status"], string> = {
  "REGISTRATIONS OPEN": "bg-primary/15 text-primary",
  "CLOSING SOON": "bg-warn/20 text-warn",
  "EVENT FULL": "bg-destructive/20 text-destructive",
  "REGISTRATIONS CLOSED": "bg-muted text-muted-foreground",
  "COMING SOON": "bg-secondary text-muted-foreground",
};

// Each event gets its own neon accent so the listings read as distinct.
const ACCENT: Record<string, string> = {
  "hardware-hackathon": "var(--ev-cyan)",
  "sensors-fusion": "var(--ev-violet)",
  kernelx: "var(--ev-amber)",
  "gesture-ai": "var(--ev-lime)",
};

function Meta({ e }: { e: EventItem }) {
  return (
    <ul className="mt-5 space-y-2 text-sm">
      <li className="flex items-start gap-2">
        <Calendar className="mt-0.5 size-4 shrink-0 text-primary" />
        <span className="min-w-0"><span className="text-muted-foreground">Date: </span><span className={isTba(e.date) ? "font-semibold text-warn" : "font-semibold"}>{e.date}</span></span>
      </li>
      <li className="flex items-start gap-2">
        <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
        <span className="min-w-0"><span className="text-muted-foreground">Time: </span><span className={isTba(e.time) ? "font-semibold text-warn" : "font-semibold"}>{e.time}</span></span>
      </li>
      <li className="flex items-start gap-2">
        <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
        <span className="min-w-0">
          <span className="text-muted-foreground">Venue: </span>
          <span className={`font-semibold ${isTba(e.venue) ? "text-warn" : ""}`}>{isTba(e.venue) ? "TBA" : e.venue}</span>
        </span>
      </li>
    </ul>
  );
}

export function EventCard({ e, i = 0, wide = false }: { e: EventItem; i?: number; wide?: boolean }) {
  const [more, setMore] = useState(false);
  const open = e.status === "REGISTRATIONS OPEN" || e.status === "CLOSING SOON";
  const canRegister = open && !!e.registerUrl;
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
      whileHover={{ y: -6 }}
      style={{ "--ev": ACCENT[e.slug] ?? "var(--ev-cyan)" } as MotionStyle}
      className={`event-card glass group flex h-full flex-col rounded-2xl p-5 sm:p-6 ${e.flagship ? "neon-frame" : ""}`}
    >
      {e.poster ? (
        <div className="ev-drop sweep -mx-5 -mt-5 mb-5 shrink-0 sm:-mx-6 sm:-mt-6 sm:mb-6">
          <EventPoster src={e.poster} name={e.name} />
        </div>
      ) : null}
      <div className={`min-w-0 ${wide ? "md:flex md:items-start md:justify-between md:gap-10" : ""}`}>
        <div className="min-w-0 md:flex-1">
          <div className="flex items-start justify-between gap-3">
            <span className={`transition-transform group-hover:scale-125 group-hover:rotate-12 ${wide ? "text-5xl" : "text-4xl"}`}>{e.icon}</span>
            <div className="flex shrink-0 flex-col items-end gap-2">
              {e.flagship && <span className="animate-flicker rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-semibold tracking-wider text-primary-foreground shadow-glow">FLAGSHIP</span>}
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider ${STATUS[e.status]}`}>
                {open && <span aria-hidden className="animate-blink inline-block size-1.5 rounded-full bg-current" />}
                {e.status}
              </span>
            </div>
          </div>
          <h3 className={`mt-4 break-words font-bold ${wide ? "text-2xl sm:text-3xl md:text-4xl" : "text-xl"}`}>
            <Link to="/event/$slug" params={{ slug: e.slug }} className="ev-title transition-colors">{e.name}</Link>
          </h3>
          <p className={`text-primary ${wide ? "mt-1 text-base sm:text-lg" : "text-sm"}`}>{e.tagline}</p>
          <p className={`mt-3 text-muted-foreground ${wide ? "max-w-xl" : "text-sm"}`}>{e.description}</p>
          {wide && e.hook ? <p className="mt-3 max-w-xl text-sm italic text-muted-foreground">"{e.hook}"</p> : null}
          {e.note ? <p className="mt-3 rounded-xl bg-primary/10 px-3 py-2 text-xs font-medium text-primary sm:text-sm">{e.note}</p> : null}
        </div>
        <div className={`min-w-0 ${wide ? "md:w-72 md:shrink-0" : ""}`}>
          <Meta e={e} />
        </div>
      </div>

      {more && (
        <ul id={`details-${e.slug}`} className="mt-4 space-y-2 text-sm">
          <li className="flex gap-2"><Users className="size-4 shrink-0 text-primary" /><span className="min-w-0">{e.team}</span></li>
          <li className="flex gap-2"><Ticket className="size-4 shrink-0 text-primary" /><span className="min-w-0">{e.fee}</span></li>
          <li className="flex gap-2"><MapPin className="size-4 shrink-0 text-primary" /><span className="min-w-0">Venue: <span className={isTba(e.venue) ? "font-semibold text-warn" : "font-semibold"}>{isTba(e.venue) ? "TBA" : e.venue}</span></span></li>
          {e.prize && <li className="flex gap-2"><Trophy className="size-4 shrink-0 text-primary" /><span>Prize pool: {e.prize}</span></li>}
          {e.learn?.length ? (
            <li className="pt-2">
              <p className="flex items-center gap-2 font-semibold text-primary"><Sparkles className="size-4" />What you'll learn</p>
              <ul className="mt-2 space-y-1 border-l-2 border-primary/30 pl-4 text-muted-foreground">
                {e.learn.map((l) => <li key={l} className="list-disc">{l}</li>)}
              </ul>
            </li>
          ) : null}
          {e.contacts?.length ? (
            <li className="pt-2">
              <p className="flex items-center gap-2 font-semibold text-primary"><Phone className="size-4" />Event contacts</p>
              <ul className="mt-2 space-y-1 pl-6">
                {e.contacts.map((c) => (
                  <li key={c.phone}>
                    <a href={`tel:+91${c.phone}`} className="text-muted-foreground transition-colors hover:text-primary">{c.name} · {c.phone}</a>
                  </li>
                ))}
              </ul>
            </li>
          ) : null}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 pr-20 pt-6 sm:gap-3 sm:pr-0">
        <button
          onClick={() => setMore(!more)}
          aria-expanded={more}
          aria-controls={`details-${e.slug}`}
          className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary"
        >{more ? "Less" : "View Details"}</button>
        <button
          onClick={() => shareEvent(e)}
          aria-label={`Share ${e.name}`}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary"
        ><Share2 className="size-4" />Share</button>
        {e.brochure ? (
          <a href={e.brochure} target="_blank" rel="noreferrer" className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary">Brochure</a>
        ) : null}
        {canRegister ? (
          <RegisterButton href={e.registerUrl ?? REGISTER_URL} className="px-4 py-2 text-sm">Register</RegisterButton>
        ) : e.flagship ? (
          <motion.a
            href="https://instagram.com/bmsce_ieeepes" target="_blank" rel="noreferrer"
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
          >Get updates</motion.a>
        ) : (
          <span className="text-xs text-muted-foreground">{e.registerUrl ? "Not open" : "Registrations opening soon"}</span>
        )}
      </div>
    </motion.article>
  );
}
