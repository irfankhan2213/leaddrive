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

export function parseProspects(input: CampaignInput): Array<{ company_name: string; website_url?: string; email?: string; city?: string }> {
  const campaignLocations = parseLocations(input.locations);
  const rows = input.sourcePayload
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, Math.max(1, input.limit || 25));

  if (rows.length === 0) {
    return [
      { company_name: 'Aurora Studio', website_url: 'https://example.com', city: campaignLocations[0] },
      { company_name: 'Northstar Group', website_url: 'https://example.org', city: campaignLocations[1] || campaignLocations[0] },
      { company_name: 'Atlas Partners', website_url: 'https://example.net', city: campaignLocations[2] || campaignLocations[0] }
    ];
  }

  return rows.map((row, index) => {
    const cols = row.split(',').map((col) => col.trim());
    const url = cols.find((col) => /^https?:\/\//i.test(col));
    const email = cols.find((col) => /\S+@\S+\.\S+/.test(col));
    const company = cols[0]?.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split(/[/?#]/)[0];
    const city = inferProspectLocation(cols, campaignLocations, index);

    return {
      company_name: titleCase(company || `Prospect ${index + 1}`),
      website_url: url || (/^https?:\/\//i.test(cols[0] || '') ? cols[0] : undefined),
      email,
      city
    };
  });
}

export function buildPipeline(input: CampaignInput): PipelineResult {
  const primaryLocation = parseLocations(input.locations)[0];
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
    created_at: new Date().toISOString()
  };

  const leads = parseProspects(input).map((prospect, index) => {
    const score = scoreProspect(prospect.website_url, input.audience, index);
    const signals = buildSignals(score, input);
    const weakness = pickWeakness(input.demoType, score);
    const lead: Lead = {
      id: `lead_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 7)}`,
      campaign_id: campaign.id,
      company_name: prospect.company_name,
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
          ? 'Strong commercial fit with a visible conversion gap that a personalized demo can make obvious.'
          : 'Needs more review before spending AI/demo credits.',
      signals,
      demo_type: input.demoType,
      demo_prompt: '',
      outreach_subject: `${prospect.company_name.split(' ')[0]} demo idea`,
      outreach_body: buildOutreach({
        company: prospect.company_name,
        city: prospect.city,
        weakness,
        demoUrl: `${process.env.APP_BASE_URL || 'http://localhost:3000'}/demo/preview`,
        channel: input.channel
      }),
      opens: 0,
      clicks: 0,
      replies: 0,
      created_at: new Date().toISOString()
    };
    lead.demo_prompt = buildDemoPrompt(lead);
    return lead;
  });

  campaign.total_prospects = leads.length;
  campaign.qualified = leads.filter((lead) => lead.fit_score >= 70).length;

  return { campaign, leads };
}

export function buildDemoPrompt(lead: Lead): string {
  return `Create a polished ${lead.demo_type.replace('_', ' ')} for ${lead.company_name}.

Context:
- Target niche: ${lead.niche}
- Target location: ${lead.city || 'Location not specified'}
- Existing website: ${lead.website_url || 'No website found'}
- Specific weakness to fix: ${lead.weakness}
- Qualification reason: ${lead.qualification_reason}
- Signals: ${lead.signals.map((signal) => `${signal.label}: ${signal.value}`).join('; ')}

Design direction:
- Make it look premium, credible, and conversion-focused.
- Use a dense first viewport with clear value proposition, proof, and one primary CTA.
- Reference the prospect's likely services and local market, especially ${lead.city || 'their service area'}, but do not claim fake awards or results.
- Generate responsive Next.js + Tailwind code with clean sections and no placeholder copy.

Output should be a live preview suitable to send as a cold outreach hook.`;
}

export function buildOutreach({
  company,
  city,
  weakness,
  demoUrl,
  channel
}: {
  company: string;
  city?: string;
  weakness: string;
  demoUrl: string;
  channel: 'email' | 'linkedin';
}): string {
  const locationLine = city ? ` in ${city}` : '';
  if (channel === 'linkedin') {
    return `Noticed ${company}${locationLine} has a fixable conversion gap: ${weakness} I built a quick demo showing how I would tighten it up for local buyers: ${demoUrl}. Worth sending over the notes?`;
  }

  return `Hi,

I noticed ${company}${locationLine} has a fixable conversion gap: ${weakness}

I went ahead and built a custom demo showing what a stronger local version could look like:
${demoUrl}

Worth a quick 5-minute chat next week?`;
}

function scoreProspect(url: string | undefined, audience: string, index: number): number {
  const highTicket = /(law|legal|med|clinic|saas|agency|finance|real estate|consult|dental|roof|solar|b2b)/i.test(audience);
  const hasWebsite = Boolean(url);
  const base = highTicket ? 76 : 64;
  const websitePenalty = hasWebsite ? 0 : -8;
  const variation = [15, 8, -4, 12, -12, 3][index % 6];
  return Math.max(28, Math.min(96, base + websitePenalty + variation));
}

function buildSignals(score: number, input: CampaignInput): DigitalSignal[] {
  const severity = score >= 78 ? 'critical' : 'warning';
  const locations = parseLocations(input.locations);
  return [
    { label: 'Source', value: sourceLabels[input.source], severity: 'positive' },
    { label: 'Location filter', value: locations.length ? locations.join(', ') : 'Any location', severity: 'positive' },
    { label: 'Pain point', value: input.demoType === 'app_mockup' ? 'Weak product activation' : 'Weak conversion path', severity },
    { label: 'Personalization angle', value: 'Can send a live demo instead of a generic pitch', severity: 'positive' }
  ];
}

function pickWeakness(demoType: CampaignInput['demoType'], score: number): string {
  if (demoType === 'app_mockup') return 'The product story does not show the core workflow fast enough for a cold visitor.';
  if (demoType === 'landing_page') return 'There is no dedicated landing page matching the visitor intent from the source.';
  if (score > 85) return 'The mobile first viewport hides the offer, proof, and booking action below low-value content.';
  return 'The website looks credible enough to matter, but the conversion path is too generic.';
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
