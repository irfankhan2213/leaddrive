'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronRight,
  Globe,
  Loader2,
  Rocket,
  Search,
  Sparkles,
  Wand2,
  X
} from 'lucide-react';
import type { Campaign, Lead } from '@/lib/types';

/**
 * Live activity panel: consumes the SSE stream from
 * POST /api/campaigns/live and shows the campaign being built in real
 * time — phases with live states, a running log, and counters — until
 * the campaign is complete.
 */

interface CampaignLivePanelProps {
  isOpen: boolean;
  request: string;
  limit: number;
  onDone: (campaign: Campaign, leads: Lead[]) => void;
  onClose: () => void;
}

type PhaseId = 'analyze' | 'discover' | 'audit' | 'score' | 'demos' | 'save';

const PHASES: Array<{ id: PhaseId; label: string }> = [
  { id: 'analyze', label: 'Analyze request' },
  { id: 'discover', label: 'Find leads' },
  { id: 'audit', label: 'Audit websites' },
  { id: 'score', label: 'Score & write copy' },
  { id: 'demos', label: 'Build demos' },
  { id: 'save', label: 'Save campaign' }
];

interface LogLine {
  id: number;
  text: string;
  tone: 'info' | 'success' | 'warn' | 'error';
}

export function CampaignLivePanel({ isOpen, request, limit, onDone, onClose }: CampaignLivePanelProps) {
  const [phaseStates, setPhaseStates] = useState<Record<PhaseId, 'pending' | 'active' | 'done'>>(() =>
    Object.fromEntries(PHASES.map((p) => [p.id, 'pending'])) as Record<PhaseId, 'pending' | 'active' | 'done'>
  );
  const [log, setLog] = useState<LogLine[]>([]);
  const [counters, setCounters] = useState({ found: 0, audited: 0, qualified: 0, demos: 0, demoFailures: 0 });
  const [status, setStatus] = useState<'running' | 'done' | 'error'>('running');
  const [errorMessage, setErrorMessage] = useState('');
  const [plan, setPlan] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const logId = useRef(0);

  function addLine(text: string, tone: LogLine['tone'] = 'info') {
    logId.current += 1;
    setLog((prev) => [...prev.slice(-150), { id: logId.current, text, tone }]);
  }

  function setPhase(phase: PhaseId, state: 'active' | 'done' | 'pending') {
    setPhaseStates((prev) => {
      const next = { ...prev, [phase]: state };
      // Mark all earlier phases done when a new one activates.
      if (state === 'active') {
        const idx = PHASES.findIndex((p) => p.id === phase);
        for (let i = 0; i < idx; i++) next[PHASES[i].id] = 'done';
      }
      return next;
    });
  }

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
    let buffer = '';

    async function run() {
      try {
        const res = await fetch('/api/campaigns/live', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request, limit }),
          signal: controller.signal
        });

        if (!res.ok || !res.body) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error || `Campaign failed to start (HTTP ${res.status})`);
        }

        reader = res.body.getReader();
        const decoder = new TextDecoder();

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const frames = buffer.split('\n\n');
          buffer = frames.pop() || '';
          for (const frame of frames) {
            const line = frame.split('\n').find((l) => l.startsWith('data: '));
            if (!line) continue;
            handleEvent(JSON.parse(line.slice(6)));
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setStatus('error');
        setPhase('save', 'pending');
        setErrorMessage(err instanceof Error ? err.message : 'Connection lost.');
        addLine('Campaign failed. Nothing was charged for incomplete steps.', 'error');
      }
    }

    function handleEvent(event: {
      type: string;
      phase?: string;
      message?: string;
      keywords?: string[];
      count?: number;
      name?: string;
      website?: string;
      status?: string;
      index?: number;
      total?: number;
      qualified?: number;
      company?: string;
      url?: string;
      campaign?: Campaign;
      leads?: Lead[];
    }) {
      switch (event.type) {
        case 'status': {
          addLine(event.message || 'Working…', 'info');
          const phase = String(event.phase || '');
          if (phase === 'keywords') setPhase('analyze', 'active');
          if (phase === 'discover') {
            setPhase('analyze', 'done');
            setPhase('discover', 'active');
          }
          if (phase === 'audit') {
            setPhase('discover', 'done');
            setPhase('audit', 'active');
          }
          if (phase === 'score') {
            setPhase('audit', 'done');
            setPhase('score', 'active');
          }
          if (phase === 'demos') {
            setPhase('score', 'done');
            setPhase('demos', 'active');
          }
          if (phase === 'save') {
            setPhase('demos', 'done');
            setPhase('save', 'active');
          }
          if (event.message?.startsWith('Plan ready:')) setPlan(event.message.replace('Plan ready: ', ''));
          break;
        }
        case 'keywords': {
          const kws = event.keywords || [];
          addLine(`Search plan: ${kws.slice(0, 3).join(' · ')}${kws.length > 3 ? ` +${kws.length - 3} more` : ''}`, 'info');
          break;
        }
        case 'discovered': {
          setCounters((c) => ({ ...c, found: event.count || 0 }));
          addLine(`Found ${event.count} real prospects`, 'success');
          break;
        }
        case 'lead': {
          setCounters((c) => ({ ...c, audited: (event.index || 0) + 1 }));
          if ((event.index || 0) % 3 === 0 || (event.index || 0) + 1 === event.total) {
            addLine(`Audited ${event.name}${event.website ? '' : ' (no site)'}`, 'info');
          }
          break;
        }
        case 'scored': {
          setCounters((c) => ({ ...c, qualified: event.qualified || 0 }));
          addLine(`${event.qualified} of ${event.total} leads qualified for outreach`, 'success');
          break;
        }
        case 'demo': {
          if (event.status === 'building') {
            addLine(`Building live demo for ${event.company}…`, 'info');
          } else if (event.status === 'ready') {
            setCounters((c) => ({ ...c, demos: c.demos + 1 }));
            addLine(`Demo ready for ${event.company}`, 'success');
          } else {
            setCounters((c) => ({ ...c, demoFailures: c.demoFailures + 1 }));
            addLine(`Demo failed for ${event.company} — lead kept, no credits wasted`, 'warn');
          }
          break;
        }
        case 'done': {
          setPhase('save', 'done');
          setStatus('done');
          addLine('Campaign complete', 'success');
          if (event.campaign && event.leads) onDone(event.campaign as Campaign, event.leads as Lead[]);
          break;
        }
        case 'error': {
          setStatus('error');
          setErrorMessage(event.message || 'Something went wrong.');
          addLine(event.message || 'Something went wrong.', 'error');
          break;
        }
      }
    }

    run();
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-6 pb-5">
          <div className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-colors ${
              status === 'done' ? 'bg-emerald-500' : status === 'error' ? 'bg-rose-500' : 'bg-[#0b0b10]'
            }`}>
              {status === 'running' && <Loader2 className="h-4.5 w-4.5 animate-spin text-white" />}
              {status === 'done' && <Check className="h-5 w-5 text-white" strokeWidth={3} />}
              {status === 'error' && <AlertCircle className="h-5 w-5 text-white" />}
            </span>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#0b0b10]">
                {status === 'running' ? 'Building your campaign…' : status === 'done' ? 'Campaign ready' : 'Campaign failed'}
              </h2>
              <p className="font-mono text-[11px] text-slate-400">&ldquo;{request}&rdquo;</p>
            </div>
          </div>
          {status !== 'running' && (
            <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* plan banner */}
        {plan && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-2.5">
            <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
            <span className="font-mono text-[11px] text-blue-800">{plan}</span>
          </div>
        )}

        {/* phases */}
        <div className="grid grid-cols-6 gap-2 px-6 pt-5">
          {PHASES.map((phase) => {
            const state = phaseStates[phase.id];
            return (
              <div
                key={phase.id}
                className={`rounded-xl border px-2 py-2.5 text-center transition-all ${
                  state === 'done'
                    ? 'border-emerald-200 bg-emerald-50'
                    : state === 'active'
                    ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-500/15'
                    : 'border-slate-100 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center">
                  {state === 'done' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} />
                  ) : state === 'active' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  )}
                </div>
                <div className={`mt-1.5 truncate text-[9px] font-bold uppercase tracking-wide ${
                  state === 'pending' ? 'text-slate-400' : state === 'active' ? 'text-blue-700' : 'text-emerald-700'
                }`}>
                  {phase.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* counters */}
        <div className="grid grid-cols-4 gap-2 px-6 pt-4">
          {[
            ['Leads found', counters.found],
            ['Audited', counters.audited],
            ['Qualified', counters.qualified],
            ['Demos built', counters.demos]
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5 text-center">
              <div className="text-xl font-extrabold tabular-nums tracking-tight text-[#0b0b10]">{value as number}</div>
              <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-slate-400">{label as string}</div>
            </div>
          ))}
        </div>

        {/* live log */}
        <div className="mx-6 mb-4 mt-4 flex-1 overflow-hidden rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Live activity</span>
            {status === 'running' && (
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> working
              </span>
            )}
          </div>
          <div ref={logRef} className="h-44 space-y-1.5 overflow-y-auto scroll-smooth p-4">
            {log.map((line) => (
              <div key={line.id} className="flex items-start gap-2.5 text-[11px] leading-snug">
                <span className="mt-0.5 font-mono text-[9px] text-slate-300">›</span>
                <span
                  className={
                    line.tone === 'success'
                      ? 'font-semibold text-emerald-700'
                      : line.tone === 'error'
                      ? 'font-semibold text-rose-600'
                      : line.tone === 'warn'
                      ? 'font-medium text-amber-600'
                      : 'text-slate-600'
                  }
                >
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* footer */}
        <div className="border-t border-slate-100 p-5">
          {status === 'running' ? (
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
              You can close the dashboard — the campaign keeps building. Demos capped at 3 to protect credits.
            </p>
          ) : status === 'done' ? (
            <button
              onClick={onClose}
              className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#0b0b10] py-3 text-sm font-bold text-white transition-colors hover:bg-[#26262e]"
            >
              View my leads
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex min-h-[46px] w-full items-center justify-center rounded-full border border-slate-300 bg-white py-3 text-sm font-bold text-[#0b0b10] transition-colors hover:border-slate-400"
            >
              Close and try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
