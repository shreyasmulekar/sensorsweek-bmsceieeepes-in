import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import "@lovable.dev/cloud-auth-js/styles.css";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in | Sensors Week 2026" },
      { name: "description", content: "Sign in to manage the Sensors Week 2026 calendar." },
      { property: "og:title", content: "Sign in | Sensors Week 2026" },
      { property: "og:description", content: "Sign in to manage the Sensors Week 2026 calendar." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { next?: string } => {
    const raw = search["next"];
    return typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//") ? { next: raw } : {};
  },
  component: AuthPage,
});

const NEXT_KEY = "sensors-week-next";

function go(dest: string) {
  window.location.assign(dest);
}

function AuthPage() {
  const { next } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<"confirm" | "reset" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dest = next ?? "/calendar";

  // Someone coming back from Google or Lovable already has a session; send them on.
  useEffect(() => {
    let alive = true;
    const target = sessionStorage.getItem(NEXT_KEY) || dest;
    sessionStorage.removeItem(NEXT_KEY);
    supabase.auth.getSession().then(({ data }) => {
      if (alive && data.session) go(target);
    });
    return () => {
      alive = false;
    };
  }, [dest]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (err) throw err;
        if (!data.session) {
          setNote("confirm");
          return;
        }
        go(dest);
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        go(dest);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function social(provider: "google" | "lovable") {
    setError(null);
    sessionStorage.setItem(NEXT_KEY, dest);
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (result.error) {
      setError(result.error.message);
      return;
    }
    if (result.redirected) return;
    go(dest);
  }

  async function forgot() {
    if (!email) {
      setError("Type your email above first, then tap Send reset link.");
      return;
    }
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (err) setError(err.message);
    else setNote("reset");
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
        <h1 className="font-display text-2xl font-black text-primary">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only the account we make an editor can add or remove events on the calendar.
        </p>

        {note === "confirm" ? (
          <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
            Almost done — open your email and tap the confirmation link, then sign in here.
          </p>
        ) : null}
        {note === "reset" ? (
          <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
            If that email has an account, a reset link is on its way.
          </p>
        ) : null}

        <form onSubmit={submit} className="mt-5 space-y-3">
          <label className="block text-sm">
            <span className="text-muted-foreground">Email</span>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              autoComplete="email" placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Password</span>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={6} placeholder="At least 6 characters"
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:border-primary"
            />
          </label>

          {error ? <p className="rounded-xl bg-warn/10 px-3 py-2 text-sm text-warn">{error}</p> : null}

          <button
            type="submit" disabled={busy}
            className="w-full rounded-full bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
          >
            {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-2">
          <button type="button" onClick={() => void social("google")} className="w-full">
            <span className="google-auth-button">Continue with Google</span>
          </button>
          <button type="button" onClick={() => void social("lovable")} className="w-full">
            <span className="lovable-auth-button">Continue with Lovable</span>
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-sm">
          <button
            type="button"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setNote(null); }}
            className="font-semibold text-primary hover:underline"
          >
            {mode === "signin" ? "New here? Create an account" : "Already registered? Sign in"}
          </button>
          <button type="button" onClick={() => void forgot()} className="text-muted-foreground hover:text-primary hover:underline">
            Send reset link
          </button>
        </div>
      </motion.div>
    </section>
  );
}
