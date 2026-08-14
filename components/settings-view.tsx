'use client';

import { useState } from 'react';
import {
  Bot,
  CheckCircle2,
  Cpu,
  Crown,
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

  const geminiModels = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Recommended - Ultra Fast)' },
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite (Credit Saver)' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Deep Analysis)' }
  ];

  const anthropicModels = [
    { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (Recommended - Fast & Sharp)' },
    { value: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet (Latest Reasoning)' },
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (High Precision)' }
  ];

  const v0Models = [
    { value: 'v0-mini', label: 'v0 Mini (Recommended - Fast Live Site Generation)' },
    { value: 'v0-pro', label: 'v0 Pro (High-Craft Layouts)' },
    { value: 'v0-max-fast', label: 'v0 Max Fast' }
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="panel p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">System Settings & Dispatch Engines</h2>
            <p className="text-xs text-blue-100 font-medium mt-0.5">
              Manage v0 AI site builder, Email (Resend), SMS (Twilio), and AI model credentials
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>Local & Encrypted Persistence</span>
        </div>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully! API keys and outreach configurations updated.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: v0 AI Site Builder Engine */}
        <div className="panel p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-extrabold text-gray-900">v0 AI Site Builder Engine (Pure v0)</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 uppercase">
              Vercel v0 API
            </span>
          </div>

          <p className="text-xs text-gray-500">
            LeadDrive generates 100% genuine interactive web applications hosted on Vercel's v0 cloud. No local mock templates.
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
          </div>

          <div className="pt-3 border-t border-gray-100">
            <label className="label mb-2">Default Demo Quality & Fidelity</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, defaultDemoQuality: 'low' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  form.defaultDemoQuality !== 'high'
                    ? 'bg-purple-50/50 border-purple-500 ring-2 ring-purple-500/20 shadow-xs'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 font-extrabold text-xs text-gray-900">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Low Usage Mode (Fast / Standard)</span>
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Uses v0-mini with compact prompts. Fast generation times, clean layout, core services, and direct booking form.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, defaultDemoQuality: 'high' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  form.defaultDemoQuality === 'high'
                    ? 'bg-purple-50/80 border-purple-600 ring-2 ring-purple-500/30 shadow-xs'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 font-extrabold text-xs text-purple-900">
                  <Crown className="w-4 h-4 text-purple-600" />
                  <span>High-End Mode (Ultra Pro Flagship)</span>
                </div>
                <div className="text-[11px] text-purple-700 mt-1">
                  Uses v0-pro with comprehensive directives. Luxury glassmorphism, dynamic multi-step price calculator, booking calendar drawer, and Silicon Valley polish.
                </div>
              </button>
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

        {/* Section 4: AI Analysis & Multi-Keyword Engine (Gemini / Anthropic) */}
        <div className="panel p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-extrabold text-gray-900">AI Intelligence Engine</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase">
              {form.aiProvider === 'gemini' ? 'Google Gemini' : 'Anthropic Claude'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setForm({ ...form, aiProvider: 'gemini', aiModel: 'gemini-2.5-flash' })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                form.aiProvider === 'gemini'
                  ? 'bg-blue-50/80 border-blue-500 shadow-sm'
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
                Fast multi-keyword expansion & lead vulnerability scoring powered by Google AI.
              </p>
            </div>

            <div
              onClick={() => setForm({ ...form, aiProvider: 'anthropic', aiModel: 'claude-3-5-haiku-20241022' })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                form.aiProvider === 'anthropic'
                  ? 'bg-purple-50/80 border-purple-500 shadow-sm'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-gray-900">Anthropic Claude API</span>
                <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                  Claude 3.5 / 3.7
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">
                Ultra-high-precision reasoning and persuasive outreach copy generated by Anthropic.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="label">Select AI Model</label>
              <select
                value={form.aiModel}
                onChange={(e) => setForm({ ...form, aiModel: e.target.value })}
                className="field text-xs font-semibold"
              >
                {(form.aiProvider === 'gemini' ? geminiModels : anthropicModels).map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label flex items-center justify-between">
                <span>{form.aiProvider === 'gemini' ? 'Gemini API Key' : 'Anthropic API Key'}</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  {form.aiApiKey ? '✓ Key Entered' : 'Required for AI mode'}
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
