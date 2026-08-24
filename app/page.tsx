'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Zap,
  ArrowRight,
  ArrowUpRight,
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
  Send,
  Database,
  TrendingUp,
  Bot,
  Cpu,
  Check,
  ShieldCheck,
  Headphones
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
      q: 'What types of data can I upload and analyze?',
      a: 'You can upload CSV spreadsheets, connect live Google Maps scrapers, query the Apollo.io API, scrape LinkedIn searches, or input raw website domains. Our AI crawlers automatically normalize, deduplicate, and enrich every record.',
    },
    {
      q: 'How secure is my data?',
      a: 'We use enterprise-grade AES-256 encryption at rest and TLS 1.3 in transit. Your lead databases and campaign assets remain private to your team and are never shared or used to train public AI models.',
    },
    {
      q: "What's the difference between the Basic and Pro plan?",
      a: 'The Basic plan is designed for solo founders managing up to 500 leads/mo with standard site audits. The Pro plan unlocks high-volume AI Demo synthesis, multichannel automated dispatch (Email + SMS), custom domain hosting, and dedicated account support.',
    },
    {
      q: 'How easy is it to get started with LeadDrive?',
      a: 'You can launch your first campaign in under 3 minutes. Simply define your target niche and location, and LeadDrive will automatically find prospects, generate technical site audits, synthesize live demo links, and queue your outreach.',
    },
    {
      q: 'Can I integrate this platform with my existing sales CRM?',
      a: 'Yes. We provide native two-way sync with HubSpot, Salesforce, Pipedrive, Zapier, Make, and custom webhooks to push high-intent leads the second they engage with a demo.',
    },
    {
      q: 'What support options are available?',
      a: 'All plans include 24/7 email and community support. Pro and Enterprise plans include dedicated Slack channel access, weekly strategy calls, and custom scraper development.',
    },
    {
      q: 'Do you offer a free trial or live product demonstration?',
      a: 'Yes! We offer a full 14-day free trial on all plans with zero upfront commitment. You can also schedule a live 1-on-1 walkthrough with our outbound solutions team.',
    },
    {
      q: 'How often are new features and scrapers added?',
      a: 'Our engineering team ships weekly updates. Recent additions include automated PageSpeed Core Web Vitals audits, Instagram profile scrapers, and 1-click V0 demo deployment.',
    },
  ];

  return (
    <div className="min-h-screen text-[#0f172a] bg-white font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between overflow-x-hidden">
      {/* 1. Header Navigation Bar */}
      <header className="fixed top-0 z-50 w-full px-4 sm:px-6 py-3.5 transition-all duration-300">
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

          {/* Centered Floating Pill Navigation (Matching Reference) */}
          <nav className="hidden md:flex items-center bg-white/90 backdrop-blur-md px-1.5 py-1.5 rounded-full border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-[13px] font-semibold text-gray-600">
            <Link href="/" className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-900 font-bold transition-all">
              Home
            </Link>
            <div className="group relative">
              <button className="px-4 py-1.5 rounded-full hover:text-gray-900 flex items-center gap-1 transition-colors">
                Solution <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900" />
              </button>
            </div>
            <div className="group relative">
              <button className="px-4 py-1.5 rounded-full hover:text-gray-900 flex items-center gap-1 transition-colors">
                Resources <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900" />
              </button>
            </div>
            <a href="#pricing" className="px-4 py-1.5 rounded-full hover:text-gray-900 transition-colors">
              Pricing
            </a>
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language / Region Selector Pill */}
            <div className="flex items-center bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 shadow-sm">
              <span className="w-4 h-4 rounded-full bg-gray-900 text-white flex items-center justify-center text-[9px] mr-1.5">EN</span>
              <span className="text-gray-400">SP</span>
            </div>

            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 hover:text-black px-3 py-1.5 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="relink-btn-blue relink-pill-btn text-xs font-bold"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu hamburger button */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 p-6 flex flex-col gap-4 shadow-2xl md:hidden animate-in slide-in-from-top-2">
            <a href="#why" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Why LeadDrive</a>
            <a href="#features" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
            <a href="#integrations" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Integrations</a>
            <a href="#faq" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
            <hr className="border-gray-100 my-1" />
            <Link href="/login" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
            <Link href="/signup" className="relink-btn-blue relink-pill-btn text-center text-sm py-3 mt-1" onClick={() => setIsMobileMenuOpen(false)}>Start Free Trial</Link>
          </div>
        )}
      </header>

      {/* 2. Hero Section with Atmospheric Sky Background */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 relink-sky-gradient overflow-hidden">
        {/* Soft atmospheric cloud effects matching reference */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-sky-200/50 via-blue-100/30 to-transparent blur-3xl rounded-full" />
          <div className="absolute top-20 -left-20 w-80 h-80 bg-white/80 blur-2xl rounded-full" />
          <div className="absolute top-24 -right-20 w-96 h-96 bg-white/70 blur-3xl rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-extrabold tracking-tight text-[#0f172a] leading-[1.08] mb-6">
            Data-Driven Decisions<br />
            <span className="text-[#0f172a]">Powered by AI</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Effortlessly analyze large datasets, uncover trends, and make better decisions in minutes.
          </p>

          {/* Pill Action Button Group matching reference */}
          <div className="flex items-center justify-center gap-3 mb-16">
            <Link
              href="/signup"
              className="relink-pill-btn relink-btn-blue px-7 py-3 text-sm shadow-md font-bold"
            >
              Try for free
            </Link>
            <Link
              href="/login"
              className="relink-pill-btn relink-btn-dark px-7 py-3 text-sm font-bold flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Schedule a Demo
            </Link>
          </div>

          {/* 3. Hero Dashboard Preview (Interactive Multi-Card Stack matching reference) */}
          <div className="relative mx-auto max-w-5xl">
            {/* Background angled card peek */}
            <div className="hidden lg:block absolute -left-12 top-10 w-64 h-[420px] bg-white/90 backdrop-blur-md rounded-3xl border border-gray-200 shadow-xl transform -rotate-6 z-0 p-4 pointer-events-none opacity-80">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="font-bold text-xs">LeadDrive</span>
              </div>
              <div className="space-y-2 text-[11px] font-medium text-gray-500">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5" /> Dashboard</div>
                <div className="p-2 rounded-xl hover:bg-gray-50 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Tracking</div>
                <div className="p-2 rounded-xl hover:bg-gray-50 flex items-center gap-2"><Database className="w-3.5 h-3.5" /> Analytics</div>
                <div className="p-2 rounded-xl hover:bg-gray-50 flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> Inventory</div>
                <div className="p-2 rounded-xl hover:bg-gray-50 flex items-center gap-2"><Bot className="w-3.5 h-3.5" /> AI Synthesis</div>
              </div>
            </div>

            {/* Main Primary Dashboard Container */}
            <div className="relative z-10 bg-white rounded-3xl sm:rounded-[2.2rem] border border-gray-200/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] p-4 sm:p-6 lg:p-7 text-left">
              {/* Window Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Good morning!</h2>
                  <div className="inline-flex items-center gap-2 mt-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-xs font-semibold text-amber-800">
                    <Bell className="w-3 h-3 text-amber-600" />
                    <span>You have 12 qualified leads ready to track today</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search prospects..."
                      className="pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 sm:w-52"
                    />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs">
                    IK
                  </div>
                </div>
              </div>

              {/* Main Dashboard Content Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-start">
                {/* Left Chart & Metrics Section (8 cols) */}
                <div className="lg:col-span-8 bg-[#fafcff] rounded-2xl border border-blue-50 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">Outbound lead analytics</h3>
                      <p className="text-xs text-gray-400 font-medium">Verified conversions & interactive demo engagements</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
                      <span>January 2026 - May 2026</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Summary Metric Stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <div className="text-[11px] font-medium text-gray-400 uppercase">Total Leads</div>
                      <div className="text-lg sm:text-xl font-extrabold text-gray-900 mt-0.5">352,781</div>
                      <div className="text-[11px] font-bold text-emerald-600 mt-0.5 flex items-center">
                        ▲ 2.84% <span className="text-gray-400 font-normal ml-1 hidden sm:inline">vs last mo</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <div className="text-[11px] font-medium text-gray-400 uppercase">Qualified</div>
                      <div className="text-lg sm:text-xl font-extrabold text-gray-900 mt-0.5">2,751</div>
                      <div className="text-[11px] font-bold text-emerald-600 mt-0.5 flex items-center">
                        ▲ 1.48%
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <div className="text-[11px] font-medium text-gray-400 uppercase">Booked</div>
                      <div className="text-lg sm:text-xl font-extrabold text-gray-900 mt-0.5">246</div>
                      <div className="text-[11px] font-bold text-emerald-600 mt-0.5 flex items-center">
                        ▲ 3.12%
                      </div>
                    </div>
                  </div>

                  {/* Rich SVG Bar Chart (Stylized to match reference image) */}
                  <div className="relative h-44 sm:h-52 w-full flex items-end justify-between px-2 pt-4 border-b border-gray-100">
                    {/* Background grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                      <div className="w-full border-b border-dashed border-gray-200" />
                      <div className="w-full border-b border-dashed border-gray-200" />
                      <div className="w-full border-b border-dashed border-gray-200" />
                      <div className="w-full border-b border-dashed border-gray-200" />
                    </div>

                    {/* Bar columns */}
                    {[
                      { m: 'Jan', val: 40, active: false },
                      { m: 'Feb', val: 65, active: false },
                      { m: 'Mar', val: 50, active: false },
                      { m: 'Apr', val: 85, active: false },
                      { m: 'May', val: 98, active: true }, // The glowing main blue bar in reference
                      { m: 'Jun', val: 70, active: false },
                      { m: 'Jul', val: 55, active: false },
                      { m: 'Aug', val: 80, active: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 z-10 group cursor-pointer w-7 sm:w-10">
                        <div className="w-full bg-gray-100 rounded-t-lg h-36 sm:h-40 flex items-end overflow-hidden p-0.5">
                          <div
                            style={{ height: `${item.val}%` }}
                            className={`w-full rounded-t-md transition-all duration-500 ${
                              item.active
                                ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                                : 'bg-blue-200 group-hover:bg-blue-300'
                            }`}
                          />
                        </div>
                        <span className={`text-[10px] font-bold ${item.active ? 'text-blue-600' : 'text-gray-400'}`}>
                          {item.m}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Working Time & Progress Widget (4 cols) */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm text-gray-900">Avg. working time</h3>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Automated</span>
                    </div>

                    {/* Circular / Large percentage display */}
                    <div className="my-4 text-center">
                      <div className="text-4xl font-extrabold text-gray-900 tracking-tight">48.64%</div>
                      <div className="text-xs font-semibold text-emerald-600 mt-1">▲ 12.4% faster turnaround</div>
                    </div>

                    {/* Breakdown list items */}
                    <div className="space-y-3 pt-2 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                          <span className="text-gray-600 font-medium">Directly Sent</span>
                        </div>
                        <span className="font-bold text-gray-900">2h 14m</span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span className="text-gray-600 font-medium">AI Synthesized</span>
                        </div>
                        <span className="font-bold text-gray-900">45 minutes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <span className="text-gray-600 font-medium">Cold Conversion</span>
                        </div>
                        <span className="font-bold text-gray-900">18 minutes</span>
                      </div>
                    </div>
                  </div>

                  <button className="mt-6 w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition-colors flex items-center justify-center gap-1.5">
                    View detailed breakdown <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: "The Data Challenge Every Business Faces" (3-Column Problem Cards matching reference) */}
      <section id="why" className="py-24 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Header row with Left Title + Right Pill Button */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">
                WHY LEADDRIVE
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                The Data Challenge Every<br className="hidden sm:inline" /> Business Faces
              </h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-2xl mt-4 font-normal leading-relaxed">
                Turning raw prospect signals into high-converting client appointments is a bottleneck for every modern agency. LeadDrive simplifies data processes, enabling faster, smarter decisions.
              </p>
            </div>

            <Link
              href="/signup"
              className="relink-pill-btn relink-btn-light text-xs font-bold self-start md:self-auto"
            >
              How It Works <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3 Interactive Cards (Card 1: White, Card 2: Solid Blue, Card 3: White) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Market Research (White) */}
            <div className="relink-card-white p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">Market Research</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8">
                  Managing vast amounts of data can be overwhelming, with disconnected sources and complex systems making it challenging to gain a unified view.
                </p>
              </div>

              {/* Embedded UI Widget: Insights Market Growth */}
              <div className="bg-[#fafcff] border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-gray-700">
                  <span>Insights Market Growth</span>
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

            {/* Card 2: Time-Consuming Manual Work (Vibrant Blue Card matching reference) */}
            <div className="relink-card-blue p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center mb-6 shadow-md">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">Time-Consuming Manual Work</h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed mb-8">
                  Teams often spend hours on manual scraping, audit diagnostics, and email copywriting, slowing down decision-making. We automate every single step.
                </p>
              </div>

              {/* Embedded UI Widget: Data Analysis Sparkline Box */}
              <div className="bg-white rounded-2xl p-4 shadow-md text-gray-900">
                <div className="flex items-center justify-between mb-2 text-[11px] font-bold text-gray-800">
                  <span>Data · Analysis</span>
                  <div className="flex items-center gap-1 text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    452 <ArrowUpRight className="w-3 h-3" />
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

            {/* Card 3: Missed Business Insights (White) */}
            <div className="relink-card-white p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">Missed Business Insights</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8">
                  Without the right tools, crucial trends and opportunities can go unnoticed. Our platform synthesizes live working prototypes into actionable hooks.
                </p>
              </div>

              {/* Embedded UI Widget: Insights Conversion Rate */}
              <div className="bg-[#fafcff] border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-gray-700">
                  <span>Insights Conversion Rate</span>
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

      {/* 5. Section: "All the Tools You Need for Powerful Data Analysis" (3 Tall Feature Cards matching reference) */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-[#fafcff] border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Centered Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4">
              All the Tools You Need for Powerful<br />Data Analysis
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-normal leading-relaxed">
              Get the best value for your money with our tailored tools. Whether you need automated scraping or full interactive AI synthesis, we've got you covered.
            </p>
          </div>

          {/* 3 Tall Cards with rich graphics on top & copy/button below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: AI-Powered Insights */}
            <div className="relink-card-white p-6 sm:p-7 flex flex-col justify-between bg-white">
              <div>
                {/* Upper graphic: Tall stylized bar chart with badges */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 h-48 sm:h-52 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                    <span>Performance Flaws</span>
                    <span>Audit Score</span>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-32 px-2">
                    {[
                      { label: 'Q1', badge: '98%', h: '45%' },
                      { label: 'Q2', badge: '92%', h: '65%' },
                      { label: 'Q3', badge: '$3.4M', h: '95%', active: true },
                      { label: 'Q4', badge: '88%', h: '55%' },
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

                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">AI-Powered Insights</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 font-normal">
                  Leverage cutting-edge AI to uncover hidden conversion patterns and flaws in your leads, helping you pitch with maximum conversion impact.
                </p>
              </div>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-light w-full text-xs font-bold py-2.5"
              >
                Get Started
              </Link>
            </div>

            {/* Card 2: Real-Time Data Visualization */}
            <div className="relink-card-white p-6 sm:p-7 flex flex-col justify-between bg-white">
              <div>
                {/* Upper graphic: Interactive timeline graph with active blue bar */}
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

                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">Real-Time Data Visualization</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 font-normal">
                  Interact with dynamic charts, graphs, and live engagement metrics that update in real-time as prospects view and click your demos.
                </p>
              </div>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-blue w-full text-xs font-bold py-2.5"
              >
                Try for free
              </Link>
            </div>

            {/* Card 3: Easy Integration (Node Connection Network Graph) */}
            <div className="relink-card-white p-6 sm:p-7 flex flex-col justify-between bg-white">
              <div>
                {/* Upper graphic: SVG Node Connection Tree matching reference */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 h-48 sm:h-52 flex items-center justify-center relative overflow-hidden">
                  {/* Central Node */}
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center z-10 shadow-lg border-2 border-white">
                    <Zap className="w-6 h-6 fill-white" />
                  </div>

                  {/* Satellite Nodes */}
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

                  {/* SVG Connector Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-blue-200 stroke-1">
                    <line x1="50%" y1="50%" x2="25%" y2="25%" strokeDasharray="3 3" />
                    <line x1="50%" y1="50%" x2="75%" y2="25%" strokeDasharray="3 3" />
                    <line x1="50%" y1="50%" x2="30%" y2="75%" strokeDasharray="3 3" />
                    <line x1="50%" y1="50%" x2="70%" y2="75%" strokeDasharray="3 3" />
                  </svg>
                </div>

                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">Easy Integration</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 font-normal">
                  Seamlessly connect with popular tools like Apollo, SendGrid, Gmail, and Google Sheets, ensuring smooth automated data flow.
                </p>
              </div>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-light w-full text-xs font-bold py-2.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section: "Choose Your Plan" (Pricing Cards matching reference) */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-normal leading-relaxed mb-8">
              Get the best value for your money with our tailored pricing options. Whether you need basic features or a fully customized solution, we've got you covered.
            </p>

            {/* Monthly / Annual Toggle Switch */}
            <div className="inline-flex items-center bg-gray-100 p-1 rounded-full border border-gray-200 shadow-inner">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>Annual</span>
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              </button>
            </div>
          </div>

          {/* Pricing Cards matching layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Card 1: Basic */}
            <div className="relink-card-white p-8 sm:p-9 flex flex-col justify-between bg-white">
              <div>
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center mb-4">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-1">Basic</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Ideal for solo outreach specialists and small agencies getting started.
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
                    <span>Unlimited lead search & exports</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>50 AI website demo syntheses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Top-level data security</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Community and email support</span>
                  </div>
                </div>
              </div>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-light w-full text-xs font-bold py-3"
              >
                Get Started
              </Link>
            </div>

            {/* Card 2: Pro (Featured with light blue ring glow matching reference) */}
            <div className="relink-card-white p-8 sm:p-9 flex flex-col justify-between bg-white border-2 border-blue-600 shadow-[0_12px_40px_rgba(37,99,235,0.15)] relative">
              <div className="absolute -top-3 right-8 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                Most Popular
              </div>

              <div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-1">Pro</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Dedicated solution for fast-growing teams with active outreach campaigns.
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
                    <span className="font-semibold">Unlimited qualified leads & diagnostics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span className="font-semibold">500 bespoke interactive AI demos</span>
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
                    <span>Enterprise-level security & webhooks</span>
                  </div>
                </div>
              </div>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-blue w-full text-xs font-bold py-3"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section: "Seamless Integrations" (Hub & Spoke Node System matching reference) */}
      <section id="integrations" className="py-24 px-4 sm:px-6 bg-[#fafcff] border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4">
            Seamless Integrations
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Get the best value for your agency with unified data syncing across all your favorite tools.
          </p>

          <div className="mb-16">
            <Link
              href="/signup"
              className="relink-pill-btn relink-btn-dark text-xs font-bold px-6 py-2.5 inline-flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Try for free in minutes today
            </Link>
          </div>

          {/* Connected App Nodes Tree matching reference */}
          <div className="relative max-w-3xl mx-auto pt-6 pb-12">
            {/* Top Row of Icons */}
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

            {/* Central Node with Curved Connecting Beziers */}
            <div className="relative flex items-center justify-center my-8 z-10">
              <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,99,235,0.4)] border-4 border-white">
                <Zap className="w-8 h-8 fill-white" />
              </div>
            </div>

            {/* Bottom Row of Connected Apps */}
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

      {/* 8. Section: "Frequently Asked Questions" (Split 2-Column with Left Contact Info Card matching reference) */}
      <section id="faq" className="py-24 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Title & Contact Card */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Frequently Asked<br />Questions
              </h2>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-blue text-xs font-bold inline-flex"
              >
                Contact us
              </Link>

              {/* Contact Information Card matching reference */}
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
                  <div className="font-bold text-gray-900 text-sm">contact@leaddrive.io</div>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Question Accordion List */}
            <div className="lg:col-span-7 divide-y divide-gray-100">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-5 first:pt-0">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-gray-900 hover:text-blue-600 transition-colors"
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

      {/* 9. Section: "Join Us Our Newsletter" (Sky Cloud Card Banner matching reference) */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relink-sky-banner relink-cloud-overlay rounded-[2.2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Column: Form & Tags */}
              <div className="lg:col-span-7">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
                  Join Us Our Newsletter
                </h2>
                <p className="text-sky-100 text-sm sm:text-base max-w-xl font-normal leading-relaxed mb-8">
                  Turning data into insights is a challenge for every business. Our platform simplifies data processes, enabling faster, smarter decisions.
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
                    placeholder="Enter your email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="px-5 py-3 rounded-full bg-white/90 text-gray-900 placeholder-gray-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white flex-grow shadow-inner"
                  />
                  <button
                    type="submit"
                    className="relink-pill-btn relink-btn-blue text-xs font-bold px-7 py-3 shadow-lg whitespace-nowrap"
                  >
                    {subscribed ? 'Subscribed!' : 'Contact us'}
                  </button>
                </form>

                {/* Pill Tags */}
                <div className="space-y-2.5 text-xs font-semibold text-sky-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-300" />
                    <span>Market Research — 75 9A Queenswood Blvd, Queens, NY, United States</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-300" />
                    <span>Investment Analytics — Automated Outbound Delivery System</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Floating Glass Metrics Card */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 text-gray-900 border border-white/40 shadow-2xl w-full max-w-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        <Zap className="w-4 h-4 fill-white" />
                      </div>
                      <span className="font-bold text-xs">Live System Status</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      99.9% Uptime
                    </span>
                  </div>

                  <div className="py-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Active Crawlers</span>
                      <span className="font-bold text-gray-900">12 Parallel Agents</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Demos Generated</span>
                      <span className="font-bold text-gray-900">4,892 Today</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Email Delivery Rate</span>
                      <span className="font-bold text-emerald-600 font-extrabold">99.4%</span>
                    </div>
                  </div>

                  <Link
                    href="/signup"
                    className="block w-full text-center py-2.5 rounded-full bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors"
                  >
                    Start Free 14-Day Trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Footer matching reference */}
      <footer className="py-16 px-4 sm:px-6 bg-white border-t border-gray-100 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-gray-100">
            {/* Brand column */}
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
                Effortlessly analyze large datasets, uncover high-intent leads, and automate bespoke interactive demo creation in minutes.
              </p>
            </div>

            {/* Links columns matching reference */}
            <div>
              <h4 className="font-bold text-gray-900 text-xs mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#why" className="hover:text-gray-900 transition-colors">About</a></li>
                <li><a href="#features" className="hover:text-gray-900 transition-colors">Solution</a></li>
                <li><a href="#pricing" className="hover:text-gray-900 transition-colors">Features</a></li>
                <li><a href="#faq" className="hover:text-gray-900 transition-colors">Resources</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 text-xs mb-4">Features</h4>
              <ul className="space-y-2.5">
                <li><a href="#features" className="hover:text-gray-900 transition-colors">AI-Powered Insights</a></li>
                <li><a href="#features" className="hover:text-gray-900 transition-colors">Real-Time Data Visualization</a></li>
                <li><a href="#integrations" className="hover:text-gray-900 transition-colors">Easy Integration</a></li>
                <li><a href="#features" className="hover:text-gray-900 transition-colors">Demo Synthesis</a></li>
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
