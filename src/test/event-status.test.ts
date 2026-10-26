import { describe, expect, it } from "vitest";
import { EVENTS, eventEndMs, eventStatus } from "@/lib/site";

const bySlug = (slug: string) => EVENTS.find((e) => e.slug === slug)!;

describe("automatic registration closing", () => {
  it("uses the last listed time on the final day as the finish moment", () => {
    // SENSORS FUSION: 2:00 PM - 6:00 PM on 2 Nov 2026 -> 6:00 PM IST = 12:30 UTC.
    expect(eventEndMs(bySlug("sensors-fusion"))).toBe(Date.UTC(2026, 10, 2, 12, 30));

    // KERNELX runs 3-4 Nov, 2:00 PM - 5:30 PM -> ends 5:30 PM IST on 4 Nov = 12:00 UTC.
    expect(eventEndMs(bySlug("kernelx"))).toBe(Date.UTC(2026, 10, 4, 12, 0));

    // SENSORS ENCLAVE: 24 hours from 10 AM on 31 Oct -> ends 10 AM IST on 1 Nov = 04:30 UTC.
    expect(eventEndMs(bySlug("hardware-hackathon"))).toBe(Date.UTC(2026, 10, 1, 4, 30));
  });

  it("closes registration once the event is over, and only then", () => {
    const fusion = bySlug("sensors-fusion");
    const end = eventEndMs(fusion)!;

    // A minute before the finish, the listed status still stands.
    expect(eventStatus(fusion, end - 60_000)).toBe("REGISTRATIONS OPEN");
    // At the finish moment and after it, registration closes by itself.
    expect(eventStatus(fusion, end)).toBe("REGISTRATIONS CLOSED");
    expect(eventStatus(fusion, end + 3_600_000)).toBe("REGISTRATIONS CLOSED");
    // Before the browser knows the time, nothing is hidden.
    expect(eventStatus(fusion, null)).toBe("REGISTRATIONS OPEN");
  });

  it("closes every event eventually", () => {
    for (const e of EVENTS) {
      const end = eventEndMs(e);
      expect(end).toBeTypeOf("number");
      expect(eventStatus(e, (end as number) + 1000)).toBe("REGISTRATIONS CLOSED");
    }
  });
});
