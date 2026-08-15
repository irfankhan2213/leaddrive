import type { Campaign, CampaignInput, DemoQuality, DigitalSignal, Lead, LeadStatus, OutreachChannel, PipelineResult } from '@/lib/types';

const sourceLabels = {
  google_maps: 'Google Maps',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  product_hunt: 'Product Hunt',
  apollo: 'Apollo',
  csv: 'CSV upload',
  url_list: 'URL list'
};

type ProspectSeed = {
  company_name: string;
  website_url?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  rating?: number;
  reviews_count?: number;
  matched_keyword?: string;
  source_url?: string;
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
  const currentYear = new Date().getFullYear();

  const cleanAudience = audience
    .replace(/high-ticket|local|with outdated websites|with weak mobile booking/gi, '')
    .trim();

  const isTechOrStartup = /(ai|saas|tech|startup|app|software|crypto|b2b|digital|agency)/i.test(cleanAudience);

  let queryPatterns: string[] = [];

  if (isTechOrStartup) {
    queryPatterns = [
      `${cleanAudience} ${currentYear}`,
      `${cleanAudience} SaaS`,
      `new ${cleanAudience} tools`,
      `recently registered ${cleanAudience}`,
      `top ${cleanAudience} companies`,
      `${cleanAudience} directory`,
      `emerging ${cleanAudience} platforms`,
      `funded ${cleanAudience}`
    ];
  } else {
    queryPatterns = [
      cleanAudience,
      `top rated ${cleanAudience}`,
      `best ${cleanAudience} providers`,
      `${cleanAudience} specialists`,
      `new ${cleanAudience} listings`,
      `${cleanAudience} directory`,
      `commercial ${cleanAudience}`,
      `licensed ${cleanAudience}`
    ];
  }

  const queries: string[] = [];
  for (const pattern of queryPatterns) {
    if (locStr) {
      const alreadyHasLoc = pattern.toLowerCase().includes(locStr.toLowerCase());
      queries.push(alreadyHasLoc ? pattern : `${pattern} in ${locStr}`);
    } else {
      queries.push(pattern);
    }
  }

  if (locations.length > 1) {
    for (let i = 1; i < locations.length; i++) {
      queries.push(`${cleanAudience} in ${locations[i]}`);
    }
  }

  return [...new Set(queries)].slice(0, 8);
}

