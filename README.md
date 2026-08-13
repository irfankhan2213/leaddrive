# ⚡ LeadDrive — AI-Powered Cold Outreach & Demo Automation Platform

**LeadDrive** is an end-to-end cold outreach automation engine designed for digital agencies, software consultancies, and freelancers. It discovers real business prospects, performs multi-keyword search query expansions, audits digital presence (mobile viewport, CTAs, PageSpeed, SEO), scrapes direct emails & contact info, generates personalized **v0 AI landing page demos**, and manages cold outreach delivery with live open/click analytics tracking.

---

## 🌟 Key Features & Capability Matrix

| Capability | Description | Powered By |
|------------|-------------|------------|
| **Multi-Keyword Query Expansion** | Expands target audience & location into 4 discovery strategy pillars (timeline `2026`, sub-niche `SaaS`, registries/directories, commercial intent) | Gemini / Anthropic / Algorithmic Engine |
| **Lead Discovery Engine** | Real-time business prospect discovery from Google Maps, LinkedIn, Apollo, Product Hunt, URLs, or CSV lists | SerpAPI & Apify |
| **Website & Contact Scraper** | Fetches website HTML, extracts `mailto:` emails, `tel:` phones, `linkedin.com/company` profiles, and detects SPA frameworks | Node Fetch & HTML Parser |
| **Technical & PageSpeed Audit** | Evaluates mobile performance, SEO, accessibility, and best practices with automated snapshot estimation fallback | Google PageSpeed API |
| **v0 AI Site Builder** | Builds live, interactive Next.js + Tailwind CSS landing pages tailored to each prospect's exact conversion vulnerability | Vercel v0 Platform API (`https://api.v0.dev/v1/chats`) |
| **Dual AI Provider System** | Choose between **Google Gemini 2.5 Flash** or **Anthropic Claude 3.5 Haiku / 3.7 Sonnet** with custom API keys in Settings | Google AI / Anthropic API |
| **Outreach Delivery & Tracking** | Sends cold emails via Resend API with 1x1 open tracking pixels (`/api/track/open`) and redirect click tracking (`/api/track/click`) | Resend API & Supabase |

---

## 🏗️ Architecture & Pipeline Flow

```mermaid
flowchart TD
  User["User / Agency"] -->|Launch Campaign| Modal["New Campaign Modal"]
  Modal -->|POST /api/campaigns| CampaignRoute["Campaign Orchestration Route"]
  CampaignRoute -->|1. Query Expansion| Keywords["AI Keyword Generator (Gemini / Anthropic)"]
  CampaignRoute -->|2. Search & Scrape| Discovery["Lead Discovery (SerpAPI Google Maps / Apify)"]
  CampaignRoute -->|3. Contact Scraper| WebInspector["Website Inspector (Emails, Phones, LinkedIn, SPAs)"]
  CampaignRoute -->|4. Tech Audit| PageSpeed["PageSpeed Audit (Performance, SEO, Viewport)"]
  CampaignRoute -->|5. Fit Scoring| Scoring["Granular 0-100 Scoring & Vulnerability Detector"]
  CampaignRoute -->|6. Save Data| DB[("Supabase PostgreSQL Database")]
  
  User -->|Generate AI Demo| DemoRoute["POST /api/demos"]
  DemoRoute -->|v0 API| V0Dev["Vercel v0 Platform API"]
  V0Dev -->|Live Landing Page| DemoURL["https://demo-*.vusercontent.net"]
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher

### 2. Clone & Install
```bash
git clone https://github.com/irfankhan2213/leaddrive.git
cd leaddrive
pnpm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill `.env.local` with your API keys:
```bash
# Core Application URL
APP_BASE_URL="http://localhost:3000"

# Database Persistence (Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://your-supabase-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# AI Discovery & Lead Analysis
GEMINI_API_KEY="your_gemini_api_key"
GEMINI_ENABLED="true"
GEMINI_MODEL="gemini-2.5-flash"

ANTHROPIC_API_KEY="your_anthropic_api_key"
ANTHROPIC_ENABLED="true"

# Search Discovery Engines
SERPAPI_KEY="your_serpapi_key"
APIFY_TOKEN="your_apify_token"
APIFY_ACTOR_ID="your_apify_actor_id"

# Technical Auditing
PAGESPEED_API_KEY="your_pagespeed_api_key"

# Vercel v0 AI Site Builder
V0_API_KEY="your_v0_api_key"
V0_MODEL="v0-mini"

# Cold Outreach Delivery
RESEND_API_KEY="your_resend_api_key"
FROM_EMAIL="outreach@yourdomain.com"
FROM_NAME="LeadDrive Specialist"
```

### 4. Run Database Schema Migration
Open your **Supabase SQL Editor** and execute the contents of [supabase/schema.sql](file:///Users/irfan/Desktop/leaddrive/supabase/schema.sql).

### 5. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Reference

### 1. Campaigns & Pipeline
- `GET /api/campaigns`: Retrieves all campaigns and scraped leads from Supabase.
- `POST /api/campaigns`: Launches multi-keyword search query expansions, scrapes target prospects via SerpAPI/Apify, runs website contact scraping & PageSpeed audits, scores leads (0-100), and persists campaign records.

### 2. v0 AI Demo Building
- `POST /api/demos`: Sends custom lead design prompts to the Vercel v0 API (`https://api.v0.dev/v1/chats`) to build live Next.js + Tailwind CSS landing page demos.

### 3. Outreach & Email Delivery
- `POST /api/outreach`: Sends tailored cold outreach emails via Resend API with open-tracking pixels and click-tracking links.

### 4. Tracking Pixels & Analytics
- `GET /api/track/open?leadId=...`: 1x1 transparent GIF endpoint recording email opens.
- `GET /api/track/click?leadId=...&target=...`: Validates redirect URLs and records click events.

### 5. Health & Diagnostic Check
- `GET /api/health?live=1`: Checks database connectivity, environment variable configurations, and AI provider reachability.

---

## 🛡️ Security & SSRF Protection

- **SSRF Hardening**: Website scraping (`lib/website.ts`) validates URL schemes (`http`/`https`) and strictly blocks private IP ranges (`127.0.0.1`, `10.x`, `192.168.x`, `169.254.x`) and internal hostnames.
- **Open Redirect Protection**: Click-tracking redirect validation (`lib/track/click`) sanitizes target destinations to prevent backslash bypass tricks and open redirects.
- **Database Row Level Security**: Supabase tables enforce RLS policies and restrict `service_role` operations.

---

## 📄 License & Credits

Built with ❤️ by the LeadDrive team using Next.js, Supabase, Tailwind CSS, Google Gemini, Anthropic Claude, and Vercel v0.
