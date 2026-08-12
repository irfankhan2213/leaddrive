'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ExternalLink,
  Kanban,
  Loader2,
  Mail,
  MousePointerClick,
  Play,
  RefreshCw,
  Search,
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
  const [campaign, setCampaign] = useState<Campaign>({
    ...sampleCampaign,
    keywords: [
      'High-ticket wellness clinics Austin TX',
      'Medical aesthetics & med spa Austin',
      'Botox & skin rejuvenation Dallas TX',
      'Cosmetic laser clinic Houston TX'
    ]
  });
  const [leads, setLeads] = useState<Lead[]>(sampleLeads);
  const [selectedId, setSelectedId] = useState<string | undefined>(sampleLeads[0]?.id);
  const [selectedDemoLeadId, setSelectedDemoLeadId] = useState<string | undefined>(sampleLeads[0]?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoGeneratingId, setDemoGeneratingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const res = await fetch('/api/campaigns');
        const data = (await res.json()) as { campaigns?: Campaign[]; leads?: Lead[] };
        if (data.campaigns && data.campaigns.length > 0) {
          setCampaign(data.campaigns[0]);
          if (data.leads && data.leads.length > 0) {
            setLeads(data.leads);
            setSelectedId(data.leads[0]?.id);
            setSelectedDemoLeadId(data.leads[0]?.id);
          }
        }
      } catch {
        // Fallback to sample data
      }
    }
    loadInitialData();
  }, []);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedId) || leads[0],
    [leads, selectedId]
  );

  const selectedDemoLead = useMemo(
    () => leads.find((lead) => lead.id === selectedDemoLeadId) || leads.find((l) => l.demo_url) || leads[0],
    [leads, selectedDemoLeadId]
  );

  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const q = searchQuery.toLowerCase();
    return leads.filter(
      (l) =>
        l.company_name.toLowerCase().includes(q) ||
        (l.city && l.city.toLowerCase().includes(q)) ||
        (l.contact_name && l.contact_name.toLowerCase().includes(q)) ||
        (l.matched_keyword && l.matched_keyword.toLowerCase().includes(q))
    );
  }, [leads, searchQuery]);

  // Computed metrics from real leads & campaign state
  const computedMetrics = useMemo(() => {
    const totalProspects = leads.length;
    const qualified = leads.filter((l) => l.fit_score >= 70).length;
    const demosBuilt = leads.filter((l) => ['demo_ready', 'outreach_sent', 'replied', 'converted'].includes(l.status)).length;
    const messagesSent = leads.filter((l) => ['outreach_sent', 'replied', 'converted'].includes(l.status)).length;
    const replies = leads.filter((l) => ['replied', 'converted'].includes(l.status)).length;
    const conversions = leads.filter((l) => l.status === 'converted').length;
    const convRate = totalProspects > 0 ? ((replies / totalProspects) * 100).toFixed(1) : '0.0';

    return {
      totalProspects: totalProspects.toLocaleString(),
      demosBuilt: demosBuilt.toLocaleString(),
      messagesSent: messagesSent.toLocaleString(),
      convRate: `${convRate}%`,
      qualifiedCount: qualified,
      conversionsCount: conversions
    };
  }, [leads]);

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

      if (data.campaign && data.leads) {
        setCampaign(data.campaign);
        setLeads(data.leads);
        setSelectedId(data.leads[0]?.id);
        setSelectedDemoLeadId(data.leads[0]?.id);
        setNotice({
          type: 'success',
          text: `Scraped multi-keyword campaign with ${data.leads.length} lead${data.leads.length === 1 ? '' : 's'} across ${data.campaign.keywords?.length || 4} search queries!`
        });
      }
    } catch (err) {
      setNotice({ type: 'error', text: err instanceof Error ? err.message : 'Campaign launch failed.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateDemo(targetLead: Lead, provider: 'v0' | 'local' = 'v0') {
    setDemoGeneratingId(targetLead.id);
    setNotice(null);
    try {
      const res = await fetch('/api/demos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: targetLead, provider })
      });
      const data = (await res.json()) as {
        demoUrl?: string;
        provider?: string;
        status?: string;
        error?: string;
      };

      if (data.error && data.status === 'failed') throw new Error(data.error);

      const newDemoUrl = data.demoUrl || `/demo/${targetLead.id}`;
      const updatedLeads = leads.map((l) =>
        l.id === targetLead.id
          ? { ...l, status: 'demo_ready' as const, demo_url: newDemoUrl }
          : l
      );
      setLeads(updatedLeads);

      if (data.error) {
        setNotice({ type: 'info', text: data.error });
      } else {
        setNotice({
          type: 'success',
          text: `${data.provider === 'v0' ? 'v0 AI' : 'Personalized'} Demo generated for ${targetLead.company_name}!`
        });
      }
    } catch (err) {
      setNotice({
        type: 'error',
        text: err instanceof Error ? err.message : 'Demo generation failed.'
      });
    } finally {
      setDemoGeneratingId(null);
    }
  }

  // Pipeline kanban columns derived from real leads
  const pipelineColumns = useMemo(() => {
    return {
      prospecting: leads.filter((l) => ['new', 'scraped'].includes(l.status)),
      qualified: leads.filter((l) => l.status === 'qualified'),
      demoReady: leads.filter((l) => l.status === 'demo_ready'),
      outreachSent: leads.filter((l) => l.status === 'outreach_sent'),
      closed: leads.filter((l) => ['replied', 'converted'].includes(l.status))
    };
  }, [leads]);

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
              : 'Outreach Pipeline'
          }
          subtitle={
            activeTab === 'dashboard'
              ? 'Your automated multi-keyword web scraping & outreach engine performance.'
              : activeTab === 'prospecting'
              ? 'Multi-query account intelligence, digital vulnerabilities, and customized pitches.'
              : activeTab === 'demos'
              ? 'Interactive AI-generated demo previews for high-intent prospects.'
              : 'Track lead stages, deal flow, and booked meetings.'
          }
          onNewCampaignClick={() => setIsModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Campaign Keywords Banner */}
        {campaign.keywords && campaign.keywords.length > 0 && (
          <div className="mb-4 p-3 rounded-2xl bg-blue-50/70 border border-blue-200/70 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-extrabold text-blue-900 mr-2">
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>Active Campaign Search Queries ({campaign.keywords.length}):</span>
            </div>
            {campaign.keywords.map((kw, i) => (
              <span
                key={i}
                className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white text-blue-800 border border-blue-200 shadow-xs"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Global Notice Alert */}
        {notice && (
          <div
            className={`mb-4 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold ${
              notice.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : notice.type === 'info'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
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
            {/* KPI Cards Grid — Powered by Real State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Total Prospects"
                value={computedMetrics.totalProspects}
                badge={`${campaign.qualified} qualified`}
                icon={Users}
              />
              <MetricCard
                label="Demos Built"
                value={computedMetrics.demosBuilt}
                badge="AI Active"
                icon={Wand2}
              />
              <MetricCard
                label="Messages Sent"
                value={computedMetrics.messagesSent}
                badge="Outreach"
                icon={Send}
              />
              <MetricCard
                label="Conversion Rate"
                value={computedMetrics.convRate}
                badge={`${computedMetrics.conversionsCount} converted`}
                icon={Target}
              />
            </div>

            {/* Middle Section: Campaign Performance Chart + Live Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <CampaignChart leads={leads} />
              </div>
              <div className="lg:col-span-5">
                <ActivityFeed leads={leads} />
              </div>
            </div>

            {/* Bottom Section: Lead Source Performance Table */}
            <div>
              <SourceTable leads={leads} />
            </div>
          </div>
        )}

        {/* 2. PROSPECTING HUB TAB */}
        {activeTab === 'prospecting' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Accounts List */}
            <div className="lg:col-span-5 panel p-5">
              <h3 className="text-base font-extrabold text-gray-900 mb-1">Target Accounts</h3>
              <p className="text-xs text-gray-500 mb-4">Select an account to view multi-keyword discovery analysis</p>
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
                          <div className="text-xs text-gray-500 font-medium">{lead.city || 'Service Area'}</div>
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Score: {lead.fit_score}/100
                        </span>
                      </div>
                      {lead.matched_keyword && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-blue-700">
                          <Search className="w-2.5 h-2.5" />
                          <span>Scraped via: "{lead.matched_keyword}"</span>
                        </div>
                      )}
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
                      <span className="text-xs font-extrabold text-gray-900 uppercase">{selectedLead.source.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {selectedLead.matched_keyword && (
                    <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between text-xs font-bold text-blue-950">
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-blue-600" />
                        <span>Matched Search Query:</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-white text-blue-800 border border-blue-200 shadow-2xs">
                        "{selectedLead.matched_keyword}"
                      </span>
                    </div>
                  )}

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
                        `Lead with conversion gap. Pitch our personalized 1-click preview package as a direct ROI booster.`}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                      Key Decision Maker
                    </h4>
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                          {selectedLead.contact_name?.[0] || 'C'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{selectedLead.contact_name || 'Contact Person'}</div>
                          <div className="text-[11px] text-gray-500 font-medium">Decision Maker</div>
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

        {/* 3. AI DEMO LAB TAB — Real State & v0 Generator Powered */}
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
              {/* Active Demos List (from real leads) */}
              <div className="space-y-3">
                {leads.map((lead) => {
                  const isSelected = lead.id === selectedDemoLead?.id;
                  const isReady = ['demo_ready', 'outreach_sent', 'replied', 'converted'].includes(lead.status) || Boolean(lead.demo_url);
                  const isGenerating = demoGeneratingId === lead.id;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedDemoLeadId(lead.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected ? 'bg-blue-50/80 border-blue-500 shadow-sm' : 'bg-white border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-extrabold text-gray-900">{lead.company_name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isGenerating
                              ? 'bg-blue-100 text-blue-800'
                              : isReady
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isGenerating ? 'Generating...' : isReady ? 'Ready' : 'Pending'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Recipient: {lead.contact_name || lead.company_name}</div>
                      <div className="mt-2 text-[11px] font-semibold text-blue-600 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{lead.demo_type || 'website'} demo</span>
                        </span>
                        {lead.demo_url && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {lead.demo_url.includes('v0') ? 'v0 AI' : 'Local Preview'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Demo Preview Canvas */}
              {selectedDemoLead ? (
                <div className="lg:col-span-2 border border-gray-200/80 rounded-2xl p-6 bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col justify-between min-h-[400px] shadow-xl">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-mono text-gray-400 ml-2">
                        {selectedDemoLead.demo_url || `/demo/${selectedDemoLead.id}`}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-blue-400">{selectedDemoLead.company_name} Preview</span>
                  </div>

                  <div className="my-8 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-2">
                      <Bot className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-extrabold tracking-tight">{selectedDemoLead.company_name} AI Demo Concept</h4>
                    <p className="text-xs text-gray-400 max-w-md mx-auto line-clamp-2">
                      {selectedDemoLead.weakness}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => handleGenerateDemo(selectedDemoLead, 'v0')}
                        disabled={demoGeneratingId === selectedDemoLead.id}
                        className="btn text-xs px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        {demoGeneratingId === selectedDemoLead.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Building v0 AI Component...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>{selectedDemoLead.demo_url?.includes('v0') ? 'Re-Generate v0 Demo' : 'Generate v0 AI Demo'}</span>
                          </>
                        )}
                      </button>

                      <a
                        href={selectedDemoLead.demo_url || `/demo/${selectedDemoLead.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn secondary text-xs px-5 py-2.5 border-gray-700 text-gray-200 hover:bg-gray-800 rounded-xl flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-blue-400" />
                        <span>Launch Full Preview</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-800/80 pt-3">
                    <span>Model: {selectedDemoLead.demo_type || 'website'} builder</span>
                    <span>Status: {selectedDemoLead.status}</span>
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-2 border border-gray-200/80 rounded-2xl p-12 text-center text-gray-500">
                  Select a lead to inspect its AI demo preview.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. OUTREACH PIPELINE TAB — Powered by Real Leads */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="panel p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Outreach Pipeline</h3>
                <p className="text-xs text-gray-500">Real lead stage tracking and campaign deal flow</p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Total Leads</span>
                  <span className="text-base font-extrabold text-gray-900">{leads.length}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Qualified</span>
                  <span className="text-base font-extrabold text-emerald-600">{computedMetrics.qualifiedCount}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Column 1: Prospecting */}
              <div className="panel p-4 bg-gray-50/50">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                    Prospecting ({pipelineColumns.prospecting.length})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                </div>
                <div className="space-y-3">
                  {pipelineColumns.prospecting.map((l) => (
                    <div key={l.id} className="p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-sm">
                      <div className="font-bold text-xs text-gray-900">{l.company_name}</div>
                      <div className="text-[11px] text-gray-500">{l.city || 'Target Market'}</div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-bold">Score {l.fit_score}</span>
                        <span className="text-gray-400 uppercase">{l.source.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                  {pipelineColumns.prospecting.length === 0 && (
                    <div className="text-[11px] text-gray-400 text-center py-4">No leads in prospecting</div>
                  )}
                </div>
              </div>

              {/* Column 2: Qualified */}
              <div className="panel p-4 bg-gray-50/50">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                    Qualified ({pipelineColumns.qualified.length})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div className="space-y-3">
                  {pipelineColumns.qualified.map((l) => (
                    <div key={l.id} className="p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-sm">
                      <div className="font-bold text-xs text-gray-900">{l.company_name}</div>
                      <div className="text-[11px] text-gray-500">{l.contact_name || 'Verified Contact'}</div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">Score {l.fit_score}</span>
                        <span className="text-gray-400">Qualified</span>
                      </div>
                    </div>
                  ))}
                  {pipelineColumns.qualified.length === 0 && (
                    <div className="text-[11px] text-gray-400 text-center py-4">No qualified leads</div>
                  )}
                </div>
              </div>

              {/* Column 3: Demo Ready */}
              <div className="panel p-4 bg-gray-50/50">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700">
                    Demo Ready ({pipelineColumns.demoReady.length})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                </div>
                <div className="space-y-3">
                  {pipelineColumns.demoReady.map((l) => (
                    <div key={l.id} className="p-3.5 rounded-xl bg-white border border-purple-200 shadow-sm">
                      <div className="font-bold text-xs text-gray-900">{l.company_name}</div>
                      <div className="text-[11px] text-gray-500">{l.demo_type || 'website'} demo ready</div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">Demo Built</span>
                        <a href={l.demo_url || `/demo/${l.id}`} target="_blank" rel="noreferrer" className="text-purple-600 font-bold underline">
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                  {pipelineColumns.demoReady.length === 0 && (
                    <div className="text-[11px] text-gray-400 text-center py-4">No demo-ready leads</div>
                  )}
                </div>
              </div>

              {/* Column 4: Outreach & Replied */}
              <div className="panel p-4 bg-gray-50/50">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                    Outreach Sent ({pipelineColumns.outreachSent.length + pipelineColumns.closed.length})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-3">
                  {[...pipelineColumns.outreachSent, ...pipelineColumns.closed].map((l) => (
                    <div key={l.id} className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-sm">
                      <div className="font-bold text-xs text-gray-900">{l.company_name}</div>
                      <div className="text-[11px] text-gray-500">{l.contact_name || 'Contact'}</div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                          {l.status === 'replied' ? 'Replied' : l.status === 'converted' ? 'Converted' : 'Sent'}
                        </span>
                        <span className="text-gray-400">{l.opens} opens</span>
                      </div>
                    </div>
                  ))}
                  {pipelineColumns.outreachSent.length + pipelineColumns.closed.length === 0 && (
                    <div className="text-[11px] text-gray-400 text-center py-4">No outreach sent yet</div>
                  )}
                </div>
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
