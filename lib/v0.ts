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
  if (!apiKey) {
    return {
      demoUrl: `/demo/${lead.id}`,
      webUrl: `/demo/${lead.id}`,
      provider: 'local',
      status: 'ready'
    };
  }

  const modelIds = getV0ModelCandidates(process.env.V0_MODEL);
  const prompt = compactV0Prompt(lead);
  let lastError = '';
  let chat: V0ChatResponse | null = null;

  for (const modelId of modelIds) {
    const chatRes = await fetch('https://api.v0.dev/v1/chats', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        system:
          'Create compact, production-ready Next.js + Tailwind demos for cold outreach. Prefer concise code, no images, no extra explanation.',
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

    lastError = `${modelId}: ${chatRes.status} ${await chatRes.text()}`;
    if (![400, 404, 422].includes(chatRes.status)) break;
  }

  if (!chat) {
    throw new Error(`v0 chat creation failed after ${modelIds.length} model attempt${modelIds.length === 1 ? '' : 's'}: ${lastError}`);
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
      signals: lead.signals.slice(0, 4)
    });

  const compact = `${fullPrompt}

Credit saver constraints:
- Generate one focused page only.
- Keep components small.
- No image generation.
- No alternate design variants.
- Do not explain the code.`;

  return compact.length > maxChars ? `${compact.slice(0, maxChars)}\n\nKeep the demo concise and complete.` : compact;
}
