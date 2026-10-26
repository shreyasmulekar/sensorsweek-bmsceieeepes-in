import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Instagram, Mail, MapPin, Volume2, VolumeX } from "lucide-react";
import { DEFAULT_REGISTER_URL, INSTAGRAM, EMAIL, SPONSORS, SPONSOR_LOGOS, EVENTS, NEXT_EVENT_LABEL } from "@/lib/site";
import logoAsset from "@/assets/logo.png.asset.json";
import { isMuted, onMuteChange, setMuted, sfx } from "@/lib/sound";

const logo = logoAsset.url;

const NAV = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/calendar", label: "Calendar" },
  { to: "/schedule", label: "Schedule" },
  { to: "/faq", label: "FAQ" },
] as const;

// Scrolling footer ticker: every event with its date, plus the current deadline.
const TICKER = [...EVENTS.map((e) => `${e.name} · ${e.date}`), NEXT_EVENT_LABEL];

export function Logo({ size = "size-9 sm:size-10", rounded = "rounded-lg sm:rounded-xl", className = "" }: { size?: string; rounded?: string; className?: string }) {
  return (
    <span className={`grid ${size} ${rounded} ${className} shrink-0 place-items-center overflow-hidden bg-white shadow-glow`}>
      <img src={logo} alt="Sensors Week 2026 logo" width={40} height={40} className="h-full w-full object-contain" />
    </span>
  );
}

export function RegisterButton({ className = "", children = "Register Now", href = DEFAULT_REGISTER_URL }: { className?: string; children?: ReactNode; href?: string }) {
  return (
    <motion.a
      href={href} target="_blank" rel="noreferrer"
      onClick={() => sfx.launch()}
      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
      className={`sweep cyber-clip group inline-flex items-center justify-center bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-shadow hover:shadow-[0_0_28px_oklch(0.82_0.14_200/0.6)] ${className}`}
    >{children}</motion.a>
  );
}

