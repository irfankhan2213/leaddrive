'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileInput,
  Globe2,
  Inbox,
  LayoutDashboard,
  Linkedin,
  Mail,
  MapPinned,
  MousePointerClick,
  Play,
  Radar,
  Rocket,
  Send,
  Sparkles,
  Target,
  Upload,
  Users,
  Wand2
} from 'lucide-react';
import { sampleCampaign, sampleLeads } from '@/lib/mock-data';
import type { Campaign, CampaignInput, DemoType, Lead, LeadSource, OutreachChannel } from '@/lib/types';

const sourceOptions: Array<{ value: LeadSource; label: string; icon: React.ElementType }> = [
  { value: 'url_list', label: 'URLs', icon: Globe2 },
  { value: 'csv', label: 'CSV', icon: Upload },
  { value: 'google_maps', label: 'Maps', icon: MapPinned },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'product_hunt', label: 'Product Hunt', icon: Rocket },
  { value: 'apollo', label: 'Apollo', icon: FileInput }
];

const metrics = [
  { label: 'Prospects', key: 'total_prospects', icon: Users },
  { label: 'Qualified', key: 'qualified', icon: Target },
  { label: 'Demos', key: 'demos_generated', icon: Wand2 },
  { label: 'Replies', key: 'replies', icon: Inbox }
] as const;

