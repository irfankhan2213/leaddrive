import { ArrowRight, Calendar, Check, MapPin, Sparkles } from 'lucide-react';
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

  const location = lead?.city || null;
  const weakness = lead?.weakness || 'The current mobile first viewport hides the offer, proof, and booking action.';

  return (
    <main className="min-h-screen bg-[#fffdfa] text-[#171717]">
      <section className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between px-6 py-6 md:px-12 md:py-10">
          <nav className="flex items-center justify-between border-b border-black/10 pb-5">
            <div className="flex items-center gap-3">
              <span className="brand-mark">L</span>
              <div>
                <span className="font-serif text-2xl font-bold">{name}</span>
                {location && (
                  <span className="ml-3 inline-flex items-center gap-1 text-xs font-sans text-[#6f6a62]">
                    <MapPin size={12} />
                    {location}
                  </span>
                )}
              </div>
            </div>
            <button className="btn secondary hidden sm:inline-flex">
              <Calendar size={15} />
              Book Call
            </button>
          </nav>

          <div className="max-w-3xl py-16">
            <p className="eyebrow mb-5">Personalized Conversion Concept</p>
            <h1 className="section-title mb-6">
              A sharper first impression built for {name}.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[#6f6a62]">
              {weakness} This custom preview shows how fixing this gap will turn cold visitors into booked calls.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button className="btn">
                See booking flow
                <ArrowRight size={15} />
              </button>
              <button className="btn secondary">View audit notes</button>
            </div>
          </div>

          <div className="grid gap-3 border-t border-black/10 pt-5 sm:grid-cols-3">
            {['Clear offer above fold', 'Proof-led layout', 'Fast mobile CTA'].map((item) => (
              <div className="flex items-center gap-2 text-sm text-[#6f6a62]" key={item}>
                <Check size={16} className="text-[#16795b]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="preview-grid flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md border border-white/20 bg-[#f8f5ef] p-4 shadow-[0_40px_100px_rgba(0,0,0,0.28)]">
            <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
              <div>
                <p className="eyebrow">Mobile Preview</p>
                <h2 className="font-serif text-3xl font-bold">Book in 30 seconds</h2>
              </div>
              <Sparkles size={22} className="text-[#b28b31]" />
            </div>
            <div className="space-y-3">
              <div className="h-40 bg-[#171717]" />
              <div className="grid grid-cols-3 gap-2">
                <div className="h-16 bg-[#eee8dd]" />
                <div className="h-16 bg-[#eee8dd]" />
                <div className="h-16 bg-[#eee8dd]" />
              </div>
              <div className="border border-black/10 bg-white p-4">
                <p className="text-sm font-semibold">Instant trust section</p>
                <p className="mt-1 text-xs leading-5 text-[#6f6a62]">Reviews, outcomes, service clarity, and a single next step.</p>
              </div>
              <button className="btn w-full">Request appointment</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
