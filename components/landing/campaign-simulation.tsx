'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Gauge,
  Globe,
  Mail,
  MapPin,
  Pause,
  Play,
  Search,
  Send
} from 'lucide-react';

/**
 * Self-playing product simulation: one campaign running end-to-end.
 * Replaces abstract 3D with the actual product story — each step shows
 * the real UI doing real work, with counters and animations keyed to the
 * active step. Auto-advances; click any step to jump.
 */

const STEP_MS = 7000;

const STEPS = [
  {
    id: 'scout',
    num: '01',
    label: 'Scout',
    title: 'Live prospects stream in.',
    desc: 'Your niche and city expand into smart queries across Google Maps and directories. Every lead arrives enriched and deduplicated — no lists, no staleness.',
    stats: [
      { value: 128, suffix: '', label: 'leads found' },
      { value: 34, suffix: '', label: 'with direct contact' }
    ]
  },
  {
    id: 'inspect',
    num: '02',
    label: 'Inspect',
    title: 'Every site gets diagnosed.',
    desc: 'Mobile speed, booking flow, contact paths — each prospect is audited and scored. The weakness becomes your opening line, backed by real numbers.',
    stats: [
      { value: 43, suffix: '', label: 'mobile score found' },
      { value: 3, suffix: '', label: 'weaknesses per lead' }
    ]
  },
  {
    id: 'build',
    num: '03',
    label: 'Build',
    title: 'Their fixed site goes live.',
    desc: 'The demo engine synthesizes a complete, personalized landing page for the prospect — hosted and shareable. Proof, before you\'ve said a word.',
    stats: [
      { value: 41, suffix: 's', label: 'to first live demo' },
      { value: 12, suffix: '', label: 'demos this campaign' }
    ]
  },
  {
    id: 'dispatch',
    num: '04',
    label: 'Dispatch',
    title: 'Outreach that gets answered.',
    desc: 'The audit-backed email lands with the demo attached. Opens, clicks and replies tracked per lead; opt-outs suppressed automatically.',
    stats: [
      { value: 68, suffix: '%', label: 'open rate' },
      { value: 9, suffix: '', label: 'replies booked' }
    ]
  }
] as const;

