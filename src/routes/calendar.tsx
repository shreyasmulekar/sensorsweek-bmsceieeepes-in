import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { queryOptions, useQuery, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { SectionTitle } from "@/components/Layout";
import { EVENTS } from "@/lib/site";
import { addCustomEvent, getCalendarRole, listCustomEvents, removeCustomEvent } from "@/lib/calendar.functions";
import {
  dayNumber,
  entriesFromCustom,
  entriesFromEvents,
  isoFromTime,
  monthLabel,
  monthWeeks,
  prettyDate,
  type CalEntry,
} from "@/lib/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useNow } from "@/lib/useNow";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar | Sensors Week 2026" },
      { name: "description", content: "Monthly calendar of Sensors Week 2026 events at BMSCE — dates, times, fees and registration links." },
      { property: "og:title", content: "Calendar | Sensors Week 2026" },
      { property: "og:description", content: "Monthly calendar of Sensors Week 2026 events at BMSCE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(customEventsQueryOptions),
  component: CalendarPage,
});

const customEventsQueryOptions = queryOptions({
  queryKey: ["calendar", "custom-events"],
  queryFn: () => listCustomEvents(),
});

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EMPTY_FORM = {
  name: "",
  tagline: "",
  event_date: "",
  start_time: "",
  end_time: "",
  venue: "BMSCE",
  fee: "",
  register_url: "",
};

