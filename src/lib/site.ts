// Central place to update links, dates and events.
export const REGISTER_URL = "https://forms.gle/5bzWaxnJ652Bnoas7";
export const HACKATHON_REGISTER_URL = "https://forms.gle/ZU6mkHBzoMkC7P3w8";
export const HACKATHON_BROCHURE = "https://drive.google.com/drive/folders/1iYDZCwXgomc_AAmCVFhDCLiz8kAbS0gc?usp=sharing";
export const EVENT_START = new Date("2026-10-26T23:59:00+05:30");
export const DATES_LABEL = "30 Oct – 4 Nov 2026";
export const NEXT_EVENT_LABEL = "ROUND 1 DEADLINE · Mon 26 Oct, 11:59 PM";
export const INSTAGRAM = "https://instagram.com/bmsce_ieeepes";
export const EMAIL = "ieeepes@bmsce.ac.in";
export const SPONSORS = ["Mystic Grace"];

export type Contact = { name: string; phone: string };

// Only SENSORS FUSION shows organiser names for now.
export const SENSORS_FUSION_CONTACTS: Contact[] = [
  { name: "Shreshta C S", phone: "7406968671" },
  { name: "Shreyas M", phone: "6362695884" },
];

// Only the SENSORS ENCLAVE 4.0 card shows these query contacts.
export const HACKATHON_CONTACTS: Contact[] = [
  { name: "Sakshi", phone: "8660572813" },
  { name: "Sadhan", phone: "6361174069" },
  { name: "Pratishtha", phone: "7298144562" },
];

export type EventItem = {
  slug: string;
  name: string;
  tagline: string;
  hook?: string;
  description: string;
  learn?: string[];
  date: string;
  day: string;
  time: string;
  venue: string;
  fee: string;
  prize?: string;
  note?: string;
  brochure?: string;
  team: string;
  contacts?: Contact[];
  registerUrl?: string;
  flagship?: boolean;
  category: "Workshop" | "Competition" | "Talk" | "Exhibition";
  status: "REGISTRATIONS OPEN" | "CLOSING SOON" | "EVENT FULL" | "REGISTRATIONS CLOSED" | "COMING SOON";
  icon: string;
};

export const EVENTS: EventItem[] = [
  {
    slug: "hardware-hackathon",
    name: "SENSORS ENCLAVE 4.0",
    tagline: "A 24-Hour Hardware Hackathon",
    hook: "Think beyond the obvious. Build beyond the expected.",
    description:
      "Decode hidden signals, uncover anomalies, tackle real-world challenges, and turn bold ideas into working hardware prototypes in just 24 hours. Certificates, attendance, food and snacks will be provided.",
    note: "Round 1 is FREE ENTRY — submit your idea online by 11:59 PM, 26 Oct 2026. Shortlisted teams advance to the next round.",
    date: "Sat 31 Oct – Sun 1 Nov 2026",
    day: "2026-10-31",
    time: "24 hours",
    venue: "BMS College of Engineering",
    fee: "IEEE Members ₹650 · Non-IEEE ₹900 (per team)",
    prize: "₹30,000",
    team: "2–4 members",
    contacts: HACKATHON_CONTACTS,
    registerUrl: HACKATHON_REGISTER_URL,
    brochure: HACKATHON_BROCHURE,
    category: "Competition",
    status: "REGISTRATIONS OPEN",
    flagship: true,
    icon: "🛠️",
  },
  {
    slug: "sensors-fusion",
    name: "SENSORS FUSION",
    tagline: "Hands-on Drone & Raspberry Pi Pico Workshop",
    hook: "Ever wondered how autonomous drones navigate and stay stable?",
    description:
      "Get real-time, hands-on experience interfacing essential drone sensors with the Raspberry Pi Pico — wiring, code and flight, all in one afternoon.",
    learn: [
      "Bluetooth connection, Wi-Fi communication and remote control",
      "Embedded networking and GPS navigation",
      "AI integration, object detection and path planning",
    ],
    date: "Mon, 2 Nov 2026",
    day: "2026-11-02",
    time: "2:00 PM – 6:00 PM",
    venue: "TBA",
    fee: "IEEE Members ₹150 · Non-IEEE ₹200",
    team: "Individual seats",
    contacts: SENSORS_FUSION_CONTACTS,
    registerUrl: REGISTER_URL,
    category: "Workshop",
    status: "REGISTRATIONS OPEN",
    icon: "🚁",
  },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Same wording on the server and in the browser, so the page never re-renders differently.
export function dayLabel(day: string) {
  const parts = day.split("-");
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!day || !y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) return "Dates TBA";
  return `${DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] ?? ""}, ${d} ${MONTHS[m - 1] ?? ""}`;
}

export const isTba = (v: string) => /tba|to be announced/i.test(v);

export const SCHEDULE = [
  {
    day: "Mon, 26 Oct",
    items: [{ t: "By 11:59 PM", n: "SENSORS ENCLAVE 4.0 – Round 1 idea submission (free entry)", v: "Online" }],
  },
  {
    day: "Sat, 31 Oct",
    items: [{ t: "24 hours", n: "SENSORS ENCLAVE 4.0 – 24-Hour Hardware Hackathon (runs to Sun, 1 Nov)", v: "BMS College of Engineering" }],
  },
  {
    day: "Mon, 2 Nov",
    items: [{ t: "2:00 PM – 6:00 PM", n: "SENSORS FUSION – Drone & Raspberry Pi Pico Workshop", v: "Venue: TBA" }],
  },
];

export const FAQS = [
  { q: "What is the headline event?", a: "SENSORS ENCLAVE 4.0, a 24-hour Hardware Hackathon on 31 Oct & 1 Nov at BMSCE, with a ₹30,000 prize pool. Round 1 is free — submit your idea online by 11:59 PM on 26 Oct and shortlisted teams advance." },
  { q: "What can I register for right now?", a: "SENSORS ENCLAVE 4.0 (the Hardware Hackathon) and SENSORS FUSION, the hands-on drone and Raspberry Pi Pico workshop on Monday 2 November. Each Register button opens that event's own Google Form." },
  { q: "What does the Hardware Hackathon cost?", a: "Round 1 is free. For the later rounds the fee is ₹650 per team for IEEE members and ₹900 per team for non-IEEE members. Certificates, attendance, food and snacks are provided." },
  { q: "Who can participate?", a: "Any student. IEEE membership is not required — members just pay a lower fee." },
  { q: "What does SENSORS FUSION cost?", a: "₹150 for IEEE members and ₹200 for non-IEEE participants." },
  { q: "Where is SENSORS FUSION happening?", a: "BMS College of Engineering, Bengaluru. The exact venue is still TBA — it is shown on the event card and will be updated there as soon as it is fixed." },
  { q: "Do I need any experience?", a: "No. It is a hands-on workshop — the sensors, the Pico and the code are walked through on the spot." },
  { q: "Who do I contact for help?", a: "Ask our chatbot (bottom-right), DM @bmsce_ieeepes on Instagram, or open any event card and tap View Details for the event contact numbers." },
];