export function CampaignSimulation() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [cycle, setCycle] = useState(0); // increments each advance to restart animations
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setActive((prev) => (prev + 1) % STEPS.length);
      setCycle((c) => c + 1);
    }, STEP_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, active]);

  function goTo(i: number) {
    setActive(i);
    setCycle((c) => c + 1);
  }

  const step = STEPS[active];

  return (
    <section className="border-b border-slate-900/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex items-center gap-4">
          <span className="font-mono text-[11px] font-semibold tracking-widest text-blue-600">04</span>
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">Watch it run</span>
          <span className="h-px flex-1 bg-slate-900/[0.08]" />
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-[#0b0b10] sm:text-4xl">
            One campaign. Ninety seconds. Zero humans.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
            This is a real run through the pipeline — the same four steps your campaigns take, start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* ── Left: step narrative ── */}
          <div className="lg:col-span-5">
            {/* step pills */}
            <div className="mb-6 grid grid-cols-4 gap-2">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  aria-pressed={active === i}
                  className={`flex min-h-[56px] flex-col items-start justify-center rounded-xl border px-3 py-2 text-left transition-all ${
                    active === i
                      ? 'border-[#0b0b10] bg-[#0b0b10] text-white shadow-md'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className={`font-mono text-[9px] font-semibold tracking-widest ${active === i ? 'text-blue-300' : 'text-slate-400'}`}>
                    {s.num}
                  </span>
                  <span className="text-xs font-extrabold">{s.label}</span>
                </button>
              ))}
            </div>

            {/* active narrative */}
            <div key={`narrative-${active}`} className="anim-rise">
              <h3 className="text-2xl font-extrabold tracking-tight text-[#0b0b10]">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.desc}</p>

              <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-900/[0.06] bg-slate-900/[0.06]">
                {step.stats.map((stat) => (
                  <div key={stat.label} className="bg-white p-5">
                    <div className="text-2xl font-extrabold tracking-tight text-blue-600">
                      <CountUp target={stat.value} suffix={stat.suffix} active />
                    </div>
                    <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* playback controls */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => setPlaying(!playing)}
                className="flex min-h-[44px] items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-[#0b0b10] transition-colors hover:border-slate-400"
              >
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {playing ? 'Pause' : 'Play'}
              </button>
              {/* progress track */}
              <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  key={`progress-${active}-${cycle}-${playing}`}
                  className="absolute inset-y-0 left-0 rounded-full bg-blue-600"
                  style={
                    playing
                      ? { animation: `sim-progress ${STEP_MS}ms linear forwards` }
                      : { width: '0%' }
                  }
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                {step.num} / 04
              </span>
            </div>
          </div>

          {/* ── Right: live stage ── */}
          <div className="lg:col-span-7">
            <div className="relative min-h-[480px] overflow-hidden rounded-2xl border border-slate-900/[0.09] bg-[#fafaf9] shadow-[0_24px_60px_-24px_rgba(15,23,42,0.15)]">
              {/* stage chrome */}
              <div className="flex items-center justify-between border-b border-slate-900/[0.06] bg-white px-4 py-2.5">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${playing ? 'animate-pulse bg-emerald-500' : 'bg-slate-300'}`} />
                  {step.label} · live
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300">leaddrive / austin-dentists</span>
              </div>

              <div className="p-5 sm:p-6">
                {active === 0 && <ScoutView key={`s-${cycle}`} />}
                {active === 1 && <InspectView key={`i-${cycle}`} />}
                {active === 2 && <BuildView key={`b-${cycle}`} />}
                {active === 3 && <DispatchView key={`d-${cycle}`} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── stage views ────────────────────────── */

function ScoutView() {
  const leads = [
    { n: 'Bright Smile Dental', m: '★ 4.9 · 212 reviews · site ✓' },
    { n: 'Lone Star Orthodontics', m: '★ 4.7 · 164 reviews · phone ✓' },
    { n: 'Austin Family Dental', m: '★ 4.6 · 98 reviews · email ✓' },
    { n: 'Hill Country Smiles', m: '★ 4.5 · 87 reviews · site ✓' },
    { n: 'Zilker Park Dental', m: '★ 4.8 · 143 reviews · email ✓' }
  ];
  return (
    <div>
      <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Search className="h-4 w-4 animate-pulse text-blue-600" />
        <span className="font-mono text-xs text-slate-700">dentist in austin, tx</span>
        <span className="ml-auto rounded-full bg-blue-600 px-2.5 py-1 font-mono text-[10px] font-bold text-white">
          128 found
        </span>
      </div>
      <div className="space-y-2">
        {leads.map((lead, i) => (
          <div
            key={lead.n}
            className="anim-stagger flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
            style={{ animationDelay: `${i * 140}ms` }}
          >
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-300" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-[#0b0b10]">{lead.n}</div>
              <div className="truncate font-mono text-[10px] text-slate-400">{lead.m}</div>
            </div>
            <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" strokeWidth={3} />
          </div>
        ))}
      </div>
      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
        deduplicating · enriching · scoring…
      </p>
    </div>
  );
}

function InspectView() {
  const weaknesses = [
    'Mobile load: 4.1s (target < 1.5s)',
    'No 1-click booking flow',
    'Primary CTA below the fold'
  ];
  const score = 43;
  const circumference = 2 * Math.PI * 32;
  return (
    <div>
      <div className="mb-5 flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-4">
        <svg viewBox="0 0 80 80" className="h-24 w-24 flex-shrink-0">
          <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <circle
            cx="40" cy="40" r="32" fill="none"
            stroke="#f43f5e" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            transform="rotate(-90 40 40)"
          >
            <animate attributeName="stroke-dashoffset" from={circumference} to={circumference * (1 - score / 100)} dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
          </circle>
          <text x="40" y="47" textAnchor="middle" className="fill-[#0b0b10] text-[20px] font-extrabold">{score}</text>
        </svg>
        <div>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">PageSpeed · mobile</div>
          <div className="mt-1 text-lg font-extrabold text-[#0b0b10]">Bright Smile Dental</div>
          <div className="mt-0.5 font-mono text-[11px] text-rose-500">critical: conversion path broken</div>
        </div>
      </div>

      <div className="space-y-2">
        {weaknesses.map((w, i) => (
          <div
            key={w}
            className="anim-stagger flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
            style={{ animationDelay: `${400 + i * 220}ms` }}
          >
            <Gauge className="h-3.5 w-3.5 flex-shrink-0 text-rose-400" />
            <span className="font-mono text-[11px] text-slate-700">{w}</span>
          </div>
        ))}
      </div>

      <div
        className="anim-stagger mt-4 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3"
        style={{ animationDelay: '1100ms' }}
      >
        <span className="font-mono text-[11px] text-blue-800">→ outreach angle drafted: &ldquo;4s to load — here&apos;s a 0.8s version.&rdquo;</span>
      </div>
    </div>
  );
}

function BuildView() {
  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-slate-200" />
          <span className="h-2 w-2 rounded-full bg-slate-200" />
          <span className="h-2 w-2 rounded-full bg-slate-200" />
          <span className="ml-2 font-mono text-[9px] text-slate-400">demo/bright-smile-dental</span>
        </div>
        <div className="space-y-2.5 p-4">
          {[
            'w-2/3 h-3', 'w-1/2 h-2.5', 'w-3/4 h-2'
          ].map((cls, i) => (
            <div key={cls} className={`anim-stagger rounded bg-slate-200 ${cls}`} style={{ animationDelay: `${i * 180}ms` }} />
          ))}
          <div className="flex gap-2 pt-1">
            <div className="anim-stagger h-7 w-20 rounded-full bg-blue-600" style={{ animationDelay: '540ms' }} />
            <div className="anim-stagger h-7 w-16 rounded-full bg-slate-100" style={{ animationDelay: '660ms' }} />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="anim-stagger h-12 rounded-lg bg-slate-100" style={{ animationDelay: `${780 + i * 120}ms` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
        <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-emerald-700">
          <Globe className="h-3.5 w-3.5" />
          live &amp; shareable
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-600">built in 41s · $0.09 credits</span>
      </div>
    </div>
  );
}

function DispatchView() {
  return (
    <div>
      <div className="anim-rise rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span className="text-xs font-extrabold text-[#0b0b10]">Quick idea for Bright Smile Dental</span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-emerald-600 ring-1 ring-emerald-100">
            sent ✓
          </span>
        </div>
        <p className="mt-2.5 text-[11px] leading-relaxed text-slate-500">
          Noticed your site takes 4s to load on phones — that&apos;s where most bookings die. We built a 0.8s version of your homepage:
        </p>
        <div className="mt-3 rounded-lg bg-[#0b0b10] py-2 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-white">
          ⚡ Open your live demo
        </div>
        <div className="mt-2 border-t border-slate-100 pt-1.5 text-center font-mono text-[8px] uppercase tracking-wider text-slate-300">
          unsubscribe — one click, enforced
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { v: 68, s: '%', l: 'opens' },
          { v: 31, s: '%', l: 'clicks' },
          { v: 9, s: '', l: 'replies' }
        ].map((stat, i) => (
          <div key={stat.l} className="anim-stagger rounded-xl border border-slate-200 bg-white p-3.5 text-center" style={{ animationDelay: `${i * 160}ms` }}>
            <div className="text-xl font-extrabold tracking-tight text-[#0b0b10]">
              <CountUp target={stat.v} suffix={stat.s} active />
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">{stat.l}</div>
          </div>
        ))}
      </div>

      <div
        className="anim-stagger mt-3 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3"
        style={{ animationDelay: '900ms' }}
      >
        <Mail className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
        <div>
          <div className="text-[11px] font-bold text-[#0b0b10]">Reply · frontdesk@brightsmiledental.com</div>
          <div className="mt-0.5 text-[11px] text-slate-600">&ldquo;This is great — can you do the same for our booking page? Can we talk this week?&rdquo;</div>
        </div>
        <Send className="ml-auto h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
      </div>
    </div>
  );
}

/* ────────────────────────── helpers ────────────────────────── */

function CountUp({ target, suffix = '', active }: { target: number; suffix?: string; active: boolean }) {
  const [value, setValue] = useState(active ? 0 : target);
  const raf = useRef(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const duration = 1100;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, active]);

  return (
    <>
      {value}
      {suffix}
    </>
  );
}
