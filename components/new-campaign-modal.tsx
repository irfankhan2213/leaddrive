'use client';

import { useState } from 'react';
import { FileInput, Globe2, Linkedin, MapPinned, Rocket, Sparkles, Upload, X } from 'lucide-react';
import type { CampaignInput, LeadSource } from '@/lib/types';

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

export function NewCampaignModal({ isOpen, onClose, onLaunch, loading }: NewCampaignModalProps) {
  const [form, setForm] = useState<CampaignInput>({
    audience: 'High-ticket wellness clinics with weak mobile booking',
    locations: 'Austin, TX; Dallas, TX; Houston, TX',
    source: 'url_list',
    sourcePayload: 'Aurora Med Spa, Austin, TX, https://auroramedspa.example, hello@auroramedspa.example\nNorthstar Legal Group, Dallas, TX, https://northstarlegal.example\nFluxOps, Houston, TX, https://fluxops.example',
    demoType: 'website',
    channel: 'email',
    limit: 25
  });

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onLaunch(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="panel bg-white/95 max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 leading-tight">Launch New Campaign</h2>
            <p className="text-xs text-gray-500 font-medium">Configure lead discovery & automated AI demos</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Target Audience & Niche</label>
            <input
              type="text"
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
              className="field text-xs"
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
              className="field text-xs"
              placeholder="e.g. Austin, TX; Dallas, TX"
            />
          </div>

          <div>
            <label className="label">Lead Discovery Channel</label>
            <div className="grid grid-cols-3 gap-2">
              {sourceOptions.map((opt) => {
                const Icon = opt.icon;
                const selected = form.source === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, source: opt.value })}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
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
            <label className="label">Source Data / Prospects List</label>
            <textarea
              rows={3}
              value={form.sourcePayload}
              onChange={(e) => setForm({ ...form, sourcePayload: e.target.value })}
              className="field text-xs resize-none"
              placeholder="Paste URLs, CSV data, or Apollo search terms..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="btn secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn text-xs px-6"
            >
              {loading ? 'Launching Engine...' : 'Launch Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
