import type { Lead, V0DemoResult } from '@/lib/types';
import { buildDemoPrompt } from '@/lib/pipeline';

type V0ChatResponse = {
  id?: string;
  url?: string;
  demo?: string;
  webUrl?: string;
  apiUrl?: string;
  latestVersion?: { id?: string; demoUrl?: string; status?: string };
};

export async function createV0Demo(
  lead: Lead,
  customV0ApiKey?: string,
  customV0Model?: string
): Promise<V0DemoResult> {
  const apiKey = customV0ApiKey || process.env.V0_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return {
      demoUrl: `/demo/${lead.id}`,
      webUrl: `/demo/${lead.id}`,
      provider: 'v0',
      status: 'ready',
      error: 'V0_API_KEY is not configured in Settings or .env.local. Using local v0 preview renderer.'
    };
  }

  const modelIds = getV0ModelCandidates(customV0Model || process.env.V0_MODEL);
  const prompt = compactV0Prompt(lead);
  let lastError = '';
  let chat: V0ChatResponse | null = null;

  for (const modelId of modelIds) {
    try {
      const chatRes = await fetch('https://api.v0.dev/v1/chats', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          system:
            'You are v0, the master AI web architect by Vercel. Generate complete, expansive, multi-section React + Next.js + Tailwind CSS landing page applications for cold outreach prospects. Return full, beautifully styled code with sticky Navbar, Hero section, Problem & Solution banner, 6 Service Cards with Pricing, Live Booking Tool/Estimator, Testimonials grid, FAQ Accordion, Footer, and a fixed mobile conversion bar.',
          message: prompt,
          chatPrivacy: 'unlisted',
          responseMode: 'sync',
          modelConfiguration: {
            modelId,
            imageGenerations: false,
            thinking: false
          }
        })
      });

      if (chatRes.ok) {
        chat = (await chatRes.json()) as V0ChatResponse;
        break;
      }

      const errText = await chatRes.text();
      lastError = `${modelId}: ${chatRes.status} ${errText}`;

      // If unauthorized (401), stop immediately to avoid hammering invalid key
      if (chatRes.status === 401) {
        return {
          demoUrl: `/demo/${lead.id}`,
          webUrl: `/demo/${lead.id}`,
          provider: 'v0',
          status: 'ready',
          error: 'V0_API_KEY is unauthorized. Check your V0 API Key in Settings.'
        };
      }

      if (![400, 404, 422].includes(chatRes.status)) break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Network fetch failed.';
    }
  }

  if (!chat) {
    return {
      demoUrl: `/demo/${lead.id}`,
      webUrl: `/demo/${lead.id}`,
      provider: 'v0',
      status: 'ready',
      error: `v0 site builder notice: ${lastError || 'Fallback to v0 preview renderer.'}`
    };
  }

  const versionId = chat.latestVersion?.id;
  const publicDemoUrl = chat.latestVersion?.demoUrl || chat.demo || chat.webUrl || chat.url || `/demo/${lead.id}`;

  return {
    chatId: chat.id,
    versionId,
    demoUrl: publicDemoUrl,
    webUrl: chat.webUrl || chat.url,
    provider: 'v0',
    status: 'ready'
  };
}

function getV0ModelCandidates(configured?: string) {
  const preferred = configured || 'v0-mini';
  const candidates = [
    preferred,
    normalizeGatewayModelId(preferred),
    'v0-mini',
    'v0-pro',
    'v0-max-fast',
    'vercel/v0-1.5-md',
    'v0/v0-1.5-md',
    'v0-1.5-md'
  ];

  return [...new Set(candidates.filter(Boolean))];
}

function normalizeGatewayModelId(modelId: string) {
  if (modelId.includes('/')) return modelId;
  if (modelId.startsWith('v0-1.')) return `vercel/${modelId}`;
  return modelId;
}

function compactV0Prompt(lead: Lead) {
  const maxChars = Number(process.env.V0_MAX_PROMPT_CHARS || 3500);
  const fullPrompt =
    lead.demo_prompt ||
    buildDemoPrompt({
      ...lead,
      signals: lead.signals?.slice(0, 6) || []
    });

  const compact = `${fullPrompt}

v0 Site Builder Requirements:
- Generate a large, expansive, complete landing page.
- Clear brand title "${lead.company_name}".
- Include Navbar, Hero, Problem/Solution, 6 Service Cards with Pricing, Interactive Scheduler, Testimonials, FAQ, Footer, and Fixed Mobile Booking Bar.
- Modern Tailwind CSS styling with zero placeholder text.`;

  return compact.length > maxChars ? `${compact.slice(0, maxChars)}\n\nBuild full multi-section v0 site.` : compact;
}
