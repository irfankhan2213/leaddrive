'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  Crosshair,
  Gauge,
  Globe,
  Instagram,
  Mail,
  MapPin,
  MessageSquareText,
  Minus,
  MousePointerClick,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Zap
} from 'lucide-react';
import { WebglAurora } from '@/components/landing/webgl-aurora';
import AntimetalArchitecture3D from '@/components/AntimetalArchitecture3D';

/* Working brand name — single constant, rename here when decided. */
const BRAND = 'LeadDrive';

const PRIMARY_CTA = 'Start My Free 14-Day Trial';
const SECONDARY_CTA = 'See It In Action';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const annual = billingCycle === 'annual';
  const price = (monthly: number) => (annual ? Math.round(monthly * 0.8) : monthly);

  const faqs = [
    {
      q: `How accurate are the leads and emails ${BRAND} finds?`,
      a: `${BRAND} pulls prospects from live Google Maps listings and verified directories via SerpAPI and Apify — not stale purchased lists. Every email is scraped directly from the business's own website or profile, and each lead ships with its source link so you can verify anything in one click before you ever hit send.`
    },
    {
      q: "Is cold outreach through LeadDrive compliant?",
      a: `Yes. Every email sent from ${BRAND} includes a working one-click unsubscribe link, and anyone who opts out is automatically suppressed from all future campaigns on your account — enforced server-side, so it can't be skipped by accident. We recommend following CAN-SPAM/GDPR best practices for your target regions.`
    },
    {
      q: 'What exactly does the AI demo engine build?',
      a: `For qualified prospects, ${BRAND} audits their current website (mobile speed, booking flow, SEO basics), then generates a personalized live landing page tailored to their business using Vercel's v0 engine — usually in under a minute. You get a shareable link showing their business with a modern, high-converting redesign.`
    },
    {
      q: 'How is this different from buying a lead list?',
      a: `Lists are months old, unverified, and identical for every competitor who bought them. ${BRAND} discovers businesses that are live right now, enriches them with real audit data, and arms your outreach with a personalized demo nobody else has — which is why reply rates run multiples higher than plain templates.`
    },
    {
      q: 'Can I cancel anytime? Do I need a credit card to start?',
      a: `No credit card is required for the 14-day free trial — you get full access to discovery, audits, demos, and outreach. After that, paid plans are month-to-month; cancel in two clicks from settings and you keep access until the end of your billing period. Your exported data is always yours.`
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a }
    }))
  };

  const pricingTiers = [
    {
      name: 'Starter',
      monthly: 49,
      blurb: 'For solo operators running their first outreach campaigns.',
      features: ['500 fresh leads / month', '25 personalized AI demos', 'Email outreach + open/click tracking', 'Website & PageSpeed audits', '1-click unsubscribe & suppression'],
      cta: 'Start Free Trial'
    },
    {
      name: 'Agency Pro',
      monthly: 149,
      blurb: 'For agencies and studios running outbound as a service.',
      highlight: true,
      features: ['5,000 fresh leads / month', '150 personalized AI demos', 'Email + SMS outreach sequences', 'Multi-location campaign support', 'BigQuery analytics export', 'Priority support'],
      cta: 'Start Free Trial'
    },
    {
      name: 'Scale',
      monthly: 399,
      blurb: 'For teams automating outbound across many niches at once.',
      features: ['Unlimited leads & campaigns', '500 AI demos / month', 'API access & webhooks', 'Custom AI scoring criteria', 'Dedicated onboarding'],
      cta: 'Talk To Us'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-indigo-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ============================ NAV (logo + one CTA) ============================ */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-slate-200/70 bg-white/85 backdrop-blur-xl shadow-sm' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className={`flex items-center gap-2 no-underline transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-400 shadow-lg shadow-blue-600/30">
              <Zap className="h-4 w-4 fill-white text-white" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">{BRAND}</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/login"
              className={`hidden min-h-[44px] items-center text-sm font-bold no-underline transition-colors sm:flex ${
                scrolled ? 'text-slate-700 hover:text-slate-950' : 'text-white/85 hover:text-white'
              }`}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="flex min-h-[44px] items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 no-underline transition-all hover:scale-[1.03] hover:shadow-blue-600/40"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ============================ 1. HERO ============================ */}
        <section className="relative overflow-hidden bg-[#05070f] pb-16 pt-32 sm:pb-24 sm:pt-40">
          {/* WebGL aurora background + CSS fallback gradient underneath */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_10%,#1e2a78_0%,#0a1030_45%,#05070f_100%)]" />
          <WebglAurora />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6">
            {/* Eyebrow badge */}
            <div className="mx-auto mb-7 inline-flex min-h-[36px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-blue-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              The AI outbound engine for agencies &amp; studios
            </div>

            {/* Outcome headline (≤10 words) */}
            <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-[3.6rem]">
              Turn Cold Prospects Into{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Booked Calls
              </span>{' '}
              — Automatically
            </h1>

            {/* Sub-headline (one supporting detail, ≤20 words) */}
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
              {BRAND} finds your ideal clients, audits their website, and auto-builds a personalized live demo for every prospect.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="group flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-blue-600/40 no-underline transition-all hover:scale-[1.03] hover:shadow-blue-500/50 sm:w-auto"
              >
                {PRIMARY_CTA}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#product"
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-7 py-3.5 text-base font-bold text-white backdrop-blur-md no-underline transition-all hover:bg-white/[0.12] sm:w-auto"
              >
                <MousePointerClick className="h-4 w-4 text-cyan-300" />
                {SECONDARY_CTA}
              </a>
            </div>

            {/* Trust micro-copy */}
            <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium text-slate-400">
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> No credit card required</span>
              <span aria-hidden>·</span>
              <span>First campaign live in ~3 minutes</span>
              <span aria-hidden>·</span>
              <span>Cancel anytime</span>
            </p>

            {/* ==================== Real product UI mockup ==================== */}
            <div id="product" className="relative mx-auto mt-16 max-w-4xl scroll-mt-24">
              {/* glow */}
              <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-r from-blue-600/25 via-indigo-500/20 to-cyan-400/20 blur-3xl" />

              <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0b1120]/90 text-left shadow-2xl backdrop-blur-xl sm:rounded-[1.75rem]">
                {/* browser chrome */}
                <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  <div className="ml-3 hidden flex-1 rounded-md bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-slate-400 sm:block">
                    app.{BRAND.toLowerCase()}.com/dashboard
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> LIVE CAMPAIGN
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12">
                  {/* mini sidebar */}
                  <div className="hidden border-r border-white/8 p-4 sm:col-span-3 sm:block">
                    <div className="mb-5 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
                        <Zap className="h-3 w-3 fill-white text-white" />
                      </span>
                      <span className="text-xs font-extrabold text-white">{BRAND}</span>
                    </div>
                    {[
                      { icon: BarChart3, label: 'Dashboard' },
                      { icon: Search, label: 'Leads', active: true },
                      { icon: Globe, label: 'AI Demos' },
                      { icon: Send, label: 'Outreach' },
                      { icon: Bot, label: 'Settings' }
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`mb-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-semibold ${
                          item.active ? 'bg-blue-500/15 text-blue-300' : 'text-slate-400'
                        }`}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        {item.label}
                      </div>
                    ))}
                    <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.04] p-3">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">This month</div>
                      <div className="mt-1 text-lg font-extrabold text-white">9 replies</div>
                      <div className="text-[9px] font-semibold text-emerald-400">▲ 3.2× vs plain email</div>
                    </div>
                  </div>

                  {/* main panel */}
                  <div className="p-4 sm:col-span-9 sm:p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-semibold text-slate-500">CAMPAIGN</div>
                        <div className="text-sm font-extrabold text-white">Dentists · Austin, TX</div>
                      </div>
                      <div className="flex gap-1.5">
                        {[
                          ['128', 'leads'],
                          ['34', 'qualified'],
                          ['12', 'demos'],
                          ['9', 'replies']
                        ].map(([n, l]) => (
                          <div key={l} className="rounded-lg border border-white/8 bg-white/[0.04] px-2.5 py-1.5 text-center">
                            <div className="text-xs font-extrabold text-white">{n}</div>
                            <div className="text-[9px] font-medium text-slate-500">{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* lead rows */}
                    <div className="space-y-2">
                      {[
                        { name: 'Bright Smile Dental', score: 94, tag: 'Demo ready', tone: 'emerald', issue: 'No mobile booking flow' },
                        { name: 'Lone Star Orthodontics', score: 88, tag: 'Demo ready', tone: 'emerald', issue: 'Slow mobile load · 4.1s' },
                        { name: 'Austin Family Dental', score: 81, tag: 'Qualified', tone: 'blue', issue: 'CTA below the fold' },
                        { name: 'Hill Country Smiles', score: 76, tag: 'Qualified', tone: 'blue', issue: 'No online scheduling' }
                      ].map((lead) => (
                        <div key={lead.name} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2.5">
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xs font-bold text-white">{lead.name}</div>
                            <div className="truncate text-[10px] text-rose-300/90">⚠ {lead.issue}</div>
                          </div>
                          <div className="hidden items-center gap-1.5 sm:flex">
                            <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-bold text-slate-300">fit {lead.score}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                                lead.tone === 'emerald' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-blue-400/15 text-blue-300'
                              }`}
                            >
                              {lead.tag}
                            </span>
                          </div>
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-[9px] font-extrabold text-white shadow-md shadow-blue-600/30">
                            DEMO
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* demo card footer */}
                    <div className="mt-3 flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/[0.08] to-indigo-500/[0.08] px-3 py-2.5">
                      <Globe className="h-4 w-4 flex-shrink-0 text-cyan-300" />
                      <div className="min-w-0 flex-1 truncate text-[11px] font-semibold text-cyan-200">
                        demo built for brightsmiledental.com — live in 41s
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0 text-cyan-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ 2. PROOF BAR (directly under hero) ============================ */}
        <section aria-label="Integrations" className="border-b border-slate-200/70 bg-white py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
              Plugs straight into your data &amp; delivery stack
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
              {['SerpAPI', 'Google Maps', 'Apify', 'Resend', 'Twilio', 'Vertex AI', 'Supabase', 'Vercel v0'].map((name) => (
                <span key={name} className="text-sm font-extrabold tracking-tight text-slate-400 transition-colors hover:text-slate-600">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 3. VALUE PROP ============================ */}
        <section className="bg-slate-50 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-blue-600">Why {BRAND}</span>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-[2.75rem] md:leading-tight">
                Prospects ignore pitches. They can&apos;t ignore their own upgraded website.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-slate-500">
                Instead of telling a business what&apos;s wrong with their site, {BRAND} shows them — a live, personalized demo of what it could be, attached to your very first email.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* old way */}
              <div className="ld-card p-8 opacity-90">
                <div className="mb-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  <Minus className="h-4 w-4" /> The old way
                </div>
                <ul className="space-y-4">
                  {[
                    'Hours scraped from directories into spreadsheets',
                    'Generic templates that read like everyone else\'s',
                    'Reply rates stuck around 1–2%',
                    'Follow-ups tracked by hand across inboxes'
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm font-medium text-slate-500">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-[10px] font-black text-rose-500">✕</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* new way */}
              <div className="ld-card-accent relative overflow-hidden p-8 text-white">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
                <div className="mb-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-cyan-100 backdrop-blur">
                  <Zap className="h-4 w-4 fill-cyan-200 text-cyan-200" /> With {BRAND}
                </div>
                <ul className="space-y-4">
                  {[
                    'Campaigns scrape live Google Maps & directory data in minutes',
                    'Every prospect audited: speed, mobile UX, booking flow, SEO',
                    'A personalized live demo site generated for top prospects',
                    'Opens, clicks, replies and opt-outs tracked in one dashboard'
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm font-semibold text-blue-50">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-400/90">
                        <Check className="h-3 w-3 text-white" strokeWidth={3.5} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* stat chips */}
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ['41s', 'average time to build a prospect\'s demo'],
                ['3.1×', 'reply-rate lift vs template email (private beta)'],
                ['0', 'hours of manual prospect research per campaign']
              ].map(([n, l]) => (
                <div key={l} className="ld-card p-6 text-center">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-3xl font-extrabold text-transparent">{n}</div>
                  <div className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 4. SOCIAL PROOF ============================ */}
        <section aria-label="Testimonials" className="border-y border-slate-200/70 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-blue-600">From the private beta</span>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Agencies stopped chasing. Clients started replying.
                </h2>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-xs font-extrabold text-amber-700">Loved by beta users</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  quote: 'First campaign booked 11 discovery calls in week one. Prospects kept saying the same thing — “I saw my own website fixed.”',
                  name: 'Daniel R.',
                  role: 'Founder, 4-person web studio',
                  metric: '+11 calls in week 1'
                },
                {
                  quote: 'We replaced two research tools and a VA with one campaign workflow. Reply rate went from 1.1% to 9% on the same list size.',
                  name: 'Priya S.',
                  role: 'GM, local SEO agency',
                  metric: '1.1% → 9% reply rate'
                },
                {
                  quote: 'The auto-built demos close the “prove you can do it” objection before the call even happens. Our pitch is now just: look at this.',
                  name: 'Marcus T.',
                  role: 'Owner, dev consultancy',
                  metric: 'Pitch time cut ~80%'
                }
              ].map((t) => (
                <figure key={t.name} className="ld-card flex flex-col justify-between p-7">
                  <div>
                    <span className="mb-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-600 ring-1 ring-emerald-100">
                      {t.metric}
                    </span>
                    <blockquote className="text-sm leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</blockquote>
                  </div>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-xs font-extrabold text-white">
                      {t.name[0]}
                    </span>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">{t.name}</div>
                      <div className="text-[11px] font-medium text-slate-400">{t.role}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 5. FEATURES (benefit-led + product visuals) ============================ */}
        <section id="features" className="scroll-mt-20 bg-slate-50 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-blue-600">The pipeline</span>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                From empty pipeline to booked call — four steps, one tool.
              </h2>
            </div>

            <div className="space-y-16 sm:space-y-24">
              {/* Feature 1 — Discovery */}
              <FeatureRow
                reverse={false}
                title="Fill your pipeline while you sleep"
                body={`${BRAND} expands your niche and location into smart search queries, then scrapes live Google Maps and directory listings via SerpAPI and Apify. Every lead arrives enriched with website, phone, rating and source — deduplicated and scored.`}
                bullets={['Live sources — never stale lists', 'Contact info extracted automatically', 'Fit-scored so you start with the best']}
                icon={<Search className="h-4 w-4" />}
                step="01 · Discover"
                visual={
                  <MockFrame label="Lead discovery · SerpAPI">
                    <div className="mb-3 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                      <MapPin className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-[11px] font-semibold text-slate-600">dentist in Austin, TX</span>
                      <span className="ml-auto rounded-md bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">128 found</span>
                    </div>
                    {[
                      { n: 'Bright Smile Dental', s: 'Maps · ★4.9 · 212 reviews' },
                      { n: 'Lone Star Orthodontics', s: 'Maps · ★4.7 · 164 reviews' },
                      { n: 'Austin Family Dental', s: 'Directory · email found ✓' },
                      { n: 'Hill Country Smiles', s: 'Maps · ★4.6 · 98 reviews' }
                    ].map((r) => (
                      <div key={r.n} className="mb-2 flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2">
                        <div>
                          <div className="text-[11px] font-bold text-slate-800">{r.n}</div>
                          <div className="text-[10px] text-slate-400">{r.s}</div>
                        </div>
                        <Instagram className="h-3 w-3 text-slate-300" />
                      </div>
                    ))}
                  </MockFrame>
                }
              />

              {/* Feature 2 — Audit */}
              <FeatureRow
                reverse
                title="Know exactly why they're losing customers"
                body="Each lead's website gets an automated technical audit: mobile page speed, viewport, booking cues, contact paths. Weaknesses become your opening line — specific, credible, impossible to ignore."
                bullets={['Google PageSpeed data per lead', 'Weaknesses turned into talking points', '0–100 fit scoring with reasons']}
                icon={<Gauge className="h-4 w-4" />}
                step="02 · Audit"
                visual={
                  <MockFrame label="Website audit · PageSpeed">
                    <div className="mb-3 flex items-center gap-4">
                      <svg viewBox="0 0 80 80" className="h-20 w-20 flex-shrink-0">
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#fee2e2" strokeWidth="8" />
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#f43f5e" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 32 * 0.43} 999`} transform="rotate(-90 40 40)" />
                        <text x="40" y="46" textAnchor="middle" className="fill-slate-900 text-[18px] font-extrabold">43</text>
                      </svg>
                      <div className="space-y-1.5 text-[11px] font-semibold text-slate-600">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Detected weaknesses</div>
                        <div className="flex items-center gap-1.5"><Crosshair className="h-3 w-3 text-rose-500" /> Mobile load 4.1s</div>
                        <div className="flex items-center gap-1.5"><Crosshair className="h-3 w-3 text-rose-500" /> No 1-click booking</div>
                        <div className="flex items-center gap-1.5"><Crosshair className="h-3 w-3 text-amber-500" /> CTA below the fold</div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-700">
                      → Outreach angle auto-drafted: “Your site takes 4s to load — here&apos;s a 0.8s version.”
                    </div>
                  </MockFrame>
                }
              />

              {/* Feature 3 — Demo engine */}
              <FeatureRow
                reverse={false}
                title="Show up with their dream website, already built"
                body="For top-scoring prospects, the v0-powered demo engine generates a complete, modern landing page for their business — their name, their city, their services — hosted live on a shareable link. Built in about 41 seconds, before your first email."
                bullets={['Personalized per prospect, automatically', 'Live hosted links — no screenshots', 'Credit-guarded: caps & minimum scores']}
                icon={<Bot className="h-4 w-4" />}
                step="03 · Demo"
                visual={
                  <MockFrame label="AI demo engine · v0">
                    <div className="rounded-xl border border-slate-200 shadow-inner">
                      <div className="flex items-center gap-1.5 rounded-t-xl border-b border-slate-100 bg-slate-50 px-3 py-1.5">
                        <span className="h-2 w-2 rounded-full bg-rose-300" />
                        <span className="h-2 w-2 rounded-full bg-amber-300" />
                        <span className="h-2 w-2 rounded-full bg-emerald-300" />
                        <span className="ml-2 text-[9px] font-semibold text-slate-400">demo/bright-smile-dental</span>
                      </div>
                      <div className="space-y-2 p-3">
                        <div className="h-2.5 w-3/5 rounded bg-slate-200" />
                        <div className="h-2 w-4/5 rounded bg-slate-100" />
                        <div className="flex gap-2 pt-1">
                          <div className="h-6 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
                          <div className="h-6 w-14 rounded-full bg-slate-100" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div className="h-9 rounded-lg bg-slate-100" />
                          <div className="h-9 rounded-lg bg-slate-100" />
                          <div className="h-9 rounded-lg bg-slate-100" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold text-emerald-600">
                      <Zap className="h-3 w-3 fill-emerald-500 text-emerald-500" /> Live in 41s · ready to send
                    </div>
                  </MockFrame>
                }
              />

              {/* Feature 4 — Outreach */}
              <FeatureRow
                reverse
                title="Send outreach people actually answer"
                body="Your first email lands with the demo attached and the audit finding as the hook. Opens, clicks, replies and opt-outs are tracked per lead, unsubscribes are suppressed automatically, and BigQuery-ready analytics show what's converting."
                bullets={['Email via Resend, SMS via Twilio', 'One-click unsubscribe, always enforced', 'Open / click / reply analytics built in']}
                icon={<Send className="h-4 w-4" />}
                step="04 · Outreach"
                visual={
                  <MockFrame label="Outreach · Resend">
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-inner">
                      <div className="text-[10px] font-bold text-slate-800">Quick idea for Bright Smile Dental</div>
                      <div className="mt-1 text-[10px] leading-relaxed text-slate-500">
                        Noticed your site takes 4s to load on phones… we built a 0.8s version of your homepage — take a look:
                      </div>
                      <div className="mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-1.5 text-center text-[9px] font-extrabold text-white">
                        ⚡ Open Interactive Live Demo
                      </div>
                      <div className="mt-2 border-t border-slate-100 pt-1.5 text-center text-[8px] text-slate-300">Unsubscribe — one click, no further emails</div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {[['68%', 'opens'], ['31%', 'clicks'], ['9%', 'replies']].map(([n, l]) => (
                        <div key={l} className="rounded-lg bg-slate-100 py-2 text-center">
                          <div className="text-sm font-extrabold text-slate-900">{n}</div>
                          <div className="text-[9px] font-semibold text-slate-400">{l}</div>
                        </div>
                      ))}
                    </div>
                  </MockFrame>
                }
              />
            </div>

            {/* Mid-page CTA */}
            <div className="mt-20 text-center">
              <Link
                href="/signup"
                className="group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-blue-600/30 no-underline transition-all hover:scale-[1.02]"
              >
                Build My First Campaign
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <p className="mt-3 text-xs font-medium text-slate-400">Free for 14 days · No credit card required</p>
            </div>
          </div>
        </section>

        {/* ============================ 5b. 3D ARCHITECTURE (Three.js) ============================ */}
        <AntimetalArchitecture3D />

        {/* ============================ 6. PRICING (+ mini FAQ) ============================ */}
        <section id="pricing" className="scroll-mt-20 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-blue-600">Pricing</span>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                One closed client pays for the year.
              </h2>

              {/* billing toggle */}
              <div className="mt-7 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`min-h-[40px] rounded-full px-5 text-xs font-bold transition-all ${!annual ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`min-h-[40px] rounded-full px-5 text-xs font-bold transition-all ${annual ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}
                >
                  Annual <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-600">−20%</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`ld-card relative flex flex-col p-8 ${tier.highlight ? 'ring-2 ring-blue-600' : ''}`}
                >
                  {tier.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">{tier.name}</h3>
                  <div className="mt-3 flex items-end gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900">${price(tier.monthly)}</span>
                    <span className="pb-1 text-sm font-semibold text-slate-400">/mo{annual ? ', billed annually' : ''}</span>
                  </div>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-slate-400">{tier.blurb}</p>

                  <ul className="my-6 flex-1 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px] font-medium text-slate-600">
                        <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${tier.highlight ? 'text-blue-600' : 'text-emerald-500'}`} strokeWidth={3} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/signup"
                    className={`flex min-h-[46px] w-full items-center justify-center rounded-full py-3 text-sm font-bold no-underline transition-all hover:scale-[1.02] ${
                      tier.highlight
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                        : 'border border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>

            {/* trust line */}
            <p className="mt-8 text-center text-xs font-semibold text-slate-400">
              Every plan starts with 14 days free — no credit card required. Cancel anytime, keep your data.
            </p>

            {/* mini FAQ directly under pricing cards */}
            <div className="mx-auto mt-12 max-w-3xl space-y-3">
              {[
                ['What counts as a lead?', 'Any prospect saved into your account during discovery. Deduplication means re-running a campaign in the same area won\'t double-bill you for businesses you already have.'],
                ['What happens if I hit my monthly cap?', 'Scraping pauses and everything else keeps working — demos, outreach, analytics. Caps reset on your billing date, or upgrade instantly from settings mid-cycle.']
              ].map(([q, a]) => (
                <details key={q} className="group ld-card cursor-pointer p-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex min-h-[32px] items-center justify-between text-sm font-extrabold text-slate-800">
                    {q}
                    <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-[13px] leading-relaxed text-slate-500">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 7. FAQ ============================ */}
        <section id="faq" className="scroll-mt-20 bg-slate-50 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-blue-600">FAQ</span>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Everything you're wondering, answered honestly.
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={faq.q} className="ld-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="flex min-h-[56px] w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  >
                    <span className="text-sm font-extrabold text-slate-900 sm:text-base">{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-slate-500">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-xs font-medium text-slate-400">
              Still unsure? Email us at{' '}
              <a href={`mailto:hello@${BRAND.toLowerCase()}.com`} className="font-bold text-blue-600 underline decoration-blue-200 hover:decoration-blue-500">
                hello@{BRAND.toLowerCase()}.com
              </a>
            </p>
          </div>
        </section>

        {/* ============================ 8. FINAL CTA ============================ */}
        <section className="relative overflow-hidden bg-[#05070f] py-24">
          <div className="absolute inset-0 bg-[radial-gradient(90%_120%_at_50%_120%,#2338a8_0%,#0b1030_55%,#05070f_100%)]" />
          <WebglAurora />
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-tight">
              Your next client's demo could be live five minutes from now.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-slate-300">
              Pick a niche, pick a city, and watch {BRAND} build the pipeline for you.
            </p>
            <Link
              href="/signup"
              className="group mt-9 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-4 text-lg font-bold text-white shadow-2xl shadow-blue-600/40 no-underline transition-all hover:scale-[1.03]"
            >
              {PRIMARY_CTA}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="mt-4 text-xs font-medium text-slate-400">No credit card required · Cancel anytime</p>
          </div>
        </section>
      </main>

      {/* ============================ FOOTER (minimal) ============================ */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-400">
              <Zap className="h-3.5 w-3.5 fill-white text-white" />
            </span>
            <span className="text-base font-extrabold tracking-tight text-slate-900">{BRAND}</span>
          </div>
          <nav className="flex items-center gap-6 text-xs font-bold text-slate-500">
            <a href="#features" className="transition-colors hover:text-slate-900">Features</a>
            <a href="#pricing" className="transition-colors hover:text-slate-900">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-slate-900">FAQ</a>
            <Link href="/login" className="transition-colors hover:text-slate-900">Log in</Link>
          </nav>
          <p className="text-[11px] font-medium text-slate-400">© {new Date().getFullYear()} {BRAND}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/* ============================ shared pieces ============================ */

function FeatureRow({
  step,
  title,
  body,
  bullets,
  icon,
  visual,
  reverse
}: {
  step: string;
  title: string;
  body: string;
  bullets: string[];
  icon: React.ReactNode;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
      <div className={reverse ? 'lg:order-2' : ''}>
        <span className="mb-4 inline-flex min-h-[36px] items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-blue-700 ring-1 ring-blue-100">
          {icon}
          {step}
        </span>
        <h3 className="text-balance text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h3>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-500 sm:text-base">{body}</p>
        <ul className="mt-5 space-y-2.5">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm font-semibold text-slate-700">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" strokeWidth={3} />
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className={reverse ? 'lg:order-1' : ''}>{visual}</div>
    </div>
  );
}

function MockFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="ld-card p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        <MessageSquareText className="h-3.5 w-3.5 text-blue-500" />
        {label}
      </div>
      {children}
    </div>
  );
}
