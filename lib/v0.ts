import type { DemoQuality, Lead, V0DemoResult } from '@/lib/types';
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
  customV0Model?: string,
  qualityOverride?: DemoQuality
): Promise<V0DemoResult> {
  const apiKey = customV0ApiKey || process.env.V0_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return {
      provider: 'v0',
      status: 'failed',
      error: 'V0_API_KEY is not configured. Please add your v0 API Key in Settings or .env.local.'
    };
  }

  const quality: DemoQuality = qualityOverride || lead.demo_quality || 'low';
  const modelIds = getV0ModelCandidates(quality, customV0Model || process.env.V0_MODEL);
  const prompt = compactV0Prompt(lead, quality);
  let lastError = '';
  let chat: V0ChatResponse | null = null;

  const systemInstruction =
    quality === 'high'
      ? 'You are v0 by Vercel. Generate an ultra-luxurious, award-winning, state-of-the-art flagship web application and high-converting landing page component in React + Next.js + Tailwind CSS. Implement rich interactivity with React state (dynamic multi-step cost/quote calculator, interactive booking calendar drawer, tabbed service showcase, before/after slider), luxury glassmorphism cards, refined gradients, Lucide icons, and responsive mobile layout.'
      : 'You are v0 by Vercel. Generate a clean, polished, responsive React + Next.js + Tailwind CSS landing page for this prospect. Return responsive code with hero section, clear value proposition, service cards with pricing, 1-click booking form, and mobile footer.';

  for (const modelId of modelIds) {
    try {
      const chatRes = await fetch('https://api.v0.dev/v1/chats', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          system: systemInstruction,
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
      lastError = `v0 (${modelId}) failed: ${chatRes.status} ${errText.slice(0, 160)}`;

      if (chatRes.status === 401) {
        return {
          provider: 'v0',
          status: 'failed',
          error: 'V0_API_KEY is unauthorized. Check your V0 API Key in Settings.'
        };
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Network fetch to v0 failed.';
    }
  }

  if (!chat) {
    return {
      provider: 'v0',
      status: 'failed',
      error: lastError || 'v0 AI site building failed.'
    };
  }

  const versionId = chat.latestVersion?.id;
  const publicDemoUrl = chat.latestVersion?.demoUrl || chat.demo || chat.webUrl || chat.url;

  if (!publicDemoUrl) {
    return {
      chatId: chat.id,
      versionId,
      provider: 'v0',
      status: 'failed',
      error: 'v0 did not return a public demo URL.'
    };
  }

  return {
    chatId: chat.id,
    versionId,
    demoUrl: publicDemoUrl,
    deploymentUrl: chat.latestVersion?.demoUrl || chat.demo,
    webUrl: chat.webUrl || chat.url,
    provider: 'v0',
    status: 'ready'
  };
}

function getV0ModelCandidates(quality: DemoQuality, configured?: string) {
  if (quality === 'high') {
    const preferred = configured && configured !== 'v0-mini' ? configured : 'v0-pro';
    const candidates = [preferred, 'v0-pro', 'v0-max-fast', 'v0-mini'];
    return [...new Set(candidates.filter(Boolean))];
  }

  // Low usage mode
  const preferred = configured || 'v0-mini';
  const candidates = [preferred, 'v0-mini'];
  return [...new Set(candidates.filter(Boolean))];
}

function compactV0Prompt(lead: Lead, quality: DemoQuality) {
  const maxChars = quality === 'high' ? 4500 : Number(process.env.V0_MAX_PROMPT_CHARS || 3000);
  const fullPrompt = buildDemoPrompt(lead, quality);

  const compact = `${fullPrompt}

v0 Directive (${quality === 'high' ? 'Ultra High-End Mode' : 'Standard Fast Mode'}):
- Brand: "${lead.company_name}".
- Modern Tailwind CSS styling with zero placeholder text.
- Full interactive self-contained component with Lucide icons.`;

  return compact.length > maxChars ? `${compact.slice(0, maxChars)}\n\nBuild full v0 site.` : compact;
}
