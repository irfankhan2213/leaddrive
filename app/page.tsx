'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
  Globe,
  Mail,
  Smartphone,
  BarChart3,
  Kanban,
  Target,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  Layers,
  Activity,
  MousePointerClick,
  FileCode2,
  Clock,
  Play,
  RotateCw,
  Eye,
  Send,
  Sliders,
  Check,
  Cpu
} from 'lucide-react';

interface ProspectSample {
  id: string;
  name: string;
  niche: string;
  domain: string;
  city: string;
  speedScore: number;
  weakness: string;
  demoAngle: string;
}

const SAMPLE_PROSPECTS: ProspectSample[] = [
  {
    id: 'austin-dental',
    name: 'Austin Precision Dental',
    niche: 'Healthcare / Dental',
    domain: 'austinprecisiondental.com',
    city: 'Austin, TX',
    speedScore: 24,
    weakness: 'Mobile booking widget takes 4.8s to load on 4G',
    demoAngle: 'Interactive 1-Click Patient Booking & Clean Next.js Prototype',
  },
  {
    id: 'beacon-legal',
    name: 'Beacon Hill Legal Partners',
    niche: 'Corporate Law',
    domain: 'beaconhilllegal.com',
    city: 'Boston, MA',
    speedScore: 38,
    weakness: 'Outdated copyright (2020), no mobile consultation intake',
    demoAngle: 'Modern Retainer Intake Portal with Instant Secure Case Evaluation',
  },
  {
    id: 'nexus-cloud',
    name: 'Nexus Security Systems',
    niche: 'B2B Security / Tech',
    domain: 'nexussecurityhq.com',
    city: 'San Francisco, CA',
    speedScore: 31,
    weakness: 'Broken mobile responsiveness on case studies page',
    demoAngle: 'Sleek Cyber Platform Mockup with Interactive ROI Calculator',
  },
];

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Agent Simulator State
  const [selectedProspect, setSelectedProspect] = useState<ProspectSample>(SAMPLE_PROSPECTS[0]);
  const [simState, setSimState] = useState<'idle' | 'scraping' | 'auditing' | 'synthesizing' | 'ready'>('ready');
  const [simProgress, setSimProgress] = useState(100);
  const [activeSimTab, setActiveSimTab] = useState<'preview' | 'audit' | 'email'>('preview');

  // Mouse spotlight coordinates
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const discountMultiplier = billingCycle === 'annual' ? 0.8 : 1;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const runSimulation = (prospect: ProspectSample) => {
    setSelectedProspect(prospect);
    setSimState('scraping');
    setSimProgress(15);

    setTimeout(() => {
      setSimState('auditing');
      setSimProgress(50);
    }, 700);

    setTimeout(() => {
      setSimState('synthesizing');
      setSimProgress(85);
    }, 1500);

    setTimeout(() => {
      setSimState('ready');
      setSimProgress(100);
    }, 2300);
  };

  const faqs = [
    {
      q: 'How does LeadDrive generate custom website demos for cold prospects?',
      a: 'LeadDrive connects directly to high-performance AI generation engines (including Vercel v0, Google Vertex AI, and our custom Agentic HTML builder). When a prospect is qualified, our agents scrape the prospect’s branding, diagnose flaws in their current web design, and synthesize a complete, interactive, mobile-responsive prototype that you can link directly in your cold outreach.',
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
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="glow-canvas min-h-screen text-[#111827] flex flex-col justify-between"
    >
      {/* Dynamic Mouse Spotlight Glow */}
      <div
        className="glow-spotlight"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      {/* Floating Glass Navigation Bar */}
      <header className="sticky top-3 z-50 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="panel px-4 py-3 flex items-center justify-between shadow-lg">
          {/* Brand Mark */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="brand-mark flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight leading-none text-gray-900">
                LeadDrive
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-semibold text-gray-500 font-mono">v2.4 Engine Active</span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600">
            <a href="#simulator" className="hover:text-blue-600 transition-colors">Interactive Demo</a>
            <a href="#pipeline" className="hover:text-blue-600 transition-colors">Pipeline</a>
            <a href="#capabilities" className="hover:text-blue-600 transition-colors">Capabilities</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </nav>

          {/* Auth CTA Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="btn secondary !min-h-[36px] !px-4 !text-xs font-bold"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn !min-h-[36px] !px-4 !text-xs shadow-md shadow-blue-500/25 font-bold"
            >
              Start Free Trial <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Animated SVG Geometry & Live Telemetry */}
      <section className="relative pt-16 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Background Rotating SVG Orbits */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] pointer-events-none opacity-35 -z-10">
          <svg viewBox="0 0 800 800" className="w-full h-full">
            <circle cx="400" cy="400" r="380" fill="none" stroke="rgba(0, 122, 255, 0.15)" strokeWidth="1" />
            <circle cx="400" cy="400" r="280" fill="none" stroke="rgba(90, 200, 250, 0.2)" strokeWidth="1.5" strokeDasharray="6 6" className="orbit-ring" />
            <circle cx="400" cy="400" r="180" fill="none" stroke="rgba(0, 122, 255, 0.25)" strokeWidth="1" className="orbit-ring-reverse" />
            <circle cx="400" cy="20" r="6" fill="#007aff" className="orbit-ring" />
            <circle cx="680" cy="400" r="5" fill="#5ac8fa" className="orbit-ring-reverse" />
          </svg>
        </div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          {/* Live Telemetry Pill */}
          <div className="inline-flex items-center gap-2 status-pill px-3.5 py-1.5 mb-6 shadow-sm border border-white/80">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="eyebrow !text-[11px] !text-blue-700 !font-bold font-mono">
              OCTOLANE-GRADE MOTION · MULTI-AGENT DEMO SYNTHESIS
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.05] mb-6">
            Autonomous Outreach Intelligence <br />
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Powered by Proof.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            LeadDrive autonomously discovers qualified businesses, diagnoses high-friction website bottlenecks, and generates custom interactive web demos before firing precision multichannel campaigns.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
            <Link
              href="/signup"
              className="btn text-sm px-7 py-3 shadow-xl shadow-blue-500/30 w-full sm:w-auto font-bold"
            >
              Launch Free Campaign <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Link>
            <a
              href="#simulator"
              className="btn secondary text-sm px-6 py-3 w-full sm:w-auto font-bold"
            >
              Test Live Simulator <Play className="w-3.5 h-3.5 ml-1 inline text-blue-600" />
            </a>
          </div>

          {/* Live Metric Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-semibold pt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Instant Supabase sync</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Agent Simulation Sandbox */}
        <div id="simulator" className="mt-14 panel p-4 sm:p-6 shadow-2xl relative overflow-hidden bg-white/90">
          {/* Simulator Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-gray-900">Live Agent Demo Simulator</span>
                <span className="status-pill !bg-blue-50 !text-blue-700 !text-[10px] font-bold">Interactive</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Select a prospect business to trigger live multi-agent synthesis:</p>
            </div>

            {/* Business Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {SAMPLE_PROSPECTS.map((p) => {
                const isSelected = selectedProspect.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => runSimulation(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200/80'
                    }`}
                  >
                    {p.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Bar during Simulation */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-600 mb-1.5 font-mono">
              <span className="flex items-center gap-2">
                {simState === 'scraping' && 'Step 1/3: Scraping Apollo & Google Maps listing...'}
                {simState === 'auditing' && 'Step 2/3: Running Headless Lighthouse Speed Audit...'}
                {simState === 'synthesizing' && 'Step 3/3: Synthesizing Next.js Prototype via Vertex AI...'}
                {simState === 'ready' && '✓ Autonomous Synthesis Complete · Demo Enqueued'}
              </span>
              <span className="text-blue-600">{simProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${simProgress}%` }}
              />
            </div>
          </div>

          {/* Simulator View Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: Prospect Intelligence Card */}
            <div className="panel p-4 bg-white/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="eyebrow text-gray-400 font-mono">Prospect Profile</span>
                  <span className="status-pill !bg-emerald-50 !text-emerald-700 !text-[10px] font-bold">Enriched</span>
                </div>
                <div className="font-extrabold text-base text-gray-900">{selectedProspect.name}</div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">{selectedProspect.domain}</div>
                <div className="text-xs text-gray-600 mt-1">{selectedProspect.city} · {selectedProspect.niche}</div>

                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 mb-1">Mobile Speed Diagnostic</div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded-lg bg-red-100 text-red-700 font-bold text-xs font-mono">
                        {selectedProspect.speedScore} / 100
                      </span>
                      <span className="text-xs text-red-600 font-semibold">Critical Bottleneck</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-gray-500 mb-1">Diagnosed Weakness</div>
                    <div className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100 font-medium">
                      &quot;{selectedProspect.weakness}&quot;
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Fit Score: <strong className="text-emerald-600">96%</strong></span>
                <button
                  onClick={() => runSimulation(selectedProspect)}
                  className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Re-run
                </button>
              </div>
            </div>

            {/* Middle & Right: Live Interactive Prototype Sandbox */}
            <div className="lg:col-span-2 panel p-4 bg-slate-950 text-white rounded-2xl flex flex-col justify-between">
              {/* Sandbox Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-slate-400 ml-2">demo.leaddrive.app/{selectedProspect.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSimTab('preview')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-colors ${
                      activeSimTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Live Preview
                  </button>
                  <button
                    onClick={() => setActiveSimTab('email')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-colors ${
                      activeSimTab === 'email' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Email Angle
                  </button>
                </div>
              </div>

              {/* Sandbox Body Content */}
              {activeSimTab === 'preview' && (
                <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                          {selectedProspect.name.charAt(0)}
                        </div>
                        <span className="font-bold text-sm text-white">{selectedProspect.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        ⚡ 0.28s Load Speed
                      </span>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-extrabold text-base text-white">{selectedProspect.demoAngle}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        High-converting Next.js client interface with instant schedule confirmation and mobile-first gesture support.
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                        <div className="text-slate-500 text-[10px]">Mobile Viewport</div>
                        <div className="text-emerald-400 font-bold mt-0.5">100% Fluid Score</div>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                        <div className="text-slate-500 text-[10px]">Lighthouse Audit</div>
                        <div className="text-emerald-400 font-bold mt-0.5">99 / 100</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono">Hosted on Cloudflare Edge + Supabase DB</span>
                    <Link
                      href="/signup"
                      className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 font-mono"
                    >
                      Export Full Code <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {activeSimTab === 'email' && (
                <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 flex-1 flex flex-col justify-between font-mono text-xs">
                  <div>
                    <div className="text-slate-400 mb-2">// Auto-Constructed Multichannel Copy</div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 leading-relaxed">
                      <div className="text-blue-400 mb-1">Subject: Quick question regarding {selectedProspect.domain} mobile load times</div>
                      <p className="mt-2">
                        Hi team,<br /><br />
                        I ran a technical speed audit on {selectedProspect.domain} and noticed your mobile intake widget is suffering from a 4.8s delay.<br /><br />
                        Rather than just talking about it, our team pre-built a 100% interactive Next.js redesign for {selectedProspect.name} with instant mobile booking:<br />
                        👉 <span className="text-blue-400 underline">demo.leaddrive.app/{selectedProspect.id}</span><br /><br />
                        Would you be open to a 5-min walk-through this Thursday?
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-400 pt-2">
                    ✓ Verified decision-maker email ready for automated dispatch
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Bento Grid */}
      <section id="capabilities" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="eyebrow text-blue-600 mb-2 block">Platform Capabilities</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Engineered for Modern Outbound Teams.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="panel panel-pad bg-white/80 flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900 mb-2">Automated Discovery</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Scrape Google Maps and Apollo with deep contact enrichment and location-based semantic keyword clustering.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 mt-4 text-[11px] font-bold text-blue-600 font-mono">
              MAPS · APOLLO · LINKEDIN
            </div>
          </div>

          <div className="panel panel-pad bg-white/80 flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900 mb-2">Lighthouse Audits</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Run automated PageSpeed, mobile responsiveness, and SEO checks to identify concrete leverage for cold pitches.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 mt-4 text-[11px] font-bold text-amber-600 font-mono">
              SPEED · SEO · CORE VITALS
            </div>
          </div>

          <div className="panel panel-pad bg-white/80 flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900 mb-2">AI Demo Synthesis</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Build bespoke interactive prototypes in seconds using Vertex AI and v0 models with live hosted demo URLs.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 mt-4 text-[11px] font-bold text-purple-600 font-mono">
              VERTEX · V0 · AGENTIC
            </div>
          </div>

          <div className="panel panel-pad bg-white/80 flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900 mb-2">Multichannel Dispatch</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Send tailored email and SMS sequences with real-time open, click, and dwell time webhooks and CRM integration.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 mt-4 text-[11px] font-bold text-emerald-600 font-mono">
              EMAIL · SMS · WEBHOOKS
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="eyebrow text-blue-600 mb-2 block">Simple SaaS Pricing</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Predictable Plans for Growing Pipelines.
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8">
            Every subscription includes a 14-day trial, multi-tenant Supabase DB sync, and live demo hosting.
          </p>

          {/* Billing Switch */}
          <div className="inline-flex items-center panel p-1 bg-white/80 shadow-sm rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'btn !min-h-[30px] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'btn !min-h-[30px] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Annual</span>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded-full font-extrabold">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Starter Card */}
          <div className="panel panel-pad bg-white/80 flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="eyebrow text-gray-500 mb-2">Starter Plan</div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-extrabold text-gray-900">${Math.round(49 * discountMultiplier)}</span>
                <span className="text-xs text-gray-500 font-semibold">/ month</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                Ideal for solo agency founders and freelancers launching outbound campaigns.
              </p>
              <div className="space-y-3 text-xs font-semibold text-gray-700 border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 500 Qualified Leads / mo</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 100 AI Demos Synthesized</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Google Maps &amp; Apollo Scraper</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> PageSpeed Diagnostic Audits</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Email Outreach Sequences</div>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-gray-100">
              <Link href="/signup" className="btn secondary w-full text-xs font-bold">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>

          {/* Growth Pro Card (Featured) */}
          <div className="panel panel-pad bg-gradient-to-b from-blue-600 to-indigo-700 text-white flex flex-col justify-between shadow-2xl relative scale-105 border-blue-400">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-blue-700 px-3 py-0.5 rounded-full font-extrabold text-[10px] tracking-wider uppercase shadow-md">
              MOST POPULAR
            </div>
            <div>
              <div className="eyebrow !text-blue-100 mb-2">Growth Pro</div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-extrabold text-white">${Math.round(149 * discountMultiplier)}</span>
                <span className="text-xs text-blue-200 font-semibold">/ month</span>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed mb-6">
                For scaling agencies needing high volume lead ingestion and automated demo building.
              </p>
              <div className="space-y-3 text-xs font-semibold text-blue-50 border-t border-white/20 pt-5">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> 2,500 Qualified Leads / mo</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> 500 AI Demos Synthesized</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> Vertex AI + v0 Hybrid Generation</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> Multichannel Email + SMS Dispatch</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> Real-time Dwell Time Telemetry</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> HubSpot &amp; Webhook Sync</div>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/20">
              <Link href="/signup" className="btn bg-white !text-blue-700 hover:bg-gray-100 w-full text-xs font-extrabold shadow-lg">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>

          {/* Agency Scale Card */}
          <div className="panel panel-pad bg-white/80 flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="eyebrow text-gray-500 mb-2">Agency Scale</div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-extrabold text-gray-900">${Math.round(399 * discountMultiplier)}</span>
                <span className="text-xs text-gray-500 font-semibold">/ month</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                For established agencies requiring maximum throughput and custom white-labeling.
              </p>
              <div className="space-y-3 text-xs font-semibold text-gray-700 border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Unlimited Lead Discovery</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 2,000 AI Demos Synthesized / mo</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Custom Domain Demo Hosting</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Multi-Seat Team Workspaces</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Dedicated Sending IPs &amp; Warmup</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Priority 24/7 Slack Channel</div>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-gray-100">
              <Link href="/signup" className="btn secondary w-full text-xs font-bold">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="eyebrow text-blue-600 mb-2 block">Support &amp; Clarity</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="panel bg-white/80 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm text-gray-900"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Glass Banner */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="panel p-8 sm:p-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white text-center rounded-[32px] shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-100 mb-3 block">
              Scale Your Agency Outbound
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Ready to automate high-converting outreach?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 mb-8 leading-relaxed">
              Start building bespoke interactive demos for qualified leads today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="btn bg-white !text-blue-700 hover:bg-gray-100 text-sm px-8 py-3.5 font-extrabold shadow-xl w-full sm:w-auto"
              >
                Start 14-Day Free Trial <ArrowRight className="w-4 h-4 ml-1 inline" />
              </Link>
              <Link
                href="/login"
                className="btn secondary !bg-white/20 !text-white !border-white/30 hover:!bg-white/30 text-sm px-6 py-3.5 font-bold w-full sm:w-auto"
              >
                Sign In to Console
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-gray-200/60 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="brand-mark !w-6 !h-6 !text-[11px] rounded-lg">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-extrabold text-gray-900">LeadDrive</span>
          <span>© {new Date().getFullYear()} LeadDrive Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 font-semibold">
          <Link href="/login" className="hover:text-blue-600 transition-colors">Sign In</Link>
          <Link href="/signup" className="hover:text-blue-600 transition-colors">Sign Up</Link>
          <a href="#pipeline" className="hover:text-blue-600 transition-colors">Pipeline</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
        </div>
      </footer>
    </div>
  );
}
