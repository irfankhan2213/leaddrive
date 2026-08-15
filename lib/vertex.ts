import { VertexAI } from '@google-cloud/vertexai';
import type { AgenticStrategy, CampaignInput, DemoQuality, DigitalSignal, Lead } from '@/lib/types';
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

function extractJsonFromResponse<T = unknown>(text: string): T {
  if (!text) throw new Error('Empty text provided');
  let clean = text.trim();

  // 1. Strip markdown fences if present
  if (clean.includes('```')) {
    clean = clean.replace(/^[\s\S]*?```(?:json)?\s*/i, '');
    const endFence = clean.lastIndexOf('```');
    if (endFence !== -1) {
      clean = clean.substring(0, endFence).trim();
    }
  }

  // 2. Direct parse cleaned text
  try {
    return JSON.parse(clean) as T;
  } catch {
    // 3. Find outermost Object { ... }
    const firstObj = clean.indexOf('{');
    const lastObj = clean.lastIndexOf('}');
    if (firstObj !== -1 && lastObj > firstObj) {
      const objStr = clean.substring(firstObj, lastObj + 1);
      try {
        return JSON.parse(objStr) as T;
      } catch {
        try {
          const sanitized = objStr.replace(/(?<=:\s*"[^"]*)\n(?=[^"]*")/g, '\\n');
          return JSON.parse(sanitized) as T;
        } catch {}
      }
    }

    // 4. Find outermost Array [ ... ]
    const firstArr = clean.indexOf('[');
    const lastArr = clean.lastIndexOf(']');
    if (firstArr !== -1 && lastArr > firstArr) {
      const arrStr = clean.substring(firstArr, lastArr + 1);
      try {
        return JSON.parse(arrStr) as T;
      } catch {
        try {
          const sanitized = arrStr.replace(/(?<=:\s*"[^"]*)\n(?=[^"]*")/g, '\\n');
          return JSON.parse(sanitized) as T;
        } catch {}
      }
    }
  }

  // 5. Try raw text
  try {
    return JSON.parse(text.trim()) as T;
  } catch {}

  throw new Error(`Unable to extract JSON from Vertex AI response: ${text.slice(0, 100)}...`);
}

export async function generateVertexCampaignKeywords(
  input: CampaignInput,
  config?: VertexConfig
): Promise<string[]> {
  try {
    const vertex = getVertexAIClient(config);
    const modelName = config?.model || process.env.VERTEX_AI_MODEL || 'gemini-3.7-flash';
    const enableGrounding = config?.enableGrounding ?? (process.env.VERTEX_SEARCH_GROUNDING !== 'false');

    const generativeModel = vertex.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
        // Do not set responseMimeType when Search tool is enabled (Vertex AI constraint)
        responseMimeType: enableGrounding ? undefined : 'application/json'
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

CRITICAL: Return ONLY a valid JSON array of search strings. Do not include markdown preamble. Example:
["HVAC emergency repair Austin TX", "commercial roofing contractors Travis County", "residential air conditioning installation near Austin"]`;

    const result = await generativeModel.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Empty response from Vertex AI Gemini.');
    }

    const parsed = extractJsonFromResponse<string[]>(text);
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
    const modelName = config?.model || process.env.VERTEX_AI_MODEL || 'gemini-3.7-flash';
    const enableGrounding = config?.enableGrounding ?? (process.env.VERTEX_SEARCH_GROUNDING !== 'false');

    const generativeModel = vertex.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
        // Do not set responseMimeType when Search tool is enabled (Vertex AI constraint)
        responseMimeType: enableGrounding ? undefined : 'application/json'
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

CRITICAL: Return ONLY a valid JSON object with keys: "fit_score", "weakness", "qualification_reason", "signals".`;

    const result = await generativeModel.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Empty response from Vertex AI lead analysis.');
    }

    const parsed = extractJsonFromResponse<{
      fit_score?: number;
      weakness?: string;
      qualification_reason?: string;
      signals?: Array<{ label?: string; value?: string; detail?: string; severity?: 'positive' | 'warning' | 'critical' }>;
      outreach_body?: string;
    }>(text);

    return {
      fit_score: typeof parsed.fit_score === 'number' ? Math.min(100, Math.max(0, parsed.fit_score)) : 82,
      weakness: parsed.weakness || lead.weakness,
      qualification_reason: parsed.qualification_reason || lead.qualification_reason,
      signals: Array.isArray(parsed.signals)
        ? parsed.signals.map((s) => ({
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

export async function generateAgenticDemoStrategy(
  lead: Lead,
  quality: DemoQuality = 'low',
  config?: VertexConfig
): Promise<AgenticStrategy> {
  try {
    const vertex = getVertexAIClient(config);
    const modelName = config?.model || process.env.VERTEX_AI_MODEL || 'gemini-3.7-flash';

    const signalSummary = lead.signals.map((signal) => `${signal.label}: ${signal.value}`).join('; ');
    const prompt = `You are LeadDrive's elite Full-Stack UI/UX Web Strategist running on Google Cloud Vertex AI.
Create a rich, state-of-the-art, flagship interactive web application blueprint for this prospect matching the craft, depth, and interactivity of a top-tier v0 website.

PROSPECT DETAILS:
- Company: "${lead.company_name}"
- Website: "${lead.website_url || 'No website found'}"
- Market/City: "${lead.city || 'Local Area'}"
- Niche: "${lead.niche || 'High-Ticket Services'}"
- Key Weakness/Vulnerability: "${lead.weakness}"
- Fit Score: ${lead.fit_score}
- Audit Signals: "${signalSummary || 'None'}"
- Review Rating: ${lead.rating ? `${lead.rating}★ (${lead.reviews_count || 0} reviews)` : 'None'}
- Demo Fidelity: "${quality}"

Generate a valid JSON object matching this comprehensive schema:
{
  "title": "Short descriptive demo title",
  "tagline": "Punchy brand tagline",
  "heroHeadline": "Compelling, modern hero headline crafted specifically for their brand",
  "positioning": "One to two persuasive sentences explaining why this demo directly solves their conversion leak",
  "primaryCta": "High-converting primary button label (e.g. 'Get Instant Quote & Book Online')",
  "secondaryCta": "Secondary button label (e.g. 'Calculate Estimate')",
  "proofPoints": [
    "4 strong credibility, speed, or trust proof points"
  ],
  "pricingPackages": [
    {
      "name": "Standard / Priority Package Name",
      "price": "$89 or $149 or Custom Quote",
      "duration": "Within 90 mins or Scheduled",
      "popular": true,
      "description": "Clear benefit-driven package description.",
      "perks": ["3 to 4 key inclusions or guarantees"]
    },
    {
      "name": "Comprehensive / Maintenance Package Name",
      "price": "$189 or $299",
      "duration": "Same-day inspection",
      "popular": false,
      "description": "Full-service package description.",
      "perks": ["3 to 4 key inclusions"]
    },
    {
      "name": "Flagship / Replacement Package Name",
      "price": "Custom Estimate",
      "duration": "Free consultation",
      "popular": false,
      "description": "High-ticket service description.",
      "perks": ["Extended warranty", "Financing available", "Free on-site quote"]
    }
  ],
  "calculator": {
    "serviceType": "Project or Service Scope",
    "unitLabel": "Property Sq Ft or Service Units",
    "basePrice": 89,
    "pricePerUnit": 0.04,
    "defaultUnits": 1800,
    "minUnits": 600,
    "maxUnits": 5000,
    "step": 100,
    "options": [
      { "label": "Emergency / Same-Day Fast-Track", "price": 49 },
      { "label": "Comprehensive Sanitization / Deep Inspection", "price": 39 },
      { "label": "Extended Workmanship Warranty (1-Year)", "price": 59 }
    ]
  },
  "comparison": {
    "current": ["Slow phone-tag during busy hours", "No after-hours online booking", "Uncertain technician ETA", "Loses mobile visitors to fast competitors"],
    "modernized": ["Instant 60-second 1-click booking", "24/7 AI Receptionist Concierge", "Live SMS dispatch & arrival confirmation", "Sub-second mobile-first speed"]
  },
  "reviews": [
    {
      "author": "Local Verified Customer",
      "location": "${lead.city || 'Local Area'}",
      "content": "Outstanding experience. The online scheduler made it effortless and the team was at our door in under an hour.",
      "rating": 5,
      "verified": true
    },
    {
      "author": "Property Owner",
      "location": "${lead.city || 'Local Area'}",
      "content": "Upfront pricing with zero hidden fees. Highly recommend their professional technicians.",
      "rating": 5,
      "verified": true
    }
  ],
  "faqs": [
    {
      "question": "How quickly can a specialist arrive in ${lead.city || 'our area'}?",
      "answer": "Emergency priority bookings are dispatched within 60 to 90 minutes. Scheduled appointments have guaranteed 2-hour arrival windows."
    },
    {
      "question": "Do I have to pay upfront to book online?",
      "answer": "No upfront payment is required. You approve the transparent quote with your technician on-site before work begins."
    },
    {
      "question": "Are your technicians licensed and insured?",
      "answer": "Yes, every technician is 100% background-checked, state-licensed, and backed by our full Workmanship Guarantee."
    }
  ],
  "sections": [
    {
      "title": "Section Title 1",
      "purpose": "Conversion purpose",
      "copy": "Persuasive sample copy addressing their weakness"
    },
    {
      "title": "Section Title 2",
      "purpose": "Conversion purpose",
      "copy": "Persuasive sample copy addressing their weakness"
    },
    {
      "title": "Section Title 3",
      "purpose": "Conversion purpose",
      "copy": "Persuasive sample copy addressing their weakness"
    }
  ],
  "promptEnhancement": "A compact, highly effective prompt addendum for live component generation"
}`;

    let text: string | undefined;
    try {
      const generativeModel = vertex.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.15,
          maxOutputTokens: quality === 'high' ? 4096 : 3072,
          responseMimeType: 'application/json'
        }
      });
      const result = await generativeModel.generateContent(prompt);
      text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (modelErr) {
      if (modelName !== 'gemini-2.5-flash') {
        console.warn(`[Vertex AI] Model ${modelName} unavailable, falling back to gemini-2.5-flash:`, modelErr instanceof Error ? modelErr.message : modelErr);
        const fallbackModel = vertex.getGenerativeModel({
          model: 'gemini-2.5-flash',
          generationConfig: {
            temperature: 0.15,
            maxOutputTokens: quality === 'high' ? 4096 : 3072,
            responseMimeType: 'application/json'
          }
        });
        const fallbackResult = await fallbackModel.generateContent(prompt);
        text = fallbackResult.response.candidates?.[0]?.content?.parts?.[0]?.text;
      } else {
        throw modelErr;
      }
    }

    if (!text) throw new Error('Empty response from Vertex agentic demo strategist.');

    const parsed = extractJsonFromResponse<Record<string, unknown>>(text);
    return normalizeAgenticStrategy(parsed, lead);
  } catch (err) {
    console.warn('[Vertex AI] Agentic demo strategy warning:', err instanceof Error ? err.message : err);
    return fallbackAgenticStrategy(lead);
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

function normalizeAgenticStrategy(value: Record<string, unknown>, lead: Lead): AgenticStrategy {
  const fallback = fallbackAgenticStrategy(lead);

  const sections = Array.isArray(value.sections) && value.sections.length > 0
    ? value.sections.slice(0, 6).map((section) => {
        const item = section as Record<string, unknown>;
        return {
          title: String(item.title || 'Conversion Feature'),
          purpose: String(item.purpose || 'Accelerate prospect conversion.'),
          copy: String(item.copy || lead.weakness)
        };
      })
    : fallback.sections;

  const proofPoints = Array.isArray(value.proofPoints) && value.proofPoints.length > 0
    ? value.proofPoints.slice(0, 5).map(String)
    : fallback.proofPoints;

  const pricingPackages = Array.isArray(value.pricingPackages) && value.pricingPackages.length > 0
    ? value.pricingPackages.slice(0, 4).map((p) => {
        const item = p as Record<string, unknown>;
        return {
          name: String(item.name || 'Core Service Package'),
          price: String(item.price || '$99'),
          duration: String(item.duration || 'Fast Dispatch'),
          popular: Boolean(item.popular),
          description: String(item.description || 'Complete priority service inspection and upfront quote.'),
          perks: Array.isArray(item.perks) ? item.perks.map(String) : ['100% Upfront Guarantee', 'Certified Technicians', 'Fast Booking']
        };
      })
    : fallback.pricingPackages;

  const calculator = value.calculator && typeof value.calculator === 'object'
    ? {
        serviceType: String((value.calculator as Record<string, unknown>).serviceType || 'Service Size'),
        unitLabel: String((value.calculator as Record<string, unknown>).unitLabel || 'Sq Ft / Scope'),
        basePrice: Number((value.calculator as Record<string, unknown>).basePrice) || 89,
        pricePerUnit: Number((value.calculator as Record<string, unknown>).pricePerUnit) || 0.04,
        defaultUnits: Number((value.calculator as Record<string, unknown>).defaultUnits) || 1800,
        minUnits: Number((value.calculator as Record<string, unknown>).minUnits) || 600,
        maxUnits: Number((value.calculator as Record<string, unknown>).maxUnits) || 5000,
        step: Number((value.calculator as Record<string, unknown>).step) || 100,
        options: Array.isArray((value.calculator as Record<string, unknown>).options)
          ? ((value.calculator as Record<string, unknown>).options as Array<Record<string, unknown>>).map((opt) => ({
              label: String(opt.label || 'Priority Add-on'),
              price: Number(opt.price) || 39
            }))
          : fallback.calculator!.options
      }
    : fallback.calculator;

  const comparison = value.comparison && typeof value.comparison === 'object'
    ? {
        current: Array.isArray((value.comparison as Record<string, unknown>).current)
          ? ((value.comparison as Record<string, unknown>).current as string[]).map(String)
          : fallback.comparison!.current,
        modernized: Array.isArray((value.comparison as Record<string, unknown>).modernized)
          ? ((value.comparison as Record<string, unknown>).modernized as string[]).map(String)
          : fallback.comparison!.modernized
      }
    : fallback.comparison;

  const reviews = Array.isArray(value.reviews) && value.reviews.length > 0
    ? value.reviews.slice(0, 4).map((r) => {
        const item = r as Record<string, unknown>;
        return {
          author: String(item.author || 'Verified Client'),
          location: String(item.location || lead.city || 'Local Customer'),
          content: String(item.content || 'Exceptional service and communication.'),
          rating: Number(item.rating) || 5,
          verified: true
        };
      })
    : fallback.reviews;

  const faqs = Array.isArray(value.faqs) && value.faqs.length > 0
    ? value.faqs.slice(0, 5).map((f) => {
        const item = f as Record<string, unknown>;
        return {
          question: String(item.question || 'How does priority booking work?'),
          answer: String(item.answer || 'Select your time slot online and receive an instant simulated SMS confirmation.')
        };
      })
    : fallback.faqs;

  return {
    title: String(value.title || `${lead.company_name} - Priority Conversion Site`),
    tagline: String(value.tagline || `Top-Rated ${lead.niche} in ${lead.city || 'Your Area'}`),
    positioning: String(value.positioning || `A focused interactive demo showing how ${lead.company_name} can fix ${lead.weakness.toLowerCase()}`),
    heroHeadline: String(value.heroHeadline || `Turn more ${lead.city || 'local'} searches into booked customers`),
    primaryCta: String(value.primaryCta || 'Book Priority Service Online'),
    secondaryCta: String(value.secondaryCta || 'Calculate Instant Estimate'),
    sections,
    proofPoints,
    pricingPackages,
    calculator,
    comparison,
    reviews,
    faqs,
    promptEnhancement: String(
      value.promptEnhancement ||
        `Design around ${lead.weakness}. Prioritize 1-click booking, transparent estimator, proof points, and mobile-first speed.`
    )
  };
}

function fallbackAgenticStrategy(lead: Lead): AgenticStrategy {
  return {
    title: `${lead.company_name} - Modernized Conversion Platform`,
    tagline: `Top-Rated ${lead.niche} in ${lead.city || 'Central Texas'}`,
    positioning: `A focused live prototype demonstrating how ${lead.company_name} can eliminate conversion leaks and capture high-intent search traffic with 1-click booking and 24/7 AI Concierge.`,
    heroHeadline: `${lead.company_name}: Fast, Reliable ${lead.niche} in ${lead.city || 'Austin, TX'}. Book in 60 Seconds.`,
    primaryCta: 'Book Priority Service Online',
    secondaryCta: 'Estimate Project Cost',
    sections: [
      {
        title: 'Instant 1-Click Online Booking',
        purpose: 'Capture high-intent traffic 24/7 with zero phone friction.',
        copy: `Directly solves "${lead.weakness}". Allows customers to select their preferred service, choose an arrival window, and receive instant SMS confirmation.`
      },
      {
        title: 'Sub-Second Page Speed & Mobile UX',
        purpose: 'Prevent bounce rates and maximize Google Search ranking.',
        copy: 'Engineered for sub-second mobile load times, modern glassmorphic cards, and frictionless navigation across every device.'
      },
      {
        title: '24/7 AI Receptionist Concierge',
        purpose: 'Answer prospect questions and qualify jobs after-hours.',
        copy: 'Instant automated responses for pricing inquiries, availability, and emergency dispatch, ensuring you never lose a job to voicemail.'
      }
    ],
    proofPoints: [
      `Guaranteed 1-hour priority response in ${lead.city || 'your area'}`,
      '100% Upfront pricing with zero hidden fees',
      '24/7 AI-powered dispatch & emergency booking',
      'State-licensed, insured & background-checked experts'
    ],
    pricingPackages: [
      {
        name: 'Emergency Priority Service',
        price: '$89',
        duration: 'Within 90 mins',
        popular: true,
        description: 'Fast on-site dispatch to inspect, diagnose, and resolve immediate issues.',
        perks: ['Priority dispatch queue', 'Comprehensive multi-point audit', '100% upfront quote approval guarantee']
      },
      {
        name: 'Complete Preventive Maintenance',
        price: '$149',
        duration: 'Scheduled 2-hr window',
        popular: false,
        description: 'Comprehensive tune-up and safety inspection to prevent costly future breakdowns.',
        perks: ['Deep system calibration', 'Filter & safety check', 'Extended warranty coverage']
      },
      {
        name: 'Full System Upgrade & Install',
        price: 'Custom Quote',
        duration: 'Free on-site estimate',
        popular: false,
        description: 'High-efficiency replacement and modernization with flexible financing.',
        perks: ['10-year parts & labor warranty', '0% APR financing available', 'Rebate assistance included']
      }
    ],
    calculator: {
      serviceType: 'Service Scope Size',
      unitLabel: 'Property Sq Ft',
      basePrice: 89,
      pricePerUnit: 0.04,
      defaultUnits: 1800,
      minUnits: 600,
      maxUnits: 5000,
      step: 100,
      options: [
        { label: 'Emergency Same-Day Dispatch', price: 49 },
        { label: 'Deep Sanitization & Air Quality Check', price: 39 },
        { label: '1-Year Extended Workmanship Warranty', price: 59 }
      ]
    },
    comparison: {
      current: [
        'Slow phone-tag during busy peak hours',
        'No after-hours online booking for night visitors',
        'Uncertain technician dispatch ETA',
        'Loses high-intent mobile visitors to modern competitors'
      ],
      modernized: [
        'Instant 60-second 1-click booking tool',
        '24/7 AI Receptionist Concierge chatbot',
        'Real-time SMS dispatch & arrival confirmation',
        'Sub-second 98/100 PageSpeed mobile architecture'
      ]
    },
    reviews: [
      {
        author: 'Marcus Vance',
        location: lead.city || 'Austin, TX',
        content: 'The 1-click booking was effortless. A technician was at my property in under 45 minutes.',
        rating: 5,
        verified: true
      },
      {
        author: 'Sarah Jenkins',
        location: lead.city || 'Austin, TX',
        content: 'Transparent upfront estimate and great communication throughout. Best service experience we have had.',
        rating: 5,
        verified: true
      },
      {
        author: 'David Chen',
        location: lead.city || 'Austin, TX',
        content: 'Super fast, professional, and courteous. Having the AI assistant answer questions late at night was a lifesaver.',
        rating: 5,
        verified: true
      }
    ],
    faqs: [
      {
        question: `How fast can a technician arrive in ${lead.city || 'our area'}?`,
        answer: 'Emergency bookings are dispatched within 60 to 90 minutes. Scheduled routine visits have guaranteed 2-hour arrival windows.'
      },
      {
        question: 'Do I have to pay upfront when scheduling online?',
        answer: 'No upfront payment is required. You review and approve the exact quote on-site with your technician before any work begins.'
      },
      {
        question: 'Are all technicians licensed and insured?',
        answer: 'Yes, every specialist is fully certified, background-checked, and covered by our 100% Workmanship Guarantee.'
      }
    ],
    promptEnhancement: `Design around ${lead.weakness}. Prioritize 1-click booking, transparent cost estimator, interactive service packages, and mobile-first speed.`
  };
}
