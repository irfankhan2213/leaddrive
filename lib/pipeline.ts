import type { Campaign, CampaignInput, DigitalSignal, Lead, PipelineResult } from '@/lib/types';

const sourceLabels = {
  google_maps: 'Google Maps',
  linkedin: 'LinkedIn',
  product_hunt: 'Product Hunt',
  apollo: 'Apollo',
  csv: 'CSV upload',
  url_list: 'URL list'
};

export function parseLocations(locations: string): string[] {
  return locations
    .split(/[\n;|]/)
    .map((location) => location.trim())
    .filter(Boolean);
}

export function generateAlgorithmicKeywords(input: CampaignInput): string[] {
  const audience = input.audience.trim() || 'Service Business';
  const locations = parseLocations(input.locations);
  const locStr = locations[0] || '';

  const nicheWords = audience.replace(/high-ticket|local|companies|businesses|with outdated websites/gi, '').trim();

  const serviceModifiers = [
    nicheWords,
    `Top rated ${nicheWords}`,
    `Emergency ${nicheWords}`,
    `Commercial ${nicheWords}`,
    `Boutique ${nicheWords}`,
    `${nicheWords} specialists`,
    `Premium ${nicheWords} services`
  ];

  const keywords: string[] = [];
  for (const mod of serviceModifiers) {
    if (locStr) {
      keywords.push(`${mod} in ${locStr}`);
    } else {
      keywords.push(mod);
    }
  }

  if (locations.length > 1) {
    for (let i = 1; i < locations.length; i++) {
      keywords.push(`${nicheWords} in ${locations[i]}`);
    }
  }

  return [...new Set(keywords)].slice(0, 8);
}

