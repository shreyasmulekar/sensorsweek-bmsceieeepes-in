-- Admin role (kept in its own table, never on a profile)
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

create policy "Users can read their own roles"
  on public.user_roles for select to authenticated
  using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Events Anil adds himself from the calendar page (site events stay in code)
create table public.custom_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text not null default '',
  event_date date not null,
  start_time text not null default '',
  end_time text not null default '',
  venue text not null default 'BMSCE',
  fee text not null default '',
  register_url text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

GRANT SELECT ON public.custom_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_events TO authenticated;
GRANT ALL ON public.custom_events TO service_role;

ALTER TABLE public.custom_events ENABLE ROW LEVEL SECURITY;

create policy "Anyone can see calendar events"
  on public.custom_events for select to anon, authenticated
  using (true);

create policy "Admins can add events"
  on public.custom_events for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update events"
  on public.custom_events for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete events"
  on public.custom_events for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));