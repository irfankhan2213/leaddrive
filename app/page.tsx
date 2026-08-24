'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Zap,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Sparkles,
  Globe,
  Mail,
  BarChart3,
  ChevronDown,
  Menu,
  X,
  Search,
  Bell,
  Phone,
  MapPin,
  Layers,
  Star,
  ShieldCheck,
  TrendingUp,
  Database,
  Bot,
  Clock,
  Send,
  Users,
  Activity,
  Flame
} from 'lucide-react';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const discountMultiplier = billingCycle === 'annual' ? 0.8 : 1;

  const faqs = [
    {
      q: 'What types of lead sources can I search and analyze?',
      a: 'LeadDrive connects directly to Google Maps Local Business listings, Apollo.io API, LinkedIn search, and custom CSV spreadsheets. Our AI crawlers normalize, verify emails, extract mobile numbers, and enrich each lead with full decision-maker data in under 60 seconds.',
    },
    {
      q: 'How does the AI Demo Synthesis Lab work?',
      a: 'When a prospect is qualified, our background crawlers inspect their existing website, diagnose speed and design bottlenecks, and synthesize a high-converting, mobile-responsive interactive prototype. You can include this personalized live demo link directly in your cold outreach.',
    },
    {
      q: 'How secure is my agency and prospect data?',
      a: 'We implement SOC-2 compliant AES-256 encryption at rest and TLS 1.3 in transit. Your campaigns, verified leads, and proprietary templates remain completely isolated to your team and are never used to train public models.',
    },
    {
      q: "What's the difference between the Starter and Agency Pro plan?",
      a: 'The Starter plan is built for solo operators needing up to 500 verified leads per month. The Agency Pro plan provides unlimited discovery, 500 AI demo syntheses, multi-inbox dispatch with auto-warmup, CRM webhooks, and dedicated account support.',
    },
    {
      q: 'How fast can our team onboard and launch our first campaign?',
      a: 'Most agencies launch their first campaign within 3 minutes of signing up. Simply enter your target industry and location, let LeadDrive generate the audits and demo redesigns, and click send.',
    },
    {
      q: 'Can I integrate LeadDrive with my existing sales CRM?',
      a: 'Yes. LeadDrive natively integrates with HubSpot, Salesforce, Pipedrive, Zapier, Make, and custom webhooks to push engaged prospects the exact second they open your demo.',
    },
    {
      q: 'Do you offer a free trial or require a credit card upfront?',
      a: 'We offer a full 14-day free trial on all plans with zero credit card required. You get immediate access to live prospecting, automated website diagnostics, and custom demo generation.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="min-h-screen text-[#0f172a] bg-white font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between overflow-x-hidden">
      {/* Schema Markup for SEO/CRO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. Header Navigation Bar */}
      <header className="fixed top-0 z-50 w-full px-4 sm:px-6 py-3.5 bg-white/90 backdrop-blur-md border-b border-gray-100/90 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-[0_4px_14px_0_rgba(37,99,235,0.35)] group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              LeadDrive
            </span>
          </Link>

          {/* Floating Pill Navigation */}
          <nav className="hidden md:flex items-center bg-gray-50/90 px-1.5 py-1.5 rounded-full border border-gray-200/80 text-[13px] font-semibold text-gray-600">
            <a href="#why" className="px-4 py-1.5 rounded-full hover:text-gray-900 transition-colors">
              Why LeadDrive
            </a>
            <a href="#proof" className="px-4 py-1.5 rounded-full hover:text-gray-900 transition-colors">
              Results
            </a>
            <a href="#features" className="px-4 py-1.5 rounded-full hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#pricing" className="px-4 py-1.5 rounded-full hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="px-4 py-1.5 rounded-full hover:text-gray-900 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 hover:text-black px-3 py-2 transition-colors min-h-[44px] flex items-center"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="relink-btn-blue relink-pill-btn text-xs font-bold min-h-[44px]"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile menu hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 p-6 flex flex-col gap-4 shadow-2xl md:hidden animate-in slide-in-from-top-2">
            <a href="#why" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Why LeadDrive</a>
            <a href="#proof" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Case Studies</a>
            <a href="#features" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
            <a href="#faq" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
            <hr className="border-gray-100 my-1" />
            <Link href="/login" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
            <Link href="/signup" className="relink-btn-blue relink-pill-btn text-center text-sm py-3.5 mt-1 min-h-[44px]" onClick={() => setIsMobileMenuOpen(false)}>Start Your Free 14-Day Trial</Link>
          </div>
        )}
      </header>

      {/* 2. Redesigned 2-Column Hero Section: Left Text + Right Interactive Dashboard Cards */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 relink-sky-gradient overflow-hidden border-b border-gray-100/60">
        {/* Soft atmospheric sky glow */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute -top-12 left-1/4 w-[800px] h-[500px] bg-gradient-to-b from-sky-200/50 via-blue-100/30 to-transparent blur-3xl rounded-full" />
          <div className="absolute top-20 -right-20 w-96 h-96 bg-white/80 blur-3xl rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: Redesigned Left-Aligned Copy, CTAs, and Social Badges */}
            <div className="lg:col-span-6 xl:col-span-5 text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200/70 shadow-xs text-xs font-bold text-blue-700 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Autonomous Outbound Intelligence
              </div>

              {/* Outcome-Led Headline */}
              <h1 className="text-4xl sm:text-5xl xl:text-[3.6rem] font-extrabold tracking-tight text-[#0f172a] leading-[1.08] mb-6">
                Book 4x More<br />
                Client Meetings<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                  on Total Autopilot
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 font-normal max-w-lg">
                Synthesize interactive website redesigns and launch hyper-personalized cold outreach in minutes with zero manual prospecting.
              </p>

              {/* Action Button Cluster */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-5">
                <Link
                  href="/signup"
                  className="relink-pill-btn relink-btn-blue px-7 py-3.5 text-sm sm:text-base font-bold shadow-lg min-h-[48px] justify-center"
                >
                  Start Your Free 14-Day Trial <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  href="/login"
                  className="relink-pill-btn relink-btn-dark px-6 py-3.5 text-sm font-bold flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  See It in Action
                </Link>
              </div>

              {/* Trust Checkmarks */}
              <div className="text-xs font-semibold text-gray-500 mb-8 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> No credit card required</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 2-minute setup</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Cancel anytime</span>
              </div>

              {/* Social Proof Mini Bar */}
              <div className="pt-6 border-t border-gray-200/80 flex items-center gap-4">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">JD</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">SK</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">AL</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center">MV</div>
                </div>
                <div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold mt-0.5">
                    <span className="font-bold text-gray-900">4.9/5</span> from 450+ agency founders
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Layered Interactive Dashboard Cards & Live Telemetry Widgets */}
            <div className="lg:col-span-6 xl:col-span-7 relative">
              {/* Decorative background ambient glow */}
              <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />

              {/* Floating top tag */}
              <div className="hidden sm:flex absolute -top-4 -left-4 z-20 items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gray-200 shadow-xl text-xs font-bold text-gray-800 animate-bounce duration-1000">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>Live Demo Clicked (3x by CEO)</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold">Hot Lead</span>
              </div>

              {/* Main Dashboard Preview Card */}
              <div className="relative bg-white rounded-3xl border border-gray-200/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] p-5 sm:p-6 text-left">
                {/* Header bar inside preview card */}
                <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                      <Zap className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-900">Outbound Intelligence Feed</h3>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        14 high-intent prospects active now
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-gray-600">
                      <span>May 2026</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs">
                      IK
                    </div>
                  </div>
                </div>

                {/* Metrics Stats Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 my-5">
                  <div className="bg-[#fafcff] p-3 rounded-2xl border border-blue-50">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Leads Scraped</div>
                    <div className="text-base sm:text-lg font-extrabold text-gray-900 mt-0.5">352,781</div>
                    <div className="text-[10px] font-bold text-emerald-600">▲ 28.4%</div>
                  </div>
                  <div className="bg-[#fafcff] p-3 rounded-2xl border border-blue-50">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Demos Viewed</div>
                    <div className="text-base sm:text-lg font-extrabold text-gray-900 mt-0.5">2,751</div>
                    <div className="text-[10px] font-bold text-emerald-600">▲ 41.8%</div>
                  </div>
                  <div className="bg-[#fafcff] p-3 rounded-2xl border border-blue-50">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Meetings</div>
                    <div className="text-base sm:text-lg font-extrabold text-blue-600 mt-0.5">246</div>
                    <div className="text-[10px] font-bold text-emerald-600">▲ 3.8x ROI</div>
                  </div>
                </div>

                {/* High-Contrast SVG Bar Chart */}
                <div className="bg-[#fafcff] rounded-2xl border border-blue-50/80 p-4 mb-4">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-gray-800">Demo Engagement Timeline</span>
                    <span className="text-[11px] font-extrabold text-blue-600 bg-white px-2 py-0.5 rounded-full border border-blue-100 shadow-xs">
                      Peak Conversion Rate: 48.64%
                    </span>
                  </div>

                  <div className="relative h-28 sm:h-32 w-full flex items-end justify-between px-2 pt-2 border-b border-gray-100">
                    {[
                      { m: 'Jan', val: 40, active: false },
                      { m: 'Feb', val: 65, active: false },
                      { m: 'Mar', val: 50, active: false },
                      { m: 'Apr', val: 85, active: false },
                      { m: 'May', val: 98, active: true },
                      { m: 'Jun', val: 70, active: false },
                      { m: 'Jul', val: 55, active: false },
                      { m: 'Aug', val: 80, active: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 max-w-[36px]">
                        <div className="w-full bg-gray-100 rounded-t-md h-20 sm:h-24 flex items-end overflow-hidden p-0.5">
                          <div
                            style={{ height: `${item.val}%` }}
                            className={`w-full rounded-t ${
                              item.active
                                ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                                : 'bg-blue-200'
                            }`}
                          />
                        </div>
                        <span className={`text-[9px] font-bold ${item.active ? 'text-blue-600' : 'text-gray-400'}`}>
                          {item.m}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Interactive Feed Row */}
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-[11px]">Apex Digital Redesign Demo Synthesized</div>
                      <div className="text-[10px] text-gray-400">PageSpeed Score 98/100 · Dispatched via SendGrid</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-blue-600 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-xs">
                    12s ago
                  </span>
                </div>
              </div>

              {/* Floating Bottom Card Tag */}
              <div className="hidden sm:flex absolute -bottom-5 -right-4 z-20 items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-gray-200 shadow-xl text-xs font-bold text-gray-800">
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-gray-900">12 Parallel Scrapers</div>
                  <div className="text-[10px] text-emerald-600 font-bold">99.4% Delivery Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Social Proof Section (Directly under Hero) */}
      <section id="proof" className="py-16 px-4 sm:px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>4.9/5 Rating on G2 & Capterra — Top Outbound Solution 2026</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Trusted by 450+ high-growth agencies & B2B outbound teams
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-300 mb-16">
            <div className="flex items-center gap-2 font-extrabold text-base text-gray-800 tracking-tight">
              <div className="w-6 h-6 rounded bg-black text-white flex items-center justify-center text-xs">A</div> ApexGrowth
            </div>
            <div className="flex items-center gap-2 font-extrabold text-base text-gray-800 tracking-tight">
              <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs">H</div> HyperScale Labs
            </div>
            <div className="flex items-center gap-2 font-extrabold text-base text-gray-800 tracking-tight">
              <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center text-xs">V</div> Veloce Media
            </div>
            <div className="flex items-center gap-2 font-extrabold text-base text-gray-800 tracking-tight">
              <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center text-xs">D</div> DemandForge
            </div>
            <div className="flex items-center gap-2 font-extrabold text-base text-gray-800 tracking-tight">
              <div className="w-6 h-6 rounded bg-rose-600 text-white flex items-center justify-center text-xs">O</div> OutboundHQ
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="relink-card-white p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 font-medium leading-relaxed mb-6">
                  &ldquo;Sending personalized interactive website demos increased our cold email reply rates from <span className="font-bold text-blue-600">1.8% to 8.4%</span> in our very first week.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                  SJ
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900">Sarah Jenkins</div>
                  <div className="text-[11px] text-gray-400">Founder, ScaleMedia Agency</div>
                </div>
              </div>
            </div>

            <div className="relink-card-white p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 font-medium leading-relaxed mb-6">
                  &ldquo;We booked <span className="font-bold text-blue-600">34 qualified client calls</span> in our first 10 days. The automated Google PageSpeed audit hook gives our reps instant credibility.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  MV
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900">Marcus Vance</div>
                  <div className="text-[11px] text-gray-400">VP of Outbound, Velocity B2B</div>
                </div>
              </div>
            </div>

            <div className="relink-card-white p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 font-medium leading-relaxed mb-6">
                  &ldquo;Saved our team <span className="font-bold text-blue-600">15+ hours every week</span> on manual lead prospecting and custom slide deck preparation. It pays for itself on day one.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                  DK
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900">David Kim</div>
                  <div className="text-[11px] text-gray-400">Managing Partner, Apex Ventures</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Value Proposition Banner */}
      <section className="py-12 px-4 sm:px-6 bg-[#fafcff] border-b border-gray-100 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">
            The LeadDrive Advantage
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Stop pitching generic copy. Send working AI prototypes before your competitors even send an email.
          </h2>
        </div>
      </section>

      {/* 5. Section: "The Outreach Challenge Every Business Faces" (3-Column Problem Cards) */}
      <section id="why" className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">
                WHY LEADDRIVE
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                The Outreach Challenge Every<br className="hidden sm:inline" /> Agency Faces
              </h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-2xl mt-4 font-normal leading-relaxed">
                Generic cold emails end up in spam. Prospects ignore walls of text. LeadDrive gives you unfair leverage with real-time website diagnostics and bespoke interactive demo redesigns.
              </p>
            </div>

            <Link
              href="/signup"
              className="relink-pill-btn relink-btn-light text-xs font-bold self-start md:self-auto min-h-[44px]"
            >
              How It Works <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="relink-card-white p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">Multi-Vector Lead Discovery</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8">
                  Scraping leads across disconnected Google Maps, Apollo, and LinkedIn searches takes hours. We unify all vectors into one clean verified feed.
                </p>
              </div>

              <div className="bg-[#fafcff] border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-gray-700">
                  <span>Verified Lead Discovery</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="h-16 flex items-end justify-between gap-1.5 px-1 pt-2">
                  <div className="w-full bg-blue-100 rounded-t h-4" />
                  <div className="w-full bg-blue-200 rounded-t h-8" />
                  <div className="w-full bg-blue-300 rounded-t h-10" />
                  <div className="w-full bg-blue-500 rounded-t h-14" />
                  <div className="w-full bg-blue-600 rounded-t h-16" />
                </div>
              </div>
            </div>

            <div className="relink-card-blue p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center mb-6 shadow-md">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">Automated Site Diagnostics</h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed mb-8">
                  Never pitch without undeniable leverage. Headless crawlers run PageSpeed and mobile UX audits on every prospect to build instant trust.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-md text-gray-900">
                <div className="flex items-center justify-between mb-2 text-[11px] font-bold text-gray-800">
                  <span>Audit Diagnostics</span>
                  <div className="flex items-center gap-1 text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    452 verified <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
                <div className="h-16 flex items-end justify-between gap-1 px-1 pt-2">
                  {[20, 35, 45, 60, 50, 75, 90, 100].map((h, i) => (
                    <div key={i} className="w-full bg-blue-100 rounded-t overflow-hidden flex items-end">
                      <div style={{ height: `${h}%` }} className="w-full bg-blue-600 rounded-t" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relink-card-white p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">AI Demo Synthesis Lab</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8">
                  Synthesize working, mobile-responsive website prototypes personalized with the prospect&apos;s brand to turn cold leads into warm sales conversations.
                </p>
              </div>

              <div className="bg-[#fafcff] border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-gray-700">
                  <span>Demo Engagement</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="h-16 flex items-end justify-between gap-1.5 px-1 pt-2">
                  <div className="w-full bg-blue-100 rounded-t h-6" />
                  <div className="w-full bg-blue-200 rounded-t h-9" />
                  <div className="w-full bg-blue-400 rounded-t h-12" />
                  <div className="w-full bg-blue-600 rounded-t h-16" />
                  <div className="w-full bg-blue-300 rounded-t h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Feature Highlights */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-[#fafcff] border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4">
              All the Tools You Need for Powerful<br />Outbound Operations
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-normal leading-relaxed">
              Every step is managed autonomously by specialized background AI agents so your sales reps only speak with high-intent buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="relink-card-white p-6 sm:p-7 flex flex-col justify-between bg-white">
              <div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 h-48 sm:h-52 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                    <span>Performance Flaws</span>
                    <span>Audit Score</span>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-32 px-2">
                    {[
                      { label: 'LCP', badge: '1.2s', h: '45%' },
                      { label: 'CLS', badge: '0.01', h: '65%' },
                      { label: 'Score', badge: '98%', h: '95%', active: true },
                      { label: 'SEO', badge: '100%', h: '88%' },
                    ].map((bar, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                        <span className="text-[10px] font-bold text-gray-600 bg-white px-1.5 py-0.5 rounded shadow-xs border border-gray-100">
                          {bar.badge}
                        </span>
                        <div className="w-full bg-gray-200/80 rounded-t-lg h-24 flex items-end p-0.5">
                          <div
                            style={{ height: bar.h }}
                            className={`w-full rounded-t-md ${
                              bar.active ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-gray-300'
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">Pinpoint Exact Conversion Leaks</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 font-normal">
                  Identify slow load times, mobile viewport failures, and missing meta tags to give you undeniable, factual proof in your pitch.
                </p>
              </div>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-light w-full text-xs font-bold py-3 min-h-[44px]"
              >
                Start Auditing Leads
              </Link>
            </div>

            <div className="relink-card-white p-6 sm:p-7 flex flex-col justify-between bg-white">
              <div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 h-48 sm:h-52 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                    <span>Live Tracking</span>
                    <span className="text-emerald-600 font-extrabold">● Real-time</span>
                  </div>

                  <div className="flex items-end justify-between gap-1.5 h-32 px-1">
                    {[30, 45, 60, 40, 100, 70, 50, 65, 80].map((val, i) => (
                      <div key={i} className="w-full bg-gray-200/70 rounded-t h-24 flex items-end">
                        <div
                          style={{ height: `${val}%` }}
                          className={`w-full rounded-t ${
                            val === 100 ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-blue-200'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">Real-Time Demo Engagement Telemetry</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 font-normal">
                  Receive instant alerts the exact second a decision-maker clicks or scrolls your custom demo, empowering immediate hot follow-ups.
                </p>
              </div>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-blue w-full text-xs font-bold py-3 min-h-[44px]"
              >
                Track Live Opens
              </Link>
            </div>

            <div className="relink-card-white p-6 sm:p-7 flex flex-col justify-between bg-white">
              <div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 h-48 sm:h-52 flex items-center justify-center relative overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center z-10 shadow-lg border-2 border-white">
                    <Zap className="w-6 h-6 fill-white" />
                  </div>

                  <div className="absolute top-5 left-8 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center text-[10px] font-bold text-gray-700">
                    MS
                  </div>
                  <div className="absolute top-5 right-8 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center text-[10px] font-bold text-orange-600">
                    HS
                  </div>
                  <div className="absolute bottom-5 left-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center text-[10px] font-bold text-emerald-600">
                    GS
                  </div>
                  <div className="absolute bottom-5 right-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center text-[10px] font-bold text-blue-500">
                    AP
                  </div>

                  <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-blue-200 stroke-1">
                    <line x1="50%" y1="50%" x2="25%" y2="25%" strokeDasharray="3 3" />
                    <line x1="50%" y1="50%" x2="75%" y2="25%" strokeDasharray="3 3" />
                    <line x1="50%" y1="50%" x2="30%" y2="75%" strokeDasharray="3 3" />
                    <line x1="50%" y1="50%" x2="70%" y2="75%" strokeDasharray="3 3" />
                  </svg>
                </div>

                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">Sync With Your Existing Tech Stack</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 font-normal">
                  Connect effortlessly with Apollo, SendGrid, Resend, HubSpot, and Google Sheets to automate your pipeline end-to-end.
                </p>
              </div>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-light w-full text-xs font-bold py-3 min-h-[44px]"
              >
                Explore Integrations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Mid-Page Conversion CTA */}
      <section className="py-16 px-4 sm:px-6 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Ready to fill your calendar with high-ticket clients?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mb-8 max-w-xl mx-auto font-normal">
            Join 450+ agencies automating their prospecting and demo creation today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-3.5 rounded-full font-extrabold text-sm sm:text-base shadow-lg transition-all min-h-[44px] flex items-center justify-center w-full sm:w-auto"
            >
              Start Your Free 14-Day Trial
            </Link>
          </div>
          <p className="text-xs text-blue-200 mt-4 font-semibold">
            No credit card required · Instant 2-minute setup
          </p>
        </div>
      </section>

      {/* 8. Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-normal leading-relaxed mb-8">
              Transparent, high-value plans tailored for solo consultants, fast-growing agencies, and enterprise sales teams.
            </p>

            <div className="inline-flex items-center bg-gray-100 p-1 rounded-full border border-gray-200 shadow-inner">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all min-h-[36px] ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 min-h-[36px] ${
                  billingCycle === 'annual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>Annual</span>
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-extrabold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            <div className="relink-card-white p-8 sm:p-9 flex flex-col justify-between bg-white">
              <div>
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center mb-4">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-1">Starter</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Ideal for solo founders launching their first outbound campaigns.
                </p>

                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-gray-100">
                  <span className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                    ${Math.round(49 * discountMultiplier)}
                  </span>
                  <span className="text-xs font-bold text-gray-400">/ Per month</span>
                </div>

                <div className="space-y-3.5 mb-8 text-xs font-medium text-gray-600">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>500 Qualified Leads / mo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>50 AI Demo Syntheses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Google Maps & Apollo Scrapers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Top-level data security</span>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href="/signup"
                  className="relink-pill-btn relink-btn-light w-full text-xs font-bold py-3.5 min-h-[44px]"
                >
                  Start 14-Day Free Trial
                </Link>
                <p className="text-center text-[11px] text-gray-400 mt-2 font-medium">
                  No credit card required
                </p>
              </div>
            </div>

            <div className="relink-card-white p-8 sm:p-9 flex flex-col justify-between bg-white border-2 border-blue-600 shadow-[0_12px_40px_rgba(37,99,235,0.15)] relative">
              <div className="absolute -top-3.5 right-8 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3.5 py-1 rounded-full tracking-wider shadow-sm">
                Most Popular
              </div>

              <div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-1">Agency Pro</h3>
                <p className="text-xs text-gray-500 mb-6">
                  For scaling agencies needing maximum booking volume and custom branding.
                </p>

                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-gray-100">
                  <span className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                    ${Math.round(149 * discountMultiplier)}
                  </span>
                  <span className="text-xs font-bold text-gray-400">/ Per month</span>
                </div>

                <div className="space-y-3.5 mb-8 text-xs font-medium text-gray-700">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span className="font-bold text-gray-900">2,500 Qualified Leads / mo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span className="font-bold text-gray-900">500 Bespoke Interactive AI Demos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Multichannel auto-dispatch (Email + SMS)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Custom domain & white-label links</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>CRM Webhooks & 2-way sync</span>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href="/signup"
                  className="relink-pill-btn relink-btn-blue w-full text-xs font-bold py-3.5 min-h-[44px]"
                >
                  Start Your Free 14-Day Trial
                </Link>
                <p className="text-center text-[11px] text-gray-400 mt-2 font-medium">
                  Instant activation · No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Integrations Section */}
      <section id="integrations" className="py-24 px-4 sm:px-6 bg-[#fafcff] border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4">
            Seamless Integrations
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Connect effortlessly with your existing CRM, inbox, and outreach stack.
          </p>

          <div className="mb-14">
            <Link
              href="/signup"
              className="relink-pill-btn relink-btn-dark text-xs font-bold px-6 py-3 inline-flex items-center gap-2 min-h-[44px]"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Try for free in minutes today
            </Link>
          </div>

          <div className="relative max-w-3xl mx-auto pt-4 pb-12">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12 relative z-10">
              {[
                { name: 'Microsoft Teams', bg: 'bg-indigo-50 text-indigo-700' },
                { name: 'Zapier', bg: 'bg-orange-50 text-orange-600' },
                { name: 'HubSpot', bg: 'bg-amber-50 text-amber-700' },
                { name: 'Dropbox', bg: 'bg-blue-50 text-blue-700' },
                { name: 'Slack', bg: 'bg-purple-50 text-purple-700' },
                { name: 'Google Sheets', bg: 'bg-emerald-50 text-emerald-700' },
                { name: 'Apollo.io', bg: 'bg-blue-50 text-blue-600' },
              ].map((app, i) => (
                <div
                  key={i}
                  className={`w-11 h-11 rounded-2xl ${app.bg} border border-gray-200 shadow-sm flex items-center justify-center font-extrabold text-xs hover:scale-110 transition-transform`}
                  title={app.name}
                >
                  {app.name.slice(0, 2).toUpperCase()}
                </div>
              ))}
            </div>

            <div className="relative flex items-center justify-center my-8 z-10">
              <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,99,235,0.4)] border-4 border-white">
                <Zap className="w-8 h-8 fill-white" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-12 relative z-10">
              {[
                { name: 'Shopify', bg: 'bg-emerald-50 text-emerald-700' },
                { name: 'Zendesk', bg: 'bg-teal-50 text-teal-700' },
                { name: 'QuickBooks', bg: 'bg-green-50 text-green-700' },
                { name: 'Stripe', bg: 'bg-indigo-50 text-indigo-700' },
                { name: 'Asana', bg: 'bg-rose-50 text-rose-600' },
              ].map((app, i) => (
                <div
                  key={i}
                  className={`w-11 h-11 rounded-2xl ${app.bg} border border-gray-200 shadow-sm flex items-center justify-center font-extrabold text-xs hover:scale-110 transition-transform`}
                  title={app.name}
                >
                  {app.name.slice(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Frequently Asked<br />Questions
              </h2>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-blue text-xs font-bold inline-flex min-h-[44px]"
              >
                Contact us
              </Link>

              <div className="bg-[#f8fafc] border border-gray-200/80 rounded-3xl p-6 sm:p-7 space-y-5 text-xs text-gray-600 mt-6 shadow-sm">
                <div>
                  <div className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Location</div>
                  <div className="font-bold text-gray-900 text-sm">75 9A Queenswood Blvd, San Francisco, CA, United States</div>
                </div>
                <div>
                  <div className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Phone</div>
                  <div className="font-bold text-gray-900 text-sm">+1 800-555-7382</div>
                </div>
                <div>
                  <div className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Email</div>
                  <div className="font-bold text-gray-900 text-sm">support@leaddrive.io</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 divide-y divide-gray-100">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-5 first:pt-0">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-gray-900 hover:text-blue-600 transition-colors min-h-[44px]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`text-xs sm:text-sm text-gray-500 font-normal leading-relaxed transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? 'max-h-96 pt-3 opacity-100' : 'max-h-0 pt-0 opacity-0'
                      }`}
                    >
                      {faq.a}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 11. Redesigned Newsletter / Closing CTA Banner (High-Contrast Sky Gradient with Visible Crisp Typography) */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Explicit rich blue sky container with visible high contrast content */}
          <div className="relative rounded-[2.2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#0f172a] text-white shadow-2xl overflow-hidden border border-sky-400/20">
            {/* Background glowing clouds/particles */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-300/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-3xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Column: Clear, High-Contrast Heading & Playbook Form */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 border border-sky-300/30 text-sky-200 text-xs font-bold mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                  <span>Weekly Outbound Playbooks</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4 drop-shadow-sm">
                  Join Our Newsletter & Get Free Outreach Playbooks
                </h2>
                
                <p className="text-sky-100 text-sm sm:text-base max-w-xl font-medium leading-relaxed mb-8">
                  Get weekly high-converting cold email teardowns, niche discovery prompts, and AI demo scripts delivered straight to your inbox.
                </p>

                {/* Email Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (emailInput) setSubscribed(true);
                  }}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mb-8"
                >
                  <input
                    type="email"
                    placeholder="Enter your work email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="px-5 py-3.5 rounded-full bg-white text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-sky-300 flex-grow shadow-lg min-h-[46px]"
                  />
                  <button
                    type="submit"
                    className="relink-pill-btn bg-blue-500 hover:bg-blue-400 text-white text-xs sm:text-sm font-bold px-7 py-3.5 shadow-xl whitespace-nowrap min-h-[46px] transition-all"
                  >
                    {subscribed ? 'Subscribed!' : 'Get Free Playbooks'}
                  </button>
                </form>

                {/* Visible Info Badges */}
                <div className="space-y-2.5 text-xs font-semibold text-sky-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-300" />
                    <span>Market Research — 75 9A Queenswood Blvd, San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Investment Analytics — 99.4% Automated Outreach Delivery</span>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Contrast Floating Glass Card */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="bg-white rounded-3xl p-6 sm:p-7 text-gray-900 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                        <Zap className="w-4 h-4 fill-white" />
                      </div>
                      <span className="font-extrabold text-sm text-gray-900">Live System Status</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                      99.9% Uptime
                    </span>
                  </div>

                  <div className="py-5 space-y-3.5 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Active Parallel Agents</span>
                      <span className="font-extrabold text-gray-900">12 Crawlers</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Demos Generated Today</span>
                      <span className="font-extrabold text-gray-900">4,892</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Outreach Delivery Rate</span>
                      <span className="font-extrabold text-emerald-600 text-sm">99.4%</span>
                    </div>
                  </div>

                  <Link
                    href="/signup"
                    className="block w-full text-center py-3.5 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-lg transition-all min-h-[44px] flex items-center justify-center mt-2"
                  >
                    Start Free 14-Day Trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="py-16 px-4 sm:px-6 bg-white border-t border-gray-100 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-gray-100">
            <div className="md:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <span className="font-extrabold text-lg tracking-tight text-gray-900">
                  LeadDrive
                </span>
              </Link>
              <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
                Autonomous outbound intelligence, real-time website diagnostics, and bespoke AI demo synthesis for modern sales teams.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 text-xs mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#why" className="hover:text-gray-900 transition-colors">Why LeadDrive</a></li>
                <li><a href="#proof" className="hover:text-gray-900 transition-colors">Case Studies</a></li>
                <li><a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 text-xs mb-4">Features</h4>
              <ul className="space-y-2.5">
                <li><a href="#features" className="hover:text-gray-900 transition-colors">Multi-Vector Discovery</a></li>
                <li><a href="#features" className="hover:text-gray-900 transition-colors">Website Diagnostics</a></li>
                <li><a href="#features" className="hover:text-gray-900 transition-colors">AI Demo Synthesis</a></li>
                <li><a href="#integrations" className="hover:text-gray-900 transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 text-xs mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-gray-900 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400">
            <div>© {new Date().getFullYear()} LeadDrive Inc. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-600">Twitter / X</a>
              <a href="#" className="hover:text-gray-600">LinkedIn</a>
              <a href="#" className="hover:text-gray-600">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
