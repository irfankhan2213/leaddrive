'use client';

import { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Globe,
  HelpCircle,
  Key,
  Layers,
  Mail,
  MapPin,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
  Zap
} from 'lucide-react';

export function HelpView() {
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const envTemplate = `# LeadDrive Environment Configuration
SERPAPI_KEY="your_serpapi_key_here"
GEMINI_API_KEY="your_gemini_api_key_here"
GEMINI_MODEL="gemini-2.5-flash"
ANTHROPIC_API_KEY="your_anthropic_api_key_here"
V0_API_KEY="your_v0_api_key_here"
V0_MODEL="v0-mini"
RESEND_API_KEY="your_resend_api_key_here"
FROM_EMAIL="outreach@yourdomain.com"
NEXT_PUBLIC_SUPABASE_URL="https://your-supabase-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
APP_BASE_URL="http://localhost:3000"`;

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  }

  const faqs = [
    {
      q: 'How does Multi-Keyword Search Query Expansion work?',
      a: 'When you enter a target audience (e.g. "AI Startups") and location ("New York"), LeadDrive generates 5 to 8 high-intent search queries across 4 pillars: current timeline (2026), sub-niche variations (AI SaaS), registry & directory tracking (recently registered AI startups), and commercial searches. Each query is individually scraped via SerpAPI or Apify, deduplicated, and unified into one campaign.'
    },
    {
      q: 'How are business emails, phone numbers, and LinkedIn links found?',
      a: 'During website inspection, LeadDrive fetches the target company homepage and uses HTML parsing to extract mailto: emails, clean domain email patterns (contact@domain.com, info@domain.com), tel: phone numbers, and company LinkedIn profile URLs. Found contact details are automatically enriched into the prospect profile.'
    },
    {
      q: 'What happens if I don\'t have a V0 API key configured?',
      a: 'LeadDrive includes an active local v0 preview renderer. If V0_API_KEY is not set in Settings or .env.local, LeadDrive gracefully falls back to generating a full local interactive demo preview at /demo/[leadId] with zero downtime.'
    },
    {
      q: 'How does PageSpeed & Technical Auditing work?',
      a: 'If PAGESPEED_API_KEY is present, LeadDrive runs a mobile Google Lighthouse audit measuring Performance, SEO, Accessibility, and Best Practices. If the key is unconfigured, LeadDrive uses estimateAuditFromSnapshot() to calculate real-time technical metrics from website response speed and HTML tags.'
    },
    {
      q: 'How are email opens and link clicks tracked?',
      a: 'Outreach emails sent via Resend API include an invisible 1x1 tracking pixel (/api/track/open?leadId=...) and sanitized redirect links (/api/track/click?leadId=...&target=...). When a lead opens the email or clicks the demo link, Supabase counters update in real time.'
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Help Center & Documentation</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Complete guide to multi-keyword campaigns, AI demos, scraping engines & settings
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-200">
          <Zap className="w-4 h-4 text-blue-600" />
          <span>v2.4 Engine Guide</span>
        </div>
      </div>

      {/* Search Documentation */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search documentation, API keys, scraping setup, v0 site builder..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="field field-icon-left pr-4 text-xs bg-white shadow-xs focus:bg-white"
        />
      </div>

      {/* Quickstart Workflow Steps */}
      <div className="panel p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Rocket className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-extrabold text-gray-900">5-Step LeadDrive Campaign Workflow</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            {
              step: '01',
              title: 'API Settings',
              desc: 'Configure Gemini/Claude AI, v0, and SerpAPI in Settings or .env.local.',
              icon: Key,
              color: 'text-blue-600 bg-blue-50 border-blue-200'
            },
            {
              step: '02',
              title: 'Multi-Keyword',
              desc: 'Enter audience & city. Engine expands 5-8 search query pillars.',
              icon: Search,
              color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
            },
            {
              step: '03',
              title: 'Web Scrape',
              desc: 'Scrapes Google Maps/Apify, extracts emails, phones, and PageSpeed.',
              icon: Globe,
              color: 'text-purple-600 bg-purple-50 border-purple-200'
            },
            {
              step: '04',
              title: 'v0 Site Demos',
              desc: 'Builds tailored Next.js + Tailwind landing page preview for lead.',
              icon: Wand2,
              color: 'text-pink-600 bg-pink-50 border-pink-200'
            },
            {
              step: '05',
              title: 'Send Outreach',
              desc: 'Dispatches cold emails via Resend with open & click tracking.',
              icon: Mail,
              color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
            }
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="p-3.5 rounded-2xl border border-gray-100 bg-white/80 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold text-gray-400">{s.step}</span>
                    <div className={`p-1.5 rounded-xl border ${s.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xs font-extrabold text-gray-900">{s.title}</div>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Deep Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Multi-Keyword Expansion Engine */}
        <div className="panel p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-600 border-b border-gray-100 pb-2.5">
            <Search className="w-4 h-4" />
            <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
              Multi-Keyword Query Expansion
            </h4>
          </div>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            LeadDrive generates multi-query search expansions to maximize prospect coverage:
          </p>
          <ul className="space-y-2 text-xs text-gray-700 font-medium">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              <span><strong>Year & Timeline:</strong> <code className="text-[11px] bg-gray-100 px-1 py-0.5 rounded text-blue-700">AI Startups 2026 in New York</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              <span><strong>Sub-niche Variations:</strong> <code className="text-[11px] bg-gray-100 px-1 py-0.5 rounded text-blue-700">AI Startups SaaS in New York</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              <span><strong>Registrations & Directories:</strong> <code className="text-[11px] bg-gray-100 px-1 py-0.5 rounded text-blue-700">recently registered AI Startups in New York</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              <span><strong>Commercial Intent:</strong> <code className="text-[11px] bg-gray-100 px-1 py-0.5 rounded text-blue-700">top AI Startups companies in New York</code></span>
            </li>
          </ul>
        </div>

        {/* v0 AI Site Builder */}
        <div className="panel p-5 space-y-3">
          <div className="flex items-center gap-2 text-purple-600 border-b border-gray-100 pb-2.5">
            <Wand2 className="w-4 h-4" />
            <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
              Vercel v0 Site Builder Integration
            </h4>
          </div>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            Every lead gets a custom interactive Next.js landing page powered by v0:
          </p>
          <ul className="space-y-2 text-xs text-gray-700 font-medium">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <span><strong>Tailored Weakness Fix:</strong> 1-click booking bar targeting the prospect's exact mobile bottleneck.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <span><strong>Branded Aesthetics:</strong> Industry-specific palettes (e.g. Rose Gold for MedSpas, Navy/Gold for Legal).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <span><strong>v0 API Endpoint:</strong> <code className="text-[11px] bg-gray-100 px-1 py-0.5 rounded text-purple-700">POST https://api.v0.dev/v1/chats</code></span>
            </li>
          </ul>
        </div>
      </div>

      {/* Environment & Configuration Template */}
      <div className="panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-gray-900">Environment Template (.env.local)</h3>
          </div>
          <button
            onClick={() => copyToClipboard(envTemplate)}
            className="btn secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            {copiedEnv ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEnv ? 'Copied to Clipboard!' : 'Copy Template'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-2xl bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto leading-relaxed border border-gray-800 shadow-inner">
          {envTemplate}
        </pre>
      </div>

      {/* FAQ Accordion Section */}
      <div className="panel p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-extrabold text-gray-900">Frequently Asked Questions & Troubleshooting</h3>
        </div>

        <div className="space-y-2.5">
          {filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border border-gray-100 rounded-2xl bg-white/70 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-4 text-left text-xs font-extrabold text-gray-900 flex items-center justify-between hover:bg-gray-50/80 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 text-xs text-gray-600 font-medium leading-relaxed border-t border-gray-100/60 pt-3 bg-gray-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
