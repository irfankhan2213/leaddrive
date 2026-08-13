import { ArrowRight, Calendar, Check, ExternalLink, MapPin, ShieldCheck, Sparkles, Star, Users, Zap } from 'lucide-react';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Lead } from '@/lib/types';

export default async function DemoPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  let lead: Partial<Lead> | null = null;

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

  const location = lead?.city || 'Local Service Area';
  const niche = lead?.niche || 'High-Ticket Services';
  const weakness = lead?.weakness || 'The current mobile-first viewport hides the offer, proof, and booking action.';
  const hasV0Demo = Boolean(lead?.demo_url && /^https?:\/\//i.test(lead.demo_url));

  const services = [
    { title: 'Core Consultation Package', price: '$299', desc: 'Complete initial diagnostic, strategy roadmap, and 1-on-1 expert session.' },
    { title: 'Premium Service Package', price: '$699', desc: 'Full service delivery with priority 24/7 client support and performance guarantees.' },
    { title: 'Complete Care Membership', price: '$1,299/mo', desc: 'All-inclusive monthly retainer with dedicated specialist and monthly review.' },
    { title: 'Express Emergency Service', price: '$449', desc: 'Same-day rapid deployment for urgent business or client service needs.' }
  ];

  return (
    <main className="min-h-screen bg-[#fbfafd] text-[#111827]">
      <section className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
        {/* Left Column: Lead Drive Audit & Conversion Proposal */}
        <div className="flex flex-col justify-between px-6 py-6 md:px-12 md:py-10 border-b lg:border-b-0 lg:border-r border-gray-200/80">
          <nav className="flex items-center justify-between border-b border-gray-200/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                {name[0] || 'L'}
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-gray-900">{name}</span>
                {location && (
                  <span className="ml-3 inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                    <MapPin size={13} className="text-blue-600" />
                    {location}
                  </span>
                )}
              </div>
            </div>
            <button className="btn secondary text-xs py-2 hidden sm:inline-flex">
              <Calendar size={14} />
              <span>Book Review Call</span>
            </button>
          </nav>

          <div className="max-w-2xl py-8 space-y-6">
            <div className="flex items-center gap-2">
              <span className="eyebrow bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200/80">
                Personalized Site Concept
              </span>
              {hasV0Demo && (
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5 shadow-xs">
                  <Sparkles size={12} />
                  v0 AI Full Live Site
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
              A high-converting digital experience designed for {name}.
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-gray-600 font-medium">
              We audited {name}'s digital presence in {location} and identified a key growth gap: <strong className="text-gray-900">"{weakness}"</strong>. This full multi-section site concept demonstrates how fixing this bottleneck turns cold search traffic into booked clients.
            </p>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-blue-900">
                <ShieldCheck size={16} className="text-blue-600" />
                <span>Conversion Audit Summary for {niche}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-blue-950 font-semibold">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-blue-600" />
                  <span>1-Tap Instant Appointment & Consultation Booking Bar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-blue-600" />
                  <span>Transparent Pricing & Package Selection Grid (4 Service Cards)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-blue-600" />
                  <span>Local Social Proof & 5-Star Review Badges in {location}</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              {hasV0Demo ? (
                <a
                  href={lead?.demo_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="btn inline-flex items-center gap-2 text-xs px-6 py-3 shadow-lg shadow-blue-500/25"
                >
                  <span>Open Full v0 AI Site in New Tab</span>
                  <ExternalLink size={15} />
                </a>
              ) : (
                <button className="btn text-xs px-6 py-3 shadow-lg shadow-blue-500/25">
                  <span>Explore Interactive Booking Flow</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-3 border-t border-gray-200/80 pt-5 sm:grid-cols-3">
            {['1-Click Mobile Booking', 'Proof-Led Hero Section', 'Transparent Package Pricing'].map((item) => (
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600" key={item}>
                <Check size={15} className="text-emerald-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Full Site Preview Frame */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-slate-900 p-4 md:p-8 flex items-center justify-center min-h-[700px]">
          {hasV0Demo ? (
            <div className="w-full h-full max-h-[850px] border border-white/20 bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="bg-gray-800/90 px-4 py-3 flex items-center justify-between border-b border-gray-700 text-white backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-gray-300 ml-2 truncate max-w-[280px]">
                    {lead?.demo_url}
                  </span>
                </div>
                <a
                  href={lead?.demo_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Full Screen</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <iframe
                src={lead?.demo_url || ''}
                className="w-full flex-1 border-0 bg-white"
                title={`${name} Live v0 AI Full Site`}
              />
            </div>
          ) : (
            /* Expansive Multi-Section Local Site Preview */
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-white/20 overflow-y-auto max-h-[820px] flex flex-col text-gray-900 font-sans scrollbar-thin">
              {/* Site Header */}
              <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">
                    {name[0]}
                  </div>
                  <span className="font-extrabold text-sm text-gray-900">{name}</span>
                </div>
                <button className="btn text-xs py-1.5 px-3">Book 1-Click Call</button>
              </header>

              {/* Hero Section */}
              <div className="p-6 bg-gradient-to-b from-blue-50/60 to-white text-center space-y-3">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span>Rated 4.9★ by 250+ Clients in {location}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                  High-converting {niche} solutions tailored for {name}
                </h2>
                <p className="text-xs text-gray-600 font-medium max-w-md mx-auto leading-relaxed">
                  Experience seamless scheduling, instant service quotes, and top-rated professional service in {location}.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button className="btn text-xs py-2 px-4 shadow-sm">Schedule Appointment</button>
                  <button className="btn secondary text-xs py-2 px-4">View Service Packages</button>
                </div>
              </div>

              {/* Vulnerability Resolution Banner */}
              <div className="mx-5 my-2 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
                <Zap size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-amber-950">Conversion Vulnerability Resolved</div>
                  <div className="text-[11px] text-amber-900 font-medium mt-0.5 leading-snug">
                    "{weakness}" — Now fixed with instant mobile booking and visible trust proof.
                  </div>
                </div>
              </div>

              {/* 4 Service Cards Grid */}
              <div className="p-5 space-y-3">
                <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                  Featured Services & Packages
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {services.map((s, i) => (
                    <div key={i} className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-blue-200 transition-all flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-gray-900">{s.title}</span>
                          <span className="text-xs font-extrabold text-blue-600">{s.price}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium mt-1 leading-snug">{s.desc}</p>
                      </div>
                      <button className="w-full py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-xs font-bold text-gray-700 transition-all">
                        Book Service
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Booking Widget */}
              <div className="m-5 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold">
                    <Calendar size={15} />
                    <span>Instant 30-Second Consultation Scheduler</span>
                  </div>
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded">Live Available</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Today 2:00 PM', 'Tomorrow 10:00 AM', 'Thu 4:30 PM'].map((slot, i) => (
                    <button key={i} className="py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-blue-900 text-[11px] font-bold transition-all border border-white/20">
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Review Section */}
              <div className="p-5 border-t border-gray-100 bg-gray-50/40 space-y-3">
                <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                  Verified Local Reviews in {location}
                </h3>
                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                    <span>Sarah M. — Verified Client</span>
                    <div className="flex text-amber-400">★★★★★</div>
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                    "Booking with {name} was seamless. Fast response, transparent pricing, and top quality service!"
                  </p>
                </div>
              </div>

              {/* Footer Bar */}
              <footer className="p-4 bg-gray-900 text-gray-400 text-[11px] font-medium flex items-center justify-between">
                <span>© {new Date().getFullYear()} {name}. All rights reserved.</span>
                <span className="text-gray-300 font-bold">{location}</span>
              </footer>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
