import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password | Sensors Week 2026" },
      { name: "description", content: "Set a new password for your Sensors Week 2026 account." },
      { property: "og:title", content: "Set a new password | Sensors Week 2026" },
      { property: "og:description", content: "Set a new password for your Sensors Week 2026 account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // The reset link only puts a session in the browser once it has been opened from the email.
  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) setReady(Boolean(data.session) && window.location.hash.includes("type=recovery"));
    });
    return () => {
      alive = false;
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) setError(err.message);
    else setDone(true);
    setBusy(false);
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
        <h1 className="font-display text-2xl font-black text-primary">Set a new password</h1>

        {!ready ? (
          <p className="mt-3 text-sm text-muted-foreground">
            That link has expired or was already used. Ask for a fresh reset link from the sign-in page.
          </p>
        ) : done ? (
          <p className="mt-3 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
            Your new password is saved. You can close this page.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <label className="block text-sm">
              <span className="text-muted-foreground">New password</span>
              <input
                type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:border-primary"
              />
            </label>
            {error ? <p className="rounded-xl bg-warn/10 px-3 py-2 text-sm text-warn">{error}</p> : null}
            <button
              type="submit" disabled={busy}
              className="w-full rounded-full bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save new password"}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