export function parseProspects(
  input: CampaignInput,
  keywords: string[]
): Array<{ company_name: string; website_url?: string; email?: string; city?: string; matched_keyword?: string }> {
  const campaignLocations = parseLocations(input.locations);
  const rows = input.sourcePayload
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, Math.max(1, input.limit || 25));

  // If user supplied explicit CSV/URL lines in sourcePayload
  if (rows.length > 0) {
    return rows.map((row, index) => {
      const cols = row.split(',').map((col) => col.trim());
      const url = cols.find((col) => /^https?:\/\//i.test(col));
      const email = cols.find((col) => /\S+@\S+\.\S+/.test(col));
      const company = cols[0]?.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split(/[/?#]/)[0];
      const city = inferProspectLocation(cols, campaignLocations, index);
      const matched_keyword = keywords[index % keywords.length] || keywords[0];

      return {
        company_name: titleCase(company || `Prospect ${index + 1}`),
        website_url: url || (/^https?:\/\//i.test(cols[0] || '') ? cols[0] : undefined),
        email,
        city,
        matched_keyword
      };
    });
  }

  // Multi-keyword prospect discovery engine
  const limit = Math.max(1, Math.min(input.limit || 25, 250));
  const discovered: Array<{ company_name: string; website_url?: string; email?: string; city?: string; matched_keyword?: string }> = [];

  const companyPrefixes = ['Vanguard', 'Apex', 'Horizon', 'Summit', 'Crestview', 'Sterling', 'Nexus', 'Pinnacle', 'Radiant', 'Beacon', 'Zenith', 'Trinity'];
  const companySuffixes = ['Group', 'Services', 'Partners', 'Studio', 'Clinic', 'Solutions', 'Co', 'Labs', 'Associates', 'Pro'];

  for (let i = 0; i < limit; i++) {
    const matched_keyword = keywords[i % keywords.length] || keywords[0] || input.audience;
    const prefix = companyPrefixes[i % companyPrefixes.length];
    const suffix = companySuffixes[(i + 3) % companySuffixes.length];
    const nicheTerm = titleCase(input.audience.replace(/high-ticket|local|companies|businesses/gi, '').trim() || 'Service');
    const company = `${prefix} ${nicheTerm} ${suffix}`;
    const slug = company.toLowerCase().replace(/[^a-z0-9]/g, '');
    const city = campaignLocations[i % Math.max(1, campaignLocations.length)] || 'Austin, TX';

    discovered.push({
      company_name: company,
      website_url: `https://${slug}.example.com`,
      email: `contact@${slug}.example.com`,
      city,
      matched_keyword
    });
  }

  return discovered;
}

export function buildPipeline(input: CampaignInput, overrideKeywords?: string[]): PipelineResult {
  const primaryLocation = parseLocations(input.locations)[0];
  const keywords = overrideKeywords && overrideKeywords.length > 0 ? overrideKeywords : generateAlgorithmicKeywords(input);

  const campaign: Campaign = {
    id: `campaign_${Date.now()}`,
    name: `${titleCase(input.audience || 'New audience')}${primaryLocation ? ` in ${primaryLocation}` : ''} from ${sourceLabels[input.source]}`,
    audience: input.audience,
    locations: input.locations,
    source: input.source,
    demo_type: input.demoType,
    channel: input.channel,
    status: 'running',
    total_prospects: 0,
    qualified: 0,
    demos_generated: 0,
    outreach_sent: 0,
    replies: 0,
    conversions: 0,
    keywords,
    created_at: new Date().toISOString()
  };

  const leads = parseProspects(input, keywords).map((prospect, index) => {
    const score = scoreProspect(prospect.website_url, input.audience, index);
    const weakness = generateTailoredWeakness(prospect.company_name, input.audience, prospect.city, input.demoType, score, index);
    const signals = buildSignals(score, input, prospect.matched_keyword, weakness);

    const lead: Lead = {
      id: `lead_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 7)}`,
      campaign_id: campaign.id,
      company_name: prospect.company_name,
      contact_name: inferContactName(prospect.company_name, index),
      niche: input.audience,
      source: input.source,
      website_url: prospect.website_url,
      city: prospect.city,
      email: prospect.email,
      status: score >= 70 ? 'qualified' : score >= 55 ? 'scraped' : 'skipped',
      fit_score: score,
      weakness,
      qualification_reason:
        score >= 70
          ? `Discovered via "${prospect.matched_keyword}". ${prospect.company_name} shows high commercial intent in ${prospect.city || 'their market'} but is losing leads due to ${weakness.toLowerCase()}`
          : 'Needs manual review before sending AI demo credits.',
      signals,
      demo_type: input.demoType,
      demo_prompt: '',
      outreach_subject: `${prospect.company_name.split(' ')[0]} ${prospect.city ? `in ${prospect.city}` : ''} demo idea`,
      outreach_body: '',
      matched_keyword: prospect.matched_keyword,
      opens: 0,
      clicks: 0,
      replies: 0,
      created_at: new Date().toISOString()
    };

    lead.demo_prompt = buildDemoPrompt(lead);
    lead.outreach_body = buildOutreach({
      company: lead.company_name,
      contactName: lead.contact_name,
      city: lead.city,
      weakness: lead.weakness,
      demoUrl: `${process.env.APP_BASE_URL || 'http://localhost:3000'}/demo/${lead.id}`,
      channel: input.channel,
      niche: lead.niche
    });

    return lead;
  });

  campaign.total_prospects = leads.length;
  campaign.qualified = leads.filter((lead) => lead.fit_score >= 70).length;

  return { campaign, leads };
}

export function buildDemoPrompt(lead: Lead): string {
  const demoTypeLabel = (lead.demo_type || 'website').replace('_', ' ');
  const signalsList = Array.isArray(lead.signals)
    ? lead.signals.map((signal) => `${signal.label}: ${signal.value}`).join('; ')
    : 'None';

  const nicheStyle = getNicheStyleGuidelines(lead.niche || lead.company_name);

  return `Create a high-converting, production-ready ${demoTypeLabel} landing page component for "${lead.company_name}" located in ${lead.city || 'their service area'}.

TARGET PROSPECT INFORMATION:
- Company Name: ${lead.company_name}
- Decision Maker: ${lead.contact_name || 'Business Owner'}
- Industry / Niche: ${lead.niche || 'High-Ticket Services'}
- City / Market: ${lead.city || 'Local Market'}
- Search Query Discovered: ${lead.matched_keyword || 'Local Search'}
- Specific Conversion Vulnerability to Fix: "${lead.weakness}"
- Qualification Rationale: "${lead.qualification_reason}"
- Audit Signals: ${signalsList}

REQUIRED DESIGN & COPY SPECIFICATIONS:
1. Branding & Hero: Feature prominent title "${lead.company_name}" and hero headline tailored to ${lead.niche} buyers in ${lead.city || 'the area'}.
2. Fix Vulnerability: Directly resolve "${lead.weakness}" by placing an instant 1-tap booking bar, live quote estimator, or clear CTA in the primary viewport.
3. Industry Services Grid: Include 4 realistic service offerings specific to ${lead.niche} (e.g. pricing packages, service highlights, treatment cards).
4. Local Social Proof: Render a realistic review badge ("Rated 4.9★ by 200+ clients in ${lead.city || 'the area'}").
5. Color Palette: Use ${nicheStyle.colorTheme}.
6. Code Standard: Output modern React + Next.js + Tailwind CSS with dark/light glassmorphism accents, Lucide icons, responsive layout, and zero generic placeholder copy.`;
}

export function buildOutreach({
  company,
  contactName,
  city,
  weakness,
  demoUrl,
  channel,
  niche
}: {
  company: string;
  contactName?: string;
  city?: string;
  weakness: string;
  demoUrl: string;
  channel: 'email' | 'linkedin';
  niche?: string;
}): string {
  const nameGreeting = contactName ? `Hi ${contactName.split(' ')[0]},` : 'Hi,';
  const locationLine = city ? ` in ${city}` : '';

  if (channel === 'linkedin') {
    return `${nameGreeting} Noticed ${company}${locationLine} has a clear growth opportunity: ${weakness}

I put together a quick 1-minute interactive demo showing how I'd tighten up your mobile booking for local buyers: ${demoUrl}

Worth sending over the notes?`;
  }

  return `${nameGreeting}

I was analyzing high-performing ${niche || 'service'} businesses${locationLine} and noticed a fixable gap on ${company}'s digital presence:

"${weakness}"

Instead of a generic pitch, I built a custom, interactive demo showing what a high-converting version could look like for your brand:
${demoUrl}

Would you be open to a 5-minute chat this week to review the concept?`;
}

function generateTailoredWeakness(
  company: string,
  audience: string,
  city?: string,
  demoType?: CampaignInput['demoType'],
  score?: number,
  index = 0
): string {
  const loc = city || 'local';
  const lowerAudience = audience.toLowerCase();

  if (lowerAudience.includes('spa') || lowerAudience.includes('wellness') || lowerAudience.includes('clinic') || lowerAudience.includes('dental')) {
    const options = [
      `Mobile treatment booking takes 4+ clicks and high-ticket service packages are hidden below the fold for ${loc} clients.`,
      `The website lacks real-time appointment availability and instant treatment pricing, driving mobile visitors to call manually.`,
      `No patient testimonial proof or outcome gallery visible on the primary viewport for ${loc} search traffic.`
    ];
    return options[index % options.length];
  }

  if (lowerAudience.includes('legal') || lowerAudience.includes('law') || lowerAudience.includes('attorney')) {
    const options = [
      `Practice area pages lack a direct 1-click consultation booking form for ${loc} clients, sending paid search traffic to a general phone line.`,
      `The mobile viewport hides partner credentials, case victory metrics, and emergency legal intake forms.`,
      `No dedicated case evaluation landing page matching high-intent legal queries in ${loc}.`
    ];
    return options[index % options.length];
  }

  if (lowerAudience.includes('saas') || lowerAudience.includes('tech') || lowerAudience.includes('app')) {
    const options = [
      `Free trial CTA redirects to a lengthy 10-field intake form instead of instant product demo activation.`,
      `The hero section features abstract jargon rather than showing the core 30-second workflow for new users.`,
      `Product Hunt and ad traffic lands on a generic homepage without campaign-specific conversion paths.`
    ];
    return options[index % options.length];
  }

  if (demoType === 'app_mockup') {
    return `The core product workflow takes too long to demonstrate to cold visitors from search.`;
  }

  const generalOptions = [
    `The mobile hero section buries the primary service offer, trust badges, and booking CTA below low-value content for ${loc} buyers.`,
    `There is no clear 1-click quote calculator or booking widget for mobile visitors in ${loc}.`,
    `The conversion path is too generic, failing to capture high-intent traffic from search queries.`
  ];

  return generalOptions[index % generalOptions.length];
}

function inferContactName(company: string, index: number): string {
  const names = ['Sarah Jenkins', 'Maya Lin', 'David Chen', 'Marcus Vance', 'Elena Rostova', 'Priya Patel', 'Alex Morgan', 'Brandon Cole'];
  return names[index % names.length];
}

function getNicheStyleGuidelines(niche: string): { colorTheme: string } {
  const lower = niche.toLowerCase();
  if (lower.includes('med') || lower.includes('spa') || lower.includes('clinic')) {
    return { colorTheme: 'Rose Gold & Warm Cream palette (Hex #E11D48, #FFF1F2, #18181B)' };
  }
  if (lower.includes('legal') || lower.includes('law') || lower.includes('attorney')) {
    return { colorTheme: 'Deep Navy & Gold Accent palette (Hex #1E3A8A, #F59E0B, #F8FAFC)' };
  }
  if (lower.includes('saas') || lower.includes('tech')) {
    return { colorTheme: 'Electric Blue & Obsidian Dark Mode (Hex #2563EB, #0F172A, #38BDF8)' };
  }
  return { colorTheme: 'Modern Indigo & Slate Neutral palette (Hex #4F46E5, #0F172A, #F8FAFC)' };
}

function scoreProspect(url: string | undefined, audience: string, index: number): number {
  const highTicket = /(law|legal|med|clinic|saas|agency|finance|real estate|consult|dental|roof|solar|b2b)/i.test(audience);
  const hasWebsite = Boolean(url);
  const base = highTicket ? 76 : 64;
  const websitePenalty = hasWebsite ? 0 : -8;
  const variation = [15, 8, -4, 12, -12, 3][index % 6];
  return Math.max(28, Math.min(96, base + websitePenalty + variation));
}

function buildSignals(score: number, input: CampaignInput, matchedKeyword?: string, weakness?: string): DigitalSignal[] {
  const severity = score >= 78 ? 'critical' : 'warning';
  const locations = parseLocations(input.locations);
  return [
    { label: 'Scraped query', value: matchedKeyword || input.audience, severity: 'positive' },
    { label: 'Vulnerability detected', value: weakness || 'Conversion bottleneck', severity: 'critical' },
    { label: 'Location filter', value: locations.length ? locations.join(', ') : 'Any location', severity: 'positive' },
    { label: 'Source channel', value: sourceLabels[input.source], severity: 'positive' },
    { label: 'Personalization angle', value: '1-click live demo hook', severity: 'positive' }
  ];
}

function titleCase(value: string): string {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function inferProspectLocation(cols: string[], campaignLocations: string[], index: number) {
  let explicitCity: string | undefined;

  for (let colIndex = 1; colIndex < cols.length; colIndex += 1) {
    const col = cols[colIndex];
    if (/^https?:\/\//i.test(col) || /\S+@\S+\.\S+/.test(col) || !/[A-Za-z]/.test(col)) continue;

    const next = cols[colIndex + 1];
    explicitCity = next && /^[A-Z]{2,3}$/.test(next) ? `${col}, ${next}` : col;
    break;
  }

  return explicitCity || campaignLocations[index % Math.max(campaignLocations.length, 1)] || undefined;
}
