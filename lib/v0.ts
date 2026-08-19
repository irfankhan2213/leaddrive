import type { AppSettings, DemoQuality, Lead, V0DemoResult } from '@/lib/types';
import { buildDemoPrompt } from '@/lib/pipeline';

type V0ChatResponse = {
  id?: string;
  url?: string;
  demo?: string;
  webUrl?: string;
  apiUrl?: string;
  latestVersion?: { id?: string; demoUrl?: string; status?: string };
};

/**
 * Extracts and deduplicates all available v0 API keys into a prioritized failover pool.
 */
export function getV0ApiKeyPool(customKey?: string, settings?: AppSettings): string[] {
  const rawKeys: string[] = [];

  // 1. Explicitly passed custom keys or settings keys (supports comma and newline separation)
  if (customKey && customKey.trim()) {
    rawKeys.push(...customKey.split(/[\n,;]+/).map((k) => k.trim()));
  }
  if (settings?.v0ApiKey && settings.v0ApiKey.trim()) {
    rawKeys.push(...settings.v0ApiKey.split(/[\n,;]+/).map((k) => k.trim()));
  }

  // 2. Environment variable keys
  if (process.env.V0_API_KEY && process.env.V0_API_KEY.trim()) {
    rawKeys.push(...process.env.V0_API_KEY.split(/[\n,;]+/).map((k) => k.trim()));
  }
  if (process.env.V0_BACKUP_API_KEYS && process.env.V0_BACKUP_API_KEYS.trim()) {
    rawKeys.push(...process.env.V0_BACKUP_API_KEYS.split(/[\n,;]+/).map((k) => k.trim()));
  }


  // Filter valid v0 format keys and deduplicate
  const cleanKeys = Array.from(new Set(rawKeys.filter((k) => k && k.length > 10)));
  return cleanKeys;
}

/**
 * Creates a v0 live demo with automatic multi-key failover and syntax-safe prompt compilation.
 */
