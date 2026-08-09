export type LeadSource = 'google_maps' | 'linkedin' | 'product_hunt' | 'apollo' | 'csv' | 'url_list';

export type LeadStatus =
  | 'new'
  | 'scraped'
  | 'qualified'
  | 'skipped'
  | 'demo_ready'
  | 'outreach_sent'
  | 'replied'
  | 'converted';

export type DemoType = 'website' | 'landing_page' | 'app_mockup';

export type OutreachChannel = 'email' | 'linkedin';

export interface CampaignInput {
  audience: string;
  locations: string;
  source: LeadSource;
  sourcePayload: string;
  demoType: DemoType;
  channel: OutreachChannel;
  limit: number;
}

export interface DigitalSignal {
  label: string;
  value: string;
  severity: 'positive' | 'warning' | 'critical';
}

export interface Lead {
  id: string;
  campaign_id?: string;
  company_name: string;
  contact_name?: string;
  niche: string;
  source: LeadSource;
  website_url?: string;
  linkedin_url?: string;
  city?: string;
  email?: string;
  status: LeadStatus;
  fit_score: number;
  weakness: string;
  qualification_reason: string;
  signals: DigitalSignal[];
  demo_type: DemoType;
  demo_prompt: string;
  demo_url?: string;
  outreach_subject: string;
  outreach_body: string;
  opens: number;
  clicks: number;
  replies: number;
  created_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  audience: string;
  locations: string;
  source: LeadSource;
  demo_type: DemoType;
  channel: OutreachChannel;
  status: 'draft' | 'running' | 'paused' | 'complete';
  total_prospects: number;
  qualified: number;
  demos_generated: number;
  outreach_sent: number;
  replies: number;
  conversions: number;
  created_at: string;
}

export interface PipelineResult {
  campaign: Campaign;
  leads: Lead[];
}

export interface V0DemoResult {
  chatId?: string;
  versionId?: string;
  demoUrl?: string;
  deploymentUrl?: string;
  webUrl?: string;
}
