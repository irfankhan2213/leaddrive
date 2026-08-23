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
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const discountMultiplier = billingCycle === 'annual' ? 0.8 : 1;

  const faqs = [
    {
      q: 'How does LeadDrive generate custom website demos for cold prospects?',
      a: 'LeadDrive integrates directly with high-performance AI engines. When a prospect is qualified, our agents scrape their existing branding, diagnose flaws in their current web design, and synthesize a complete, interactive, mobile-responsive prototype that you can link directly in your cold outreach.',
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
    <div className="min-h-screen text-[#1a1a1a] bg-[#fafafa] font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 z-50 px-6 py-4 w-full bg-white/70 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] group-hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] transition-all duration-300">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              LeadDrive
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
            <a href="#platform" className="hover:text-black transition-colors">Platform</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-600 hover:text-black transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-black text-white hover:bg-gray-800 text-sm font-semibold px-5 py-2.5 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all duration-200"
            >
              Start Free Trial
            </Link>
          </div>

          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-black/[0.04] p-6 flex flex-col gap-4 shadow-xl md:hidden">
            <a href="#platform" className="text-lg font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Platform</a>
            <a href="#pricing" className="text-lg font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
            <a href="#faq" className="text-lg font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
            <hr className="border-gray-100 my-2" />
            <Link href="/login" className="text-lg font-semibold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
            <Link href="/signup" className="bg-blue-600 text-white text-center font-semibold px-5 py-3 rounded-xl mt-2" onClick={() => setIsMobileMenuOpen(false)}>Start Free Trial</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 flex-grow">
        {/* Subtle background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-semibold text-gray-700">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Meet LeadDrive 2.0
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight text-gray-900 leading-[1.05] mb-8">
            Autopilot your outreach.<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Close more deals.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            Discover verified leads, diagnose website bottlenecks, synthesize bespoke interactive demos, and fire personalized multichannel outreach—all from a single clean dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/signup" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-8 py-4 rounded-full shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-semibold text-base px-8 py-4 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center hover:-translate-y-0.5">
              Book a Demo
            </Link>
          </div>

          {/* Hero Dashboard Image */}
          <div className="relative mx-auto max-w-5xl rounded-[2rem] p-3 bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.03]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent z-10 top-[85%] pointer-events-none" />
            <div className="relative rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-sm bg-gray-50 aspect-[16/10] sm:aspect-[16/9]">
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
      </section>

      {/* Platform Capabilities (Clean Grid) */}
      <section id="platform" className="py-24 md:py-32 px-6 bg-white border-t border-black/[0.03]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
              A workspace designed for scale.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed font-medium">
              Every step is managed autonomously by specialized background AI agents. We handle the heavy lifting so you can focus on closing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-[#fafafa] border border-black/[0.04] rounded-3xl p-8 sm:p-10 flex flex-col h-full transition-shadow hover:shadow-lg hover:shadow-black/[0.03]">
              <div className="w-12 h-12 rounded-xl bg-blue-100/50 text-blue-600 flex items-center justify-center mb-8 border border-blue-100">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Multi-Vector Discovery</h3>
              <p className="text-gray-500 leading-relaxed mb-8">
                Target high-value businesses by niche and geolocation. LeadDrive orchestrates parallel scrapers across Google Maps, Apollo.io, LinkedIn, and CSV spreadsheets.
              </p>
              <div className="mt-auto pt-6 border-t border-black/[0.04] font-mono text-xs font-semibold text-gray-400">
                MAPS · APOLLO · LINKEDIN
              </div>
            </div>

            <div className="bg-[#fafafa] border border-black/[0.04] rounded-3xl p-8 sm:p-10 flex flex-col h-full transition-shadow hover:shadow-lg hover:shadow-black/[0.03]">
              <div className="w-12 h-12 rounded-xl bg-amber-100/50 text-amber-600 flex items-center justify-center mb-8 border border-amber-100">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Technical Site Diagnostic</h3>
              <p className="text-gray-500 leading-relaxed mb-8">
                Our headless bots test each prospect's site for mobile responsiveness, load speeds, missing meta tags, and broken layouts—giving you undeniable proof in your pitch.
              </p>
              <div className="mt-auto pt-6 border-t border-black/[0.04] font-mono text-xs font-semibold text-gray-400">
                LIGHTHOUSE · UX AUDIT · CORE VITALS
              </div>
            </div>

            <div className="bg-[#fafafa] border border-black/[0.04] rounded-3xl p-8 sm:p-10 flex flex-col h-full md:col-span-2 relative overflow-hidden transition-shadow hover:shadow-lg hover:shadow-black/[0.03]">
              <div className="relative z-10 md:w-1/2 md:pr-10">
                <div className="w-12 h-12 rounded-xl bg-purple-100/50 text-purple-600 flex items-center justify-center mb-8 border border-purple-100">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">AI Demo Synthesis Lab</h3>
                <p className="text-gray-500 leading-relaxed mb-8">
                  Synthesize complete, interactive, mobile-responsive website redesigns. Send prospects a personalized working demo before you even hop on a call to immediately establish trust and authority.
                </p>
                <div className="mt-auto pt-6 border-t border-black/[0.04] font-mono text-xs font-semibold text-gray-400">
                  VERTEX AI · V0 · AGENTIC BUILDER
                </div>
              </div>
              
              {/* Secondary screenshot for the feature */}
              <div className="hidden md:block absolute right-0 top-0 w-[55%] h-full">
                <div className="absolute top-10 right-[-10%] w-[120%] h-[120%] rounded-tl-2xl overflow-hidden border-t border-l border-gray-200 shadow-2xl bg-white transition-transform hover:-translate-x-2 hover:-translate-y-2 duration-500">
                  <Image 
                     src="/dashboard-3.png" 
                     alt="Demo Synthesis" 
                     fill 
                     className="object-cover object-left-top"
                  />
                </div>
              </div>
            </div>
            
             <div className="bg-[#fafafa] border border-black/[0.04] rounded-3xl p-8 sm:p-10 flex flex-col h-full md:col-span-2 transition-shadow hover:shadow-lg hover:shadow-black/[0.03]">
              <div className="w-12 h-12 rounded-xl bg-emerald-100/50 text-emerald-600 flex items-center justify-center mb-8 border border-emerald-100">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Multichannel Dispatch & Telemetry</h3>
              <p className="text-gray-500 leading-relaxed mb-8 max-w-3xl">
                Deliver personalized emails and SMS embedded with the custom demo link. Get real-time notifications the exact second a prospect views the demo, enabling instant high-intent follow-up. Integrated directly with SendGrid, Resend, and your existing CRM via webhooks.
              </p>
              <div className="mt-auto pt-6 border-t border-black/[0.04] font-mono text-xs font-semibold text-gray-400">
                EMAIL · SMS · WEBHOOKS · TRACKING
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Light Theme only) */}
      <section id="pricing" className="py-24 md:py-32 px-6 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
              Simple, transparent pricing.
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 font-medium">
              14-day free trial on all plans. Scale your agency with automated intelligence.
            </p>
            
            <div className="inline-flex items-center bg-white p-1.5 rounded-full border border-black/[0.08] shadow-sm">
               <button
                 onClick={() => setBillingCycle('monthly')}
                 className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                   billingCycle === 'monthly'
                     ? 'bg-gray-100 text-gray-900 shadow-inner'
                     : 'text-gray-500 hover:text-gray-900'
                 }`}
               >
                 Monthly
               </button>
               <button
                 onClick={() => setBillingCycle('annual')}
                 className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                   billingCycle === 'annual'
                     ? 'bg-gray-100 text-gray-900 shadow-inner'
                     : 'text-gray-500 hover:text-gray-900'
                 }`}
               >
                 <span>Annual</span>
                 <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold tracking-wide uppercase">
                   Save 20%
                 </span>
               </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
             {/* Starter */}
             <div className="bg-white border border-black/[0.08] rounded-3xl p-8 flex flex-col shadow-sm">
                <h3 className="font-bold text-gray-500 text-sm tracking-widest uppercase mb-4">Starter</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-extrabold text-gray-900">${Math.round(49 * discountMultiplier)}</span>
                  <span className="text-gray-500 font-medium text-base">/ mo</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 h-10">
                  For solo founders launching outbound campaigns.
                </p>
                
                <div className="space-y-4 mb-10 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600" /> 500 Qualified Leads / mo</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600" /> 100 AI Demos Synthesized</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Maps & Apollo Scraper</div>
                </div>
                
                <Link href="/signup" className="mt-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-xl text-center transition-colors">
                  Start Free Trial
                </Link>
             </div>
             
             {/* Pro */}
             <div className="bg-white border-2 border-blue-600 rounded-3xl p-8 flex flex-col shadow-xl relative z-10 scale-100 lg:scale-105">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full font-bold text-[10px] tracking-widest uppercase shadow-sm">
                  Most Popular
                </div>
                <h3 className="font-bold text-blue-600 text-sm tracking-widest uppercase mb-4">Growth Pro</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-extrabold text-gray-900">${Math.round(149 * discountMultiplier)}</span>
                  <span className="text-gray-500 font-medium text-base">/ mo</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 h-10">
                  For scaling agencies needing high volume pipelines.
                </p>
                
                <div className="space-y-4 mb-10 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600" /> 2,500 Qualified Leads / mo</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600" /> 500 AI Demos Synthesized</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Multichannel Dispatch</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600" /> CRM Webhooks</div>
                </div>
                
                <Link href="/signup" className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-center shadow-md transition-colors">
                  Start Free Trial
                </Link>
             </div>
             
             {/* Scale */}
             <div className="bg-white border border-black/[0.08] rounded-3xl p-8 flex flex-col shadow-sm">
                <h3 className="font-bold text-gray-500 text-sm tracking-widest uppercase mb-4">Agency Scale</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-extrabold text-gray-900">${Math.round(399 * discountMultiplier)}</span>
                  <span className="text-gray-500 font-medium text-base">/ mo</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 h-10">
                  Maximum throughput and white-labeled custom domains.
                </p>
                
                <div className="space-y-4 mb-10 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Unlimited Lead Discovery</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600" /> 2,000 AI Demos / mo</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Custom Domain Hosting</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Dedicated IPs</div>
                </div>
                
                <Link href="/signup" className="mt-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-xl text-center transition-colors">
                  Contact Sales
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 md:py-32 px-6 bg-white border-t border-black/[0.03]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-[#fafafa] border border-black/[0.04] rounded-2xl overflow-hidden transition-colors hover:bg-gray-50">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-gray-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-black' : ''}`} />
                  </button>
                  <div 
                    className={`px-6 text-sm text-gray-600 font-medium leading-relaxed transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
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

      {/* Bottom CTA (Light Theme) */}
      <section className="py-24 md:py-32 px-6 bg-[#fafafa] border-t border-black/[0.03]">
        <div className="max-w-4xl mx-auto text-center bg-white border border-black/[0.08] shadow-xl shadow-black/[0.02] rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            Ready to scale your outreach?
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto font-medium">
            Join hundreds of leading agencies using LeadDrive to automate their prospecting and demo creation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-8 py-4 rounded-full shadow-md transition-all duration-200">
              Start 14-Day Free Trial
            </Link>
            <Link href="/login" className="w-full sm:w-auto bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 font-semibold text-base px-8 py-4 rounded-full shadow-sm transition-all duration-200">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (Light Theme) */}
      <footer className="py-12 px-6 bg-white border-t border-black/[0.05] text-sm font-medium text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-bold text-gray-900 text-base tracking-tight">LeadDrive</span>
            <span className="hidden md:inline text-gray-400 mx-2">|</span>
            <span className="hidden md:inline">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <a href="#platform" className="hover:text-gray-900 transition-colors">Platform</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
            <Link href="/login" className="hover:text-gray-900 transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-gray-900 transition-colors">Start Free Trial</Link>
          </div>
          
          <div className="md:hidden mt-2">
             <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
