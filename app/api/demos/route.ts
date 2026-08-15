import { NextResponse } from 'next/server';
import { createDemoForLead, resolveDemoProvider } from '@/lib/demo-engine';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { AppSettings, DemoProvider, DemoQuality, Lead } from '@/lib/types';

export async function POST(req: Request) {
  const body = (await req.json()) as
    | Lead
    | { lead?: Lead; leads?: Lead[]; settings?: AppSettings; demoQuality?: DemoQuality; demoMode?: DemoQuality; demoProvider?: DemoProvider; baseUrl?: string };

  const settings = 'settings' in body ? body.settings : undefined;
  const demoQuality: DemoQuality =
    ('demoQuality' in body && body.demoQuality) ||
    ('demoMode' in body && body.demoMode) ||
    settings?.defaultDemoQuality ||
    'low';
  const demoProvider = resolveDemoProvider('demoProvider' in body ? body.demoProvider : undefined, settings);
  const baseUrl = ('baseUrl' in body && body.baseUrl) || getBaseUrl(req);

  // Batch generation mode
  if ('leads' in body && Array.isArray(body.leads)) {
    const leads = body.leads;
    const results: Array<{ leadId: string; demoUrl?: string; error?: string; status: 'ready' | 'failed' }> = [];

    for (const lead of leads) {
      if (!lead?.id || !lead?.company_name) continue;
      try {
        const demo = await createDemoForLead(lead, {
          settings,
          quality: demoQuality,
          provider: demoProvider,
          baseUrl
        });
        if (demo.status === 'ready' && demo.demoUrl) {
          await updateLeadDemoStatus(lead.id, 'demo_ready', demo.demoUrl, demo.provider || demoProvider, demo.chatId, demo.versionId, demoQuality, demo.demoArtifact);
          results.push({ leadId: lead.id, demoUrl: demo.demoUrl, status: 'ready' });
        } else {
          await updateLeadDemoStatus(lead.id, 'demo_failed');
          results.push({ leadId: lead.id, error: demo.error || 'v0 generation failed', status: 'failed' });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Demo generation failed';
        await updateLeadDemoStatus(lead.id, 'demo_failed');
        results.push({ leadId: lead.id, error: msg, status: 'failed' });
      }
    }

    return NextResponse.json({ results, count: results.length });
  }

  // Single lead generation mode
  const lead = 'lead' in body && body.lead ? body.lead : (body as Lead);

  if (!lead?.id || !lead?.company_name) {
    return NextResponse.json({ error: 'Lead id and company_name are required.' }, { status: 400 });
  }

  try {
    const demo = await createDemoForLead(lead, {
      settings,
      quality: demoQuality,
      provider: demoProvider,
      baseUrl
    });

    if (demo.status === 'failed' || !demo.demoUrl) {
      await updateLeadDemoStatus(lead.id, 'demo_failed');
      return NextResponse.json(
        {
          provider: demo.provider || demoProvider,
          status: 'failed',
          error: demo.error || 'v0 failed to build live demo component.'
        },
        { status: 502 }
      );
    }

    await updateLeadDemoStatus(lead.id, 'demo_ready', demo.demoUrl, demo.provider || demoProvider, demo.chatId, demo.versionId, demoQuality, demo.demoArtifact);

    return NextResponse.json({
      ...demo,
      provider: demo.provider || demoProvider,
      status: 'ready'
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'v0 site building failed.';
    await updateLeadDemoStatus(lead.id, 'demo_failed');

    return NextResponse.json(
      {
        provider: demoProvider,
        status: 'failed',
        error: message
      },
      { status: 502 }
    );
  }
}

async function updateLeadDemoStatus(
  leadId: string,
  status: 'demo_ready' | 'demo_failed',
  demoUrl?: string,
  demoProvider?: DemoProvider,
  chatId?: string,
  versionId?: string,
  demoQuality?: DemoQuality,
  demoArtifact?: string
) {
  const supabase = getSupabaseAdmin();
  const isSupabaseLead = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId);

  if (supabase && isSupabaseLead) {
    const updateData: Record<string, unknown> = { status };
    if (demoUrl) updateData.demo_url = demoUrl;
    if (demoProvider) updateData.demo_provider = demoProvider;
    if (chatId) updateData.v0_chat_id = chatId;
    if (versionId) updateData.v0_version_id = versionId;
    if (demoQuality) updateData.demo_quality = demoQuality;
    if (demoArtifact) updateData.demo_prompt = demoArtifact;

    await supabase.from('leads').update(updateData).eq('id', leadId);
  }
}

function getBaseUrl(req: Request) {
  const requestOrigin = new URL(req.url).origin;
  const configured = process.env.APP_BASE_URL;
  if (!configured || configured.includes('localhost')) return requestOrigin;
  return configured;
}
