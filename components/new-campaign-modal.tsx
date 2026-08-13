'use client';

import { useMemo, useState } from 'react';
import { FileInput, Globe2, Linkedin, MapPinned, Rocket, Search, Sparkles, Upload, Users, X } from 'lucide-react';
import type { CampaignInput, LeadSource } from '@/lib/types';
import { generateAlgorithmicKeywords } from '@/lib/pipeline';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (input: CampaignInput) => Promise<void>;
  loading: boolean;
}

const sourceOptions: Array<{ value: LeadSource; label: string; icon: React.ElementType }> = [
  { value: 'url_list', label: 'URLs', icon: Globe2 },
  { value: 'csv', label: 'CSV', icon: Upload },
  { value: 'google_maps', label: 'Maps', icon: MapPinned },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'product_hunt', label: 'Product Hunt', icon: Rocket },
  { value: 'apollo', label: 'Apollo', icon: FileInput }
];

const limitPresets = [5, 10, 25, 50, 100, 250];

export function NewCampaignModal({ isOpen, onClose, onLaunch, loading }: NewCampaignModalProps) {
  const [form, setForm] = useState<CampaignInput>({
    audience: 'High-ticket wellness clinics with weak mobile booking',
    locations: 'Austin, TX',
    source: 'google_maps',
    sourcePayload: '',
    demoType: 'website',
    channel: 'email',
    limit: 10
  });

  // Real-time preview of multi-keyword search queries generated for campaign
  const keywordPreview = useMemo(() => {
    return generateAlgorithmicKeywords(form);
  }, [form]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onLaunch(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="panel bg-white max-w-xl w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[88vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
          <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-gray-900 leading-tight">Launch Multi-Keyword Campaign</h2>
            <p className="text-[11px] text-gray-500 font-medium">Multi-query web scraping & AI personalized demos</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-1.5 space-y-3.5 scrollbar-thin">
            <div>
              <label className="label">Target Audience & Niche</label>
              <input
                type="text"
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value })}
                className="field text-xs py-2"
                placeholder="e.g. Wellness clinics, B2B SaaS, Dental practices"
                required
              />
            </div>

            <div>
              <label className="label">Target Locations</label>
              <input
                type="text"
                value={form.locations}
                onChange={(e) => setForm({ ...form, locations: e.target.value })}
                className="field text-xs py-2"
                placeholder="e.g. Austin, TX; Dallas, TX"
              />
            </div>

            {/* Option: Max Prospects to Find */}
            <div>
              <label className="label flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-900 font-extrabold">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Max Leads to Find for Campaign</span>
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">
                  Limit: {form.limit} lead{form.limit === 1 ? '' : 's'}
                </span>
              </label>
              <div className="grid grid-cols-6 gap-1.5 mt-1">
                {limitPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setForm({ ...form, limit: preset })}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      form.limit === preset
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[11px] text-gray-500 font-medium">Or custom count:</span>
                <input
                  type="number"
                  min={1}
                  max={250}
                  value={form.limit}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      limit: Math.min(Math.max(Number(e.target.value) || 1, 1), 250)
                    })
                  }
                  className="field text-xs w-20 py-1 font-extrabold text-blue-700"
                />
              </div>
            </div>

            {/* Multi-Keyword Expansion Preview */}
            <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-900 mb-1">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Multi-Keyword Search Query Expansion ({keywordPreview.length} queries)</span>
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {keywordPreview.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-blue-700 border border-blue-200/80 shadow-xs"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Lead Discovery Channel</label>
              <div className="grid grid-cols-3 gap-1.5">
                {sourceOptions.map((opt) => {
                  const Icon = opt.icon;
                  const selected = form.source === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, source: opt.value })}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border text-xs font-bold transition-all ${
                        selected
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="label">Source Data / Prospects List (Optional)</label>
              <textarea
                rows={2}
                value={form.sourcePayload}
                onChange={(e) => setForm({ ...form, sourcePayload: e.target.value })}
                className="field text-xs resize-none py-1.5"
                placeholder="Paste real CSV rows or URLs. Leave blank to scrape real leads from the selected source."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 mt-2 border-t border-gray-100 flex-shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="btn secondary text-xs py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn text-xs px-6 py-2"
            >
              {loading ? 'Scraping Multi-Keyword Engine...' : `Scrape & Find ${form.limit} Leads`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
