# LeadDrive

AI-powered cold outreach automation for agencies and freelancers. It finds prospects, scores their digital presence, generates a personalized v0 demo, drafts outreach, and tracks the pipeline inside a single Next.js app.

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
V0_API_KEY=
V0_MODEL=v0-mini
V0_MAX_PROMPT_CHARS=1600
RESEND_API_KEY=
FROM_EMAIL=
FROM_NAME=
APP_BASE_URL=http://localhost:3000
```

The dashboard works with local mock persistence when Supabase keys are missing.

## Routes

- `POST /api/campaigns` creates a campaign, parses source input, scores leads, and stores them when Supabase is configured.
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
- `V0_MODEL` defaults to `v0-mini`, and `V0_MAX_PROMPT_CHARS=1600` keeps prompts compact.
- The dashboard's **Free demo** button uses the local preview and spends no v0 credits. Use **v0 Mini** only when you intentionally want a generated v0 chat.
- The v0 client retries compatible Platform API and gateway-style model IDs so a single model mismatch does not break demo creation.
- Website URLs supplied in a campaign are lightly inspected for page title, meta description, mobile viewport, contact cues, and CTA cues before AI analysis.

## Security

Do not commit `.env.local`. Rotate any API keys that were pasted into chats, screenshots, or issue trackers.
