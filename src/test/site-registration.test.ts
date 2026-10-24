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

describe("Poster-confirmed times and venues", () => {
  const item = (slug: string) => EVENTS.find((e) => e.slug === slug);

  it("starts the hackathon at 10 AM at BMS College of Engineering, Basavanagudi", () => {
    expect(item("hardware-hackathon")?.time).toBe("10 AM onwards (24 hours)");
    expect(item("hardware-hackathon")?.venue).toBe("BMS College of Engineering, Basavanagudi");
    expect(SCHEDULE.flatMap((d) => d.items).find((e) => e.n.startsWith("SENSORS ENCLAVE 4.0 – 24-Hour"))?.t).toBe("10 AM onwards");
  });

  it("runs KERNELX from 2:00 PM to 5:30 PM, as printed on its poster", () => {
    expect(item("kernelx")?.time).toBe("2:00 PM – 5:30 PM");
    expect(EVENTS.some((e) => /2:30/.test(e.time))).toBe(false);
    expect(SCHEDULE.flatMap((d) => d.items).some((e) => /2:30/.test(e.t))).toBe(false);
    expect(FAQS.some((f) => /2:30/.test(f.a))).toBe(false);
  });

  it("keeps SENSORS FUSION and GESTURE AI at their printed afternoon times", () => {
    expect(item("sensors-fusion")?.time).toBe("2:00 PM – 6:00 PM");
    expect(item("gesture-ai")?.time).toBe("2:00 PM – 5:00 PM");
    expect(item("gesture-ai")?.date).toBe("Thu, 5 Nov 2026");
  });
});