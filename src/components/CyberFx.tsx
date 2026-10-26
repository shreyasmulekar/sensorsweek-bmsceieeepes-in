/**
 * Fixed CRT/cyberpunk overlay: fine scanlines and a vignette that softly
 * flickers. Purely decorative — it never captures pointer events, so every
 * control underneath stays clickable.
 */
export function CyberFx() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50">
      <div className="scanlines absolute inset-0 opacity-[0.14] mix-blend-soft-light" />
      <div className="animate-flicker absolute inset-0 [background:radial-gradient(125%_95%_at_50%_0%,transparent_52%,oklch(0_0_0/0.5)_100%)]" />
    </div>
  );
}

/** Perspective neon grid that recedes at the bottom of a section. */
export function GridFloor({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`grid-floor pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-40 ${className}`} />;
}