function CalendarPage() {
  const { data } = useSuspenseQuery(customEventsQueryOptions);
  const now = useNow();
  // An event whose date and time have passed can no longer be registered for.
  const isClosed = (e: CalEntry) => e.endMs != null && now != null && now >= e.endMs;
  const queryClient = useQueryClient();

  const entries = useMemo(
    () => [...entriesFromEvents(EVENTS), ...entriesFromCustom(data.rows)].sort((a, b) => a.day.localeCompare(b.day)),
    [data.rows],
  );

  const first = entries[0]?.day;
  const [cursor, setCursor] = useState(() =>
    first ? { year: Number(first.slice(0, 4)), month: Number(first.slice(5, 7)) } : { year: 2026, month: 10 },
  );
  const [today, setToday] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setToday(isoFromTime(Date.now()));
  }, []);

  // The editor check runs only in the browser — server rendering has no session.
  const { data: role } = useQuery({
    queryKey: ["calendar", "role"],
    queryFn: async () => {
      try {
        return await getCalendarRole();
      } catch {
        return { isAdmin: false };
      }
    },
    enabled: mounted,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = Boolean(role?.isAdmin);

  const weeks = useMemo(() => monthWeeks(cursor.year, cursor.month), [cursor]);
  const byDay = useMemo(() => {
    const map: Record<string, CalEntry[]> = {};
    for (const e of entries) (map[e.day] ||= []).push(e);
    return map;
  }, [entries]);

  const monthEntries = useMemo(
    () => entries.filter((e) => e.day.startsWith(`${cursor.year}-${String(cursor.month).padStart(2, "0")}`)),
    [entries, cursor],
  );

  function shift(delta: number) {
    setCursor((c) => {
      const m = c.month - 1 + delta;
      return { year: c.year + Math.floor(m / 12), month: (m % 12) + 1 };
    });
  }

  function removeEntry(id: string) {
    void (async () => {
      try {
        await removeCustomEvent({ data: { id } });
        await queryClient.invalidateQueries({ queryKey: customEventsQueryOptions.queryKey });
        toast.success("Event removed from the calendar.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not remove the event.");
      }
    })();
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <SectionTitle kicker="Plan your week" title="Calendar" />

      <div className="glass mt-8 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-primary sm:text-2xl">{monthLabel(cursor.year, cursor.month)}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => shift(-1)} aria-label="Previous month" className="rounded-full border border-primary/40 p-2 transition-colors hover:bg-primary/10">
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => {
                const now = new Date();
                setToday(isoFromTime(now.getTime()));
                setCursor({ year: now.getFullYear(), month: now.getMonth() + 1 });
              }}
              className="rounded-full border border-primary/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-primary/10"
            >
              This month
            </button>
            <button onClick={() => shift(1)} aria-label="Next month" className="rounded-full border border-primary/40 p-2 transition-colors hover:bg-primary/10">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">
          {WEEKDAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {weeks.flat().map((day) => {
            const inMonth = day.startsWith(`${cursor.year}-${String(cursor.month).padStart(2, "0")}`);
            const items = byDay[day] ?? [];
            return (
              <div
                key={day}
                className={`min-h-20 rounded-lg border p-1 sm:min-h-28 sm:p-2 ${inMonth ? "border-primary/15 bg-background/40" : "border-transparent opacity-40"} ${day === today ? "ring-2 ring-primary" : ""}`}
              >
                <span className={`text-[10px] font-semibold sm:text-xs ${day === today ? "text-primary" : "text-muted-foreground"}`}>
                  {dayNumber(day)}
                </span>
                <ul className="mt-1 space-y-1">
                  {items.map((e) => (
                    <li key={e.id} className="rounded bg-primary/10 px-1 py-1 text-[9px] leading-tight sm:text-[11px]">
                      <span className="block truncate font-semibold text-primary" title={e.name}>{e.name}</span>
                      {e.time ? <span className="block truncate text-muted-foreground" title={e.time}>{e.time}</span> : null}
                      {e.fee ? <span className="hidden truncate text-muted-foreground sm:block" title={e.fee}>{e.fee}</span> : null}
                      {e.registerUrl && !isClosed(e) ? (
                        <a href={e.registerUrl} target="_blank" rel="noreferrer" className="block truncate font-semibold text-primary hover:underline">
                          Register
                        </a>
                      ) : e.registerUrl && isClosed(e) ? (
                        <span className="block truncate font-semibold text-muted-foreground">Closed</span>
                      ) : null}
                      {isAdmin && e.custom ? (
                        <button onClick={() => removeEntry(e.id)} className="mt-0.5 inline-flex items-center gap-1 text-[9px] text-warn hover:underline">
                          <Trash2 className="size-2.5" />Remove
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-primary">
          <CalendarDays className="size-4" />
          {monthLabel(cursor.year, cursor.month)} — {monthEntries.length} {monthEntries.length === 1 ? "session" : "sessions"}
        </h3>
        <ul className="mt-3 space-y-3">
          {monthEntries.map((e) => (
            <li key={e.id} className="glass flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3">
              <span className="min-w-0">
                <span className="block font-semibold">{e.name}</span>
                <span className="block text-sm text-muted-foreground">
                  {prettyDate(e.day)} · {e.time || "Time TBA"} · {e.venue || "Venue TBA"}{e.fee ? ` · ${e.fee}` : ""}
                </span>
              </span>
              {e.registerUrl && !isClosed(e) ? (
                <a
                  href={e.registerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
                >
                  Register
                </a>
              ) : e.registerUrl && isClosed(e) ? (
                <span className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">Closed</span>
              ) : null}
            </li>
          ))}
          {!monthEntries.length ? (
            <li className="glass rounded-xl px-4 py-3 text-sm text-muted-foreground">
              Nothing scheduled in {monthLabel(cursor.year, cursor.month)} yet.
            </li>
          ) : null}
        </ul>
      </div>

      {mounted && isAdmin ? <AddEventPanel /> : null}
    </section>
  );
}

function AddEventPanel() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof typeof EMPTY_FORM>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await addCustomEvent({ data: form });
      await queryClient.invalidateQueries({ queryKey: customEventsQueryOptions.queryKey });
      setForm(EMPTY_FORM);
      setOpen(false);
      toast.success("Event added — it now shows on the calendar.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save the event.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-10">
      <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
        <span className="text-sm text-muted-foreground">You are signed in as an editor — add a workshop yourself.</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            {open ? <X className="size-4" /> : <Plus className="size-4" />}
            {open ? "Close" : "Add event"}
          </button>
          <button
            onClick={() => void supabase.auth.signOut().then(() => window.location.reload())}
            className="rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary/10"
          >
            Sign out
          </button>
        </div>
      </div>

      {open ? (
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="glass mt-4 grid gap-3 rounded-2xl p-4 sm:grid-cols-2 sm:p-6"
        >
          <label className="block text-sm sm:col-span-2">
            <span className="text-muted-foreground">Event name *</span>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="SENSORS LAB 1.0" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:border-primary" />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-muted-foreground">One-line description</span>
            <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Hands-on workshop on…" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:border-primary" />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Date *</span>
            <input type="date" required value={form.event_date} onChange={(e) => set("event_date", e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:border-primary" />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Venue</span>
            <input value={form.venue} onChange={(e) => set("venue", e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:border-primary" />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Start time</span>
            <input value={form.start_time} onChange={(e) => set("start_time", e.target.value)} placeholder="2:00 PM" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:border-primary" />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">End time</span>
            <input value={form.end_time} onChange={(e) => set("end_time", e.target.value)} placeholder="5:00 PM" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:border-primary" />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Fee</span>
            <input value={form.fee} onChange={(e) => set("fee", e.target.value)} placeholder="IEEE ₹150 · Non-IEEE ₹200" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:border-primary" />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Registration link</span>
            <input value={form.register_url} onChange={(e) => set("register_url", e.target.value)} placeholder="https://forms.gle/…" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:border-primary" />
          </label>
          <button type="submit" disabled={busy} className="rounded-full bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow disabled:opacity-60 sm:col-span-2">
            {busy ? "Saving…" : "Add to calendar"}
          </button>
        </motion.form>
      ) : null}
    </div>
  );
}
