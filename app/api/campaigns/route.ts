import { NextResponse } from 'next/server';
import { analyzeLeadWithGemini } from '@/lib/gemini';
import { buildDemoPrompt, buildOutreach, buildPipeline } from '@/lib/pipeline';
import { getSupabaseAdmin } from '@/lib/supabase';
import { applyWebsiteSnapshot, inspectWebsite } from '@/lib/website';
import type { CampaignInput, Lead } from '@/lib/types';

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({
      campaigns: [],
      leads: [],
      persistence: 'local_mock',
      message: 'Supabase env vars are not configured.'
    });
  }

  const { data: campaigns, error: campaignError } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (campaignError) return NextResponse.json({ error: campaignError.message }, { status: 500 });

  const campaignIds = (campaigns || []).map((campaign) => campaign.id);
  const { data: leads, error: leadsError } = campaignIds.length
    ? await supabase.from('leads').select('*').in('campaign_id', campaignIds).order('created_at', { ascending: false })
    : { data: [], error: null };
  if (leadsError) return NextResponse.json({ error: leadsError.message }, { status: 500 });

  return NextResponse.json({ campaigns, leads, persistence: 'supabase' });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<CampaignInput>;
  const input = normalizeCampaignInput(body);
  const baseUrl = getBaseUrl(req);
  const pipeline = buildPipeline(input);
  const inspectedLeads = await Promise.all(
    pipeline.leads.map(async (lead) => {
      if (!lead.website_url) return lead;
      const snapshot = await inspectWebsite(lead.website_url);
      return refreshLeadArtifacts(applyWebsiteSnapshot(lead, snapshot), input, baseUrl);
    })
  );

  const geminiEnabled = process.env.GEMINI_ENABLED === 'true';
  const analyzedLeads = await Promise.all(
    inspectedLeads.map(async (lead) => {
      if (!geminiEnabled) return lead;
      try {
        const ai = await analyzeLeadWithGemini(lead);
        const merged = {
          ...lead,
          ...ai,
          status: typeof ai.fit_score === 'number' && ai.fit_score >= 70 ? 'qualified' : lead.status,
          outreach_body:
            ai.outreach_body?.replace('{{demo_url}}', `${baseUrl}/demo/${lead.id}`) ||
            buildOutreach({
              company: lead.company_name,
              city: lead.city,
              weakness: ai.weakness || lead.weakness,
              demoUrl: `${baseUrl}/demo/${lead.id}`,
              channel: input.channel
            })
        } satisfies Lead;
        return {
          ...merged,
          demo_prompt: buildDemoPrompt(merged)
        } satisfies Lead;
      } catch {
        return lead;
      }
    })
  );

  pipeline.leads = analyzedLeads;
  pipeline.campaign.qualified = analyzedLeads.filter((lead) => lead.fit_score >= 70).length;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({
      ...pipeline,
      persistence: 'local_mock',
      message: 'Supabase env vars are not configured, so this campaign was generated locally.'
    });
  }

  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .insert({
      name: pipeline.campaign.name,
      audience: pipeline.campaign.audience,
      locations: pipeline.campaign.locations,
      source: pipeline.campaign.source,
      demo_type: pipeline.campaign.demo_type,
      channel: pipeline.campaign.channel,
      status: pipeline.campaign.status,
      total_prospects: pipeline.campaign.total_prospects,
      qualified: pipeline.campaign.qualified
    })
    .select()
    .single();

  if (campaignError) {
    return NextResponse.json({ error: campaignError.message }, { status: 500 });
  }

  const leads = analyzedLeads.map((lead) => ({
    campaign_id: campaign.id,
    company_name: lead.company_name,
    contact_name: lead.contact_name,
    niche: lead.niche,
    source: lead.source,
    website_url: lead.website_url,
    linkedin_url: lead.linkedin_url,
    city: lead.city,
    email: lead.email,
    status: lead.status,
    fit_score: lead.fit_score,
    weakness: lead.weakness,
    qualification_reason: lead.qualification_reason,
    signals: lead.signals,
    demo_type: lead.demo_type,
    demo_prompt: lead.demo_prompt,
    outreach_subject: lead.outreach_subject,
    outreach_body: lead.outreach_body
  }));

  const { data: savedLeads, error: leadsError } = await supabase.from('leads').insert(leads).select();
  if (leadsError) {
    return NextResponse.json({ error: leadsError.message }, { status: 500 });
  }

  const savedWithArtifacts = (savedLeads || []).map((savedLead) => ({
    ...savedLead,
    outreach_body: buildOutreach({
      company: savedLead.company_name,
      city: savedLead.city,
      weakness: savedLead.weakness,
      demoUrl: `${baseUrl}/demo/${savedLead.id}`,
      channel: input.channel
    })
  }));

  await Promise.all(
    savedWithArtifacts.map((lead) =>
      supabase.from('leads').update({ outreach_body: lead.outreach_body }).eq('id', lead.id)
    )
  );

  return NextResponse.json({
    campaign,
    leads: savedWithArtifacts,
    persistence: 'supabase'
  });
}

function refreshLeadArtifacts(lead: Lead, input: CampaignInput, baseUrl: string): Lead {
  return {
    ...lead,
    demo_prompt: buildDemoPrompt(lead),
    outreach_body: buildOutreach({
      company: lead.company_name,
      city: lead.city,
      weakness: lead.weakness,
      demoUrl: `${baseUrl}/demo/${lead.id}`,
      channel: input.channel
    })
  };
}

function getBaseUrl(req: Request) {
  const requestOrigin = new URL(req.url).origin;
  const configured = process.env.APP_BASE_URL;
  if (!configured || configured.includes('localhost')) return requestOrigin;
  return configured;
}

function normalizeCampaignInput(body: Partial<CampaignInput>): CampaignInput {
  return {
    audience: body.audience?.trim() || 'High-ticket local service businesses',
    locations: body.locations?.trim() || '',
    source: body.source || 'url_list',
    sourcePayload: body.sourcePayload || '',
    demoType: body.demoType || 'website',
    channel: body.channel || 'email',
    limit: Math.min(Math.max(Number(body.limit || 25), 1), 250)
  };
}
