// Calendar helpers shared by the page and its tests. Browser-safe: no server code here.
import { EVENTS, eventEndMs, type EventItem } from "@/lib/site";

export type CalEntry = {
  id: string;
  name: string;
  tagline: string;
  day: string; // ISO yyyy-mm-dd
  time: string;
  venue: string;
  fee: string;
  registerUrl?: string | undefined;
  endMs?: number | null;
  custom: boolean;
};

export type CustomEventRow = {
  id: string;
  name: string;
  tagline: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  fee: string;
  register_url: string;
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;

// "10 AM onwards (24 hours)" -> "10 AM onwards"
function shortTime(t: string) {
  return t.replace(/\s*\(.*?\)\s*$/, "").trim();
}

export function eachDate(from: string, to: string): string[] {
  if (!ISO.test(from)) return [];
  const fp = from.split("-");
  const y = Number(fp[0]);
  const m = Number(fp[1]);
  const d = Number(fp[2]);
  const end = ISO.test(to) && to > from ? to : from;
  const ep = end.split("-");
  const stop = Date.UTC(Number(ep[0]), Number(ep[1]) - 1, Number(ep[2]));
  const out: string[] = [];
  for (let t = Date.UTC(y, m - 1, d); t <= stop; t += 864e5) out.push(isoFromTime(t));
  return out;
}

export function isoFromTime(t: number): string {
  const dt = new Date(t);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${dt.getUTCFullYear()}-${p(dt.getUTCMonth() + 1)}-${p(dt.getUTCDate())}`;
}

// Every day an event runs, one entry per day, straight from the shared event data.
export function entriesFromEvents(events: EventItem[] = EVENTS): CalEntry[] {
  const out: CalEntry[] = [];
  for (const e of events) {
    for (const day of eachDate(e.day, e.endDay ?? e.day)) {
      out.push({
        id: `${e.slug}-${day}`,
        name: e.name,
        tagline: e.tagline,
        day,
        time: shortTime(e.time),
        venue: e.venue,
        fee: e.fee,
        registerUrl: e.registerUrl,
        endMs: eventEndMs(e),
        custom: false,
      });
    }
  }
  return out;
}

export function entriesFromCustom(rows: CustomEventRow[]): CalEntry[] {
  return rows
    .filter((r) => ISO.test(String(r.event_date).slice(0, 10)))
    .map((r) => ({
      id: r.id,
      name: r.name,
      tagline: r.tagline ?? "",
      day: String(r.event_date).slice(0, 10),
      time: [r.start_time, r.end_time].filter(Boolean).join(" – "),
      venue: r.venue ?? "",
      fee: r.fee ?? "",
      registerUrl: r.register_url || undefined,
      custom: true,
    }));
}

// Six-column-agnostic month grid: whole weeks (Sunday first) covering the month.
export function monthWeeks(year: number, month: number): string[][] {
  const first = Date.UTC(year, month - 1, 1);
  const lead = new Date(first).getUTCDay(); // 0 = Sunday
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const total = Math.ceil((lead + daysInMonth) / 7) * 7;
  const days: string[] = [];
  for (let i = 0; i < total; i++) days.push(isoFromTime(first - lead * 864e5 + i * 864e5));
  const weeks: string[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

export function monthLabel(year: number, month: number): string {
  const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${names[month - 1] ?? ""} ${year}`;
}

export function dayNumber(iso: string): number {
  return Number(iso.slice(8, 10)) || 0;
}

export function sameDay(a: string, b: string): boolean {
  return a === b;
}

// The month the calendar should open on: the next event, or the first event if all are past.
export function firstEventMonth(entries: CalEntry[]): { year: number; month: number } | null {
  const days = entries.map((e) => e.day).filter((d) => ISO.test(d)).sort();
  if (!days.length) return null;
  const today = isoFromTime(Date.now());
  const next = days.find((d) => d >= today) ?? days[0] ?? "";
  if (!ISO.test(next)) return null;
  return { year: Number(next.slice(0, 4)), month: Number(next.slice(5, 7)) };
}

const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-11-01" -> "Sun 1 Nov" for the list under the grid.
export function prettyDate(iso: string): string {
  const s = String(iso).slice(0, 10);
  if (!ISO.test(s)) return s;
  const dt = new Date(Date.UTC(Number(s.slice(0, 4)), Number(s.slice(5, 7)) - 1, Number(s.slice(8, 10))));
  return `${WD[dt.getUTCDay()] ?? ""} ${dt.getUTCDate()} ${MO[dt.getUTCMonth()] ?? ""}`;
}