export default function Home() {
  const [campaign, setCampaign] = useState<Campaign>(sampleCampaign);
  const [leads, setLeads] = useState<Lead[]>(sampleLeads);
  const [selectedId, setSelectedId] = useState(sampleLeads[0]?.id);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [form, setForm] = useState<CampaignInput>({
    audience: 'High-ticket wellness clinics with weak mobile booking',
    locations: 'Austin, TX; Dallas, TX; Houston, TX',
    source: 'url_list',
    sourcePayload: 'Aurora Med Spa, Austin, TX, https://auroramedspa.example, hello@auroramedspa.example\nNorthstar Legal Group, Dallas, TX, https://northstarlegal.example\nFluxOps, Houston, TX, https://fluxops.example',
    demoType: 'website',
    channel: 'email',
    limit: 25
  });

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedId) || leads[0],
    [leads, selectedId]
  );

  const conversionRate = campaign.outreach_sent
    ? Math.round((campaign.replies / campaign.outreach_sent) * 100)
    : 0;

  async function launchCampaign() {
    setLoading(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = (await res.json()) as { campaign: Campaign; leads: Lead[]; error?: string };
      if (data.error) throw new Error(data.error);
      setCampaign(data.campaign);
      setLeads(data.leads);
      setSelectedId(data.leads[0]?.id);
    } finally {
      setLoading(false);
    }
  }

  async function createDemo(lead: Lead) {
    setDemoLoading(true);
    try {
      const res = await fetch('/api/demos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
      const data = (await res.json()) as { demoUrl: string };
      setLeads((current) =>
        current.map((item) =>
          item.id === lead.id
            ? { ...item, status: 'demo_ready', demo_url: data.demoUrl }
            : item
        )
      );
      setCampaign((current) => ({
        ...current,
        demos_generated: current.demos_generated + 1
      }));
    } finally {
      setDemoLoading(false);
    }
  }

  async function sendOutreach(lead: Lead) {
    const demoUrl = lead.demo_url || `${window.location.origin}/demo/${lead.id}`;
    const res = await fetch('/api/outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead, demoUrl, channel: form.channel })
    });
    const data = (await res.json()) as { subject?: string; body?: string; sent?: boolean; error?: string };
    if (data.error) throw new Error(data.error);

    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id
          ? {
              ...item,
              outreach_subject: data.subject || item.outreach_subject,
              outreach_body: data.body || item.outreach_body,
              status: data.sent ? 'outreach_sent' : item.status
            }
          : item
      )
    );

    if (data.sent) {
      setCampaign((current) => ({
        ...current,
        outreach_sent: current.outreach_sent + 1
      }));
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="mb-8 flex items-center gap-3">
          <div className="brand-mark">L</div>
          <div>
            <p className="text-xl font-extrabold leading-none tracking-[-0.03em]">LeadDrive</p>
            <p className="eyebrow mt-1">Agency OS</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button className="nav-item active">
            <LayoutDashboard size={17} />
            Pipeline
          </button>
          <button className="nav-item">
            <Radar size={17} />
            Sources
          </button>
          <button className="nav-item">
            <Sparkles size={17} />
            Demo Studio
          </button>
          <button className="nav-item">
            <Mail size={17} />
            Outreach
          </button>
        </nav>

        <div className="mt-10 border-t border-[color:var(--line)] pt-5">
          <p className="eyebrow">Queue Health</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[color:var(--muted)]">Reply rate</span>
              <span className="font-semibold">{conversionRate}%</span>
            </div>
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${Math.min(conversionRate, 100)}%` }} />
            </div>
            <div className="flex items-center gap-2 text-[color:var(--muted)]">
              <Clock3 size={15} />
              {campaign.status}
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0">
        <header className="topbar panel grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="eyebrow mb-3">AI Cold Outreach Automation</p>
            <h1 className="section-title">Find weak digital presence. Send a live fix.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
              Source prospects, score their online presence, build a personalized demo, and send the outreach from one focused workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn secondary">
              <Bot size={15} />
              Prompts
            </button>
            <button className="btn" onClick={launchCampaign} disabled={loading}>
              <Play size={15} />
              {loading ? 'Running' : 'Run'}
            </button>
          </div>
        </header>

        <section className="mb-5 grid gap-3 md:grid-cols-4">
          {metrics.map(({ label, key, icon: Icon }) => (
            <div className="panel panel-pad metric" key={key}>
              <div className="mb-5 flex items-center justify-between">
                <span className="eyebrow">{label}</span>
                <Icon size={16} className="text-[color:var(--muted)]" />
              </div>
              <p className="metric-value">{campaign[key]}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[430px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="panel panel-pad">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Campaign</p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em]">Audience brief</h2>
                </div>
                <span className="status-pill">
                  <CheckCircle2 size={13} />
                  {campaign.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label" htmlFor="audience">
                    Target audience
                  </label>
                  <textarea
                    id="audience"
                    className="field min-h-24 resize-none"
                    value={form.audience}
                    onChange={(event) => setForm({ ...form, audience: event.target.value })}
                  />
                </div>

                <div>
                  <label className="label" htmlFor="locations">
                    Target locations
                  </label>
                  <textarea
                    id="locations"
                    className="field min-h-20 resize-none"
                    placeholder="Austin, TX; Dallas, TX; London, UK"
                    value={form.locations}
                    onChange={(event) => setForm({ ...form, locations: event.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <SelectField
                    label="Demo"
                    value={form.demoType}
                    onChange={(value) => setForm({ ...form, demoType: value as DemoType })}
                    options={[
                      ['website', 'Website'],
                      ['landing_page', 'Landing'],
                      ['app_mockup', 'App mockup']
                    ]}
                  />
                  <SelectField
                    label="Channel"
                    value={form.channel}
                    onChange={(value) => setForm({ ...form, channel: value as OutreachChannel })}
                    options={[
                      ['email', 'Email'],
                      ['linkedin', 'LinkedIn']
                    ]}
                  />
                </div>

                <div>
                  <label className="label">Lead source</label>
                  <div className="grid grid-cols-3 gap-2">
                    {sourceOptions.map(({ value, label, icon: Icon }) => (
                      <button
                        className={`nav-item justify-center ${form.source === value ? 'active' : ''}`}
                        key={value}
                        onClick={() => setForm({ ...form, source: value })}
                      >
                        <Icon size={15} />
                        <span className="text-xs">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="sourcePayload">
                    Source input
                  </label>
                  <textarea
                    id="sourcePayload"
                    className="field min-h-36 resize-none font-mono text-xs leading-5"
                    value={form.sourcePayload}
                    onChange={(event) => setForm({ ...form, sourcePayload: event.target.value })}
                  />
                </div>
              </div>
            </div>

            {selectedLead && (
              <div className="panel panel-pad preview-grid text-white">
                <p className="eyebrow text-white/72">Live Demo Hook</p>
                <h2 className="mt-2 max-w-sm text-3xl font-extrabold leading-[1.02] tracking-[-0.04em]">
                  {selectedLead.company_name} conversion preview
                </h2>
                <div className="mt-8 rounded-[24px] border border-white/25 bg-white/16 p-4 shadow-2xl backdrop-blur-2xl">
                  <div className="mb-4 h-28 rounded-[18px] bg-white/88" />
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 rounded-full bg-white/86" />
                    <div className="h-3 w-1/2 rounded-full bg-[color:var(--blue-2)]" />
                    <div className="mt-4 h-10 w-36 rounded-full bg-white/95" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="panel overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--line)] p-5">
                <div>
                  <p className="eyebrow">Prospects</p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em]">Qualification queue</h2>
                </div>
                <button className="btn secondary">
                  Export
                  <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="glass-table w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-white/48 text-[11px] font-semibold text-[color:var(--muted)]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Prospect</th>
                      <th className="px-4 py-3 font-semibold">Score</th>
                      <th className="px-4 py-3 font-semibold">Weakness</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Signals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr
                        className={`border-t border-[color:var(--line)] hover:bg-white/56 ${selectedLead?.id === lead.id ? 'bg-white/72' : ''}`}
                        key={lead.id}
                        onClick={() => setSelectedId(lead.id)}
                      >
                        <td className="px-4 py-4">
                          <p className="font-semibold">{lead.company_name}</p>
                          <p className="mt-1 text-xs text-[color:var(--muted)]">
                            {[lead.city, lead.website_url || lead.source].filter(Boolean).join(' · ')}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-semibold">{lead.fit_score}</span>
                            <div className="score-bar w-24">
                              <div className="score-fill" style={{ width: `${lead.fit_score}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="max-w-xs px-4 py-4 text-[color:var(--muted)]">{lead.weakness}</td>
                        <td className="px-4 py-4">
                          <span className="status-pill">{lead.status.replace('_', ' ')}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {lead.signals.slice(0, 2).map((signal) => (
                              <span className="status-pill" key={signal.label}>
                                {signal.label}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedLead && (
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="panel panel-pad">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="eyebrow">AI Finding</p>
                      <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em]">{selectedLead.company_name}</h2>
                    </div>
                    <button className="btn" onClick={() => createDemo(selectedLead)} disabled={demoLoading}>
                      <Wand2 size={15} />
                      {demoLoading ? 'Building' : 'Demo'}
                    </button>
                  </div>
                  <p className="text-base leading-7 text-[color:var(--muted)]">{selectedLead.qualification_reason}</p>
                  <div className="mt-5 space-y-3 border-t border-[color:var(--line)] pt-4">
                    {selectedLead.signals.map((signal) => (
                      <div className="flex items-start justify-between gap-4" key={signal.label}>
                        <div>
                          <p className="font-semibold">{signal.label}</p>
                          <p className="text-sm text-[color:var(--muted)]">{signal.value}</p>
                        </div>
                        <span className="status-pill">{signal.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel panel-pad">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="eyebrow">Outreach</p>
                      <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em]">Message</h2>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn secondary" title="Track clicks">
                        <MousePointerClick size={15} />
                      </button>
                      <button className="btn" title="Send outreach" onClick={() => sendOutreach(selectedLead)}>
                        <Send size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="border-y border-[color:var(--line)] py-4">
                    <p className="eyebrow">Subject</p>
                    <p className="mt-1 font-semibold">{selectedLead.outreach_subject}</p>
                  </div>
                  <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-[color:var(--muted)]">
                    {selectedLead.outreach_body}
                  </pre>
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-[color:var(--line)] pt-4">
                    {selectedLead.demo_url && (
                      <a className="btn secondary" href={selectedLead.demo_url} target="_blank" rel="noreferrer">
                        Open demo
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <span className="status-pill">
                      Opens {selectedLead.opens}
                    </span>
                    <span className="status-pill">
                      Clicks {selectedLead.clicks}
                    </span>
                    <span className="status-pill">
                      Replies {selectedLead.replies}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
