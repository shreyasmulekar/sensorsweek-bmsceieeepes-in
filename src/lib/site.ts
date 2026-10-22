// Central place to update links, dates and events.
export const REGISTER_URL = "#register"; // TODO: replace with the Google Form link
export const EVENT_START = new Date("2026-10-30T09:00:00+05:30");
export const DATES_LABEL = "30 Oct – 4 Nov 2026";
export const INSTAGRAM = "https://instagram.com/bmsce_ieeepes";
export const EMAIL = "ieeepes@bmsce.ac.in";

export type EventItem = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  fee: string;
  prize?: string;
  team: string;
  category: "Workshop" | "Competition" | "Talk" | "Exhibition";
  status: "REGISTRATIONS OPEN" | "CLOSING SOON" | "EVENT FULL" | "REGISTRATIONS CLOSED" | "COMING SOON";
  icon: string;
};

export const EVENTS: EventItem[] = [
  { slug: "iot-workshop", name: "IoT Build Lab", tagline: "Wire it. Code it. Ship it.", description: "Hands-on workshop building a connected sensor node with ESP32 and a live cloud dashboard.", date: "30 Oct", time: "10:00 AM – 1:00 PM", venue: "PG Seminar Hall", fee: "₹100", team: "Individual", category: "Workshop", status: "REGISTRATIONS OPEN", icon: "📡" },
  { slug: "drone-race", name: "Sky Sense", tagline: "Drones that see the world", description: "Program an autonomous drone to navigate an obstacle course using onboard sensors.", date: "31 Oct", time: "11:00 AM – 4:00 PM", venue: "Main Ground", fee: "₹200 / team", prize: "₹10,000", team: "2–4 members", category: "Competition", status: "CLOSING SOON", icon: "🚁" },
  { slug: "robo-hack", name: "RoboHack", tagline: "24 hours. One robot.", description: "Build a sensor-driven robot that solves a real campus problem. Mentors on site all night.", date: "2–3 Nov", time: "9:00 AM onwards", venue: "Innovation Lab", fee: "₹300 / team", prize: "₹20,000", team: "3–4 members", category: "Competition", status: "REGISTRATIONS OPEN", icon: "🤖" },
  { slug: "expert-talk", name: "Sensing the Future", tagline: "Industry voices on smart sensing", description: "Talk by industry experts on MEMS, automotive sensors and the road to smart grids.", date: "3 Nov", time: "2:00 PM – 4:00 PM", venue: "Auditorium", fee: "Free", team: "Individual", category: "Talk", status: "COMING SOON", icon: "🎙️" },
  { slug: "project-expo", name: "Sensor Expo", tagline: "Show off what you built", description: "Exhibit your sensor, embedded or energy project to judges and visitors.", date: "4 Nov", time: "10:00 AM – 3:00 PM", venue: "Library Atrium", fee: "₹150 / team", prize: "₹8,000", team: "1–3 members", category: "Exhibition", status: "REGISTRATIONS OPEN", icon: "🔬" },
];

export const SCHEDULE = [
  { day: "Fri, 30 Oct", items: [{ t: "9:30 AM", n: "Inauguration", v: "Auditorium" }, { t: "10:00 AM", n: "IoT Build Lab", v: "PG Seminar Hall" }] },
  { day: "Sat, 31 Oct", items: [{ t: "11:00 AM", n: "Sky Sense – Drone Challenge", v: "Main Ground" }] },
  { day: "Sun, 1 Nov", items: [{ t: "—", n: "Rest day · Online quiz opens", v: "Online" }] },
  { day: "Mon, 2 Nov", items: [{ t: "9:00 AM", n: "RoboHack kicks off", v: "Innovation Lab" }] },
  { day: "Tue, 3 Nov", items: [{ t: "9:00 AM", n: "RoboHack finals", v: "Innovation Lab" }, { t: "2:00 PM", n: "Sensing the Future – Talk", v: "Auditorium" }] },
  { day: "Wed, 4 Nov", items: [{ t: "10:00 AM", n: "Sensor Expo", v: "Library Atrium" }, { t: "4:00 PM", n: "Prize distribution & closing", v: "Auditorium" }] },
];

export const FAQS = [
  { q: "Who can participate?", a: "Any undergraduate or postgraduate student from any college. IEEE membership is not required." },
  { q: "How do I register?", a: "Click any Register button — it opens our Google Form. You'll get a confirmation on the email you provide." },
  { q: "Can I join more than one event?", a: "Yes! Just check the schedule for timing clashes before registering." },
  { q: "How do team registrations work?", a: "One member registers the whole team with the team name and every member's details." },
  { q: "Where is it happening?", a: "BMS College of Engineering, Basavanagudi, Bengaluru. Venues are listed on each event." },
  { q: "Who do I contact for help?", a: "Ask our chatbot (bottom-right), DM @bmsce_ieeepes on Instagram, or email us." },
];

export const SPONSORS = ["Sponsor One", "Sponsor Two", "Sponsor Three", "Sponsor Four"];
