'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, Sparkles, X } from 'lucide-react';

interface CampaignComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (request: string, limit: number) => void;
  starting: boolean;
}

const LIMITS = [10, 25, 50];

const EXAMPLES = [
  'dentists in the uk',
  'roofing companies in texas, 25 leads',
  'b2b saas startups in usa',
  'spas in dubai, sms'
];

/**
 * Dead-simple campaign starter: one sentence is all it takes.
 * AI parses the request server-side and picks tools/modes automatically.
 */
export function CampaignComposer({ isOpen, onClose, onStart, starting }: CampaignComposerProps) {
  const [request, setRequest] = useState('');
  const [limit, setLimit] = useState(25);

  if (!isOpen) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!request.trim() || starting) return;
    onStart(request.trim(), limit);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={starting ? undefined : onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 pb-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0b0b10]">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#0b0b10]">Start a campaign</h2>
              <p className="text-xs font-medium text-slate-500">Just describe who you want as clients. AI handles the rest.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={starting}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6">
          <div className="relative">
            <textarea
              autoFocus
              rows={2}
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit(e);
                }
              }}
              placeholder='e.g. "dentists in the uk"'
              className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-[#0b0b10] placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* examples */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setRequest(ex)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-[10px] text-slate-500 transition-colors hover:border-blue-300 hover:text-blue-700"
              >
                {ex}
              </button>
            ))}
          </div>

          {/* limit chips */}
          <div className="mt-5 flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">How many leads?</span>
            <div className="flex gap-1.5">
              {LIMITS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setLimit(n)}
                  className={`min-h-[36px] rounded-full px-4 text-xs font-bold transition-all ${
                    limit === n ? 'bg-[#0b0b10] text-white' : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!request.trim() || starting}
            className="group mt-6 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {starting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Setting things up…
              </>
            ) : (
              <>
                Start Campaign
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
            Email outreach · demos auto-built for top leads (max 3) · you approve sends
          </p>
        </form>
      </div>
    </div>
  );
}
