# LeadDrive

AI-powered cold outreach automation for agencies and freelancers. It finds real prospects, scores their digital presence, prepares a personalized demo prompt, drafts outreach, and tracks the pipeline inside a single Next.js app.

## Stack

- Next.js App Router
- Supabase for persistence
- v0 Platform API for demo generation and Vercel deployment
- Gemini for lead analysis
- No separate server

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Run `supabase/schema.sql` in your Supabase SQL editor, then fill `.env.local`.

Use these env names:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWKS_URL=
GEMINI_API_KEY=
GEMINI_ENABLED=false
SERPAPI_KEY=
APIFY_TOKEN=
APIFY_ACTOR_ID=
APIFY_TASK_ID=
PAGESPEED_API_KEY=
V0_API_KEY=
V0_MODEL=v0-mini
V0_MAX_PROMPT_CHARS=1600
RESEND_API_KEY=
FROM_EMAIL=
FROM_NAME=
APP_BASE_URL=http://localhost:3000
```

The dashboard stays empty until real campaign data exists. Campaign creation does not generate fake leads.

## Routes

- `POST /api/campaigns` creates a campaign, scrapes or parses real source input, audits websites, scores leads, and stores them when Supabase is configured.
- Campaigns support `locations` as a first-class filter. Separate multiple locations with semicolons, pipes, or new lines; source rows can include a city column.
- `POST /api/demos` sends a lead prompt to v0 and stores the resulting demo URL.
- `GET /api/health` checks app, Supabase, Gemini, and v0 configuration. Add `?live=1` for provider API checks.
- `GET /api/campaigns` loads recent Supabase campaigns and leads.
- `PATCH /api/leads/:id` updates lead status and refreshes campaign counters.
- `POST /api/outreach` drafts email or LinkedIn copy.
- `GET /api/track/open` records a tracking pixel event.
- `GET /api/track/click` records a click and redirects to the target URL.

## Provider Notes

- `GEMINI_ENABLED=false` keeps lead analysis on the free built-in website scanner unless you opt into Gemini calls.
- `SERPAPI_KEY` powers real Google Maps discovery when the source is Maps and source rows are blank.
- `PAGESPEED_API_KEY` powers mobile PageSpeed, SEO, accessibility, and best-practices scoring for leads with websites.
- `APIFY_TOKEN` is ready for non-Maps sources, but you must configure `APIFY_ACTOR_ID` or `APIFY_TASK_ID` for the scraper you want to run.
- `V0_MODEL` defaults to `v0-mini`, and `V0_MAX_PROMPT_CHARS=1600` keeps prompts compact.
- Campaign launch does not call v0 automatically. Use the demo button only when a specific lead is worth spending v0 credits on.
- The dashboard's **Free demo** button uses the local preview and spends no v0 credits. Use **v0 Mini** only when you intentionally want a generated v0 chat.
- The v0 client retries compatible Platform API and gateway-style model IDs so a single model mismatch does not break demo creation.
- Website URLs supplied in a campaign are lightly inspected for page title, meta description, mobile viewport, contact cues, and CTA cues before AI analysis.

## Security

Do not commit `.env.local`. Rotate any API keys that were pasted into chats, screenshots, or issue trackers.
