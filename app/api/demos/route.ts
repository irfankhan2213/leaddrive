import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/api-auth';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { createDemoForLead, resolveDemoProvider } from '@/lib/demo-engine';
import { getUserSettings } from '@/lib/settings';
import { logError } from '@/lib/http';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { DemoProvider, DemoQuality, Lead } from '@/lib/types';

const MAX_BATCH_DEMOS = 25;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const rl = checkRateLimit(req, 'demos_post', 30, 60_000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

  const settings = await getUserSettings(auth.user.id);
  const demoQuality: DemoQuality = settings.defaultDemoQuality || 'low';
  const demoProvider = resolveDemoProvider();
  const baseUrl = getBaseUrl(req);

  let body: { lead?: Lead; leadIds?: string[] };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // Batch generation mode: ids only — leads are loaded server-side.
  if ('leadIds' in body && Array.isArray(body.leadIds)) {
    const leadIds = body.leadIds.filter((id) => typeof id === 'string' && UUID_RE.test(id));
    if (leadIds.length === 0) {
      return NextResponse.json({ error: 'At least one valid saved leadId is required.' }, { status: 400 });
    }
    if (leadIds.length > MAX_BATCH_DEMOS) {
      return NextResponse.json(
        { error: `Batch size is capped at ${MAX_BATCH_DEMOS} demos per request.` },
        { status: 400 }
      );
    }

    const results: Array<{ leadId: string; demoUrl?: string; error?: string; status: 'ready' | 'failed' }> = [];

    for (const leadId of leadIds.slice(0, MAX_BATCH_DEMOS)) {
      const ownedLead = await loadOwnedLead(auth.supabase, leadId);
      if (!ownedLead) {
        results.push({ leadId, error: 'Lead not found.', status: 'failed' });
        continue;
      }

      try {
        const demo = await createDemoForLead(ownedLead, { settings, quality: demoQuality, provider: demoProvider, baseUrl });
        if (demo.status === 'ready' && demo.demoUrl) {
          await updateLeadDemoStatus(auth.supabase, ownedLead.id, 'demo_ready', demo.demoUrl, demo.provider || demoProvider, demo.chatId, demo.versionId, demoQuality, demo.demoArtifact);
          results.push({ leadId: ownedLead.id, demoUrl: demo.demoUrl, status: 'ready' });
        } else {
          await updateLeadDemoStatus(auth.supabase, ownedLead.id, 'demo_failed');
          results.push({ leadId: ownedLead.id, error: demo.error || 'v0 generation failed', status: 'failed' });
        }
      } catch (err) {
        logError('POST /api/demos:batch', err, { leadId: ownedLead.id });
        await updateLeadDemoStatus(auth.supabase, ownedLead.id, 'demo_failed');
        results.push({ leadId: ownedLead.id, error: err instanceof Error ? err.message : 'Demo generation failed', status: 'failed' });
      }
    }

    return NextResponse.json({ results, count: results.length });
  }

  // Single lead generation mode
  const rawLead = body.lead;
  if (!rawLead?.id) {
    return NextResponse.json({ error: 'A valid leadId is required.' }, { status: 400 });
  }

  // Only DB-owned leads can trigger paid demo builds.
  const lead = await loadOwnedLead(auth.supabase, rawLead.id);
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found. Save the lead first before generating a demo.' }, { status: 404 });
  }

  try {
    const demo = await createDemoForLead(lead, { settings, quality: demoQuality, provider: demoProvider, baseUrl });

    if (demo.status === 'failed' || !demo.demoUrl) {
      await updateLeadDemoStatus(auth.supabase, lead.id, 'demo_failed');
      return NextResponse.json(
        {
          provider: demo.provider || demoProvider,
          status: 'failed',
          error: demo.error || 'v0 failed to build live demo component.'
        },
        { status: 502 }
      );
    }

    await updateLeadDemoStatus(auth.supabase, lead.id, 'demo_ready', demo.demoUrl, demo.provider || demoProvider, demo.chatId, demo.versionId, demoQuality, demo.demoArtifact);

    return NextResponse.json({
      ...demo,
      provider: demo.provider || demoProvider,
      status: 'ready'
    });
  } catch (err) {
    logError('POST /api/demos', err, { leadId: lead.id });
    await updateLeadDemoStatus(auth.supabase, lead.id, 'demo_failed');

    return NextResponse.json(
      {
        provider: demoProvider,
        status: 'failed',
        error: err instanceof Error ? err.message : 'v0 site building failed.'
      },
      { status: 502 }
    );
  }
}

async function loadOwnedLead(supabase: SupabaseClient, leadId: string): Promise<Lead | null> {
  if (!UUID_RE.test(leadId)) return null;
  const { data } = await supabase.from('leads').select('*').eq('id', leadId).maybeSingle();
  return (data as Lead) || null;
}

async function updateLeadDemoStatus(
  supabase: SupabaseClient,
  leadId: string,
  status: 'demo_ready' | 'demo_failed',
  demoUrl?: string,
  demoProvider?: DemoProvider,
  chatId?: string,
  versionId?: string,
  demoQuality?: DemoQuality,
  demoArtifact?: string
) {
  const updateData: Record<string, unknown> = { status };
  if (demoUrl) updateData.demo_url = demoUrl;
  if (demoProvider) updateData.demo_provider = demoProvider;
  if (chatId) updateData.v0_chat_id = chatId;
  if (versionId) updateData.v0_version_id = versionId;
  if (demoQuality) updateData.demo_quality = demoQuality;
  if (demoArtifact) updateData.demo_prompt = demoArtifact;

  await supabase.from('leads').update(updateData).eq('id', leadId);
}

function getBaseUrl(req: Request) {
  const requestOrigin = new URL(req.url).origin;
  const configured = process.env.APP_BASE_URL;
  if (!configured || configured.includes('localhost')) return requestOrigin;
  return configured;
}
