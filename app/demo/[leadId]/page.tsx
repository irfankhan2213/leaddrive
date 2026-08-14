import { ArrowRight, Bot, ExternalLink, Globe, Layout, MapPin, Monitor, Phone, RefreshCw, ShieldAlert, Smartphone, Sparkles, Tablet } from 'lucide-react';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Lead } from '@/lib/types';
import Link from 'next/link';

export default async function DemoPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
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
                  v0 AI Live Site
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  v0 Demo Pending
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
              ✨ Generated with Vercel v0 AI Engine
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
      ) : (
        /* Pending Demo State (No Fake Local Landing Page) */
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
              <Bot size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                v0 AI Demo for {name}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                This prospect's personalized live landing page is queued for generation with Vercel's v0 AI engine.
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
                <span>Trigger v0 Generation in Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
