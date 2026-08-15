import { VertexAI } from '@google-cloud/vertexai';
import type { CampaignInput, DigitalSignal, Lead } from '@/lib/types';
import path from 'path';
import fs from 'fs';

interface VertexConfig {
  projectId?: string;
  location?: string;
  model?: string;
  enableGrounding?: boolean;
}

function resolveGcpCredentials() {
  const projectId = process.env.GCP_PROJECT_ID || 'skillful-fx-467601-h4';
  const location = process.env.GCP_LOCATION || 'us-central1';

  try {
    const keyPath = path.join(/*turbopackIgnore: true*/ process.cwd(), 'gcp-service-account.json');
    if (fs.existsSync(keyPath)) {
      return { projectId, location, keyFilename: keyPath };
    }
  } catch {
    // Ignore fallback
  }

  return { projectId, location };
}

let vertexAiClient: VertexAI | null = null;

export function getVertexAIClient(config?: VertexConfig): VertexAI {
  const auth = resolveGcpCredentials();
  const projectId = config?.projectId || auth.projectId;
  const location = config?.location || auth.location;

  if (!vertexAiClient) {
    vertexAiClient = new VertexAI({
      project: projectId,
      location: location,
      googleAuthOptions: auth.keyFilename ? { keyFile: auth.keyFilename } : undefined
    });
  }

  return vertexAiClient;
}

export async function generateVertexCampaignKeywords(
  input: CampaignInput,
  config?: VertexConfig
): Promise<string[]> {
  try {
    const vertex = getVertexAIClient(config);
    const modelName = config?.model || process.env.VERTEX_AI_MODEL || 'gemini-2.5-flash';
    const enableGrounding = config?.enableGrounding ?? (process.env.VERTEX_SEARCH_GROUNDING !== 'false');

    const generativeModel = vertex.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 800,
        responseMimeType: 'application/json'
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: enableGrounding ? ([{ googleSearch: {} }] as any) : undefined
    });

    const prompt = `You are a world-class B2B Prospecting & Search Intelligence Engine.
Analyze the target audience and locations below, and generate 12 to 18 highly specific, high-intent Google Maps & Web search query variations to discover business prospects that need digital modernizations.

TARGET CRITERIA:
- Audience / ICP: "${input.audience}"
- Location(s): "${input.locations}"
- Target Strategy: High commercial intent, verified local listings, directories, and niche specializations.

Return a JSON array of search strings. Example format:
["HVAC emergency repair Austin TX", "commercial roofing contractors Travis County", "residential air conditioning installation near Austin"]`;

    const result = await generativeModel.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Empty response from Vertex AI Gemini.');
    }

    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch (err) {
    console.warn('[Vertex AI] Keyword generation error:', err instanceof Error ? err.message : err);
  }

  return [];
}

export async function analyzeLeadWithVertex(
  lead: Lead,
  config?: VertexConfig
): Promise<{
  fit_score: number;
  weakness: string;
  qualification_reason: string;
  signals: DigitalSignal[];
  outreach_body?: string;
}> {
  try {
    const vertex = getVertexAIClient(config);
    const modelName = config?.model || process.env.VERTEX_AI_MODEL || 'gemini-2.5-flash';
    const enableGrounding = config?.enableGrounding ?? (process.env.VERTEX_SEARCH_GROUNDING !== 'false');

    const generativeModel = vertex.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1000,
        responseMimeType: 'application/json'
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: enableGrounding ? ([{ googleSearch: {} }] as any) : undefined
    });

    const existingSignals = lead.signals.map((s) => `${s.label}: ${s.value}`).join(', ');

    const prompt = `You are an elite B2B Sales & Digital Audit Specialist on Google Cloud Vertex AI.
Perform an in-depth conversion audit on this business prospect and identify exact conversion leaks.

PROSPECT DATA:
- Company Name: "${lead.company_name}"
- Website: "${lead.website_url || 'No Website'}"
- City: "${lead.city || 'Unknown'}"
- Niche: "${lead.niche || 'Local Business'}"
- Phone: "${lead.phone || 'Unknown'}"
- Rating / Reviews: ${lead.rating ? `${lead.rating}★ (${lead.reviews_count || 0} reviews)` : 'None'}
- Existing Audit Signals: ${existingSignals || 'Standard audit'}

EVALUATION RULES:
1. "fit_score": Integer 0-100 indicating conversion likelihood for a web/AI modernisation agency pitch.
2. "weakness": A razor-sharp, highly specific conversion leak (e.g. "Lacks 1-click booking tool, losing high-intent mobile visitors to local competitors").
3. "qualification_reason": Concise 1-sentence sales justification for reaching out.
4. "signals": Array of 3 to 4 digital signals with "severity" ('positive'|'warning'|'critical') and concise "label" and "value".

Return valid JSON with keys: "fit_score", "weakness", "qualification_reason", "signals".`;

    const result = await generativeModel.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Empty response from Vertex AI lead analysis.');
    }

    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      fit_score: typeof parsed.fit_score === 'number' ? Math.min(100, Math.max(0, parsed.fit_score)) : 82,
      weakness: parsed.weakness || lead.weakness,
      qualification_reason: parsed.qualification_reason || lead.qualification_reason,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      signals: Array.isArray(parsed.signals)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? parsed.signals.map((s: any) => ({
            label: s.label || 'Digital audit',
            value: s.value || s.detail || 'Detected',
            severity: s.severity || 'warning'
          }))
        : lead.signals,
      outreach_body: parsed.outreach_body
    };
  } catch (err) {
    console.warn('[Vertex AI] Lead analysis error:', err instanceof Error ? err.message : err);
    return {
      fit_score: lead.fit_score || 80,
      weakness: lead.weakness || 'Missing direct mobile booking integration.',
      qualification_reason: lead.qualification_reason || 'Qualified for high-ticket modernization pitch.',
      signals: lead.signals
    };
  }
}

export async function testVertexConnection(): Promise<{ success: boolean; model: string; message: string }> {
  const auth = resolveGcpCredentials();
  const vertex = getVertexAIClient();
  const modelName = process.env.VERTEX_AI_MODEL || 'gemini-2.5-flash';

  const generativeModel = vertex.getGenerativeModel({
    model: modelName,
    generationConfig: { maxOutputTokens: 30 }
  });

  const result = await generativeModel.generateContent('Return the text: Vertex AI Connected');
  const response = result.response;
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return {
    success: text.toLowerCase().includes('vertex'),
    model: modelName,
    message: text.trim()
  };
}
