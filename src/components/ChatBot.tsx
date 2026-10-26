import { Component, useRef, useState, useEffect, type ErrorInfo, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useServerFn } from "@tanstack/react-start";
import type { UIMessage } from "ai";
import { Bot, RotateCcw, Send, X } from "lucide-react";
import { askBot } from "@/lib/chat.functions";
import { botErrorMessage, type ChatMessage } from "@/lib/chat";
import { Button } from "@/components/ui/button";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

const SUGGEST = ["Which events are there?", "How do I register?", "Is there a fee?"];
const greeting: UIMessage = { id: "greeting", role: "assistant", parts: [{ type: "text", text: "Hey! 👋 I'm **Sensei**, your Sensors Week buddy. What would you like to know?" }] };
function makeMessage(role: "user" | "assistant", text: string): UIMessage {
  return { id: crypto.randomUUID(), role, parts: [{ type: "text", text }] };
}
function history(messages: UIMessage[]): ChatMessage[] {
  return messages.filter((m) => m.id !== "greeting" && m.role !== "system").map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.parts.flatMap((p) => p.type === "text" ? [p.text] : []).join(""),
  }));
}

function ChatWindow() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UIMessage[]>([greeting]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const field = useRef<HTMLTextAreaElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const ask = useServerFn(askBot);

  useEffect(() => {
    if (open && !busy) field.current?.focus();
  }, [open, busy]);

  const request = async (next: UIMessage[]) => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true); setError(null);
    try {
      const result = await ask({ data: { messages: history(next) } });
      if (result.ok) setMessages([...next, makeMessage("assistant", result.reply)]);
      else setError(result.error);
    } catch {
      setError(botErrorMessage());
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  const send = async (text: string) => {
    if (!text.trim() || lock.current) return;
    const next = [...messages, makeMessage("user", text.trim())];
    setMessages(next); setInput("");
    field.current?.focus();
    await request(next);
  };
  const close = () => { setOpen(false); launcher.current?.focus(); };

  return <>
    <Button ref={launcher} aria-label={open ? "Close chat" : "Open chat"} aria-expanded={open} aria-controls="sensei-chat" onClick={() => open ? close() : setOpen(true)} className="fixed bottom-5 right-5 z-50 size-14 rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
      {open ? <X /> : <Bot />}
    </Button>
    <AnimatePresence>{open && <motion.section id="sensei-chat" aria-label="Sensei chat" onKeyDown={(e) => { if (e.key === "Escape") close(); }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-24 right-3 z-50 flex h-[min(560px,calc(100dvh-110px))] w-[min(calc(100vw-24px),400px)] flex-col overflow-hidden rounded-lg border border-border bg-background shadow-glow sm:right-5">
      <header className="flex shrink-0 items-center gap-2 border-b border-border bg-secondary/60 px-4 py-3">
        <Bot className="size-5 text-primary" />
        <div className="min-w-0 flex-1"><p className="font-display text-sm">Sensei Bot</p><p className="text-xs text-muted-foreground">Sensors Week student helper</p></div>
        <Button variant="ghost" size="icon" title="New chat" aria-label="New chat" disabled={busy} onClick={() => { setMessages([greeting]); setError(null); setInput(""); field.current?.focus(); }}><RotateCcw /></Button>
        <Button variant="ghost" size="icon" aria-label="Close Sensei" onClick={close}><X /></Button>
      </header>
      <Conversation className="min-h-0" aria-label="Chat messages">
        <ConversationContent className="gap-4 text-sm">
          {messages.map((m) => <Message key={m.id} from={m.role}>
            <MessageContent className={m.role === "user" ? "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground" : ""}>
              {m.parts.map((part, i) => part.type === "text" ? <MessageResponse key={i} className="break-words [overflow-wrap:anywhere] [&_a]:underline">{part.text}</MessageResponse> : null)}
            </MessageContent>
          </Message>)}
          {busy && <div role="status"><Shimmer>Thinking…</Shimmer></div>}
          {messages.length === 1 && <div className="flex flex-wrap gap-2">{SUGGEST.map((s) => <Button variant="outline" size="sm" key={s} onClick={() => void send(s)} className="h-auto whitespace-normal text-left">{s}</Button>)}</div>}
        </ConversationContent>
        <ConversationScrollButton aria-label="Latest message" />
      </Conversation>
      {error && <div role="alert" className="shrink-0 border-t border-border px-4 py-3 text-sm"><p>{error}</p><Button variant="outline" size="sm" className="mt-2" disabled={busy} onClick={() => void request(messages)}><RotateCcw />Try again</Button></div>}
      <div className="shrink-0 border-t border-border p-3">
        <PromptInput onSubmit={({ text }) => send(text)}>
          <PromptInputTextarea ref={field} aria-label="Your question" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question…" className="min-h-16 max-h-32" />
          <PromptInputFooter className="justify-end"><PromptInputSubmit aria-label="Send" status={busy ? "submitted" : "ready"} disabled={busy || !input.trim()} className="size-9">{busy ? undefined : <Send className="size-4" />}</PromptInputSubmit></PromptInputFooter>
        </PromptInput>
      </div>
    </motion.section>}</AnimatePresence>
  </>;
}

export class ChatBot extends Component<Record<string, never>, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override componentDidCatch(_error: Error, _info: ErrorInfo) { console.error("Sensei panel failed to render"); }
  override render(): ReactNode {
    if (this.state.failed) return <Button aria-label="Restart Sensei chat" onClick={() => this.setState({ failed: false })} className="fixed bottom-5 right-5 z-50 shadow-glow"><RotateCcw />Restart Sensei</Button>;
    return <ChatWindow />;
  }
}
