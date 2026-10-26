import { describe, expect, it } from "vitest";
import { DEFAULT_REGISTER_URL, EMAIL, EVENTS, FAQS, HACKATHON_REGISTER_URL, REGISTER_URL, SCHEDULE } from "@/lib/site";

describe("Confirmed venues and registration destinations", () => {
  it("shows the poster-confirmed AI-ML Seminar Hall venue for SENSORS FUSION", () => {
    expect(EVENTS.find((e) => e.slug === "sensors-fusion")?.venue).toBe("AI-ML Seminar Hall, BMSCE");
    expect(SCHEDULE.flatMap((d) => d.items).find((e) => e.n.startsWith("SENSORS FUSION"))?.v).toBe("AI-ML Seminar Hall, BMSCE");
    expect(EVENTS.filter((e) => /tba/i.test(e.venue))).toHaveLength(0);
  });

  it("uses the SENSORS FUSION form for general registration", () => {
    expect(REGISTER_URL).toBe("https://forms.gle/5bzWaxnJ652Bnoas7");
    expect(EVENTS.find((e) => e.slug === "sensors-fusion")?.registerUrl).toBe(REGISTER_URL);
  });

  it("sends SENSORS ENCLAVE registration to the SENSORS ENCLAVE form", () => {
    expect(EVENTS.find((e) => e.slug === "hardware-hackathon")?.registerUrl).toBe("https://forms.gle/ZU6mkHBzoMkC7P3w8");
    expect(EVENTS.find((e) => e.slug === "sensors-fusion")?.registerUrl).toBe(REGISTER_URL);
  });

  it("sends KERNELX and GESTURE AI to their own forms", () => {
    expect(EVENTS.find((e) => e.slug === "kernelx")?.registerUrl).toBe("https://forms.gle/iL7aNqfXrGQATvJc8");
    expect(EVENTS.find((e) => e.slug === "gesture-ai")?.registerUrl).toBe("https://forms.gle/gVpKF9EeQjTUkb2Z9");
  });
});

describe("Event posters", () => {
  it("attaches each uploaded poster to its own event", () => {
    expect(EVENTS.find((e) => e.slug === "hardware-hackathon")?.poster).toContain("sensors-enclave.jpg");
    expect(EVENTS.find((e) => e.slug === "sensors-fusion")?.poster).toContain("sensors-fusion-v2.png");
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

describe("GESTURE AI content", () => {
  const gesture = EVENTS.find((e) => e.slug === "gesture-ai");

  it("never mentions OLED in the event details", () => {
    expect(gesture?.learn).not.toContain("Visual and physical actuation via 0.96-inch OLED displays, RGB LEDs and servo motors");
    expect(gesture?.learn?.some((l) => /oled/i.test(l))).toBe(false);
    expect(/oled/i.test(gesture?.description ?? "")).toBe(false);
    expect(FAQS.filter((f) => /gesture ai/i.test(f.q)).some((f) => /oled/i.test(f.a))).toBe(false);
  });

  it("drops both circled lines from the learn list", () => {
    expect(gesture?.learn).toEqual([
      "Basics of TinyML and sensors",
      "Real-time hands-on experience with motion sensing",
    ]);
  });
});

describe("Site-wide Register Now destination", () => {
  it("opens the SENSORS ENCLAVE hackathon form from the header, menu, FAQ and homepage hero", () => {
    expect(DEFAULT_REGISTER_URL).toBe("https://forms.gle/ZU6mkHBzoMkC7P3w8");
    expect(DEFAULT_REGISTER_URL).toBe(HACKATHON_REGISTER_URL);
    expect(DEFAULT_REGISTER_URL).not.toBe(REGISTER_URL);
  });

  it("still sends each event's own Register button to its own form", () => {
    expect(EVENTS.find((e) => e.slug === "sensors-fusion")?.registerUrl).toBe(REGISTER_URL);
    expect(EVENTS.find((e) => e.slug === "hardware-hackathon")?.registerUrl).toBe(HACKATHON_REGISTER_URL);
  });
});

describe("Main contact address", () => {
  it("uses ieee.pes@bmsce.ac.in as the site-wide contact email", () => {
    expect(EMAIL).toBe("ieee.pes@bmsce.ac.in");
    expect(EMAIL).not.toBe("ieeepes@bmsce.ac.in");
  });
});