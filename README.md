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
V0_API_KEY=
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
- `POST /api/outreach` drafts email or LinkedIn copy.
- `GET /api/track/open` records a tracking pixel event.
- `GET /api/track/click` records a click and redirects to the target URL.

## Security

Do not commit `.env.local`. Rotate any API keys that were pasted into chats, screenshots, or issue trackers.
