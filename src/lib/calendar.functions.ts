// Server side of the calendar: public read of events Anil adds, admin-only writes.
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type CustomEventRow = {
  id: string;
  name: string;
  tagline: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  fee: string;
  register_url: string;
};

export type NewEventInput = {
  name: string;
  tagline: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  fee: string;
  register_url: string;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Public, read-only client: the calendar is visible to visitors, so it reads with the
// publishable key under the "anyone can see calendar events" policy.
function publicReadClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listCustomEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicReadClient()
    .from("custom_events")
    .select("id,name,tagline,event_date,start_time,end_time,venue,fee,register_url")
    .order("event_date", { ascending: true });
  if (error) {
    console.error("listCustomEvents:", error.message);
    return { rows: [] as CustomEventRow[], error: "Some added events could not be loaded." };
  }
  return { rows: (data ?? []) as CustomEventRow[], error: null as string | null };
});

// Called only after the page has loaded in the browser — never during server rendering.
export const getCalendarRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return { isAdmin: Boolean(data) };
  });

export const addCustomEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: NewEventInput) => input)
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Only the site owner can add events.");

    const name = data.name.trim();
    const event_date = data.event_date.trim();
    const register_url = data.register_url.trim();
    if (!name) throw new Error("Please give the event a name.");
    if (!ISO_DATE.test(event_date)) throw new Error("Please pick a real date.");
    if (register_url && !/^https?:\/\//i.test(register_url)) throw new Error("Registration link must start with http:// or https://");

    const { data: row, error } = await context.supabase
      .from("custom_events")
      .insert({
        name,
        tagline: data.tagline.trim(),
        event_date,
        start_time: data.start_time.trim(),
        end_time: data.end_time.trim(),
        venue: data.venue.trim() || "BMSCE",
        fee: data.fee.trim(),
        register_url,
        created_by: context.userId,
      })
      .select("id")
      .single();
    if (error) {
      console.error("addCustomEvent:", error.message);
      throw new Error("Could not save the event. Please try again.");
    }
    return { id: row.id };
  });

export const removeCustomEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Only the site owner can remove events.");
    const { error } = await context.supabase.from("custom_events").delete().eq("id", data.id);
    if (error) {
      console.error("removeCustomEvent:", error.message);
      throw new Error("Could not remove the event. Please try again.");
    }
    return { ok: true };
  });
