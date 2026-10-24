import { describe, expect, it } from "vitest";
import { EVENTS, REGISTER_URL, SCHEDULE } from "@/lib/site";

describe("Confirmed venues and registration destinations", () => {
  it("uses BMSCE for the previously unconfirmed SENSORS FUSION venue", () => {
    expect(EVENTS.find((e) => e.slug === "sensors-fusion")?.venue).toBe("BMSCE");
    expect(SCHEDULE.flatMap((d) => d.items).find((e) => e.n.startsWith("SENSORS FUSION"))?.v).toBe("Venue: BMSCE");
    expect(EVENTS.filter((e) => /tba/i.test(e.venue))).toHaveLength(0);
  });

  it("uses the SENSORS FUSION form for general registration", () => {
    expect(REGISTER_URL).toBe("https://forms.gle/5bzWaxnJ652Bnoas7");
    expect(EVENTS.find((e) => e.slug === "sensors-fusion")?.registerUrl).toBe(REGISTER_URL);
  });

  it("sends SENSORS ENCLAVE registration to the SENSORS FUSION form", () => {
    expect(EVENTS.find((e) => e.slug === "hardware-hackathon")?.registerUrl).toBe(REGISTER_URL);
    expect(EVENTS.some((e) => e.registerUrl === "https://forms.gle/ZU6mkHBzoMkC7P3w8")).toBe(false);
  });
});

describe("Event posters", () => {
  it("attaches each uploaded poster to its own event", () => {
    expect(EVENTS.find((e) => e.slug === "hardware-hackathon")?.poster).toContain("sensors-enclave.jpg");
    expect(EVENTS.find((e) => e.slug === "sensors-fusion")?.poster).toContain("sensors-fusion.jpg");
    expect(EVENTS.find((e) => e.slug === "kernelx")?.poster).toContain("kernelx.jpg");
    expect(EVENTS.find((e) => e.slug === "gesture-ai")?.poster).toContain("gesture-ai.jpg");
  });
});