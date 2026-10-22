import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Send, X } from "lucide-react";
import { askBot } from "@/lib/chat.functions";
import { sfx } from "@/lib/sound";

type Msg = { role: "user" | "assistant"; content: string };
const SUGGEST = ["Which events are there?", "How do I register?", "Is there a fee?"];

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: "Hey! 👋 I'm **Sensei**, your Sensors Week buddy. Ask me anything about events, dates or registration." }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const ask = useServerFn(askBot);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, busy]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const next = [...msgs, { role: "user" as const, content: text.trim() }];
    setMsgs(next); setInput(""); setBusy(true); sfx.sent();
    try {
      const { reply } = await ask({ data: { messages: next.slice(1) } });
      setMsgs([...next, { role: "assistant", content: reply }]); sfx.reply();
    } catch {
      setMsgs([...next, { role: "assistant", content: "Oops, connection hiccup. Try again?" }]); sfx.close();
    } finally { setBusy(false); }
  };

  return (
    <>
      <motion.button
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => { setOpen(!open); (!open ? sfx.open : sfx.close)(); }}
        whileHover={{ scale: 1.1, rotate: 8 }} whileTap={{ scale: 0.9 }}
        className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
      >
        {open ? <X /> : <Bot className="animate-floaty" />}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="glass fixed bottom-24 right-5 z-50 flex h-[480px] w-[min(92vw,370px)] flex-col overflow-hidden rounded-2xl shadow-glow"
          >
            <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-3">
              <Bot className="size-5 text-primary" />
              <div><p className="font-display text-sm">Sensei Bot</p><p className="text-xs text-muted-foreground">Ask about Sensors Week</p></div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
              {msgs.map((m, i) => (
                <div key={i} className={m.role === "user" ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground" : "max-w-[90%] rounded-2xl rounded-bl-sm bg-secondary px-3 py-2"}>
                  <div className="prose-sm [&_ul]:list-disc [&_ul]:pl-4 [&_strong]:text-primary"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                </div>
              ))}
              {busy && <div className="flex gap-1 px-3">{[0, 1, 2].map((i) => <motion.span key={i} className="size-2 rounded-full bg-primary" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />)}</div>}
              {msgs.length === 1 && (
                <div className="flex flex-wrap gap-2">{SUGGEST.map((s) => <button key={s} onClick={() => send(s)} className="rounded-full border border-border px-3 py-1 text-xs hover:bg-secondary">{s}</button>)}</div>
              )}
              <div ref={end} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-border p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question…" className="flex-1 rounded-full border border-input bg-background/60 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <button aria-label="Send" disabled={busy} className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"><Send className="size-4" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
