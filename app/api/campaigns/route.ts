import { NextResponse } from 'next/server';
import { generateCampaignKeywordsAnthropic, analyzeLeadWithAnthropic } from '@/lib/anthropic';
import { analyzeLeadWithGemini, generateCampaignKeywords } from '@/lib/gemini';
import { buildDemoPrompt, buildOutreach, buildPipeline, generateAlgorithmicKeywords } from '@/lib/pipeline';
import { getSupabaseAdmin } from '@/lib/supabase';
import { createV0Demo } from '@/lib/v0';
import { applyWebsiteSnapshot, inspectWebsite } from '@/lib/website';
import type { AppSettings, CampaignInput, Lead } from '@/lib/types';

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
  const body = (await req.json()) as Partial<CampaignInput> & { settings?: AppSettings };
  const input = normalizeCampaignInput(body);
  const settings = body.settings;
  const baseUrl = getBaseUrl(req);

  const aiProvider = settings?.aiProvider || 'gemini';
  const aiApiKey = settings?.aiApiKey || (aiProvider === 'anthropic' ? process.env.ANTHROPIC_API_KEY : process.env.GEMINI_API_KEY);
  const aiModel = settings?.aiModel;
  const v0ApiKey = settings?.v0ApiKey || process.env.V0_API_KEY;
  const v0Model = settings?.v0Model || process.env.V0_MODEL;

  // Generate multi-keyword search queries for campaign scraping using configured AI model (Gemini or Anthropic)
  let keywords: string[] = [];
  if (aiApiKey) {
    try {
      if (aiProvider === 'anthropic') {
        keywords = await generateCampaignKeywordsAnthropic(input.audience, input.locations, input.source, aiApiKey, aiModel);
      } else {
        keywords = await generateCampaignKeywords(input.audience, input.locations, input.source, aiApiKey, aiModel);
      }
    } catch {
      keywords = [];
    }
  }
  if (keywords.length === 0) {
    keywords = generateAlgorithmicKeywords(input);
  }

  const pipeline = buildPipeline(input, keywords);

  const inspectedLeads = await Promise.all(
    pipeline.leads.map(async (lead) => {
      if (!lead.website_url) return lead;
      const snapshot = await inspectWebsite(lead.website_url);
      return refreshLeadArtifacts(applyWebsiteSnapshot(lead, snapshot), input, baseUrl);
    })
  );

  const analyzedLeads = await Promise.all(
    inspectedLeads.map(async (lead) => {
      if (!aiApiKey) return lead;
      try {
        const ai =
          aiProvider === 'anthropic'
            ? await analyzeLeadWithAnthropic(lead, aiApiKey, aiModel)
            : await analyzeLeadWithGemini(lead, aiApiKey, aiModel);

        const merged = {
          ...lead,
          ...ai,
          status: typeof ai.fit_score === 'number' && ai.fit_score >= 70 ? 'qualified' : lead.status,
          outreach_body:
            ai.outreach_body?.replace('{{demo_url}}', `${baseUrl}/demo/${lead.id}`) ||
            buildOutreach({
              company: lead.company_name,
              contactName: lead.contact_name,
              city: lead.city,
              weakness: ai.weakness || lead.weakness,
              demoUrl: `${baseUrl}/demo/${lead.id}`,
              channel: input.channel,
              niche: lead.niche
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

  // v0 site builder — build v0 site demos for qualified prospects using user's v0 key/model
  const leadsWithV0Demos = await Promise.all(
    analyzedLeads.map(async (lead) => {
      if (lead.fit_score < 70) return lead;
      try {
        const demo = await createV0Demo(lead, v0ApiKey, v0Model);
        const demoUrl = demo.deploymentUrl || demo.demoUrl || `${baseUrl}/demo/${lead.id}`;
        return {
          ...lead,
          status: 'demo_ready' as const,
          demo_url: demoUrl,
          v0_chat_id: demo.chatId,
          v0_version_id: demo.versionId,
          outreach_body: buildOutreach({
            company: lead.company_name,
            contactName: lead.contact_name,
            city: lead.city,
            weakness: lead.weakness,
            demoUrl,
            channel: input.channel,
            niche: lead.niche
          })
        };
      } catch {
        return lead;
      }
    })
  );

  pipeline.leads = leadsWithV0Demos;
  pipeline.campaign.qualified = leadsWithV0Demos.filter((lead) => lead.fit_score >= 70).length;
  pipeline.campaign.demos_generated = leadsWithV0Demos.filter((lead) => lead.status === 'demo_ready').length;

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
      qualified: pipeline.campaign.qualified,
      demos_generated: pipeline.campaign.demos_generated
    })
    .select()
    .single();

  if (campaignError) {
    return NextResponse.json({ error: campaignError.message }, { status: 500 });
  }

  const leadsToSave = leadsWithV0Demos.map((lead) => ({
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
    demo_url: lead.demo_url,
    v0_chat_id: lead.v0_chat_id,
    v0_version_id: lead.v0_version_id,
    outreach_subject: lead.outreach_subject,
    outreach_body: lead.outreach_body
  }));

  const { data: savedLeads, error: leadsError } = await supabase.from('leads').insert(leadsToSave).select();
  if (leadsError) {
    return NextResponse.json({ error: leadsError.message }, { status: 500 });
  }

  return NextResponse.json({
    campaign: {
      ...campaign,
      keywords: pipeline.campaign.keywords
    },
    leads: savedLeads || leadsWithV0Demos,
    persistence: 'supabase'
  });
}

function refreshLeadArtifacts(lead: Lead, input: CampaignInput, baseUrl: string): Lead {
  const demoUrl = lead.demo_url || `${baseUrl}/demo/${lead.id}`;
  return {
    ...lead,
    demo_prompt: buildDemoPrompt(lead),
    outreach_body: buildOutreach({
      company: lead.company_name,
      contactName: lead.contact_name,
      city: lead.city,
      weakness: lead.weakness,
      demoUrl,
      channel: input.channel,
      niche: lead.niche
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
