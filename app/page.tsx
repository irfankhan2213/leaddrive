'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  ExternalLink,
  Instagram,
  Kanban,
  Loader2,
  Mail,
  MessageSquare,
  Monitor,
  MousePointerClick,
  Phone,
  Play,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Tablet,
  Target,
  Users,
  Wand2,
  XCircle,
  Zap
} from 'lucide-react';
import { sampleCampaign, sampleLeads } from '@/lib/mock-data';
import type { AppSettings, Campaign, CampaignInput, Lead, OutreachChannel } from '@/lib/types';
import { defaultSettings, getStoredSettings, saveStoredSettings } from '@/lib/settings';

import { Sidebar, NavTab } from '@/components/sidebar';
import { Header } from '@/components/header';
import { MetricCard } from '@/components/metric-card';
import { CampaignChart } from '@/components/campaign-chart';
import { ActivityFeed } from '@/components/activity-feed';
import { SourceTable } from '@/components/source-table';
import { NewCampaignModal } from '@/components/new-campaign-modal';
import { SettingsView } from '@/components/settings-view';
import { HelpView } from '@/components/help-view';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [campaign, setCampaign] = useState<Campaign>({
    ...sampleCampaign,
    keywords: []
  });
  const [leads, setLeads] = useState<Lead[]>(sampleLeads);
  const [selectedId, setSelectedId] = useState<string | undefined>(sampleLeads[0]?.id);
  const [selectedDemoLeadId, setSelectedDemoLeadId] = useState<string | undefined>(sampleLeads[0]?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoGeneratingId, setDemoGeneratingId] = useState<string | null>(null);
  const [batchDemoLoading, setBatchDemoLoading] = useState(false);
  const [batchOutreachLoading, setBatchOutreachLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [outreachChannel, setOutreachChannel] = useState<OutreachChannel>('email');
  const [outreachNotice, setOutreachNotice] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    const loadedSettings = getStoredSettings();
    setSettings(loadedSettings);

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
        // Keep the dashboard empty until real campaign data exists.
      }
    }
    loadInitialData();
  }, []);

  function handleSaveSettings(updated: AppSettings) {
    setSettings(updated);
    saveStoredSettings(updated);
    const providerName =
      updated.aiProvider === 'vertex'
        ? 'Google Cloud Vertex AI'
        : updated.aiProvider === 'gemini'
        ? 'Google Gemini'
        : 'Anthropic Claude';
    setNotice({
      type: 'success',
      text: `Updated settings! Active AI provider set to ${providerName} (${updated.aiModel || updated.vertexModel || 'gemini-2.5-flash'}).`
    });
  }

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
    const demosBuilt = leads.filter((l) => Boolean(l.demo_url && l.demo_url.startsWith('http'))).length;
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
        body: JSON.stringify({ ...input, settings })
      });
      const data = (await res.json()) as { campaign: Campaign; leads: Lead[]; error?: string };
      if (data.error) throw new Error(data.error);

      if (data.campaign && data.leads) {
        setCampaign(data.campaign);
        setLeads(data.leads);
        setSelectedId(data.leads[0]?.id);
        setSelectedDemoLeadId(data.leads[0]?.id);

        const generatedCount = data.leads.filter((l) => Boolean(l.demo_url && l.demo_url.startsWith('http'))).length;
        setNotice({
          type: 'success',
          text: `Scraped ${data.leads.length} real leads. ${generatedCount} v0 AI live demo${generatedCount === 1 ? '' : 's'} generated automatically!`
        });
      }
    } catch (err) {
      setNotice({ type: 'error', text: err instanceof Error ? err.message : 'Campaign launch failed.' });
    } finally {
      setLoading(false);
    }
  }

  // Generate Single v0 AI Demo
  async function handleGenerateDemo(targetLead: Lead) {
    setDemoGeneratingId(targetLead.id);
    setNotice(null);
    try {
      const res = await fetch('/api/demos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: targetLead, settings, demoQuality: 'low' })
      });
      const data = (await res.json()) as {
        demoUrl?: string;
        provider?: string;
        status?: string;
        error?: string;
      };

      if (data.error && data.status === 'failed') throw new Error(data.error);

      if (data.demoUrl) {
        const updatedLeads = leads.map((l) =>
          l.id === targetLead.id
            ? { ...l, status: 'demo_ready' as const, demo_url: data.demoUrl, demo_quality: 'low' as const }
            : l
        );
        setLeads(updatedLeads);
        setNotice({
          type: 'success',
          text: `Live v0 AI Site generated for ${targetLead.company_name}!`
        });
      }
    } catch (err) {
      setNotice({
        type: 'error',
        text: err instanceof Error ? err.message : 'v0 Demo generation failed.'
      });
    } finally {
      setDemoGeneratingId(null);
    }
  }

  // Auto-Generate All Pending v0 Demos
  async function handleAutoGenerateAllDemos() {
    const pendingLeads = leads.filter((l) => !l.demo_url || !l.demo_url.startsWith('http'));
    if (pendingLeads.length === 0) {
      setNotice({ type: 'info', text: 'All leads already have live v0 AI demos generated!' });
      return;
    }

    setBatchDemoLoading(true);
    setNotice({
      type: 'info',
      text: `Auto-generating live v0 AI demos for ${pendingLeads.length} leads in background...`
    });

    let successCount = 0;
    const currentLeads = [...leads];

    for (const lead of pendingLeads) {
      try {
        const res = await fetch('/api/demos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lead, settings, demoQuality: 'low' })
        });
        const data = (await res.json()) as { demoUrl?: string; status?: string };
        if (data.demoUrl) {
          successCount += 1;
          const idx = currentLeads.findIndex((l) => l.id === lead.id);
          if (idx !== -1) {
            currentLeads[idx] = {
              ...currentLeads[idx],
              status: 'demo_ready',
              demo_url: data.demoUrl,
              demo_quality: 'low'
            };
            setLeads([...currentLeads]);
          }
        }
      } catch {
        // Continue loop for remaining leads
      }
    }

    setBatchDemoLoading(false);
    setNotice({
      type: 'success',
      text: `Completed v0 generation! ${successCount} new live v0 demo${successCount === 1 ? '' : 's'} built successfully.`
    });
  }

  // Single Lead Outreach Dispatch (Email / SMS)
  async function handleSendOutreach(targetLead: Lead, channel: OutreachChannel) {
    setNotice(null);
    try {
      const res = await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: targetLead,
          channel,
          settings
        })
      });
      const data = (await res.json()) as {
        email?: { sent: boolean; messageId?: string; error?: string };
        sms?: { sent: boolean; messageId?: string; error?: string };
        overallSuccess?: boolean;
        error?: string;
      };

      if (data.error) throw new Error(data.error);

      if (data.overallSuccess) {
        setLeads((prev) =>
          prev.map((l) => (l.id === targetLead.id ? { ...l, status: 'outreach_sent' as const } : l))
        );
        setNotice({
          type: 'success',
          text: `Outreach dispatched via ${channel.toUpperCase()} to ${targetLead.company_name}!`
        });
      } else {
        const errDetails = data.email?.error || data.sms?.error || 'Dispatch incomplete';
        setNotice({ type: 'error', text: `Outreach warning: ${errDetails}` });
      }
    } catch (err) {
      setNotice({ type: 'error', text: err instanceof Error ? err.message : 'Outreach failed.' });
    }
  }

  // Batch Outreach Dispatch
  async function handleBatchOutreach(channel: OutreachChannel) {
    const readyLeads = leads.filter(
      (l) => l.status === 'demo_ready' || l.status === 'qualified' || Boolean(l.demo_url)
    );

    if (readyLeads.length === 0) {
      setNotice({ type: 'info', text: 'No qualified or demo-ready leads available for outreach.' });
      return;
    }

    setBatchOutreachLoading(true);
    setNotice({
      type: 'info',
      text: `Dispatching ${channel.toUpperCase()} outreach to ${readyLeads.length} leads...`
    });

    try {
      const res = await fetch('/api/outreach/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leads: readyLeads,
          channel,
          settings
        })
      });

      const data = (await res.json()) as {
        sentCount: number;
        failedCount: number;
        results: Array<{ leadId: string; emailSent?: boolean; smsSent?: boolean; error?: string }>;
        error?: string;
      };

      if (data.error) throw new Error(data.error);

      // Update lead statuses
      const sentIds = new Set(
        data.results.filter((r) => r.emailSent || r.smsSent).map((r) => r.leadId)
      );
      setLeads((prev) =>
        prev.map((l) => (sentIds.has(l.id) ? { ...l, status: 'outreach_sent' as const } : l))
      );

      setNotice({
        type: 'success',
        text: `Batch outreach complete! Successfully dispatched to ${data.sentCount} leads (${data.failedCount} skipped/failed).`
      });
    } catch (err) {
      setNotice({ type: 'error', text: err instanceof Error ? err.message : 'Batch outreach failed.' });
    } finally {
      setBatchOutreachLoading(false);
    }
  }

  // Pipeline kanban columns derived from real leads
  const pipelineColumns = useMemo(() => {
    return {
      prospecting: leads.filter((l) => ['new', 'scraped'].includes(l.status)),
      qualified: leads.filter((l) => l.status === 'qualified'),
      demoReady: leads.filter((l) => l.status === 'demo_ready' || Boolean(l.demo_url && l.demo_url.startsWith('http'))),
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
              ? 'AI Demo Lab (v0 Live Sites)'
              : activeTab === 'pipeline'
              ? 'Outreach & Dispatch Command'
              : 'Settings & Dispatch Engines'
          }
          subtitle={
            activeTab === 'dashboard'
              ? 'Multi-keyword web scraping, v0 AI live site creation, and Email & SMS cold outreach.'
              : activeTab === 'prospecting'
              ? 'Target accounts, audited conversion gaps, and 1-click personalized pitches.'
              : activeTab === 'demos'
              ? 'Interactive v0 AI live applications hosted on Vercel cloud.'
              : activeTab === 'pipeline'
              ? 'Dispatch Email (Resend) and SMS (Twilio) outreach with live variable replacement.'
              : 'Configure Vercel v0, Resend Email, Twilio SMS, and Google Gemini / Anthropic API keys.'
          }
          onNewCampaignClick={() => setIsModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Campaign Keywords Banner */}
        {activeTab !== 'settings' && campaign.keywords && campaign.keywords.length > 0 && (
          <div className="mb-4 p-3 rounded-2xl bg-blue-50/70 border border-blue-200/70 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-extrabold text-blue-900 mr-2">
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>Active Search Queries ({campaign.keywords.length}):</span>
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
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Total Prospects"
                value={computedMetrics.totalProspects}
                badge={`${campaign.qualified} qualified`}
                icon={Users}
              />
              <MetricCard
                label="v0 Demos Built"
                value={computedMetrics.demosBuilt}
                badge="Pure v0 AI"
                icon={Wand2}
              />
              <MetricCard
                label="Outreach Sent"
                value={computedMetrics.messagesSent}
                badge="Email & SMS"
                icon={Send}
              />
              <MetricCard
                label="Conversion Rate"
                value={computedMetrics.convRate}
                badge={`${computedMetrics.conversionsCount} converted`}
                icon={Target}
              />
            </div>

            {/* Quick Actions Panel */}
            <div className="panel p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="font-extrabold text-sm text-gray-900 flex items-center gap-2 justify-center sm:justify-start">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span>Outreach & AI Generation Pipeline</span>
                </div>
                <p className="text-xs text-gray-500 font-medium pl-8">
                  Auto-generate v0 live sites and dispatch multi-channel Email & SMS campaigns in 1-click.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => handleAutoGenerateAllDemos()}
                  disabled={batchDemoLoading}
                  className="btn text-xs py-2 px-3.5 shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {batchDemoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Auto-Generate All Demos</span>
                </button>

                <button
                  onClick={() => handleBatchOutreach('email')}
                  disabled={batchOutreachLoading}
                  className="btn secondary text-xs py-2 px-3.5 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5 text-gray-600" />
                  <span>Batch Send Emails</span>
                </button>

                <button
                  onClick={() => handleBatchOutreach('sms')}
                  disabled={batchOutreachLoading}
                  className="btn secondary text-xs py-2 px-3.5 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-gray-600" />
                  <span>Batch Send SMS</span>
                </button>
              </div>
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
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-extrabold text-gray-900">Target Accounts ({filteredLeads.length})</h3>
                <span className="text-xs font-bold text-blue-600">{computedMetrics.qualifiedCount} Qualified</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Select an account to view multi-keyword discovery & contact info</p>
              <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredLeads.map((lead) => {
                  const isSelected = lead.id === selectedLead?.id;
                  const hasV0 = Boolean(lead.demo_url && lead.demo_url.startsWith('http'));
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
                        <div className="flex items-center gap-1.5">
                          {hasV0 && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                              v0 Live
                            </span>
                          )}
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            Score: {lead.fit_score}/100
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-gray-600">
                        {lead.email ? (
                          <span className="flex items-center gap-1 text-emerald-700">
                            <Mail size={12} />
                            <span>{lead.email}</span>
                          </span>
                        ) : null}
                        {lead.phone ? (
                          <span className="flex items-center gap-1 text-blue-700">
                            <Phone size={12} />
                            <span>{lead.phone}</span>
                          </span>
                        ) : null}
                      </div>

                      {lead.matched_keyword && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-blue-700">
                          <Search className="w-2.5 h-2.5" />
                          <span>Scraped via: "{lead.matched_keyword}"</span>
                        </div>
                      )}
                      <div className="mt-1.5 text-xs font-semibold text-gray-700 line-clamp-1">
                        {lead.weakness || 'Digital gap analysis in progress'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Account Detail & Quick Outreach */}
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
                      <span className="text-xs font-bold text-gray-400 block">Lead Status</span>
                      <span className="text-xs font-extrabold text-blue-700 uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        {selectedLead.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Email Address</div>
                        <div className="text-xs font-extrabold text-gray-900 truncate">
                          {selectedLead.email || 'No email found'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Phone Number (SMS)</div>
                        <div className="text-xs font-extrabold text-gray-900 truncate">
                          {selectedLead.phone || 'No phone number'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-pink-50/70 border border-pink-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-pink-700 uppercase">Instagram Profile</div>
                        {selectedLead.instagram_url ? (
                          <a
                            href={selectedLead.instagram_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-extrabold text-pink-700 hover:underline truncate block"
                          >
                            {selectedLead.instagram_url.replace(/https?:\/\/(www\.)?instagram\.com\//i, '@')}
                          </a>
                        ) : (
                          <div className="text-xs font-semibold text-gray-400">Not detected</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                      Identified Conversion Vulnerabilities
                    </h4>
                    <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs font-bold text-amber-950 flex items-center gap-2">
                      <ShieldAlert size={16} className="text-amber-600 flex-shrink-0" />
                      <span>{selectedLead.weakness}</span>
                    </div>
                  </div>

                  {/* Outreach Quick Dispatch Action */}
                  <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                          <Zap className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-extrabold text-gray-900">1-Click Outreach Dispatch</span>
                      </div>
                      {selectedLead.demo_url && (
                        <a
                          href={selectedLead.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span>Preview Live Site</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => handleSendOutreach(selectedLead, 'email')}
                        disabled={!selectedLead.email}
                        className="btn text-xs py-2 px-3.5 shadow-sm flex items-center gap-1.5 disabled:opacity-40"
                      >
                        <Mail size={13} />
                        <span>Send Email Outreach</span>
                      </button>

                      <button
                        onClick={() => handleSendOutreach(selectedLead, 'sms')}
                        disabled={!selectedLead.phone}
                        className="btn secondary text-xs py-2 px-3.5 flex items-center gap-1.5 disabled:opacity-40"
                      >
                        <MessageSquare size={13} className="text-gray-600" />
                        <span>Send SMS Outreach</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400">Select an account to view details</div>
              )}
            </div>
          </div>
        )}

        {/* 3. AI DEMO LAB TAB — Pure v0 Live Apps */}
        {activeTab === 'demos' && (
          <div className="panel p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-gray-900">v0 AI Live Demo Lab</h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    v0 Cloud Verified
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Live interactive web applications generated via Vercel's v0 engine
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => handleAutoGenerateAllDemos()}
                  disabled={batchDemoLoading}
                  className="btn text-xs py-2 px-4 shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {batchDemoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Auto-Generate All Pending v0 Sites</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Active Demos List */}
              <div className="lg:col-span-4 space-y-3 max-h-[750px] overflow-y-auto pr-1 scrollbar-thin">
                {leads.map((lead) => {
                  const isSelected = lead.id === selectedDemoLead?.id;
                  const isReady = Boolean(lead.demo_url && lead.demo_url.startsWith('http'));
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
                          {isGenerating ? 'Generating...' : isReady ? 'Live Ready' : 'Pending'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Recipient: {lead.contact_name || lead.company_name}</div>
                      <div className="mt-2 text-[11px] font-semibold text-blue-600 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          <span>v0 Landing Page</span>
                        </span>
                        {isReady && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Live App Ready
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Real v0 Demo Live Preview Canvas */}
              <div className="lg:col-span-8 flex flex-col">
                {selectedDemoLead ? (
                  <div className="border border-slate-800 rounded-3xl bg-slate-950 text-white flex flex-col flex-1 overflow-hidden shadow-2xl">
                    {/* Top Canvas Bar with Viewport Switchers */}
                    <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500" />
                        <span className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-xs font-mono text-slate-300 ml-2 truncate max-w-[220px]">
                          {selectedDemoLead.demo_url || `v0 Site: ${selectedDemoLead.company_name}`}
                        </span>
                      </div>

                      {/* Viewport Selectors */}
                      <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                        <button
                          onClick={() => setPreviewViewport('desktop')}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            previewViewport === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                          title="Desktop View"
                        >
                          <Monitor size={14} />
                        </button>
                        <button
                          onClick={() => setPreviewViewport('tablet')}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            previewViewport === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                          title="Tablet View"
                        >
                          <Tablet size={14} />
                        </button>
                        <button
                          onClick={() => setPreviewViewport('mobile')}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            previewViewport === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                          title="Mobile View"
                        >
                          <Smartphone size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedDemoLead.demo_url && (
                          <a
                            href={selectedDemoLead.demo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <span>Open Full Screen</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Frame Content */}
                    <div className="flex-1 min-h-[600px] p-3 flex items-center justify-center bg-slate-900/50">
                      {selectedDemoLead.demo_url && selectedDemoLead.demo_url.startsWith('http') ? (
                        <div
                          className={`h-full min-h-[580px] rounded-2xl overflow-hidden border border-slate-800 bg-white transition-all shadow-2xl flex flex-col ${
                            previewViewport === 'mobile'
                              ? 'w-[375px]'
                              : previewViewport === 'tablet'
                              ? 'w-[768px]'
                              : 'w-full'
                          }`}
                        >
                          <iframe
                            src={selectedDemoLead.demo_url}
                            className="w-full flex-1 border-0 min-h-[580px]"
                            title={`${selectedDemoLead.company_name} Live v0 AI Application`}
                            allow="accelerometer; autoplay; camera; encrypted-media; geolocation; gyroscope; microphone"
                          />
                        </div>
                      ) : (
                        /* Generator Trigger for Unbuilt Demo */
                        <div className="text-center space-y-4 max-w-md p-8">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-2">
                            <Bot className="w-7 h-7" />
                          </div>
                          <h4 className="text-xl font-extrabold tracking-tight">
                            Generate v0 AI Site for {selectedDemoLead.company_name}
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {selectedDemoLead.weakness}
                          </p>

                          <div className="pt-3">
                            <button
                              onClick={() => handleGenerateDemo(selectedDemoLead)}
                              disabled={demoGeneratingId === selectedDemoLead.id}
                              className="btn text-xs px-6 py-2.5 shadow-sm flex items-center gap-2 mx-auto disabled:opacity-50"
                            >
                              {demoGeneratingId === selectedDemoLead.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Building v0 AI Application...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4" />
                                  <span>Build Live v0 AI Site Now</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Canvas Footer */}
                    <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Engine: Vercel v0 AI</span>
                      <span>Target: {selectedDemoLead.company_name} ({selectedDemoLead.city || 'Local'})</span>
                    </div>
                  </div>
                ) : (
                  <div className="panel p-12 text-center text-gray-500">
                    Select a lead to preview its v0 AI site.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. OUTREACH PIPELINE & DISPATCH COMMAND TAB */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {/* Outreach Dispatch Header Panel */}
            <div className="panel p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                      <Send className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Cold Outreach Command Center</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-1 pl-10">
                    Send personalized Email (Resend) and SMS (Twilio) outreach with live v0 demo links
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleBatchOutreach('email')}
                    disabled={batchOutreachLoading}
                    className="btn text-xs py-2 px-4 shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {batchOutreachLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                    <span>Batch Send Emails ({pipelineColumns.demoReady.length + pipelineColumns.qualified.length})</span>
                  </button>

                  <button
                    onClick={() => handleBatchOutreach('sms')}
                    disabled={batchOutreachLoading}
                    className="btn secondary text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {batchOutreachLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5 text-gray-600" />}
                    <span>Batch Send SMS ({leads.filter((l) => Boolean(l.phone)).length})</span>
                  </button>
                </div>
              </div>

              {/* Outreach Lead Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {leads.slice(0, 6).map((lead) => {
                  const isSent = ['outreach_sent', 'replied', 'converted'].includes(lead.status);
                  const hasV0 = Boolean(lead.demo_url && lead.demo_url.startsWith('http'));
                  return (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-white space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-white truncate max-w-[170px]">{lead.company_name}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSent ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {isSent ? 'Sent' : 'Ready'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {lead.email || lead.phone || 'Contact missing'}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleSendOutreach(lead, 'email')}
                          disabled={!lead.email}
                          className="flex-1 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center gap-1 disabled:opacity-30"
                        >
                          <Mail size={11} />
                          <span>Email</span>
                        </button>

                        <button
                          onClick={() => handleSendOutreach(lead, 'sms')}
                          disabled={!lead.phone}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center gap-1 disabled:opacity-30"
                        >
                          <MessageSquare size={11} />
                          <span>SMS</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pipeline Stage Columns */}
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
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
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
                        <button
                          onClick={() => handleGenerateDemo(l)}
                          className="text-purple-600 font-bold hover:underline flex items-center gap-0.5"
                        >
                          <Sparkles size={10} />
                          <span>Build v0</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {pipelineColumns.qualified.length === 0 && (
                    <div className="text-[11px] text-gray-400 text-center py-4">No qualified leads</div>
                  )}
                </div>
              </div>

              {/* Column 3: v0 Demo Ready */}
              <div className="panel p-4 bg-gray-50/50">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700">
                    v0 Demo Ready ({pipelineColumns.demoReady.length})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                </div>
                <div className="space-y-3">
                  {pipelineColumns.demoReady.map((l) => (
                    <div key={l.id} className="p-3.5 rounded-xl bg-white border border-purple-200 shadow-sm">
                      <div className="font-bold text-xs text-gray-900">{l.company_name}</div>
                      <div className="text-[11px] text-gray-500">v0 AI Live Site Ready</div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">v0 Ready</span>
                        <div className="flex items-center gap-2">
                          <a href={l.demo_url} target="_blank" rel="noreferrer" className="text-purple-600 font-bold underline">
                            View
                          </a>
                          <button
                            onClick={() => handleSendOutreach(l, 'email')}
                            className="text-blue-600 font-bold hover:underline"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pipelineColumns.demoReady.length === 0 && (
                    <div className="text-[11px] text-gray-400 text-center py-4">No demo-ready leads</div>
                  )}
                </div>
              </div>

              {/* Column 4: Outreach Sent & Replied */}
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

        {/* 5. SETTINGS & INTEGRATIONS TAB */}
        {activeTab === 'settings' && (
          <SettingsView settings={settings} onSave={handleSaveSettings} />
        )}

        {/* 6. HELP & DOCUMENTATION TAB */}
        {activeTab === 'help' && (
          <HelpView />
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