export function SoundToggle({ className = "" }: { className?: string }) {
  const [off, setOff] = useState(false);

  useEffect(() => {
    setOff(isMuted());
    return onMuteChange(setOff);
  }, []);
  return (
    <button
      type="button"
      aria-pressed={off}
      aria-label={off ? "Turn sound effects on" : "Turn sound effects off"}
      title={off ? "Sound off" : "Sound on"}
      onClick={() => {
        const next = !off;
        setOff(next);
        setMuted(next);
        if (!next) sfx.tap();
      }}
      className={`grid size-10 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-primary ${className}`}
    >
      {off ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) panel.current?.querySelector("a")?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="glass-header sticky top-0 z-40">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 sm:flex sm:justify-between sm:py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3" onClick={() => setOpen(false)}>
          <Logo />
          <span className="min-w-0 truncate font-display text-sm font-bold sm:text-base md:text-lg"><span className="text-gradient">SENSORS</span> WEEK</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-4 sm:flex lg:gap-6">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }} activeProps={{ className: "neon-text", "aria-current": "page" }} className="text-sm text-muted-foreground transition-colors hover:text-primary hover:neon-text">{n.label}</Link>
          ))}
          <SoundToggle />
          <RegisterButton className="px-4 py-2 text-xs sm:px-5 sm:py-2 sm:text-sm" />
        </nav>
        <button className="grid size-10 place-items-center rounded-lg border border-border transition-colors hover:bg-secondary sm:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => { setOpen(!open); (!open ? sfx.open : sfx.close)(); }}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              aria-label="Close menu" onClick={() => setOpen(false)}
              className="fixed inset-0 z-30 bg-background/85 backdrop-blur-sm sm:hidden"
            />
            <motion.nav
              initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              ref={panel}
              aria-label="Main"
              className="glass-header absolute inset-x-0 top-full z-40 flex flex-col gap-1 border-b border-border px-4 pb-6 pt-3 sm:hidden"
            >
              {NAV.map((n) => (
                <Link
                  key={n.to} to={n.to} activeOptions={{ exact: true }}
                  activeProps={{ className: "bg-primary/15 text-primary", "aria-current": "page" }}
                  className="rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-secondary"
                  onClick={() => setOpen(false)}
                >{n.label}</Link>
              ))}
              <RegisterButton className="mt-3 w-full px-5 py-3 text-base" />
              <SoundToggle className="mx-auto mt-3" />
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <Instagram className="size-4" />@bmsce_ieeepes
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-background/70 backdrop-blur sm:mt-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-3">
        <div className="min-w-0">
          <Logo size="size-12" rounded="rounded-xl" />
          <p className="mt-3 font-display text-sm font-bold sm:text-base"><span className="text-gradient">SENSORS</span> WEEK 2026</p>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">BMSCE IEEE Power & Energy Society and Sensors Council</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {NAV.map((n) => <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-primary">{n.label}</Link>)}
        </div>
        <div className="flex min-w-0 flex-col gap-2 text-xs text-muted-foreground sm:text-sm">
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><Instagram className="size-4 shrink-0" />@bmsce_ieeepes</a>
          <a href={`mailto:${EMAIL}`} className="flex min-w-0 items-center gap-2 hover:text-primary"><Mail className="size-4 shrink-0" /><span className="min-w-0 truncate">{EMAIL}</span></a>
          <span className="flex min-w-0 items-center gap-2"><MapPin className="size-4 shrink-0" /><span className="min-w-0">BMS College of Engineering, Bengaluru</span></span>
        </div>
      </div>
      {SPONSORS.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 pb-8">
          <div className="hud cyber-clip relative overflow-hidden px-4 py-6 sm:px-8">
            <div className="grid-floor absolute inset-x-0 bottom-0 h-28 opacity-25" />
            <div className="relative text-center">
              <p className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.3em] text-primary">
                <span aria-hidden className="h-px w-8 bg-primary/50" />
                <span className="flex items-center gap-2">
                  <span aria-hidden className="animate-blink inline-block size-1.5 rounded-full bg-primary shadow-glow" />
                  Sponsors Network
                </span>
                <span aria-hidden className="h-px w-8 bg-primary/50" />
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                Thank you to our sponsors for backing Sensors Week 2026 and helping students build, fly and demo.
              </p>
            </div>
            <div className="relative mt-6 grid gap-4 sm:grid-cols-3">
              {SPONSORS.map((name) => (
                <div key={name} className="sweep group border border-border/60 bg-background/60 transition-shadow hover:shadow-glow">
                  <div className="ticks flex h-20 min-w-0 items-center justify-center px-4 py-3">
                    {SPONSOR_LOGOS[name] && <img src={SPONSOR_LOGOS[name]} alt={`${name} logo`} width={176} height={48} className="max-h-12 w-full max-w-[190px] object-contain transition-transform duration-300 group-hover:scale-105" loading="lazy" />}
                    {!SPONSOR_LOGOS[name] && <span className="font-display text-base font-bold text-primary sm:text-lg">{name}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-full border border-border/50 bg-background/50 py-1.5">
            <div className="animate-ticker flex w-max items-center gap-10 whitespace-nowrap pl-10 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={`${t}-${i}`} className="flex items-center gap-10">
                  <span className={t === NEXT_EVENT_LABEL ? "text-neon" : "text-primary"}>{t}</span>
                  <span aria-hidden className="text-primary/40">//</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      <p className="px-4 pb-6 text-center text-[11px] text-muted-foreground">© 2026 BMSCE IEEE PES & Sensors Council</p>
    </footer>
  );
}

export function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 text-center sm:mb-10">
      <p className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.3em] text-primary sm:text-xs">
        <span aria-hidden className="inline-block h-px w-6 bg-primary/50" />{kicker}<span aria-hidden className="inline-block h-px w-6 bg-primary/50" />
      </p>
      <h2 data-text={title} className="glitch mt-2 text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h2>
    </motion.div>
  );
}