export async function createV0Demo(
  lead: Lead,
  customV0ApiKey?: string,
  customV0Model?: string,
  qualityOverride?: DemoQuality,
  settings?: AppSettings
): Promise<V0DemoResult> {
  const keyPool = getV0ApiKeyPool(customV0ApiKey, settings);

  if (keyPool.length === 0) {
    return {
      provider: 'v0',
      status: 'failed',
      error: 'No valid v0 API key configured. Please add your v0 API Key in Settings or .env.local.'
    };
  }

  const quality: DemoQuality = qualityOverride || lead.demo_quality || 'low';
  const modelIds = getV0ModelCandidates(quality, customV0Model || process.env.V0_MODEL);
  const primaryPrompt = compactV0Prompt(lead, quality);

  let lastError = '';
  let chat: V0ChatResponse | null = null;
  let keyAttempt = 0;

  // 1. Primary Loop: Shift across available API keys in the failover pool
  for (const apiKey of keyPool) {
    keyAttempt++;
    const maskedKey = `${apiKey.slice(0, 7)}...${apiKey.slice(-6)}`;

    for (const modelId of modelIds) {
      try {
        const chatRes = await fetch('https://api.v0.dev/v1/chats', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            system: getSystemInstruction(quality),
            message: primaryPrompt,
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
          const resJson = (await chatRes.json()) as V0ChatResponse;
          const demoUrl = resJson.latestVersion?.demoUrl || resJson.demo || resJson.webUrl || resJson.url;
          if (demoUrl) {
            chat = resJson;
            break;
          }
        }

        const errText = await chatRes.text();
        lastError = `Key #${keyAttempt} [${maskedKey}] (${modelId}) -> ${chatRes.status}: ${errText.slice(0, 160)}`;

        // If key is unauthorized, depleted, or rate-limited, move immediately to next key
        if ([401, 402, 429].includes(chatRes.status)) {
          break; // break model loop, advance to next key in pool
        }
      } catch (err) {
        lastError = `Key #${keyAttempt} Network error: ${err instanceof Error ? err.message : String(err)}`;
      }
    }

    if (chat) break; // Succeeded!
  }

  // 2. Syntax-Safe Fallback Pass: If standard prompt failed, retry with simplified syntax-safe prompt
  if (!chat && keyPool.length > 0) {
    const fallbackPrompt = getSyntaxSafePrompt(lead);
    for (const apiKey of keyPool) {
      try {
        const chatRes = await fetch('https://api.v0.dev/v1/chats', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            system: getSystemInstruction('low'),
            message: fallbackPrompt,
            chatPrivacy: 'unlisted',
            responseMode: 'sync',
            modelConfiguration: {
              modelId: 'v0-mini',
              imageGenerations: false,
              thinking: false
            }
          })
        });

        if (chatRes.ok) {
          const resJson = (await chatRes.json()) as V0ChatResponse;
          const demoUrl = resJson.latestVersion?.demoUrl || resJson.demo || resJson.webUrl || resJson.url;
          if (demoUrl) {
            chat = resJson;
            break;
          }
        }
      } catch {
        // Continue fallback attempts
      }
    }
  }

  if (!chat) {
    return {
      provider: 'v0',
      status: 'failed',
      error: lastError || 'v0 AI site building failed across all configured API keys.'
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
      error: 'v0 completed generation but did not return a public demo URL.'
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

function getSystemInstruction(quality: DemoQuality): string {
  if (quality === 'high') {
    return `You are v0 by Vercel. Generate an ultra-luxurious, award-winning, state-of-the-art flagship web application and high-converting landing page component in React + Next.js + Tailwind CSS.

CRITICAL SYNTAX & COMPILER INSTRUCTIONS:
- Generate 100% syntactically valid TypeScript/React JSX.
- NEVER output dangling or stray semicolons inside JSX tags, element attributes, or style objects (e.g. NEVER write style={{ color: 'red'; }} or <Component prop={val;} />).
- All JavaScript code must be valid and properly enclosed in standard hooks (useState, useEffect, useMemo) or handler functions.
- Import standard icons from 'lucide-react'.
- Provide rich interactive elements with React state (cost/quote calculator slider, appointment booking drawer, tabbed capability matrix, customer review badges).
- Export default single component.`;
  }

  return `You are v0 by Vercel. Generate a clean, polished, responsive React + Next.js + Tailwind CSS landing page component.

CRITICAL SYNTAX & COMPILER INSTRUCTIONS:
- Generate 100% syntactically valid TypeScript/React JSX.
- NEVER output dangling or stray semicolons inside JSX tags, element attributes, or style objects (e.g. NEVER write style={{ color: 'red'; }} or <Component prop={val;} />).
- Include hero section, clear value proposition, service cards with pricing, 1-click booking scheduler form, and mobile footer.
- Import icons from 'lucide-react'.
- Export default single component.`;
}

function getV0ModelCandidates(quality: DemoQuality, configured?: string) {
  if (quality === 'high') {
    const preferred = configured && configured !== 'v0-mini' ? configured : 'v0-pro';
    const candidates = [preferred, 'v0-pro', 'v0-max-fast', 'v0-mini'];
    return [...new Set(candidates.filter(Boolean))];
  }

  const preferred = configured || 'v0-mini';
  const candidates = [preferred, 'v0-mini', 'v0-max-fast'];
  return [...new Set(candidates.filter(Boolean))];
}

function compactV0Prompt(lead: Lead, quality: DemoQuality): string {
  const maxChars = quality === 'high' ? 4500 : Number(process.env.V0_MAX_PROMPT_CHARS || 3000);
  const fullPrompt = buildDemoPrompt(lead, quality);

  const cleanWeakness = (lead.weakness || '').replace(/['";]/g, ' ').trim();
  const cleanCompany = (lead.company_name || '').replace(/['";]/g, ' ').trim();

  const compact = `${fullPrompt}

v0 Directive (${quality === 'high' ? 'Ultra High-End Mode' : 'Standard Fast Mode'}):
- Brand: "${cleanCompany}".
- Target conversion gap to solve: "${cleanWeakness}".
- Modern Tailwind CSS styling with zero placeholder text.
- Full interactive self-contained component with Lucide icons.
- Strict TSX syntax: No stray semicolons in JSX tags or style objects.`;

  return compact.length > maxChars ? `${compact.slice(0, maxChars)}\n\nBuild full v0 site.` : compact;
}

function getSyntaxSafePrompt(lead: Lead): string {
  const cleanCompany = (lead.company_name || 'Business').replace(/['";]/g, ' ').trim();
  const cleanCity = (lead.city || 'Local Area').replace(/['";]/g, ' ').trim();
  const cleanNiche = (lead.niche || 'Professional Services').replace(/['";]/g, ' ').trim();
  const cleanWeakness = (lead.weakness || 'Missing streamlined mobile booking path').replace(/['";]/g, ' ').trim();

  return `Build a clean, high-converting React + Tailwind CSS landing page for "${cleanCompany}" in ${cleanCity}.
Niche: ${cleanNiche}.
Conversion gap to solve: "${cleanWeakness}".

RULES:
- Clean, 100% valid TypeScript/React JSX syntax.
- Zero stray semicolons inside JSX tags or inline style objects.
- Include sticky navigation bar with phone CTA, hero with value proposition, 3 service cards with pricing, 1-click booking scheduler widget, 2 customer review cards, and mobile footer.
- Use Lucide icons from 'lucide-react'.
- Export default single component.`;
}
