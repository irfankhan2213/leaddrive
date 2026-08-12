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

  const prompt = `Generate 5 to 8 highly specific commercial search keywords/phrases to scrape target prospects for a cold outreach campaign.

Context:
- Target audience: ${audience}
- Locations: ${locations || 'General'}
- Lead source: ${source}

Return only JSON array of string keywords, for example:
["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"]`;

  for (const model of [...new Set(models)]) {
    try {
      const res = await fetch(
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
        }
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

  const prompt = `Analyze this prospect for a cold outreach demo campaign.

Return only JSON:
{
  "fit_score": 1-100,
  "weakness": "specific digital presence weakness",
  "qualification_reason": "why this is or is not worth a personalized demo",
  "outreach_subject": "short email subject",
  "outreach_body": "under 100 words with demo link placeholder {{demo_url}}"
}

Prospect:
${JSON.stringify(lead, null, 2)}`;

  let lastError = '';
  for (const model of [...new Set(models)]) {
    const res = await fetch(
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
      }
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
