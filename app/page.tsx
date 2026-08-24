'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AntimetalArchitecture3D from '@/components/AntimetalArchitecture3D';
import {
  Zap,
  ArrowRight,
  ArrowUpRight,
  Check,
  Star,
  ChevronDown,
  Menu,
  X,
  Search,
  Bell,
  BarChart3,
  TrendingUp,
  Database,
  Layers,
  Bot,
  Plus,
  Compass,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck
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
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ========================================================================= */}
      {/* 1. HERO & TOP NAVIGATION (SAME TO SAME AS REFERENCE IMAGE) */}
      {/* ========================================================================= */}
      <div className="relative w-full overflow-hidden bg-[#eaf4fe]">
        {/* Photorealistic Atmospheric Sky & Fluffy Cloud Background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Sky Gradient Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#bfe0fe] via-[#dcf0ff] to-[#f4faff]" />
          
          {/* Atmospheric Fluffy Cloud Elements */}
          <div className="absolute -top-10 left-10 w-[500px] h-[300px] bg-white/70 rounded-full blur-3xl" />
          <div className="absolute top-10 right-10 w-[600px] h-[350px] bg-white/80 rounded-full blur-3xl" />
          <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-white/90 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 left-0 w-full h-48 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>

        {/* Top Floating Navbar (Exact Match to Reference) */}
        <header className="relative z-50 w-full px-6 sm:px-10 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 no-underline group">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-6 bg-blue-600 rounded-full transform -rotate-12" />
                <div className="w-2.5 h-6 bg-blue-500 rounded-full transform -rotate-12" />
                <div className="w-2.5 h-6 bg-sky-400 rounded-full transform -rotate-12" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 ml-1">
                Relink.
              </span>
            </Link>

            {/* Centered Floating Pill Menu */}
            <nav className="hidden md:flex items-center bg-white/85 backdrop-blur-md px-1.5 py-1.5 rounded-full border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-[13px] font-semibold text-gray-600">
              <Link href="/" className="px-5 py-1.5 rounded-full bg-white text-gray-900 font-bold shadow-xs transition-all">
                Home
              </Link>
              <button className="px-4 py-1.5 rounded-full hover:text-gray-900 flex items-center gap-1 transition-colors">
                Solution <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button className="px-4 py-1.5 rounded-full hover:text-gray-900 flex items-center gap-1 transition-colors">
                Resources <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <a href="#pricing" className="px-4 py-1.5 rounded-full hover:text-gray-900 transition-colors">
                Pricing
              </a>
            </nav>

            {/* Right Header Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Selector Pill */}
              <div className="flex items-center bg-white/90 backdrop-blur-md p-1 rounded-full border border-gray-200/80 text-xs font-bold text-gray-600 shadow-xs">
                <span className="px-2 py-0.5 rounded-full bg-[#0a0f1d] text-white flex items-center gap-1 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" /> EN
                </span>
                <span className="px-2 py-0.5 text-gray-400 text-[10px]">SP</span>
              </div>

              <Link
                href="/login"
                className="text-xs font-bold text-gray-700 hover:text-black transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-white/50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 p-6 flex flex-col gap-4 shadow-2xl md:hidden">
              <a href="#why" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Why Relink</a>
              <a href="#features" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
              <a href="#pricing" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
              <a href="#faq" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
              <hr className="border-gray-100 my-1" />
              <Link href="/login" className="text-base font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
              <Link href="/signup" className="bg-blue-600 text-white text-center font-bold text-sm py-3 rounded-full mt-1" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
            </div>
          )}
        </header>

        {/* Hero Centered Typography (Exact Match to Reference) */}
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-10 sm:pt-14 pb-14 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-[3.8rem] font-extrabold tracking-tight text-[#0a0f1d] leading-[1.12] mb-5">
            Data-Driven Decisions<br />
            Powered by AI
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed mb-8 font-medium">
            Effortlessly analyze large datasets, uncover trends, and make better decisions in minutes.
          </p>

          {/* Dual Action CTA Buttons (Exact Match to Reference) */}
          <div className="flex items-center justify-center gap-3 mb-12 sm:mb-16">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-7 py-3 rounded-full shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105"
            >
              Try for free
            </Link>
            <Link
              href="/login"
              className="bg-[#0a0f1d] hover:bg-[#1a233a] text-white text-xs font-bold px-6 py-3 rounded-full shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Schedule a Demo
            </Link>
          </div>

          {/* Hero Dashboard Preview (Exact Layered Perspective Stack from Reference) */}
          <div className="relative mx-auto max-w-5xl">
            {/* 1. Tilted Back-Left Card 1 (Perspective Peek) */}
            <div className="hidden lg:block absolute -left-16 top-16 w-56 h-[440px] bg-white/90 backdrop-blur-md rounded-[2rem] border-[4px] border-[#0a0f1d]/90 shadow-2xl transform -rotate-12 z-0 p-4 pointer-events-none opacity-85">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-100">
                <div className="w-5 h-5 bg-blue-600 rounded-md" />
                <span className="font-bold text-xs text-gray-900">Relink.</span>
              </div>
              <div className="space-y-3 text-[11px] font-semibold text-gray-500">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5" /> Dashboard</div>
                <div className="p-2 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Tracking</div>
                <div className="p-2 flex items-center gap-2"><Database className="w-3.5 h-3.5" /> Analytics</div>
                <div className="p-2 flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> Inventory</div>
                <div className="p-2 flex items-center gap-2"><Compass className="w-3.5 h-3.5" /> Courses</div>
              </div>
            </div>

            {/* 2. Layered Back Card 2 (Secondary Peek) */}
            <div className="hidden md:block absolute -left-6 top-8 w-64 h-[440px] bg-white rounded-[2rem] border-[5px] border-[#0a0f1d] shadow-2xl transform -rotate-6 z-10 p-5 pointer-events-none opacity-90">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">MJ</div>
                <span className="text-xs font-bold text-gray-800">Squarekroo...</span>
              </div>
              <div className="space-y-2 text-[11px] font-semibold text-gray-500">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 font-bold">Dashboard &gt;</div>
                <div className="p-2">Tracking</div>
                <div className="p-2">Analytics</div>
                <div className="p-2">Inventory</div>
                <div className="p-2">Courses</div>
              </div>
            </div>

            {/* 3. Main Foreground Dashboard Tablet Window (Exact Match) */}
            <div className="relative z-20 bg-white rounded-[2rem] sm:rounded-[2.4rem] border-[5px] sm:border-[6px] border-[#0a0f1d] shadow-[0_30px_80px_rgba(0,0,0,0.2)] overflow-hidden text-left">
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
                
                {/* Dashboard Sidebar (Left Column) */}
                <div className="hidden md:flex md:col-span-3 border-r border-gray-100 p-5 flex-col justify-between bg-white">
                  <div>
                    {/* Brand */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex items-center gap-0.5">
                        <div className="w-2 h-4 bg-blue-600 rounded-full" />
                        <div className="w-2 h-4 bg-blue-500 rounded-full" />
                        <div className="w-2 h-4 bg-sky-400 rounded-full" />
                      </div>
                      <span className="font-extrabold text-sm text-gray-900">Relink.</span>
                    </div>

                    {/* User Profile Selector */}
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 border border-gray-100 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                          MJ
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-900">Maycolle John</div>
                          <div className="text-[9px] text-gray-400">Squarekroo...</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">5</span>
                    </div>

                    {/* Nav Links */}
                    <div className="space-y-1 text-xs font-semibold text-gray-500">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold">
                        <div className="flex items-center gap-2.5">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          <span>Dashboard</span>
                        </div>
                        <span className="text-[11px]">&gt;</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50">
                        <TrendingUp className="w-4 h-4" />
                        <span>Tracking</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50">
                        <Database className="w-4 h-4" />
                        <span>Analytics</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50">
                        <Layers className="w-4 h-4" />
                        <span>Inventory</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50">
                        <Compass className="w-4 h-4" />
                        <span>Courses</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-400 font-medium pt-4 border-t border-gray-100">
                    LeadDrive Engine v2.4
                  </div>
                </div>

                {/* Dashboard Main Workspace (Right Column) */}
                <div className="md:col-span-9 p-5 sm:p-6 bg-white flex flex-col justify-between">
                  {/* Top Bar inside Workspace */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100">
                    <div>
                      <div className="text-[11px] text-gray-400 font-semibold">Hi Maycolle,</div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">Good morning!</h2>
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full mt-1">
                        <span>🔴 You have 12 pending shipments ready to track</span>
                        <ArrowUpRight className="w-3 h-3 text-amber-600" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
                        <Search className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center gap-2 bg-blue-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add new shipment</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Analytics + Avg Working Time Split */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-5 items-start">
                    
                    {/* Left: Shipment analytics with Blue Bar Chart */}
                    <div className="lg:col-span-8 bg-[#fafcff] rounded-2xl border border-blue-50/80 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                          <h3 className="text-xs font-extrabold text-gray-900">Shipment analytics</h3>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-2xs">
                          <span>January 2024 - May 2024</span>
                          <ChevronDown className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Stat Metrics Row */}
                      <div className="flex items-center justify-between text-[10px] pb-3 mb-2 border-b border-gray-100">
                        <div>
                          <span className="text-gray-400">Total deliver: </span>
                          <span className="font-extrabold text-gray-900">352,781</span>
                          <span className="text-emerald-600 font-bold ml-1">▲ 2.84%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">On Delivery: </span>
                          <span className="font-extrabold text-gray-900">2,751</span>
                          <span className="text-emerald-600 font-bold ml-1">▲ 1.48%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Pending: </span>
                          <span className="font-extrabold text-gray-900">246</span>
                          <span className="text-emerald-600 font-bold ml-1">▲ 3.12%</span>
                        </div>
                      </div>

                      {/* Bar Chart with Glowing Active Blue Bar in May */}
                      <div className="relative h-32 sm:h-36 w-full flex items-end justify-between px-2 pt-2">
                        {/* Threshold Line */}
                        <div className="absolute top-10 left-0 right-0 border-b border-dashed border-gray-300 flex justify-end">
                          <span className="text-[8px] bg-white px-1 text-gray-400 font-bold -mt-2">Threshold</span>
                        </div>

                        {[
                          { m: 'Jan', val: 35, active: false },
                          { m: 'Feb', val: 55, active: false },
                          { m: 'Mar', val: 45, active: false },
                          { m: 'Apr', val: 80, active: false },
                          { m: 'May', val: 98, active: true }, // Highlighted Blue Bar
                          { m: 'Jun', val: 65, active: false },
                          { m: 'Jul', val: 50, active: false },
                          { m: 'Aug', val: 75, active: false },
                        ].map((bar, i) => (
                          <div key={i} className="flex flex-col items-center gap-1 z-10 flex-1 max-w-[28px]">
                            <div className="w-full bg-gray-100 rounded-t-md h-24 sm:h-28 flex items-end overflow-hidden p-0.5">
                              <div
                                style={{ height: `${bar.val}%` }}
                                className={`w-full rounded-t-sm ${
                                  bar.active
                                    ? 'bg-blue-600 shadow-[0_0_14px_rgba(37,99,235,0.7)]'
                                    : 'bg-blue-200'
                                }`}
                              />
                            </div>
                            <span className={`text-[9px] font-bold ${bar.active ? 'text-blue-600' : 'text-gray-400'}`}>
                              {bar.m}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Avg. working time Widget */}
                    <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <h4 className="text-xs font-extrabold text-gray-900">Avg. working time</h4>
                        </div>
                        <span className="text-gray-400 text-xs">...</span>
                      </div>

                      <div className="my-2">
                        <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">48.64%</div>
                        <div className="text-[10px] text-emerald-600 font-bold">Completion rate ▲ 2.84%</div>
                      </div>

                      {/* Blue progress pills matching reference */}
                      <div className="flex gap-1 my-3">
                        <div className="w-8 h-4 rounded-full bg-blue-900 text-[8px] text-white flex items-center justify-center font-bold">70%</div>
                        <div className="w-8 h-4 rounded-full bg-blue-600 text-[8px] text-white flex items-center justify-center font-bold">30%</div>
                        <div className="w-8 h-4 rounded-full bg-blue-500" />
                        <div className="w-8 h-4 rounded-full bg-blue-400" />
                      </div>

                      <div className="space-y-2 text-[10px] pt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">🔵 On the way</span>
                          <span className="font-bold text-gray-900">2h 14m</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">🔵 Completing</span>
                          <span className="font-bold text-gray-900">45 minutes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">🔵 Waiting</span>
                          <span className="font-bold text-gray-900">18 minutes</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 text-right">
                        <a href="#features" className="text-[10px] font-bold text-blue-600 hover:underline">
                          View details ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SECTION: "The Data Challenge Every Business Faces" (3-COLUMN CARDS) */}
      {/* ========================================================================= */}
      <section id="why" className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">
                WHY RELINK
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                The Data Challenge Every<br className="hidden sm:inline" /> Business Faces
              </h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-2xl mt-4 font-normal leading-relaxed">
                Turning vast amounts of data into actionable business outcomes is a challenge for every company. Our platform simplifies data processes, enabling faster, smarter decisions.
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
            {/* Card 1: Market Research (White Card) */}
            <div className="relink-card-white p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-xs">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">Market Research</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8">
                  Managing vast amounts of data can be overwhelming, with disconnected sources and complex systems making it challenging to gain a unified view.
                </p>
              </div>

              <div className="bg-[#fafcff] border border-gray-100 rounded-2xl p-4 shadow-xs">
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

            {/* Card 2: Time-Consuming Manual (Vibrant Blue Card) */}
            <div className="relink-card-blue p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center mb-6 shadow-md">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">Time-Consuming Manual</h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed mb-8">
                  Teams often spend hours on manual data processing, slowing down decision-making. We automate these steps, freeing up your time to focus on strategic insights.
                </p>
              </div>

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

            {/* Card 3: Missed Business Insights (White Card) */}
            <div className="relink-card-white p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-xs">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">Missed Business Insights</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8">
                  Without the right tools, crucial trends and opportunities can go unnoticed. Our platform turns raw data into actionable insights.
                </p>
              </div>

              <div className="bg-[#fafcff] border border-gray-100 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-gray-700">
                  <span>Insights Market Growth</span>
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

      {/* ========================================================================= */}
      {/* 3. SECTION: "All the Tools You Need for Powerful Data Analysis" */}
      {/* ========================================================================= */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-[#fafcff] border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4">
              All the Tools You Need for Powerful<br />Data Analysis
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-normal leading-relaxed">
              Get the best value for your money with our tailored pricing options. Whether you need basic features or a fully customized solution, we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Tool 1 */}
            <div className="relink-card-white p-6 sm:p-7 flex flex-col justify-between bg-white">
              <div>
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
                        <span className="text-[10px] font-bold text-gray-600 bg-white px-1.5 py-0.5 rounded shadow-2xs border border-gray-100">
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
                  Leverage cutting-edge AI to uncover hidden patterns and trends in your data, helping you make smarter, data-driven decisions with ease.
                </p>
              </div>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-light w-full text-xs font-bold py-3 min-h-[44px]"
              >
                Get Started
              </Link>
            </div>

            {/* Tool 2 */}
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

                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">Real-Time Data Visualization</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 font-normal">
                  Interact with dynamic charts, graphs, and dashboards that update in real-time, offering instant clarity and actionable insights as your data evolves.
                </p>
              </div>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-blue w-full text-xs font-bold py-3 min-h-[44px]"
              >
                Try for free
              </Link>
            </div>

            {/* Tool 3 */}
            <div className="relink-card-white p-6 sm:p-7 flex flex-col justify-between bg-white">
              <div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 h-48 sm:h-52 flex items-center justify-center relative overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center z-10 shadow-lg border-2 border-white">
                    <Zap className="w-6 h-6 fill-white" />
                  </div>

                  <div className="absolute top-5 left-8 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-[10px] font-bold text-gray-700">
                    EX
                  </div>
                  <div className="absolute top-5 right-8 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-[10px] font-bold text-orange-600">
                    GA
                  </div>
                  <div className="absolute bottom-5 left-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-[10px] font-bold text-emerald-600">
                    TB
                  </div>
                  <div className="absolute bottom-5 right-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-[10px] font-bold text-blue-500">
                    SQL
                  </div>

                  <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-blue-200 stroke-1">
                    <line x1="50%" y1="50%" x2="25%" y2="25%" strokeDasharray="3 3" />
                    <line x1="50%" y1="50%" x2="75%" y2="25%" strokeDasharray="3 3" />
                    <line x1="50%" y1="50%" x2="30%" y2="75%" strokeDasharray="3 3" />
                    <line x1="50%" y1="50%" x2="70%" y2="75%" strokeDasharray="3 3" />
                  </svg>
                </div>

                <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">Easy Integration</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 font-normal">
                  Seamlessly connect with popular tools like Excel, Google Analytics, and more, ensuring smooth data flow across all your favorite platforms.
                </p>
              </div>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-light w-full text-xs font-bold py-3 min-h-[44px]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION: "Choose Your Plan" (PRICING) */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-normal leading-relaxed mb-8">
              Get the best value for your money with our tailored pricing options. Whether you need basic features or a fully customized solution, we&apos;ve got you covered.
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
            {/* Basic */}
            <div className="relink-card-white p-8 sm:p-9 flex flex-col justify-between bg-white">
              <div>
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center mb-4">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-1">Basic</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Ideal for solo analysts and growing teams looking to explore data trends.
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
                    <span>Unlimited data uploads</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Top-level security</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Community access</span>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href="/signup"
                  className="relink-pill-btn relink-btn-light w-full text-xs font-bold py-3.5 min-h-[44px]"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Pro */}
            <div className="relink-card-white p-8 sm:p-9 flex flex-col justify-between bg-white border-2 border-blue-600 shadow-[0_12px_40px_rgba(37,99,235,0.15)] relative">
              <div className="absolute -top-3.5 right-8 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3.5 py-1 rounded-full tracking-wider shadow-sm">
                Most Popular
              </div>

              <div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-1">Pro</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Dedicated solution for fast-growing agencies needing deep customized pipelines.
                </p>

                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-gray-100">
                  <span className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                    ${Math.round(269 * discountMultiplier)}
                  </span>
                  <span className="text-xs font-bold text-gray-400">/ Per month</span>
                </div>

                <div className="space-y-3.5 mb-8 text-xs font-medium text-gray-700">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span className="font-bold text-gray-900">Unlimited data</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span className="font-bold text-gray-900">Advanced + Custom AI Models</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Dedicated account manager</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Custom integrations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Enterprise-level security</span>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href="/signup"
                  className="relink-pill-btn relink-btn-blue w-full text-xs font-bold py-3.5 min-h-[44px]"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION: ANTIMETAL 3D THREE.JS ARCHITECTURE & WORLD MODEL */}
      {/* ========================================================================= */}
      <AntimetalArchitecture3D />

      {/* ========================================================================= */}
      {/* 6. SECTION: "Frequently Asked Questions" */}
      {/* ========================================================================= */}
      <section id="faq" className="py-24 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Frequently Asked a<br />Questions
              </h2>

              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-blue text-xs font-bold inline-flex min-h-[44px]"
              >
                Contact us
              </Link>

              <div className="bg-[#f8fafc] border border-gray-200/80 rounded-3xl p-6 sm:p-7 space-y-5 text-xs text-gray-600 mt-6 shadow-xs">
                <div>
                  <div className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Location</div>
                  <div className="font-bold text-gray-900 text-sm">75 9A Queenswood Blvd, Queens, NY, United States</div>
                </div>
                <div>
                  <div className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Phone</div>
                  <div className="font-bold text-gray-900 text-sm">+1 845-555-7382</div>
                </div>
                <div>
                  <div className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Email</div>
                  <div className="font-bold text-gray-900 text-sm">contact@relink.study</div>
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

      {/* ========================================================================= */}
      {/* 7. SECTION: "Join Us Our Newsletter" */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[2.2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-[#38bdf8] via-[#0284c7] to-[#0369a1] text-white shadow-2xl overflow-hidden border border-sky-300/40">
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-200/20 rounded-full blur-3xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-7">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4 drop-shadow-xs">
                  Join Us Our Newsletter
                </h2>
                
                <p className="text-sky-50 text-sm sm:text-base max-w-xl font-medium leading-relaxed mb-8">
                  Turning data into insights is a challenge for every business. Our platform simplifies data processes, enabling faster, smarter decisions.
                </p>

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
                    className="px-5 py-3.5 rounded-full bg-white text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-sky-300 flex-grow shadow-lg min-h-[46px]"
                  />
                  <button
                    type="submit"
                    className="relink-pill-btn bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-7 py-3.5 shadow-xl whitespace-nowrap min-h-[46px] transition-all"
                  >
                    {subscribed ? 'Subscribed!' : 'Contact us'}
                  </button>
                </form>

                <div className="space-y-2.5 text-xs font-semibold text-sky-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-200" />
                    <span>Market Research — 75 9A Queenswood Blvd, Queens, NY, United States</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                    <span>Investment Analytics — 99.4% Automated Outreach Delivery</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="bg-white rounded-3xl p-6 sm:p-7 text-gray-900 border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.25)] w-full max-w-sm">
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
                    className="block w-full text-center py-3.5 rounded-full bg-[#0a0f1d] hover:bg-black text-white text-xs font-bold shadow-lg transition-all min-h-[44px] flex items-center justify-center mt-2"
                  >
                    Start Free 14-Day Trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER */}
      {/* ========================================================================= */}
      <footer className="py-16 px-4 sm:px-6 bg-white border-t border-gray-100 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-gray-100">
            <div className="md:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  <div className="w-2 h-4 bg-blue-600 rounded-full" />
                  <div className="w-2 h-4 bg-blue-500 rounded-full" />
                  <div className="w-2 h-4 bg-sky-400 rounded-full" />
                </div>
                <span className="font-extrabold text-lg tracking-tight text-gray-900">
                  Relink.
                </span>
              </Link>
              <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
                Effortlessly analyze large datasets, uncover trends, and make better decisions in minutes.
              </p>
            </div>

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
            <div>© {new Date().getFullYear()} Relink Inc. All rights reserved.</div>
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
