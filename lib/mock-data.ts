import type { Campaign, Lead } from '@/lib/types';

export const sampleCampaign: Campaign = {
  id: 'local_campaign_001',
  name: 'No campaign yet',
  audience: '',
  locations: '',
  source: 'google_maps',
  demo_type: 'website',
  channel: 'email',
  status: 'draft',
  total_prospects: 0,
  qualified: 0,
  demos_generated: 0,
  outreach_sent: 0,
  replies: 0,
  conversions: 0,
  created_at: new Date().toISOString()
};

export const sampleLeads: Lead[] = [];
