import type { Campaign, Lead } from '@/lib/types';

export const sampleCampaign: Campaign = {
  id: 'local_campaign_001',
  name: 'Premium service businesses',
  audience: 'High-ticket local service companies with outdated websites',
  locations: 'Austin, TX; Chicago, IL',
  source: 'url_list',
  demo_type: 'website',
  channel: 'email',
  status: 'running',
  total_prospects: 128,
  qualified: 74,
  demos_generated: 31,
  outreach_sent: 29,
  replies: 7,
  conversions: 2,
  created_at: new Date().toISOString()
};

export const sampleLeads: Lead[] = [
  {
    id: 'lead_aurora',
    campaign_id: sampleCampaign.id,
    company_name: 'Aurora Med Spa',
    contact_name: 'Priya',
    niche: 'Med spa',
    source: 'url_list',
    website_url: 'https://auroramedspa.example',
    city: 'Austin, TX',
    email: 'hello@auroramedspa.example',
    status: 'demo_ready',
    fit_score: 91,
    weakness: 'Mobile booking is buried and the hero does not show premium treatment outcomes.',
    qualification_reason: 'High-ticket services, strong local reviews, and a weak mobile conversion path.',
    signals: [
      { label: 'High LTV services', value: 'Injectables, laser, memberships', severity: 'positive' },
      { label: 'Mobile UX', value: 'CTA below the fold', severity: 'critical' },
      { label: 'Reviews', value: '4.8 stars, 180+', severity: 'positive' }
    ],
    demo_type: 'website',
    demo_prompt: '',
    demo_url: 'https://v0.dev/chat/aurora-demo',
    outreach_subject: 'Aurora mobile bookings',
    outreach_body:
      'Priya, Aurora has the trust signals most med spas want, but the mobile booking flow makes visitors work too hard.\n\nI built a cleaner demo that puts treatments, proof, and booking above the fold:\nhttps://v0.dev/chat/aurora-demo\n\nWorth a quick look this week?',
    opens: 3,
    clicks: 2,
    replies: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'lead_northstar',
    campaign_id: sampleCampaign.id,
    company_name: 'Northstar Legal Group',
    contact_name: 'Maya',
    niche: 'Law firm',
    source: 'linkedin',
    website_url: 'https://northstarlegal.example',
    city: 'Chicago, IL',
    status: 'qualified',
    fit_score: 84,
    weakness: 'Practice areas read like a directory and there is no case evaluation landing page.',
    qualification_reason: 'Commercial legal services with visible authority but weak conversion structure.',
    signals: [
      { label: 'Authority', value: 'Partner profiles indexed', severity: 'positive' },
      { label: 'Landing page', value: 'No dedicated intake page', severity: 'critical' },
      { label: 'Speed', value: 'Large hero image delays load', severity: 'warning' }
    ],
    demo_type: 'landing_page',
    demo_prompt: '',
    outreach_subject: 'Northstar intake page',
    outreach_body:
      'Maya, Northstar already looks credible, but the site does not give a business owner a fast path to request a case review.\n\nI mocked up a focused intake page here:\nhttps://v0.dev/chat/northstar-demo\n\nOpen to a 5-minute teardown?',
    opens: 1,
    clicks: 0,
    replies: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 'lead_flux',
    campaign_id: sampleCampaign.id,
    company_name: 'FluxOps',
    niche: 'B2B SaaS',
    source: 'product_hunt',
    website_url: 'https://fluxops.example',
    status: 'scraped',
    fit_score: 72,
    weakness: 'Product Hunt traffic lands on a generic homepage with no launch-specific offer.',
    qualification_reason: 'Recent launch momentum with a missing campaign-specific conversion page.',
    signals: [
      { label: 'Launch timing', value: 'Fresh Product Hunt visibility', severity: 'positive' },
      { label: 'Message match', value: 'No PH-specific page', severity: 'warning' },
      { label: 'CTA clarity', value: 'Three competing CTAs', severity: 'warning' }
    ],
    demo_type: 'app_mockup',
    demo_prompt: '',
    outreach_subject: 'FluxOps launch traffic',
    outreach_body:
      'FluxOps has the right launch moment, but Product Hunt visitors are landing on a broad homepage instead of a tight activation flow.\n\nI built a sharper demo angle here:\nhttps://v0.dev/chat/fluxops-demo\n\nWant me to send the teardown?',
    opens: 0,
    clicks: 0,
    replies: 0,
    created_at: new Date().toISOString()
  }
];
