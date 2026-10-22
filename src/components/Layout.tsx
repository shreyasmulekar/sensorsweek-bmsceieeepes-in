import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Menu, X, Instagram, Mail, MapPin } from "lucide-react";
import { REGISTER_URL, INSTAGRAM, EMAIL } from "@/lib/site";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/schedule", label: "Schedule" },
  { to: "/faq", label: "FAQ" },
] as const;

export function RegisterButton({ className = "", children = "Register Now" }: { className?: string; children?: ReactNode }) {
  return (
    <motion.a
      href={REGISTER_URL} target="_blank" rel="noreferrer"
      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center justify-center rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow ${className}`}
    >{children}</motion.a>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="glass sticky top-0 z-40 border-x-0 border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-lg font-bold"><span className="text-gradient">SENSORS</span> WEEK</Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} className="text-sm text-muted-foreground transition-colors hover:text-primary">{n.label}</Link>
          ))}
          <RegisterButton className="px-5 py-2 text-sm" />
        </nav>
        <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <motion.nav initial={{ height: 0 }} animate={{ height: "auto" }} className="flex flex-col gap-3 overflow-hidden px-4 pb-4 md:hidden">
          {NAV.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-1">{n.label}</Link>)}
          <RegisterButton />
        </motion.nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background/70 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-display font-bold"><span className="text-gradient">SENSORS</span> WEEK 2026</p>
          <p className="mt-2 text-sm text-muted-foreground">BMSCE IEEE Power & Energy Society and Sensors Council</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {NAV.map((n) => <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-primary">{n.label}</Link>)}
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><Instagram className="size-4" />@bmsce_ieeepes</a>
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-primary"><Mail className="size-4" />{EMAIL}</a>
          <span className="flex items-center gap-2"><MapPin className="size-4" />BMS College of Engineering, Bengaluru</span>
        </div>
      </div>
      <p className="pb-6 text-center text-xs text-muted-foreground">© 2026 BMSCE IEEE PES & Sensors Council</p>
    </footer>
  );
}

export function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">{kicker}</p>
      <h2 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h2>
    </motion.div>
  );
}
