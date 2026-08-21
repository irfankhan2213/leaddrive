'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Globe,
  Zap,
  Cpu,
  Mail,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  ChevronDown,
  BarChart3,
  Search,
  ExternalLink,
  Code2,
  Terminal,
} from 'lucide-react';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeTab, setActiveTab] = useState<'discover' | 'audit' | 'demo' | 'outreach'>('demo');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const discountMultiplier = billingCycle === 'annual' ? 0.8 : 1;

  const faqs = [
    {
      q: 'How does LeadDrive generate custom website demos for cold prospects?',
      a: 'LeadDrive integrates directly with high-performance AI engines (including Vercel v0, Google Vertex AI, and our custom Agentic HTML builder). When a prospect is qualified, our agents scrape the prospect’s existing branding, diagnose flaws in their current web design, and synthesize a complete, interactive, mobile-responsive prototype that you can link directly in your cold outreach.',
    },
    {
      q: 'Which lead sources are supported out of the box?',
      a: 'We support automated discovery across Google Maps Local Business listings, Apollo.io API, LinkedIn search, Product Hunt launches, Instagram business profiles, raw URL lists, and custom CSV imports with automatic column mapping.',
    },
    {
      q: 'Can I connect my own custom sending domains and email providers?',
      a: 'Yes. LeadDrive supports direct SMTP/IMAP connections, SendGrid, Resend, and custom webhooks. You can warm up mailboxes, track open/click telemetry, and automatically pause outreach if bounce thresholds are reached.',
    },
    {
      q: 'How does LeadDrive diagnose website conversion and speed bottlenecks?',
      a: 'Our background crawlers run automated Google PageSpeed and Lighthouse audits, inspect mobile viewport responsiveness, extract missing meta tags, and scan for outdated tech stacks to give you concrete, undeniable leverage in your pitch.',
    },
    {
      q: 'Can I invite my agency team members and clients?',
      a: 'Absolutely. On the Growth Pro and Agency Scale tiers, you can invite team members with granular role-based access, organize campaigns by client workspace, and share white-labeled demo links.',
    },
    {
      q: 'What is your refund and cancellation policy?',
      a: 'You can cancel anytime with a single click from your billing settings. We offer a 14-day risk-free money-back guarantee on all subscription plans.',
    },
  ];

  return (
    <div className="octo-canvas min-h-screen text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Top Floating Glass Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between rounded-full border border-slate-200/80 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-md transition-all duration-300">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 text-slate-900 no-underline">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-md">
                L
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900">LeadDrive</span>
              <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-slate-600 sm:inline-block font-mono">
                SaaS v2.4
              </span>
            </Link>

            {/* Middle Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-slate-600">
              <a href="#pipeline" className="hover:text-slate-900 transition-colors">Platform</a>
              <a href="#features" className="hover:text-slate-900 transition-colors">Capabilities</a>
              <a href="#philosophy" className="hover:text-slate-900 transition-colors">Philosophy</a>
              <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
            </nav>

            {/* Auth Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="octo-pill-btn octo-pill-dark !py-1.5 !px-4 !text-xs"
              >
                Start Free Trial <ArrowRight className="h-3.5 w-3.5 ml-1 inline" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 px-4 sm:px-8 overflow-hidden">
        {/* Background Ambient Geometric Grid */}
        <div className="absolute inset-0 octo-grid-bg opacity-40 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-b from-blue-100/50 via-sky-50/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl text-center relative z-10">
          {/* Telemetry Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3.5 py-1.5 shadow-sm backdrop-blur-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] font-medium tracking-wide text-slate-700">
              LEADDRIVE 2.4 · REVENUE SUPERINTELLIGENCE FOR AGENCIES
            </span>
          </div>

          {/* Luxury Editorial Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-slate-950 leading-[1.08] mb-6">
            Making agency outreach <br />
            <span className="italic font-serif text-slate-800">infinitely scalable.</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed mb-10 font-normal">
            LeadDrive autonomously discovers qualified businesses, diagnoses high-friction website bottlenecks, and generates custom interactive web demos before firing precision multichannel campaigns.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <Link
              href="/signup"
              className="octo-pill-btn octo-pill-dark w-full sm:w-auto text-sm shadow-xl"
            >
              Get Started for Free <ArrowRight className="h-4 w-4 ml-1 inline" />
            </Link>
            <Link
              href="/login"
              className="octo-pill-btn octo-pill-light w-full sm:w-auto text-sm"
            >
              Sign In to Console
            </Link>
          </div>

          {/* Social Proof Line */}
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 font-medium pt-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>14-day free trial</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Setup in under 2 minutes</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Visual Canvas / Superellipse HUD Container */}
        <div className="mx-auto max-w-6xl mt-14 relative">
          <div className="relative rounded-[32px] border border-slate-200/90 bg-white/95 p-3 sm:p-5 shadow-2xl backdrop-blur-xl">
            {/* Top Browser Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 px-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-200" />
                <div className="h-3 w-3 rounded-full bg-slate-200" />
                <div className="h-3 w-3 rounded-full bg-slate-200" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">leaddrive.app/live-orchestration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  AGENTS RUNNING (4 ACTIVE)
                </span>
              </div>
            </div>

            {/* Inner Dashboard Preview Canvas */}
            <div className="relative rounded-[24px] bg-slate-950 text-white p-6 sm:p-8 overflow-hidden min-h-[460px] flex flex-col justify-between">
              {/* Background Geometry Animation */}
              <div className="absolute -right-20 -top-20 w-96 h-96 border border-slate-800/80 rounded-full animate-spin-slow pointer-events-none opacity-40" />
              <div className="absolute -right-32 -top-32 w-[520px] h-[520px] border border-dashed border-slate-800/60 rounded-full animate-spin-reverse-slow pointer-events-none opacity-30" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_45%)] pointer-events-none" />

              {/* Top HUD Row */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 backdrop-blur-md">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Discovery Engine</div>
                  <div className="text-xl font-bold text-white mt-1">1,840 Leads</div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Google Maps + Apollo</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 backdrop-blur-md">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Audits Run</div>
                  <div className="text-xl font-bold text-white mt-1">1,420 Analyzed</div>
                  <div className="text-[11px] text-amber-400 font-mono mt-0.5">Avg Score: 39/100</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 backdrop-blur-md">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">AI Demos Synthesized</div>
                  <div className="text-xl font-bold text-white mt-1">980 Prototypes</div>
                  <div className="text-[11px] text-sky-400 font-mono mt-0.5">Vertex + v0 Engine</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 backdrop-blur-md">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Reply Lift</div>
                  <div className="text-xl font-bold text-white mt-1">4.8x Conversion</div>
                  <div className="text-[11px] text-purple-400 font-mono mt-0.5">18.4% Open-to-Call</div>
                </div>
              </div>

              {/* Middle Dynamic Interactive Simulation */}
              <div className="relative z-10 my-6 rounded-2xl border border-slate-800/90 bg-slate-900/90 p-5 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Austin Precision Dental Studio</div>
                      <div className="font-mono text-xs text-slate-400">austinprecisiondental.com · Healthcare / Dental</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-[11px] font-mono text-red-400">
                      Mobile Speed: 24/100
                    </span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-mono text-emerald-400">
                      Fit Score: 96/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                  <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 font-mono">
                    <div className="text-slate-400 mb-1">// Generated Outreach Angle</div>
                    <p className="text-slate-200 leading-relaxed">
                      &quot;Noticed your mobile booking widget takes 4.8s to load on 4G. We pre-built a 100% interactive Next.js prototype with instant 1-click scheduling: <span className="text-blue-400 underline">demo.leaddrive.app/austin-dental</span>&quot;
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 font-mono flex flex-col justify-between">
                    <div>
                      <div className="text-slate-400 mb-1">// Live Agent Execution Trace</div>
                      <div className="text-emerald-400">✓ Extracted high-res logo &amp; color tokens</div>
                      <div className="text-emerald-400">✓ PageSpeed diagnostics: -3.2s load bottleneck</div>
                      <div className="text-sky-400">✓ Synthesized bespoke Next.js web preview</div>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2">Ready to dispatch via personalized inbox</div>
                  </div>
                </div>
              </div>

              {/* Bottom Interactive Navigation Prompt */}
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-blue-400" />
                  <span className="font-mono">Autonomous pipeline synchronized with Supabase DB</span>
                </div>
                <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                  Launch full console <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Manifesto / Philosophy Section (Octolane Inspired) */}
      <section id="philosophy" className="py-24 px-4 sm:px-8 border-t border-slate-200/60 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
              The LeadDrive Philosophy
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-slate-950 leading-tight mb-8">
            Why 98% of cold outreach is doomed to fail—and how proof changes everything.
          </h2>

          <div className="space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            <p>
              The modern B2B inbox is inundated with automated templates, AI fluff, and generic promises. Decision-makers have developed an automatic immune response to cold emails that claim to &quot;increase revenue by 30%&quot; without demonstrating a shred of genuine competence.
            </p>
            <p>
              When an agency reaches out with nothing more than words, they ask the client to do the mental heavy lifting. The client must imagine the solution, trust a stranger, and risk their budget.
            </p>
            <div className="my-8 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm">
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-slate-900 mb-3">
                The Proof-First Outreach Paradigm
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed m-0">
                Instead of sending a cold pitch, LeadDrive empowers you to send a tangible, working prototype. Our autonomous agents locate businesses with severe website speed flaws or outdated designs, build a live interactive demo in seconds, and deliver an irrefutable before-and-after comparison directly to the decision-maker.
              </p>
            </div>
            <p>
              The result is not just a marginal improvement in open rates—it is an entirely different conversation where your agency is immediately recognized as a high-caliber partner who already did the work.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Pipeline Visualizer (4 Steps) */}
      <section id="pipeline" className="py-24 px-4 sm:px-8 bg-[#f8f9fb] border-t border-slate-200/60">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Autonomous Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-slate-950">
              Four steps from search to signed contract.
            </h2>
          </div>

          {/* Step Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {[
              { id: 'discover', label: '1. Intelligent Discovery', icon: Search },
              { id: 'audit', label: '2. Technical Audit', icon: BarChart3 },
              { id: 'demo', label: '3. Interactive Demo Synthesis', icon: Sparkles },
              { id: 'outreach', label: '4. Multichannel Dispatch', icon: Mail },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display Card */}
          <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 sm:p-10 shadow-lg">
            {activeTab === 'discover' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="font-mono text-xs font-semibold text-blue-600 uppercase">Step 01 · Ingestion</span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-slate-900 mt-2 mb-4">
                    Multi-source precision lead scraping.
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Connect directly to Google Maps local search, Apollo, LinkedIn, or upload custom lead spreadsheets. LeadDrive expands semantic keywords and filters by city, review counts, website presence, and business health.
                  </p>
                  <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Deep email &amp; direct phone enrichment</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Automated domain &amp; SSL health check</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Semantic qualification filter to discard junk listings</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-950 p-5 text-white font-mono text-xs border border-slate-800">
                  <div className="text-slate-500 pb-2 border-b border-slate-800">// Discovery Log Preview</div>
                  <div className="mt-3 text-slate-300 space-y-1.5">
                    <div className="text-emerald-400">→ Query: &quot;dentists in Austin TX rating &lt; 4.8&quot;</div>
                    <div className="text-slate-400">... Found 142 business listings</div>
                    <div className="text-slate-400">... Enriched 118 decision-maker email addresses</div>
                    <div className="text-slate-400">... Verified 94 websites live &amp; active</div>
                    <div className="text-emerald-400">✓ Batch ingestion complete (94 qualified)</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="font-mono text-xs font-semibold text-blue-600 uppercase">Step 02 · Diagnostics</span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-slate-900 mt-2 mb-4">
                    Automated Lighthouse &amp; UX speed audits.
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Each qualified prospect’s website undergoes instant headless diagnostic testing. We uncover slow Core Web Vitals, mobile viewport scaling breaks, outdated copyright dates, and poor conversion hooks.
                  </p>
                  <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Real-time mobile PageSpeed score (0–100)</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Identification of slow assets &amp; uncompressed payloads</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Automatic pitch hook generation based on factual flaws</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-950 p-5 text-white font-mono text-xs border border-slate-800">
                  <div className="text-slate-500 pb-2 border-b border-slate-800">// Performance Diagnostic Report</div>
                  <div className="mt-3 text-slate-300 space-y-2">
                    <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                      <span>Performance Score:</span>
                      <span className="text-red-400 font-bold">28 / 100 (Critical)</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                      <span>Largest Contentful Paint:</span>
                      <span className="text-amber-400">4.8 seconds</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                      <span>Mobile Responsive Test:</span>
                      <span className="text-red-400">Overlapping CTA detected</span>
                    </div>
                    <div className="text-emerald-400 text-[11px] pt-1">✓ Pitch strategy ready: &quot;Fix 4.8s mobile bottleneck&quot;</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'demo' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="font-mono text-xs font-semibold text-blue-600 uppercase">Step 03 · Synthesis</span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-slate-900 mt-2 mb-4">
                    Instant interactive web demo synthesis.
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Our AI models generate a complete, working, interactive redesign for the prospect. Demos match their brand colors, industry niche, and core services—hosted on a fast, trackable link.
                  </p>
                  <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Multi-engine support: v0, Vertex AI, and Agentic Builder</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Live interactive buttons, mobile previews, and forms</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Telemetry tracking: Know the exact second a prospect clicks</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-950 p-5 text-white font-mono text-xs border border-slate-800">
                  <div className="text-slate-500 pb-2 border-b border-slate-800">// Demo Synthesis Output</div>
                  <div className="mt-3 text-slate-300 space-y-2">
                    <div className="rounded bg-slate-900 p-3 border border-slate-800">
                      <div className="text-emerald-400 font-semibold mb-1">Generated: &quot;Modern Dental Studio Next.js Prototype&quot;</div>
                      <div className="text-slate-400 text-[11px]">URL: https://demo.leaddrive.app/lead-8429</div>
                      <div className="text-slate-400 text-[11px] mt-1">Load speed: 0.3s · Lighthouse: 99/100</div>
                    </div>
                    <div className="text-sky-400 text-[11px]">✓ Embed code, full screen preview, and sandbox ready</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'outreach' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="font-mono text-xs font-semibold text-blue-600 uppercase">Step 04 · Conversion</span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-slate-900 mt-2 mb-4">
                    Multichannel dispatch &amp; real-time tracking.
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Deliver personalized emails and SMS messages embedded with the prospect&apos;s custom demo link. When they click or view the prototype, get notified immediately so you can strike while they are warm.
                  </p>
                  <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Granular open, click, and session time tracking</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Automated follow-up sequences with dynamic triggers</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> CRM webhook integration with HubSpot, Slack, and Zapier</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-950 p-5 text-white font-mono text-xs border border-slate-800">
                  <div className="text-slate-500 pb-2 border-b border-slate-800">// Dispatch Telemetry</div>
                  <div className="mt-3 text-slate-300 space-y-2">
                    <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                      <span>Status:</span>
                      <span className="text-emerald-400 font-bold">Email Delivered &amp; Opened</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                      <span>Demo Link Clicked:</span>
                      <span className="text-emerald-400 font-bold">Yes (2m 14s session duration)</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                      <span>Prospect Action:</span>
                      <span className="text-purple-400">Booked Discovery Call</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Bento Grid (Octolane "In Practice" Style) */}
      <section id="features" className="py-24 px-4 sm:px-8 bg-white border-t border-slate-200/60">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              In Practice
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-slate-950">
              Engineered for agencies that close.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="octo-card p-8 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-2xl text-slate-900 mb-3">
                  Autonomous Multi-Source Discovery
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Never manually search Google Maps or Apollo again. Set your target niche and location, and let our agents scrape, verify, and enrich qualified business listings 24/7.
                </p>
              </div>
              <div className="font-mono text-xs text-slate-400 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span>SOURCES: MAPS · APOLLO · LINKEDIN</span>
                <span className="text-emerald-600 font-semibold">99.4% VERIFIED</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="octo-card p-8 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-6">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-2xl text-slate-900 mb-3">
                  Deep Technical Site Diagnostics
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Extract factual pain points before pitching. LeadDrive tests mobile responsiveness, PageSpeed scores, security headers, and SEO schema to arm your emails with undeniable proof.
                </p>
              </div>
              <div className="font-mono text-xs text-slate-400 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span>DIAGNOSTICS: LIGHTHOUSE · SEO · SPEED</span>
                <span className="text-blue-600 font-semibold">REAL-TIME</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="octo-card p-8 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-6">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-2xl text-slate-900 mb-3">
                  AI-Powered Prototype Synthesis
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Generate fully working interactive web prototypes using Vertex AI and v0. Show prospects their exact branding transformed into a modern, high-converting digital experience.
                </p>
              </div>
              <div className="font-mono text-xs text-slate-400 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span>ENGINES: VERTEX · V0 · AGENTIC</span>
                <span className="text-purple-600 font-semibold">INSTANT HOSTING</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="octo-card p-8 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-2xl text-slate-900 mb-3">
                  Multichannel Telemetry &amp; Outreach
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Send tailored emails and SMS with live tracking. Know the second a prospect opens your email or clicks the interactive demo link, enabling instant high-intent follow-up.
                </p>
              </div>
              <div className="font-mono text-xs text-slate-400 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span>CHANNELS: EMAIL · SMS · WEBHOOKS</span>
                <span className="text-emerald-600 font-semibold">4.8x LIFT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Matrix Section */}
      <section id="pricing" className="py-24 px-4 sm:px-8 bg-[#f8f9fb] border-t border-slate-200/60">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Transparent Pricing
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-slate-950 mb-6">
              Simple plans for ambitious revenue teams.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8">
              All plans include full platform access, live Supabase backend synchronization, and a 14-day free trial.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.2 font-bold">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Tier */}
            <div className="octo-card p-8 flex flex-col justify-between bg-white">
              <div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">Starter</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-slate-950">${Math.round(49 * discountMultiplier)}</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Perfect for individual freelancers and boutique agency founders starting outbound.
                </p>
                <div className="border-t border-slate-100 pt-6 space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-900" /> 500 Qualified Leads / mo</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-900" /> 100 AI Demos Synthesized</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-900" /> Google Maps &amp; Apollo Scraper</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-900" /> Automated PageSpeed Audits</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-900" /> Personalized Email Outreach</div>
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/signup"
                  className="octo-pill-btn octo-pill-light w-full text-xs"
                >
                  Start 14-Day Trial
                </Link>
              </div>
            </div>

            {/* Growth Pro Tier (Featured) */}
            <div className="octo-card p-8 flex flex-col justify-between bg-slate-950 text-white relative shadow-2xl border-slate-800 scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                MOST POPULAR
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Growth Pro</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-white">${Math.round(149 * discountMultiplier)}</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  For growing agencies scaling outreach pipelines with automated demo generation.
                </p>
                <div className="border-t border-slate-800 pt-6 space-y-3 text-xs text-slate-200">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-400" /> 2,500 Qualified Leads / mo</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-400" /> 500 AI Demos Synthesized</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-400" /> Vertex AI + v0 Hybrid Generation</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-400" /> Multichannel Email + SMS Dispatch</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-400" /> Live Click &amp; Session Telemetry</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-400" /> Webhook &amp; CRM Integrations</div>
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/signup"
                  className="octo-pill-btn bg-white text-slate-950 hover:bg-slate-100 w-full text-xs shadow-lg font-bold"
                >
                  Start 14-Day Free Trial
                </Link>
              </div>
            </div>

            {/* Agency Scale Tier */}
            <div className="octo-card p-8 flex flex-col justify-between bg-white">
              <div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">Agency Scale</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-slate-950">${Math.round(399 * discountMultiplier)}</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  For established agencies and outbound teams requiring high volume &amp; dedicated power.
                </p>
                <div className="border-t border-slate-100 pt-6 space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-900" /> Unlimited Lead Discovery</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-900" /> 2,000 AI Demos Synthesized / mo</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-900" /> Custom Domain Demo Hosting</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-900" /> Multi-Seat Team Workspaces</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-900" /> Dedicated Sending IPs &amp; Warmup</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-900" /> Priority 24/7 Slack Support</div>
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/signup"
                  className="octo-pill-btn octo-pill-light w-full text-xs"
                >
                  Contact Agency Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-24 px-4 sm:px-8 bg-white border-t border-slate-200/60">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Got Questions?
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-slate-950">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-[#fbfbfd] transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 font-semibold text-slate-900 text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-900' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom High-Impact CTA Section */}
      <section className="py-24 px-4 sm:px-8 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2),transparent_70%)] pointer-events-none" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <span className="font-mono text-xs uppercase tracking-widest text-blue-400 mb-3 block">
            Start Closing Deals Today
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight mb-6">
            Ready to upgrade your outreach with proof?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-10">
            Join hundreds of revenue teams replacing generic email blasts with bespoke interactive demos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="octo-pill-btn bg-white text-slate-950 hover:bg-slate-100 text-sm font-bold shadow-xl w-full sm:w-auto"
            >
              Start 14-Day Free Trial <ArrowRight className="h-4 w-4 ml-1 inline" />
            </Link>
            <Link
              href="/login"
              className="octo-pill-btn border border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800 text-sm w-full sm:w-auto"
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="py-12 px-4 sm:px-8 bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-slate-950 font-bold text-xs">
              L
            </div>
            <span className="font-bold text-white text-sm">LeadDrive</span>
            <span className="text-slate-500 ml-2">© {new Date().getFullYear()} LeadDrive Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-medium text-slate-400">
            <Link href="/login" className="hover:text-white transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign up</Link>
            <a href="#pipeline" className="hover:text-white transition-colors">Platform</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
