'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe,
  Mail,
  BarChart3,
  ChevronDown,
  Play,
  RotateCw,
  Search,
  Check,
  Building,
  Target,
  Database,
  Code2
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
  const [activeSimTab, setActiveSimTab] = useState<'preview' | 'email'>('preview');

  const discountMultiplier = billingCycle === 'annual' ? 0.8 : 1;

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
    }
  ];

  return (
    <div className="dark-canvas bg-grid-dark min-h-screen flex flex-col justify-between selection:bg-blue-500/30">
      
      {/* Background Glows */}
      <div className="glow-orb top-[-200px] left-1/2 -translate-x-1/2" />
      <div className="glow-orb bottom-1/4 right-[-400px] bg-purple-500/10" />

      {/* Floating Glass Navigation Bar */}
      <header className="sticky top-6 z-50 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-nav rounded-full px-5 py-3 flex items-center justify-between"
        >
          {/* Brand Mark */}
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.8)] transition-all">
              <Zap className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-lg tracking-tight text-white">
              LeadDrive
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#simulator" className="hover:text-white transition-colors">Simulator</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          {/* Auth CTA Actions */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white hidden sm:block">
              Log in
            </Link>
            <Link
              href="/signup"
              className="btn-primary-glow px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5"
            >
              Start Free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-8 max-w-5xl mx-auto w-full text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center mb-8"
        >
          <div className="bg-slate-900/50 border border-slate-700 rounded-full px-4 py-1.5 text-xs font-bold text-slate-300 flex items-center gap-2 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            Agentic AI Meets Outbound Sales
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-[1.05] mb-8"
        >
          Close deals with <br />
          <span className="text-gradient-primary">Proof, not Promises.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
        >
          LeadDrive discovers qualified businesses, diagnoses website bottlenecks, and generates custom interactive web demos before firing precision multichannel campaigns.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link
            href="/signup"
            className="btn-primary-glow text-base px-8 py-4 rounded-xl font-bold w-full sm:w-auto flex items-center justify-center gap-2"
          >
            Launch Free Campaign <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#simulator"
            className="btn-secondary-dark text-base px-8 py-4 rounded-xl font-bold w-full sm:w-auto flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            Test Live Simulator <Play className="w-4 h-4 text-blue-400" />
          </a>
        </motion.div>

        {/* Product Simulator Browser Window */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          id="simulator" 
          className="browser-chrome-dark text-left max-w-4xl mx-auto mt-8 animate-float relative z-20"
        >
          <div className="browser-chrome-header-dark">
            <div className="browser-dot bg-red-500/80" />
            <div className="browser-dot bg-amber-500/80" />
            <div className="browser-dot bg-emerald-500/80" />
            <div className="ml-4 bg-black/40 border border-white/5 rounded-md px-3 py-1 text-[10px] font-mono text-slate-500 flex-1 flex items-center gap-2 max-w-sm mx-auto justify-center">
              <Search className="w-3 h-3 text-slate-500" /> demo.leaddrive.app/simulator
            </div>
          </div>
          
          <div className="p-5 sm:p-8 bg-[#0a0a0a] border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
               <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-blue-400" /> Agent Synthesis Simulator
               </h3>
               <p className="text-xs text-slate-400 mt-1 font-medium">Select a prospect to trigger the live diagnostic and build engine.</p>
             </div>
             <div className="flex flex-wrap items-center gap-2">
                {SAMPLE_PROSPECTS.map((p) => {
                  const isSelected = selectedProspect.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => runSimulation(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                          : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {p.name.split(' ')[0]}
                    </button>
                  );
                })}
             </div>
          </div>

          <div className="p-5 sm:p-8 bg-[#050505] relative overflow-hidden">
             {/* Glowing background in simulator body */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />

             {/* Progress Bar during Simulation */}
            <div className="mb-6 relative z-10">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2 font-mono">
                <span className="flex items-center gap-2">
                  {simState === 'scraping' && 'Step 1/3: Scraping Apollo & Maps...'}
                  {simState === 'auditing' && 'Step 2/3: Running Headless Lighthouse Audit...'}
                  {simState === 'synthesizing' && 'Step 3/3: Synthesizing Prototype via Vertex AI...'}
                  {simState === 'ready' && <><Check className="w-3 h-3 text-emerald-400" /> Autonomous Synthesis Complete</>}
                </span>
                <span className="text-blue-400">{simProgress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                  style={{ width: `${simProgress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {/* Profile Card */}
              <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col justify-between backdrop-blur-sm">
                <div>
                   <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-3">Prospect Profile</div>
                   <div className="font-extrabold text-xl text-white mb-1">{selectedProspect.name}</div>
                   <div className="text-xs text-slate-400 font-mono mb-4">{selectedProspect.domain}</div>
                   
                   <div className="space-y-4 pt-4 border-t border-white/5">
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 mb-1.5">Speed Diagnostic</div>
                        <div className="flex items-center gap-2">
                           <span className="px-2 py-0.5 rounded text-red-400 bg-red-950/50 border border-red-900/50 font-bold text-xs font-mono">
                             {selectedProspect.speedScore} / 100
                           </span>
                           <span className="text-xs font-semibold text-red-400">Critical</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 mb-1.5">Diagnosed Weakness</div>
                        <div className="text-xs text-slate-300 bg-black/40 p-2.5 rounded-lg border border-white/5 font-medium">
                          "{selectedProspect.weakness}"
                        </div>
                      </div>
                   </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Fit: <span className="text-emerald-400">96%</span></span>
                  <button onClick={() => runSimulation(selectedProspect)} className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    <RotateCw className="w-3 h-3" /> Re-run
                  </button>
                </div>
              </div>

              {/* Angle/Email Preview */}
              <div className="bg-black/80 border border-white/10 p-5 rounded-xl text-slate-300 font-mono text-xs flex flex-col justify-between shadow-inner">
                 <div>
                   <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">// Outreach Draft</span>
                     <div className="flex gap-2">
                        <button onClick={() => setActiveSimTab('preview')} className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${activeSimTab === 'preview' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>Demo</button>
                        <button onClick={() => setActiveSimTab('email')} className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${activeSimTab === 'email' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>Email</button>
                     </div>
                   </div>

                   {activeSimTab === 'preview' && (
                     <div className="space-y-4">
                       <div>
                         <div className="text-slate-500 mb-1">Generated Prototype URL:</div>
                         <a href="#" className="text-blue-400 underline decoration-blue-500/30 underline-offset-2">demo.leaddrive.app/{selectedProspect.id}</a>
                       </div>
                       <div>
                         <div className="text-slate-500 mb-1">Value Prop:</div>
                         <div className="text-slate-200">{selectedProspect.demoAngle}</div>
                       </div>
                       <div className="grid grid-cols-2 gap-3 mt-4">
                         <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                           <div className="text-[10px] text-slate-500">Mobile Score</div>
                           <div className="text-emerald-400 font-bold mt-1 shadow-[0_0_10px_rgba(52,211,153,0.2)] inline-block">100 / 100</div>
                         </div>
                         <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                           <div className="text-[10px] text-slate-500">Load Time</div>
                           <div className="text-emerald-400 font-bold mt-1">0.3s</div>
                         </div>
                       </div>
                     </div>
                   )}

                   {activeSimTab === 'email' && (
                     <div className="space-y-3 leading-relaxed">
                       <div><span className="text-slate-500">Subject:</span> Quick question regarding {selectedProspect.domain} speed</div>
                       <div className="pt-2 text-slate-400">
                         Hi team,<br/><br/>
                         Ran an audit on your site and noticed {selectedProspect.weakness.toLowerCase()}.<br/><br/>
                         We went ahead and built a functioning Next.js mockup to show how it should work: <span className="text-blue-400">demo.leaddrive.app/{selectedProspect.id}</span><br/><br/>
                         Open to a 5-min walk-through?
                       </div>
                     </div>
                   )}
                 </div>
                 
                 <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 flex items-center justify-between">
                   <span>Status: Ready for Dispatch</span>
                   <span className="flex items-center gap-1 text-emerald-400"><Check className="w-3 h-3" /> Validated</span>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-12 border-y border-white/5 bg-[#030303] relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-8">Powering outreach for top B2B agencies</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 hover:opacity-100 transition-opacity duration-500">
             <div className="flex items-center gap-2 font-bold text-xl text-slate-300"><Building className="w-6 h-6"/> AcmeCorp</div>
             <div className="flex items-center gap-2 font-bold text-xl text-slate-300"><Target className="w-6 h-6"/> Zenith Media</div>
             <div className="flex items-center gap-2 font-bold text-xl text-slate-300"><Globe className="w-6 h-6"/> Global Reach</div>
             <div className="flex items-center gap-2 font-bold text-xl text-slate-300"><Code2 className="w-6 h-6"/> DevStudio</div>
          </div>
        </div>
      </section>

      {/* Bento Box Capabilities Grid */}
      <section id="capabilities" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            Everything you need. <span className="text-slate-500">In one platform.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Card 1: Wide */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bento-card-dark md:col-span-2 p-8 flex flex-col justify-between group"
          >
            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-colors duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-900/40 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-2xl text-white mb-3">Automated Discovery</h3>
              <p className="text-slate-400 font-medium max-w-md">
                Scrape Google Maps and Apollo with deep contact enrichment and location-based semantic keyword clustering. Build verified lists instantly.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Square */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bento-card-dark p-8 flex flex-col justify-between group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-amber-900/30 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/20">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-xl text-white mb-3">Lighthouse Audits</h3>
              <p className="text-sm text-slate-400 font-medium">
                Run automated PageSpeed, mobile responsiveness, and SEO checks to identify concrete leverage for outreach.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Square */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bento-card-dark p-8 flex flex-col justify-between group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/30 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-xl text-white mb-3">Smart Dispatch</h3>
              <p className="text-sm text-slate-400 font-medium">
                Send tailored email and SMS sequences with real-time open and click telemetry directly to Slack.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Wide */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bento-card-dark md:col-span-2 p-8 flex flex-col justify-between group"
          >
            <div className="absolute left-0 bottom-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] group-hover:bg-purple-600/20 transition-colors duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-900/30 text-purple-400 flex items-center justify-center mb-6 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-2xl text-white mb-3">AI Demo Synthesis</h3>
              <p className="text-slate-400 font-medium max-w-md">
                Build bespoke interactive prototypes in seconds using Vertex AI and v0 models with live hosted demo URLs on our edge network. Show, don't tell.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SaaS Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-8">
            Predictable Pricing.
          </h2>
          
          {/* Billing Switch */}
          <div className="inline-flex items-center bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white/10 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-white/10 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual</span>
              <span className="bg-blue-900/50 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wide border border-blue-500/30">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Starter */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bento-card-dark p-8 flex flex-col justify-between"
          >
            <div>
              <div className="text-slate-400 font-bold mb-4">Starter</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-white">${Math.round(49 * discountMultiplier)}</span>
                <span className="text-sm text-slate-500 font-semibold">/mo</span>
              </div>
              <p className="text-sm text-slate-400 font-medium mb-8">
                Ideal for solo agency founders launching outbound campaigns.
              </p>
              <div className="space-y-4 text-sm font-semibold text-slate-300">
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-slate-600" /> 500 Leads / mo</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-slate-600" /> 100 AI Demos</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-slate-600" /> Maps & Apollo Scraper</div>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/signup" className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-center py-3 rounded-xl font-bold transition-colors">
                Start Free Trial
              </Link>
            </div>
          </motion.div>

          {/* Pro */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bento-card-dark p-8 flex flex-col justify-between border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.15)] relative overflow-hidden transform md:-translate-y-4 bg-blue-950/20"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <div className="text-blue-400 font-bold">Growth Pro</div>
                <div className="text-[10px] font-black tracking-widest uppercase bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">Popular</div>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-white">${Math.round(149 * discountMultiplier)}</span>
                <span className="text-sm text-blue-200/50 font-semibold">/mo</span>
              </div>
              <p className="text-sm text-slate-300 font-medium mb-8">
                For scaling agencies needing high volume lead ingestion.
              </p>
              <div className="space-y-4 text-sm font-semibold text-slate-200">
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> 2,500 Leads / mo</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> 500 AI Demos</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Vertex AI + v0 Hybrid</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Webhook Sync</div>
              </div>
            </div>
            <div className="mt-8 relative z-10">
              <Link href="/signup" className="btn-primary-glow block w-full text-center py-3 rounded-xl font-bold transition-all">
                Start Free Trial
              </Link>
            </div>
          </motion.div>

          {/* Agency */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bento-card-dark p-8 flex flex-col justify-between"
          >
            <div>
              <div className="text-slate-400 font-bold mb-4">Agency Scale</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-white">${Math.round(399 * discountMultiplier)}</span>
                <span className="text-sm text-slate-500 font-semibold">/mo</span>
              </div>
              <p className="text-sm text-slate-400 font-medium mb-8">
                For established agencies requiring maximum throughput.
              </p>
              <div className="space-y-4 text-sm font-semibold text-slate-300">
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-slate-600" /> Unlimited Discovery</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-slate-600" /> 2,000 AI Demos / mo</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-slate-600" /> Custom Domain Hosting</div>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/signup" className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-center py-3 rounded-xl font-bold transition-colors">
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Massive Bottom CTA */}
      <section className="py-24 px-4 sm:px-8 max-w-5xl mx-auto w-full relative z-20">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 sm:p-20 text-center relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
           <div className="relative z-10">
              <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
                Scale Your Agency. <br/> Close More Deals.
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
                Start building bespoke interactive demos for qualified leads today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link
                  href="/signup"
                  className="btn-primary-glow text-lg px-10 py-4 rounded-xl font-bold transition-all w-full sm:w-auto"
                >
                  Start 14-Day Free Trial
                </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-white/5 text-sm font-medium text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-blue-900/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Zap className="w-3 h-3" />
          </div>
          <span className="font-extrabold text-white">LeadDrive</span>
          <span>© {new Date().getFullYear()} LeadDrive Inc.</span>
        </div>

        <div className="flex items-center gap-8">
          <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
      </footer>
    </div>
  );
}
