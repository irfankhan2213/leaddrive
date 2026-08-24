create extension if not exists "pgcrypto";

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  audience text not null,
  locations text not null default '',
  source text not null check (source in ('google_maps', 'instagram', 'linkedin', 'product_hunt', 'apollo', 'csv', 'url_list')),
  demo_type text not null check (demo_type in ('website', 'landing_page', 'app_mockup')),
  channel text not null default 'email',
  status text not null default 'running' check (status in ('draft', 'running', 'paused', 'complete')),
  total_prospects integer not null default 0,
  qualified integer not null default 0,
  demos_generated integer not null default 0,
  outreach_sent integer not null default 0,
  replies integer not null default 0,
  conversions integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.campaigns add column if not exists locations text not null default '';

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete cascade,
  company_name text not null,
  contact_name text,
  niche text not null,
  source text not null,
  website_url text,
  linkedin_url text,
  instagram_url text,
  city text,
  email text,
  phone text,
  address text,
  rating numeric,
  reviews_count integer,
  source_url text,
  matched_keyword text,
  status text not null default 'new',
  fit_score integer not null default 0 check (fit_score >= 0 and fit_score <= 100),
  weakness text not null default '',
  qualification_reason text not null default '',
  signals jsonb not null default '[]'::jsonb,
  demo_type text not null default 'website',
  demo_quality text default 'low',
  demo_provider text default 'agentic',
  demo_prompt text not null default '',
  demo_url text,
  v0_chat_id text,
  v0_version_id text,
  outreach_subject text not null default '',
  outreach_body text not null default '',
  outreach_sms text,
  reply_text text,
  opens integer not null default 0,
  clicks integer not null default 0,
  replies integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads add column if not exists reply_text text;
alter table public.leads add column if not exists phone text;
alter table public.leads add column if not exists address text;
alter table public.leads add column if not exists rating numeric;
alter table public.leads add column if not exists reviews_count integer;
alter table public.leads add column if not exists source_url text;
alter table public.leads add column if not exists matched_keyword text;
alter table public.leads add column if not exists outreach_sms text;
alter table public.leads add column if not exists instagram_url text;
alter table public.leads add column if not exists demo_quality text default 'low';
alter table public.leads add column if not exists demo_provider text default 'agentic';

create table if not exists public.outreach_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  event_type text not null check (event_type in ('sent', 'opened', 'clicked', 'replied', 'bounced', 'converted')),
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists campaigns_created_at_idx on public.campaigns(created_at desc);
create index if not exists leads_campaign_id_idx on public.leads(campaign_id);
create index if not exists leads_fit_score_idx on public.leads(fit_score desc);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_city_idx on public.leads(city);
create index if not exists leads_rating_idx on public.leads(rating desc);
create index if not exists outreach_events_lead_id_idx on public.outreach_events(lead_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

-- Atomic counter increment RPC function
create or replace function public.increment_lead_counter(lead_id_param uuid, field_param text)
returns void
language plpgsql
security definer
as $$
begin
  if field_param = 'opens' then
    update public.leads set opens = opens + 1 where id = lead_id_param;
  elsif field_param = 'clicks' then
    update public.leads set clicks = clicks + 1 where id = lead_id_param;
  elsif field_param = 'replies' then
    update public.leads set replies = replies + 1 where id = lead_id_param;
  end if;
end;
$$;

alter table public.campaigns add column if not exists user_id uuid references auth.users(id);
alter table public.leads add column if not exists user_id uuid references auth.users(id);

alter table public.campaigns enable row level security;
alter table public.leads enable row level security;
alter table public.outreach_events enable row level security;

create policy "service role can manage campaigns"
on public.campaigns
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "service role can manage leads"
on public.leads
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "service role can manage outreach events"
on public.outreach_events
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- Authenticated User Multi-Tenant Policies (strict ownership)
drop policy if exists "users can manage own campaigns" on public.campaigns;
create policy "users can manage own campaigns"
on public.campaigns
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can manage own leads" on public.leads;
create policy "users can manage own leads"
on public.leads
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can manage own outreach events" on public.outreach_events;
create policy "users can manage own outreach events"
on public.outreach_events
for all
using (
  auth.role() = 'service_role'
  or exists (
    select 1 from public.leads l
    where l.id = lead_id and l.user_id = auth.uid()
  )
)
with check (
  auth.role() = 'service_role'
  or exists (
    select 1 from public.leads l
    where l.id = lead_id and l.user_id = auth.uid()
  )
);

alter table public.leads add column if not exists suppressed boolean not null default false;

create index if not exists leads_user_id_idx on public.leads(user_id);

-- Per-user settings storage (server-side secrets)
create table if not exists public.app_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

create policy "users can manage own settings"
on public.app_settings
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Outreach event types now include unsubscribe
alter table public.outreach_events drop constraint if exists outreach_events_event_type_check;
alter table public.outreach_events add constraint outreach_events_event_type_check
  check (event_type in ('sent', 'opened', 'clicked', 'replied', 'bounced', 'converted', 'unsubscribed'));

-- Open/click de-duplication: at most one opened/clicked event per lead per day.
alter table public.outreach_events add column if not exists event_day date
  generated always as ((created_at at time zone 'UTC')::date) stored;

create unique index if not exists outreach_events_daily_dedupe_idx
  on public.outreach_events (lead_id, event_type, event_day)
  where event_type in ('opened', 'clicked');

-- Unsubscribe token secret (generate with: openssl rand -hex 32)
-- Required in production: UNSUBSCRIBE_SECRET

