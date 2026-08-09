import { ArrowRight, Calendar, Check, Sparkles } from 'lucide-react';

export default async function DemoPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  const name = leadId
    .replace(/^lead_/, '')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <main className="min-h-screen bg-[#fffdfa] text-[#171717]">
      <section className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between px-6 py-6 md:px-12 md:py-10">
          <nav className="flex items-center justify-between border-b border-black/10 pb-5">
            <div className="flex items-center gap-3">
              <span className="brand-mark">L</span>
              <span className="font-serif text-2xl font-bold">{name || 'Client Demo'}</span>
            </div>
            <button className="btn secondary hidden sm:inline-flex">
              <Calendar size={15} />
              Book
            </button>
          </nav>

          <div className="max-w-3xl py-16">
            <p className="eyebrow mb-5">Personalized Conversion Concept</p>
            <h1 className="section-title mb-6">
              A sharper first impression built to turn cold traffic into booked calls.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[#6f6a62]">
              This live preview shows how the prospect could clarify the offer, surface proof, and make the next step impossible to miss on mobile and desktop.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button className="btn">
                See booking flow
                <ArrowRight size={15} />
              </button>
              <button className="btn secondary">View teardown</button>
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
