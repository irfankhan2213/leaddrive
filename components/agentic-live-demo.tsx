'use client';

import React, { useState } from 'react';
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
  Copy
} from 'lucide-react';
import type { Lead } from '@/lib/types';

export interface AgenticStrategy {
  title: string;
  positioning: string;
  heroHeadline: string;
  primaryCta: string;
  sections: Array<{ title: string; purpose: string; copy: string }>;
  proofPoints: string[];
}

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
  const [selectedService, setSelectedService] = useState(strategy?.sections?.[0]?.title || 'Emergency Priority Service');
  const [bookingDate, setBookingDate] = useState('Today, Within 2 Hours');
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');

  // Interactive AI Assistant state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: `Hi there! 👋 Welcome to ${name}'s 24/7 Priority Assistant. How can we help you today?`
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bookingName || !bookingPhone) return;
    setBookingStep('confirmed');
  }

  function handleSendChat(e: React.FormEvent) {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const userText = inputMsg.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInputMsg('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `Great! We've received your request regarding "${userText}". Our dispatch coordinator will contact ${bookingPhone || 'you'} immediately!`
        }
      ]);
    }, 600);
  }

  function handleCopyLink() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
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
            Live Agentic Prototype
          </span>
          <span>Personalized proof-of-work created for <strong className="text-white">{name}</strong></span>
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
      <div className="bg-amber-950/40 border-b border-amber-500/20 px-4 py-2 sm:px-6 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-amber-200">
          <ShieldAlert size={14} className="text-amber-400 flex-shrink-0" />
          <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">Identified Conversion Vulnerability:</span>
          <span className="font-medium text-amber-100">"{weakness}"</span>
        </div>
        <div className="text-[11px] text-amber-300/80 font-semibold">
          Solved below with 1-click booking & 24/7 AI Receptionist
        </div>
      </div>

      {/* Live Business Brand Header */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-lg shadow-blue-600/30">
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
              <span>{niche}</span>
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all shadow-lg shadow-blue-600/30"
          >
            <Zap size={13} />
            <span>{strategy?.primaryCta || 'Book Priority Service'}</span>
          </button>
        </div>
      </nav>

      {/* Main Hero & Live Interactive Conversion Widget */}
      <section className="px-4 py-12 sm:px-8 lg:px-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-extrabold text-blue-300">
              <Sparkles size={13} className="text-blue-400" />
              <span>Modernized Conversion Experience</span>
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
                <div key={point} className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-200">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Trust and Rating */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white">4.9/5 Rating</span>
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
                  <div className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Live Booking Tool</div>
                  <h3 className="text-lg font-black text-white mt-0.5">Instant Service Scheduler</h3>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Clock size={16} />
                </div>
              </div>

              {bookingStep === 'form' ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4 mt-5">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1.5">Select Service</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
                    >
                      {(strategy?.sections || []).map((s) => (
                        <option key={s.title} value={s.title}>{s.title}</option>
                      ))}
                      <option value="Emergency Diagnostic & Repair">Emergency Diagnostic & Repair</option>
                      <option value="Standard Inspection & Quote">Standard Inspection & Quote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1.5">Preferred Time Window</label>
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

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Miller"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1.5">Phone Number for SMS Confirmation</label>
                    <input
                      type="tel"
                      placeholder="e.g. (512) 555-0199"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-2"
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
                    Book Another Slot
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Modules / Service Breakdown */}
      <section className="px-4 py-12 sm:px-8 lg:px-16 max-w-6xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Modernized Services</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Engineered for Instant Conversions
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Every section below is built with direct call-to-actions, transparent expectations, and mobile-first speed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {(strategy?.sections || []).map((section, idx) => (
            <div
              key={`${section.title}-${idx}`}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    Feature 0{idx + 1}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                    <Zap size={14} />
                  </div>
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-blue-200 transition-colors">
                  {section.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-semibold">
                  {section.purpose}
                </p>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {section.copy}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedService(section.title);
                  const el = document.getElementById('booking-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <span>Select This Service</span>
                <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Floating 24/7 AI Receptionist Chatbot Simulator */}
      <div className="fixed bottom-5 right-5 z-40">
        {chatOpen ? (
          <div className="w-[340px] sm:w-[380px] h-[460px] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
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

            {/* Chat Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-950 text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
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
            <form onSubmit={handleSendChat} className="p-2.5 bg-slate-900 border-t border-slate-800 flex gap-2">
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
            className="p-3.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-2xl flex items-center gap-2 text-xs font-extrabold border border-blue-400/30 transition-all hover:scale-105"
          >
            <MessageSquare size={16} />
            <span>Chat with 24/7 AI Assistant</span>
          </button>
        )}
      </div>

      {/* Footer Agency Callout */}
      <footer className="bg-slate-900 border-t border-slate-800 px-4 py-8 sm:px-8 text-center space-y-4">
        <div className="max-w-2xl mx-auto space-y-2">
          <h4 className="text-base font-extrabold text-white">
            Want this live booking system launched on your domain?
          </h4>
          <p className="text-xs text-slate-400">
            This interactive prototype was custom-built by LeadDrive for <strong>{name}</strong> to eliminate conversion leaks and capture high-intent search traffic.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all shadow-md shadow-blue-600/30"
          >
            <Sparkles size={14} />
            <span>Launch Agency Campaign</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
