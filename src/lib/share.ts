import { toast } from "sonner";
import type { EventItem } from "./site";

export function eventUrl(slug: string) {
  if (typeof window === "undefined") return `/event/${slug}`;
  return `${window.location.origin}/event/${slug}`;
}

// Phone browsers get the native share sheet; everywhere else the link is
// copied so the visitor can paste it anywhere.
export async function shareEvent(e: EventItem) {
  const url = eventUrl(e.slug);
  const text = `${e.name} — ${e.tagline} · Sensors Week 2026`;
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title: "Sensors Week 2026", text, url });
    } catch {
      /* the visitor closed the share sheet */
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    toast("Link copied — paste it wherever you want to share");
  } catch {
    toast(url);
  }
}
