'use client';

import { useState } from 'react';
import {
  Bot,
  CheckCircle2,
  Cpu,
  Eye,
  EyeOff,
  Key,
  Layers,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import type { AppSettings } from '@/lib/types';

interface SettingsViewProps {
  settings: AppSettings;
  onSave: (updated: AppSettings) => void;
}

export function SettingsView({ settings: initialSettings, onSave }: SettingsViewProps) {
  const [form, setForm] = useState<AppSettings>(initialSettings);
  const [showAiKey, setShowAiKey] = useState(false);
  const [showV0Key, setShowV0Key] = useState(false);
  const [showResendKey, setShowResendKey] = useState(false);
  const [showTwilioAuth, setShowTwilioAuth] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const vertexModels = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Active & Verified in us-central1 - Sub-Second)' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Deep Enterprise Strategy & Reasoning)' },
    { value: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash (Flagship AI Agents & Code Engine)' },
    { value: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash (Token Optimized Agent Workflows)' },
    { value: 'gemini-3.5-pro', label: 'Gemini 3.5 Pro (Frontier Multimodal & Prospect Audits)' },
    { value: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash (High Throughput Production)' },
    { value: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite (Low Latency Automation)' },
    { value: 'claude-opus-5', label: 'Claude Opus 5 (Vertex AI Model Garden)' },
    { value: 'claude-sonnet-5', label: 'Claude Sonnet 5 (Vertex AI Model Garden)' },
    { value: 'custom', label: 'Custom Model / Endpoint (Enter Below)' }
  ];

  const geminiModels = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Google AI Flagship)' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Enterprise Strategy)' },
    { value: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash (AI Agent Specialist)' },
    { value: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash (Production Workhorse)' },
    { value: 'gemini-3.5-pro', label: 'Gemini 3.5 Pro (Frontier Reasoning)' },
    { value: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash (High Throughput)' },
    { value: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite (Cost Saver)' },
    { value: 'custom', label: 'Custom Model ID (Enter Below)' }
  ];

  const anthropicModels = [
    { value: 'claude-opus-5', label: 'Claude Opus 5 (Flagship 1M Context & Agentic Coding)' },
    { value: 'claude-sonnet-5', label: 'Claude Sonnet 5 (Flagship Speed & High Intelligence)' },
    { value: 'claude-fable-5', label: 'Claude Fable 5 (Top-Tier Mythos-Class Reasoning)' },
    { value: 'claude-opus-4-8', label: 'Claude Opus 4.8 (Advanced Agentic Analysis)' },
    { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (Ultra-Fast High-Volume Automation)' },
    { value: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet (Hybrid & Extended Reasoning)' },
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (High-Craft Precision)' },
    { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (Fast & Cost Efficient)' },
    { value: 'custom', label: 'Custom Model ID (Enter Below)' }
  ];

  const v0Models = [
    { value: 'v0-mini', label: 'v0 Mini (Recommended - Fast Live Site Generation)' },
    { value: 'v0-pro', label: 'v0 Pro (Flagship High-Craft Layouts)' },
    { value: 'v0-max-fast', label: 'v0 Max Fast (Sub-second Generation)' }
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...form, demoProvider: 'v0' });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">System Settings & Integrations</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Manage v0 AI site builder, Email (Resend), SMS (Twilio), and AI model credentials
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Local Storage</span>
        </div>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully! API keys and outreach configurations updated.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: v0 Live Site Builder */}
        <div className="panel p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900">Vercel v0 AI Site Builder</h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              v0 Dedicated Engine
            </span>
          </div>

          <p className="text-xs text-gray-500">
            LeadDrive builds and deploys live, personalized, high-converting interactive web applications for prospects using Vercel v0.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="label flex items-center justify-between">
                <span>v0 API Key</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  {form.v0ApiKey ? '✓ Key Configured' : 'Required for live demos'}
                </span>
              </label>
              <div className="relative">
                <input
                  type={showV0Key ? 'text' : 'password'}
                  value={form.v0ApiKey}
                  onChange={(e) => setForm({ ...form, v0ApiKey: e.target.value })}
                  className="field text-xs pr-10 font-mono"
                  placeholder="v1:... or vcp_..."
                />
                <button
                  type="button"
                  onClick={() => setShowV0Key(!showV0Key)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showV0Key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">v0 Generation Model</label>
              <select
                value={form.v0Model}
                onChange={(e) => setForm({ ...form, v0Model: e.target.value })}
                className="field text-xs font-semibold"
              >
                {v0Models.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Max Auto Demos per Campaign</label>
              <input
                type="number"
                min={0}
                max={25}
                value={form.maxAutoDemosPerCampaign ?? 3}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxAutoDemosPerCampaign: Math.min(Math.max(Number(e.target.value) || 0, 0), 25)
                  })
                }
                className="field text-xs font-semibold"
              />
            </div>

            <div>
              <label className="label">Minimum Demo Score</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.minDemoScore ?? 75}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minDemoScore: Math.min(Math.max(Number(e.target.value) || 0, 0), 100)
                  })
                }
                className="field text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Email Outreach System (Resend) */}
        <div className="panel p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-extrabold text-gray-900">Email Outreach System (Resend)</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase">
              Resend API
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label flex items-center justify-between">
                <span>Resend API Key</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  {form.resendApiKey ? '✓ Configured' : 'Optional'}
                </span>
              </label>
              <div className="relative">
                <input
                  type={showResendKey ? 'text' : 'password'}
                  value={form.resendApiKey || ''}
                  onChange={(e) => setForm({ ...form, resendApiKey: e.target.value })}
                  className="field text-xs pr-10 font-mono"
                  placeholder="re_..."
                />
                <button
                  type="button"
                  onClick={() => setShowResendKey(!showResendKey)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showResendKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">From Email Address</label>
              <input
                type="email"
                value={form.fromEmail || ''}
                onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
                className="field text-xs"
                placeholder="e.g. outreach@youragency.com or onboarding@resend.dev"
              />
            </div>

            <div>
              <label className="label">Sender Name</label>
              <input
                type="text"
                value={form.fromName || ''}
                onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                className="field text-xs"
                placeholder="Irfan Khan"
              />
            </div>
          </div>
        </div>

        {/* Section 3: SMS Outreach System (Twilio) */}
        <div className="panel p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-gray-900">SMS Outreach System (Twilio)</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
              Twilio SMS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Twilio Account SID</label>
              <input
                type="text"
                value={form.twilioAccountSid || ''}
                onChange={(e) => setForm({ ...form, twilioAccountSid: e.target.value })}
                className="field text-xs font-mono"
                placeholder="AC..."
              />
            </div>

            <div>
              <label className="label">Twilio Auth Token</label>
              <div className="relative">
                <input
                  type={showTwilioAuth ? 'text' : 'password'}
                  value={form.twilioAuthToken || ''}
                  onChange={(e) => setForm({ ...form, twilioAuthToken: e.target.value })}
                  className="field text-xs pr-10 font-mono"
                  placeholder="auth_token..."
                />
                <button
                  type="button"
                  onClick={() => setShowTwilioAuth(!showTwilioAuth)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showTwilioAuth ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Twilio Sender Phone / Shortcode</label>
              <input
                type="text"
                value={form.twilioPhoneNumber || ''}
                onChange={(e) => setForm({ ...form, twilioPhoneNumber: e.target.value })}
                className="field text-xs font-mono"
                placeholder="+18005550199"
              />
            </div>
          </div>
        </div>

        {/* Section 4: AI Intelligence & Google Cloud Vertex Engine */}
        <div className="panel p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-extrabold text-gray-900">AI Intelligence & Cloud Engine</h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase">
              {form.aiProvider === 'vertex'
                ? 'Google Cloud Vertex AI'
                : form.aiProvider === 'gemini'
                ? 'Google Gemini API'
                : 'Anthropic Claude'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* 1. Google Cloud Vertex AI */}
            <div
              onClick={() => setForm({ ...form, aiProvider: 'vertex', aiModel: 'gemini-2.5-flash', vertexModel: 'gemini-2.5-flash' })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                form.aiProvider === 'vertex'
                  ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-gray-900">Google Cloud Vertex</span>
                <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  Service Account
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">
                Enterprise Gemini 2.5 on Vertex AI with live Google Search Grounding & BigQuery streaming.
              </p>
            </div>

            {/* 2. Google Gemini API */}
            <div
              onClick={() => setForm({ ...form, aiProvider: 'gemini', aiModel: 'gemini-2.5-flash' })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                form.aiProvider === 'gemini'
                  ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-gray-900">Google Gemini API</span>
                <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  Gemini 2.5
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">
                Fast multi-keyword query expansion & lead scoring via standard Google AI Developer Key.
              </p>
            </div>

            {/* 3. Anthropic Claude API */}
            <div
              onClick={() => setForm({ ...form, aiProvider: 'anthropic', aiModel: 'claude-3-5-haiku-20241022' })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                form.aiProvider === 'anthropic'
                  ? 'bg-purple-50/80 border-purple-500 shadow-sm ring-1 ring-purple-500/20'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-gray-900">Anthropic Claude</span>
                <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                  Claude 3.5 / 3.7
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">
                Ultra-high-precision reasoning and persuasive outreach copy generated by Anthropic.
              </p>
            </div>
          </div>

          {/* Dynamic Provider Settings */}
          {form.aiProvider === 'vertex' ? (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">GCP Project ID</label>
                  <input
                    type="text"
                    value={form.gcpProjectId || 'skillful-fx-467601-h4'}
                    onChange={(e) => setForm({ ...form, gcpProjectId: e.target.value })}
                    className="field text-xs font-mono bg-gray-50"
                    placeholder="project-id..."
                  />
                </div>

                <div>
                  <label className="label">GCP Region / Location</label>
                  <input
                    type="text"
                    value={form.gcpLocation || 'us-central1'}
                    onChange={(e) => setForm({ ...form, gcpLocation: e.target.value })}
                    className="field text-xs font-mono bg-gray-50"
                    placeholder="us-central1"
                  />
                </div>

                <div>
                  <label className="label flex items-center justify-between">
                    <span>Vertex AI Model</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {form.vertexModel || 'gemini-2.5-flash'}
                    </span>
                  </label>
                  <div className="space-y-1.5">
                    <select
                      value={vertexModels.some(m => m.value === form.vertexModel) ? form.vertexModel : 'custom'}
                      onChange={(e) => {
                        if (e.target.value !== 'custom') {
                          setForm({ ...form, vertexModel: e.target.value, aiModel: e.target.value });
                        }
                      }}
                      className="field text-xs font-semibold"
                    >
                      {vertexModels.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={form.vertexModel || ''}
                      onChange={(e) => setForm({ ...form, vertexModel: e.target.value, aiModel: e.target.value })}
                      placeholder="e.g. gemini-2.5-flash or gemini-3.7-flash"
                      className="field text-xs font-mono bg-gray-50 py-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* Vertex Feature Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-200/70 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">Google Search Grounding</div>
                    <div className="text-[10px] text-gray-500">Real-time live Google Search fact retrieval for prospect audits</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.vertexGrounding !== false}
                    onChange={(e) => setForm({ ...form, vertexGrounding: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-200/70 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">BigQuery Lead Streaming</div>
                    <div className="text-[10px] text-gray-500">Auto-stream leads and outreach metrics to <span className="font-mono text-gray-700">leaddrive_analytics</span></div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.bigqueryEnabled !== false}
                    onChange={(e) => setForm({ ...form, bigqueryEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="label flex items-center justify-between">
                  <span>Select AI Model</span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {form.aiModel}
                  </span>
                </label>
                <div className="space-y-1.5">
                  <select
                    value={(form.aiProvider === 'gemini' ? geminiModels : anthropicModels).some(m => m.value === form.aiModel) ? form.aiModel : 'custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        setForm({ ...form, aiModel: e.target.value });
                      }
                    }}
                    className="field text-xs font-semibold"
                  >
                    {(form.aiProvider === 'gemini' ? geminiModels : anthropicModels).map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={form.aiModel || ''}
                    onChange={(e) => setForm({ ...form, aiModel: e.target.value })}
                    placeholder={form.aiProvider === 'gemini' ? 'e.g. gemini-2.5-flash' : 'e.g. claude-3-7-sonnet-20250219'}
                    className="field text-xs font-mono bg-gray-50 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="label flex items-center justify-between">
                  <span>{form.aiProvider === 'gemini' ? 'Gemini API Key' : 'Anthropic API Key'}</span>
                  <span className="text-[10px] text-gray-400 font-normal">
                    {form.aiApiKey ? '✓ Key Entered' : 'Required for direct API mode'}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showAiKey ? 'text' : 'password'}
                    value={form.aiApiKey}
                    onChange={(e) => setForm({ ...form, aiApiKey: e.target.value })}
                    className="field text-xs pr-10 font-mono"
                    placeholder={
                      form.aiProvider === 'gemini'
                        ? 'AIzaSy...'
                        : 'sk-ant-api03-...'
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowAiKey(!showAiKey)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showAiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Brand Identity */}
        <div className="panel p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-extrabold text-gray-900">Brand Identity & Custom AI Directives</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Agency / Brand Name</label>
              <input
                type="text"
                value={form.brandName || ''}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                className="field text-xs"
                placeholder="LeadDrive Agency"
              />
            </div>

            <div>
              <label className="label">Custom AI Generation Directives (Optional)</label>
              <input
                type="text"
                value={form.customInstructions || ''}
                onChange={(e) => setForm({ ...form, customInstructions: e.target.value })}
                className="field text-xs"
                placeholder="e.g. Highlight instant mobile scheduling and ROI..."
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="submit" className="btn text-xs px-6 py-2.5 flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <Save className="w-4 h-4" />
            <span>Save Settings & Update Engines</span>
          </button>
        </div>
      </form>
    </div>
  );
}
