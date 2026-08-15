import { Bot, CheckCircle2, ExternalLink, MapPin, ShieldAlert, Sparkles, Target, Zap } from 'lucide-react';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Lead } from '@/lib/types';
import Link from 'next/link';

interface AgenticStrategy {
  title: string;
  positioning: string;
  heroHeadline: string;
  primaryCta: string;
  sections: Array<{ title: string; purpose: string; copy: string }>;
  proofPoints: string[];
}

export default async function DemoPage({
  params,
  searchParams
}: {
  params: Promise<{ leadId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { leadId } = await params;
  const query = searchParams ? await searchParams : {};
  let lead: Lead | null = null;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId);
  if (isUuid) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data } = await supabase.from('leads').select('*').eq('id', leadId).single();
      if (data) {
        lead = data as Lead;
      }
    }
  }

  const name = lead?.company_name || leadId
    .replace(/^lead_/, '')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const location = lead?.city || 'Local Area';
  const niche = lead?.niche || 'High-Ticket Services';
  const weakness = lead?.weakness || 'Mobile booking path is unoptimized for local search traffic.';
  const hasLiveV0Demo = Boolean(lead?.demo_url && /^https?:\/\//i.test(lead.demo_url) && !lead.demo_url.includes('/demo/'));
  const strategy = decodeAgenticStrategy(getQueryValue(query.strategy)) || decodeAgenticStrategy(lead?.demo_prompt);
  const isAgenticDemo = getQueryValue(query.engine) === 'agentic' || lead?.demo_provider === 'agentic';
  const providerLabel = hasLiveV0Demo ? (lead?.demo_provider === 'hybrid' ? 'Hybrid Live Site' : 'v0 Live Site') : isAgenticDemo ? 'Agentic Demo Blueprint' : 'Demo Pending';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
            {name[0] || 'L'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">{name}</span>
              {hasLiveV0Demo ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Sparkles size={11} />
                  {providerLabel}
                </span>
              ) : isAgenticDemo ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <Bot size={11} />
                  Agentic Blueprint
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Demo Pending
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-blue-400" />
                {location}
              </span>
              <span>•</span>
              <span>{niche}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {hasLiveV0Demo && (
            <a
              href={lead?.demo_url || '#'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30"
            >
              <span>Open in New Tab</span>
              <ExternalLink size={13} />
            </a>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700"
          >
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      {hasLiveV0Demo ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Audit Callout Banner */}
          <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldAlert size={15} className="text-amber-400 flex-shrink-0" />
              <span className="font-semibold text-slate-400">Identified Conversion Vulnerability:</span>
              <span className="font-bold text-amber-200">"{weakness}"</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium hidden md:block">
              Generated with {lead?.demo_provider === 'hybrid' ? 'Agentic + v0 Hybrid Engine' : 'Vercel v0 AI Engine'}
            </div>
          </div>

          {/* Full-bleed Live v0 Interactive Application */}
          <div className="flex-1 w-full bg-slate-950 p-2 sm:p-4 flex items-center justify-center min-h-[calc(100vh-120px)]">
            <div className="w-full h-full min-h-[750px] rounded-2xl overflow-hidden border border-slate-800 bg-white shadow-2xl flex flex-col">
              <iframe
                src={lead?.demo_url || ''}
                className="w-full flex-1 border-0 min-h-[750px]"
                title={`${name} v0 Live AI Application`}
                allow="accelerometer; autoplay; camera; encrypted-media; geolocation; gyroscope; microphone"
              />
            </div>
          </div>
        </div>
      ) : isAgenticDemo ? (
        <div className="flex-1 bg-slate-950">
          <section className="px-6 py-10 sm:px-10 lg:px-16 border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">
                  <Bot size={14} />
                  <span>Google Cloud Agentic Demo</span>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                    {strategy?.heroHeadline || `Turn ${location} traffic into booked customers`}
                  </h1>
                  <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                    {strategy?.positioning || `A focused modernization blueprint for ${name}, built around the conversion leak: ${weakness}`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-extrabold text-white">
                    <Zap size={14} />
                    {strategy?.primaryCta || 'Book faster'}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300">
                    <Target size={14} />
                    Score {lead?.fit_score || 'Ready'}
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 mb-3">Primary Conversion Gap</div>
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm font-semibold text-amber-100 leading-relaxed">
                  {weakness}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                    <div className="text-slate-500 font-bold">Market</div>
                    <div className="text-white font-extrabold mt-1">{location}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                    <div className="text-slate-500 font-bold">Niche</div>
                    <div className="text-white font-extrabold mt-1">{niche}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 py-10 sm:px-10 lg:px-16">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-white">{strategy?.title || `${name} demo plan`}</h2>
                <div className="space-y-2">
                  {(strategy?.proofPoints || [
                    'Mobile-first offer clarity',
                    'Trust proof near the CTA',
                    'One-step conversion path'
                  ]).map((point) => (
                    <div key={point} className="flex items-start gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-300">
                      <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {(strategy?.sections || []).map((section, index) => (
                  <div key={`${section.title}-${index}`} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                    <div className="text-[10px] font-extrabold text-blue-300 uppercase tracking-wide">Module {index + 1}</div>
                    <h3 className="mt-2 text-base font-extrabold text-white">{section.title}</h3>
                    <p className="mt-2 text-xs font-semibold text-slate-500">{section.purpose}</p>
                    <p className="mt-3 text-sm text-slate-300 leading-relaxed">{section.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* Pending Demo State (No Fake Local Landing Page) */
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
              <Bot size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Demo for {name}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                This prospect's personalized demo is queued for generation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <ShieldAlert size={14} className="text-amber-400" />
                <span>Audited Conversion Gap:</span>
              </div>
              <p className="text-xs text-amber-200 font-medium leading-relaxed">
                "{weakness}"
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/25"
              >
                <Sparkles size={14} />
                <span>Trigger Demo Generation in Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function getQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function decodeAgenticStrategy(value?: string): AgenticStrategy | null {
  if (!value) return null;
  try {
    const raw = value.trim().startsWith('{') ? value : Buffer.from(value, 'base64url').toString('utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      title: String(parsed.title || 'Agentic demo blueprint'),
      positioning: String(parsed.positioning || ''),
      heroHeadline: String(parsed.heroHeadline || ''),
      primaryCta: String(parsed.primaryCta || ''),
      sections: Array.isArray(parsed.sections) ? parsed.sections.map((section: Record<string, unknown>) => ({
        title: String(section.title || 'Demo module'),
        purpose: String(section.purpose || 'Improve conversion.'),
        copy: String(section.copy || '')
      })) : [],
      proofPoints: Array.isArray(parsed.proofPoints) ? parsed.proofPoints.map(String) : []
    };
  } catch {
    return null;
  }
}
