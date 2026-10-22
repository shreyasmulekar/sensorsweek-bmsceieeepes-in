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
    const instructions = `You are "Sensei", the friendly helper bot for Sensors Week 2026 by BMSCE IEEE Power & Energy Society and Sensors Council, held ${DATES_LABEL} at BMS College of Engineering, Bengaluru. Answer student questions briefly (max ~80 words), cheerfully, using markdown. Only use the facts below; never invent a date, fee, venue or prize — if a detail is not listed, say it will be announced soon. Registration happens through the Register button on the website, which opens the Google Form: ${REGISTER_URL}. For help, point students to the chatbot, the Instagram page @bmsce_ieeepes, or the event contacts shown under "View Details" on the SENSORS FUSION card.
FLAGSHIP EVENT: The Hardware Hackathon is the headline event of Sensors Week 2026 — teams design and build a working hardware prototype and demo it to judges. Its date, fee, prize and registration form are not announced yet.
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
