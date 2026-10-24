import { createServerFn } from "@tanstack/react-start";
import { EVENTS, SCHEDULE, FAQS, DATES_LABEL, EMAIL, REGISTER_URL } from "./site";

type Msg = { role: "user" | "assistant"; content: string };

export const askBot = createServerFn({ method: "POST" })
  .inputValidator((d: { messages: Msg[] }) => {
    if (!Array.isArray(d?.messages)) throw new Error("Invalid input");
    return {
      messages: d.messages.slice(-20).map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: String(m.content).slice(0, 2000),
      })),
    };
  })
  .handler(async ({ data }) => {
    const { generateResponse } = await import("@lovable.dev/ai-gateway");
    const instructions = `You are "Sensei", the friendly helper bot for Sensors Week 2026 by BMSCE IEEE Power & Energy Society and Sensors Council, held ${DATES_LABEL} at BMS College of Engineering, Bengaluru. Answer student questions briefly (max ~80 words), cheerfully, using markdown. Only use the facts below; never invent a date, fee, venue or prize — if a detail is not listed, say it will be announced soon. Registration happens through the Register button on each event card, which opens that event's own Google Form (SENSORS FUSION: ${REGISTER_URL}). For help, point students to the chatbot, the Instagram page @bmsce_ieeepes, or the event contacts shown under "View Details" on an event card.
FLAGSHIP EVENT: SENSORS ENCLAVE 4.0 is the headline Hardware Hackathon of Sensors Week 2026 — a 24-hour build on 31 Oct & 1 Nov at BMSCE with a ₹30,000 prize pool. Round 1 is FREE: teams submit their idea online by 11:59 PM on 26 Oct and shortlisted teams advance. Later-round fees (per team): IEEE ₹650, Non-IEEE ₹900. Its Register button opens the SENSORS FUSION form: ${REGISTER_URL}.
WORKSHOP: KERNELX is a Real-Time Systems & FreeRTOS workshop on Tue 3 & Wed 4 Nov 2026, 2:30 PM – 5:00 PM at BMS College of Engineering, Basavanagudi. It covers RTOS fundamentals, FreeRTOS and its applications, task scheduling and management, and hands-on embedded systems development. Fee: IEEE ₹130, Non-IEEE ₹180. Its Google Form: https://forms.gle/iL7aNqfXrGQATvJc8. Contacts: Harshith 8310919267, Tanish 8879534570.
WORKSHOP: GESTURE AI is a hands-on TinyML workshop on motion sensing, edge AI and embedded machine learning with the ESP32 and MPU6050 on Thu 5 Nov 2026, 2:00 PM – 5:00 PM at BMS College of Engineering, Basavanagudi. Participants collect labelled motion data, train a compact model and run inference on the ESP32, driving a 0.96-inch OLED, RGB LED and servo. Fee: IEEE ₹90, Non-IEEE ₹130. Its Google Form: https://forms.gle/gVpKF9EeQjTUkb2Z9. Contacts: Madhav 9958050419, Pragati 9008723866.
EVENTS: ${JSON.stringify(EVENTS)}
SCHEDULE: ${JSON.stringify(SCHEDULE)}
FAQ: ${JSON.stringify(FAQS)}`;
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions,
        input: data.messages,
      });
      const r = res as unknown as { output?: Array<{ type: string; content?: Array<{ type: string; text?: string }> }> };
      const text = (r.output ?? [])
        .flatMap((o) => (o.type === "message" ? (o.content ?? []) : []))
        .filter((c) => c.type === "output_text")
        .map((c) => c.text ?? "")
        .join("");
      return { reply: text || "Hmm, I couldn't think of an answer. Try rephrasing?" };
    } catch (e) {
      console.error(e);
      return { reply: `Sorry, I'm having trouble right now. Please email ${EMAIL}.` };
    }
  });
