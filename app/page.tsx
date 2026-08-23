'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe,
  Mail,
  BarChart3,
  ChevronDown,
} from 'lucide-react';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
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
  ];

  return (
    <div className="min-h-screen text-[#111827] octo-canvas font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 w-full bg-[#fbfbfd]/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-gray-900">
              LeadDrive
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#platform" className="hover:text-black transition-colors">Platform</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-bold text-gray-700 hover:text-black px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="octo-pill-btn octo-pill-dark !py-2 !px-4 !text-xs"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden octo-grid-bg flex-grow">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className="octo-hud-badge text-blue-700 border-blue-200 bg-blue-50/50">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              LEADDRIVE V2 · LIVE
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-[#111827] leading-[0.95] mb-8">
            Making Outreach Intelligence <br className="hidden md:block" />
            <span className="text-blue-600 relative inline-block">
              Infinitely Scalable.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
            Discover verified leads, diagnose website bottlenecks, synthesize bespoke interactive demos, and fire personalized multichannel outreach.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup" className="octo-pill-btn octo-pill-dark w-full sm:w-auto text-base px-8 py-4">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="octo-pill-btn octo-pill-light w-full sm:w-auto text-base px-8 py-4">
              Book a Demo
            </Link>
          </div>

          {/* Hero Dashboard Image */}
          <div className="relative mx-auto max-w-5xl group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-t from-[#fbfbfd] via-transparent to-transparent z-10 top-3/4 pointer-events-none" />
            <div className="octo-card p-2 sm:p-4 bg-white/60 backdrop-blur-xl border-black/10 shadow-2xl relative transition-transform duration-700 ease-out hover:scale-[1.02]">
               <div className="flex items-center gap-2 mb-3 px-2">
                 <div className="w-3 h-3 rounded-full bg-red-400" />
                 <div className="w-3 h-3 rounded-full bg-amber-400" />
                 <div className="w-3 h-3 rounded-full bg-emerald-400" />
               </div>
               <div className="relative rounded-xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50 aspect-[16/10]">
                 {/* Real screenshot from public/dashboard-2.png */}
                 <Image 
                    src="/dashboard-2.png" 
                    alt="LeadDrive Dashboard" 
                    fill 
                    className="object-cover object-top"
                    priority
                 />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities (Bento) */}
      <section id="platform" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
              The Engine.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
              Every step is managed autonomously by specialized background AI agents with real-time telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="octo-card p-8 sm:p-10 flex flex-col h-full bg-gray-50/50">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-sm border border-blue-200">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-4">Multi-Vector Discovery</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-8">
                Target high-value businesses by niche and geolocation. LeadDrive orchestrates parallel scrapers across Google Maps, Apollo.io, LinkedIn, and CSV spreadsheets with automatic enrichment.
              </p>
              <div className="mt-auto pt-6 border-t border-gray-200/60 font-mono text-xs font-bold text-gray-400">
                MAPS · APOLLO · LINKEDIN
              </div>
            </div>

            <div className="octo-card p-8 sm:p-10 flex flex-col h-full bg-gray-50/50">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 shadow-sm border border-amber-200">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-4">Technical Site Diagnostic</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-8">
                Our headless bots test each prospect&apos;s site for mobile responsiveness, load speeds, missing meta tags, and broken layouts—giving you undeniable proof in your outreach.
              </p>
              <div className="mt-auto pt-6 border-t border-gray-200/60 font-mono text-xs font-bold text-gray-400">
                LIGHTHOUSE · UX AUDIT · CORE VITALS
              </div>
            </div>

            <div className="octo-card p-8 sm:p-10 flex flex-col h-full bg-gray-50/50 md:col-span-2 relative overflow-hidden">
              <div className="relative z-10 md:w-1/2">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 shadow-sm border border-purple-200">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-4">AI Demo Synthesis Lab</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-8 pr-4">
                  Synthesize complete, interactive, mobile-responsive website redesigns using v0, Vertex AI, and our Agentic builder. Send prospects a personalized working demo before you even hop on a call.
                </p>
                <div className="mt-auto pt-6 border-t border-gray-200/60 font-mono text-xs font-bold text-gray-400">
                  VERTEX · V0 · AGENTIC BUILDER
                </div>
              </div>
              
              {/* Secondary screenshot for the feature */}
              <div className="hidden md:block absolute right-0 top-0 w-1/2 h-full p-8">
                <div className="w-full h-full relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xl rotate-3 translate-y-4 hover:rotate-0 transition-transform duration-500 bg-white">
                  <Image 
                     src="/dashboard-3.png" 
                     alt="Demo Synthesis" 
                     fill 
                     className="object-cover object-left-top"
                  />
                </div>
              </div>
            </div>
            
             <div className="octo-card p-8 sm:p-10 flex flex-col h-full bg-gray-50/50 md:col-span-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-sm border border-emerald-200">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-4">Multichannel Dispatch & Telemetry</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-8 max-w-3xl">
                Deliver personalized emails and SMS embedded with the custom demo link. Get real-time notifications the exact second a prospect views the demo, enabling instant high-intent follow-up. Integrated directly with SendGrid, Resend, and your existing CRM via webhooks.
              </p>
              <div className="mt-auto pt-6 border-t border-gray-200/60 font-mono text-xs font-bold text-gray-400">
                EMAIL · SMS · WEBHOOKS · TRACKING
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-[#fbfbfd] border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
              Predictable Pricing.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              14-day trial on all plans. Scale your agency with automated intelligence.
            </p>
            
            <div className="inline-flex items-center bg-gray-200/50 p-1.5 rounded-full border border-black/5">
               <button
                 onClick={() => setBillingCycle('monthly')}
                 className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                   billingCycle === 'monthly'
                     ? 'bg-white text-black shadow-sm'
                     : 'text-gray-500 hover:text-gray-900'
                 }`}
               >
                 Monthly
               </button>
               <button
                 onClick={() => setBillingCycle('annual')}
                 className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                   billingCycle === 'annual'
                     ? 'bg-white text-black shadow-sm'
                     : 'text-gray-500 hover:text-gray-900'
                 }`}
               >
                 <span>Annual</span>
                 <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold tracking-wide">
                   SAVE 20%
                 </span>
               </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {/* Starter */}
             <div className="octo-card p-8 flex flex-col bg-white">
                <h3 className="font-bold text-gray-500 text-sm tracking-wide uppercase mb-4">Starter</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-extrabold text-gray-900">${Math.round(49 * discountMultiplier)}</span>
                  <span className="text-gray-500 font-semibold text-sm">/ mo</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  For solo founders launching outbound campaigns.
                </p>
                
                <div className="space-y-4 mb-10 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> 500 Qualified Leads / mo</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> 100 AI Demos Synthesized</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Maps & Apollo Scraper</div>
                </div>
                
                <Link href="/signup" className="mt-auto octo-pill-btn octo-pill-light w-full">
                  Start Trial
                </Link>
             </div>
             
             {/* Pro */}
             <div className="octo-card p-8 flex flex-col bg-gray-900 text-white border-black scale-105 shadow-2xl relative z-10">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-full font-bold text-[10px] tracking-widest uppercase shadow-sm">
                  Most Popular
                </div>
                <h3 className="font-bold text-gray-400 text-sm tracking-wide uppercase mb-4">Growth Pro</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-extrabold text-white">${Math.round(149 * discountMultiplier)}</span>
                  <span className="text-gray-400 font-semibold text-sm">/ mo</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-8">
                  For scaling agencies needing high volume pipelines.
                </p>
                
                <div className="space-y-4 mb-10 text-sm font-medium text-gray-200">
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> 2,500 Qualified Leads / mo</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> 500 AI Demos Synthesized</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Multichannel Dispatch</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> CRM Webhooks</div>
                </div>
                
                <Link href="/signup" className="mt-auto octo-pill-btn bg-white text-black hover:bg-gray-100 border border-white w-full">
                  Start Trial
                </Link>
             </div>
             
             {/* Scale */}
             <div className="octo-card p-8 flex flex-col bg-white">
                <h3 className="font-bold text-gray-500 text-sm tracking-wide uppercase mb-4">Agency Scale</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-extrabold text-gray-900">${Math.round(399 * discountMultiplier)}</span>
                  <span className="text-gray-500 font-semibold text-sm">/ mo</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Maximum throughput and white-labeled custom domains.
                </p>
                
                <div className="space-y-4 mb-10 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Unlimited Lead Discovery</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> 2,000 AI Demos / mo</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Custom Domain Hosting</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Dedicated IPs</div>
                </div>
                
                <Link href="/signup" className="mt-auto octo-pill-btn octo-pill-light w-full">
                  Contact Sales
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Questions & Answers
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="octo-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-gray-900 hover:bg-gray-50/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-black' : ''}`} />
                  </button>
                  <div 
                    className={`px-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-96 py-6 opacity-100' : 'max-h-0 py-0 opacity-0 border-transparent'
                    }`}
                  >
                    {faq.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 bg-[#111827] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">
            Start automating high-converting outreach today.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="octo-pill-btn bg-white text-black hover:bg-gray-100 text-base px-10 py-4 w-full sm:w-auto">
              Start 14-Day Free Trial
            </Link>
            <Link href="/login" className="octo-pill-btn octo-pill-dark border border-white/20 hover:border-white/40 hover:bg-white/10 text-base px-10 py-4 w-full sm:w-auto">
              Sign In to Console
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-white border-t border-gray-100 text-sm font-medium text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center">
              <Zap className="w-3 h-3" />
            </div>
            <span className="font-bold text-gray-900">LeadDrive</span>
            <span className="hidden sm:inline">· © {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#platform" className="hover:text-black transition-colors">Platform</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
            <Link href="/login" className="hover:text-black transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