export function parseProspects(
  input: CampaignInput,
  keywords: string[]
): ProspectSeed[] {
  const campaignLocations = parseLocations(input.locations);
  const rows = input.sourcePayload
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, Math.max(1, input.limit || 25));

  return rows.map((row, index) => {
    const cols = row.split(',').map((col) => col.trim()).filter(Boolean);
    const firstUrl = cols.find((col) => /^https?:\/\//i.test(col));
    const email = cols.find((col) => /\S+@\S+\.\S+/.test(col));
    const phone = cols.find((col) => /\+?\d[\d\s().-]{7,}\d/.test(col));
    const url = firstUrl || (/^https?:\/\//i.test(cols[0] || '') ? cols[0] : undefined);
    const companyRaw =
      /^https?:\/\//i.test(cols[0] || '') && url
        ? new URL(url).hostname.replace(/^www\./i, '')
        : cols[0];
    const city = inferProspectLocation(cols, campaignLocations, index);
    const matched_keyword = keywords[index % keywords.length] || keywords[0];

    return {
      company_name: titleCase(companyRaw || ''),
      website_url: url,
      email,
      phone,
      city,
      matched_keyword
    };
  }).filter((prospect) => prospect.company_name || prospect.website_url);
}

export function buildPipeline(
  input: CampaignInput,
  overrideKeywords?: string[],
  overrideProspects?: ProspectSeed[]
): PipelineResult {
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

  const prospects = overrideProspects?.length ? overrideProspects : parseProspects(input, keywords);

  const leads = prospects.slice(0, input.limit || 25).map((prospect, index) => {
    const score = scoreProspect(prospect, input.audience);
    const weakness = generateTailoredWeakness(prospect, input.audience, input.demoType, score, index);
    const hasContact = Boolean(prospect.email?.trim()) || Boolean(prospect.phone?.trim());

    const status: LeadStatus = !hasContact
      ? 'skipped'
      : score >= 70
      ? 'qualified'
      : 'scraped';

    const signals = buildSignals(score, input, prospect.matched_keyword, weakness, prospect);
    if (!hasContact) {
      signals.push({ label: 'Contact status', value: 'Missing email & phone number', severity: 'critical' });
    }

    const lead: Lead = {
      id: `lead_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 7)}`,
      campaign_id: campaign.id,
      company_name: prospect.company_name || prospect.website_url || 'Unnamed prospect',
      niche: input.audience,
      source: input.source,
      website_url: prospect.website_url,
      city: prospect.city,
      email: prospect.email,
      phone: prospect.phone,
      address: prospect.address,
      rating: prospect.rating,
      reviews_count: prospect.reviews_count,
      source_url: prospect.source_url,
      status,
      fit_score: score,
      weakness,
      qualification_reason: !hasContact
        ? `Skipped: No direct email or phone number found to contact prospect.`
        : score >= 70
        ? `Discovered via "${prospect.matched_keyword}". ${prospect.company_name} shows high commercial intent in ${prospect.city || 'their market'} but is losing leads due to ${weakness.toLowerCase()}`
        : `Discovered via "${prospect.matched_keyword || input.audience}". Contact info verified. Needs demo before outreach.`,
      signals,
      demo_type: input.demoType,
      demo_provider: input.demoProvider || 'agentic',
      demo_quality: input.demoQuality || 'low',
      demo_prompt: '',
      outreach_subject: `${prospect.company_name.split(' ')[0]} ${prospect.city ? `in ${prospect.city}` : ''} demo idea`,
      outreach_body: '',
      matched_keyword: prospect.matched_keyword,
      opens: 0,
      clicks: 0,
      replies: 0,
      created_at: new Date().toISOString()
    };

    lead.demo_prompt = buildDemoPrompt(lead, input.demoQuality || 'low');
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

export function buildDemoPrompt(lead: Lead, quality: DemoQuality = 'low'): string {
  const demoTypeLabel = (lead.demo_type || 'website').replace('_', ' ');
  const signalsList = Array.isArray(lead.signals)
    ? lead.signals.map((signal) => `${signal.label}: ${signal.value}`).join('; ')
    : 'None';

  const nicheStyle = getNicheStyleGuidelines(lead.niche || lead.company_name);

  // LOW USAGE MODE (Fast, Clean, Cost-Efficient, Core Essentials)
  if (quality === 'low') {
    return `Build a clean, high-converting, responsive ${demoTypeLabel} landing page component for "${lead.company_name}" located in ${lead.city || 'their service area'}.

TARGET PROSPECT INFORMATION:
- Company Name: ${lead.company_name}
- Decision Maker: ${lead.contact_name || 'Business Owner'}
- Industry / Niche: ${lead.niche || 'High-Ticket Services'}
- City / Market: ${lead.city || 'Local Market'}
- Specific Conversion Vulnerability to Fix: "${lead.weakness}"

CORE SECTIONS TO BUILD:
1. Navigation Bar: Sticky header with brand logo "${lead.company_name}", phone button, and "Book Consultation" CTA button.
2. Hero Section: Direct value proposition tailored to ${lead.niche} in ${lead.city || 'the area'}, trust badge, and primary booking CTA.
3. Problem & Solution Banner: Explicitly addresses "${lead.weakness}" with a clear modern solution.
4. Services & Pricing Grid: 3 core service packages with clear transparent pricing and direct booking CTA buttons.
5. Interactive 1-Click Booking Widget: Interactive appointment scheduler / quote request form in the page.
6. Testimonials & Social Proof: 2 client review cards with 5-star badges.
7. Mobile Footer: Clean footer with direct call/booking button.

DESIGN SPECIFICATIONS:
- Color Palette: ${nicheStyle.colorTheme}.
- Code Standard: Return a clean, self-contained React + Next.js + Tailwind CSS component with Lucide icons.`;
  }

  // HIGH USAGE MODE (Ultra High-End, Luxury Glassmorphism, Advanced Interactive Components, Flagship Agency Quality)
  return `Build a world-class, ultra-luxurious, state-of-the-art flagship web application and ${demoTypeLabel} component for "${lead.company_name}" in ${lead.city || 'their primary market'}. This must look like an award-winning site designed by a top Silicon Valley agency.

TARGET PROSPECT INTELLIGENCE:
- Company Name: ${lead.company_name}
- Decision Maker: ${lead.contact_name || 'Business Owner'}
- Industry / Niche: ${lead.niche || 'High-Ticket Services'}
- City / Market: ${lead.city || 'Local Market'}
- Critical Digital Vulnerability to Solve: "${lead.weakness}"
- Lead Qualification Reason: "${lead.qualification_reason}"
- Audit Signals & Social Data: ${signalsList}

HIGH-END ARCHITECTURE & ADVANCED INTERACTIVE FEATURES:
1. Luxury Glassmorphism Header: Sticky translucent glassmorphic nav (backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-gray-200/60), brand monogram logo, interactive navigation links with hover capsules, live status badge ("⚡ Accepting New Appointments in ${lead.city || 'Your Area'}"), phone quick-call, and glowing "Book VIP Consultation" CTA.
2. High-Impact Hero Showcase: Dynamic hero section with subtle gradient glow, animated trust pills, high-conversion headline targeting high-value ${lead.niche} clients in ${lead.city || 'the area'}, verified rating card (4.95★ over 320+ verified local engagements), instant interactive 3-question quick consultation launcher, and live consultation preview card.
3. Deep Problem & Transformation Showcase: Interactive Before-vs-After comparison module directly showcasing how "${lead.company_name}" eradicates "${lead.weakness}" with streamlined modern client onboarding.
4. Interactive Multi-Step Instant Quote & Cost Calculator: Stateful interactive widget with dynamic sliders (project size, service tier, turnaround time) calculating realistic estimated investment and 1-click booking locked-in rate.
5. Interactive Tabbed Capability & Service Matrix: 6 comprehensive, deeply detailed service packages with expandable feature checklists, deliverables, turnaround times, guarantee badges, and instant booking modal triggers.
6. Interactive Client Booking Calendar Drawer: Real-time interactive date & time slot picker with service selection, confirmation step, and calendar sync cues.
7. Verified Local Client Case Studies & Video Testimonials: 4 rich testimonial cards with star ratings, verified buyer badges from ${lead.city || 'the region'}, transformation metrics (e.g. "+340% ROI, 2-day turnaround"), and client avatar badges.
8. Interactive FAQ with Search & Accordion: 5 rich expandable questions resolving client objections, payment terms, and scheduling guarantees.
9. Floating Mobile Quick-Conversion Bar: Fixed bottom mobile dock with 1-tap call, instant SMS, and direct booking trigger for maximum mobile conversions.

LUXURY DESIGN TOKENS & VISUAL POLISH:
- Color Harmony: ${nicheStyle.colorTheme} paired with obsidian/slate dark-mode accents and luminous highlights.
- Styling: Premium typography, glassmorphism cards, micro-borders (border border-white/20), subtle drop shadows (shadow-2xl shadow-blue-500/10), interactive hover micro-transitions (hover:-translate-y-1 transition-all duration-300).
- Code Standard: Complete, self-contained React + Next.js + Tailwind CSS component using Lucide icons, full state interactivity, and rich realistic copy.`;
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
  channel: OutreachChannel;
  niche?: string;
}): string {
  const nameGreeting = contactName ? `Hi ${contactName.split(' ')[0]},` : 'Hi,';
  const locationLine = city ? ` in ${city}` : '';

  if (channel === 'linkedin') {
    return `${nameGreeting} Noticed ${company}${locationLine} has a clear growth opportunity: ${weakness}

I put together a quick 1-minute interactive demo showing how I'd tighten up your mobile booking for local buyers: ${demoUrl}

Worth sending over the notes?`;
  }

  if (channel === 'sms') {
    return `Hi ${contactName ? contactName.split(' ')[0] : 'there'}, noticed ${company}'s mobile booking has a gap: "${weakness}". Built a custom live demo for you: ${demoUrl} - Let me know if you want to chat!`;
  }

  return `${nameGreeting}

I was analyzing high-performing ${niche || 'service'} businesses${locationLine} and noticed a fixable gap on ${company}'s digital presence:

"${weakness}"

Instead of a generic pitch, I built a custom, interactive demo showing what a high-converting version could look like for your brand:
${demoUrl}

Would you be open to a 5-minute chat this week to review the concept?`;
}

function generateTailoredWeakness(
  prospect: ProspectSeed,
  audience: string,
  demoType?: CampaignInput['demoType'],
  score?: number,
  index = 0
): string {
  const company = prospect.company_name;
  const city = prospect.city;
  const loc = city || 'local';
  const lowerAudience = audience.toLowerCase();

  if (!prospect.website_url) {
    return `No official website was found from the lead source, so buyers searching in ${loc} may not have a clear place to review services or book.`;
  }

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

function scoreProspect(prospect: ProspectSeed, audience: string): number {
  const highTicket = /(law|legal|med|clinic|saas|agency|finance|real estate|consult|dental|roof|solar|b2b|spa|remodel|plumb|hvac)/i.test(audience);
  let score = highTicket ? 55 : 45;

  if (typeof prospect.rating === 'number' && prospect.rating > 0) {
    if (prospect.rating >= 4.7) score += 12;
    else if (prospect.rating >= 4.3) score += 8;
    else if (prospect.rating >= 4.0) score += 4;
    else if (prospect.rating < 3.5) score -= 6;
  }

  const reviews = prospect.reviews_count || 0;
  if (reviews >= 100) score += 10;
  else if (reviews >= 30) score += 6;
  else if (reviews >= 10) score += 3;

  if (prospect.email) score += 8;
  if (prospect.phone) score += 5;
  if (prospect.website_url) score += 6;
  else score += 10;

  return Math.max(25, Math.min(95, score));
}

function buildSignals(
  score: number,
  input: CampaignInput,
  matchedKeyword?: string,
  weakness?: string,
  prospect?: ProspectSeed
): DigitalSignal[] {
  const locations = parseLocations(input.locations);
  const signals: DigitalSignal[] = [
    { label: 'Scraped query', value: matchedKeyword || input.audience, severity: 'positive' },
    { label: 'Vulnerability detected', value: weakness || 'Conversion bottleneck', severity: 'critical' },
    { label: 'Location filter', value: locations.length ? locations.join(', ') : 'Any location', severity: 'positive' },
    { label: 'Source channel', value: sourceLabels[input.source], severity: 'positive' },
    { label: 'Website found', value: prospect?.website_url ? 'Yes' : 'No official website found', severity: prospect?.website_url ? 'positive' : 'critical' }
  ];
  if (typeof prospect?.rating === 'number') {
    signals.push({
      label: 'Review rating',
      value: `${prospect.rating}/5${prospect.reviews_count ? ` from ${prospect.reviews_count} reviews` : ''}`,
      severity: prospect.rating >= 4 ? 'positive' : 'warning'
    });
  }
  signals.push({ label: 'Personalization angle', value: '1-click live demo hook', severity: score >= 70 ? 'positive' : 'warning' });
  return signals;
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
