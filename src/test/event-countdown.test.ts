import { describe, expect, it } from "vitest";
import { EVENT_ACCENT, EVENTS, eventStartMs } from "@/lib/site";

describe("event countdowns", () => {
  it("counts down to each event's start in Bengaluru time", () => {
    const fusion = EVENTS.find((e) => e.slug === "sensors-fusion");
    // 2:00 PM IST on 2 Nov 2026 is 08:30 UTC.
    expect(eventStartMs(fusion!)).toBe(Date.UTC(2026, 10, 2, 8, 30));

    const enclave = EVENTS.find((e) => e.slug === "hardware-hackathon");
    // 10:00 AM IST on 31 Oct 2026 is 04:30 UTC.
    expect(eventStartMs(enclave!)).toBe(Date.UTC(2026, 9, 31, 4, 30));

    const kernelx = EVENTS.find((e) => e.slug === "kernelx");
    expect(eventStartMs(kernelx!)).toBe(Date.UTC(2026, 10, 3, 8, 30));

    const gesture = EVENTS.find((e) => e.slug === "gesture-ai");
    expect(eventStartMs(gesture!)).toBe(Date.UTC(2026, 10, 5, 8, 30));
  });

  it("gives every event a countdown target and a neon accent", () => {
    for (const e of EVENTS) {
      expect(eventStartMs(e)).toBeTypeOf("number");
      expect(EVENT_ACCENT[e.slug]).toMatch(/^var\(--ev-/);
    }
  });
});
