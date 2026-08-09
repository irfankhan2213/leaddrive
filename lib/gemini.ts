import type { Lead } from '@/lib/types';

export async function analyzeLeadWithGemini(lead: Lead): Promise<Partial<Lead>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return {};

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

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.35, responseMimeType: 'application/json' }
      })
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini analysis failed: ${res.status}`);
  }

  const payload = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try {
    return JSON.parse(text) as Partial<Lead>;
  } catch {
    return {};
  }
}
