import { fetchWithTimeout } from '@/lib/http';
import type { Lead } from '@/lib/types';

export async function generateCampaignKeywords(
  audience: string,
  locations: string,
  source: string,
  customApiKey?: string,
  customModel?: string
): Promise<string[]> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) return [];
  const models = [
    customModel,
    process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.5-flash-lite'
  ].filter(Boolean) as string[];

  const currentYear = new Date().getFullYear();
  const prompt = `Generate 5 to 8 highly realistic, high-intent discovery search queries to scrape cold prospects for an outreach campaign.

Target Context:
- Target audience / niche: ${audience}
- Locations: ${locations || 'Global'}
- Lead source: ${source}

Follow these query expansion strategies:
1. Current year & timeline queries (e.g. "${audience} ${currentYear} in ${locations || 'US'}")
2. Sub-niche & category variations (e.g. "${audience} SaaS", "new ${audience} tools")
3. Registrations, directories & tracking lists (e.g. "recently registered ${audience}", "${audience} directory", "funded ${audience}")
4. High-intent commercial queries (e.g. "top ${audience} companies in ${locations || 'US'}")

Return ONLY a JSON array of 5 to 8 string search queries:
["query 1", "query 2", "query 3", "query 4", "query 5"]`;

  for (const model of [...new Set(models)]) {
    try {
      const res = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4, responseMimeType: 'application/json' }
          })
        },
        30_000
      );

      if (!res.ok) continue;

      const payload = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = payload.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
      const parsed = JSON.parse(extractJsonArray(text)) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((k) => String(k).trim()).filter(Boolean);
      }
    } catch {
      continue;
    }
  }

  return [];
}

export async function analyzeLeadWithGemini(
  lead: Lead,
  customApiKey?: string,
  customModel?: string
): Promise<Partial<Lead>> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) return {};
  const models = [
    customModel,
    process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.5-flash-lite'
  ].filter(Boolean) as string[];

  const prompt = `You are an elite cold outreach copywriter. Analyze this prospect and generate a high-converting cold email using the AIDA framework.

FRAMEWORK: AIDA (Attention → Interest → Desire → Action)
- Attention: Open with a specific observation about their business weakness (the trigger for outreach)
- Interest: Frame the business impact of this weakness in 1 sentence
- Desire: Introduce the custom demo as a PRIVATELY built exclusive asset, include a niche-specific social proof line (e.g. "businesses like yours typically see a 30-60% lift with this fix")
- Action: End with a zero-friction CTA like "Worth a quick look?" (NEVER "Schedule a call" or "Let's hop on a meeting")

RULES:
- Under 120 words total for outreach_body
- Use {{demo_url}} placeholder where the demo link goes
- Single-sentence paragraphs for mobile readability
- Never use "I hope this finds you well", "I wanted to reach out", or "touching base"
- Subject line must be 2-6 words, curiosity-driven (e.g. "Quick idea for {Company}", "Noticed this on {Company}'s site")
- The demo should feel like a gift, not a sales pitch — use language like "privately built", "put together for your team"

Return ONLY a JSON object:
{
  "fit_score": 1-100,
  "weakness": "specific digital presence weakness in 1 sentence",
  "qualification_reason": "why this prospect is worth a personalized demo",
  "outreach_subject": "2-6 word curiosity-driven subject line",
  "outreach_body": "AIDA-structured cold email under 120 words with {{demo_url}} placeholder"
}

Prospect:
${JSON.stringify(lead, null, 2)}`;

  let lastError = '';
  for (const model of [...new Set(models)]) {
    const res = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.35, responseMimeType: 'application/json' }
        })
      },
      30_000
    );

    if (!res.ok) {
      lastError = `${model}: ${res.status} ${await res.text()}`;
      if (res.status === 404 || res.status === 400) continue;
      throw new Error(`Gemini analysis failed: ${lastError}`);
    }

    const payload = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    try {
      return JSON.parse(extractJson(text)) as Partial<Lead>;
    } catch {
      return {};
    }
  }

  throw new Error(`Gemini analysis failed: ${lastError || 'No supported model responded.'}`);
}

function extractJson(text: string) {
  const trimmed = text.replace(/```json|```/g, '').trim();
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return '{}';
  return trimmed.slice(start, end + 1);
}

function extractJsonArray(text: string) {
  const trimmed = text.replace(/```json|```/g, '').trim();
  const start = trimmed.indexOf('[');
  const end = trimmed.lastIndexOf(']');
  if (start === -1 || end === -1 || end < start) return '[]';
  return trimmed.slice(start, end + 1);
}
