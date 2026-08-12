'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ExternalLink,
  Kanban,
  Mail,
  MousePointerClick,
  Play,
  Send,
  Sparkles,
  Target,
  Users,
  Wand2,
  Zap
} from 'lucide-react';
import { sampleCampaign, sampleLeads } from '@/lib/mock-data';
import type { Campaign, CampaignInput, Lead } from '@/lib/types';

import { Sidebar, NavTab } from '@/components/sidebar';
import { Header } from '@/components/header';
import { MetricCard } from '@/components/metric-card';
import { CampaignChart } from '@/components/campaign-chart';
import { ActivityFeed } from '@/components/activity-feed';
import { SourceTable } from '@/components/source-table';
import { NewCampaignModal } from '@/components/new-campaign-modal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [campaign, setCampaign] = useState<Campaign>(sampleCampaign);
  const [leads, setLeads] = useState<Lead[]>(sampleLeads);
  const [selectedId, setSelectedId] = useState<string | undefined>(sampleLeads[0]?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedId) || leads[0],
    [leads, selectedId]
  );

  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const q = searchQuery.toLowerCase();
    return leads.filter(
      (l) =>
        l.company_name.toLowerCase().includes(q) ||
        (l.city && l.city.toLowerCase().includes(q)) ||
        (l.contact_name && l.contact_name.toLowerCase().includes(q))
    );
  }, [leads, searchQuery]);

  async function handleLaunchCampaign(input: CampaignInput) {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      const data = (await res.json()) as { campaign: Campaign; leads: Lead[]; error?: string };
      if (data.error) throw new Error(data.error);
      setCampaign(data.campaign);
      setLeads(data.leads);
      setSelectedId(data.leads[0]?.id);
      setNotice({
        type: 'success',
        text: `Launched campaign with ${data.leads.length} lead${data.leads.length === 1 ? '' : 's'}!`
      });
    } catch (err) {
      setNotice({ type: 'error', text: err instanceof Error ? err.message : 'Campaign launch failed.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content View */}
      <main className="flex flex-col min-w-0 pb-8">
        {/* Header Bar */}
        <Header
          title={
            activeTab === 'dashboard'
              ? 'Overview'
              : activeTab === 'prospecting'
              ? 'Prospecting Hub'
              : activeTab === 'demos'
              ? 'AI Demo Lab'
              : activeTab === 'pipeline'
              ? 'Outreach Pipeline'
              : 'Settings'
          }
          subtitle={
            activeTab === 'dashboard'
              ? 'Your automated outreach engine performance.'
              : activeTab === 'prospecting'
              ? 'Account intelligence, digital vulnerabilities, and customized pitches.'
              : activeTab === 'demos'
              ? 'Interactive AI-generated demo previews for high-intent prospects.'
              : activeTab === 'pipeline'
              ? 'Track lead stages, deal flow, and booked meetings.'
              : 'System parameters, brand identity, and AI prompt controls.'
          }
          onNewCampaignClick={() => setIsModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Global Notice Alert */}
        {notice && (
          <div
            className={`mb-4 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold ${
              notice.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{notice.text}</span>
            <button onClick={() => setNotice(null)} className="underline hover:opacity-80">
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Tab Contents */}

        {/* 1. COMMAND CENTER (DASHBOARD) TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Total Prospects"
                value="14,285"
                badge="+12% vs last mo"
                icon={Users}
              />
              <MetricCard
                label="Demos Built"
                value="3,492"
                badge="+15% vs last mo"
                icon={Wand2}
              />
              <MetricCard
                label="Messages Sent"
                value="89,104"
                badge="+22% vs last mo"
                icon={Send}
              />
              <MetricCard
                label="Conversion Rate"
                value="4.2%"
                badge="+0.5% vs last mo"
                icon={Target}
              />
            </div>

            {/* Middle Section: Campaign Performance Chart + Live Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <CampaignChart />
              </div>
              <div className="lg:col-span-5">
                <ActivityFeed />
              </div>
            </div>

            {/* Bottom Section: Lead Source Performance Table */}
            <div>
              <SourceTable />
            </div>
          </div>
        )}

        {/* 2. PROSPECTING HUB TAB */}
        {activeTab === 'prospecting' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Accounts List */}
            <div className="lg:col-span-5 panel p-5">
              <h3 className="text-base font-extrabold text-gray-900 mb-1">Target Accounts</h3>
              <p className="text-xs text-gray-500 mb-4">Select an account to view vulnerability analysis</p>
              <div className="space-y-2.5">
                {filteredLeads.map((lead) => {
                  const isSelected = lead.id === selectedLead?.id;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedId(lead.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500/80 shadow-sm'
                          : 'bg-white/60 border-gray-100 hover:bg-white hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-extrabold text-sm text-gray-900">{lead.company_name}</div>
                          <div className="text-xs text-gray-500 font-medium">{lead.city || 'Austin, TX'}</div>
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Score: {lead.fit_score}/100
                        </span>
                      </div>
                      <div className="mt-2 text-xs font-semibold text-gray-700 line-clamp-1">
                        {lead.weakness || 'Digital gap analysis in progress'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Account Detail & Pitch Angle */}
            <div className="lg:col-span-7 panel p-6">
              {selectedLead ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-gray-900">{selectedLead.company_name}</h2>
                      {selectedLead.website_url && (
                        <a
                          href={selectedLead.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"
                        >
                          <span>{selectedLead.website_url}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-400 block">Outreach Channel</span>
                      <span className="text-xs font-extrabold text-gray-900 uppercase">Email & LinkedIn</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                      Identified Vulnerabilities
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs font-bold text-amber-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>{selectedLead.weakness}</span>
                      </div>
                      {selectedLead.signals?.map((sig, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-amber-50/40 border border-amber-100 text-xs font-semibold text-amber-900 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span>{sig.label}: {sig.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                      Recommended Pitch Angle
                    </h4>
                    <div className="p-4 rounded-2xl bg-white border border-gray-200/80 text-xs leading-relaxed font-medium text-gray-800 shadow-sm">
                      {selectedLead.qualification_reason ||
                        `"Lead with performance impact. SynergyFlow is losing signups due to mobile friction. Pitch our personalized 1-click preview package as a direct ROI booster."`}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                      Key Decision Makers
                    </h4>
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                          {selectedLead.contact_name?.[0] || 'C'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{selectedLead.contact_name || 'Sarah Jenkins'}</div>
                          <div className="text-[11px] text-gray-500 font-medium">VP of Sales / Marketing</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        Verified Contact
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400">Select an account to view details</div>
              )}
            </div>
          </div>
        )}

        {/* 3. AI DEMO LAB TAB */}
        {activeTab === 'demos' && (
          <div className="panel p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Active AI Demos</h3>
                <p className="text-xs text-gray-500">Manage and preview personalized AI experiences built for prospects</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Live Preview Mode</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Demos List */}
              <div className="space-y-3">
                {[
                  { name: 'Acme Corp Enterprise Rollout', lead: 'Sarah Jenkins', type: 'Interactive Web', status: 'Ready' },
                  { name: 'Globex AI Integration', lead: 'Mark Davis', type: 'Predictive ML', status: 'Ready' },
                  { name: 'Intech Mobile Revamp', lead: 'Bill Lonberg', type: 'UX Redesign', status: 'Generating' }
                ].map((demo, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      idx === 0 ? 'bg-blue-50/80 border-blue-500 shadow-sm' : 'bg-white border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-gray-900">{demo.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          demo.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {demo.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">Recipient: {demo.lead}</div>
                    <div className="mt-2 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{demo.type}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Demo Preview Canvas */}
              <div className="lg:col-span-2 border border-gray-200/80 rounded-2xl p-6 bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col justify-between min-h-[360px] shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-gray-400 ml-2">preview.leaddrive.app/demo/acme-corp</span>
                  </div>
                  <span className="text-xs font-bold text-blue-400">Acme Corp Preview</span>
                </div>

                <div className="my-8 text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-2">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-extrabold tracking-tight">Acme Corp Enterprise Rollout</h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Customized workflow analysis built specifically for Sarah Jenkins & team.
                  </p>
                  <div className="pt-4">
                    <button className="btn text-xs px-6 py-2">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Launch Interactive Demo</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-800/80 pt-3">
                  <span>AI Model: Gemini 3.6 Flash</span>
                  <span>Generated 2h ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. OUTREACH PIPELINE TAB */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="panel p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Outreach Pipeline</h3>
                <p className="text-xs text-gray-500">Kanban stage tracking and revenue potential</p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Total Value</span>
                  <span className="text-base font-extrabold text-gray-900">$2.4M</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Conv. Rate</span>
                  <span className="text-base font-extrabold text-emerald-600">18.5%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Prospecting */}
              <div className="panel p-4 bg-gray-50/50">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700">Prospecting (45)</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-sm">
                    <div className="font-bold text-xs text-gray-900">Acme Corp</div>
                    <div className="text-[11px] text-gray-500">Sarah Jenkins • VP Sales</div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">$120k</span>
                      <span className="text-gray-400">2h ago</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-sm">
                    <div className="font-bold text-xs text-gray-900">Globex Inc</div>
                    <div className="text-[11px] text-gray-500">Mark Davis • CTO</div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">$85k</span>
                      <span className="text-gray-400">1d ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Demo Sent */}
              <div className="panel p-4 bg-gray-50/50">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700">Demo Sent (12)</span>
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-sm">
                    <div className="font-bold text-xs text-gray-900">Stark Industries</div>
                    <div className="text-[11px] text-gray-500">Tony S. • Head of R&D</div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">$450k</span>
                      <span className="text-gray-400">4h ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Meeting Booked */}
              <div className="panel p-4 bg-gray-50/50">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">Meeting Booked (6)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-sm">
                    <div className="font-bold text-xs text-gray-900">TechFlow</div>
                    <div className="text-[11px] text-gray-500">David Chen • Founder</div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">$210k</span>
                      <span className="text-emerald-600 font-bold">Tomorrow 2:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="panel p-6 max-w-3xl space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">General Settings</h3>
              <p className="text-xs text-gray-500">Personalize how LeadDrive represents your brand</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Brand Name</label>
                <input type="text" defaultValue="Acme Corp" className="field text-xs" />
              </div>

              <div>
                <label className="label">Tagline (Optional)</label>
                <input type="text" defaultValue="Innovating the future." className="field text-xs" />
              </div>

              <div>
                <label className="label">AI Formality Level</label>
                <select className="field text-xs font-semibold">
                  <option>Casual</option>
                  <option>Strictly Formal</option>
                  <option>Enthusiastic</option>
                  <option>Moderate</option>
                  <option>Reserved</option>
                </select>
              </div>

              <div>
                <label className="label">Custom AI Instructions</label>
                <textarea
                  rows={3}
                  defaultValue="E.g., Always mention our 24/7 support availability..."
                  className="field text-xs resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button className="btn secondary text-xs">Cancel</button>
                <button className="btn text-xs px-6">Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Modal for Launching New Campaigns */}
        <NewCampaignModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLaunch={handleLaunchCampaign}
          loading={loading}
        />
      </main>
    </div>
  );
}
