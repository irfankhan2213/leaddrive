import { NextResponse } from 'next/server';
import { createV0Demo } from '@/lib/v0';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { AppSettings, DemoQuality, Lead } from '@/lib/types';

export async function POST(req: Request) {
  const body = (await req.json()) as
    | Lead
    | { lead?: Lead; leads?: Lead[]; settings?: AppSettings; demoQuality?: DemoQuality; demoMode?: DemoQuality };

  const settings = 'settings' in body ? body.settings : undefined;
  const v0ApiKey = settings?.v0ApiKey || process.env.V0_API_KEY;
  const demoQuality: DemoQuality =
    ('demoQuality' in body && body.demoQuality) ||
    ('demoMode' in body && body.demoMode) ||
    settings?.defaultDemoQuality ||
    'low';
  const v0Model = settings?.v0Model || (demoQuality === 'high' ? 'v0-pro' : 'v0-mini');

  // Batch generation mode
  if ('leads' in body && Array.isArray(body.leads)) {
    const leads = body.leads;
    const results: Array<{ leadId: string; demoUrl?: string; error?: string; status: 'ready' | 'failed' }> = [];

    for (const lead of leads) {
      if (!lead?.id || !lead?.company_name) continue;
      try {
        const demo = await createV0Demo(lead, v0ApiKey, v0Model, demoQuality);
        if (demo.status === 'ready' && demo.demoUrl) {
          await updateLeadDemoStatus(lead.id, 'demo_ready', demo.demoUrl, demo.chatId, demo.versionId, demoQuality);
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
    const demo = await createV0Demo(lead, v0ApiKey, v0Model, demoQuality);

    if (demo.status === 'failed' || !demo.demoUrl) {
      await updateLeadDemoStatus(lead.id, 'demo_failed');
      return NextResponse.json(
        {
          provider: 'v0',
          status: 'failed',
          error: demo.error || 'v0 failed to build live demo component.'
        },
        { status: 502 }
      );
    }

    await updateLeadDemoStatus(lead.id, 'demo_ready', demo.demoUrl, demo.chatId, demo.versionId, demoQuality);

    return NextResponse.json({
      ...demo,
      provider: 'v0',
      status: 'ready'
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'v0 site building failed.';
    await updateLeadDemoStatus(lead.id, 'demo_failed');

    return NextResponse.json(
      {
        provider: 'v0',
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
  chatId?: string,
  versionId?: string,
  demoQuality?: DemoQuality
) {
  const supabase = getSupabaseAdmin();
  const isSupabaseLead = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId);

  if (supabase && isSupabaseLead) {
    const updateData: Record<string, unknown> = { status };
    if (demoUrl) updateData.demo_url = demoUrl;
    if (chatId) updateData.v0_chat_id = chatId;
    if (versionId) updateData.v0_version_id = versionId;
    if (demoQuality) updateData.demo_quality = demoQuality;

    await supabase.from('leads').update(updateData).eq('id', leadId);
  }
}
