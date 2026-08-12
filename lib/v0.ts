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

export async function createV0Demo(lead: Lead): Promise<V0DemoResult> {
  const apiKey = process.env.V0_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return {
      demoUrl: `/demo/${lead.id}`,
      webUrl: `/demo/${lead.id}`,
      provider: 'v0',
      status: 'ready',
      error: 'V0_API_KEY is not configured in .env.local. Using local v0 preview renderer.'
    };
  }

  const modelIds = getV0ModelCandidates(process.env.V0_MODEL);
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
            'You are v0, the AI site builder by Vercel. Generate complete, high-converting React + Next.js + Tailwind CSS landing page components for cold outreach prospects. Return responsive, beautifully styled code with hero section, service packages, local social proof, and mobile booking bar.',
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
          error: 'V0_API_KEY is unauthorized. Using fallback v0 preview renderer.'
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
  const maxChars = Number(process.env.V0_MAX_PROMPT_CHARS || 1600);
  const fullPrompt =
    lead.demo_prompt ||
    buildDemoPrompt({
      ...lead,
      signals: lead.signals?.slice(0, 4) || []
    });

  const compact = `${fullPrompt}

v0 Site Builder Constraints:
- Build one complete high-converting landing page.
- Clear hero title "${lead.company_name}".
- Mobile booking bar at bottom.
- No image generation.
- Modern Tailwind CSS styling.`;

  return compact.length > maxChars ? `${compact.slice(0, maxChars)}\n\nBuild complete v0 site.` : compact;
}
