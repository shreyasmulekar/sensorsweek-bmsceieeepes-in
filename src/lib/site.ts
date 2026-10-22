// Central place to update links, dates and events.
export const REGISTER_URL = "https://forms.gle/5bzWaxnJ652Bnoas7";
export const EVENT_START = new Date("2026-11-02T14:00:00+05:30");
export const DATES_LABEL = "30 Oct – 4 Nov 2026";
export const NEXT_EVENT_LABEL = "SENSORS FUSION · Mon 2 Nov, 2:00 PM";
export const INSTAGRAM = "https://instagram.com/bmsce_ieeepes";
export const EMAIL = "ieeepes@bmsce.ac.in";

export type Contact = { name: string; phone: string };

// Only SENSORS FUSION shows organiser names for now.
export const SENSORS_FUSION_CONTACTS: Contact[] = [
  { name: "Shreshta C S", phone: "7406968671" },
  { name: "Shreyas M", phone: "6362695884" },
];

export type EventItem = {
  slug: string;
  name: string;
  tagline: string;
  hook?: string;
  description: string;
  learn?: string[];
  date: string;
  time: string;
  venue: string;
  fee: string;
  prize?: string;
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
    name: "HARDWARE HACKATHON",
    tagline: "Design it, wire it, demo it — against the clock",
    hook: "How much real hardware can your team build before the timer hits zero?",
    description:
      "The flagship of Sensors Week. Teams design and build a working hardware prototype around sensors and microcontrollers, then demo it live to the judges.",
    date: "TBA",
    time: "TBA",
    venue: "TBA",
    fee: "TBA",
    team: "Team size TBA",
    category: "Competition",
    status: "COMING SOON",
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

export const SCHEDULE = [
  {
    day: "Mon, 2 Nov",
    items: [{ t: "2:00 PM – 6:00 PM", n: "SENSORS FUSION – Drone & Raspberry Pi Pico Workshop", v: "Venue: TBA" }],
  },
];

export const FAQS = [
  { q: "What is the headline event?", a: "The Hardware Hackathon is the flagship of Sensors Week 2026 — teams build a working hardware prototype and demo it to judges. Its date, fee and registration form are still being finalised." },
  { q: "What can I register for right now?", a: "SENSORS FUSION, the hands-on drone and Raspberry Pi Pico workshop on Monday 2 November. Any Register button opens the Google Form." },
  { q: "Who can participate?", a: "Any student. IEEE membership is not required — members just pay a lower fee." },
  { q: "What does SENSORS FUSION cost?", a: "₹150 for IEEE members and ₹200 for non-IEEE participants." },
  { q: "Where is SENSORS FUSION happening?", a: "BMS College of Engineering, Bengaluru. The exact venue is still TBA — it is shown on the event card and will be updated there as soon as it is fixed." },
  { q: "Do I need any experience?", a: "No. It is a hands-on workshop — the sensors, the Pico and the code are walked through on the spot." },
  { q: "Who do I contact for help?", a: "Ask our chatbot (bottom-right), DM @bmsce_ieeepes on Instagram, or open the SENSORS FUSION card and tap View Details for the event contact numbers." },
];
