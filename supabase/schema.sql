create extension if not exists "pgcrypto";

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  audience text not null,
  locations text not null default '',
  source text not null check (source in ('google_maps', 'linkedin', 'product_hunt', 'apollo', 'csv', 'url_list')),
  demo_type text not null check (demo_type in ('website', 'landing_page', 'app_mockup')),
  channel text not null check (channel in ('email', 'linkedin')),
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
  city text,
  email text,
  status text not null default 'new',
  fit_score integer not null default 0 check (fit_score >= 0 and fit_score <= 100),
  weakness text not null default '',
  qualification_reason text not null default '',
  signals jsonb not null default '[]'::jsonb,
  demo_type text not null default 'website',
  demo_prompt text not null default '',
  demo_url text,
  v0_chat_id text,
  v0_version_id text,
  outreach_subject text not null default '',
  outreach_body text not null default '',
  reply_text text,
  opens integer not null default 0,
  clicks integer not null default 0,
  replies integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads add column if not exists reply_text text;

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
