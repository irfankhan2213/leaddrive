import type { Lead } from '@/lib/types';

export async function analyzeLeadWithGemini(lead: Lead): Promise<Partial<Lead>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return {};
  const models = [
    process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.5-flash-lite'
  ];

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
