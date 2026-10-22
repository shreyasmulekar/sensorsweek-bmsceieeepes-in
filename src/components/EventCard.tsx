import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, MapPin, Users, Trophy, Ticket } from "lucide-react";
import type { EventItem } from "@/lib/site";
import { RegisterButton } from "./Layout";

const STATUS: Record<EventItem["status"], string> = {
  "REGISTRATIONS OPEN": "bg-primary/15 text-primary",
  "CLOSING SOON": "bg-accent/20 text-accent-foreground",
  "EVENT FULL": "bg-destructive/20 text-destructive",
  "REGISTRATIONS CLOSED": "bg-muted text-muted-foreground",
  "COMING SOON": "bg-secondary text-muted-foreground",
};

export function EventCard({ e, i = 0 }: { e: EventItem; i?: number }) {
  const [more, setMore] = useState(false);
  const canRegister = e.status === "REGISTRATIONS OPEN" || e.status === "CLOSING SOON";
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
      whileHover={{ y: -8 }}
      className="glass group flex flex-col rounded-2xl p-6 transition-shadow hover:shadow-glow"
    >
      <div className="flex items-start justify-between">
        <span className="text-4xl transition-transform group-hover:scale-125 group-hover:rotate-12">{e.icon}</span>
        <span className={`rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider ${STATUS[e.status]}`}>{e.status}</span>
      </div>
      <h3 className="mt-4 text-xl font-bold">{e.name}</h3>
      <p className="text-sm text-primary">{e.tagline}</p>
      <p className="mt-3 text-sm text-muted-foreground">{e.description}</p>
      <AnimatePresence>
        {more && (
          <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 space-y-2 overflow-hidden text-sm">
            <li className="flex gap-2"><Calendar className="size-4 text-primary" />{e.date}</li>
            <li className="flex gap-2"><Clock className="size-4 text-primary" />{e.time}</li>
            <li className="flex gap-2"><MapPin className="size-4 text-primary" />{e.venue}</li>
            <li className="flex gap-2"><Users className="size-4 text-primary" />{e.team}</li>
            <li className="flex gap-2"><Ticket className="size-4 text-primary" />{e.fee}</li>
            {e.prize && <li className="flex gap-2"><Trophy className="size-4 text-primary" />Prize pool {e.prize}</li>}
          </motion.ul>
        )}
      </AnimatePresence>
      <div className="mt-auto flex items-center gap-3 pt-6">
        <button onClick={() => setMore(!more)} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">{more ? "Less" : "View Details"}</button>
        {canRegister ? <RegisterButton className="px-4 py-2 text-sm">Register</RegisterButton> : <span className="text-xs text-muted-foreground">Not open</span>}
      </div>
    </motion.article>
  );
}
