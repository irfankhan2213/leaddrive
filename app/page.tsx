'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Gauge,
  Globe,
  Mail,
  Search,
  Send,
  Star,
  Zap
} from 'lucide-react';
import AntimetalArchitecture3D from '@/components/AntimetalArchitecture3D';

/* Working brand name — single constant, rename here when decided. */
const BRAND = 'LeadDrive';

const PRIMARY_CTA = 'Start Free 14-Day Trial';
const SECONDARY_CTA = 'See how it works';

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
      q: `How accurate are the leads ${BRAND} finds?`,
      a: `${BRAND} pulls prospects from live Google Maps listings and verified directories via SerpAPI and Apify — never stale purchased lists. Every email is scraped directly from the business's own website or profile, and each lead ships with its source link so you can verify anything in one click before you hit send.`
    },
    {
      q: 'Is cold outreach through LeadDrive compliant?',
      a: `Yes. Every email sent through ${BRAND} carries a working one-click unsubscribe link, and anyone who opts out is suppressed from all future campaigns on your account — enforced server-side, so it can't be skipped by accident. We recommend pairing that with CAN-SPAM/GDPR best practice for your target regions.`
    },
    {
      q: 'What exactly does the demo engine build?',
      a: `For qualified prospects, ${BRAND} audits their current site — mobile speed, booking flow, SEO basics — then synthesizes a personalized live landing page tailored to their business using Vercel's v0 engine, usually in under a minute. You get a shareable link showing their business, redesigned to convert.`
    },
    {
      q: 'Why isn\'t this just another lead list?',
      a: `Lists are months old, unverified, and identical for every competitor who bought them. ${BRAND} discovers businesses that are live right now, enriches them with real audit data, and arms your first touch with a personalized demo nobody else has. That specificity is why reply rates run multiples above templates.`
    },
    {
      q: 'Can I cancel anytime? Do I need a card to start?',
      a: `No credit card is required for the 14-day trial — full access to discovery, audits, demos, and outreach. Paid plans are month-to-month; cancel in two clicks and you keep access until the end of your billing period. Your exported data is always yours.`
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

  const agents = [
    {
      category: 'Continuous',
      name: 'Scout',
      desc: 'Expands your niche and location into live search queries, then scrapes Google Maps and directories around the clock. Deduplicated, enriched, fit-scored.',
      stat: ['128 leads', 'per campaign, avg']
    },
    {
      category: 'Diagnostic',
      name: 'Inspector',
      desc: 'Audits every prospect\'s site: mobile speed, viewport, booking cues, contact paths. Weaknesses become your opening line — specific and verifiable.',
      stat: ['43 → 90+', 'mobile scores diagnosed']
    },
    {
      category: 'Generative',
      name: 'Builder',
      desc: 'Synthesizes a complete, hosted landing page per prospect — their name, their city, their services — and returns a live shareable link in ~41 seconds.',
      stat: ['41s', 'average build time']
    },
    {
      category: 'Operational',
      name: 'Dispatcher',
      desc: 'Sends the audit-backed pitch with the demo attached over email and SMS. Tracks opens, clicks, replies; suppresses opt-outs automatically.',
      stat: ['1-click', 'unsubscribes, always enforced']
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#0b0b10] antialiased selection:bg-blue-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ============================ NAV ============================ */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-slate-900/[0.06] bg-white/85 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b0b10]">
              <Zap className="h-3.5 w-3.5 fill-white text-white" />
            </span>
            <span className={`text-base font-extrabold tracking-tight transition-colors ${scrolled ? 'text-[#0b0b10]' : 'text-[#0b0b10]'}`}>
              {BRAND}
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {[
              ['#system', 'System'],
              ['#agents', 'Agents'],
              ['#pricing', 'Pricing'],
              ['#faq', 'FAQ']
            ].map(([href, label]) => (
              <a
                key={label}
                href={href}
                className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 no-underline transition-colors hover:text-[#0b0b10]"
              >
                {label}
              </a>
            ))}
          </nav>

          <Link
            href="/signup"
            className={`flex min-h-[44px] items-center rounded-full px-5 py-2 text-sm font-bold no-underline transition-all ${
              scrolled
                ? 'bg-[#0b0b10] text-white hover:bg-[#26262e]'
                : 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700'
            }`}
          >
            {PRIMARY_CTA.split(' ').slice(0, 3).join(' ')}
          </Link>
        </div>
      </header>

      <main>
        {/* ============================ 01 · HERO ============================ */}
        <section className="relative overflow-hidden border-b border-slate-900/[0.06] pt-32 sm:pt-40">
          {/* technical grid paper */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(37,99,235,0.05),transparent_65%)]" />

          <div className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
            <p className="mb-6 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
              The autonomous system for cold outreach
            </p>

            <h1 className="max-w-4xl text-balance text-5xl font-extrabold leading-[1.02] tracking-tighter text-[#0b0b10] sm:text-6xl md:text-7xl md:leading-[1.0]">
              Outreach that closes itself.
            </h1>

            <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <p className="max-w-md text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
                {BRAND} continuously finds your buyers, diagnoses their websites, builds each one a live demo of the fix — and starts the conversation for you.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
                <Link
                  href="/signup"
                  className="group flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 no-underline transition-all hover:bg-blue-700"
                >
                  {PRIMARY_CTA}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="#system"
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-[#0b0b10] no-underline transition-colors hover:border-slate-400"
                >
                  {SECONDARY_CTA}
                </a>
              </div>
            </div>

            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
              No credit card · First campaign live in ~3 min · Cancel anytime
            </p>

            {/* product frame */}
            <div className="relative mt-14 scroll-mt-24">
              <ProductFrame />
            </div>
          </div>
        </section>

        {/* ============================ INTEGRATION BAR ============================ */}
        <section aria-label="Integrations" className="border-b border-slate-900/[0.06] bg-white py-9">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
              {['SERPAPI', 'GOOGLE MAPS', 'APIFY', 'RESEND', 'TWILIO', 'VERTEX AI', 'SUPABASE', 'VERCEL V0'].map((name) => (
                <span key={name} className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-600">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 02 · THE GAP (manifesto) ============================ */}
        <section className="border-b border-slate-900/[0.06] py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionMarker number="02" label="The gap" />

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <h2 className="max-w-xl text-balance text-3xl font-extrabold leading-tight tracking-tight text-[#0b0b10] sm:text-4xl lg:col-span-7 lg:text-[2.75rem]">
                Cold outreach, as practiced today, is broken.
              </h2>

              <div className="space-y-5 text-sm leading-relaxed text-slate-600 sm:text-base lg:col-span-5">
                <p>
                  Lists are bought, aged, and identical for every competitor who brought them. Templates promise &ldquo;quick questions&rdquo; nobody believes. Research dies in spreadsheets, and follow-up dies with it.
                </p>
                <p>
                  The result: reply rates pinned near 1%, pipelines that depend on luck, and agencies burning hours on work a machine should own.
                </p>
                <p className="font-semibold text-[#0b0b10]">
                  {BRAND} is building the autonomous layer between you and your pipeline. It sources. It audits. It builds proof. It follows up.
                </p>
              </div>
            </div>

            {/* delta stats */}
            <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-900/[0.06] bg-slate-900/[0.06] sm:grid-cols-3">
              {[
                ['41s', 'from prospect to a live, personalized demo'],
                ['3.1×', 'reply-rate lift vs template email (private beta)'],
                ['0 hrs', 'of manual research per campaign']
              ].map(([n, l]) => (
                <div key={l} className="bg-white p-7 sm:p-8">
                  <div className="text-4xl font-extrabold tracking-tight text-[#0b0b10]">{n}</div>
                  <div className="mt-2 text-xs font-medium leading-relaxed text-slate-500">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 03 · THREE PILLARS ============================ */}
        <section className="border-b border-slate-900/[0.06] bg-[#fafaf9] py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionMarker number="03" label="How it operates" />

            <h2 className="mb-16 max-w-2xl text-balance text-3xl font-extrabold tracking-tight text-[#0b0b10] sm:text-4xl">
              Everyone else pitches.<br />We show up with proof.
            </h2>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
              {[
                {
                  k: 'THE SOURCING LAYER',
                  t: 'Live prospects. Never lists.',
                  d: 'Your niche and city expand into smart queries across Google Maps and directories. What comes back exists today — enriched, deduplicated, scored.'
                },
                {
                  k: 'THE PROOF ENGINE',
                  t: 'Show the fix, not the pitch.',
                  d: 'Every qualified prospect gets a hosted, personalized landing page demonstrating their own upgraded website. The objection closes itself.'
                },
                {
                  k: 'THE DELIVERY LOOP',
                  t: 'Send. Learn. Suppress. Repeat.',
                  d: 'Audit-backed emails with demos attached, tracked to the open and click. Opt-outs suppressed server-side so reputation compounds instead of burns.'
                }
              ].map((p) => (
                <div key={p.k} className="border-t-2 border-[#0b0b10] pt-6">
                  <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-600">{p.k}</p>
                  <h3 className="mb-3 text-xl font-extrabold tracking-tight text-[#0b0b10]">{p.t}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 04 · THE SYSTEM (Three.js) ============================ */}
        <div id="system" className="scroll-mt-20">
          <AntimetalArchitecture3D />
        </div>

        {/* ============================ 05 · AGENTS ============================ */}
        <section id="agents" className="scroll-mt-20 border-y border-slate-900/[0.06] py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionMarker number="05" label="Your pipeline, staffed" />

            <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="max-w-xl text-balance text-3xl font-extrabold tracking-tight text-[#0b0b10] sm:text-4xl">
                One platform. Four specialists.
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                Each agent owns one slice of outbound. Composable, auditable, and capped by your spend guardrails.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-900/[0.06] bg-slate-900/[0.06] md:grid-cols-2">
              {agents.map((a) => (
                <div key={a.name} className="group bg-white p-8 transition-colors hover:bg-[#fafbff] sm:p-10">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">{a.category}</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-[#0b0b10]">{a.name}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-600">{a.desc}</p>
                  <div className="flex items-baseline gap-2 border-t border-slate-100 pt-4">
                    <span className="text-lg font-extrabold text-blue-600">{a.stat[0]}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">{a.stat[1]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 06 · SOCIAL PROOF ============================ */}
        <section aria-label="Testimonials" className="border-b border-slate-900/[0.06] py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionMarker number="06" label="From the private beta" />

            <div className="mb-12 flex items-end justify-between gap-4">
              <h2 className="max-w-xl text-balance text-3xl font-extrabold tracking-tight text-[#0b0b10] sm:text-4xl">
                Agencies stopped chasing. Prospects started replying.
              </h2>
              <div className="hidden items-center gap-1 sm:flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#0b0b10] text-[#0b0b10]" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-900/[0.06] bg-slate-900/[0.06] md:grid-cols-3">
              {[
                {
                  quote: 'First campaign booked 11 discovery calls in week one. Prospects kept saying the same thing — “I saw my own website fixed.”',
                  name: 'Daniel R.',
                  role: 'Founder · 4-person web studio',
                  metric: '+11 calls / week 1'
                },
                {
                  quote: 'We replaced two research tools and a VA with one workflow. Reply rate went from 1.1% to 9% on the same list size.',
                  name: 'Priya S.',
                  role: 'GM · local SEO agency',
                  metric: '1.1% → 9% reply rate'
                },
                {
                  quote: 'The auto-built demos close the “prove it” objection before the call even happens. Our pitch is now: look at this.',
                  name: 'Marcus T.',
                  role: 'Owner · dev consultancy',
                  metric: '~80% less pitch time'
                }
              ].map((t) => (
                <figure key={t.name} className="flex flex-col justify-between bg-white p-8">
                  <div>
                    <span className="mb-5 inline-block rounded-full border border-slate-200 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                      {t.metric}
                    </span>
                    <blockquote className="text-sm leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</blockquote>
                  </div>
                  <figcaption className="mt-7 border-t border-slate-100 pt-4">
                    <div className="text-xs font-extrabold text-[#0b0b10]">{t.name}</div>
                    <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">{t.role}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 07 · PRICING ============================ */}
        <section id="pricing" className="scroll-mt-20 border-b border-slate-900/[0.06] bg-[#fafaf9] py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionMarker number="07" label="Pricing" />

            <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <h2 className="max-w-md text-balance text-3xl font-extrabold tracking-tight text-[#0b0b10] sm:text-4xl">
                One closed client pays for the year.
              </h2>

              <div className="inline-flex items-center self-start rounded-full border border-slate-300 bg-white p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`min-h-[40px] rounded-full px-5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all ${!annual ? 'bg-[#0b0b10] text-white' : 'text-slate-500'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`min-h-[40px] rounded-full px-5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all ${annual ? 'bg-[#0b0b10] text-white' : 'text-slate-500'}`}
                >
                  Annual −20%
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-900/[0.08] bg-slate-900/[0.08] md:grid-cols-3">
              {[
                {
                  name: 'Starter',
                  monthly: 49,
                  blurb: 'Solo operators running their first campaigns.',
                  features: ['500 fresh leads / month', '25 personalized AI demos', 'Email outreach + tracking', 'Website & PageSpeed audits', 'Auto unsubscribe suppression'],
                  cta: 'Start Free Trial'
                },
                {
                  name: 'Agency Pro',
                  monthly: 149,
                  highlight: true,
                  blurb: 'Agencies running outbound as a service.',
                  features: ['5,000 fresh leads / month', '150 personalized AI demos', 'Email + SMS sequences', 'Multi-location campaigns', 'BigQuery analytics export', 'Priority support'],
                  cta: 'Start Free Trial'
                },
                {
                  name: 'Scale',
                  monthly: 399,
                  blurb: 'Teams automating outbound across niches.',
                  features: ['Unlimited leads & campaigns', '500 AI demos / month', 'API access & webhooks', 'Custom AI scoring criteria', 'Dedicated onboarding'],
                  cta: 'Talk To Us'
                }
              ].map((tier) => (
                <div key={tier.name} className={`relative flex flex-col p-8 sm:p-10 ${tier.highlight ? 'bg-white ring-2 ring-inset ring-blue-600' : 'bg-white'}`}>
                  {tier.highlight && (
                    <span className="absolute -top-3 left-8 rounded-full bg-blue-600 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white">
                      Recommended
                    </span>
                  )}
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{tier.name}</h3>
                  <div className="mt-4 flex items-end gap-1.5">
                    <span className="text-5xl font-extrabold tracking-tighter text-[#0b0b10]">${price(tier.monthly)}</span>
                    <span className="pb-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">/mo{annual ? ' · billed annually' : ''}</span>
                  </div>
                  <p className="mt-3 text-xs font-medium leading-relaxed text-slate-500">{tier.blurb}</p>

                  <ul className="my-7 flex-1 space-y-3 border-t border-slate-100 pt-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px] font-medium text-slate-600">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/signup"
                    className={`flex min-h-[48px] w-full items-center justify-center rounded-full py-3 text-sm font-bold no-underline transition-all ${
                      tier.highlight ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700' : 'border border-slate-300 bg-white text-[#0b0b10] hover:border-slate-400'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>

            <p className="mt-7 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
              14 days free on every plan · No credit card · Cancel anytime
            </p>

            {/* mini FAQ under pricing */}
            <div className="mx-auto mt-12 max-w-3xl space-y-px overflow-hidden rounded-2xl border border-slate-900/[0.06] bg-slate-900/[0.06]">
              {[
                ['What counts as a lead?', 'Any prospect saved into your account during discovery. Deduplication means re-running a campaign in the same area won\'t double-count businesses you already have.'],
                ['What happens at my cap?', 'Discovery pauses; everything else keeps working — demos, outreach, analytics. Caps reset on your billing date, or upgrade instantly mid-cycle.']
              ].map(([q, a]) => (
                <details key={q} className="group cursor-pointer bg-white p-6 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex min-h-[32px] items-center justify-between text-sm font-extrabold text-[#0b0b10]">
                    {q}
                    <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-[13px] leading-relaxed text-slate-500">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 08 · FAQ ============================ */}
        <section id="faq" className="scroll-mt-20 border-b border-slate-900/[0.06] py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionMarker number="08" label="FAQ" />

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2 className="text-balance text-3xl font-extrabold tracking-tight text-[#0b0b10] sm:text-4xl">
                  What teams ask before trusting us with outreach.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  Still unsure?{' '}
                  <a href={`mailto:hello@${BRAND.toLowerCase()}.com`} className="font-semibold text-blue-600 underline decoration-blue-200 underline-offset-4 hover:decoration-blue-500">
                    hello@{BRAND.toLowerCase()}.com
                  </a>
                </p>
              </div>

              <div className="lg:col-span-8">
                <div className="divide-y divide-slate-900/[0.06] border-y border-slate-900/[0.06]">
                  {faqs.map((faq, i) => (
                    <div key={faq.q}>
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        aria-expanded={openFaq === i}
                        className="flex min-h-[64px] w-full items-center justify-between gap-6 py-5 text-left"
                      >
                        <span className="text-sm font-extrabold text-[#0b0b10] sm:text-base">{faq.q}</span>
                        <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 transition-transform duration-300 ${openFaq === i ? 'rotate-45 border-slate-300' : ''}`}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </span>
                      </button>
                      <div className={`grid transition-all duration-300 ${openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <p className="max-w-2xl pb-6 pr-10 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ 09 · FINAL CTA (light) ============================ */}
        <section className="relative overflow-hidden py-28 sm:py-36">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_100%,rgba(37,99,235,0.08),transparent_70%)]" />

          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">Ready when you are</p>
            <h2 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tighter text-[#0b0b10] sm:text-6xl">
              Your next client&apos;s demo is 41 seconds away.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-slate-600">
              Pick a niche. Pick a city. Watch the pipeline build itself.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="group flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-blue-600 px-9 py-3.5 text-base font-bold text-white shadow-xl shadow-blue-600/25 no-underline transition-all hover:bg-blue-700"
              >
                {PRIMARY_CTA}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login"
                className="flex min-h-[52px] items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3.5 text-base font-bold text-[#0b0b10] no-underline transition-colors hover:border-slate-400"
              >
                Log in
              </Link>
            </div>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">No credit card required</p>
          </div>
        </section>
      </main>

      {/* ============================ FOOTER ============================ */}
      <footer className="border-t border-slate-900/[0.06] py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b0b10]">
              <Zap className="h-3.5 w-3.5 fill-white text-white" />
            </span>
            <span className="text-base font-extrabold tracking-tight text-[#0b0b10]">{BRAND}</span>
            <span className="ml-2 hidden font-mono text-[10px] uppercase tracking-wider text-slate-400 sm:inline">Autonomous outbound</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            {['#system|System', '#agents|Agents', '#pricing|Pricing', '#faq|FAQ'].map((item) => {
              const [href, label] = item.split('|');
              return (
                <a key={label} href={href} className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 no-underline transition-colors hover:text-[#0b0b10]">
                  {label}
                </a>
              );
            })}
            <Link href="/login" className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 no-underline transition-colors hover:text-[#0b0b10]">
              Log in
            </Link>
          </nav>
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">© {new Date().getFullYear()} {BRAND}</p>
        </div>
      </footer>
    </div>
  );
}

/* ============================ shared pieces ============================ */

function SectionMarker({ number, label }: { number: string; label: string }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span className="font-mono text-[11px] font-semibold tracking-widest text-blue-600">{number}</span>
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">{label}</span>
      <span className="h-px flex-1 bg-slate-900/[0.08]" />
    </div>
  );
}

function ProductFrame() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-900/[0.09] bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.18)]">
      {/* chrome */}
      <div className="flex items-center gap-2 border-b border-slate-900/[0.06] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full border border-slate-300 bg-slate-100" />
        <span className="h-2.5 w-2.5 rounded-full border border-slate-300 bg-slate-100" />
        <span className="h-2.5 w-2.5 rounded-full border border-slate-300 bg-slate-100" />
        <div className="ml-3 hidden flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[11px] text-slate-400 sm:block">
          app.leaddrive.com/dashboard
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-100">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live campaign
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12">
        {/* sidebar */}
        <div className="hidden border-r border-slate-900/[0.06] p-4 sm:col-span-3 sm:block">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0b0b10]">
              <Zap className="h-3 w-3 fill-white text-white" />
            </span>
            <span className="text-xs font-extrabold text-[#0b0b10]">LeadDrive</span>
          </div>
          {[
            { icon: Globe, label: 'Dashboard' },
            { icon: Search, label: 'Leads', active: true },
            { icon: Globe, label: 'AI Demos' },
            { icon: Send, label: 'Outreach' }
          ].map((item) => (
            <div
              key={item.label}
              className={`mb-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-semibold ${
                item.active ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100' : 'text-slate-500'
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </div>
          ))}
          <div className="mt-6 rounded-xl border border-slate-200 p-3">
            <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-400">This month</div>
            <div className="mt-1 text-xl font-extrabold tracking-tight text-[#0b0b10]">9 replies</div>
            <div className="mt-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-emerald-600">▲ 3.2× vs template</div>
          </div>
        </div>

        {/* main */}
        <div className="p-4 sm:col-span-9 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">Campaign</div>
              <div className="text-sm font-extrabold text-[#0b0b10]">Dentists · Austin, TX</div>
            </div>
            <div className="flex divide-x divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
              {[
                ['128', 'leads'],
                ['34', 'qualified'],
                ['12', 'demos'],
                ['9', 'replies']
              ].map(([n, l]) => (
                <div key={l} className="bg-white px-3 py-1.5 text-center">
                  <div className="text-xs font-extrabold text-[#0b0b10]">{n}</div>
                  <div className="font-mono text-[8px] uppercase tracking-wider text-slate-400">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Bright Smile Dental', score: 94, tag: 'Demo ready', tone: 'emerald', issue: 'No mobile booking flow' },
              { name: 'Lone Star Orthodontics', score: 88, tag: 'Demo ready', tone: 'emerald', issue: 'Slow mobile load · 4.1s' },
              { name: 'Austin Family Dental', score: 81, tag: 'Qualified', tone: 'blue', issue: 'CTA below the fold' },
              { name: 'Hill Country Smiles', score: 76, tag: 'Qualified', tone: 'blue', issue: 'No online scheduling' }
            ].map((lead) => (
              <div key={lead.name} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold text-[#0b0b10]">{lead.name}</div>
                  <div className="truncate font-mono text-[10px] text-rose-500">⚠ {lead.issue}</div>
                </div>
                <div className="hidden items-center gap-1.5 sm:flex">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-600">fit {lead.score}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${
                      lead.tone === 'emerald' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' : 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
                    }`}
                  >
                    {lead.tag}
                  </span>
                </div>
                <span className="flex h-7 items-center rounded-lg bg-[#0b0b10] px-2 font-mono text-[9px] font-bold uppercase tracking-wider text-white">
                  Demo
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-2.5">
            <Gauge className="h-4 w-4 flex-shrink-0 text-blue-600" />
            <div className="min-w-0 flex-1 truncate font-mono text-[11px] font-medium text-blue-800">
              brightsmiledental.com — live demo built in 41s
            </div>
            <Mail className="h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
