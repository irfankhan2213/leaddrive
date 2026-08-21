'use client';

import React, { useState } from 'react';
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
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  Layers,
  Flame,
  Activity,
  MousePointerClick,
  FileCode2,
  Clock,
  Play
} from 'lucide-react';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeTab, setActiveTab] = useState<'prospecting' | 'audit' | 'demos' | 'pipeline'>('demos');
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
    <div className="min-h-screen text-[#111827] flex flex-col justify-between">
      {/* Top Glass Navigation Bar */}
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
                <span className="text-[10px] font-semibold text-gray-500">v2.4 Engine Active</span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600">
            <a href="#pipeline" className="hover:text-blue-600 transition-colors">Command Pipeline</a>
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

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow Status Pill */}
          <div className="inline-flex items-center gap-2 status-pill px-3.5 py-1.5 mb-6 shadow-sm border border-white/80">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="eyebrow !text-[11px] !text-blue-700 !font-bold">
              AI-POWERED COLD OUTREACH &amp; DEMO SYNTHESIS ENGINE
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.05] mb-6">
            Autonomous Outreach Intelligence <br />
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              for High-Growth Agencies.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Discover verified leads across Google Maps and Apollo, diagnose real website bottlenecks, synthesize bespoke interactive web demos, and fire personalized multichannel outreach in seconds.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
            <Link
              href="/signup"
              className="btn text-sm px-7 py-3 shadow-xl shadow-blue-500/30 w-full sm:w-auto"
            >
              Launch Free Campaign <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Link>
            <Link
              href="/login"
              className="btn secondary text-sm px-6 py-3 w-full sm:w-auto"
            >
              Open Live Console
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500 font-semibold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Supabase DB sync</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Frosted Glass Dashboard Canvas */}
        <div className="mt-14 panel p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          {/* Top Bar of Window */}
          <div className="flex items-center justify-between border-b border-white/60 pb-3 mb-5 px-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
              <span className="text-xs font-semibold text-gray-400 ml-2">LeadDrive Command Center · Live Multi-Agent Workspace</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-pill !bg-emerald-50 !border-emerald-200 !text-emerald-700 font-bold text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PIPELINE LIVE
              </span>
            </div>
          </div>

          {/* 4 Metric Cards inside Canvas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="panel panel-pad metric bg-white/70">
              <div className="eyebrow text-gray-500 flex items-center justify-between">
                <span>Discovered Leads</span>
                <Target className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="metric-value text-gray-900 mt-2">1,840</div>
              <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                <span>↑ 24% from Maps &amp; Apollo</span>
              </div>
            </div>

            <div className="panel panel-pad metric bg-white/70">
              <div className="eyebrow text-gray-500 flex items-center justify-between">
                <span>Qualified Prospects</span>
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <div className="metric-value text-gray-900 mt-2">1,420</div>
              <div className="text-[11px] font-semibold text-blue-600 mt-1">
                Avg Fit Score: 88/100
              </div>
            </div>

            <div className="panel panel-pad metric bg-white/70">
              <div className="eyebrow text-gray-500 flex items-center justify-between">
                <span>AI Demos Synthesized</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              </div>
              <div className="metric-value text-gray-900 mt-2">980</div>
              <div className="text-[11px] font-semibold text-purple-600 mt-1">
                Vertex &amp; v0 Live Previews
              </div>
            </div>

            <div className="panel panel-pad metric bg-white/70">
              <div className="eyebrow text-gray-500 flex items-center justify-between">
                <span>Reply Rate Lift</span>
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="metric-value text-emerald-600 mt-2">4.8x</div>
              <div className="text-[11px] font-semibold text-gray-500 mt-1">
                18.4% Booked Call Conversion
              </div>
            </div>
          </div>

          {/* Interactive Lead Inspection Table Mock */}
          <div className="panel p-4 bg-white/80 border border-white">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-gray-900">Prospect Intelligence Stream</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Automated Batch #104</span>
              </div>
              <span className="text-[11px] text-gray-500 font-medium">Updated 3 seconds ago</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Row 1 */}
              <div className="p-3 rounded-2xl bg-white border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-xs hover:border-blue-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs">
                    AP
                  </div>
                  <div>
                    <div className="font-extrabold text-gray-900 flex items-center gap-2">
                      Austin Precision Dental
                      <span className="status-pill !text-[9px] !py-0 !px-1.5 bg-emerald-50 text-emerald-700 font-bold">Healthcare</span>
                    </div>
                    <div className="text-[11px] text-gray-500">austinprecisiondental.com · Austin, TX</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-28">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                      <span>Fit Score</span>
                      <span className="text-emerald-600">96%</span>
                    </div>
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: '96%' }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-lg bg-red-50 text-red-700 font-bold text-[10px] border border-red-100">
                      Mobile Speed: 24/100
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-100 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Demo Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="p-3 rounded-2xl bg-white border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-xs hover:border-blue-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs">
                    BH
                  </div>
                  <div>
                    <div className="font-extrabold text-gray-900 flex items-center gap-2">
                      Beacon Hill Legal Partners
                      <span className="status-pill !text-[9px] !py-0 !px-1.5 bg-blue-50 text-blue-700 font-bold">Legal</span>
                    </div>
                    <div className="text-[11px] text-gray-500">beaconhilllegal.com · Boston, MA</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-28">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                      <span>Fit Score</span>
                      <span className="text-emerald-600">89%</span>
                    </div>
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: '89%' }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-100">
                      Lighthouse: 38/100
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-100 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Demo Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Command Pipeline Visualizer */}
      <section id="pipeline" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="eyebrow text-blue-600 mb-2 block">Command Pipeline Architecture</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            From Search to Signed Retainer in 4 Steps.
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-3">
            Every step is managed autonomously by specialized background AI agents with real-time telemetry.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {[
            { id: 'prospecting', label: '1. Multi-Vector Discovery', icon: Target },
            { id: 'audit', label: '2. Technical Site Diagnostic', icon: BarChart3 },
            { id: 'demos', label: '3. AI Demo Synthesis Lab', icon: Sparkles },
            { id: 'pipeline', label: '4. Multichannel Dispatch', icon: Kanban },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'btn shadow-lg shadow-blue-500/20'
                    : 'btn secondary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Display Panel */}
        <div className="panel panel-pad p-6 sm:p-10 shadow-xl bg-white/80 border border-white">
          {activeTab === 'prospecting' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="status-pill bg-blue-50 text-blue-700 font-bold mb-3">STAGE 01 · PROSPECTING HUB</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                  Multi-Source Lead Extraction
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Target high-value businesses by niche and geolocation. LeadDrive orchestrates parallel scrapers across Google Maps, Apollo.io, LinkedIn, and CSV spreadsheets with automatic enrichment.
                </p>
                <div className="space-y-2.5 text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Direct decision-maker email and phone extraction</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Live domain validation and SSL certificate check</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI qualification scoring to eliminate irrelevant listings</div>
                </div>
              </div>
              <div className="panel p-5 bg-gray-900 text-white rounded-2xl">
                <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-800">
                  <span className="font-mono">// Discovery Agent Output</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
                <div className="font-mono text-xs text-gray-300 space-y-2 mt-3">
                  <div className="text-blue-400">Query: &quot;dentists in Austin TX rating &lt; 4.8&quot;</div>
                  <div>✓ Found 142 business listings</div>
                  <div>✓ Enriched 118 verified contact emails</div>
                  <div>✓ Scanned 94 live websites</div>
                  <div className="text-emerald-400 font-bold pt-1">→ 94 High-Intent Prospects Enqueued</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="status-pill bg-amber-50 text-amber-700 font-bold mb-3">STAGE 02 · TECHNICAL AUDIT</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                  Automated PageSpeed &amp; UX Diagnostic
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Our headless diagnostic bots test each prospect&apos;s site for mobile responsiveness, load speeds, missing meta tags, and broken layouts—giving you undeniable proof in your outreach.
                </p>
                <div className="space-y-2.5 text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Google Lighthouse mobile and desktop audit score (0–100)</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Identification of uncompressed images and 4+ second delays</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Auto-generation of customized pitch hooks targeting real flaws</div>
                </div>
              </div>
              <div className="panel p-5 bg-gray-900 text-white rounded-2xl">
                <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-800">
                  <span className="font-mono">// Diagnostic Report</span>
                  <span className="text-red-400 font-bold">Flaws Detected</span>
                </div>
                <div className="font-mono text-xs space-y-2 mt-3">
                  <div className="flex justify-between bg-gray-800/80 p-2 rounded-xl">
                    <span className="text-gray-300">Mobile Speed Score:</span>
                    <span className="text-red-400 font-bold">24 / 100</span>
                  </div>
                  <div className="flex justify-between bg-gray-800/80 p-2 rounded-xl">
                    <span className="text-gray-300">Largest Contentful Paint:</span>
                    <span className="text-amber-400">4.8 seconds</span>
                  </div>
                  <div className="flex justify-between bg-gray-800/80 p-2 rounded-xl">
                    <span className="text-gray-300">Mobile Layout:</span>
                    <span className="text-red-400">CTA button broken</span>
                  </div>
                  <div className="text-emerald-400 pt-1">✓ Automated pitch angle constructed</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'demos' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="status-pill bg-purple-50 text-purple-700 font-bold mb-3">STAGE 03 · AI DEMO LAB</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                  Instant Working Web Demo Synthesis
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Synthesize complete, interactive, mobile-responsive website redesigns using v0, Vertex AI, and our Agentic builder. Send prospects a personalized working demo before you even hop on a call.
                </p>
                <div className="space-y-2.5 text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-model engine: Google Vertex AI + Vercel v0 + HTML Builder</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant hosting on fast, trackable demo URLs</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Live interactive buttons, booking forms, and modern UI tokens</div>
                </div>
              </div>
              <div className="panel p-5 bg-gray-900 text-white rounded-2xl">
                <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-800">
                  <span className="font-mono">// Demo Synthesis Output</span>
                  <span className="text-purple-400 font-bold">100% Bespoke</span>
                </div>
                <div className="font-mono text-xs space-y-2 mt-3">
                  <div className="p-3 bg-gray-800/80 rounded-xl border border-gray-700">
                    <div className="text-emerald-400 font-bold">Austin Dental Studio Prototype</div>
                    <div className="text-gray-400 text-[11px]">Hosted: https://demo.leaddrive.app/lead-8429</div>
                    <div className="text-sky-300 text-[11px] mt-1">Load Time: 0.28s · Performance: 99/100</div>
                  </div>
                  <div className="text-purple-300 pt-1">✓ Ready for multichannel dispatch</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="status-pill bg-emerald-50 text-emerald-700 font-bold mb-3">STAGE 04 · OUTREACH PIPELINE</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                  Multichannel Dispatch &amp; Telemetry
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Deliver personalized emails and SMS embedded with the custom demo link. Get real-time notifications the exact second a prospect views the demo, enabling instant high-intent follow-up.
                </p>
                <div className="space-y-2.5 text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time open, click, and demo dwell time tracking</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dynamic follow-up sequences triggered by prospect clicks</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automated webhooks to Slack, HubSpot, and CRM</div>
                </div>
              </div>
              <div className="panel p-5 bg-gray-900 text-white rounded-2xl">
                <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-800">
                  <span className="font-mono">// Dispatch Telemetry</span>
                  <span className="text-emerald-400 font-bold">Engaged</span>
                </div>
                <div className="font-mono text-xs space-y-2 mt-3">
                  <div className="flex justify-between bg-gray-800/80 p-2 rounded-xl">
                    <span className="text-gray-300">Outreach Email:</span>
                    <span className="text-emerald-400 font-bold">Opened (2m ago)</span>
                  </div>
                  <div className="flex justify-between bg-gray-800/80 p-2 rounded-xl">
                    <span className="text-gray-300">Interactive Demo Click:</span>
                    <span className="text-emerald-400 font-bold">Active (3m 12s dwell)</span>
                  </div>
                  <div className="flex justify-between bg-gray-800/80 p-2 rounded-xl">
                    <span className="text-gray-300">Outcome:</span>
                    <span className="text-purple-400 font-bold">Booked Discovery Call</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Capabilities Bento Grid */}
      <section id="capabilities" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="eyebrow text-blue-600 mb-2 block">Platform Capabilities</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Engineered for Modern Agencies.
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
            <div className="pt-4 border-t border-gray-100 mt-4 text-[11px] font-bold text-blue-600">
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
            <div className="pt-4 border-t border-gray-100 mt-4 text-[11px] font-bold text-amber-600">
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
            <div className="pt-4 border-t border-gray-100 mt-4 text-[11px] font-bold text-purple-600">
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
            <div className="pt-4 border-t border-gray-100 mt-4 text-[11px] font-bold text-emerald-600">
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
