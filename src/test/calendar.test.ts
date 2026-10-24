import { describe, expect, it } from "vitest";
import { EVENTS } from "@/lib/site";
import { entriesFromCustom, entriesFromEvents, monthLabel, monthWeeks, prettyDate, type CustomEventRow } from "@/lib/calendar";

describe("Calendar is wired to the real event data", () => {
  const entries = entriesFromEvents(EVENTS);

  it("lists every day the hackathon runs, with its fee and its own form", () => {
    const hack = entries.filter((e) => e.name === "SENSORS ENCLAVE 4.0");
    expect(hack.map((e) => e.day)).toEqual(["2026-10-31", "2026-11-01"]);
    expect(hack[0]?.fee).toBe("IEEE Members ₹650 · Non-IEEE ₹900 (per team)");
    expect(hack[0]?.registerUrl).toBe("https://forms.gle/ZU6mkHBzoMkC7P3w8");
    expect(hack[0]?.time).toBe("10 AM onwards");
  });

  it("spans KERNELX across both of its days", () => {
    expect(entries.filter((e) => e.name === "KERNELX").map((e) => e.day)).toEqual(["2026-11-03", "2026-11-04"]);
  });

  it("keeps the single-day workshops on their own day with their printed fee", () => {
    expect(entries.find((e) => e.name === "SENSORS FUSION")?.day).toBe("2026-11-02");
    expect(entries.find((e) => e.name === "SENSORS FUSION")?.fee).toBe("IEEE Members ₹150 · Non-IEEE ₹200");
    expect(entries.find((e) => e.name === "GESTURE AI")?.day).toBe("2026-11-05");
    expect(entries.find((e) => e.name === "GESTURE AI")?.fee).toBe("IEEE Members ₹90 · Non-IEEE ₹130");
  });

  it("never invents a registration link for an event that has none", () => {
    expect(entries.every((e) => e.registerUrl === undefined || /^https:\/\//.test(e.registerUrl))).toBe(true);
  });
});

describe("Events added from the calendar page", () => {
  const row: CustomEventRow = {
    id: "abc",
    name: "SENSORS LAB 1.0",
    tagline: "Hands-on PCB workshop",
    event_date: "2026-12-12T00:00:00+00:00",
    start_time: "2:00 PM",
    end_time: "5:00 PM",
    venue: "BMSCE",
    fee: "IEEE ₹100",
    register_url: "https://forms.gle/example",
  };

  it("lands on the day it was set for, keeping time, fee and link", () => {
    const [entry] = entriesFromCustom([row]);
    expect(entry?.day).toBe("2026-12-12");
    expect(entry?.time).toBe("2:00 PM – 5:00 PM");
    expect(entry?.fee).toBe("IEEE ₹100");
    expect(entry?.registerUrl).toBe("https://forms.gle/example");
    expect(entry?.custom).toBe(true);
  });

  it("ignores a row without a real date instead of breaking the grid", () => {
    expect(entriesFromCustom([{ ...row, event_date: "" }])).toEqual([]);
  });
});

describe("Month grid", () => {
  it("starts the November 2026 grid on Sunday 1 November and covers the month", () => {
    const weeks = monthWeeks(2026, 11);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    expect(weeks[0]?.[0]).toBe("2026-11-01");
    expect(weeks.flat()).toContain("2026-11-30");
    expect(weeks.flat().at(-1)).toBe("2026-12-05");
    expect(monthLabel(2026, 11)).toBe("November 2026");
  });

  it("pads the October 2026 grid back to the Sunday before the 1st", () => {
    const weeks = monthWeeks(2026, 10);
    expect(weeks[0]?.[0]).toBe("2026-09-27");
    expect(weeks.flat()).toContain("2026-10-31");
  });

  it("prints a session's day the way the site writes dates", () => {
    expect(prettyDate("2026-11-01")).toBe("Sun 1 Nov");
    expect(prettyDate("2026-10-31")).toBe("Sat 31 Oct");
  });
});
