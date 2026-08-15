'use client';

import React, { useState, useMemo } from 'react';
import {
  Bot,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
  ArrowRight,
  Check,
  Copy,
  Calculator,
  ChevronDown,
  ChevronUp,
  XCircle,
  Award,
  Sliders,
  Calendar,
  ThumbsUp
} from 'lucide-react';
import type { Lead, AgenticStrategy, PricingPackage } from '@/lib/types';

interface AgenticLiveDemoProps {
  leadId: string;
  lead: Lead | null;
  strategy: AgenticStrategy | null;
}

export function AgenticLiveDemo({ leadId, lead, strategy }: AgenticLiveDemoProps) {
  const name = lead?.company_name || leadId
    .replace(/^lead_/, '')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const location = lead?.city || 'Austin, TX';
  const niche = lead?.niche || 'High-Ticket Services';
  const weakness = lead?.weakness || 'Missing 1-click mobile appointment booking tool.';

  // Interactive booking state
  const [bookingStep, setBookingStep] = useState<'form' | 'confirmed'>('form');
  const [selectedService, setSelectedService] = useState(
    strategy?.pricingPackages?.[0]?.name || strategy?.sections?.[0]?.title || 'Emergency Priority Service'
  );
  const [bookingDate, setBookingDate] = useState('Today, Within 2 Hours');
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  // Interactive Calculator state
  const calcConfig = strategy?.calculator || {
    serviceType: 'Service Scope Size',
    unitLabel: 'Property Sq Ft',
    basePrice: 89,
    pricePerUnit: 0.04,
    defaultUnits: 1800,
    minUnits: 600,
    maxUnits: 5000,
    step: 100,
    options: [
      { label: 'Emergency Same-Day Dispatch', price: 49 },
      { label: 'Deep Sanitization & Air Quality Check', price: 39 },
      { label: '1-Year Extended Workmanship Warranty', price: 59 }
    ]
  };

  const [units, setUnits] = useState(calcConfig.defaultUnits || 1800);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, boolean>>({ 0: true });

  const estimatedPrice = useMemo(() => {
    let total = (calcConfig.basePrice || 89) + (units * (calcConfig.pricePerUnit || 0.04));
    calcConfig.options?.forEach((opt, idx) => {
      if (selectedOptions[idx]) total += opt.price;
    });
    return Math.round(total);
  }, [units, selectedOptions, calcConfig]);

  // Interactive FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive AI Assistant state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: `Hi! 👋 I am ${name}'s 24/7 AI Concierge. I can give you instant price estimates, check technician availability in ${location}, or schedule emergency dispatch. How can I help?`
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bookingName || !bookingPhone) return;
    setBookingStep('confirmed');
  }

  function handleSendChat(e?: React.FormEvent, customPrompt?: string) {
    if (e) e.preventDefault();
    const userText = (customPrompt || inputMsg).trim();
    if (!userText) return;

    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    if (!customPrompt) setInputMsg('');

    setTimeout(() => {
      let reply = `Great question! At ${name}, we offer transparent upfront quotes and guaranteed arrival windows across ${location}. Our dispatch coordinator is ready to assist.`;
      
      const lower = userText.toLowerCase();
      if (lower.includes('cost') || lower.includes('price') || lower.includes('estimate') || lower.includes('how much')) {
        reply = `Our standard priority inspection starts at $89 with transparent diagnostics. You can also use the live interactive cost calculator on this page for a real-time estimate!`;
      } else if (lower.includes('today') || lower.includes('fast') || lower.includes('arrive') || lower.includes('emergency')) {
        reply = `We have emergency technicians on standby in ${location} with guaranteed dispatch within 60 to 90 minutes. Would you like to lock in a time slot?`;
      } else if (lower.includes('license') || lower.includes('insured') || lower.includes('guarantee')) {
        reply = `Yes, 100%! Every technician at ${name} is state-licensed, background-checked, and backed by our full Workmanship Guarantee.`;
      }

      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    }, 500);
  }

  function handleCopyLink() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  function handleSelectFromCalculator() {
    setSelectedService(`Calculated Scope (${units} ${calcConfig.unitLabel}) - Est. $${estimatedPrice}`);
    const el = document.getElementById('booking-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleSelectPackage(pkg: PricingPackage) {
    setSelectedService(`${pkg.name} (${pkg.price})`);
    const el = document.getElementById('booking-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Banner: Agency Proof-of-Work Badge */}
      <div className="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-900/90 border-b border-blue-500/20 px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-white font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-extrabold text-blue-200 uppercase tracking-wider text-[10px] bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/30">
            Live v0-Grade Platform
          </span>
          <span>Interactive conversion prototype generated for <strong className="text-white">{name}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all border border-white/10"
          >
            {copiedLink ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Live URL'}</span>
          </button>
        </div>
      </div>

      {/* Audited Vulnerability Notification Bar */}
      <div className="bg-amber-950/40 border-b border-amber-500/20 px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-amber-200">
          <ShieldAlert size={14} className="text-amber-400 flex-shrink-0" />
          <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">Conversion Vulnerability Identified:</span>
          <span className="font-medium text-amber-100">"{weakness}"</span>
        </div>
        <div className="text-[11px] text-amber-300/90 font-semibold flex items-center gap-1">
          <Sparkles size={12} className="text-amber-400" />
          <span>Solved below with 1-Click Booking, Instant Cost Estimator & 24/7 AI Concierge</span>
        </div>
      </div>

      {/* Live Business Brand Header */}
      <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white font-black flex items-center justify-center text-lg shadow-lg shadow-blue-600/30">
            {name[0]}
          </div>
          <div>
            <div className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
              <span>{name}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 size={10} />
                Verified Local Business
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-blue-400" />
                {location}
              </span>
              <span>•</span>
              <span>{strategy?.tagline || niche}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lead?.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            >
              <Phone size={13} className="text-blue-400" />
              <span>{lead.phone}</span>
            </a>
          )}
          <button
            onClick={() => {
              const el = document.getElementById('booking-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all shadow-lg shadow-blue-600/30"
          >
            <Zap size={13} />
            <span>{strategy?.primaryCta || 'Book Priority Service'}</span>
          </button>
        </div>
      </nav>

      {/* Main Hero & Live Interactive Conversion Scheduler */}
      <section className="px-4 py-12 sm:px-8 lg:px-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-extrabold text-blue-300">
              <Sparkles size={13} className="text-blue-400" />
              <span>{strategy?.tagline || 'Modernized Conversion Engine'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {strategy?.heroHeadline || `Austin's Fastest, Most Reliable ${niche}`}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {strategy?.positioning || `Experience instant scheduling, guaranteed response times, and 24/7 dedicated support for all your ${niche.toLowerCase()} needs in ${location}.`}
            </p>

            {/* Proof Points Badges */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {(strategy?.proofPoints || [
                `Guaranteed 1-hour response in ${location}`,
                'Transparent quotes with zero hidden fees',
                '24/7 AI-powered dispatch & emergency bookings',
                '100% Satisfaction & Workmanship Guarantee'
              ]).map((point) => (
                <div key={point} className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-200 shadow-sm">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Trust and Rating Bar */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white">4.9/5 Star Rating</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users size={13} className="text-blue-400" />
                <span>Over 850+ local {location} clients served</span>
              </span>
            </div>
          </div>

          {/* Right Column: Live Interactive 1-Click Booking Tool */}
          <div id="booking-section" className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl relative backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Live 1-Click Tool</div>
                  <h3 className="text-lg font-black text-white mt-0.5">Instant Service Scheduler</h3>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Clock size={16} />
                </div>
              </div>

              {bookingStep === 'form' ? (
                <form onSubmit={handleBookingSubmit} className="space-y-3.5 mt-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1">Selected Service / Scope</label>
                    <input
                      type="text"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1">Preferred Time Window</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Today (Urgent)', 'Tomorrow Morning', 'This Weekend', 'Flexible'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setBookingDate(time)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                            bookingDate === time
                              ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sarah Miller"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-300 mb-1">Phone for SMS</label>
                      <input
                        type="tel"
                        placeholder="(512) 555-0199"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1">Service Notes (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. AC blowing warm air in living room..."
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-1"
                  >
                    <span>Confirm Instant Booking</span>
                    <ArrowRight size={14} />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span>No credit card required. Instant SMS dispatch notification.</span>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">Booking Confirmed!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Appointment scheduled for <strong>{bookingName}</strong> for <strong>{selectedService}</strong> ({bookingDate}).
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                    A confirmation dispatch SMS has been simulated to <strong>{bookingPhone}</strong>.
                  </div>
                  <button
                    onClick={() => setBookingStep('form')}
                    className="btn secondary text-xs py-2 px-4 mx-auto"
                  >
                    Schedule Another Slot
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature 1: Dynamic Cost Estimator Calculator */}
      <section className="px-4 py-12 sm:px-8 lg:px-16 max-w-6xl mx-auto w-full">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-extrabold">
                <Calculator size={13} />
                <span>Interactive Cost Estimator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Transparent Upfront Pricing Calculator
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Eliminate price friction for website visitors. Move the slider to calculate instant estimated project scopes based on your property size.
              </p>

              {/* Slider Scope */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>{calcConfig.unitLabel}: <strong className="text-blue-400 font-mono text-sm">{units.toLocaleString()}</strong></span>
                  <span className="text-slate-400 font-normal">Min: {calcConfig.minUnits} | Max: {calcConfig.maxUnits}</span>
                </div>
                <input
                  type="range"
                  min={calcConfig.minUnits || 600}
                  max={calcConfig.maxUnits || 5000}
                  step={calcConfig.step || 100}
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Add-on Checkboxes */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Available Scope Add-ons</div>
                <div className="space-y-1.5">
                  {calcConfig.options?.map((opt, idx) => (
                    <label
                      key={opt.label}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={Boolean(selectedOptions[idx])}
                          onChange={(e) =>
                            setSelectedOptions({ ...selectedOptions, [idx]: e.target.checked })
                          }
                          className="w-4 h-4 text-blue-600 rounded border-slate-700 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-slate-200 font-medium">{opt.label}</span>
                      </div>
                      <span className="font-bold text-blue-400">+${opt.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Estimated Price Output Card */}
            <div className="md:col-span-6 flex flex-col justify-center items-center">
              <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-950 border border-blue-500/30 shadow-2xl text-center space-y-4 relative">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                  Estimated Total Investment
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                  ${estimatedPrice}
                  <span className="text-xs text-slate-400 font-normal ml-1">est.</span>
                </div>
                <div className="text-xs text-slate-400">
                  Includes full diagnostic, {units.toLocaleString()} {calcConfig.unitLabel} scope, and selected guarantees.
                </div>
                <button
                  onClick={handleSelectFromCalculator}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <span>Book This Estimate</span>
                  <ArrowRight size={14} />
                </button>
                <div className="text-[10px] text-slate-500 font-medium">
                  Zero commitment. Final price verified on-site before start.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature 2: Before vs After / Conversion Leak Breakdown */}
      <section className="px-4 py-10 sm:px-8 lg:px-16 max-w-6xl mx-auto w-full space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Audit & Modernization Matrix</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Current Friction vs. Modernized Experience
          </h2>
          <p className="text-xs text-slate-400">
            Why high-intent prospects bounce from outdated websites and how this prototype secures the booking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Experience (Red) */}
          <div className="p-6 rounded-3xl bg-red-950/20 border border-red-500/30 space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-extrabold text-sm">
              <XCircle size={18} />
              <span>Current Website Experience (Friction)</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {(strategy?.comparison?.current || [
                'Slow phone-tag during busy peak hours',
                'No after-hours online booking for night visitors',
                'Uncertain technician dispatch ETA',
                'Loses mobile visitors to fast competitors'
              ]).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Modernized LeadDrive Experience (Green) */}
          <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
              <CheckCircle2 size={18} />
              <span>LeadDrive Modernized Experience (High-Converting)</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-200">
              {(strategy?.comparison?.modernized || [
                'Instant 60-second 1-click booking tool',
                '24/7 AI Receptionist Concierge chatbot',
                'Real-time SMS dispatch & arrival confirmation',
                'Sub-second 98/100 PageSpeed mobile architecture'
              ]).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Transparent Service & Pricing Packages */}
      <section className="px-4 py-12 sm:px-8 lg:px-16 max-w-6xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Transparent Packages</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Select a Verified Service Tier
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            All tiers include licensed technicians, instant dispatch confirmation, and zero hidden travel fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {(strategy?.pricingPackages || [
            {
              name: 'Emergency Priority Service',
              price: '$89',
              duration: 'Within 90 mins',
              popular: true,
              description: 'Fast on-site dispatch to inspect, diagnose, and resolve immediate issues.',
              perks: ['Priority dispatch queue', 'Comprehensive multi-point audit', '100% upfront quote approval guarantee']
            },
            {
              name: 'Complete Preventive Maintenance',
              price: '$149',
              duration: 'Scheduled 2-hr window',
              popular: false,
              description: 'Comprehensive tune-up and safety inspection to prevent costly future breakdowns.',
              perks: ['Deep system calibration', 'Filter & safety check', 'Extended warranty coverage']
            },
            {
              name: 'Full System Upgrade & Install',
              price: 'Custom Quote',
              duration: 'Free on-site estimate',
              popular: false,
              description: 'High-efficiency replacement and modernization with flexible financing.',
              perks: ['10-year parts & labor warranty', '0% APR financing available', 'Rebate assistance included']
            }
          ]).map((pkg) => (
            <div
              key={pkg.name}
              className={`p-6 rounded-3xl border flex flex-col justify-between space-y-5 transition-all relative ${
                pkg.popular
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950/40 border-blue-500 shadow-xl shadow-blue-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-blue-600 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-3">
                <div className="text-sm font-extrabold text-white">{pkg.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-mono">{pkg.price}</span>
                  <span className="text-xs text-slate-400">/ {pkg.duration}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{pkg.description}</p>
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  {pkg.perks.map((perk) => (
                    <div key={perk} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check size={13} className="text-emerald-400 flex-shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPackage(pkg)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  pkg.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>Select This Tier</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Local Reviews Showcase */}
      <section className="px-4 py-10 sm:px-8 lg:px-16 max-w-6xl mx-auto w-full space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Social Proof</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Trusted by Local {location} Clients
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {(strategy?.reviews || [
            {
              author: 'Marcus Vance',
              location: location,
              content: 'The 1-click booking was effortless. A technician was at my property in under 45 minutes.',
              rating: 5,
              verified: true
            },
            {
              author: 'Sarah Jenkins',
              location: location,
              content: 'Transparent upfront estimate and great communication throughout. Best service experience we have had.',
              rating: 5,
              verified: true
            },
            {
              author: 'David Chen',
              location: location,
              content: 'Super fast, professional, and courteous. Having the AI assistant answer questions late at night was a lifesaver.',
              rating: 5,
              verified: true
            }
          ]).map((rev, i) => (
            <div key={i} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating || 5)].map((_, idx) => (
                    <Star key={idx} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={10} />
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 italic">"{rev.content}"</p>
              <div className="pt-2 border-t border-slate-800/80 text-xs">
                <div className="font-extrabold text-white">{rev.author}</div>
                <div className="text-[10px] text-slate-400">{rev.location || location}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="px-4 py-10 sm:px-8 lg:px-16 max-w-4xl mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Frequently Asked Questions</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Common Questions Answered Instantly
          </h2>
        </div>

        <div className="space-y-3">
          {(strategy?.faqs || [
            {
              question: `How fast can a specialist arrive in ${location}?`,
              answer: 'Emergency priority bookings are dispatched within 60 to 90 minutes. Scheduled appointments have guaranteed 2-hour arrival windows.'
            },
            {
              question: 'Do I have to pay upfront when scheduling online?',
              answer: 'No upfront payment is required. You review and approve the exact quote on-site with your technician before any work begins.'
            },
            {
              question: 'Are all technicians licensed and insured?',
              answer: 'Yes, every specialist is fully certified, background-checked, and covered by our 100% Workmanship Guarantee.'
            }
          ]).map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-blue-300 transition-colors"
              >
                <span>{faq.question}</span>
                {openFaq === idx ? <ChevronUp size={16} className="text-blue-400" /> : <ChevronDown size={16} />}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3 animate-in fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Floating 24/7 AI Receptionist Chatbot Simulator */}
      <div className="fixed bottom-5 right-5 z-40">
        {chatOpen ? (
          <div className="w-[340px] sm:w-[380px] h-[500px] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <div className="text-xs font-extrabold">{name} AI Concierge</div>
                  <div className="text-[10px] text-blue-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Active 24/7 Booking Agent</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white/80 hover:text-white text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Action Chips */}
            <div className="p-2 bg-slate-900/90 border-b border-slate-800 flex gap-1.5 overflow-x-auto text-[10px]">
              <button
                onClick={() => handleSendChat(undefined, 'How much does emergency repair cost?')}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap border border-slate-700"
              >
                💰 Cost Estimates
              </button>
              <button
                onClick={() => handleSendChat(undefined, 'Can someone arrive today?')}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap border border-slate-700"
              >
                ⚡ Emergency Dispatch
              </button>
              <button
                onClick={() => handleSendChat(undefined, 'Are you licensed and insured?')}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap border border-slate-700"
              >
                🛡️ Guarantees
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-950 text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={(e) => handleSendChat(e)} className="p-2.5 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask about pricing, availability..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="p-3.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-2xl flex items-center gap-2 text-xs font-extrabold border border-blue-400/30 transition-all hover:scale-105"
          >
            <MessageSquare size={16} />
            <span>Chat with 24/7 AI Concierge</span>
          </button>
        )}
      </div>

      {/* Footer Agency Callout */}
      <footer className="bg-slate-900 border-t border-slate-800 px-4 py-8 sm:px-8 text-center space-y-4">
        <div className="max-w-2xl mx-auto space-y-2">
          <h4 className="text-base font-extrabold text-white">
            Want this complete conversion platform launched on your custom domain?
          </h4>
          <p className="text-xs text-slate-400">
            This interactive v0-grade prototype was custom-generated by LeadDrive for <strong>{name}</strong> to eliminate conversion friction, automate scheduling, and dominate local search results.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all shadow-md shadow-blue-600/30"
          >
            <Sparkles size={14} />
            <span>Launch Agency Campaign</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
