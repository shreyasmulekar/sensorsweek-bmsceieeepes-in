import { createServerFn } from "@tanstack/react-start";
import { botErrorMessage, botInstructions, chatInputSchema, type ChatResult } from "./chat";

export const askBot = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => chatInputSchema.safeParse(input))
  .handler(async ({ data }): Promise<ChatResult> => {
    if (!data.success) return { ok: false, error: "Please send a question, or start a new chat if this conversation is very long." };
    try {
      const { generateResponse } = await import("@lovable.dev/ai-gateway");
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions: botInstructions(),
        input: data.data.messages,
      });
      const text = res.output
        .flatMap((o) => (o.type === "message" ? (o.content ?? []) : []))
        .map((c) => c.type === "output_text" ? c.text : c.type === "refusal" ? c.refusal : "")
        .join("").trim();
      if (!text || res.status === "failed" || res.status === "incomplete") return { ok: false, error: botErrorMessage() };
      return { ok: true, reply: text };
    } catch (e) {
      // Never include conversation contents or raw provider payloads in logs.
      const { GatewayError } = await import("@lovable.dev/ai-gateway");
      const code = e instanceof GatewayError ? e.code : undefined;
      console.error("Sensei request failed", { code, ...(e instanceof GatewayError ? { status: e.httpStatus, ids: e.ids } : {}) });
      return { ok: false, error: botErrorMessage(code) };
    }
  });
